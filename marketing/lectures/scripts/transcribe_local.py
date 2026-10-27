"""Resumable, on-device lecture transcription; leaves source recordings unchanged."""
import argparse
import hashlib
import json
import math
from pathlib import Path
import subprocess
import time


def stamp(seconds, srt=False):
    millis = round(max(0, seconds) * 1000)
    hours, millis = divmod(millis, 3_600_000)
    minutes, millis = divmod(millis, 60_000)
    secs, millis = divmod(millis, 1000)
    return f"{hours:02}:{minutes:02}:{secs:02}" + (f",{millis:03}" if srt else "")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    parser.add_argument("--model", default="mlx-community/whisper-large-v3-turbo")
    parser.add_argument("--chunk-seconds", type=int, default=600)
    parser.add_argument("--wired-limit-mb", type=int, default=0,
                        help="Optional process-only resident GPU memory limit on macOS 15+")
    parser.add_argument("--progress", action="store_true", help="Show progress within each section")
    parser.add_argument("--disable-hallucination-silence-filter", action="store_true",
                        help="Disable the optional silence heuristic if room audio causes repeated reprocessing")
    parser.add_argument("--prefix", default="", help="Session label for a shared day folder")
    args = parser.parse_args()
    if any(character in args.prefix for character in ("/", "\\")):
        parser.error("The prefix must be a filename label, not a path")
    prefix = f"{args.prefix} - " if args.prefix else ""
    import mlx.core as mx
    import mlx_whisper

    # Bound reusable GPU buffers so long recordings do not crowd out other apps.
    mx.set_cache_limit(256 * 1024 * 1024)
    if args.wired_limit_mb:
        mx.set_wired_limit(args.wired_limit_mb * 1024 * 1024)

    source = args.source.resolve(strict=True)
    dest = args.destination.resolve()
    work = dest / "Working files"
    work.mkdir(parents=True, exist_ok=True)
    metadata = json.loads(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration,size",
        "-of", "json", str(source)
    ]))
    duration = float(metadata["format"]["duration"])
    digest = hashlib.file_digest(source.open("rb"), "sha256").hexdigest()
    manifest = {
        "source": str(source), "sha256": digest, "duration_seconds": duration,
        "model": args.model, "processing": "local, on-device",
        "note": "Automatic draft, not a human-verified verbatim record. Speaker identities are not inferred.",
        "chunk_seconds": args.chunk_seconds, "context_overlap_seconds": 3,
        "hallucination_silence_filter_seconds": None if args.disable_hallucination_silence_filter else 2.0,
    }
    manifest_path = work / f"{prefix}source.json"
    if manifest_path.exists():
        previous = json.loads(manifest_path.read_text())
        for field in ("sha256", "model", "chunk_seconds", "hallucination_silence_filter_seconds"):
            if field == "hallucination_silence_filter_seconds" and field not in previous and not list(work.glob(f"{prefix}chunk-*.json")):
                continue
            previous_value = previous.get(field, 2.0) if field == "hallucination_silence_filter_seconds" else previous[field]
            if previous_value != manifest[field]:
                raise ValueError(f"Existing transcript uses a different {field}; choose a new destination")
    manifest_path.write_text(json.dumps(manifest, indent=2))
    segments = []
    total = math.ceil(duration / args.chunk_seconds)
    started = time.monotonic()
    for index in range(total):
        core_start = index * args.chunk_seconds
        core_end = min(duration, core_start + args.chunk_seconds)
        start = max(0, core_start - 3)
        end = min(duration, core_end + 3)
        result_path = work / f"{prefix}chunk-{index + 1:02}.json"
        if result_path.exists():
            result = json.loads(result_path.read_text())
        else:
            audio_path = work / f"{prefix}chunk-{index + 1:02}.wav"
            subprocess.run([
                "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                "-ss", str(start), "-i", str(source), "-t", str(end - start),
                "-vn", "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", str(audio_path)
            ], check=True)
            print(f"TRANSCRIBING {index + 1}/{total}: {stamp(core_start)}-{stamp(core_end)}", flush=True)
            result = mlx_whisper.transcribe(
                str(audio_path), path_or_hf_repo=args.model,
                verbose=False if args.progress else None, language="en", task="transcribe",
                condition_on_previous_text=False, word_timestamps=True,
                hallucination_silence_threshold=manifest["hallucination_silence_filter_seconds"],
            )
            result_path.write_text(json.dumps(result, indent=2, ensure_ascii=False))
            audio_path.unlink()  # Only this generated, successfully transcribed scratch audio.
            mx.clear_cache()
        for segment in result["segments"]:
            if not segment["text"].strip() or segment["end"] <= segment["start"]:
                continue
            adjusted = dict(segment)
            adjusted["start"] = start + segment["start"]
            adjusted["end"] = min(duration, start + segment["end"])
            adjusted["chunk"] = index + 1
            adjusted["id"] = len(segments)
            adjusted["words"] = [dict(w, start=start + w["start"], end=start + w["end"]) for w in segment.get("words", [])]
            if adjusted["words"]:
                adjusted["words"] = [w for w in adjusted["words"] if core_start <= (w["start"] + w["end"]) / 2 < core_end]
                if not adjusted["words"]:
                    continue
                adjusted["start"] = max(core_start, adjusted["words"][0]["start"])
                adjusted["end"] = min(core_end, adjusted["words"][-1]["end"])
                adjusted["text"] = "".join(w["word"] for w in adjusted["words"]).strip()
            elif not core_start <= (adjusted["start"] + adjusted["end"]) / 2 < core_end:
                continue
            if adjusted["end"] <= adjusted["start"]:
                continue
            segments.append(adjusted)
        # Keep useful partial work available throughout a long recording.
        write_outputs(dest, manifest, segments, index + 1, total, prefix)
        print(f"SAVED {index + 1}/{total}; {len(segments)} segments; elapsed {time.monotonic()-started:.0f}s", flush=True)


def write_outputs(dest, manifest, segments, complete, total, prefix=""):
    record = dict(manifest, completed_chunks=complete, total_chunks=total, complete=complete == total, segments=segments)
    (dest / f"{prefix}Transcript.json").write_text(json.dumps(record, ensure_ascii=False, indent=2))
    heading = f"500 LECTURE - TIMESTAMPED AUTOMATIC TRANSCRIPT\nSource: {manifest['source']}\nDuration: {stamp(manifest['duration_seconds'])}\nStatus: {complete}/{total} sections processed\n{manifest['note']}\n\n"
    lines = [f"[{stamp(s['start'])} - {stamp(s['end'])}] {s['text'].strip()}" for s in segments]
    (dest / f"{prefix}Transcript.txt").write_text(heading + "\n".join(lines) + "\n")
    subtitles = [f"{i+1}\n{stamp(s['start'], True)} --> {stamp(s['end'], True)}\n{s['text'].strip()}\n" for i,s in enumerate(segments)]
    (dest / f"{prefix}Transcript.srt").write_text("\n".join(subtitles))


if __name__ == "__main__":
    main()

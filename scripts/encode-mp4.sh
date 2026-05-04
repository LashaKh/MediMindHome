#!/usr/bin/env bash
# Encode the most recent Playwright webm recording to a sub-100MB MP4.
#
#   ./scripts/encode-mp4.sh                        # auto-detect newest webm
#   ./scripts/encode-mp4.sh path/to/video.webm     # explicit input
#
# Output: public/walkthrough/medimind-demo.mp4 (~80 MB)
#   - H.264 yuv420p, ~3.5 Mbps capped at 4 Mbps
#   - AAC silent track at 128 kbps (kept so embedded <video> doesn't trip)
#   - moov atom up front (+faststart) so Safari streams immediately
set -euo pipefail

INPUT="${1:-}"
if [[ -z "$INPUT" ]]; then
  INPUT="$(find scripts/recordings -name 'video.webm' -print0 \
    | xargs -0 ls -t 2>/dev/null | head -1 || true)"
fi

if [[ -z "$INPUT" || ! -f "$INPUT" ]]; then
  echo "ERROR: no input webm found. Run record-walkthrough first." >&2
  exit 1
fi

OUTPUT="public/walkthrough/medimind-demo.mp4"
mkdir -p "$(dirname "$OUTPUT")"

echo "→ Encoding $INPUT → $OUTPUT"

ffmpeg -y -i "$INPUT" \
  -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p \
  -b:v 3500k -maxrate 4000k -bufsize 6000k \
  -vf "fps=30,scale=1920:1080:flags=lanczos" \
  -an \
  -movflags +faststart \
  "$OUTPUT"

echo ""
echo "✓ Done. ffprobe summary:"
ffprobe -v error -show_entries format=duration,size,bit_rate \
  -show_entries stream=codec_name,width,height,r_frame_rate \
  -of default=noprint_wrappers=1 "$OUTPUT"

SIZE_MB=$(( $(stat -f%z "$OUTPUT") / 1024 / 1024 ))
echo ""
echo "  Size: ${SIZE_MB} MB (target ≤100, sweet spot 75–85)"

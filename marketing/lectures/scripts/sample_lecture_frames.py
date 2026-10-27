"""Sample a local lecture for slide review, without changing the recording."""
import argparse
from pathlib import Path
import subprocess

parser = argparse.ArgumentParser()
parser.add_argument('source', type=Path)
parser.add_argument('destination', type=Path)
parser.add_argument('--interval', type=int, default=60)
args = parser.parse_args()
assert args.interval > 0
duration = float(subprocess.check_output([
    'ffprobe', '-v', 'error', '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1', str(args.source)], text=True))
args.destination.mkdir(parents=True, exist_ok=True)
for seconds in range(0, int(duration), args.interval):
    output = args.destination / f'second-{seconds:05}.jpg'
    if not output.exists():
        subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(seconds), '-i', str(args.source),
                        '-frames:v', '1', '-vf', 'scale=1600:-1', '-q:v', '3', str(output)], check=True)
print(f'{args.source.name}: {len(list(args.destination.glob("second-*.jpg")))} frames', flush=True)

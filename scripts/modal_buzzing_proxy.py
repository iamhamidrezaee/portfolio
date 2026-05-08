import json
import os
import subprocess

import modal


APP_NAME = "portfolio-buzzing-web-proxy"
MOUNT_PATH = "/zeus-data"
SOURCE_REL = "exhibition_render/runs/exhibit_20260424_144158/final/exhibition_cut_4k60.mp4"
VIDEO_REL = "portfolio_web/buzzing-web.mp4"
POSTER_REL = "portfolio_web/buzzing-poster.jpg"

app = modal.App(APP_NAME)
volume = modal.Volume.from_name("zeus-data")
image = modal.Image.debian_slim(python_version="3.11").apt_install("ffmpeg")


def _path(relative_path):
  return os.path.join(MOUNT_PATH, relative_path)


@app.function(image=image, volumes={MOUNT_PATH: volume}, timeout=900)
def probe_master():
  source = _path(SOURCE_REL)
  result = subprocess.run(
    [
      "ffprobe",
      "-v",
      "error",
      "-show_entries",
      "format=duration,size:stream=codec_name,width,height,r_frame_rate",
      "-of",
      "json",
      source,
    ],
    check=True,
    capture_output=True,
    text=True,
  )
  return json.loads(result.stdout)


@app.function(image=image, volumes={MOUNT_PATH: volume}, timeout=3600, cpu=4)
def transcode_proxy():
  source = _path(SOURCE_REL)
  video_out = _path(VIDEO_REL)
  poster_out = _path(POSTER_REL)
  os.makedirs(os.path.dirname(video_out), exist_ok=True)

  subprocess.run(
    [
      "ffmpeg",
      "-y",
      "-i",
      source,
      "-vf",
      "scale=-2:720,fps=30",
      "-map",
      "0:v:0",
      "-map",
      "0:a?",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "32",
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "aac",
      "-b:a",
      "96k",
      "-movflags",
      "+faststart",
      video_out,
    ],
    check=True,
  )

  subprocess.run(
    [
      "ffmpeg",
      "-y",
      "-ss",
      "1",
      "-i",
      source,
      "-frames:v",
      "1",
      "-vf",
      "scale=-2:900",
      poster_out,
    ],
    check=True,
  )

  volume.commit()
  return {
    "video": VIDEO_REL,
    "video_bytes": os.path.getsize(video_out),
    "poster": POSTER_REL,
    "poster_bytes": os.path.getsize(poster_out),
  }


@app.local_entrypoint()
def main(action: str = "probe"):
  if action == "probe":
    print(json.dumps(probe_master.remote(), indent=2))
  elif action == "transcode":
    print(json.dumps(transcode_proxy.remote(), indent=2))
  else:
    raise ValueError(f"Unknown action: {action}")

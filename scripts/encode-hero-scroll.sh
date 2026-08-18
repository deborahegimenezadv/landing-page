#!/usr/bin/env bash

set -euo pipefail

ffmpeg -i public/hero.mp4 \
  -an \
  -vf "scale=1920:-2:flags=lanczos,fps=24" \
  -c:v libx264 \
  -preset slow \
  -crf 20 \
  -profile:v high \
  -pix_fmt yuv420p \
  -g 6 \
  -keyint_min 6 \
  -sc_threshold 0 \
  -movflags +faststart \
  public/hero-scroll.mp4

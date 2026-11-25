#!/bin/bash
# 포털 매뉴얼 전체 재생성: 캡처 → WebP → HTML → PDF → 좁은 화면 점검   usage: bash build.sh <repoDir> <rawDir>
set -e; REPO="$(cd "$1" && pwd)"; RAW="$2"; mkdir -p "$RAW"; RAW="$(cd "$RAW" && pwd)"; cd "$(dirname "$0")"; M="$REPO/manual"; mkdir -p "$M/images"
node capture_portal.js "$REPO" "$RAW" > "$RAW/_log.json"
python3 - "$RAW" "$M" <<'PY'
import sys,glob,os,shutil
from PIL import Image
raw,M=sys.argv[1],sys.argv[2]
for f in sorted(glob.glob(raw+'/s*.png')):
    Image.open(f).convert('RGB').save(M+'/images/'+os.path.basename(f)[:-4]+'.webp',quality=82,method=6)
shutil.copy(raw+'/_marks.json',M+'/images/_marks.json')
PY
MANUAL_DIR="$M" python3 gen_manual_portal.py
# PDF 이름 · 꼬리말 판은 index 의 MANMIN-Ver-x.y 를 따른다(2026-11-25)
V=$(grep -o "MANMIN-Ver-[0-9.]*[0-9]" "$REPO/index.html" | head -1 | sed "s/MANMIN-//")
node pdf_portal.js "$M" "소방펌프통합포털_사용자매뉴얼_${V}.pdf" "소방 펌프 계산서 통합 포털 사용자 매뉴얼 ${V}"
node audit_responsive.js "$M/index.html" > "$RAW/_audit.json"

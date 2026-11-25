# 소방 펌프 통합 포털 v5.2.15 표기 점검(2026-11-25 · 도구 10종) — usage: python3 -I verify_portal.py ../../index.html
import sys,re
s=open(sys.argv[1],encoding='utf-8').read(); T=[]
ck=lambda n,c:T.append(('✓' if c else '✗',n))
BAD=['50 Pa','0.5~1.0','0.5 또는 1.0','MAX 선정','Max 선정','최대값으로 펌프 선정','§2.1.1.4','§2.3.3','제5조③','§2.3)','Ver-5.0','세그먼트','7종 계산서','650 ℓ/min','「📄 계산서」','「📱 모바일」','29층 이하','KS D3595','구경별 0.40','Q: 유량(ℓ/min)','Ver-5.1','KEC / NFTC','2026-10-16','옥상수조는 옥내소화전']
for b in BAD: ck(f'금지 표기 없음 — 「{b}」',b not in s)
NEED=['공고 제2026-34호','공고 제2026-35호','공고 제2024-58호','공고 제2026-9호','고시 제2025-28호','공고 제2024-52호','NFPC 102 제12조','103 2.13','NFTC 103A 2.10','항상 합산','옥내 ÷ 3','Q(m³/s)','「+ 구간 추가」','「④ 계산서 출력」','MANMIN-Ver-5.2','근거 조문 대조 2026-11-25','NFPC 2026.3.1 시행','유효수량 ÷ 3','관할 소방서 협의','2)가) 또는 6)과 8)','KDS / NFPC','시행령 별표 4','도구 종류(펌프 7 · 기타 3)','전체 보기 <span class="tab-count">10</span>','기타 설비 <span class="tab-count">3</span>']
for n in NEED: ck(f'필수 표기 — 「{n}」',n in s)
body=re.sub(r'<script.*?</script>','',re.sub(r'<style.*?</style>','',s,flags=re.S),flags=re.S)
# 중첩 a 금지
depth=0;nest=0
for m in re.finditer(r'<(/?)a\b',body):
    if m.group(1): depth-=1
    else:
        depth+=1; nest+= depth>1
ck('카드 링크 안 중첩 <a> 0개',nest==0)
for tag in ['div','span','a','table','tr']:
    o=len(re.findall(r'<'+tag+r'\b',body)); c=len(re.findall(r'</'+tag+r'>',body)); ck(f'태그 균형 <{tag}> {o}/{c}',o==c)
links=sorted(set(re.findall(r'(?<!-)href="(\.\./[^"/]+/)"',s))); man=sorted(set(re.findall(r'data-href="([^"]+)"',s)))
ck(f'계산서 링크 7종 {len(links)}개',len(links)==7)
ck(f'매뉴얼 링크 펌프 7 + 기타 3 + 포털 1 = {len(man)}개',len(man)==11 and all(m.endswith('/manual/') for m in man))
ext=sorted(set(re.findall(r'class="calc-card[^"]*" href="(https://manminkim-eng\.github\.io/[^"]+/)"',s)))
ck(f'기타 설비 외부 도구 3종 {len(ext)}개',len(ext)==3)
for t in T: print(*t)
print(sum(1 for t in T if t[0]=='✓'),'/',len(T))

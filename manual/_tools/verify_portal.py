# 소방 펌프 통합 포털 v5.2.0 표기 점검 — usage: python3 -I verify_portal.py ../../index.html
import sys,re
s=open(sys.argv[1],encoding='utf-8').read(); T=[]
ck=lambda n,c:T.append(('✓' if c else '✗',n))
BAD=['50 Pa','0.5~1.0','0.5 또는 1.0','MAX 선정','Max 선정','최대값으로 펌프 선정','§2.1.1.4','§2.3.3','제5조③','§2.3)','Ver-5.0','세그먼트','7종 계산서','650 ℓ/min','「📄 계산서」','「📱 모바일」','29층 이하','KS D3595','구경별 0.40','Q: 유량(ℓ/min)']
for b in BAD: ck(f'금지 표기 없음 — 「{b}」',b not in s)
NEED=['공고 제2026-34호','공고 제2026-35호','공고 제2024-58호','공고 제2026-9호','고시 제2025-28호','공고 제2024-52호','NFPC 102 제12조','103 2.13','NFTC 103A 2.10','항상 합산','옥내 ÷ 3','Q(m³/s)','「+ 구간 추가」','「④ 계산서 출력」','MANMIN-Ver-5.2']
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
ck(f'매뉴얼 링크 7 + 포털 1 = {len(man)}개',len(man)==8 and all(m.endswith('/manual/') for m in man))
for t in T: print(*t)
print(sum(1 for t in T if t[0]=='✓'),'/',len(T))

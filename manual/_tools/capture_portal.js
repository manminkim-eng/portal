// 소방 펌프 계산서 통합 포털 매뉴얼 화면 캡처 — usage: node capture_portal.js <repoDir> <outDir>
// 규격: 1440×900 · DSF 1.25 (영상용 좁은 화면: MM_VW=720 MM_VH=1280 MM_DSF=2) · serviceWorkers block · _marks.json
const {chromium}=require(process.env.MM_PW||'playwright');const fs=require('fs');const path=require('path');const {setup,server}=require('./serve');
const repo=path.resolve(process.argv[2]),out=path.resolve(process.argv[3]);fs.mkdirSync(out,{recursive:true});
const VW=+(process.env.MM_VW||1440),VH=+(process.env.MM_VH||900),DSF=+(process.env.MM_DSF||1.25),PORT=8951;
const HIDE='#pwa-wrap,#pwa-fab,#sw-update-banner{display:none!important} .calc-card,.law-card,.stat-box,.tab-btn{animation:none!important;opacity:1!important;transform:none!important}';
const HELP=`window.__vis=e=>e&&e.getClientRects().length>0;
window.__find=sel=>{if(sel.startsWith('nth:')){const [q,i]=sel.slice(4).split('|');return [...document.querySelectorAll(q)].filter(__vis)[+i]||null;}
 if(sel.startsWith('card:')){const t=sel.slice(5);return [...document.querySelectorAll('.calc-card')].find(c=>c.textContent.includes(t)&&__vis(c))||null;}
 if(sel.startsWith('row:')){const t=sel.slice(4);return [...document.querySelectorAll('.cmp-table tr, table tr')].find(r=>r.textContent.includes(t)&&__vis(r))||null;}
 for(const s of sel.split(',')){const e=[...document.querySelectorAll(s)].find(__vis);if(e)return e;}return null;};
window.__tab=t=>{document.querySelector('.tab-btn[data-tab="'+t+'"]').click();};
window.__fml=t=>{document.getElementById('fml-overlay').classList.remove('hidden');switchFml(document.querySelector('.fml-tab[data-tab="'+t+'"]'));};
window.__fmlClose=()=>closeFml();`;
const SHOTS=[
 {id:'s01_overview',pre:"__tab('all');window.scrollTo(0,0)",clip:'viewport',m:[['.header-pill','기준 · 원문 대조'],['.header-tagline','포털 이름'],['nth:.card-man|0','📘 포털 사용자 매뉴얼'],['.stats-bar','요약 5칸'],['.tab-wrap','필터 탭 4개']]},
 {id:'s02_header',clip:'.header',m:[['.header-pill','NFPC · NFTC 원문 대조 · 시행일'],['.header-logo-wrap','ENGINEER KIM MANMIN'],['.header-desc','포털 설명'],['nth:.card-man|0','📘 포털 사용자 매뉴얼']]},
 {id:'s03_filter',clip:'.tab-wrap',m:[['nth:.tab-btn|0','전체 보기 9'],['nth:.tab-btn|1','단독 설비 4'],['nth:.tab-btn|2','겸용 설비 3'],['nth:.tab-btn|3','기타 설비 2']]},
 {id:'s04_single',clip:'#group-single',m:[['card:옥내소화전','옥내소화전 — NFTC 102'],['card:옥외소화전','옥외소화전 — NFTC 109'],['card:Fire Sprinkler','스프링클러 — NFTC 103'],['card:간이스프링클러','간이스프링클러 — NFTC 103A'],['nth:#group-single .card-man|0','📘 매뉴얼(계산서별)']]},
 {id:'s05_combo',clip:'#group-combo',m:[['card:Indoor + Sprinkler','옥내 + 스프 — 102 · 103'],['card:Simple SP','간이 + 옥내 — 103A · 102'],['card:Indoor + Outdoor','옥내 + 옥외 — 102 · 109']]},
 {id:'s06_extra',clip:'#group-extra',m:[['card:Smoke','제연설비 — NFTC 501(외부 도구)'],['card:Generator','비상발전기(외부 도구)']]},
 {id:'s07_compare',clip:'nth:table|0',m:[['row:간이스프링클러','간이 — 2 · 5개 · 1.0 · 5.0 m³'],['row:옥내+옥외','겸용 — 항상 합산 + 옥상 옥내 ÷ 3']]},
 {id:'s08_law',clip:'.law-grid',m:[['nth:.law-card|0','NFTC 102 — 공고 제2026-34호'],['nth:.law-card|1','NFTC 109 — 공고 제2026-9호'],['nth:.law-card|2','NFTC 103 — 공고 제2026-35호'],['nth:.law-card|3','NFTC 103A — 공고 제2024-58호']]},
 {id:'s09_formula',clip:'.formula-box',m:[['nth:.formula-item|0','H-W — Q(m³/s)'],['nth:.formula-item|1','전양정 — F₀ · × 1.1'],['nth:.formula-item|2','전동기 — K · η 입력']]},
 {id:'s10_combo_tab',pre:"__tab('combo');window.scrollTo(0,0)",wait:700,clip:'viewport',post:"__tab('all')",m:[['nth:.tab-btn|2','겸용 설비만 보기'],['#group-combo','겸용 카드 3장']]},
 {id:'s11_fml_howto',pre:"__fml('howto')",wait:600,fixed:true,clip:'.fml-box',m:[]},
 {id:'s12_fml_hyd',pre:"__fml('hydrant')",wait:500,fixed:true,clip:'.fml-box',m:[]},
 {id:'s13_fml_easy',pre:"__fml('easy')",wait:500,fixed:true,clip:'.fml-box',m:[]},
 {id:'s14_fml_combo',pre:"__fml('combo')",wait:500,fixed:true,clip:'.fml-box',post:"__fmlClose()",m:[]},
];
(async()=>{
 const s=await server(repo,PORT);const b=await chromium.launch();
 const ctx=await b.newContext({viewport:{width:VW,height:VH},deviceScaleFactor:DSF,serviceWorkers:'block',locale:'ko-KR'});await setup(ctx);
 const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
 await pg.goto(`http://127.0.0.1:${PORT}/index.html`);await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(1800);
 await pg.addStyleTag({content:HIDE});await pg.evaluate(HELP);await pg.waitForTimeout(400);
 const meta={};
 for(const S of SHOTS){
  if(S.pre){try{await pg.evaluate(S.pre);}catch(e){errs.push(S.id+' pre '+e.message);}}
  await pg.waitForTimeout(S.wait||600);
  if(S.clip!=='viewport'&&!S.fixed){await pg.evaluate(c=>{const e=__find(c);if(e){window.scrollTo(0,e.getBoundingClientRect().top+scrollY-40);}},S.clip);await pg.waitForTimeout(500);}
  const info=await pg.evaluate(({S,VW,VH})=>{
   const abs=e=>{const r=e.getBoundingClientRect();return {x:r.left+scrollX,y:r.top+scrollY,w:r.width,h:r.height};};
   let clip;
   if(S.clip==='viewport'){clip={x:0,y:scrollY,width:VW,height:VH};}
   else{const el=__find(S.clip);if(!el)return {err:'clip '+S.clip};const a=abs(el);const P=12;clip={x:Math.max(0,a.x-P),y:Math.max(0,a.y-P),width:a.w+2*P,height:a.h+2*P};}
   const marks=[];(S.m||[]).forEach(([sel,label],i)=>{const e=__find(sel);if(!e){marks.push({n:i+1,label,miss:sel});return;}const a=abs(e);
     marks.push({n:i+1,label,x:+((a.x-clip.x)/clip.width*100).toFixed(2),y:+((a.y-clip.y)/clip.height*100).toFixed(2),w:+(Math.min(a.w,clip.x+clip.width-a.x)/clip.width*100).toFixed(2),h:+(Math.min(a.h,clip.y+clip.height-a.y)/clip.height*100).toFixed(2)});});
   return {clip,marks};},{S,VW,VH});
  if(info.err){errs.push(S.id+' '+info.err);continue;}
  const c=info.clip;const cl={x:Math.max(0,c.x),y:Math.max(0,c.y),width:Math.min(c.width,VW-Math.max(0,c.x)),height:c.height};
  if(S.clip==='viewport'){await pg.screenshot({path:path.join(out,S.id+'.png'),clip:{x:0,y:0,width:VW,height:VH}});}
  else if(S.fixed){const sx=await pg.evaluate(()=>scrollX),sy=await pg.evaluate(()=>scrollY);await pg.screenshot({path:path.join(out,S.id+'.png'),clip:{x:Math.max(0,c.x-sx),y:Math.max(0,c.y-sy),width:Math.min(c.width,VW),height:Math.min(c.height,VH-Math.max(0,c.y-sy))}});}
  else{await pg.screenshot({path:path.join(out,S.id+'.png'),clip:cl,fullPage:true});}
  meta[S.id]={w:Math.round(cl.width),h:Math.round(Math.min(cl.height,S.fixed?VH:1e9)),marks:info.marks};
  if(S.post){try{await pg.evaluate(S.post);}catch(e){errs.push(S.id+' post '+e.message);}await pg.waitForTimeout(400);}
 }
 const mctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,serviceWorkers:'block',isMobile:true,hasTouch:true,locale:'ko-KR'});await setup(mctx);
 const mp=await mctx.newPage();await mp.goto(`http://127.0.0.1:${PORT}/index.html`);await mp.waitForTimeout(1800);await mp.addStyleTag({content:HIDE});await mp.evaluate(HELP);
 await mp.screenshot({path:path.join(out,'s15_mobile_top.png')});meta['s15_mobile_top']={w:390,h:844,marks:[]};
 await mp.evaluate(()=>{const e=document.getElementById('group-combo');window.scrollTo(0,e.getBoundingClientRect().top+scrollY-12);});await mp.waitForTimeout(600);
 await mp.screenshot({path:path.join(out,'s16_mobile_combo.png')});meta['s16_mobile_combo']={w:390,h:844,marks:[]};
 await mp.evaluate(()=>{const e=document.querySelector('table');window.scrollTo(0,e.getBoundingClientRect().top+scrollY-12);});await mp.waitForTimeout(600);
 await mp.screenshot({path:path.join(out,'s17_mobile_table.png')});meta['s17_mobile_table']={w:390,h:844,marks:[]};
 const mob=await mp.evaluate(()=>({page:document.documentElement.scrollWidth,vw:innerWidth}));
 fs.writeFileSync(path.join(out,'_marks.json'),JSON.stringify(meta,null,1));
 const miss=[];Object.entries(meta).forEach(([k,v])=>v.marks.forEach(m=>{if(m.miss)miss.push(k+':'+m.miss);else if(m.x<0||m.y<0||m.x+m.w>100.5||m.y+m.h>100.5||m.w<=0||m.h<=0)miss.push(k+':OUT '+m.label+' '+m.x+','+m.y+','+m.w+','+m.h);}));
 console.log(JSON.stringify({mobile:mob,sizes:Object.fromEntries(Object.entries(meta).map(([k,v])=>[k,v.w+'x'+v.h])),miss,errs:errs.slice(0,15)},null,1));
 await b.close();s.close();
})();

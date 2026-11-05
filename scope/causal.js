// Isometric reward groups: conceptual heights, never presented as measured data.
const root=document.querySelector('.causal-lab'),canvas=document.querySelector('#causal-canvas'),ctx=canvas.getContext('2d');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let progress=0,playing=!reduced.matches&&!document.body.classList.contains('effects-off'),visible=false,frame=0,last=0,w=0,h=0,language=document.documentElement.lang==='zh-CN'?'zh':'en';
const blend=(a,b,t)=>a+(b-a)*t;
const mix=(a,b,t)=>a.map((x,i)=>Math.round(blend(x,b[i],t)));
const color=(rgb)=>`rgb(${rgb.join(',')})`;
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const phases=[
 ['01 / 0–40','Formatting shortcut','A wrapper-to-refusal association raises reward before intent is reliably understood.','格式 shortcut','模型先学会模板与拒答的关联, 奖励上升, 但对意图的判断仍不可靠.'],
 ['02 / 40–100','Lexical shortcut','Sensitive words increasingly trigger refusals. Rewards approach saturation as benign requests are also rejected.','词汇 shortcut','敏感词逐渐触发拒答. 奖励接近饱和, 良性请求也更容易被误拒.'],
 ['03 / 100+','Gradient starvation','When group rewards become nearly equal, relative advantages vanish and the policy-gradient signal weakens.','梯度饥饿','当组内奖励几乎相同, 相对优势趋于零, 策略梯度信号随之减弱.']
];
function resize(){w=canvas.clientWidth;h=canvas.clientHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
function draw(){
  if(!w||!h)return;ctx.clearRect(0,0,w,h);
  const scale=Math.min(w/600,h/480),cx=w*.49,cy=h*.72;
  const project=(x,z,y=0)=>[cx+(x-z)*.75*scale,cy+(x+z)*.32*scale-y*scale];
  const path=(points,fill,stroke)=>{ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.7;ctx.stroke();}};
  // Core intent is the stable path; the two dashed shortcut paths change emphasis.
  const cnGraph=language==='zh', graphScale=Math.min(1,w/480), gy=50;
  const nodes=[{x:w*.12,y:gy+34,text:cnGraph?'真实意图':'Intent',color:'#85b4ff'}, {x:w*.47,y:gy-19,text:cnGraph?'格式模板':'Template',color:'#b6a1e9'}, {x:w*.47,y:gy+53,text:cnGraph?'敏感词汇':'Keywords',color:'#efae77'}, {x:w*.85,y:gy+34,text:cnGraph?'安全拒答':'Refusal',color:'#86d6bd'}];
  const edge=(from,to,strength,dashed)=>{ctx.beginPath();ctx.moveTo(from.x+30*graphScale,from.y);ctx.lineTo(to.x-32*graphScale,to.y);ctx.strokeStyle=from.color;ctx.globalAlpha=.3+strength*.7;ctx.lineWidth=1+strength*2;ctx.setLineDash(dashed?[4,4]:[]);ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;};
  edge(nodes[0],nodes[3],.45,false);edge(nodes[0],nodes[1],.35,true);edge(nodes[0],nodes[2],.35,true);edge(nodes[1],nodes[3],1-smooth(progress*2),true);edge(nodes[2],nodes[3],smooth((progress-.15)*2),true);
  nodes.forEach(n=>{ctx.fillStyle='#182740';ctx.strokeStyle=n.color;ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(n.x-33*graphScale,n.y-13,66*graphScale,26,7);ctx.fill();ctx.stroke();ctx.fillStyle=n.color;ctx.font=`500 ${Math.max(8,10*graphScale)}px -apple-system,sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(n.text,n.x,n.y);});
  const plane=[[-145,-100],[145,-100],[145,130],[-145,130]].map(([x,z])=>project(x,z));path(plane,'#17263d','#3c5477');
  for(let x=-145;x<=145;x+=36){ctx.beginPath();ctx.moveTo(...project(x,-100));ctx.lineTo(...project(x,130));ctx.strokeStyle='#2c4365';ctx.stroke();}
  for(let z=-100;z<=130;z+=38){ctx.beginPath();ctx.moveTo(...project(-145,z));ctx.lineTo(...project(145,z));ctx.stroke();}
  const saturation=smooth((progress-.12)/.85),flat=smooth((progress-.35)/.65),size=24;
  const rgb=mix([76,135,235],[225,141,84],smooth(progress*1.7));
  for(let row=0;row<3;row++)for(let i=0;i<6;i++){
    const x=-115+i*43,z=-64+row*57;
    const varied=[36,91,55,116,68,103][(i+row*2)%6];
    const height=blend(varied,142,saturation)+Math.sin(i*2.7+row)*15*(1-flat);
    const a=project(x,z),b=project(x+size,z),c=project(x+size,z+size),d=project(x,z+size),at=project(x,z,height),bt=project(x+size,z,height),ct=project(x+size,z+size,height),dt=project(x,z+size,height);
    const alpha=.78+row*.06;ctx.globalAlpha=alpha;
    path([b,c,ct,bt],color(rgb.map(v=>Math.max(0,v-28))),'#ffffff88');path([a,b,bt,at],color(rgb),'#ffffff66');path([at,bt,ct,dt],color(rgb.map(v=>Math.min(255,v+39))),'#ffffffaa');
  }
  ctx.globalAlpha=1;
  // A descending ribbon makes the loss of useful variation visible as depth.
  const signal=Math.max(.025,1-smooth(progress));
  const origin=project(-145,171),end=project(145,171);
  ctx.strokeStyle='#375373';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(...origin);ctx.lineTo(...end);ctx.stroke();
  const pts=[];for(let i=0;i<=60;i++){const f=i/60;pts.push(project(-145+290*f,171,12+Math.sin(f*Math.PI*6)*signal*24));}
  ctx.strokeStyle='#79d0b5';ctx.lineWidth=2;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.stroke();
  const p=phases[Math.min(2,Math.floor(progress*3))],cn=language==='zh';
  root.querySelector('.causal-step').textContent=p[0];root.querySelector('.causal-phase').textContent=p[cn?3:1];root.querySelector('.causal-detail').textContent=p[cn?4:2];
  root.querySelector('.causal-signal strong').textContent=progress>.8?(cn?'衰减':'Fading'):(cn?'活跃':'Active');
  root.classList.toggle('is-saturated',progress>.75);
}
function tick(now){frame=0;if(!visible||!playing||document.hidden||document.body.classList.contains('effects-off'))return;const dt=last?Math.min(50,now-last):0;last=now;progress+=dt/16000;if(progress>1.12)progress=0;draw();frame=requestAnimationFrame(tick);}
function schedule(){cancelAnimationFrame(frame);frame=0;last=0;if(visible&&playing&&!document.hidden&&!document.body.classList.contains('effects-off'))frame=requestAnimationFrame(tick);draw();}
new IntersectionObserver(([e])=>{visible=e.isIntersecting;schedule();},{threshold:.1}).observe(root);
new ResizeObserver(resize).observe(canvas);
document.addEventListener('visibilitychange',schedule);document.addEventListener('scope:languagechange',e=>{language=e.detail.language;draw();});document.addEventListener('scope:effectschange',e=>{playing=e.detail.enabled&&!reduced.matches;schedule();});reduced.addEventListener('change',e=>{playing=!e.matches&&!document.body.classList.contains('effects-off');schedule();});resize();

// Qualitative mechanism animation; these curves are not measured training data.
const root=document.querySelector('.causal-lab'),canvas=document.querySelector('#causal-canvas'),ctx=canvas.getContext('2d');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let progress=0,visible=false,frame=0,last=0,w=0,h=0,phaseShown=-1,language=document.documentElement.lang==='zh-CN'?'zh':'en';
const palette={format:'#6b9ff5',lexical:'#efa76e',signal:'#7bd8bd',muted:'#9aafcb'};
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const motion=()=>!reduced.matches&&!document.body.classList.contains('effects-off');
const phases=[
 {step:'01 / 0–40',title:['Formatting shortcut','格式 shortcut'],detail:['Reward rises as the model learns to associate a wrapper with refusal, before reliably judging intent.','模型先学会模板与拒答的关联。奖励上升，但对真实意图的判断仍不可靠。'],focus:['Learning: template → refusal','重点学习：格式模板 → 拒答'],color:palette.format},
 {step:'02 / 40–100',title:['Lexical shortcut','词汇 shortcut'],detail:['The template gap narrows, but sensitive words increasingly trigger refusals, including on benign requests.','模板差距缩小，但敏感词越来越容易触发拒答，良性请求也会被误拒。'],focus:['Learning: sensitive words → refusal','重点学习：敏感词汇 → 拒答'],color:palette.lexical},
 {step:'03 / 100+',title:['Gradient starvation','梯度饥饿'],detail:['Saturated, nearly equal group rewards leave little relative advantage. The useful policy-gradient signal fades.','奖励饱和，组内奖励趋于一致。相对优势减小，能够继续改进行为的策略梯度信号逐渐衰减。'],focus:['Reward saturation → little learning signal','奖励饱和 → 持续学习信号减弱'],color:palette.signal}
];
if(!motion())progress=1;
function resize(){w=canvas.clientWidth;h=canvas.clientHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
function draw(){
 if(!w||!h)return;
 ctx.clearRect(0,0,w,h);
 const p=Math.min(progress,1),phase=Math.min(2,Math.floor(p*3)),cn=language==='zh',compact=w<420,fs=compact?11:13;
 const current=phases[phase],half=compact?34:43;
 const nodes=[{x:half+2,y:83,label:cn?'真实意图':'Intent',color:palette.muted}, {x:w*.49,y:31,label:cn?'格式模板':'Template',color:palette.format}, {x:w*.49,y:135,label:cn?'敏感词汇':'Keywords',color:palette.lexical}, {x:w-half-2,y:83,label:cn?'安全拒答':'Refusal',color:palette.signal}];
 function edge(a,b,color,active,offset=0){
  const x1=a.x+half,y1=a.y,x2=b.x-half,y2=b.y;
  ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle=color;ctx.globalAlpha=active?1:.2;ctx.lineWidth=active?2.5:1.2;ctx.setLineDash(active?[6,5]:[3,6]);ctx.lineDashOffset=motion()?-progress*750:0;ctx.stroke();ctx.setLineDash([]);ctx.lineDashOffset=0;
  const angle=Math.atan2(y2-y1,x2-x1);ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-7*Math.cos(angle-.45),y2-7*Math.sin(angle-.45));ctx.lineTo(x2-7*Math.cos(angle+.45),y2-7*Math.sin(angle+.45));ctx.closePath();ctx.fillStyle=color;ctx.fill();ctx.globalAlpha=1;
  if(active&&motion())for(let i=0;i<3;i++){
   const t=(progress*15+i/3+offset)%1,x=x1+(x2-x1)*t,y=y1+(y2-y1)*t;
   ctx.shadowBlur=10;ctx.shadowColor=color;ctx.fillStyle='#f6faff';ctx.beginPath();ctx.arc(x,y,2.5,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  }
 }
 // Only the shortcut currently being acquired carries bright moving packets.
 edge(nodes[0],nodes[3],palette.muted,false);
 edge(nodes[0],nodes[1],palette.format,phase===0);edge(nodes[1],nodes[3],palette.format,phase===0,.5);
 edge(nodes[0],nodes[2],palette.lexical,phase===1);edge(nodes[2],nodes[3],palette.lexical,phase===1,.5);
 nodes.forEach((n,i)=>{
  const active=i===phase+1&&phase<2||i===3;
  ctx.fillStyle=active?'#1e3552':'#142238';ctx.strokeStyle=active?n.color:'#3a4d67';ctx.lineWidth=active?1.7:1;
  ctx.beginPath();ctx.roundRect(n.x-half,n.y-17,half*2,34,9);ctx.fill();ctx.stroke();ctx.fillStyle=active?'#f0f5ff':n.color;ctx.font=`600 ${fs}px -apple-system,sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(n.label,n.x,n.y);
 });
 // Three schematic trends, progressively revealed, with a moving time cursor.
 const left=compact?23:30,right=w-12,top=210,bottom=h-39,pw=right-left,ph=bottom-top;
 const X=t=>left+t*pw,Y=v=>bottom-v*ph;
 ctx.fillStyle='#a9bcd7';ctx.font=`${compact?10:11}px -apple-system,sans-serif`;ctx.textAlign='left';ctx.fillText(cn?'相对趋势 · 机制示意':'Relative trends · schematic',left,top-20);
 ctx.fillStyle=current.color+'0d';ctx.fillRect(X(phase/3),top,pw/3,ph);
 for(let i=0;i<=4;i++){ctx.beginPath();ctx.moveTo(left,top+ph*i/4);ctx.lineTo(right,top+ph*i/4);ctx.strokeStyle='#32445e';ctx.lineWidth=.7;ctx.stroke();}
 for(let i=1;i<3;i++){ctx.beginPath();ctx.moveTo(X(i/3),top);ctx.lineTo(X(i/3),bottom);ctx.setLineDash([3,5]);ctx.stroke();ctx.setLineDash([]);}
 const trends=[
  {color:palette.format,fn:t=>.12+.76*smooth(t*3)-.55*smooth((t-.32)*2.9)},
  {color:palette.lexical,fn:t=>.09+.8*smooth((t-.23)*2.1)},
  {color:palette.signal,fn:t=>.83-.78*smooth((t-.12)/.85)}
 ];
 trends.forEach((series,index)=>{
  // Keep the full trend legible on entry; the bright trace shows current progress.
  ctx.beginPath();for(let i=0;i<=180;i++){const t=i/180;i?ctx.lineTo(X(t),Y(series.fn(t))):ctx.moveTo(X(t),Y(series.fn(t)));}
  ctx.strokeStyle=series.color;ctx.lineWidth=1.4;ctx.globalAlpha=.24;ctx.setLineDash(index===2?[6,4]:[]);ctx.stroke();ctx.globalAlpha=1;
  ctx.beginPath();const count=Math.max(1,Math.ceil(p*180));for(let i=0;i<=count;i++){const t=p*i/count;i?ctx.lineTo(X(t),Y(series.fn(t))):ctx.moveTo(X(t),Y(series.fn(t)));}
  ctx.strokeStyle=series.color;ctx.lineWidth=2.6;ctx.setLineDash(index===2?[6,4]:[]);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle=series.color;ctx.beginPath();ctx.arc(X(p),Y(series.fn(p)),4,0,Math.PI*2);ctx.fill();
 });
 ctx.beginPath();ctx.moveTo(X(p),top);ctx.lineTo(X(p),bottom);ctx.strokeStyle='#d9e8ff55';ctx.lineWidth=1;ctx.stroke();
 ctx.font=`${compact?10:12}px ui-monospace,monospace`;ctx.textAlign='center';['0–40','40–100','100+'].forEach((t,i)=>{ctx.fillStyle=i===phase?current.color:'#8da4c3';ctx.fillText(t,X((i+.5)/3),bottom+20);});
 if(phaseShown===phase)return;phaseShown=phase;
 root.dataset.phase=String(phase);root.style.setProperty('--phase-color',current.color);
 root.querySelector('.causal-step').textContent=current.step;root.querySelector('.causal-phase').textContent=current.title[cn?1:0];root.querySelector('.causal-detail').textContent=current.detail[cn?1:0];root.querySelector('.causal-focus').textContent=current.focus[cn?1:0];
 root.querySelector('.causal-signal strong').textContent=phase===2?(cn?'衰减':'Fading'):(cn?'活跃':'Active');root.classList.toggle('is-saturated',phase===2);
}
function tick(now){frame=0;if(!visible||!motion()||document.hidden)return;const dt=last?Math.min(50,now-last):0;last=now;progress+=dt/18000;if(progress>1.12)progress=0;draw();frame=requestAnimationFrame(tick);}
function schedule(){cancelAnimationFrame(frame);frame=0;last=0;if(visible&&motion()&&!document.hidden)frame=requestAnimationFrame(tick);draw();}
new IntersectionObserver(([e])=>{visible=e.isIntersecting;schedule();},{threshold:.1}).observe(root);
new ResizeObserver(resize).observe(canvas);
document.addEventListener('visibilitychange',schedule);document.addEventListener('scope:languagechange',e=>{language=e.detail.language;phaseShown=-1;draw();});document.addEventListener('scope:effectschange',schedule);reduced.addEventListener('change',schedule);resize();

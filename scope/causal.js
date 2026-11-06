// Approximate visual reconstruction of paper Figure 2 (user-provided reference).
// Hand-read anchors preserve trends, axes, and phase boundaries; these are not raw samples.
// No synthetic confidence band or raw-gradient scatter is added.
const root=document.querySelector('.causal-lab'),canvas=document.querySelector('#causal-canvas'),ctx=canvas.getContext('2d');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let progress=0,visible=false,frame=0,last=0,w=0,h=0,phaseShown=-1,language=document.documentElement.lang==='zh-CN'?'zh':'en';
const palette={format:'#78aaff',lexical:'#67d0cb',signal:'#c0a3d9',muted:'#9aafcb'};
const trajectories={
 reward:{color:'#e99586',max:1,points:[[0,.31],[3,.28],[7,.39],[10,.46],[13,.46],[16,.52],[20,.57],[24,.75],[28,.75],[32,.91],[36,.94],[40,.96],[45,.98],[50,.98],[56,.96],[62,.98],[70,.98],[80,.99],[90,.99],[100,.98],[108,1],[120,1],[150,1]]},
 refusal:{color:'#67d0cb',max:1,points:[[0,.02],[40,.34],[80,.70],[100,.74],[120,.74],[150,.74]]},
 gap:{color:'#78aaff',max:70,points:[[0,3],[40,47],[80,27],[100,20],[120,20],[150,20]]},
 gradient:{color:'#c0a3d9',max:.25,points:[[0,.045],[5,.066],[10,.09],[12,.115],[16,.14],[20,.15],[23,.135],[26,.13],[30,.12],[35,.09],[39,.065],[40,.055],[45,.055],[48,.038],[52,.033],[57,.041],[60,.04],[63,.021],[67,.018],[70,.004],[76,.004],[80,.002],[86,.004],[90,.015],[94,.013],[97,.011],[100,.002],[110,.001],[120,.001],[150,.001]]}
};
function interpolate(points,step){
 if(step<=points[0][0])return points[0][1];
 for(let i=1;i<points.length;i++){const [x,y]=points[i],[px,py]=points[i-1];if(step<=x)return py+(y-py)*(step-px)/(x-px);}
 return points.at(-1)[1];
}
const motion=()=>!reduced.matches&&!document.body.classList.contains('effects-off');
const phases=[
 {step:'01 / 0–40',title:['Formatting shortcut','格式 shortcut'],detail:['Reward rises rapidly and saturates near step 40. The template gap widens while false refusals also increase.','奖励快速上升, 约在 40 步趋于饱和. 模板差距扩大, 误拒率也开始上升.'],focus:['Learning: template → refusal','重点学习：格式模板 → 拒答'],color:palette.format},
 {step:'02 / 40–100',title:['Lexical shortcut','词汇 shortcut'],detail:['Reward stays near saturation. The template gap shrinks, but false refusals rise as sensitive words increasingly trigger refusals.','奖励保持在饱和附近. 模板差距缩小, 但敏感词越来越容易触发拒答, 误拒率继续上升.'],focus:['Learning: sensitive words → refusal','重点学习：敏感词汇 → 拒答'],color:palette.lexical},
 {step:'03 / 100+',title:['Gradient starvation','梯度饥饿'],detail:['Reward, false refusals, and template gap plateau. By step 100, the gradient magnitude has fallen close to zero.','奖励、误拒率和模板差距进入平台期. 到 100 步附近, 梯度幅度已衰减至接近零.'],focus:['Reward saturation → little learning signal','奖励饱和 → 持续学习信号减弱'],color:palette.signal}
];
if(!motion())progress=1;
function resize(){w=canvas.clientWidth;h=canvas.clientHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
function draw(){
 if(!w||!h)return;
 ctx.clearRect(0,0,w,h);
 const p=Math.min(progress,1),step=p*150,phase=step<40?0:step<100?1:2,cn=language==='zh',compact=w<420,fs=compact?11:13;
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
 // Figure 2: shared training-step axis, dual-axis upper panel, separate gradient panel.
 const left=compact?30:36,right=w-(compact?30:37),top=221,bottom=389,gradTop=449,gradBottom=523,pw=right-left;
 const X=step=>left+step/150*pw,Y=(v,max,a,b)=>b-v/max*(b-a);
 const label=(text,x,y,align='left',color='#a9bcd7',size=compact?9:11)=>{ctx.fillStyle=color;ctx.font=`${size}px -apple-system,sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(text,x,y);};
 const boundaries=[0,40,100,150];
 for(const [a,b] of [[top,bottom],[gradTop,gradBottom]]){
  for(let i=0;i<3;i++){ctx.fillStyle=i===phase?phases[i].color+'19':'#7294bf08';ctx.fillRect(X(boundaries[i]),a,X(boundaries[i+1])-X(boundaries[i]),b-a);}
  for(let i=0;i<=2;i++){const y=a+(b-a)*i/2;ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(right,y);ctx.strokeStyle='#344761';ctx.lineWidth=.7;ctx.stroke();}
  for(const t of [40,100]){ctx.beginPath();ctx.moveTo(X(t),a);ctx.lineTo(X(t),b);ctx.setLineDash([3,5]);ctx.stroke();ctx.setLineDash([]);}
 }
 label(cn?'奖励 / 误拒率':'Reward / over-refusal',left,202);
 label(cn?'模板差距 (百分点)':'Template gap (pp)',right,202,'right',trajectories.gap.color,compact?9:10);
 for(const v of [0,.5,1])label(v.toFixed(1),left-6,Y(v,1,top,bottom),'right','#9aafcb',9);
 for(const v of [0,35,70])label(String(v),right+6,Y(v,70,top,bottom),'left',trajectories.gap.color,9);
 label(cn?'PG-loss 幅度':'PG-loss magnitude',left,428,'left',trajectories.gradient.color);
 label(cn?'滚动 RMS · 近似重建':'Rolling RMS · approximate',right,428,'right','#9aafcb',compact?8:10);
 for(const v of [0,.1,.2])label(v.toFixed(1),left-6,Y(v,.25,gradTop,gradBottom),'right','#9aafcb',9);
 function curve(series,a,b,markers=false){
  const trace=limit=>{ctx.beginPath();ctx.moveTo(X(0),Y(series.points[0][1],series.max,a,b));for(const [t,v] of series.points){if(t>limit)break;ctx.lineTo(X(t),Y(v,series.max,a,b));}ctx.lineTo(X(limit),Y(interpolate(series.points,limit),series.max,a,b));};
  ctx.strokeStyle=series.color;ctx.lineWidth=1.8;ctx.globalAlpha=.55;trace(150);ctx.stroke();
  ctx.globalAlpha=1;ctx.lineWidth=2.5;trace(step);ctx.stroke();
  if(markers)for(const [t,v] of series.points){ctx.globalAlpha=t<=step?1:.55;ctx.beginPath();ctx.arc(X(t),Y(v,series.max,a,b),compact?2.7:3.5,0,Math.PI*2);ctx.fillStyle='#142238';ctx.fill();ctx.lineWidth=1.7;ctx.stroke();}
  ctx.globalAlpha=1;ctx.fillStyle=series.color;ctx.beginPath();ctx.arc(X(step),Y(interpolate(series.points,step),series.max,a,b),3.5,0,Math.PI*2);ctx.fill();
 }
 curve(trajectories.reward,top,bottom);
 curve(trajectories.refusal,top,bottom,true);
 curve(trajectories.gap,top,bottom,true);
 curve(trajectories.gradient,gradTop,gradBottom);
 for(const [a,b] of [[top,bottom],[gradTop,gradBottom]]){ctx.beginPath();ctx.moveTo(X(step),a);ctx.lineTo(X(step),b);ctx.strokeStyle='#d9e8ff66';ctx.lineWidth=1;ctx.stroke();}
 (cn?['I 格式','II 词汇','III 梯度饥饿']:['I Format','II Lexical','III Starvation']).forEach((name,i)=>label(name,X((boundaries[i]+boundaries[i+1])/2),bottom-12,'center',i===phase?phases[i].color:'#8da4c3',compact?8:10));
 for(const t of [0,40,80,100,150])label(String(t),X(t),gradBottom+18,'center','#9aafcb',compact?9:10);
 label(cn?'训练步数':'Training steps',w/2,gradBottom+41,'center','#afc2de',compact?10:11);
 if(phaseShown===phase)return;phaseShown=phase;
 root.dataset.phase=String(phase);root.style.setProperty('--phase-color',current.color);
 root.querySelector('.causal-step').textContent=current.step;root.querySelector('.causal-phase').textContent=current.title[cn?1:0];root.querySelector('.causal-detail').textContent=current.detail[cn?1:0];root.querySelector('.causal-focus').textContent=current.focus[cn?1:0];
 root.querySelector('.causal-signal strong').textContent=(cn?['活跃','逐渐衰减','接近零']:['Active','Weakening','Near zero'])[phase];root.classList.toggle('is-saturated',phase===2);
}
function tick(now){frame=0;if(!visible||!motion()||document.hidden)return;const dt=last?Math.min(50,now-last):0;last=now;progress+=dt/18000;if(progress>1.12)progress=0;draw();frame=requestAnimationFrame(tick);}
function schedule(){cancelAnimationFrame(frame);frame=0;last=0;if(visible&&motion()&&!document.hidden)frame=requestAnimationFrame(tick);draw();}
new IntersectionObserver(([e])=>{visible=e.isIntersecting;schedule();},{threshold:.1}).observe(root);
new ResizeObserver(resize).observe(canvas);
document.addEventListener('visibilitychange',schedule);document.addEventListener('scope:languagechange',e=>{language=e.detail.language;phaseShown=-1;draw();});document.addEventListener('scope:effectschange',schedule);reduced.addEventListener('change',schedule);resize();

// Prompt examples dissolve into particles and converge into the real DOM wordmark.
// Canvas text sampling is inspired by the ToolSpace project page; the scene is original.
const hero=document.querySelector('.hero'),canvas=document.querySelector('#convergence-canvas'),ctx=canvas.getContext('2d');
const wordmark=document.querySelector('.scope-wordmark'),replay=document.querySelector('.replay-intro');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const examples=[['SQL injection → defend','SQL injection → 防御'],['unpublished research','未发表的研究'],['private data → protect','私人数据 → 保护'],['sensitive word ≠ intent','敏感词 ≠ 真实意图'],['same query, no template','相同指令, 移除模板'],['harmful intent → refuse','有害意图 → 拒答'],['contrastive benign query','良性对比请求'],['reason before refusal','在拒答之前判断意图']];
const colors=['#6288bf','#70aaa5','#aa88b5','#c3a170'];
let width=0,height=0,points=[],cards=[],start=0,frame=0,active=false,language=document.documentElement.lang==='zh-CN'?'zh':'en';
function build(){
  const rect=hero.getBoundingClientRect(),title=wordmark.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
  width=hero.clientWidth;height=Math.min(hero.clientHeight,760);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
  const off=document.createElement('canvas');off.width=Math.ceil(width);off.height=Math.ceil(height);const o=off.getContext('2d');
  const style=getComputedStyle(wordmark),fontSize=parseFloat(style.fontSize),tx=title.left-rect.left+title.width/2,ty=title.top-rect.top+title.height/2;
  o.font=`800 ${fontSize}px ${style.fontFamily}`;o.textAlign='center';o.textBaseline='middle';
  const measure=o.measureText('DeShortcut-Align').width,targetWidth=Math.min(title.width,width-32);o.save();o.translate(tx,ty);o.scale(targetWidth/measure,1);o.fillText('DeShortcut-Align',0,0);o.restore();
  const image=o.getImageData(0,0,off.width,off.height).data,targets=[],gap=width<600?3:3;
  for(let y=Math.max(0,Math.floor(ty-fontSize));y<Math.min(height,ty+fontSize);y+=gap)for(let x=0;x<width;x+=gap)if(image[(y*off.width+x)*4+3]>110)targets.push({x,y});
  const slots=width<600?[[.2,.11],[.76,.14],[.19,.39],[.75,.43],[.18,.61],[.75,.64]]:[[.15,.12],[.45,.09],[.8,.12],[.12,.38],[.88,.37],[.2,.62],[.54,.65],[.85,.61]];
  cards=slots.map(([x,y],i)=>({x:x*width,y:y*Math.min(height,width<600?320:370),text:examples[i%examples.length][language==='zh'?1:0],color:colors[i%colors.length]}));
  const stride=Math.max(1,Math.ceil(targets.length/2200));points=targets.filter((_,i)=>i%stride===0).map((p,i)=>{const c=cards[i%cards.length];return{sx:c.x+(Math.random()-.5)*135,sy:c.y+(Math.random()-.5)*25,tx:p.x,ty:p.y,delay:Math.random()*.35,color:colors[i%colors.length],bend:(Math.random()-.5)*150,r:.6+Math.random()*.8};});
}
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
function finish(){cancelAnimationFrame(frame);active=false;hero.classList.remove('is-converging');ctx.clearRect(0,0,width,height);}
function render(now){
  if(!active)return;const elapsed=(now-start)/1000;ctx.clearRect(0,0,width,height);
  const cardAlpha=Math.max(0,Math.min(1,elapsed/.35))*Math.max(0,1-(elapsed-.8)/.65);
  if(cardAlpha>0){ctx.globalAlpha=cardAlpha;for(const c of cards){ctx.font=`500 ${width<600?10:12}px -apple-system, sans-serif`;const w=ctx.measureText(c.text).width+22;ctx.fillStyle='#ffffffcc';ctx.strokeStyle=c.color+'66';ctx.lineWidth=.8;ctx.beginPath();ctx.roundRect(c.x-w/2,c.y-16,w,32,8);ctx.fill();ctx.stroke();ctx.fillStyle=c.color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(c.text,c.x,c.y);}ctx.globalAlpha=1;}
  const fade=elapsed>3.35?Math.max(0,1-(elapsed-3.35)/.55):1;
  for(const p of points){const t=Math.min(1,Math.max(0,(elapsed-.7-p.delay)/2.25)),e=ease(t),arc=Math.sin(Math.PI*e);const x=p.sx+(p.tx-p.sx)*e+arc*p.bend*.3,y=p.sy+(p.ty-p.sy)*e+arc*p.bend;ctx.globalAlpha=Math.min(1,Math.max(0,(elapsed-.6)*2))*fade;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(x,y,p.r,0,Math.PI*2);ctx.fill();}
  ctx.globalAlpha=1;hero.style.setProperty('--title-opacity',String(Math.max(0,Math.min(1,(elapsed-3.15)/.65))));
  if(elapsed<4)frame=requestAnimationFrame(render);else finish();
}
function play(){
  if(reduced.matches||document.body.classList.contains('effects-off'))return finish();
  cancelAnimationFrame(frame);build();active=true;hero.style.setProperty('--title-opacity','0');hero.classList.add('is-converging');start=performance.now();frame=requestAnimationFrame(render);
}
replay.addEventListener('click',play);
document.addEventListener('scope:languagechange',event=>{language=event.detail.language;});
document.addEventListener('scope:effectschange',event=>{if(!event.detail.enabled)finish();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)finish();});
reduced.addEventListener('change',()=>finish());
let resizeTimer;window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{if(active)finish();},100);},{passive:true});
if(document.readyState==='complete')play();else window.addEventListener('load',play,{once:true});

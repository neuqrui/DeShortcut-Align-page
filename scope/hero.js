// Directly scrub title convergence with vertical pointer movement.
const hero=document.querySelector('.hero'),canvas=document.querySelector('#convergence-canvas'),ctx=canvas.getContext('2d'),wordmark=document.querySelector('.scope-wordmark');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let width=0,height=0,points=[],frame=0,current=1,target=1,visible=true,initial=true,last=0;
const colors=['#76a9ff','#b3a1df','#efaa78'];
const enabled=()=>!reduced.matches&&!document.body.classList.contains('effects-off');
function build(){
  const rect=hero.getBoundingClientRect(),title=wordmark.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
  width=hero.clientWidth;height=Math.min(hero.clientHeight,720);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);canvas.style.height=`${height}px`;ctx.setTransform(dpr,0,0,dpr,0,0);
  points=[];const gap=width<600?3:3.3;
  [...wordmark.querySelectorAll('span')].forEach((span,k)=>{
    const off=document.createElement('canvas');off.width=Math.ceil(width);off.height=Math.ceil(height);const o=off.getContext('2d'),r=span.getBoundingClientRect(),style=getComputedStyle(span),fontSize=parseFloat(style.fontSize);
    o.font=`${style.fontWeight} ${fontSize}px ${style.fontFamily}`;o.textBaseline='middle';o.textAlign='center';const text=span.textContent,m=o.measureText(text).width;
    o.save();o.translate(r.left-rect.left+r.width/2,r.top-rect.top+r.height/2);o.scale(r.width/m,1);o.fillText(text,0,0);o.restore();
    const pixels=o.getImageData(0,0,off.width,off.height).data;
    for(let y=Math.max(0,Math.floor(r.top-rect.top-5));y<Math.min(height,r.bottom-rect.top+5);y+=gap)for(let x=Math.max(0,Math.floor(r.left-rect.left-5));x<Math.min(width,r.right-rect.left+5);x+=gap){if(pixels[(Math.floor(y)*off.width+Math.floor(x))*4+3]>90){const i=points.length,seed=Math.sin(i*23.17+4.2)*43758.54,n=seed-Math.floor(seed);points.push({tx:x,ty:y,sx:width*.08+n*width*.84,sy:35+((i*37)%195),z:(i%29)/29,arc:Math.sin(i*3.71)*65,color:colors[k]});}}
  });
  if(initial&&enabled()){current=0;target=1;initial=false;}draw();
}
function draw(){
  ctx.clearRect(0,0,width,height);
  if(!enabled()||current>.996){hero.classList.remove('is-converging');hero.style.setProperty('--title-opacity','1');return;}
  hero.classList.add('is-converging');const opacity=Math.max(0,(current-.86)/.14);hero.style.setProperty('--title-opacity',String(opacity));
  const e=current*current*(3-2*current);
  for(const p of points){const arc=Math.sin(e*Math.PI);const x=p.sx+(p.tx-p.sx)*e+arc*p.arc,y=p.sy+(p.ty-p.sy)*e+arc*p.arc*.7;ctx.globalAlpha=(1-opacity)*(.6+p.z*.4);ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(x,y,.65+p.z*.6,0,Math.PI*2);ctx.fill();}
  ctx.globalAlpha=1;
}
function tick(now){frame=0;if(!visible||document.hidden)return;const dt=last?Math.min(now-last,40):16;last=now;current+=(target-current)*(1-Math.exp(-dt/160));if(Math.abs(target-current)<.001)current=target;draw();if(current!==target)frame=requestAnimationFrame(tick);else last=0;}
function schedule(){if(!frame&&visible&&!document.hidden)frame=requestAnimationFrame(tick);}
hero.addEventListener('pointermove',e=>{
  if(e.pointerType==='touch'||!enabled())return;const r=wordmark.getBoundingClientRect();if(e.clientY<r.top-140||e.clientY>r.bottom+110||e.clientX<r.left-120||e.clientX>r.right+120)return;
  target=Math.max(0,Math.min(1,(r.top+r.height/2+90-e.clientY)/180));schedule();
},{passive:true});
hero.addEventListener('pointerleave',()=>{target=1;schedule();});
function toggle(){if(!enabled())return;target=target>.5?0:1;schedule();}
wordmark.addEventListener('click',toggle);
wordmark.addEventListener('keydown',e=>{if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();target=e.key==='ArrowUp'?1:0;schedule();}});
const fullTitle=document.querySelector('.paper-title');fullTitle.tabIndex=0;fullTitle.setAttribute('role','button');fullTitle.addEventListener('click',toggle);fullTitle.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
document.addEventListener('scope:effectschange',e=>{if(!e.detail.enabled){cancelAnimationFrame(frame);frame=0;current=target=1;draw();}});
reduced.addEventListener('change',()=>{current=target=1;draw();});
new IntersectionObserver(([e])=>{visible=e.isIntersecting;if(visible)schedule();else{cancelAnimationFrame(frame);frame=0;last=0;}}).observe(hero);
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;last=0;}else schedule();});
let resize;window.addEventListener('resize',()=>{clearTimeout(resize);resize=setTimeout(build,150);},{passive:true});
function init(){build();schedule();document.fonts.ready.then(()=>{build();schedule();});}
if(document.readyState==='complete')init();else window.addEventListener('load',init,{once:true});

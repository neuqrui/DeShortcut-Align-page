// Adapted from neuqrui/SCOPE-page experience/results.js.
// Figure 1: displayed one-decimal labels, full post-training template / no template.
const root=document.querySelector('#problem-chart');
const $=s=>root.querySelector(s), $$=s=>[...root.querySelectorAll(s)];
const methods=['Base','TARS','SFT','STAR-1','PPO','GRPO'];
const colors=['#a9b9d2','#99bdb5','#b39bce','#d6a8c3','#d4bc9b','#929cd0'];
const data={
  wildjailbreak:{label:'WildJailbreak',n:250,full:[52.0,76.8,84.8,87.2,100.0,100.0],bare:[49.2,63.2,77.6,70.0,89.6,97.2]},
  strongreject:{label:'StrongReject',n:939,full:[49.6,91.4,99.0,99.7,98.5,100.0],bare:[34.5,65.1,77.7,83.4,72.1,93.2]},
  wildchat:{label:'WildChat',n:370,full:[67.8,76.0,86.8,85.1,96.2,99.7],bare:[51.9,63.2,76.8,72.4,80.8,89.7]}
};
let language=document.documentElement.lang==='zh-CN'?'zh':'en',benchmark='wildjailbreak',condition='compare',visible=false;
const disabled=new Set();
let animationFrame=0;
const t=(en,zh)=>language==='zh'?zh:en;
function resetBars(){cancelAnimationFrame(animationFrame);root.classList.add('bars-reset');root.classList.remove('bars-risen');}
function animate(){
  resetBars();if(!visible)return;
  animationFrame=requestAnimationFrame(()=>{animationFrame=requestAnimationFrame(()=>{if(!visible)return;root.classList.remove('bars-reset');root.classList.add('bars-risen');});});
}
function inspect(index){
  const d=data[benchmark],gap=(d.full[index]-d.bare[index]).toFixed(1);
  $('.bars-readout').textContent=t(`${methods[index]} · ${d.label}: ${d.full[index].toFixed(1)}% with template → ${d.bare[index].toFixed(1)}% without template (−${gap} pp).`,`${methods[index]} · ${d.label}: 保留模板 ${d.full[index].toFixed(1)}% → 移除模板 ${d.bare[index].toFixed(1)}% (−${gap} 个百分点).`);
}
function render(){
  const d=data[benchmark],container=$('.benchmark-bars');container.replaceChildren();
  const selected=methods.filter(m=>!disabled.has(m));
  container.style.setProperty('--bar-count',selected.length);container.classList.toggle('is-comparing',condition==='compare');
  selected.forEach((name,i)=>{
    const index=methods.indexOf(name),group=document.createElement('div');group.className='benchmark-bar-group';
    const bar=document.createElement('button');bar.type='button';bar.className='benchmark-bar';bar.style.setProperty('--bar-delay',`${i*65}ms`);bar.style.setProperty('--bar-color',colors[index]);
    const values=condition==='compare'?[['full',d.full[index]],['bare',d.bare[index]]]:[[condition,d[condition][index]]];
    bar.setAttribute('aria-label',`${name}, ${d.label}: ${values.map(([mode,value])=>`${mode} ${value.toFixed(1)}%`).join(', ')}`);
    for(const [mode,value] of values){
      const fill=document.createElement('span');fill.className=`benchmark-bar-fill ${mode}`;fill.style.setProperty('--score',value);
      const score=document.createElement('span');score.className=`benchmark-bar-value ${mode}`;score.style.setProperty('--score',value);score.textContent=value.toFixed(1);
      if(condition!=='compare'){bar.style.setProperty('--score',value);fill.style.opacity=mode==='bare'?'.63':'1';}
      bar.append(fill,score);
    }
    const label=document.createElement('span');label.className='benchmark-bar-label';label.textContent=name;
    for(const event of ['pointerenter','focus','click'])bar.addEventListener(event,()=>inspect(index));
    group.append(bar,label);container.append(group);
  });
  $$('[data-problem-benchmark]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.problemBenchmark===benchmark)));
  $$('[data-problem-template]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.problemTemplate===condition)));
  const maxIndex=d.full.map((v,i)=>v-d.bare[i]).reduce((best,v,i,values)=>v>values[best]?i:best,0);
  $('#problem-gap').textContent=t(`up to −${(d.full[maxIndex]-d.bare[maxIndex]).toFixed(1)} pp`,`最高下降 ${(d.full[maxIndex]-d.bare[maxIndex]).toFixed(1)} 个百分点`);
  $('.bars-readout').textContent=t(`${d.label} · ${d.n} prompts · ${condition==='compare'?'Solid: with template. Faded: without template.':'Select a bar to inspect the template-removal gap.'}`,`${d.label} · ${d.n} 条请求 · ${condition==='compare'?'实色: 保留模板. 浅色: 移除模板.':'点击柱子查看移除模板前后的差值.'}`);
  animate();
}
function legend(){
  const container=$('.chart-legend');container.replaceChildren();
  methods.forEach((name,i)=>{const button=document.createElement('button');button.type='button';button.setAttribute('aria-pressed',String(!disabled.has(name)));const dot=document.createElement('i');dot.style.background=colors[i];button.append(dot,name);button.addEventListener('click',()=>{if(disabled.has(name))disabled.delete(name);else if(disabled.size<methods.length-1)disabled.add(name);legend();render();});container.append(button);});
}
$$('[data-problem-benchmark]').forEach(button=>button.addEventListener('click',()=>{benchmark=button.dataset.problemBenchmark;render();}));
$$('[data-problem-template]').forEach(button=>button.addEventListener('click',()=>{condition=button.dataset.problemTemplate;render();}));
$('.replay-bars').addEventListener('click',animate);
new IntersectionObserver(([entry])=>{const next=entry.isIntersecting&&entry.intersectionRatio>=.18;if(next===visible)return;visible=next;if(visible)animate();else resetBars();},{threshold:[0,.18]}).observe($('.benchmark-plot'));
document.addEventListener('scope:languagechange',event=>{language=event.detail.language;legend();render();});
document.addEventListener('scope:effectschange',()=>{if(document.body.classList.contains('effects-off'))root.classList.add('bars-risen');else animate();});
legend();render();

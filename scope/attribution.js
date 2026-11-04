// Animated walkthrough of the masking / teacher-forcing / aggregation procedure.
// The displayed words are selected from the paper's Figure 13 vocabulary.
window.DeShortcutAttribution=(()=>{
  let cleanup=()=>{};
  const words=['unpublished','knowledge','priv','prices','reveal','sophisticated'];
  function mount(host,language){
    cleanup();
    const t=(en,zh)=>language==='zh'?zh:en;
    let index=0,phase=0,playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,visible=true,timer;
    host.innerHTML=`<div class="attribution-animation" data-phase="0" data-token-index="0">
      <div class="attr-toolbar"><span class="mono">${t('REFUSAL ATTRIBUTION','拒答归因')}</span><span class="attr-step">1 / ${words.length}</span></div>
      <div class="attr-input"><div class="attr-label">${t('INPUT TOKENS','输入 TOKEN')}</div><div class="attr-tokens">${words.map((word,i)=>`<button type="button" data-attr-token="${i}" aria-pressed="${i===0}">${word}</button>`).join('')}</div></div>
      <div class="attr-flow"><span class="attr-packet"></span><span class="attr-packet"></span><span class="attr-packet"></span></div>
      <div class="attr-modes">${[['A',t('Bare','裸指令')],['B',t('Pre-training','预训练模板')],['C',t('Full template','完整模板')]].map(([letter,label])=>`<div class="attr-mode"><b>${letter}</b><span>${label}</span><i>Δ log p(y<sub>ans</sub>)</i></div>`).join('')}</div>
      <div class="attr-reference"><span class="attr-lock">▣</span><span>${t('Reference reasoning stays fixed','参考推理轨迹保持不变')}</span><code>y<sub>CoT</sub></code></div>
      <div class="attr-aggregate"><span>⅓ Σ</span><p>${t('Aggregate across template modes','跨模板模式聚合敏感性')}</p><div class="attr-collected">${words.map((word,i)=>`<span data-collected="${i}">${word}</span>`).join('')}</div></div>
      <div class="attr-status" role="status"></div><div class="attr-timeline"><i></i></div>
      <div class="attr-controls"><button type="button" class="attr-play" aria-pressed="${playing}"></button><button type="button" class="attr-next">${t('Step →','单步 →')}</button><span>${t('Method illustration','方法示意')}</span></div>
    </div>`;
    const root=host.querySelector('.attribution-animation');
    function draw(){
      root.dataset.phase=phase;root.dataset.tokenIndex=index;
      root.classList.toggle('attr-running',playing&&visible);
      root.querySelector('.attr-step').textContent=`${index+1} / ${words.length}`;
      root.querySelectorAll('[data-attr-token]').forEach((button,i)=>{button.classList.toggle('is-masked',i===index);button.classList.toggle('is-done',i<index);button.textContent=i===index?'[MASK]':words[i];button.setAttribute('aria-pressed',String(i===index));});
      root.querySelectorAll('[data-collected]').forEach((pill,i)=>pill.classList.toggle('is-collected',i<index||(i===index&&phase===2)));
      const messages=[t(`Mask “${words[index]}” and preserve the rest of the input.`,`遮蔽「${words[index]}」, 保留其余输入.`),t('Measure the refusal-token likelihood shift in all three modes.','分别比较三种模式下最终拒答 token 的似然变化.'),t('Average the shifts to obtain this token’s TSS.','对变化量取平均, 得到该 token 的 TSS.')];
      root.querySelector('.attr-status').textContent=messages[phase];
      root.querySelector('.attr-timeline i').style.width=`${((index*3+phase+1)/(words.length*3))*100}%`;
      root.querySelector('.attr-play').textContent=playing?t('Ⅱ Pause','Ⅱ 暂停'):t('▶ Play attribution','▶ 播放归因');
      root.querySelector('.attr-play').setAttribute('aria-pressed',String(playing));
    }
    function advance(){phase++;if(phase===3){phase=0;index=(index+1)%words.length;}draw();}
    function schedule(){clearInterval(timer);if(playing&&visible&&!document.hidden&&!document.body.classList.contains('effects-off'))timer=setInterval(advance,1100);draw();}
    root.querySelector('.attr-play').addEventListener('click',()=>{playing=!playing;schedule();});
    root.querySelector('.attr-next').addEventListener('click',()=>{playing=false;advance();schedule();});
    root.querySelectorAll('[data-attr-token]').forEach(button=>button.addEventListener('click',()=>{index=Number(button.dataset.attrToken);phase=0;playing=false;schedule();}));
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;schedule();},{threshold:.03});observer.observe(root);
    const visibility=()=>schedule(),effects=event=>{if(!event.detail.enabled)playing=false;schedule();};
    document.addEventListener('visibilitychange',visibility);document.addEventListener('scope:effectschange',effects);
    cleanup=()=>{clearInterval(timer);observer.disconnect();document.removeEventListener('visibilitychange',visibility);document.removeEventListener('scope:effectschange',effects);};
    schedule();
  }
  return{mount,stop:()=>cleanup()};
})();

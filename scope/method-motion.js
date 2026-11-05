/* Figure 3 and equations 6–8, illustrated as automatic left-to-right flows. */
window.DeShortcutMethod=(()=>{
  let cleanup=()=>{};
  const icons={
    prompt:'<path d="M7 3h10l4 4v22H7Z M17 3v6h6 M11 14h8 M11 19h10 M11 24h7"/>',
    policy:'<circle cx="16" cy="16" r="5"/><circle cx="5" cy="5" r="2"/><circle cx="27" cy="5" r="2"/><circle cx="5" cy="27" r="2"/><circle cx="27" cy="27" r="2"/><path d="m7 7 6 6m6 6 6 6M25 7l-6 6M7 25l6-6"/>',
    rollouts:'<path d="M5 4h15v20H5Z M10 8h15v20H10 M14 13h7m-7 5h7m-7 5h5"/>',
    reward:'<path d="m16 3 12 5v8c0 8-12 14-12 14S4 24 4 16V8Z m-7 13 5 5 10-11"/>',
    advantage:'<path d="M4 3v25h25 M9 22v-7m7 7V8m7 14v-11 M7 10l8-6 10 3"/>',
    update:'<path d="M26 11A11 11 0 0 0 7 7L3 11m0-8v8h8m-5 10a11 11 0 0 0 19 4l4-4m0 8v-8h-8"/>',
    gate:'<path d="m7 16 6 6 12-13"/>',
    blind:'<path d="M3 7h26v18H3Z M8 7v18m8-18v18m8-18v18 M3 13h26 M5 3l23 26"/>',
    lock:'<rect x="5" y="13" width="22" height="16" rx="4"/><path d="M10 13V9a6 6 0 0 1 12 0v4m-6 7v4"/>',
    helpful:'<path d="m16 3 12 5v8c0 8-12 14-12 14S4 24 4 16V8Z m-7 13 5 5 10-11"/>',
    data:'<ellipse cx="16" cy="6" rx="12" ry="4"/><path d="M4 6v10c0 5 24 5 24 0V6 M4 16v10c0 5 24 5 24 0V16"/>'
  };
  const icon=(name)=>`<svg viewBox="0 0 32 32" aria-hidden="true">${icons[name]}</svg>`;
  function mount(host,language,stage){
    cleanup();
    const t=(en,zh)=>language==='zh'?zh:en;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    const motionAllowed=()=>!reduced.matches&&!document.body.classList.contains('effects-off');
    let phase=0,visible=false,timer,ccr=true;
    const steps=stage===1?
      [t('Select refusal-sensitive vocabulary.','选出拒答敏感词汇.'),t('Retain the words. Rewrite the intent.','保留词汇, 改写意图.'),t('Pair the benign contrast with a helpful response.','为良性对比请求配对有帮助的回答.'),t('Mix the contrast into SFT data and RL prompts.','将对比样例混入 SFT 数据和 RL prompt 池.')]:
      [t('Sample a prompt from the mixed training pool.','从混合训练池中采样 prompt.'),t('Generate factual rollouts with the current policy.','使用当前策略生成真实输入下的 rollout.'),t('Evaluate safety and helpfulness.','评估安全性与帮助性.'),t('Compute group-relative advantages and the GRPO loss.','计算组内相对优势与 GRPO 损失.'),t('Learn verified rollouts under a template-blinded input.','在屏蔽模板的输入下学习经验证的 rollout.'),t('Combine the losses, update the policy, and repeat.','合并损失, 更新策略, 开始下一轮.')];
    if(stage===1){
      host.innerHTML=`<div class="augmentation-animation method-animation horizontal-augmentation" data-phase="0"><div class="motion-heading"><span>02 / AGCA</span><span>${t('KEEP THE VOCABULARY · CHANGE THE INTENT','保留词汇 · 改写意图')}</span></div><div class="augmentation-flow"><article class="aug-source aug-document"><div class="aug-object-icon">${icon('prompt')}</div><span class="flow-label">${t('HARMFUL QUERY','有害请求')}</span><p>${t('An attempt to <mark>steal data</mark> using <mark>SQL injection</mark>.','使用 <mark>SQL injection</mark> 来 <mark>steal data</mark> 的请求.')}</p><small>${t('Refusal target','目标: 拒答')}</small></article><div class="aug-connector" aria-hidden="true"><i></i></div><div class="aug-vocabulary"><div class="aug-object-icon">${icon('lock')}</div><span class="flow-label">TSS → TOP-K</span><div class="retained-words"><span>SQL</span><span>injection</span><span>steal</span><span>data</span></div><small>${t('Sensitive vocabulary stays','敏感词保持不变')}</small></div><div class="aug-connector" aria-hidden="true"><i></i></div><article class="aug-target aug-document"><div class="aug-object-icon">${icon('helpful')}</div><span class="flow-label">${t('BENIGN CONTRAST','良性对比')}</span><p>${t('How can I <b>protect my database</b> from an <mark>SQL injection</mark> attempt to <mark>steal</mark> user <mark>data</mark>?','如何<b>保护数据库</b>, 防范使用 <mark>SQL injection</mark> 来 <mark>steal</mark> 用户 <mark>data</mark> 的攻击?')}</p><div class="helpful-pair">${t('A helpful defensive response','有帮助的防御建议')}</div></article></div><div class="aug-destinations"><span class="aug-destination-label">${t('MIX INTO TRAINING','混入训练')}</span><span>${icon('data')} ${t('SFT pairs','SFT 数据对')}</span><span>${icon('rollouts')} ${t('RL prompts','RL prompt 池')}</span></div><p class="method-live-status"></p></div>`;
    }else{
      host.innerHTML=window.DeShortcutTraining.render(t,icon);
    }
    const root=host.querySelector('.method-animation');
    function draw(){
      root.dataset.phase=phase;root.classList.toggle('is-playing',visible&&!document.hidden&&motionAllowed());
      root.querySelector('.method-live-status').textContent=stage===2&&!ccr&&phase===5?t('Update with the GRPO loss and reference KL, then repeat.','使用 GRPO 损失与参考 KL 更新策略, 再进入下一轮.'):steps[phase];
      root.querySelectorAll('[data-node]').forEach(n=>n.classList.toggle('is-active',Number(n.dataset.node)===phase));
      if(stage===2){const svg=root.querySelector('.workbench-wires');root.classList.contains('is-playing')?svg.unpauseAnimations():svg.pauseAnimations();}
    }
    function advance(){phase=(phase+1)%steps.length;if(stage===2&&!ccr&&phase===4)phase=5;draw();}
    function schedule(){clearInterval(timer);if(visible&&!document.hidden&&motionAllowed())timer=setInterval(advance,2000);draw();}
    root.querySelector('.ccr-toggle')?.addEventListener('click',e=>{ccr=!ccr;root.dataset.ccr=ccr;e.currentTarget.setAttribute('aria-pressed',String(ccr));e.currentTarget.innerHTML=`＋ CCR <span>${ccr?t('on','已加入'):t('off','未加入')}</span>`;root.querySelector('#objective-label').innerHTML=window.DeShortcutMath.render(ccr?'joint':'baseJoint',true);if(!ccr&&phase===4)phase=5;draw();});
    const observer=new IntersectionObserver(([e])=>{visible=e.isIntersecting;schedule();},{threshold:.05});observer.observe(root);
    document.addEventListener('visibilitychange',schedule);document.addEventListener('scope:effectschange',schedule);reduced.addEventListener('change',schedule);
    cleanup=()=>{clearInterval(timer);observer.disconnect();document.removeEventListener('visibilitychange',schedule);document.removeEventListener('scope:effectschange',schedule);reduced.removeEventListener('change',schedule);};draw();
  }
  return{mount,stop:()=>cleanup()};
})();

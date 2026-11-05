/* Data objects, mathematical operations, and selected icons share one training view. */
window.DeShortcutTraining={render(t,icon){
  const math=window.DeShortcutMath.render;
  const wire=(d,cls='')=>`<path class="workbench-wire ${cls}" d="${d}" marker-end="url(#${cls.includes('aux')?'warm':'cool'}-arrow)"/>`;
  return `<div class="grpo-animation method-animation mixed-training-animation" data-phase="0" data-ccr="true">
    <div class="motion-heading"><span>${t('GRPO + COUNTERFACTUAL CONSISTENCY','GRPO + 反事实一致性')}</span><button class="ccr-toggle" type="button" aria-pressed="true">＋ CCR <span>${t('on','已加入')}</span></button></div>
    <div class="training-workbench">
      <svg class="workbench-wires" viewBox="0 0 970 390" aria-hidden="true"><defs><marker id="cool-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10Z" fill="#7daaff"/></marker><marker id="warm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10Z" fill="#efa86b"/></marker></defs>
      <rect class="workbench-branch ccr-branch" x="318" y="242" width="650" height="144" rx="16"/>
      ${wire('M140 126H166')}${wire('M306 126H332')}${wire('M472 126H498')}${wire('M638 126H664')}
      ${wire('M734 193C734 243 835 255 885 310')}
      ${wire('M900 303V194','parameter-wire')}${wire('M970 126V18H150V126H166','parameter-wire')}
      ${wire('M402 194V267','aux-wire ccr-branch')}${wire('M568 194V225H402V267','aux-wire ccr-branch')}
      ${wire('M472 323H498','aux-wire ccr-branch')}${wire('M638 323H650','aux-wire ccr-branch')}${wire('M814 323H880','aux-wire ccr-branch')}
      <circle class="flow-packet" r="4"><animateMotion dur="8s" repeatCount="indefinite" path="M140 126H236H402H568H734C734 243 835 255 885 310L900 323V126H970V18H150V126H236"/></circle>
      <circle class="flow-packet ccr-packet ccr-branch" r="4"><animateMotion dur="8s" repeatCount="indefinite" path="M402 194V323H568H732H900V194"/></circle></svg>
      <div class="process-node prompt-object" data-node="0" style="--x:0px"><span class="process-index">01 / ${t('INPUT','输入')}</span><h4>${t('Mixed prompts','混合请求')}</h4><div class="prompt-token-strip"><span class="format-token">&lt;fmt&gt;</span><span>${t('Instruction','用户指令')}</span></div><div class="node-equation">${math('factual')}</div></div>
      <div class="process-node policy-object" data-node="1" style="--x:166px"><span class="process-index">02 / ${t('POLICY','策略')}</span><h4>${icon('policy')} ${t('Policy','策略')}</h4><div class="node-equation">${math('policy',true)}</div><small>${t('Factual input','真实输入')}</small></div>
      <div class="process-node rollout-object" data-node="1" style="--x:332px"><span class="process-index">03 / ${t('SAMPLE','采样')}</span><h4>${t('Group rollouts','组内输出')}</h4><div class="rollout-stack"><span><i>y<sub>1</sub></i><b></b><b></b><b></b></span><span><i>y<sub>2</sub></i><b></b><b></b></span><span><i>y<sub>G</sub></i><b></b><b></b><b></b></span></div></div>
      <div class="process-node judge-object" data-node="2" style="--x:498px"><span class="process-index">04 / ${t('EVALUATE','评估')}</span><h4>${icon('reward')} ${t('Reward & judge','奖励与评估')}</h4><div class="node-equation">${math('rewards',true)}</div><small>${t('Safety + helpfulness','安全性 + 帮助性')}</small></div>
      <div class="process-node advantage-object" data-node="3" style="--x:664px"><span class="process-index">05 / GRPO</span><h4>${t('Advantages','相对优势')}</h4><div class="node-equation">${math('advantages',true)}</div></div>
      <div class="process-node update-object" data-node="5" style="--x:830px"><span class="process-index">06 / ${t('UPDATE','更新')}</span><h4>${t('Policy update','策略更新')}</h4><div class="node-equation">${math('update',true)}</div><small>${t('Next iteration','下一轮迭代')}</small></div>
      <div class="process-node gate-object auxiliary-object ccr-branch" data-node="4" style="--x:332px"><span class="auxiliary-tag">CCR</span><h4>${t('Safety gate','安全 gate')}</h4><div class="node-equation">${math('gate',true)}</div></div>
      <div class="process-node counterfactual-object auxiliary-object ccr-branch" data-node="4" style="--x:498px"><h4>${t('Blind template','屏蔽模板')}</h4><div class="prompt-token-strip"><span class="format-token blinded-format">&lt;fmt&gt;</span><span>${t('Intent','意图')}</span></div><div class="node-equation">${math('xcf')}<small> · ${t('reuse verified y','复用经验证的 y')}</small></div></div>
      <div class="process-node cf-loss-object auxiliary-object ccr-branch" data-node="4" style="--x:650px"><h4>${t('Auxiliary loss','辅助损失')}</h4><div class="node-equation">${math('cfName',true)}${math('cfTerm',true)}</div></div>
      <div class="process-node combine-object auxiliary-object" data-node="5" style="--x:830px"><h4>${t('Combine losses','合并损失')}</h4><span class="sum-junction">+</span><div class="node-equation">${math('lrl')}</div></div>
    </div><div class="joint-equation" id="objective-label">${math('joint',true)}</div><div class="flow-legend"><span><i></i>${t('GRPO flow','GRPO 主循环')}</span><span><i class="green"></i>${t('Added CCR loss','新增 CCR 损失')}</span><span>${t('Shared policy parameters','共享策略参数')}</span></div><p class="method-live-status"></p></div>`;
}};

'use strict';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
let lang = 'en';
let stage = 0;
const zh = {
  navMot:'研究动机',navMethod:'方法',navResults:'实验结果',navCite:'引用',navProblem:'问题图解',navTakeaway:'核心结论',chip1:'定位 shortcut',chip2:'去耦表面线索',chip3:'一致的安全决策',compareBoth:'并排对比',replayBars:'↻ 重播动画',viewOriginal:'查看论文原图',problemKicker:'以数据呈现问题 · FIGURE 1',problemTitle:'相同的指令, 不同的防御.',problemDesc:'仅移除格式模板, 观察不同对齐方法的防御成功率如何变化.',problemUnit:'防御成功率 (%) ↑',problemImpact:'移除外层模板, 暴露对 shortcut 的依赖.',problemSource:'Figure 1 · 按原图标注转录, 保留一位小数. 对比完整 post-training template 与无模板条件, 省略仅保留预训练模板的柱形. 点击柱子查看数值, 使用图例选择方法. 纵轴从零开始.',eyebrow:'超越表面线索的安全对齐',
  paperTitle:'去耦虚假捷径, 实现大推理模型的鲁棒安全对齐',corresponding:'† 通讯作者',paper:'阅读论文',code:'代码与数据',explore:'探索方法',
  heroDesc:'安全的推理模型需要理解模板与关键词背后的意图.<br> DeShortcut-Align 降低对 shortcut 的依赖, 同时保留提供帮助的能力.',
  inputLabel:'同一条用户指令',intent:'用户意图',safeDecision:'鲁棒的安全决策',usefulAnswer:'有帮助的良性回答',
  metric1:'模板差距降低',metric2:'误拒率降低',metric3:'越狱攻击防御率',metric1Note:'7B · SFT 对比标准 SFT',metric2Note:'7B · GRPO 对比标准 GRPO',metric3Note:'7B · RL · PAIR / GCG / TAP',metricSource:'论文 Table 1 与 Table 4 · 相对降幅对应上方所列实验设置.',
  motLabel:'研究动机',motTitle:'看似安全,<br>也可能依赖 shortcut.',motDesc:'接近满分的安全得分可能掩盖脆弱的行为. 我们发现两类表面线索, 使安全对齐偏离用户的真实意图.',
  formatLabel:'格式 shortcut',formatTitle:'去掉模板,<br>防御随之下降.',formatDesc:'用户指令保持不变, 仅移除 chat template 就可能显著降低防御成功率. 模型的安全决策依赖了外层格式.',withTemplate:'保留模板',withoutTemplate:'移除模板',fixedInstruction:'[ 同一条有害指令 ]',templateNote:'StrongReject DSR · DeepSeek-R1-Distill-Qwen-7B · Table 1',
  lexLabel:'词汇 shortcut',lexTitle:'关键词相同,<br>意图可以不同.',lexDesc:'敏感词也会出现在合理请求中. 用关键词决定是否拒答, 会造成对良性请求的过度拒绝.',example:'示意案例',benignExample:'「如何保护我的数据库, 防范',benignEnd:'攻击?」',keywordResponse:'依赖关键词的 shortcut',refuse:'拒答',intentResponse:'考虑实际意图的决策',help:'提供防御建议',
  zoom:'⤢ 放大查看',fig1:'Figure 1 · 移除格式模板后, WildJailbreak、StrongReject 与 WildChat 的防御表现出现差距. 此处使用论文原图.',
  methodLabel:'方法',methodTitle:'定位表面线索.<br>去耦安全决策.',methodDesc:'三个协同阶段, 在 SFT 与强化学习中分别缓解词汇 shortcut 和格式 shortcut.',labTitle:'走进 DESHORTCUT-ALIGN',schematic:'交互机制示意',stage1:'归因',stage2:'增强',stage3:'正则化',nextStage:'下一阶段',labNote:'机制示意 · 无在线模型推理',fullFramework:'完整框架',paperFig:'论文 Figure 3 ↗',
  fig3:'Figure 3 · TSS 定位拒答敏感 token; AGCA 保留这些 token 并反转意图; CCR 屏蔽格式 token, 在反事实输入下约束行为一致性. 此处使用论文原始方法图.',
  resultsLabel:'实验证据',resultsTitle:'更鲁棒的防御.<br>更少的过度拒答.',resultsDesc:'在三个模型骨干上, 对比模板鲁棒性、良性请求的误拒率与通用推理能力.',mainResults:'主要实验 · TABLE 1',compare:'相同模型骨干, 直接比较.',backbone:'模型骨干',standardGrpo:'标准 GRPO',
  resultsNote:'Δavg: 三个安全基准上, 保留模板与移除模板的 DSR 平均差值 (百分点). FRR: XSTest、OKTest 和 FalseReject 的平均误拒率. 推理能力: MATH-500、MMLU、LiveCodeBench 与 HumanEval 的平均 pass@1.',allResults:'所有方法与模型骨干',table1:'Table 1 · 论文完整结果. 安全指标以「保留模板 / 移除模板」呈现. 模板差距与误拒率越低越好, 推理准确率越高越好.',
  attacksLabel:'超越模板移除 · TABLE 4',attacksTitle:'面对不同类型的越狱攻击.',attacksDesc:'7B 模型的防御成功率. DeShortcut-Align (RL) 在 PAIR、GCG 与 TAP 上达到 97.7% 的平均 DSR.',attackBaseline:'标准 RL 的平均值为 92.7%. 具体攻击设置见论文.',ablationLabel:'两类组件的作用 · TABLE 2',ablationTitle:'两类 shortcut.<br>两种互补约束.',ablationCcr:'在 7B 的 RL 消融中, 模板差距从 3.63 上升至 12.94 个百分点.',ablationAgca:'相同设置下, 误拒率从 31.00% 上升至 70.00%.',ablationNote:'CCR 缓解格式依赖. AGCA 降低词汇引发的过度拒答.',
  takeawayLabel:'核心结论',takeawayTitle:'面向真实意图,<br>超越表面线索.',takeawayDesc:'DeShortcut-Align 针对两类可测量的失败模式提供了训练方案. 在评测设置下, 它提升模板鲁棒性, 并更好地保留模型的有用能力.',start:'查看实现与训练流程',citeLabel:'在此研究上继续探索',citeTitle:'引用',copy:'复制 BibTeX',footer:'浙江大学、蚂蚁集团与重庆蚂蚁消费金融有限公司的研究工作.',source:'页面源码 ↗',credits:'页面代码改编自 SCOPE, 并参考 ToolSpace 的交互展示. 图表与实验结果来自 DeShortcut-Align 论文.',originalFigure:'论文原图 · 完整分辨率',dialogHint:'滚动查看细节 · 按 Esc 关闭'
};
const originals = new Map($$('[data-t]').map(el => [el, el.innerHTML]));
function tr(en, cn) { return lang === 'zh' ? cn : en; }
function setLanguage(value) {
  lang = value;
  document.documentElement.lang = value === 'zh' ? 'zh-CN' : 'en';
  for (const [el, original] of originals) el.innerHTML = value === 'zh' ? (zh[el.dataset.t] ?? original) : original;
  $('#language').innerHTML = value === 'zh' ? '中文 <span>/ EN</span>' : 'EN <span>/ 中文</span>';
  $('#language').setAttribute('aria-label', value === 'zh' ? 'Switch to English' : '切换到中文');
  try { localStorage.setItem('deshortcut-language', value); } catch {}
  renderStage(); renderResults();
  document.dispatchEvent(new CustomEvent('scope:languagechange',{detail:{language:value}}));
  $('#copy-status').textContent = '';
}
$('#language').addEventListener('click', () => setLanguage(lang === 'en' ? 'zh' : 'en'));

const stages = [
  {kicker:['REFUSAL SENSITIVITY ATTRIBUTION','拒答敏感性归因'],title:['Which tokens sway a refusal?','哪些 token 影响拒答?'],description:['Mask one input token at a time. With the reference reasoning trajectory held fixed, measure the absolute log-likelihood shift on the final refusal tokens. Average across three template modes to obtain the Token Sensitivity Score (TSS).','逐个遮蔽输入 token. 固定参考 CoT, 测量最终拒答 token 的绝对对数似然变化, 再对三种模板模式取平均, 得到 Token Sensitivity Score (TSS).'],formula:'TSS(xᵢ) = ⅓ ∑ₘ TSSₘ(xᵢ)',note:['High TSS identifies candidate lexical triggers. Click a token to inspect the masking operation. Bars are schematic, not measured scores.','高 TSS 标出候选词汇触发因素. 点击 token 查看遮蔽操作. 柱形仅为机制示意, 并非实测分数.']},
  {kicker:['ATTRIBUTION-GUIDED CONTRASTIVE AUGMENTATION','归因引导的对比增强'],title:['Keep the words. Invert the intent.','保留词汇, 反转意图.'],description:['Retain the top-K refusal-sensitive tokens, but rewrite the harmful request into a benign context. Pair the rewrite with a helpful response and mix it into the SFT data and RL prompt pool.','保留拒答敏感性最高的 top-K token, 将有害请求改写到良性场景, 配对有帮助的回答, 并混入 SFT 数据和 RL prompt 池.'],formula:'Vₛₑₙₛ = {xᵢ : Rank(TSS(xᵢ)) ≤ K}',note:['The sensitive vocabulary stays; the target behavior changes with the context. Example adapted from Figure 3.','敏感词保持不变, 目标行为随上下文改变. 示例改编自 Figure 3.']},
  {kicker:['COUNTERFACTUAL CONSISTENCY REGULARIZATION','反事实一致性正则化'],title:['Make safety less template-dependent.','降低安全决策对模板的依赖.'],description:['Blind self-attention to formatting tokens to construct Xcf. In SFT, learn the safe target in both states. In RL, apply consistency to safety-verified rollouts, with an adaptive weight that limits the relative loss magnitude.','通过 attention blinding 隐藏格式 token, 构造 Xcf. SFT 在两种状态下学习安全目标. RL 对通过安全验证的 rollout 施加一致性约束, 并动态限制正则项的相对损失量级.'],formula:'Lcf = G · (−log πθ(y | Xcf))',note:['RL gate: G = 1(Rjudge > γ). The factual rollout supplies y; the counterfactual pass learns it.','RL gate: G = 1(Rjudge > γ). 真实输入下的 rollout 提供 y, 反事实前向过程学习该输出.']}
];
function renderStage() {
  const item = stages[stage], idx = lang === 'zh' ? 1 : 0;
  $('#stage-kicker').textContent = item.kicker[idx]; $('#stage-title').textContent = item.title[idx];
  $('#stage-description').textContent = item.description[idx]; $('#stage-formula').textContent = item.formula; $('#stage-note').textContent = item.note[idx];
  $$('[data-stage]').forEach((button, i) => {button.setAttribute('aria-selected', String(i === stage));button.tabIndex = i === stage ? 0 : -1;});
  $('#stage-panel').setAttribute('aria-labelledby', `tab-${stage}`);
  const host = $('#stage-visual');
  if (stage === 0) {
    host.innerHTML = `<div class="visual-tag"><span>${tr('01 / TOKEN PERTURBATION','01 / TOKEN 扰动')}</span><span>${tr('CLICK A TOKEN','点击 TOKEN')}</span></div><div class="tokens" id="mask-tokens">${['SQL','injection','steal','data'].map((token,i)=>`<button class="token ${i===1?'sensitive':''}" aria-pressed="false" data-token="${token}">${token}</button>`).join('')}</div><div class="visual-line"></div><div class="visual-box"><span class="box-label">${tr('FIXED REFERENCE REASONING','固定参考推理轨迹')}</span>y<sub>CoT</sub> → ${tr('final refusal tokens','最终拒答 token')} y<sub>ans</sub></div><div class="sensitivity-line" aria-hidden="true"><i style="--h:20%"></i><i class="hot" style="--h:90%"></i><i class="hot" style="--h:65%"></i><i style="--h:35%"></i></div><div class="visual-caption" id="mask-caption">${tr('Compare the refusal log-likelihood before and after masking.','比较遮蔽前后的拒答对数似然.')}</div><div class="visual-modes"><span>${tr('Bare instruction','裸指令')}</span><span>${tr('Pre-training template','预训练模板')}</span><span>${tr('Full template','完整模板')}</span></div>`;
    $$('[data-token]').forEach(button => button.addEventListener('click', () => {
      const wasMasked = button.getAttribute('aria-pressed') === 'true';
      $$('[data-token]').forEach(b => {b.textContent=b.dataset.token;b.classList.remove('masked');b.setAttribute('aria-pressed','false');});
      if (!wasMasked) {button.textContent='[MASK]';button.classList.add('masked');button.setAttribute('aria-pressed','true');}
      $('#mask-caption').textContent = wasMasked ? tr('Original prompt restored.','已恢复原始 prompt.') : tr(`Mask “${button.dataset.token}”; hold the remaining input and reference reasoning fixed.`,`遮蔽「${button.dataset.token}」, 其余输入与参考推理轨迹保持不变.`);
    }));
  } else if (stage === 1) {
    host.innerHTML = `<div class="visual-tag"><span>${tr('02 / INTENTION INVERSION','02 / 意图反转')}</span><span>AGCA</span></div><div class="visual-box"><span class="box-label">${tr('HARMFUL QUERY · REFUSAL TARGET','有害请求 · 拒答目标')}</span>${tr('An <em>SQL injection</em> attempt to <em>steal data</em>.','以 <em>SQL injection</em> 为手段 <em>steal data</em> 的请求.')}</div><div class="visual-line"></div><div class="tokens"><span class="token sensitive">SQL</span><span class="token sensitive">injection</span><span class="token sensitive">steal</span><span class="token sensitive">data</span></div><div class="visual-line"></div><div class="visual-box safe"><span class="box-label">${tr('BENIGN REWRITE · HELPFUL TARGET','良性改写 · 有帮助的回答')}</span>${tr('How can I protect my database from an <em>SQL injection</em> attempt to <em>steal</em> user <em>data</em>?','如何保护数据库, 防范使用 <em>SQL injection</em> 来 <em>steal</em> 用户 <em>data</em> 的攻击?')}</div><div class="visual-caption">${tr('Same sensitive vocabulary → different intent → different target.','相同敏感词 → 不同意图 → 不同目标行为.')}</div>`;
  } else {
    host.innerHTML = `<div class="visual-tag"><span>${tr('03 / ATTENTION BLINDING','03 / ATTENTION BLINDING')}</span><span>CCR</span></div><div class="branch"><div class="visual-box"><span class="box-label">${tr('FACTUAL INPUT X','真实输入 X')}</span><div class="tokens"><span class="token">&lt;fmt&gt;</span><span class="token sensitive">${tr('Intent','意图')}</span></div></div><div class="visual-box"><span class="box-label">${tr('COUNTERFACTUAL Xcf','反事实输入 Xcf')}</span><div class="tokens"><span class="token blinded" id="blind-token">&lt;fmt&gt;</span><span class="token sensitive">${tr('Intent','意图')}</span></div></div></div><div class="visual-line"></div><div class="consistency"><span>πθ(y | X)</span><b>⇌</b><span>πθ(y | Xcf)</span></div><div class="visual-line"></div><div class="visual-box safe"><span class="box-label">${tr('SAFETY-GATED CONSISTENCY','经安全 gate 筛选的一致性学习')}</span>${tr('Verified rollout y → counterfactual learning<br>Adaptive λdyn balances CCR and policy gradients.','经验证的 rollout y → 反事实学习<br>动态 λdyn 平衡 CCR 与 policy gradient.')}</div><div class="visual-caption">${tr('Formatting cues are hidden; instruction tokens remain accessible.','屏蔽格式线索, 保留指令 token 的可见性.')}</div>`;
  }
}
$$('[data-stage]').forEach(button => {
  button.addEventListener('click', () => {stage=Number(button.dataset.stage);renderStage();});
  button.addEventListener('keydown', event => {
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();stage=event.key==='Home'?0:event.key==='End'?2:(stage+(event.key==='ArrowRight'?1:2))%3;
    renderStage();$(`#tab-${stage}`).focus();
  });
});
$('#next-stage').addEventListener('click',()=>{stage=(stage+1)%3;renderStage();});

$$('[data-template]').forEach(button=>button.addEventListener('click',()=>{
  const stripped=button.dataset.template==='without';
  $$('[data-template]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  $('#prompt-shell').classList.toggle('stripped',stripped);
  $('#template-value').textContent=stripped?'93.18%':'100.00%';$('#template-bar').style.width=stripped?'93.18%':'100%';
}));

const results = {
  '7b': {base:[6.54,74.33,63.85],ours:[3.63,31.00,65.80],safety:[99.91,97.07]},
  '14b':{base:[11.65,42.33,73.94],ours:[3.69,20.33,76.56],safety:[99.53,95.01]},
  '4b':{base:[13.46,34.00,77.72],ours:[5.38,18.67,78.45],safety:[99.55,98.29]}
};
function renderResults(){
  const data=results[$('#model').value];
  const names=[tr('Template gap Δavg','模板差距 Δavg'),tr('False rejection rate','误拒率'),tr('Reasoning accuracy','推理准确率')];
  $('#result-charts').innerHTML=names.map((name,i)=>{
    const gain=i===2?`+${(data.ours[i]-data.base[i]).toFixed(2)}`:`−${((1-data.ours[i]/data.base[i])*100).toFixed(1)}%`;
    const max=i===0?16:100;
    return `<article class="chart-card"><h4 class="chart-title">${name}</h4><p class="chart-direction">${i===2?tr('Higher is better ↑','越高越好 ↑'):tr('Lower is better ↓','越低越好 ↓')}</p><p class="chart-gain">${gain} <small>${i===2?tr('points','分'):tr('relative','相对降低')}</small></p><div class="horizontal-bar base" aria-label="${tr('Standard GRPO','标准 GRPO')}: ${data.base[i].toFixed(2)}"><span class="bar-space"><span class="bar-fill" style="--value:${data.base[i]/max*100}%;display:block"></span></span><b>${data.base[i].toFixed(2)}</b></div><div class="horizontal-bar ours" aria-label="DeShortcut-Align: ${data.ours[i].toFixed(2)}"><span class="bar-space"><span class="bar-fill" style="--value:${data.ours[i]/max*100}%;display:block"></span></span><b>${data.ours[i].toFixed(2)}</b></div></article>`;
  }).join('');
  $('#safety-note').textContent=tr(`Safety context: with-template weighted DSR is ${data.safety[0].toFixed(2)}% for standard GRPO and ${data.safety[1].toFixed(2)}% for DeShortcut-Align. Robustness and helpfulness gains should be read alongside this tradeoff.`,`安全表现: 保留模板的加权 DSR, 标准 GRPO 为 ${data.safety[0].toFixed(2)}%, DeShortcut-Align 为 ${data.safety[1].toFixed(2)}%. 模板鲁棒性与误拒率的改善需结合这一权衡理解.`);
}
$('#model').addEventListener('change',renderResults);

const dialog=$('#figure-dialog');
$$('[data-zoom]').forEach(button=>button.addEventListener('click',()=>{
  $('#zoom-image').src=button.dataset.zoom;$('#zoom-image').alt=$('img',button).alt;dialog.showModal();
}));
$('#close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
$('#copy').addEventListener('click',async()=>{
  const text=$('#bibtex').textContent;
  try{await navigator.clipboard.writeText(text);$('#copy-status').textContent=tr('BibTeX copied.','BibTeX 已复制.');}
  catch{const range=document.createRange();range.selectNodeContents($('#bibtex'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);$('#copy-status').textContent=tr('Citation selected. Press Ctrl+C or ⌘C to copy.','已选中引用内容. 按 Ctrl+C 或 ⌘C 复制.');}
});
function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;$('#progress').style.transform=`scaleX(${max>0?scrollY/max:0})`;}
window.addEventListener('scroll',updateProgress,{passive:true});window.addEventListener('resize',updateProgress);
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){$$('nav a').forEach(a=>a.classList.toggle('active',a.hash===`#${entry.target.id}`));}}),{rootMargin:'-15% 0px -65% 0px'});
$$('main section[id]').forEach(section=>observer.observe(section));
try {lang=localStorage.getItem('deshortcut-language')==='zh'?'zh':'en';}catch{}
setLanguage(lang);updateProgress();
const menu=$('.menu-toggle');
menu.addEventListener('click',()=>{const open=$('#navigation').classList.toggle('menu-open');menu.setAttribute('aria-expanded',String(open));});
$$('#navigation a').forEach(a=>a.addEventListener('click',()=>{$('#navigation').classList.remove('menu-open');menu.setAttribute('aria-expanded','false');}));

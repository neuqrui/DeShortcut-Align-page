'use strict';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
let lang = 'en';
let stage = 0;
const zh = {
  navMot:'研究动机',navMethod:'方法',navResults:'实验结果',navCite:'引用',navProblem:'问题图解',navTakeaway:'核心结论',chip1:'定位 shortcut',chip2:'去耦表面线索',chip3:'一致的安全决策',compareBoth:'并排对比',replayBars:'↻ 重播动画',viewOriginal:'查看论文原图',problemKicker:'以数据呈现问题 · FIGURE 1',problemTitle:'相同的指令, 不同的防御.',problemDesc:'仅移除格式模板, 观察不同对齐方法的防御成功率如何变化.',problemUnit:'防御成功率 (%) ↑',problemImpact:'移除外层模板, 暴露对 shortcut 的依赖.',problemSource:'Figure 1 · 按原图标注转录, 保留一位小数. 对比原图红色的预训练模板与蓝色的无模板条件, 省略 Base 的额外 post-training template 柱形. 点击柱子查看数值, 使用图例选择方法. 纵轴从零开始.',eyebrow:'超越表面线索的安全对齐',
  paperTitle:'去耦虚假捷径, 实现大推理模型的鲁棒安全对齐',corresponding:'† 通讯作者',paper:'阅读论文',code:'代码与数据',explore:'探索方法',
  heroDesc:'安全的推理模型需要理解模板与关键词背后的意图.<br>  DeShortcut-Align 降低对 shortcut 的依赖, 同时保留提供帮助的能力.',
  inputLabel:'同一条用户指令',intent:'用户意图',safeDecision:'鲁棒的安全决策',usefulAnswer:'有帮助的良性回答',
  metric1:'模板差距降低',metric2:'误拒率降低',metric3:'越狱攻击防御率',metric1Note:'7B · SFT 对比标准 SFT',metric2Note:'7B · GRPO 对比标准 GRPO',metric3Note:'7B · RL · PAIR / GCG / TAP',metricSource:'论文 Table 1 与 Table 4 · 相对降幅对应上方所列实验设置.',
  motLabel:'研究动机',motTitle:'看似安全,<br> 也可能依赖 shortcut.',motDesc:'接近满分的安全得分可能掩盖脆弱的行为. 我们发现两类表面线索, 使安全对齐偏离用户的真实意图.',
  formatLabel:'格式 shortcut',formatTitle:'去掉模板,<br> 防御随之下降.',formatDesc:'用户指令保持不变, 仅移除 chat template 就可能显著降低防御成功率. 模型的安全决策依赖了外层格式.',withTemplate:'保留模板',withoutTemplate:'移除模板',fixedInstruction:'[ 同一条有害指令 ]',templateNote:'StrongReject DSR · DeepSeek-R1-Distill-Qwen-7B · Table 1',
  lexLabel:'词汇 shortcut',lexTitle:'关键词相同,<br> 意图可以不同.',lexDesc:'敏感词也会出现在合理请求中. 用关键词决定是否拒答, 会造成对良性请求的过度拒绝.',example:'示意案例',benignExample:'「如何保护我的数据库, 防范',benignEnd:'攻击?」',keywordResponse:'依赖关键词的 shortcut',refuse:'拒答',intentResponse:'考虑实际意图的决策',help:'提供防御建议',
  zoom:'⤢ 放大查看',fig1:'Figure 1 · 移除格式模板后, WildJailbreak、StrongReject 与 WildChat 的防御表现出现差距. 此处使用论文原图.',
  methodLabel:'方法',methodTitle:'定位表面线索.<br> 去耦安全决策.',methodDesc:'三个协同阶段, 在 SFT 与强化学习中分别缓解词汇 shortcut 和格式 shortcut.',labTitle:'走进 DESHORTCUT-ALIGN',schematic:'交互机制示意',stage1:'归因',stage2:'增强',stage3:'正则化',nextStage:'下一阶段',labNote:'机制示意 · 无在线模型推理',fullFramework:'完整框架',paperFig:'论文 Figure 3 ↗',
  fig3:'Figure 3 · TSS 定位拒答敏感 token; AGCA 保留这些 token 并反转意图; CCR 屏蔽格式 token, 在反事实输入下约束行为一致性. 此处使用论文原始方法图.',
  resultsLabel:'实验证据',resultsTitle:'更鲁棒的防御.<br> 更少的过度拒答.',resultsDesc:'在三个模型骨干上, 对比模板鲁棒性、良性请求的误拒率与通用推理能力.',mainResults:'主要实验 · TABLE 1',compare:'相同模型骨干, 直接比较.',backbone:'模型骨干',standardGrpo:'标准 GRPO',
  resultsNote:'Δavg: 三个安全基准上, 保留模板与移除模板的 DSR 平均差值 (百分点). FRR: XSTest、OKTest 和 FalseReject 的平均误拒率. 推理能力: MATH-500、MMLU、LiveCodeBench 与 HumanEval 的平均 pass@1.',allResults:'所有方法与模型骨干',table1:'Table 1 · 论文完整结果. 安全指标以「保留模板 / 移除模板」呈现. 模板差距与误拒率越低越好, 推理准确率越高越好.',
  attacksLabel:'超越模板移除 · TABLE 4',attacksTitle:'面对不同类型的越狱攻击.',attacksDesc:'7B 模型的防御成功率. DeShortcut-Align (RL) 在 PAIR、GCG 与 TAP 上达到 97.7% 的平均 DSR.',attackBaseline:'标准 RL 的平均值为 92.7%. 具体攻击设置见论文.',ablationLabel:'两类组件的作用 · TABLE 2',ablationTitle:'两类 shortcut.<br> 两种互补约束.',ablationCcr:'在 7B 的 RL 消融中, 模板差距从 3.63 上升至 12.94 个百分点.',ablationAgca:'相同设置下, 误拒率从 31.00% 上升至 70.00%.',ablationNote:'CCR 缓解格式依赖. AGCA 降低词汇引发的过度拒答.',
  takeawayLabel:'核心结论',takeawayTitle:'面向真实意图,<br> 超越表面线索.',takeawayDesc:'DeShortcut-Align 针对两类可测量的失败模式提供了训练方案. 在评测设置下, 它提升模板鲁棒性, 并更好地保留模型的有用能力.',start:'查看实现与训练流程',citeLabel:'在此研究上继续探索',citeTitle:'引用',copy:'复制 BibTeX',footer:'浙江大学、蚂蚁集团与重庆蚂蚁消费金融有限公司的研究工作.',source:'页面源码 ↗',credits:'页面代码改编自 SCOPE, 并参考 ToolSpace 的交互展示. 图表与实验结果来自 DeShortcut-Align 论文.',originalFigure:'论文原图 · 完整分辨率',dialogHint:'滚动查看细节 · 按 Esc 关闭'
};

Object.assign(zh,{
navMot:'概览',navDynamics:'训练过程',navAnalysis:'实验分析',navResources:'资源',code:'Code',data:'Data',replayIntro:'↻ 重播汇聚动画',metricSource:'Tables 1 & 4 · DeepSeek-R1-Distill-Qwen-7B',
problemSource:'Figure 1 · 六种对齐方法在保留 / 移除预训练模板下的防御成功率.',labNote:'归因 → 增强 → 一致性约束',
tokenEvidenceLabel:'查看真实归因结果 · FIGURES 12 & 13',tokenEvidenceTitle:'同一个 token, 在不同模板下影响不同.',tokenEvidenceDesc:'单一模板模式可能过度放大局部线索. 对三种模式的敏感性取平均, 可以寻找跨模板持续影响拒答的候选 token.',tokenEvidenceCaption:'Figure 12 · Mode A、B、C 下的 token 敏感性.',agcaDetails:'展开论文中的完整对比增强案例',agcaCaption:'Figure 13 · 保留选中的词汇, 将意图改写为学术讨论.',
dynamicsLabel:'训练动态',dynamicsTitle:'保留持续学习的信号.',dynamicsDesc:'标准 GRPO 从格式 shortcut 转向词汇 shortcut, 随后逐渐失去优化信号. DeShortcut-Align 改变了这条训练轨迹.',standardDynamics:'奖励趋于饱和, 误拒率升高, policy gradient 信号逐渐衰减.',oursDynamics:'AGCA 与 CCR 降低 shortcut 依赖, 同时保留更强的学习信号.',phase1Title:'格式 shortcut',phase1Desc:'奖励快速上升, 模型建立模板与拒答之间的关联.',phase2Title:'词汇 shortcut',phase2Desc:'模板差距缩小, 但敏感词越来越容易触发误拒.',phase3Title:'梯度匮乏',phase3Desc:'奖励饱和后, 组内差异不足, 后续行为改进受限.',optLabel:'动态正则化 · FIGURE 7',optTitle:'平衡一致性与探索.',optDesc:'动态系数在 policy update 过程中调整反事实损失. 一致性损失逐步收敛, 训练奖励趋于稳定.',optCaption:'Figure 7 · 动态权重、一致性损失与训练奖励.',evalDetails:'指标与评测设置',
analysisLabel:'深入分析',analysisTitle:'行为改变在哪里, 又为何有效.',analysisDesc:'组件消融、归因策略比较与成对意图实验, 将主要结果与方法机制联系起来.',componentLabel:'组件消融 · TABLE 2',componentTitle:'两类 shortcut, 分别约束.',componentDesc:'移除 CCR 会恢复模板依赖, 移除 AGCA 会恢复过度拒答. 完整方法同时协调两者.',gapPoints:'模板差距 · 百分点',frrPercent:'误拒率 · %',ablationCaption:'Table 2 · DeepSeek-R1-Distill-Qwen-7B 的 SFT 与 RL 消融.',heuristicLabel:'归因策略 · TABLE 3',heuristicTitle:'找到真正影响决策的 token.',heuristicDesc:'在 AGCA 的随机、梯度、注意力与 TSS 选词对比中, TSS 获得最低的误拒率.',heuristicUnit:'平均误拒率 (%) ↓ · 7B SFT',
pairedLabel:'成对意图实验 · TABLE 13',pairedTitle:'相同敏感词,<br> 更好地区分良性意图.',pairedDesc:'将 150 条有害 WildJailbreak 请求, 配对为保留相同敏感词的 150 条良性改写. DeShortcut-Align 大幅降低误拒, 并保留对有害请求的防御.',harmfulDefense:'有害请求防御率 ↑',benignRefusals:'良性请求误拒率 ↓',pairedGain:'误拒率减少 62.00 个百分点',
attacksLabel:'越狱鲁棒性 · TABLE 4',attacksTitle:'应对不同攻击类型.',attacksDesc:'在 PAIR、GCG 和 TAP 上, RL 版本达到 97.7% 的平均防御成功率, 标准 RL 为 92.7%.',klLabel:'更长的推理 · FIGURE 6',klTitle:'对齐效果延伸到拒答开头之后.',klDesc:'相对基座模型的 token 级 KL divergence, 在更长的生成轨迹上保持较高水平, 与持续存在的对齐行为变化相一致.',klCaption:'Figure 6 · 随 token 位置变化的策略差异.',
extendedLabel:'扩展实验',extendedTitle:'更多模型, 更完整的评估.',extendedDesc:'展开查看各实验的完整结果.',seedDetails:'三个训练随机种子 · Qwen3-1.7B',seedDesc:'在随机种子 0、1、2 上, 平均模板差距从 23.80 降至 11.92 个百分点; 误拒率从 34.11% 降至 27.89%; 推理准确率从 64.92 升至 67.44.',optimizerDetails:'跨 GRPO 与 PPO 的泛化',optimizerDesc:'同一正则化方法在两种优化器下均提升模板鲁棒性. PPO 的模板差距从 17.41 降至 5.73 个百分点, 误拒率从 79.33% 降至 34.67%.',parameterDetails:'正则化权重与 token 遮蔽长度',parameterDesc:'论文评估了 SFT 系数 α、RL 系数 λ 与连续 token 遮蔽长度. 在报告的对比中, 单 token 遮蔽取得最佳的安全性与误拒率平衡.',baselineDetails:'更完整的安全对齐基线',validatorDetails:'对比数据质量与评测器一致性',validatorDesc:'论文使用独立模型和人工验证生成的良性对比请求, 并在 150 个样例上比较 Llama Guard 与人工专家的安全判断.',
resourcesLabel:'研究资源',resourcesTitle:'复现、检查与继续探索.',resourcesDesc:'训练实现、对比数据、归因流程及评测方案均已发布在研究仓库中.',resourceCode:'Code',resourceCodeDesc:'训练实现, 以及 SFT、PPO、GRPO 启动脚本.',resourceData:'Data',resourceDataDesc:'归因数据池, AGCA 良性 SFT / RL 数据.',resourcePipeline:'归因与增强流程',resourcePipelineDesc:'计算 TSS、选择敏感 token、生成对比样例.'
});

Object.assign(zh, {
  scrollBenchmarks:'↔ 左右滑动查看全部评测列', reasoningRetained:'MATH-500 · MMLU · LiveCodeBench · HumanEval',
  attackMean:'平均',attackNote:'Table 4 · 防御成功率 (%) ↑ · 7B · 坐标从零开始',
  validatorDesc:'独立模型与人工验证良性对比数据, 并检查安全评测器的可靠性.',validatorTitle:'对比样例是否保持良性?',judgeTitle:'评测器与人工判断是否一致?',validatorPipeline:'验证流程',benignAccuracy:'良性验证准确率',singleStage:'单阶段',humanExpert:'人工专家',twoLayer:'两层过滤',validatorCaption:'AGCA 生成的良性请求 · 验证准确率 (%)',judgeModel:'模型',rawAgreement:'原始一致率',basePolicy:'基础策略',judgeCaption:'150 个采样样例 · DSR 与逐项标签一致率 (%)',
  paperTitle:'<span class="title-de">去耦</span>虚假<span class="title-shortcut">捷径</span>, 实现大推理模型的鲁棒安全<span class="title-align">对齐</span>',
  titleHint:'↕ 向上移动聚合 · 向下移动分散 · 点击切换', compare:'鲁棒性、误拒率与推理能力', allBenchmarks:'展开误拒率分项',
  tableKey:'加粗: 对齐方法最优值 · 防御率: 有模板 / 无模板', tableFootnote:'Table 1 · 数值单位为 %. Δavg 是平均模板差距, 单位为百分点 (↓). FRR 为平均误拒率 (↓), Acc 为平均推理 pass@1 (↑). 加权防御率使用有模板条件. 最优值不含 Base.',
  componentDesc:'移除 CCR 后, 模板依赖上升; 移除 AGCA 后, 误拒率回升.', heuristicTitle:'选择影响决策的 token.', heuristicDesc:'在 SFT 的归因策略对比中, TSS 取得最低误拒率.',
  ablationNote:'7B · Δavg: 模板差距 (百分点) · FRR: 误拒率 (%) · DSR: 加权防御率 (%) · Acc: 推理 (%)', strategyNote:'Table 3 · DSR: 加权防御率 (↑); FRR: 平均误拒率 (↓). 单位为 %.',
  causalLabel:'SHORTCUT 的形成 · 3D 过程演示', causalTitle:'学习信号如何逐渐消失.', conceptOnly:'概念示意', causalAxis:'每根柱代表一个 rollout 的奖励 · 高度仅为示意', gradientSignal:'策略梯度信号', processProgress:'训练过程', causalCaption:'格式线索 → 词汇触发 → 奖励饱和, 组内差异消失. 基于论文 shortcut 假说的机制示意; 实测曲线见最后的训练动态部分.'
});
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
  {kicker:['REFUSAL SENSITIVITY ATTRIBUTION','拒答敏感性归因'],title:['Which tokens sway a refusal?','哪些 token 影响拒答?'],description:['Mask one input token at a time. With the reference reasoning trajectory held fixed, measure the absolute log-likelihood shift on the final refusal tokens. Average across three template modes to obtain the Token Sensitivity Score (TSS).','逐个遮蔽输入 token. 固定参考 CoT, 测量最终拒答 token 的绝对对数似然变化, 再对三种模板模式取平均, 得到 Token Sensitivity Score (TSS).'],formula:'TSS(xᵢ) = ⅓ ∑ₘ TSSₘ(xᵢ)',note:['Mask tokens, compare refusal likelihoods, then aggregate across the three template modes.','遮蔽 token, 比较拒答似然, 再对三种模板模式取平均.']},
  {kicker:['ATTRIBUTION-GUIDED CONTRASTIVE AUGMENTATION','归因引导的对比增强'],title:['Keep the words. Invert the intent.','保留词汇, 反转意图.'],description:['Retain sensitive vocabulary, invert the intent, and mix the helpful contrast into training.','保留敏感词, 反转意图, 将有帮助的对比样例混入训练.'],formula:'Vₛₑₙₛ = {xᵢ : Rank(TSS(xᵢ)) ≤ K}',note:['The sensitive vocabulary stays; the target behavior changes with the context. Example adapted from Figure 3.','敏感词保持不变, 目标行为随上下文改变. 示例改编自 Figure 3.']},
  {kicker:['COUNTERFACTUAL CONSISTENCY REGULARIZATION','反事实一致性正则化'],title:['Make safety less template-dependent.','降低安全决策对模板的依赖.'],description:['Start with GRPO. Reuse verified factual rollouts under a template-blinded input, then add an adaptively weighted consistency loss.','从 GRPO 主循环出发, 在屏蔽格式的输入下学习经验证的 rollout, 并加入动态加权的一致性损失.'],formula:'Lcf = G · (−log πθ(y | Xcf))',note:['Only verified factual rollouts supply the target for the counterfactual pass.','仅使用经安全验证的真实 rollout, 为反事实前向过程提供学习目标.']}
];
function renderStage() {
  window.DeShortcutAttribution?.stop();
  window.DeShortcutMethod?.stop();
  $('.method-lab').dataset.methodStage=stage;
  const item = stages[stage], idx = lang === 'zh' ? 1 : 0;
  $('#stage-kicker').textContent = item.kicker[idx]; $('#stage-title').textContent = item.title[idx];
  $('#stage-description').textContent = item.description[idx]; $('#stage-formula').innerHTML = window.DeShortcutMath.render(['tss','vocabulary','counterfactual'][stage],true); $('#stage-note').textContent = item.note[idx];
  $$('[data-stage]').forEach((button, i) => {button.setAttribute('aria-selected', String(i === stage));button.tabIndex = i === stage ? 0 : -1;});
  $('#stage-panel').setAttribute('aria-labelledby', `tab-${stage}`);
  const host = $('#stage-visual');
  if (stage === 0) {
    window.DeShortcutAttribution.mount(host,lang);
  } else {
    window.DeShortcutMethod.mount(host,lang,stage);
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

function renderResults(){window.DeShortcutTables.render(lang);}
$('#model').addEventListener('change',renderResults);
$('#table-detail').addEventListener('change',renderResults);
$$('[data-ablation]').forEach(button=>button.addEventListener('click',()=>{window.DeShortcutTables.setAblation(button.dataset.ablation);renderResults();}));
$$('[data-attack-metric]').forEach(button=>button.addEventListener('click',()=>{window.DeShortcutTables.setAttackMetric(button.dataset.attackMetric);window.DeShortcutTables.renderAttacks(lang);}));

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
try {lang=localStorage.getItem('deshortcut-language')==='zh'?'zh':'en';}catch{}
setLanguage(lang);updateProgress();
const menu=$('.menu-toggle');
menu.addEventListener('click',()=>{const open=$('#navigation').classList.toggle('menu-open');menu.setAttribute('aria-expanded',String(open));});
$$('#navigation a').forEach(a=>a.addEventListener('click',()=>{$('#navigation').classList.remove('menu-open');menu.setAttribute('aria-expanded','false');}));

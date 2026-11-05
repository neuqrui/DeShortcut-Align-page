/* Table 1, arXiv:2609.34896v1, p.7. Each row: method, three DSR pairs,
   weighted DSR, mean gap, three FRRs, mean FRR, four reasoning scores, mean. */
window.DeShortcutTables = (() => {
  const main = {
    '7b': { name:'DeepSeek-R1-Distill-Qwen-7B', rows:[
      ['Base',45.20,49.20,35.14,34.51,58.92,51.89,46.42,1.22,0,1,4,1.67,92.80,48.62,39.76,89.63,67.70],
      ['SFT',84.80,77.60,99.04,77.74,86.76,76.76,90.20,12.83,56,24,66,48.67,90.20,46.49,31.33,80.49,62.13],
      ['GRPO',100,97.20,100,93.18,99.73,89.73,99.91,6.54,70,59,94,74.33,91.80,43.91,34.94,84.76,63.85],
      ['Ours (SFT)',76,76.80,99.36,96.49,82.97,74.32,86.11,3.57,39,15,47,33.67,91,40.61,34.34,85.37,62.83],
      ['Ours (GRPO)',97.20,95.20,98.61,94.04,95.41,91.08,97.07,3.63,29,17,47,31,92.40,45.03,39.16,86.59,65.80]
    ]},
    '14b': { name:'DeepSeek-R1-Distill-Qwen-14B', rows:[
      ['Base',57.20,60.40,50.48,63.58,75.14,62.70,60.94,-1.29,0,4,5,3,93.20,67.65,50,88.41,74.82],
      ['SFT',92,85.20,99.79,96.91,94.32,81.35,95.37,7.55,43,25,67,45,90,63.48,40.36,76.22,67.52],
      ['GRPO',100,95.20,99.68,85.20,98.92,83.24,99.53,11.65,34,23,70,42.33,92.80,64.55,49.40,89.02,73.94],
      ['Ours (SFT)',80,77.20,99.68,97.87,86.22,78.92,88.63,3.97,21,6,41,22.67,89.60,61.03,43.98,86.59,70.30],
      ['Ours (GRPO)',93.60,92.40,99.04,96.70,92.40,84.86,95.01,3.69,11,9,41,20.33,92.80,74.40,50,89.02,76.56]
    ]},
    '4b': { name:'Qwen3-4B · thinking', rows:[
      ['Base',62.80,58,92.97,65.18,56.49,47.84,70.75,13.75,8,10,19,12.33,95.80,82.51,53.01,95.73,81.76],
      ['SFT',94,88.40,99.36,82.11,91.08,66.49,94.81,15.81,41,25,63,43,93.80,75.61,44.58,89.63,75.91],
      ['GRPO',100,96,100,90.10,98.65,72.16,99.55,13.46,26,21,55,34,95.80,73.70,48.10,93.29,77.72],
      ['Ours (SFT)',80.40,80,99.68,80.51,84.32,65.14,88.13,12.92,27,11,45,27.67,94.20,75.88,48.19,93.90,78.04],
      ['Ours (GRPO)',99.20,97.60,100,91.69,95.68,89.46,98.29,5.38,7,4,45,18.67,94.40,74.40,53.61,91.40,78.45]
    ]}
  };
  const ablations = {
    sft:[['SFT',90.20,12.83,48.67,62.13],['w/o CCR',85.86,14.35,28,63.20],['w/o AGCA',91.06,4.82,48,60.71],['All (Ours)',86.11,3.57,33.67,62.83]],
    rl:[['GRPO',99.91,6.54,74.33,63.85],['w/o CCR',98.40,12.94,28.67,65.09],['w/o AGCA',99.27,2.64,70,63.01],['All (Ours)',97.07,3.63,31,65.80]]
  };
  const strategies=[['Standard SFT',84.80,99.04,86.76,90.20,48.67],['+ Random',62.80,98.40,79.46,80.22,35.33],['+ Gradient',61.60,97.44,81.35,80.13,34.33],['+ Attention',71.20,99.04,85.68,85.31,32.67],['+ TSS (Ours)',76,98.87,82.70,85.86,28]];
  const attacks=[['RealSafe-R1',94,89,98,93.7],['STAR-1',84,84,92,86.7],['SFT',70,92,86,82.7],['Ours (SFT)',86,95,94,91.7],['RL',96,84,98,92.7],['Ours (RL)',100,95,98,97.7]];
  let setting='rl',attackMetric='mean';
  function renderAttacks(language='en') {
    const cn=language==='zh',column={pair:1,gcg:2,tap:3,mean:4}[attackMetric];
    const host=document.querySelector('#attack-chart');
    host.setAttribute('aria-label',`${cn?'防御成功率':'Defense success rate'} · ${attackMetric.toUpperCase()} · %`);
    host.innerHTML=attacks.map(row=>`<div class="attack-result-row ${row[0].includes('Ours')?'ours':''}"><span>${row[0]}</span><div class="attack-track"><i style="width:${row[column]}%"></i></div><strong>${row[column].toFixed(1)}</strong></div>`).join('');
    const gain=attacks[5][column]-attacks[4][column];
    document.querySelector('.attack-chart-readout').textContent=cn?`Ours (RL) ${attacks[5][column].toFixed(1)}% · 标准 RL ${attacks[4][column].toFixed(1)}% · 提升 ${gain.toFixed(1)} 个百分点`:`Ours (RL) ${attacks[5][column].toFixed(1)}% · Standard RL ${attacks[4][column].toFixed(1)}% · +${gain.toFixed(1)} pp`;
    document.querySelectorAll('[data-attack-metric]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.attackMetric===attackMetric)));
  }
  function render(language='en') {
    const t=(en,zh)=>language==='zh'?zh:en;
    const detailed=document.querySelector('#table-detail').checked;
    const model=document.querySelector('#model').value;
    const colCount=detailed?15:12;
    const frColumns=detailed?['XSTest','OKTest','FR-test',t('Mean ↓','均值 ↓')]:[t('FRR ↓','误拒率 ↓')];
    const reColumns=['MATH-500','MMLU','LiveCodeBench','HumanEval',t('Mean ↑','均值 ↑')];
    const fmt=n=>n.toFixed(2);
    const head=`<caption class="sr-only">${t('Table 1. Main results across all methods and backbones.','表 1. 所有方法与模型的主要实验结果.')}</caption><thead><tr class="table-groups"><th rowspan="2" scope="col">${t('Method','方法')}</th><th colspan="4" scope="colgroup">${t('Template robustness · DSR ↑','模板鲁棒性 · 防御率 ↑')}</th><th rowspan="2" scope="col">Δavg ↓</th><th colspan="${frColumns.length}" scope="colgroup">${t('Over-refusal ↓','过度拒答 ↓')}</th><th colspan="${reColumns.length}" scope="colgroup">${t('Reasoning ↑','推理能力 ↑')}</th></tr><tr>${['WildJailbreak','StrongReject','WildChat',t('Weighted','加权'),...frColumns,...reColumns].map(x=>`<th scope="col">${x}</th>`).join('')}</tr></thead>`;
    const body=Object.entries(main).filter(([key])=>model==='all'||key===model).map(([key,data])=>{
      const aligned=data.rows.slice(1);
      const cell=(r,i)=>`<td class="${[8,12,17].includes(i)?'metric-cell':''}">${(r[0]!=='Base'&&r[i]===([8,9,10,11,12].includes(i)?Math.min:Math.max)(...aligned.map(row=>row[i])))?`<strong>${fmt(r[i])}</strong>`:fmt(r[i])}</td>`;
      return `<tbody data-backbone="${key}"><tr class="model-row"><th colspan="${colCount}" scope="rowgroup"><span class="model-name">${data.name}</span></th></tr>${data.rows.map(r=>`<tr class="${r[0].includes('Ours')?'ours-row':''}"><th scope="row">${r[0]}</th>${[1,3,5].map(i=>`<td class="dsr-pair">${[i,i+1].map(j=>(r[0]!=='Base'&&r[j]===Math.max(...aligned.map(a=>a[j]))?`<strong>${fmt(r[j])}</strong>`:fmt(r[j]))).join('<span class="pair-divider"> / </span>')}<small>(${fmt(r[i]-r[i+1])})</small></td>`).join('')}${[7,8,...(detailed?[9,10,11,12]:[12]),13,14,15,16,17].map(i=>cell(r,i)).join('')}</tr>`).join('')}</tbody>`;
    }).join('');
    const table=document.querySelector('#main-results-table');table.innerHTML=head+body;table.classList.toggle('is-detailed',detailed);
    function smallTable(id,headers,rows,directions,precision=2) {
      const numeric=rows.map(r=>r.slice(1));
      document.querySelector(id).innerHTML=`<thead><tr>${headers.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr class="${/Ours/.test(r[0])?'ours-row':''}"><th scope="row">${r[0]}</th>${r.slice(1).map((v,i)=>`<td>${v===(directions[i]==='min'?Math.min:Math.max)(...numeric.map(n=>n[i]))?`<strong>${v.toFixed(precision)}</strong>`:v.toFixed(precision)}</td>`).join('')}</tr>`).join('')}</tbody>`;
    }
    smallTable('#ablation-table',[t('Setting','设置'),'DSR ↑','Δavg ↓','FRR ↓','Acc ↑'],ablations[setting],['max','min','min','max']);
    smallTable('#strategy-table',[t('Strategy','策略'),'WJ ↑','SR ↑','WC ↑','DSR ↑','FRR ↓'],strategies,['max','max','max','max','min']);
    renderAttacks(language);
    document.querySelector('#model option[value="all"]').textContent=t('All three backbones','全部三个模型');
  }
  function setAblation(value) {setting=value;document.querySelectorAll('[data-ablation]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.ablation===value)));}
  function setAttackMetric(value){attackMetric=value;}
  return {render,setAblation,setAttackMetric,renderAttacks,main,ablations,strategies,attacks};
})();

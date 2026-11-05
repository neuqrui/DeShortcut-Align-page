/* Native MathML keeps mathematical layout local, accessible, and font-independent. */
window.DeShortcutMath=(()=>{
  const sub=(base,index)=>`<msub><mi>${base}</mi>${["i","m","G","θ"].includes(index)?`<mi>${index}</mi>`:`<mtext>${index}</mtext>`}</msub>`;
  const pi=sub('π','θ'),xcf=sub('X','cf'),lcf=sub('L','cf'),lpg=sub('L','pg');
  const conditional=`<mo>(</mo><mi>y</mi><mo>|</mo>${xcf}<mo>)</mo>`;
  const formulas={
    tss:`<mi mathvariant="normal">TSS</mi><mo>(</mo>${sub('x','i')}<mo>)</mo><mo>=</mo><mfrac><mn>1</mn><mn>3</mn></mfrac><munder><mo>∑</mo><mi>m</mi></munder>${sub('TSS','m')}<mo>(</mo>${sub('x','i')}<mo>)</mo>`,
    vocabulary:`${sub('V','sens')}<mo>=</mo><mo>{</mo>${sub('x','i')}<mo>:</mo><mi mathvariant="normal">Rank</mi><mo>(</mo><mi mathvariant="normal">TSS</mi><mo>(</mo>${sub('x','i')}<mo>)</mo><mo>)</mo><mo>≤</mo><mi>K</mi><mo>}</mo>`,
    counterfactual:`${lcf}<mo>=</mo><mo>−</mo><mi>G</mi><mspace width="0.15em"/><mi mathvariant="normal">log</mi><mo>⁡</mo>${pi}${conditional}`,
    cfTerm:`<mo>−</mo><mi>G</mi><mspace width="0.15em"/><mi mathvariant="normal">log</mi><mo>⁡</mo>${pi}${conditional}`,
    cfName:`${lcf}<mo>=</mo>`,
    gate:`<mi>G</mi><mo>=</mo><mn mathvariant="double-struck">1</mn><mo>[</mo>${sub('R','judge')}<mo>></mo><mi>γ</mi><mo>]</mo>`,
    policy:`${pi}<mo>(</mo><mi>y</mi><mo>|</mo><mi>X</mi><mo>)</mo>`,
    factual:`<mi>X</mi><mo>=</mo><mo>(</mo><mi>I</mi><mo>,</mo>${sub('S','fmt')}<mo>)</mo>`,
    rewards:`${sub('r','i')}<mo>,</mo>${sub('R','judge')}`,
    advantages:`${sub('A','i')}<mo>=</mo><mfrac><mrow>${sub('r','i')}<mo>−</mo><mi>μ</mi></mrow><mrow><mi>σ</mi><mo>+</mo><mi>ε</mi></mrow></mfrac>`,
    update:`<mi>θ</mi><mo>→</mo><msup><mi>θ</mi><mo>′</mo></msup>`,
    baseLoss:`${lpg}<mo>+</mo><mi>β</mi>${sub('D','KL')}`,
    joint:`${sub('L','RL')}<mo>=</mo>${lpg}<mo>+</mo><mi>β</mi>${sub('D','KL')}<mo>+</mo>${sub('λ','dyn')}${lcf}`,
    baseJoint:`${sub('L','RL')}<mo>=</mo>${lpg}<mo>+</mo><mi>β</mi>${sub('D','KL')}`,
    lrl:sub('L','RL'),xcf,
    aggregate:`<mfrac><mn>1</mn><mn>3</mn></mfrac><mo>∑</mo>`,
    refusal:`<mi>Δ</mi><mi mathvariant="normal">log</mi><mi>p</mi><mo>(</mo>${sub('y','ans')}<mo>)</mo>`
  };
  function render(name,block=false){return `<math xmlns="http://www.w3.org/1998/Math/MathML" display="${block?'block':'inline'}">${formulas[name]||''}</math>`;}
  return{render};
})();

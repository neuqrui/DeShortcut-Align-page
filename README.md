# DeShortcut-Align project page

Academic project page for **DeShortcut-Align: Decoupling Spurious Shortcuts for Robust Safety Alignment in Large Reasoning Models**.

- Website: https://neuqrui.github.io/DeShortcut-Align-page/
- Paper: https://arxiv.org/abs/2609.34896
- Research code: https://github.com/neuqrui/DeShortcut-Align

## Development

A dependency-free static site. Run `python3 -m http.server 8000` and visit `http://localhost:8000`.

The page includes SCOPE-based particle effects, pointer trails, pointer-controlled title convergence, a responsive scroll-tracking table of contents, an interactive Figure 1 bar chart, English/Chinese copy, an interactive three-stage method explanation, template condition switching, one native Table 1 with model filtering and detailed benchmark columns, full-resolution paper figures, and BibTeX copying. Method animations are explicitly schematic, not live model inference or measured token attribution.

The motion edition adds an automatically looping flow-and-curve illustration of shortcut progression, an animated AGCA rewrite, a GRPO loop with a switchable safety-gated CCR branch, and native side-by-side ablation and attribution tables. The shortcut process follows the problem chart, before the method. Original training figures remain in the later Training section. The attack comparison is a single metric-switchable bar chart. Tables 11 and 12 are rebuilt side by side as native HTML; the redundant attribution example block is removed. The page also includes a title whose particles gather from all directions as the pointer moves down and scatter evenly around it as the pointer moves up, a playable token-masking attribution walkthrough, independent Code and Data destinations, component and attribution-strategy ablations, paired-intent evaluation, and an organized collection of extended experiments. Metric definitions are available in an expandable evaluation panel.

## Data and figure provenance

Figures were cropped from the original paper, arXiv:2609.34896v1:

- `assets/template-vulnerability.webp`: Figure 1, page 2.
- `assets/method.webp`: Figure 3, page 4.
- `assets/main-results.webp`: Table 1, page 7.
- `assets/training-standard.webp`: Figure 2, page 2 (retained source asset).

Interactive main results are transcribed from Table 1. Attack results are from Table 4; ablation comparisons are from Table 2. The 72.2% template-gap reduction is `(12.83 − 3.57) / 12.83`, for 7B SFT. The 58.3% false-rejection reduction is `(74.33 − 31.00) / 74.33`, for 7B GRPO. Main-results comparisons also show with-template weighted DSR so readers can inspect the safety/helpfulness tradeoff.

Additional figure provenance is in `assets/FIGURES.md`. Re-extract these assets with `python3 scripts/extract-paper-figures.py path/to/2609.34896v1.pdf` (requires Pillow and Poppler).

The mascot is from the official research repository (`assets/deshortcut-align-icon.png`). Design foundation: [SCOPE](https://neuqrui.github.io/SCOPE-page/) and [ToolSpace](https://toolspace-agent.github.io/). This revision directly adapts the SCOPE styles, ambient particles, pointer trails, title bursts, navigation, and bar-chart implementation. See `scope/PROVENANCE.md`.

## Deployment

GitHub Actions publishes the static files to GitHub Pages on every push to `main`. Configure the repository's Pages source as **GitHub Actions**.

Native tables in `scope/results-data.js` are transcribed from Tables 1–4 (with Tables 11–12 in the page markup) of arXiv:2609.34896v1. All 15 main-result rows include the full benchmark values; the summary view retains the three safety pairs, weighted DSR, mean template gap, mean false rejection, all four reasoning benchmarks, and mean reasoning accuracy. The schematic trajectories and method flows are conceptual illustrations, with no fabricated experimental trajectories. Instructional animations loop automatically, pause offscreen, and respect reduced-motion preferences. Figure 1 always compares both conditions, with solid and hatched fills for w/ and w/o templates. Method flows use horizontal layouts and SVG icons; the page omits playback bars and buttons.

The midnight edition uses navy surfaces with blue and warm accents. The GRPO view mixes prompt tokens, rollout groups, mathematical modules, and two semantic icons. Equations use local native MathML for proper subscripts, fractions, Greek letters, and operators. MATH-500, MMLU, LiveCodeBench, and HumanEval remain visible in both Table 1 column modes; the optional expansion only adds false-refusal benchmark columns.

The shortcut process highlights the active learned route with directional packets. The upper chart approximately reconstructs Figure 2’s training reward, over-refusal, and template gap with their original axis scales; the lower chart reconstructs rolling PG-loss magnitude. Hand-read anchors follow the reference image over steps 0–150, with stage boundaries at 40 and 100; they are not raw training samples, and no confidence bands or raw-gradient scatter are synthesized. The page and README share a blue and teal wordmark; title particles scatter evenly around the wordmark and reassemble when the pointer moves down.

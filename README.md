# DeShortcut-Align project page

Academic project page for **DeShortcut-Align: Decoupling Spurious Shortcuts for Robust Safety Alignment in Large Reasoning Models**.

- Website: https://neuqrui.github.io/DeShortcut-Align-page/
- Paper: https://arxiv.org/abs/2609.34896
- Research code: https://github.com/neuqrui/DeShortcut-Align

## Development

A dependency-free static site. Run `python3 -m http.server 8000` and visit `http://localhost:8000`.

The page includes SCOPE-based particle effects, pointer trails, clickable title bursts, a responsive scroll-tracking table of contents, an interactive Figure 1 bar chart, English/Chinese copy, an interactive three-stage method explanation, template condition switching, model-specific comparisons, full-resolution paper figures, and BibTeX copying. Method animations are explicitly schematic, not live model inference or measured token attribution.

The expanded edition adds an example-to-title particle convergence, a playable token-masking attribution walkthrough, independent Code and Data destinations, training dynamics, complete component and attribution-strategy ablations, paired-intent evaluation, and an organized collection of extended experiments. Metric definitions are available in an expandable evaluation panel.

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

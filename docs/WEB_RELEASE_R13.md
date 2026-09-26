# Website controls and PDF pause — 2026-09-26

Owner requests supersede the earlier three-roof/PDF release policy:

- Disable website PDF generation and show all four PDF downloads as disabled.
  The GH download also excludes PDF proofs. SVG plans and Rhino models remain.
- Remove the gable roof choice for both Studio and Sauna. The website exports
  216 flat/single-slope configurations. Native GH gable geometry is preserved.
- Translate Flat as Plokščias in Lithuanian.
- Use the existing choice-button design for configuration parameters, including
  preset, foundation and assembly system. Preserve disabled supplier alternatives.
- Remove the façade section because only one finish is supported; the fixed
  underlying facade value remains unchanged.

The verified export cache/progress changes from PR #36 are retained and adapted
to reject PDF-enabled catalogues. Regeneration still runs when the System pin,
runtime or exporter preparation changes. The earlier 19m17s measurement describes
R12 with PDFs; it is not a prediction for this PDF-free release.

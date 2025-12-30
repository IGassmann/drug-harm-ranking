# Drug Harm Rankings

Interactive visualization of drug harm rankings from peer-reviewed Multi-Criteria Decision Analysis (MCDA) studies.

**Live demo:** https://drug-user-harm-ranking.vercel.app

## Features

- **Single Study View** - Bar chart showing harm rankings for one study at a time
- **Cross-Study Comparison** - Grouped bar chart comparing all 4 studies side-by-side
- **Criteria Breakdown** - Stacked bar chart showing individual harm criteria contributions (UK 2010)
- **Interactive Toggles** - Enable/disable specific harm criteria to see their impact
- **Detailed Comparison Table** - Average scores and cross-study variance

## Data Sources

Harm scores are extracted from these peer-reviewed MCDA studies:

1. **Nutt et al. (2010)** - [Drug harms in the UK](https://doi.org/10.1016/S0140-6736(10)61462-6), *The Lancet*
2. **Bonomo et al. (2019)** - [The Australian drug harms ranking study](https://doi.org/10.1177/0269881119841569), *J Psychopharmacology*
3. **Crossin et al. (2023)** - [The New Zealand drug harms ranking study](https://doi.org/10.1177/02698811231182012), *J Psychopharmacology*
4. **van Amsterdam et al. (2015)** - [European rating of drug harms](https://doi.org/10.1177/0269881115581980), *J Psychopharmacology*

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [Recharts](https://recharts.org/) - Chart library
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## Development

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000

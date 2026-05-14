# Point Keeper

A Next.js app for tracking points in card games. This project provides a landing page, navigation, and placeholder pages for the six games: cabbage, rummy, golf, gin, hearts, and spades.

## What is included
- Next.js App Router structure
- global layout and site shell
- navigation menu for each game route
- landing page with game summaries
- placeholder pages for each game
- browser persistence utility using `localStorage`
- context and hook scaffolding for future per-game score state

## Routes
- `/` — landing page
- `/cabbage`
- `/rummy`
- `/golf`
- `/gin`
- `/hearts`
- `/spades`

## Persistence strategy
The app uses client-side `localStorage` to keep score state in the browser, allowing refresh-safe progress without a backend database.

## Static export and GitHub Pages
This project uses Next.js `output: 'export'` so the build can be exported as a static site.
- Run `npm run build` to generate the optimized production build.
- Run `npm run export` to generate a static `out/` folder.
- Publish the contents of `out/` to GitHub Pages.

## Future work
- Implement the actual point-counting UI for each game
- Add player management and score summaries
- Add game-specific scoring logic for cabbage, rummy, golf, gin, hearts, and spades

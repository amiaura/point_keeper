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

## Future work
- Implement the actual point-counting UI for each game
- Add player management and score summaries
- Add game-specific scoring logic for cabbage, rummy, golf, gin, hearts, and spades

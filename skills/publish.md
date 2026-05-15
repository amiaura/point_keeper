# GitHub Pages Publish Skill

This skill explains how to publish the static `point_keeper` export to GitHub Pages.

## What it does

- Builds the Next.js app with `next build`
- Exports the app as a static site into `out/`
- Creates or updates a `gh-pages` worktree at `../point_keeper-gh-pages`
- Copies the exported `out/` contents into that worktree
- Commits and pushes the site to `gh-pages`
- Ensures `.nojekyll` is present so GitHub Pages serves the static `/_next` assets correctly

## Usage

From the repository root:

```bash
npm run publish:gh-pages
```

If you want to run the steps manually:

```bash
npm run build
npm run export
node ./scripts/publish-gh-pages.js
```

## Requirements

- `git` installed and configured
- A remote `origin` for this repo
- A `gh-pages` branch in the remote repository (the script creates or resets it)
- `npm` and `node` available in your shell

## GitHub Pages settings

In GitHub repository settings, under **Pages**:

- Source: `Deploy from a branch`
- Branch: `gh-pages`
- Folder: `/ (root)`

The published site should appear at:

`https://amiaura.github.io/point_keeper/`

## Notes

- If GitHub Pages does not update immediately, wait a minute and refresh.
- The `basePath` and `assetPrefix` are already configured in `next.config.js` for `/point_keeper`.

# Repo Agents

This repository uses a set of agent-readable documents and skills to define publishing workflows and expected development practices.

## Publish Skill

- The GitHub Pages publish helper is documented in `skills/publish.md`.
- This skill explains how to build, export, and deploy the static site to the `gh-pages` branch.
- The publish workflow includes copying `public/` assets so image files like `cards.jpg` work correctly in the exported site.

## Testing Requirement

- All functionality in this repository must be covered by tests.
- Any new feature, bug fix, or workflow change should include automated tests for the impacted behavior.
- Test coverage should include both the publish workflow and application UI logic where applicable.

## Notes

- Keep `skills/publish.md` accurate and updated whenever the GitHub Pages deployment process changes.
- Ensure the repository branch and PR include both the implementation and tests for the updated functionality.

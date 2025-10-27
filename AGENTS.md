# Agent Guidelines for Spirit of Life Church Website

## Build & Lint Commands

- **Build all**: `pnpm build` (turbo build)
- **Dev server**: `pnpm dev` (turbo dev)
- **Lint all**: `pnpm lint` (turbo lint)
- **Type check**: `pnpm check-types` (turbo check-types)
- **Format code**: `pnpm format` (prettier --write)
- **Single app build**: `cd apps/web && pnpm build` or `cd apps/studio && pnpm build`
- **Run lint after changes**: Always run `pnpm lint` before committing

## Code Style Guidelines

- **TypeScript**: Strict mode, noUncheckedIndexedAccess, consistent-type-imports
- **Imports**: Sorted with simple-import-sort, separate external/internal imports
- **Naming**: Kebab-case for files (studio), camelCase for variables/functions
- **Components**: Prefer grid over flex, semantic HTML, use SanityImage for images
- **Formatting**: Prettier (80 char width, semicolons, bracket spacing)
- **Error handling**: Use try/catch, descriptive error messages

## Cursor Rules

- **Frontend rules**: `.cursor/rules/frontend-rules.mdc` (component structure, i18n)
- **Sanity rules**: `.cursor/rules/sanity-rules.mdc` (schema patterns, GROQ queries)
- **Style guide**: `.cursor/rules/styleguide.mdc` (brand colors, typography, components)

## Testing

- No test framework configured yet - run manual testing for now

## Sanity CMS

- After schema changes: `cd apps/studio && pnpm type` (generates TypeScript types)
- Schema structure: defineType/defineField, proper icons, descriptive fields

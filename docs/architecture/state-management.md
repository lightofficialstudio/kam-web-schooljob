# Zustand Store Location Policy

Global states shared across components should be kept within corresponding feature folders for better maintainability and organization.

## Folder Structure

Each feature or page should contain its own `stores` subdirectory.
Example: `app/pages/[feature-name]/stores/[kebab-case-name].ts`

## Current Stores

- [app/pages/landing/stores/landing-search-store.ts](app/pages/landing/stores/landing-search-store.ts): Stores the search state for the landing page.

## Guidelines

1. Use **Zustand** only for cross-component state sharing.
2. File names must use **kebab-case**.
3. Import states directly from their local feature stores.

# Global State Management with Zustand

This project uses **Zustand** for lightweight, scalable global state management.

## Installation

- `zustand`: Main library.

## Store Structure

Stores are located in `app/stores/`.

- [app/stores/useStore.ts](app/stores/useStore.ts): The main search and global state store.

```typescript
import { create } from 'zustand';

interface SearchState {
  examYear: string;
  // ... other fields
  setExamYear: (year: string) => void;
  // ... other actions
}

export const useStore = create<SearchState>((set) => ({ ... }));
```

## Usage

Simply import the hook into any client component:

```tsx
import { useStore } from "@/app/stores/useStore";

export default function MyComponent() {
  const { examYear, setExamYear } = useStore();
  // ...
}
```

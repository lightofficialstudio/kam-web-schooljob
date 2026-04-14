---
name: frontend-standard
description: Front-end Development Standard (Builder Mode) สำหรับพัฒนาหน้าจอด้วย Next.js + Ant Design V5 + Zustand ตาม Modular Architecture อย่างเคร่งครัด ใช้เมื่อสร้างหน้าใหม่ เพิ่ม feature หรือ refactor component ใดๆ ในโปรเจกต์นี้
---

# Frontend Standard

## Directory Structure
```
app/pages/<feature>/
├── page.tsx        # Orchestrator เท่านั้น
├── _components/    # UI ย่อย
├── _api/           # Axios methods
└── _state/         # Zustand stores
```

## Rules
- `page.tsx` ห้าม Business Logic
- Shared state → `_state/` เสมอ (ห้าม `useState`)
- API → Axios เท่านั้น (ห้าม fetch native)
- `"use client"` บรรทัดแรกของทุก interactive component
- TypeScript เสมอ — ห้าม `any`
- ห้ามลบ function เดิม, ห้ามเพิ่ม feature เกิน scope

## Naming
| ประเภท | รูปแบบ |
|--------|--------|
| Variables | `camelCase` — `responseUserList` |
| Components | `PascalCase` — `UserTable` |
| Store files | `<feature>-store.ts` |
| API files | `<feature>-api.ts` |
| Store name | `use<Feature>Store` |
| Comments | ภาษาไทย |

## Styling
- ใช้ `theme.useToken()` แทน hardcode สี
- Layout: `Flex`, `Space`, `Row`, `Col`
- ห้าม CSS file / inline-style ที่ไม่จำเป็น

## Ant Design V5
- `variant="outlined"` แทน `bordered` (deprecated)
- `styles={{ body: { padding: 0 } }}` แทน `bodyStyle`
- ห้ามใช้ `List` component — ใช้ `Row`+`Col` แทน
- Modal: `styles={{ content, body, header }}`

## Store Pattern
```typescript
interface FeatureStore {
  items: Item[];
  isLoading: boolean;
  fetchItems: () => Promise<void>;
  updateItem: (id: string, data: Partial<Item>) => void;
}
```

## Response Format
1. แสดง file path ก่อน code block
2. Code เฉพาะที่จำเป็น
3. Step ถัดไป 1-2 บรรทัด
4. หลายไฟล์ → เรียงตาม dependency

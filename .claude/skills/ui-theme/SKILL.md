---
name: ui-theme
description: UI Theme & Color reference สำหรับโปรเจกต์ KAM-WEB-SCHOOLJOB — primary colors, gradient patterns, dark mode tokens, component overrides ใช้เพื่อป้องกัน hardcode สีผิดและลด Token จากการอ่าน theme-context.tsx ซ้ำ
---

# UI Theme — KAM-WEB-SCHOOLJOB

## Primary Colors (Hardcode ห้ามเปลี่ยน)

| Token | Value | ใช้กับ |
|-------|-------|--------|
| **Primary** | `#11b6f5` | ปุ่มหลัก, link, Tag, Icon accent, border highlight |
| **Primary Dark** | `#0d8fd4` | gradient เริ่มต้น, hover state |
| **Primary Light** | `#5dd5fb` | gradient สิ้นสุด (light), glow effect |
| **Primary Mid** | `#0878a8` | gradient dark mode สิ้นสุด |
| **Primary Bg (rgba)** | `rgba(17,182,245,0.05-0.22)` | background tint, card highlight |

> ❌ ห้ามใช้: `#e60278` (ชมพูแดง), `#003366` (กรมท่า), `#6366f1` (ม่วง indigo) — ไม่ใช่ theme ของโปรเจกต์นี้

---

## Ant Design Theme Config (`theme-context.tsx`)

### Global Token
```typescript
colorPrimary: "#11b6f5"
fontFamily: "'Kanit', -apple-system, ..."
fontSize: 14
borderRadius: 12
```

### Background Tokens
| Token | Light | Dark |
|-------|-------|------|
| `colorBgBase` | `#ffffff` | `#0F172A` |
| `colorBgContainer` | `#ffffff` | `#1E293B` |
| `colorBgLayout` | `#F8FAFC` | `#0F172A` |
| `colorBgElevated` | `#ffffff` | `#1E293B` |

### Text Tokens
| Token | Light | Dark |
|-------|-------|------|
| `colorTextBase` | `#1E293B` | `#F8FAFC` |
| `colorBorder` | `#E2E8F0` | `#334155` |

### Component Overrides
| Component | Override ที่สำคัญ |
|-----------|-----------------|
| `Button` | `borderRadius: 100` (capsule), `controlHeight: 36` |
| `Card` | `borderRadiusLG: 16`, `boxShadow: none`, `boxShadowTertiary: none` |
| `Input` | `borderRadius: 8`, `controlHeight: 36` |
| `Select` | `controlHeight: 40`, `borderRadius: 8` |
| `Menu` | `itemSelectedBg: rgba(17,182,245,0.1/0.2)`, `itemSelectedColor: #11b6f5/#52B8FF` |
| `Table` | `rowHoverBg: rgba(17,182,245,0.05/0.08)`, `headerBg: #f0f7ff (light)` |

---

## Gradient Patterns

### Banner / Hero (Primary Blue)
```typescript
// ✅ ใช้ทั่วทั้งเว็บ — banner, drawer header, CTA section
background: "linear-gradient(135deg, #0d8fd4 0%, #11b6f5 50%, #5dd5fb 100%)"

// Dark navy version (landing hero)
background: "linear-gradient(135deg, #001e45 0%, #003370 100%)"
background: "linear-gradient(135deg, #001e45 0%, #0a4a8a 60%, #11b6f5 100%)"
```

### Subtle Light Background
```typescript
// Card/section background — light mode only
background: "linear-gradient(135deg, #eef7ff 0%, #f8fbff 60%, #ffffff 100%)"
```

### Direction Variants
```typescript
// ใช้กับ button / badge / tag
background: "linear-gradient(160deg, #11b6f5 0%, #0878a8 100%)"
```

---

## Background Decorators (ใช้คู่กันเสมอ)

### Grid Pattern
```typescript
// Light mode
backgroundImage: "linear-gradient(rgba(17,182,245,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(17,182,245,0.06) 1px, transparent 1px)"
backgroundSize: "48px 48px"

// Dark mode
backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)"
backgroundSize: "48px 48px"
```

### Mask (fade top/bottom ของ grid)
```typescript
maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)"
WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)"
```

### Glow Effect
```typescript
// Primary blue glow (top-right corner)
background: "radial-gradient(circle, rgba(17,182,245,0.14) 0%, transparent 70%)"
filter: "blur(60px)"
width: "400px", height: "400px", borderRadius: "50%"
position: "absolute"
```

### Dot Pattern
```typescript
backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)"
backgroundSize: "32px 32px"
opacity: 0.1 // บน colored background
```

---

## Tag / Badge Colors

```typescript
// Primary blue tag (ใช้ทั่วไป)
<Tag color="#11b6f5">...</Tag>

// Category badge บน card
<Tag color="#11b6f5" variant="filled" style={{ backdropFilter: "blur(4px)", background: "rgba(24,144,255,0.85)" }}>

// "New" badge
<Badge count="New" color="#ef4444" />

// Status badge
<Badge status="processing" /> // Ant Design built-in สีฟ้า
<Badge status="success" />    // เขียว
```

---

## Dark Mode — Background Colors

```typescript
// Dark navy backgrounds (ใช้ในหน้า landing + hero sections)
"#070d1a"   // ดำสนิท — page background
"#0a0f1e"   // ดำเข้มมาก — section overlay
"#0F172A"   // colorBgBase dark
"#1E293B"   // colorBgContainer dark — card background
```

---

## Avatar Fallback Pattern

```typescript
// ใช้เมื่อไม่มี logo — seed = ชื่อโรงเรียน
src={logoUrl ?? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(schoolName)}&backgroundColor=0d8fd4`}
style={{ borderRadius: 12 }} // square avatar ใช้ borderRadius 12
```

---

## "How You Match" Card (highlight box)

```typescript
// Subtle blue highlight card
style={{
  border: "1px solid rgba(17, 182, 245, 0.35)",
  background: "rgba(17, 182, 245, 0.04)",
  borderRadius: 12,
}}
```

---

## useToken() — วิธีใช้ที่ถูกต้อง

```typescript
// ✅ ใช้ token แทน hardcode สีที่ขึ้นกับ light/dark
const { token } = antTheme.useToken();

token.colorBgContainer   // background card
token.colorBgLayout      // background page
token.colorBorderSecondary // border อ่อน
token.colorText          // text หลัก
token.colorTextSecondary // text รอง
token.colorTextQuaternary // text จางมาก
token.colorPrimary       // = #11b6f5 เสมอ
token.borderRadiusLG     // = 16 (card)
token.borderRadius       // = 12 (input)
token.boxShadowSecondary // shadow card

// ✅ สีฟ้าหลัก — hardcode ได้เพราะเป็น brand color คงที่
"#11b6f5"
```

---

## ❌ สีที่ห้าม Hardcode

| สี | Hex | เหตุผล |
|----|-----|--------|
| ชมพูแดง | `#e60278` | ไม่ใช่ theme |
| กรมท่า | `#003366` | ไม่ใช่ theme |
| ม่วง Indigo | `#6366f1`, `rgba(99,102,241,...)` | ใช้ใน landing เท่านั้น (legacy) |
| เขียว | `#22c55e` โดยตรง | ใช้ `token.colorSuccess` แทน |
| แดง | `#ef4444` โดยตรง | ใช้ `token.colorError` แทน หรือ Badge "New" เท่านั้น |

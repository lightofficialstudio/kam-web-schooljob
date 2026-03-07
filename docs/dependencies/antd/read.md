# Ant Design

This project uses Ant Design for UI components.

## Installation

- `antd`: Main package for Ant Design.
- `@ant-design/nextjs-registry`: Registry for supporting Next.js App Router.

## Configuration

The `AntdRegistry` has been added to `app/layout.tsx` to support server-side rendering of Ant Design styles.

```tsx
import { AntdRegistry } from "@ant-design/nextjs-registry";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
```

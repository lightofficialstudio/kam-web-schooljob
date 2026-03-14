import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // เพิ่มส่วน rules ตรงนี้เพื่อลดความเคร่งครัด
    rules: {
      // 1. TypeScript: ยอมให้ใช้ any ได้ (ตัวต้นเหตุสีแดงอันดับหนึ่ง)
      "@typescript-eslint/no-explicit-any": "off",

      // 2. TypeScript: ยอมให้ประกาศตัวแปรทิ้งไว้โดยไม่ใช้ได้ (หรือเปลี่ยนเป็น warn)
      "@typescript-eslint/no-unused-vars": "warn",

      // 3. React/Next: ยอมให้ไม่ใส่ Display Name ใน component ได้
      "react/display-name": "off",

      // 4. Next: ยอมให้ใช้ <img> แทน <Image /> ของ Next ได้บางกรณี
      "@next/next/no-img-element": "off",

      // 5. TypeScript: ผ่อนปรนการเช็คพวก require หรือ commonjs
      "@typescript-eslint/no-var-requires": "off",

      // 6. General: ยอมให้มี console.log ได้ไม่ผิดกฏ
      "no-console": "off",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;

1. คุณต้องทำงานในมาตรฐาน Next.JS Best Practice เท่านั้น โดยใน Folder ของ Front-end
2. เช่นคุณสร้างไฟล์ app/pages/landing ในนี้จะต้องมีการแยก components ในโฟลเดอร์
   1. เช่น สร้าง โฟลเดอร์ components ใน app/pages/landing จะได้เป็น app/pages/landing/components/kebab-case.tsx
3. การจัดการ State จะต้องใช้ Zustland ในการ Share State ข้าม Component เท่านั้นเพื่อความง่าย โดยสร้างในโฟลเดอร์ที่เกี่ยวข้องไปเลย เช่น app/pages/landing/stores/kebab-case.tsx
4. การแจ้งเตือน ไม่ว่าสำเร็จ หรือ ล้มเหลว จะต้องใช้งานเป็น Modal เท่านั้นโดยให้ใช้งานจาก app/components/layouts/modal/base-modal.tsx เท่านั้น
5. จงใช้ Ant Design ให้เยอะมากที่สุดแทน div ทั้งหมดเพื่อความ Clean และลดการใช้ styles ให้มากที่สุด! โดยทำตามมาตรฐาน layout ที่ดีดังนี้
   https://ant.design/components/flex?theme=light
   https://ant.design/components/grid?theme=light
   https://ant.design/components/space?theme=light
   ใช้ row/col ของ ant-design ด้วย
6. ทุกไฟล์ต่อจากนี้ห้ามใช้งาน div อย่างเด็ดขาด!! และห้ามใช้
   background: "ตามด้วยสี" เพราะมีการ setup theme provider แล้ว ฉันควบคุมในระดับ layout ทั้งหมด!! จงลบออกทั้งหมดเดียวนี้

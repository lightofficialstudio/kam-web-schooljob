// Re-export จาก _state/ เพื่อ backward compatibility
// ไม่ควรใช้ไฟล์นี้ใน code ใหม่ — ให้ import จาก ../_state/school-profile.state แทน
export {
  useSchoolProfileState as useSchoolProfileStore,
  type SchoolProfile,
  type SchoolProfileStore,
} from "../_state/school-profile.state";

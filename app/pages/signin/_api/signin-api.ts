import axios from "axios";

// ส่งคำขอเข้าสู่ระบบด้วยอีเมลและรหัสผ่าน
export const requestSignin = async (email: string, password: string) =>
  axios.post("/api/v1/authenticate/signin", { email, password });

import axios from "axios";

// ✨ UI ส่ง first_name + last_name + role ตรง ๆ — backend แปลงและ concat เอง
export interface SignupPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: "teacher" | "school";
}

// ✨ ส่งคำขอสมัครสมาชิกใหม่ไปยัง API
export const requestSignup = async (payload: SignupPayload) =>
  axios.post("/api/v1/authenticate/signup", payload);

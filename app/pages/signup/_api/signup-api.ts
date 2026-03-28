import axios from "axios";

interface SignupPayload {
  email: string;
  password: string;
  full_name: string;
  role: string;
}

// ส่งคำขอสมัครสมาชิกใหม่ไปยัง API
export const requestSignup = async (payload: SignupPayload) =>
  axios.post("/api/v1/authenticate/signup", payload);

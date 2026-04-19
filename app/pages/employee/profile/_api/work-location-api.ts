import axios from "axios";

const BASE_URL = "/api/v1/employee/work-location";

// ✨ อัปเดตสถานที่ทำงาน (preferred_provinces + can_relocate)
export const patchWorkLocation = async (
  userId: string,
  payload: {
    preferred_provinces: string[];
    can_relocate: boolean;
  },
) => {
  const { data } = await axios.patch(`${BASE_URL}/update`, payload, {
    params: { user_id: userId },
  });
  return data;
};

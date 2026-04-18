// ✨ Shared geo types + loader สำหรับข้อมูลจังหวัด/อำเภอ/ตำบล ประเทศไทย
// ใช้ร่วมกันระหว่าง profile-edit-drawer และ location-section

const BASE =
  "https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest";

export interface Province {
  id: number;
  name_th: string;
  name_en: string;
}

export interface District {
  id: number;
  name_th: string;
  name_en: string;
  province_id: number;
}

export interface SubDistrict {
  id: number;
  name_th: string;
  name_en: string;
  district_id: number;
  zip_code: number;
}

// ✨ Cache ใน module scope — ไม่ fetch ซ้ำ
let _provinces: Province[] | null = null;
let _districts: District[] | null = null;
let _subDistricts: SubDistrict[] | null = null;

export const loadAll = async () => {
  const [p, d, s] = await Promise.all([
    _provinces ?? fetch(`${BASE}/province.json`).then((r) => r.json()),
    _districts ?? fetch(`${BASE}/district.json`).then((r) => r.json()),
    _subDistricts ?? fetch(`${BASE}/sub_district.json`).then((r) => r.json()),
  ]);
  _provinces = p;
  _districts = d;
  _subDistricts = s;
  return {
    provinces: p as Province[],
    districts: d as District[],
    subDistricts: s as SubDistrict[],
  };
};

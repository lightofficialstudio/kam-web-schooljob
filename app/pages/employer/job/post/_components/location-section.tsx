"use client";

import { EnvironmentOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  Alert,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Spin,
  Tag,
  theme,
} from "antd";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/app/stores/auth-store";
import { useJobPostStore } from "../_stores/job-post-store";

// ─── Types จาก GitHub Raw API ─────────────────────────────────────────────
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

const BASE =
  "https://raw.githubusercontent.com/kongvut/thai-province-data/refs/heads/master/api/latest";

// ─── Fetch helper (cache ใน module scope เพื่อไม่ fetch ซ้ำ) ───────────────
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

// ─── Component ────────────────────────────────────────────────────────────
export const LocationSection = () => {
  const { token } = theme.useToken();
  const form = Form.useFormInstance();
  const { user } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [subDistricts, setSubDistricts] = useState<SubDistrict[]>([]);

  const {
    selectedProvinceId,
    setSelectedProvinceId,
    selectedDistrictId,
    setSelectedDistrictId,
  } = useJobPostStore();

  // ✨ โหลดข้อมูลจังหวัด + auto-fill จาก SchoolProfile ครั้งแรก
  useEffect(() => {
    setIsLoading(true);

    // ✨ โหลด dropdown ข้อมูลจังหวัด + SchoolProfile พร้อมกัน
    const profilePromise = user?.user_id
      ? axios
          .get<{ status_code: number; data: { schoolProfile: { province: string; district?: string; address?: string } | null } }>(
            `/api/v1/employer/profile/read?user_id=${user.user_id}`,
          )
          .then((res) => (res.data.status_code === 200 ? res.data.data?.schoolProfile : null))
          .catch(() => null)
      : Promise.resolve(null);

    Promise.all([loadAll(), profilePromise])
      .then(([{ provinces: p, districts: d, subDistricts: s }, schoolProfile]) => {
        setProvinces(p);
        setDistricts(d);
        setSubDistricts(s);

        // ✨ auto-fill เฉพาะเมื่อฟอร์มยังว่าง (ไม่ override ข้อมูลที่ user กรอกไว้แล้ว)
        const currentProvince = form.getFieldValue("province");
        if (!currentProvince && schoolProfile?.province) {
          const matchedProvince = p.find((pv) => pv.name_th === schoolProfile.province);
          if (matchedProvince) {
            setSelectedProvinceId(matchedProvince.id);
          }
          form.setFieldsValue({
            province: schoolProfile.province || undefined,
            area: schoolProfile.district || undefined,
            address: schoolProfile.address || undefined,
          });

          // ✨ set districtId ถ้าพบ district ที่ตรงกัน
          if (schoolProfile.district && matchedProvince) {
            const matchedDistrict = d.find(
              (dist) => dist.name_th === schoolProfile.district && dist.province_id === matchedProvince.id,
            );
            if (matchedDistrict) setSelectedDistrictId(matchedDistrict.id);
          }
        }
      })
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user_id]);

  // ✨ filter อำเภอตามจังหวัดที่เลือก
  const filteredDistricts = useMemo(
    () =>
      selectedProvinceId
        ? districts.filter((d) => d.province_id === selectedProvinceId)
        : [],
    [districts, selectedProvinceId],
  );

  // ✨ filter ตำบลตามอำเภอที่เลือก
  const filteredSubDistricts = useMemo(
    () =>
      selectedDistrictId
        ? subDistricts.filter((s) => s.district_id === selectedDistrictId)
        : [],
    [subDistricts, selectedDistrictId],
  );

  const handleProvinceChange = (_nameEn: string, option: unknown) => {
    const opt = option as { data: Province };
    setSelectedProvinceId(opt.data.id);
    setSelectedDistrictId(null);
    // reset ลำดับล่าง
    form.setFieldsValue({
      area: undefined,
      sub_district: undefined,
      zipcode: undefined,
    });
  };

  const handleDistrictChange = (_nameEn: string, option: unknown) => {
    const opt = option as { data: District };
    setSelectedDistrictId(opt.data.id);
    form.setFieldsValue({ sub_district: undefined, zipcode: undefined });
  };

  const handleSubDistrictChange = (_: string, option: unknown) => {
    const opt = option as { data: SubDistrict };
    // ✨ auto-fill รหัสไปรษณีย์
    form.setFieldValue("zipcode", String(opt.data.zip_code));
  };

  return (
    <Card
      title={
        <Space>
          <EnvironmentOutlined style={{ color: token.colorError }} />
          สถานที่ทำงาน
        </Space>
      }
      variant="borderless"
      style={{
        borderRadius: 16,
        border: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <Alert
        description="ระบบดึงข้อมูลจาก School Profile ของคุณโดยอัตโนมัติ หากสถาบันมีหลายสาขาสามารถแก้ไขที่อยู่สำหรับประกาศนี้ได้โดยเฉพาะ"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      {isLoading ? (
        <Flex
          align="center"
          justify="center"
          gap={8}
          style={{ padding: "24px 0" }}
        >
          <Spin indicator={<LoadingOutlined spin />} />
          <span style={{ color: token.colorTextSecondary, fontSize: 13 }}>
            กำลังโหลดข้อมูลจังหวัด...
          </span>
        </Flex>
      ) : (
        <Row gutter={[16, 0]}>
          {/* จังหวัด */}
          <Col xs={24} md={12}>
            <Form.Item
              label="จังหวัด"
              name="province"
              rules={[{ required: true, message: "กรุณาเลือกจังหวัด" }]}
            >
              <Select
                showSearch
                size="large"
                placeholder="เลือกจังหวัด"
                optionFilterProp="label"
                onChange={handleProvinceChange}
                filterOption={(input, option) =>
                  ((option?.label as string) ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={provinces.map((p) => ({
                  value: p.name_th,
                  label: p.name_th,
                  data: p,
                }))}
                notFoundContent="ไม่พบจังหวัด"
              />
            </Form.Item>
          </Col>

          {/* อำเภอ/เขต */}
          <Col xs={24} md={12}>
            <Form.Item
              label="อำเภอ / เขต"
              name="area"
              rules={[{ required: true, message: "กรุณาเลือกอำเภอ/เขต" }]}
            >
              <Select
                showSearch
                size="large"
                placeholder={
                  selectedProvinceId ? "เลือกอำเภอ/เขต" : "เลือกจังหวัดก่อน"
                }
                disabled={!selectedProvinceId}
                optionFilterProp="label"
                onChange={handleDistrictChange}
                filterOption={(input, option) =>
                  ((option?.label as string) ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={filteredDistricts.map((d) => ({
                  value: d.name_th,
                  label: d.name_th,
                  data: d,
                }))}
                notFoundContent="ไม่พบอำเภอ/เขต"
              />
            </Form.Item>
          </Col>

          {/* ตำบล/แขวง */}
          <Col xs={24} md={12}>
            <Form.Item label="ตำบล / แขวง" name="sub_district">
              <Select
                showSearch
                size="large"
                placeholder={
                  selectedDistrictId ? "เลือกตำบล/แขวง" : "เลือกอำเภอก่อน"
                }
                disabled={!selectedDistrictId}
                optionFilterProp="label"
                onChange={handleSubDistrictChange}
                filterOption={(input, option) =>
                  ((option?.label as string) ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={filteredSubDistricts.map((s) => ({
                  value: s.name_th,
                  label: s.name_th,
                  data: s,
                }))}
                notFoundContent="ไม่พบตำบล/แขวง"
                optionRender={(option) => {
                  const sub = (option.data as { data: SubDistrict }).data;
                  return (
                    <Space>
                      <span>{sub.name_th}</span>
                      {sub.zip_code && (
                        <Tag
                          bordered={false}
                          color="blue"
                          style={{ fontSize: 11 }}
                        >
                          {sub.zip_code}
                        </Tag>
                      )}
                    </Space>
                  );
                }}
              />
            </Form.Item>
          </Col>

          {/* รหัสไปรษณีย์ (auto-fill) */}
          <Col xs={24} md={12}>
            <Form.Item label="รหัสไปรษณีย์" name="zipcode">
              <Input
                size="large"
                placeholder="กรอกอัตโนมัติเมื่อเลือกตำบล"
                readOnly
                style={{ backgroundColor: token.colorFillQuaternary }}
                suffix={
                  <Tag
                    bordered={false}
                    color="green"
                    style={{ fontSize: 11, margin: 0 }}
                  >
                    Auto
                  </Tag>
                }
              />
            </Form.Item>
          </Col>

          {/* ที่อยู่เพิ่มเติม */}
          <Col span={24}>
            <Form.Item label="ที่อยู่สถาบัน (ระบุสาขาถ้ามี)" name="address">
              <Input.TextArea
                rows={2}
                placeholder="เช่น เลขที่ 123 อาคารเรียนสีขาว ถ.พหลโยธิน (สาขาจตุจักร)"
              />
            </Form.Item>
          </Col>
        </Row>
      )}
    </Card>
  );
};

// Flex ใช้แบบ inline เพื่อหลีกเลี่ยง circular import
const Flex = ({
  children,
  align,
  justify,
  gap,
  style,
}: {
  children: React.ReactNode;
  align?: string;
  justify?: string;
  gap?: number;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: align,
      justifyContent: justify,
      gap,
      ...style,
    }}
  >
    {children}
  </div>
);

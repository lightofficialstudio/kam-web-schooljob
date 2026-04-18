"use client";

import { District, Province, loadAll } from "@/app/lib/geo";
import { EditOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Drawer,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Spin,
  Typography,
  theme as antTheme,
} from "antd";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import {
  SchoolProfile,
  useSchoolProfileState as useSchoolProfileStore,
} from "../_state/school-profile.state";

const { Title, Text } = Typography;

// ✨ รูปแบบตัวเลือกจาก API
interface ConfigOption {
  id: string;
  label: string;
  value: string;
}

// ✨ ตัวเลือกสังกัดโรงเรียน (fixed enum — ไม่เปลี่ยนบ่อย)
const AFFILIATION_OPTIONS = [
  "สพฐ. (สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน)",
  "สช. (สำนักงานคณะกรรมการส่งเสริมการศึกษาเอกชน)",
  "อปท. (องค์กรปกครองส่วนท้องถิ่น)",
  "กทม. (กรุงเทพมหานคร)",
  "ตชด. (กองบัญชาการตำรวจตระเวนชายแดน)",
  "สถาบันอุดมศึกษา",
  "อื่นๆ",
];

interface ProfileEditDrawerProps {
  // ✨ async เพื่อรอ API บันทึกเสร็จก่อนปิด drawer
  onSave: (values: SchoolProfile) => Promise<void>;
}

export const ProfileEditDrawer: React.FC<ProfileEditDrawerProps> = ({
  onSave,
}) => {
  const { isDrawerOpen, setIsDrawerOpen, profile, isSaving } =
    useSchoolProfileStore();
  const { token } = antTheme.useToken();
  const [form] = Form.useForm();

  const [schoolTypes, setSchoolTypes] = useState<ConfigOption[]>([]);
  const [schoolLevels, setSchoolLevels] = useState<ConfigOption[]>([]);
  // ✨ เริ่มต้นเป็น true เสมอ — ป้องกัน Form mount ก่อนข้อมูล config โหลดเสร็จ
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  // ✨ ข้อมูลจังหวัด/อำเภอ
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(
    null,
  );

  // ✨ โหลดตัวเลือก config + ข้อมูลจังหวัด/อำเภอ พร้อมกันใน useEffect เดียว
  useEffect(() => {
    setIsLoadingOptions(true);
    Promise.all([
      axios.get<{ status_code: number; data: ConfigOption[] }>(
        "/api/v1/config/options?group=school_type",
      ),
      axios.get<{ status_code: number; data: ConfigOption[] }>(
        "/api/v1/config/options?group=school_level",
      ),
      loadAll(),
    ])
      .then(([typeRes, levelRes, geoData]) => {
        if (typeRes.data.status_code === 200) setSchoolTypes(typeRes.data.data);
        if (levelRes.data.status_code === 200)
          setSchoolLevels(levelRes.data.data);
        setProvinces(geoData.provinces);
        setDistricts(geoData.districts);
      })
      .catch((err) => console.error("❌ โหลด config options ไม่สำเร็จ:", err))
      .finally(() => setIsLoadingOptions(false));
  }, []);

  // ✨ filter อำเภอตามจังหวัดที่เลือก
  const filteredDistricts = useMemo(
    () =>
      selectedProvinceId
        ? districts.filter((d) => d.province_id === selectedProvinceId)
        : [],
    [districts, selectedProvinceId],
  );

  // ✨ ซิงค์ข้อมูลจาก store เข้า form
  // รอให้ทั้ง drawer เปิด AND config โหลดเสร็จก่อน (ป้องกัน Form ยังไม่ mount)
  React.useEffect(() => {
    if (isDrawerOpen && !isLoadingOptions) {
      form.setFieldsValue({
        ...profile,
        teacherCount: profile.teacherCount ?? undefined,
        studentCount: profile.studentCount ?? undefined,
        established: profile.established ?? undefined,
      });
      // ✨ ตั้งค่า selectedProvinceId จากชื่อจังหวัดที่เก็บไว้
      if (profile.location && provinces.length > 0) {
        const matched = provinces.find((p) => p.name_th === profile.location);
        if (matched) setSelectedProvinceId(matched.id);
      }
    }
  }, [isDrawerOpen, isLoadingOptions, profile, form, provinces]); // eslint-disable-line react-hooks/exhaustive-deps

  // ✨ จัดการเปลี่ยนจังหวัด — reset อำเภอ
  const handleProvinceChange = (_: string, option: unknown) => {
    const opt = option as { data: Province };
    setSelectedProvinceId(opt.data.id);
    form.setFieldsValue({ district: undefined });
  };

  // ✨ handleFinish รับ values จาก form แล้วส่งต่อให้ page.tsx จัดการ API
  const handleFinish = async (values: SchoolProfile) => {
    await onSave(values);
  };

  return (
    <Drawer
      title={
        <Space>
          <EditOutlined style={{ color: token.colorPrimary }} />
          <span
            style={{ fontWeight: 700, fontSize: 18, color: token.colorText }}
          >
            แก้ไขข้อมูลโรงเรียน
          </span>
        </Space>
      }
      placement="right"
      onClose={() => setIsDrawerOpen(false)}
      open={isDrawerOpen}
      size="large"
      className="rounded-l-4xl! overflow-hidden"
      styles={{
        header: {
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          padding: "24px 32px",
        },
        body: {
          padding: "32px",
          background: token.colorBgContainer,
        },
        footer: {
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          padding: "20px 32px",
          background: token.colorBgContainer,
          backdropFilter: "blur(8px)",
        },
      }}
      footer={
        <Flex justify="end" gap={12}>
          <Button
            size="large"
            style={{ borderRadius: 100 }}
            onClick={() => setIsDrawerOpen(false)}
            disabled={isSaving}
          >
            ยกเลิก
          </Button>
          <Button
            type="primary"
            size="large"
            style={{ borderRadius: 100, fontWeight: 700 }}
            loading={isSaving}
            onClick={() => form.submit()}
          >
            บันทึกข้อมูล
          </Button>
        </Flex>
      }
    >
      {isLoadingOptions ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
          <Spin size="large" />
          <Text className="text-slate-400 font-medium">
            กำลังโหลดข้อมูลการตั้งค่า...
          </Text>
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          className="animate-in fade-in slide-in-from-right-4 duration-700"
          requiredMark="optional"
        >
          {/* ─── ข้อมูลพื้นฐาน ─── */}
          <Title level={5}>ข้อมูลพื้นฐาน</Title>
          <Form.Item
            name="name"
            label="ชื่อโรงเรียน"
            rules={[{ required: true, message: "กรุณาระบุชื่อโรงเรียน" }]}
          >
            <Input placeholder="ระบุชื่อโรงเรียน" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="ประเภทโรงเรียน"
                rules={[{ required: true }]}
              >
                {/* ✨ ดึงตัวเลือกจาก Config API */}
                <Select
                  placeholder="เลือกประเภท"
                  options={schoolTypes.map((t) => ({
                    value: t.value,
                    label: t.label,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="affiliation" label="สังกัด">
                <Select
                  placeholder="เลือกสังกัด"
                  allowClear
                  options={AFFILIATION_OPTIONS.map((a) => ({
                    value: a,
                    label: a,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="location"
                label="จังหวัด"
                rules={[{ required: true, message: "กรุณาเลือกจังหวัด" }]}
              >
                {/* ✨ dropdown จังหวัดจาก GitHub API */}
                <Select
                  showSearch
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
            <Col span={12}>
              <Form.Item name="district" label="อำเภอ / เขต">
                {/* ✨ dropdown อำเภอ cascading จากจังหวัดที่เลือก */}
                <Select
                  showSearch
                  placeholder={
                    selectedProvinceId ? "เลือกอำเภอ/เขต" : "เลือกจังหวัดก่อน"
                  }
                  disabled={!selectedProvinceId}
                  optionFilterProp="label"
                  allowClear
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
          </Row>

          <Form.Item name="address" label="ที่อยู่เต็ม">
            <Input.TextArea
              rows={3}
              placeholder="เลขที่ ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์"
            />
          </Form.Item>

          <Divider />

          {/* ─── ข้อมูลติดต่อ ─── */}
          <Title level={5}>ข้อมูลติดต่อ</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="อีเมลติดต่อสมัครงาน"
                rules={[{ required: true, type: "email" }]}
              >
                <Input prefix={<MailOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="เบอร์โทรศัพท์"
                rules={[{ required: true }]}
              >
                <Input prefix={<PhoneOutlined />} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="website" label="เว็บไซต์">
            <Input prefix="https://" placeholder="www.example.ac.th" />
          </Form.Item>

          <Divider />

          {/* ─── รายละเอียดโรงเรียน ─── */}
          <Title level={5}>รายละเอียด (SEO & Employer Branding)</Title>
          <Form.Item name="description" label="เกี่ยวกับโรงเรียน">
            <Input.TextArea
              rows={6}
              placeholder="เล่าประวัติความเป็นมา วัฒนธรรมองค์กร จุดเด่นของสถาบัน"
            />
          </Form.Item>
          <Form.Item name="vision" label="วิสัยทัศน์">
            <Input.TextArea
              rows={3}
              placeholder="เช่น สร้างผู้นำแห่งอนาคต ด้วยคุณธรรมและความรู้"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="curriculum" label="หลักสูตร">
                <Input placeholder="เช่น British, IB, Thai National" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="established" label="ปีที่ก่อตั้ง (พ.ศ.)">
                <Input placeholder="เช่น 2510" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="teacherCount" label="จำนวนครู (คน)">
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  placeholder="เช่น 120"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="studentCount" label="จำนวนนักเรียน (คน)">
                <InputNumber
                  min={0}
                  style={{ width: "100%" }}
                  placeholder="เช่น 2500"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="levels" label="ระดับชั้นที่เปิดสอน">
            {/* ✨ ดึงตัวเลือกจาก Config API */}
            <Select
              mode="multiple"
              placeholder="เลือกระดับชั้น"
              options={schoolLevels.map((l) => ({
                value: l.value,
                label: l.label,
              }))}
            />
          </Form.Item>

          <Form.Item name="benefits" label="สวัสดิการ (เพิ่มได้หลายรายการ)">
            <Select
              mode="tags"
              placeholder="เช่น ประกันสุขภาพ, อาหารกลางวัน, โบนัส"
            />
          </Form.Item>

          {/* ✨ แสดง accountPlan แบบ read-only — Admin เป็นคนจัดการ */}
          {profile.accountPlan && (
            <>
              <Divider />
              <Form.Item label="แผนบัญชี">
                <Text type="secondary" style={{ fontSize: 13 }}>
                  {profile.accountPlan === "basic" && "Basic"}
                  {profile.accountPlan === "premium" && "Premium"}
                  {profile.accountPlan === "enterprise" && "Enterprise"}
                  {!["basic", "premium", "enterprise"].includes(
                    profile.accountPlan ?? "",
                  ) && profile.accountPlan}{" "}
                  — ติดต่อทีมงานเพื่ออัปเกรด
                </Text>
              </Form.Item>
            </>
          )}
        </Form>
      )}
    </Drawer>
  );
};

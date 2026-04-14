"use client";

import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Spin,
  Typography,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
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
  onSave: (values: SchoolProfile) => void;
}

export const ProfileEditDrawer: React.FC<ProfileEditDrawerProps> = ({
  onSave,
}) => {
  const { isDrawerOpen, setIsDrawerOpen, profile } = useSchoolProfileStore();
  const [form] = Form.useForm();

  const [schoolTypes, setSchoolTypes] = useState<ConfigOption[]>([]);
  const [schoolLevels, setSchoolLevels] = useState<ConfigOption[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  // ✨ โหลดตัวเลือกจาก Config API ครั้งแรก
  useEffect(() => {
    setIsLoadingOptions(true);
    Promise.all([
      axios.get<{ status_code: number; data: ConfigOption[] }>("/api/v1/config/options?group=school_type"),
      axios.get<{ status_code: number; data: ConfigOption[] }>("/api/v1/config/options?group=school_level"),
    ])
      .then(([typeRes, levelRes]) => {
        if (typeRes.data.status_code === 200) setSchoolTypes(typeRes.data.data);
        if (levelRes.data.status_code === 200) setSchoolLevels(levelRes.data.data);
      })
      .catch((err) => console.error("❌ โหลด config options ไม่สำเร็จ:", err))
      .finally(() => setIsLoadingOptions(false));
  }, []);

  // ✨ ซิงค์ข้อมูลจาก store เข้า form ทุกครั้งที่เปิด Drawer
  React.useEffect(() => {
    if (isDrawerOpen) {
      form.setFieldsValue({
        ...profile,
        // แปลง teacherCount/studentCount เป็น number สำหรับ InputNumber
        teacherCount: profile.teacherCount ?? undefined,
        studentCount: profile.studentCount ?? undefined,
        // established เป็น string ของปี พ.ศ.
        established: profile.established ?? undefined,
      });
    }
  }, [isDrawerOpen, profile, form]);

  const handleFinish = (values: SchoolProfile) => {
    onSave(values);
  };

  return (
    <Drawer
      title="แก้ไขข้อมูลโรงเรียน"
      placement="right"
      onClose={() => setIsDrawerOpen(false)}
      open={isDrawerOpen}
      size="large"
      extra={
        <Space>
          <Button onClick={() => setIsDrawerOpen(false)}>ยกเลิก</Button>
          <Button type="primary" onClick={() => form.submit()}>
            บันทึกข้อมูล
          </Button>
        </Space>
      }
    >
      {isLoadingOptions ? (
        <Spin style={{ display: "block", margin: "40px auto" }} />
      ) : (
        <Form form={form} layout="vertical" onFinish={handleFinish}>

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
              <Form.Item name="type" label="ประเภทโรงเรียน" rules={[{ required: true }]}>
                {/* ✨ ดึงตัวเลือกจาก Config API */}
                <Select
                  placeholder="เลือกประเภท"
                  options={schoolTypes.map((t) => ({ value: t.value, label: t.label }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="affiliation" label="สังกัด">
                <Select
                  placeholder="เลือกสังกัด"
                  allowClear
                  options={AFFILIATION_OPTIONS.map((a) => ({ value: a, label: a }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="location" label="จังหวัด" rules={[{ required: true }]}>
                <Input placeholder="เช่น กรุงเทพมหานคร" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="district" label="อำเภอ / เขต">
                <Input placeholder="เช่น เขตจตุจักร" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="address" label="ที่อยู่เต็ม">
            <Input.TextArea rows={3} placeholder="เลขที่ ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์" />
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
              <Form.Item name="phone" label="เบอร์โทรศัพท์" rules={[{ required: true }]}>
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
            <Input.TextArea rows={6} placeholder="เล่าประวัติความเป็นมา วัฒนธรรมองค์กร จุดเด่นของสถาบัน" />
          </Form.Item>
          <Form.Item name="vision" label="วิสัยทัศน์">
            <Input.TextArea rows={3} placeholder="เช่น สร้างผู้นำแห่งอนาคต ด้วยคุณธรรมและความรู้" />
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
                <InputNumber min={0} style={{ width: "100%" }} placeholder="เช่น 120" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="studentCount" label="จำนวนนักเรียน (คน)">
                <InputNumber min={0} style={{ width: "100%" }} placeholder="เช่น 2500" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="levels" label="ระดับชั้นที่เปิดสอน">
            {/* ✨ ดึงตัวเลือกจาก Config API */}
            <Select
              mode="multiple"
              placeholder="เลือกระดับชั้น"
              options={schoolLevels.map((l) => ({ value: l.value, label: l.label }))}
            />
          </Form.Item>

          <Form.Item name="benefits" label="สวัสดิการ (เพิ่มได้หลายรายการ)">
            <Select mode="tags" placeholder="เช่น ประกันสุขภาพ, อาหารกลางวัน, โบนัส" />
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
                  {!["basic", "premium", "enterprise"].includes(profile.accountPlan ?? "") && profile.accountPlan}
                  {" "}— ติดต่อทีมงานเพื่ออัปเกรด
                </Text>
              </Form.Item>
            </>
          )}
        </Form>
      )}
    </Drawer>
  );
};

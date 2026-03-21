"use client";

import {
  ArrowLeftOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Switch,
  Typography,
} from "antd";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Mock Data สำหรับงานที่ต้องการแก้ไข
const MOCK_JOB_DATA = {
  "1": {
    title: "ครูสอนภาษาอังกฤษ (Full-time)",
    vacancyCount: 2,
    subjects: ["ภาษาอังกฤษ", "Conversation"],
    grades: ["มัธยมต้น", "มัธยมปลาย"],
    salary_type: "SPECIFY",
    salaryFrom: 25000,
    salaryTo: 35000,
    description: "รับผิดชอบการสอนภาษาอังกฤษพื้นฐานและเพื่อการสื่อสาร...",
    educationLevel: "ปริญญาตรีขึ้นไป",
    experience: "1-3 ปี",
    license: "ต้องมี",
    gender: "ไม่จำกัด",
    qualifications: "มีอัธยาศัยดี สอนสนุก รักเด็ก",
    duration: 30,
    status: true,
  },
};

export default function PostJobPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id as string;
  const isEdit = !!jobId;

  const [salaryType, setSalaryType] = useState("SPECIFY");

  useEffect(() => {
    if (isEdit && MOCK_JOB_DATA[jobId as keyof typeof MOCK_JOB_DATA]) {
      const data = MOCK_JOB_DATA[jobId as keyof typeof MOCK_JOB_DATA];
      form.setFieldsValue(data);
      setSalaryType(data.salary_type);
    }
  }, [isEdit, jobId, form]);

  const onFinish = (values: any) => {
    console.log(isEdit ? "Updating Job:" : "Creating Job:", values);
    // TODO: Connect with API (POST if !isEdit, PATCH if isEdit)
  };

  return (
    <div
      style={{
        minHeight: "100vh",

        paddingBottom: "100px",
      }}
    >
      {/* 1. Header & Navigation */}
      <div
        style={{
          padding: "16px 0",

          marginBottom: "40px",
        }}
      >
        <div
          style={{ maxWidth: "1152px", margin: "0 auto", padding: "0 24px" }}
        >
          <Breadcrumb
            items={[
              { title: <Link href="/pages/admin">แดชบอร์ด</Link> },
              { title: "งานของฉัน" },
              { title: isEdit ? "แก้ไขประกาศงาน" : "ลงประกาศงานใหม่" },
            ]}
          />
          <div
            style={{
              marginTop: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => router.back()}
            />
            <Title level={2} style={{ margin: 0 }}>
              {isEdit ? "แก้ไขประกาศงาน" : "ลงประกาศงานใหม่"} (School Board)
            </Title>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        <Row gutter={40}>
          <Col xs={24} lg={16}>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                vacancyCount: 1,
                salary_type: "SPECIFY",
                duration: 30,
                status: true,
              }}
              scrollToFirstError
            >
              <Space direction="vertical" size={24} style={{ width: "100%" }}>
                {/* SECTION 1: ข้อมูลตำแหน่งงาน */}
                <Card
                  title={
                    <Space>
                      <ThunderboltOutlined style={{ color: "#11b6f5" }} />{" "}
                      ข้อมูลตำแหน่งงาน
                    </Space>
                  }
                  variant="borderless"
                  style={{
                    borderRadius: "12px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <Row gutter={16}>
                    <Col span={16}>
                      <Form.Item
                        label="ตำแหน่งงาน"
                        name="title"
                        rules={[
                          { required: true, message: "กรุณาระบุตำแหน่งงาน" },
                        ]}
                        tooltip="เช่น ครูภาษาอังกฤษ, ครูสอนศิลปะ"
                      >
                        <Input size="large" placeholder="ระบุตำแหน่งงาน" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="รูปแบบงาน"
                        name="employmentType"
                        rules={[
                          { required: true, message: "กรุณาเลือกรูปแบบงาน" },
                        ]}
                      >
                        <Select size="large" placeholder="เลือกรูปแบบงาน">
                          <Option value="FULL_TIME">
                            งานเต็มเวลา (Full-time)
                          </Option>
                          <Option value="PART_TIME">
                            งานพาร์ทไทม์ (Part-time)
                          </Option>
                          <Option value="CONTRACT">สัญญาจ้าง</Option>
                          <Option value="INTERNSHIP">ฝึกงาน</Option>
                          <Option value="STUDENT_TEACHER">
                            นักศึกษาฝึกสอน
                          </Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="จำนวนที่รับ (คน)"
                        name="vacancyCount"
                        rules={[
                          { required: true, message: "กรุณาระบุจำนวนที่รับ" },
                        ]}
                      >
                        <InputNumber
                          size="large"
                          min={1}
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="วิชาที่สอน"
                        name="subjects"
                        rules={[
                          { required: true, message: "กรุณาเลือกวิชาที่สอน" },
                        ]}
                      >
                        <Select
                          mode="tags"
                          size="large"
                          placeholder="เลือกหรือพิมพ์วิชาที่สอน"
                          style={{ width: "100%" }}
                        >
                          <Option value="ภาษาอังกฤษ">ภาษาอังกฤษ</Option>
                          <Option value="คณิตศาสตร์">คณิตศาสตร์</Option>
                          <Option value="วิทยาศาสตร์">วิทยาศาสตร์</Option>
                          <Option value="ไทย">ภาษาไทย</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="ระดับชั้นที่สอน"
                        name="grades"
                        rules={[
                          { required: true, message: "กรุณาเลือกระดับชั้น" },
                        ]}
                      >
                        <Select
                          mode="multiple"
                          size="large"
                          placeholder="เลือกระดับชั้น"
                          style={{ width: "100%" }}
                        >
                          <Option value="อนุบาล">อนุบาล</Option>
                          <Option value="ประถมศึกษา">ประถมศึกษา</Option>
                          <Option value="มัธยมต้น">มัธยมต้น</Option>
                          <Option value="มัธยมปลาย">มัธยมปลาย</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>

                {/* SECTION 2: เงินเดือน */}
                <Card
                  title={
                    <Space>
                      <DollarOutlined style={{ color: "#52c41a" }} />{" "}
                      ข้อมูลเงินเดือน
                    </Space>
                  }
                  variant="borderless"
                  style={{
                    borderRadius: "12px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        label="รูปแบบเงินเดือน"
                        name="salary_type"
                        rules={[{ required: true }]}
                      >
                        <Select
                          size="large"
                          onChange={(val) => setSalaryType(val)}
                        >
                          <Option value="NOT_SPECIFIED">ไม่ระบุ</Option>
                          <Option value="NEGOTIABLE">ตามประสบการณ์</Option>
                          <Option value="SPECIFY">ระบุเงินเดือน</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    {salaryType === "SPECIFY" && (
                      <>
                        <Col span={12}>
                          <Form.Item
                            label="เงินเดือนเริ่มต้น (บาท)"
                            name="salaryFrom"
                          >
                            <InputNumber
                              size="large"
                              formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                              }
                              style={{ width: "100%" }}
                              placeholder="เช่น 15,000"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            label="เงินเดือนสูงสุด (บาท)"
                            name="salaryTo"
                          >
                            <InputNumber
                              size="large"
                              formatter={(value) =>
                                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                              }
                              style={{ width: "100%" }}
                              placeholder="เช่น 25,000"
                            />
                          </Form.Item>
                        </Col>
                      </>
                    )}
                  </Row>
                </Card>

                {/* SECTION 3: รายละเอียดงาน */}
                <Card
                  title={
                    <Space>
                      <FileTextOutlined style={{ color: "#faad14" }} />{" "}
                      รายละเอียดงาน
                    </Space>
                  }
                  variant="borderless"
                  style={{
                    borderRadius: "12px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <Form.Item
                    label="รายละเอียดความรับผิดชอบ"
                    name="description"
                    rules={[
                      { required: true, message: "กรุณาระบุรายละเอียดงาน" },
                    ]}
                  >
                    <Input.TextArea
                      rows={6}
                      placeholder="รายละเอียดหน้าที่ความรับผิดชอบ และเนื้องานเบื้องต้น..."
                    />
                  </Form.Item>
                </Card>

                {/* SECTION 4: เงื่อนไขผู้สมัคร */}
                <Card
                  title={
                    <Space>
                      <UserOutlined style={{ color: "#eb2f96" }} />{" "}
                      เงื่อนไขผู้สมัคร
                    </Space>
                  }
                  variant="borderless"
                  style={{
                    borderRadius: "12px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="ระดับการศึกษา" name="educationLevel">
                        <Select size="large" placeholder="เลือกวุฒิการศึกษา">
                          <Option value="ไม่กำหนด">ไม่กำหนด</Option>
                          <Option value="ปริญญาตรีขึ้นไป">
                            ปริญญาตรีขึ้นไป
                          </Option>
                          <Option value="ปริญญาโทขึ้นไป">ปริญญาโทขึ้นไป</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="ประสบการณ์สอน" name="experience">
                        <Select size="large" placeholder="เลือกประสบการณ์">
                          <Option value="ไม่จำกัด">ไม่จำกัด</Option>
                          <Option value="ฝึกสอน">ฝึกสอน</Option>
                          <Option value="น้อยกว่า 1 ปี">น้อยกว่า 1 ปี</Option>
                          <Option value="1-3 ปี">1-3 ปี</Option>
                          <Option value="3-5 ปี">3-5 ปี</Option>
                          <Option value="5-10 ปี">5-10 ปี</Option>
                          <Option value="มากกว่า 10 ปี">มากกว่า 10 ปี</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="ใบอนุญาตประกอบวิชาชีพครู"
                        name="license"
                      >
                        <Select size="large" placeholder="เลือกเงื่อนไข">
                          <Option value="ไม่จำเป็น">ไม่จำเป็น</Option>
                          <Option value="ต้องมี">ต้องมี</Option>
                          <Option value="ยินดีรับผู้ที่กำลังดำเนินการ">
                            ยินดีรับผู้ที่กำลังดำเนินการ
                          </Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="เพศ" name="gender">
                        <Select size="large">
                          <Option value="ไม่จำกัด">ไม่จำกัด</Option>
                          <Option value="ชาย">ชาย</Option>
                          <Option value="หญิง">หญิง</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        label="คุณสมบัติเพิ่มเติม"
                        name="qualifications"
                      >
                        <Input.TextArea placeholder="ระบุรายละเอียดเพิ่มเติม เช่น มีอัธยาศัยดี สอนสนุก รักเด็ก" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>

                {/* SECTION 5: สถานที่ทำงาน */}
                <Card
                  title={
                    <Space>
                      <EnvironmentOutlined style={{ color: "#ff4d4f" }} />{" "}
                      สถานที่ทำงาน
                    </Space>
                  }
                  variant="borderless"
                  style={{
                    borderRadius: "12px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <Alert
                    title="ดึงข้อมูลอัตโนมัติจาก School Profile ของคุณ"
                    type="info"
                    showIcon
                    style={{ marginBottom: "24px" }}
                  />
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="จังหวัด" name="province">
                        <Input size="large" disabled value="กรุงเทพมหานคร" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="เขต/พื้นที่" name="area">
                        <Input size="large" disabled value="จตุจักร" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item label="ที่อยู่โรงเรียน" name="address">
                        <Input.TextArea
                          disabled
                          rows={2}
                          value="เลขที่ 123 อาคารเรียนสีขาว ถ.พหลโยธิน แขวงลาดยาว"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>

                {/* SECTION 6: เงื่อนไขประกาศ */}
                <Card
                  variant="borderless"
                  style={{
                    borderRadius: "12px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <Row gutter={16} align="middle">
                    <Col span={12}>
                      <Form.Item
                        label="ระยะเวลาประกาศ"
                        name="duration"
                        rules={[{ required: true }]}
                      >
                        <Select size="large">
                          <Option value={30}>30 วัน</Option>
                          <Option value={60}>60 วัน</Option>
                          <Option value={90}>90 วัน</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="สถานะประกาศ"
                        name="status"
                        valuePropName="checked"
                      >
                        <Space size={12}>
                          <Switch defaultChecked />
                          <Text type="secondary">เปิด / ปิด การรับสมัคร</Text>
                        </Space>
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>

                {/* Action Buttons */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "16px",
                    marginTop: "24px",
                  }}
                >
                  <Button
                    size="large"
                    style={{ minWidth: "120px", borderRadius: "8px" }}
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    style={{
                      minWidth: "200px",
                      borderRadius: "8px",
                      backgroundColor: "#e60278",
                      borderColor: "#e60278",
                      fontWeight: 600,
                    }}
                  >
                    {isEdit ? "บันทึกการแก้ไข" : "ยืนยันการลงประกาศงาน"}
                  </Button>
                </div>
              </Space>
            </Form>
          </Col>

          {/* ✨ Sidebar for UI Decoration & Tips */}
          <Col xs={0} lg={8}>
            <div style={{ position: "sticky", top: "120px" }}>
              <Card
                variant="borderless"
                style={{
                  borderRadius: "24px",
                  background:
                    "linear-gradient(135deg, #001e45 0%, #003370 100%)",
                  color: "white",
                  overflow: "hidden",
                  marginBottom: "24px",
                }}
              >
                <div style={{ padding: "10px" }}>
                  <Title
                    level={4}
                    style={{ color: "white", marginBottom: "8px" }}
                  >
                    มาสร้างประกาศงานที่น่าสนใจกันเถอะ! 🚀
                  </Title>
                  <Paragraph
                    style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}
                  >
                    การระบุรายละเอียดวิชาและระดับชั้นที่ชัดเจน
                    จะช่วยให้คุณพบครูที่ตรงใจได้เร็วขึ้นถึง 2 เท่า
                  </Paragraph>
                  <img
                    src="https://illustrations.popsy.co/amber/launching-soon.svg"
                    alt="Success Illustration"
                    style={{
                      width: "100%",
                      height: "auto",
                      marginTop: "20px",
                      display: "block",
                    }}
                  />
                </div>
              </Card>

              <Card variant="borderless" style={{ borderRadius: "24px" }}>
                <Space direction="vertical" size={16}>
                  <Text strong>ทำไมต้องลงประกาศกับเรา?</Text>
                  <Space align="start">
                    <Badge status="success" />
                    <Text type="secondary" style={{ fontSize: "14px" }}>
                      เข้าถึงเครือข่ายครูคุณภาพทั่วประเทศ
                    </Text>
                  </Space>
                  <Space align="start">
                    <Badge status="success" />
                    <Text type="secondary" style={{ fontSize: "14px" }}>
                      ระบบคัดกรองผู้สมัครอัตโนมัติ
                    </Text>
                  </Space>
                </Space>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

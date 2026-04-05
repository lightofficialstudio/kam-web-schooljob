"use client";

import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Col,
  Flex,
  Form,
  Layout,
  Row,
  Space,
  Typography,
  theme as antTheme,
} from "antd";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { BasicInfoSection } from "./_components/basic-info-section";
import { JobDetailSection } from "./_components/job-detail-section";
import { JobTipsSidebar } from "./_components/job-tips-sidebar";
import { LocationSection } from "./_components/location-section";
import { PostSettingsSection } from "./_components/post-settings-section";
import { SalarySection } from "./_components/salary-section";
import { useJobPostStore } from "./_stores/job-post-store";

const { Title } = Typography;
const { Content } = Layout;

// ข้อมูล Mock สำหรับทดสอบโหมดแก้ไข (จะแทนที่ด้วย API จริง)
const MOCK_JOB_DATA: Record<string, Record<string, unknown>> = {
  "1": {
    title: "ครูสอนภาษาอังกฤษ (Full-time)",
    employmentType: "FULL_TIME",
    vacancyCount: 2,
    subjects: ["ภาษาอังกฤษ", "Conversation"],
    grades: ["มัธยมต้น", "มัธยมปลาย"],
    salary_type: "SPECIFY",
    salaryFrom: 25000,
    salaryTo: 35000,
    description: "รับผิดชอบการสอนภาษาอังกฤษพื้นฐานและเพื่อการสื่อสาร...",
    educationLevel: "ปริญญาตรีขึ้นไป",
    experience: "1 - 3 ปี",
    license: "จำเป็นต้องมี",
    gender: "ไม่จำกัด",
    qualifications: "มีอัธยาศัยดี สอนสนุก รักเด็ก",
    province: "กรุงเทพมหานคร",
    area: "เขตบางนา",
    address: "เลขที่ 123 ถ.บางนา กรุงเทพฯ",
    duration: 30,
    status: true,
  },
};

export default function PostJobPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const params = useParams();
  const { token } = antTheme.useToken();
  const jobId = params?.id as string | undefined;
  const isEdit = !!jobId;
  const { setSalaryType, setSubmitting, isSubmitting } = useJobPostStore();

  // โหลดข้อมูลงานที่ต้องการแก้ไข
  useEffect(() => {
    if (isEdit && MOCK_JOB_DATA[jobId]) {
      const data = MOCK_JOB_DATA[jobId];
      form.setFieldsValue(data);
      setSalaryType(data.salary_type as string);
    }
  }, [isEdit, jobId, form, setSalaryType]);

  // บันทึกข้อมูลเมื่อกด Submit
  const onFinish = async (values: Record<string, unknown>) => {
    setSubmitting(true);
    try {
      console.log(isEdit ? "✨ Updating Job:" : "✨ Creating Job:", values);
      // TODO: เชื่อมต่อ API → requestUpdateJob(jobId, values) | requestCreateJob(values)
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: token.colorBgLayout,
        paddingBottom: 100,
      }}
    >
      {/* Header Navigation */}
      <Flex
        vertical
        style={{
          backgroundColor: token.colorBgContainer,
          padding: "16px 0 24px",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          marginBottom: 40,
        }}
      >
        <Flex
          vertical
          gap={16}
          style={{
            maxWidth: 1152,
            margin: "0 auto",
            padding: "0 24px",
            width: "100%",
          }}
        >
          <Breadcrumb
            items={[
              { title: <Link href="/pages/employer">แดชบอร์ด</Link> },
              { title: <Link href="/pages/employer/job/read">งานของฉัน</Link> },
              { title: isEdit ? "แก้ไขประกาศงาน" : "ลงประกาศงานใหม่" },
            ]}
          />
          <Flex align="center" gap={12}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => router.back()}
            />
            <Title level={2} style={{ margin: 0 }}>
              {isEdit ? "แก้ไขประกาศงาน" : "ลงประกาศงานใหม่"} (School Board)
            </Title>
          </Flex>
        </Flex>
      </Flex>

      {/* Main Content */}
      <Content>
        <Flex style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
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
            style={{ width: "100%" }}
          >
            <Row gutter={40}>
              <Col xs={24} lg={16}>
                <Space
                  orientation="vertical"
                  size={24}
                  style={{ width: "100%" }}
                >
                  <BasicInfoSection />
                  <SalarySection />
                  <JobDetailSection />
                  <LocationSection />
                  <PostSettingsSection />
                  <Flex justify="flex-end" gap={16} style={{ marginTop: 8 }}>
                    <Button
                      size="large"
                      style={{ minWidth: 120 }}
                      onClick={() => router.back()}
                    >
                      ยกเลิก
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      htmlType="submit"
                      loading={isSubmitting}
                      style={{ minWidth: 200, fontWeight: 600 }}
                    >
                      {isEdit ? "บันทึกการแก้ไข" : "ยืนยันการลงประกาศงาน"}
                    </Button>
                  </Flex>
                </Space>
              </Col>
              <Col xs={0} lg={8}>
                <JobTipsSidebar isEdit={isEdit} />
              </Col>
            </Row>
          </Form>
        </Flex>
      </Content>
    </Layout>
  );
}

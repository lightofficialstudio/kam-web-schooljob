"use client";

import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Layout,
  Row,
  Space,
  Steps,
  Typography,
  theme as antTheme,
} from "antd";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import DocumentSection from "./components/document-section";
import JobSummary from "./components/job-summary";
import UserProfileCard from "./components/user-profile-card";
import { useApplyStore } from "./stores/apply-store";

const { Text } = Typography;

export default function JobApplyPage() {
  const { token } = antTheme.useToken();
  const params = useParams();
  const router = useRouter();
  const { currentStep, setCurrentStep } = useApplyStore();

  const jobInfo = {
    title: "ครูสอนภาษาอังกฤษ (English Teacher)",
    company: "โรงเรียนนานาชาติแสงทอง",
    logo: `https://api.dicebear.com/7.x/initials/svg?seed=ST&backgroundColor=${token.colorPrimary.replace("#", "")}`,
  };

  const steps = [
    { title: "เลือกเอกสาร" },
    { title: "คำถามจากนายจ้าง" },
    { title: "อัปเดตโปรไฟล์" },
    { title: "ตรวจสอบและส่ง" },
  ];

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: token.colorBgLayout,
        paddingBottom: "100px",
      }}
    >
      {/* Navigation Header */}
      <Layout.Header
        style={{
          background: token.colorBgContainer,
          padding: "0 40px",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          display: "flex",
          alignItems: "center",
          height: "64px",
        }}
      >
        <Link href="/pages/job">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            style={{ color: token.colorText }}
          >
            กลับไปที่หน้าค้นหา
          </Button>
        </Link>
      </Layout.Header>

      <Layout.Content>
        <Row justify="center" style={{ marginTop: "40px" }}>
          <Col
            xs={24}
            sm={22}
            md={18}
            lg={14}
            xl={12}
            style={{ padding: "0 24px" }}
          >
            {/* 1. Job Summary */}
            <JobSummary job={jobInfo} />

            {/* 2. Steps Indicator */}
            <Layout
              style={{ marginBottom: "60px", backgroundColor: "transparent" }}
            >
              <Steps
                current={currentStep}
                size="small"
                items={steps}
                labelPlacement="vertical"
              />
            </Layout>

            {/* 3. User Profile Card */}
            <UserProfileCard />

            {/* 4. Document Selection Section */}
            <DocumentSection />

            <Layout
              style={{ backgroundColor: "transparent", marginBottom: "24px" }}
            >
              <Text
                type="secondary"
                style={{ fontSize: "13px", color: token.colorTextDescription }}
              >
                ปลอดภัยไว้ก่อน.
                อย่าใส่ข้อมูลส่วนตัวที่ละเอียดอ่อนลงในเอกสารของคุณ.
                <Link
                  href="#"
                  style={{ marginLeft: "4px", color: token.colorPrimary }}
                >
                  ดูข้อมูลเพิ่มเติมเรื่องความเป็นส่วนตัว
                </Link>
              </Text>
            </Layout>

            {/* 6. Footer Action Button */}
            <Space
              direction="horizontal"
              style={{
                width: "100%",
                justifyContent: "center",
                marginTop: "60px",
              }}
            >
              <Button
                type="primary"
                size="large"
                style={{
                  height: "52px",
                  padding: "0 60px",
                  borderRadius: token.borderRadiusLG,
                  backgroundColor: token.colorPrimary,
                  fontWeight: 700,
                  fontSize: "16px",
                  boxShadow: token.boxShadowSecondary,
                }}
                onClick={() => setCurrentStep(Math.min(currentStep + 1, 3))}
              >
                ดำเนินการต่อ (Continue)
              </Button>
            </Space>
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  );
}

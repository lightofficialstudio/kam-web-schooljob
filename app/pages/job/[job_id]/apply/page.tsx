"use client";

import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Layout,
  Modal,
  Row,
  Space,
  Typography,
  theme as antTheme,
} from "antd";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
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
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const jobInfo = {
    title: "ครูสอนภาษาอังกฤษ (English Teacher)",
    company: "โรงเรียนนานาชาติแสงทอง",
    logo: `https://api.dicebear.com/7.x/initials/svg?seed=ST&backgroundColor=${token.colorPrimary.replace("#", "")}`,
  };

  const handleApply = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSubmit = () => {
    // TODO: Process API
    setIsConfirmModalOpen(false);
    // router.push("/pages/job/apply-success");
  };

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

            {/* 2. User Profile Card */}
            <UserProfileCard />

            {/* 3. Document Selection Section */}
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

            {/* 4. Footer Action Button */}
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
                onClick={handleApply}
              >
                ส่งใบสมัคร
              </Button>
            </Space>
          </Col>
        </Row>
      </Layout.Content>

      <Modal
        title="ยืนยันการสมัครงาน"
        open={isConfirmModalOpen}
        onOk={handleConfirmSubmit}
        onCancel={() => setIsConfirmModalOpen(false)}
        okText="ส่งใบสมัคร"
        cancelText="ยกเลิก"
        okButtonProps={{
          style: {
            backgroundColor: token.colorPrimary,
            borderRadius: "6px",
          },
        }}
        cancelButtonProps={{
          style: {
            borderRadius: "6px",
          },
        }}
      >
        <div style={{ padding: "10px 0" }}>
          <Text style={{ fontSize: "16px" }}>
            คุณต้องการส่งใบสมัครสำหรับตำแหน่งนี้ใช่หรือไม่ <br />
            โรงเรียนจะได้รับโปรไฟล์ของคุณ
          </Text>
        </div>
      </Modal>
    </Layout>
  );
}

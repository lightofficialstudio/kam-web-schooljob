"use client";

import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Layout,
  Modal,
  Row,
  Space,
  Spin,
  Typography,
  message,
  theme as antTheme,
} from "antd";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import DocumentSection from "./_components/document-section";
import JobSummary from "./_components/job-summary";
import UserProfileCard from "./_components/user-profile-card";
import { useApplyStore } from "./_state/apply-store";
import { useAuthStore } from "@/app/stores/auth-store";

const { Text } = Typography;

export default function JobApplyPage() {
  const { token } = antTheme.useToken();
  const params = useParams();
  const router = useRouter();
  const jobId = params?.job_id as string;

  const { user } = useAuthStore();
  const {
    job,
    isLoadingJob,
    isConfirmModalOpen,
    isSubmitting,
    setIsConfirmModalOpen,
    fetchJob,
    fetchProfile,
    submitApply,
    reset,
  } = useApplyStore();

  // ✨ ดึง job info + profile เมื่อ mount
  useEffect(() => {
    if (jobId) fetchJob(jobId);
    if (user?.user_id) fetchProfile(user.user_id);
    return () => reset();
  }, [jobId, user?.user_id]);

  const handleApply = () => {
    if (!user?.user_id) {
      message.warning("กรุณาเข้าสู่ระบบก่อนสมัครงาน");
      router.push("/pages/signin");
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!user?.user_id || !jobId) return;
    const result = await submitApply(user.user_id, jobId);
    if (result.success) {
      message.success(result.message);
      router.push("/pages/job");
    } else {
      message.error(result.message);
      setIsConfirmModalOpen(false);
    }
  };

  if (isLoadingJob) {
    return (
      <Layout style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spin size="large" />
      </Layout>
    );
  }

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
          <Button type="text" icon={<ArrowLeftOutlined />} style={{ color: token.colorText }}>
            กลับไปที่หน้าค้นหา
          </Button>
        </Link>
      </Layout.Header>

      <Layout.Content>
        <Row justify="center" style={{ marginTop: "40px" }}>
          <Col xs={24} sm={22} md={18} lg={14} xl={12} style={{ padding: "0 24px" }}>
            {/* 1. Job Summary */}
            <JobSummary
              job={{
                title: job?.title ?? "กำลังโหลด...",
                company: job?.schoolName ?? "",
                logo: job?.logoUrl ?? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(job?.schoolName ?? "school")}`,
              }}
            />

            {/* 2. User Profile Card */}
            <UserProfileCard />

            {/* 3. Document Selection Section */}
            <DocumentSection />

            <Layout style={{ backgroundColor: "transparent", marginBottom: "24px" }}>
              <Text type="secondary" style={{ fontSize: "13px", color: token.colorTextDescription }}>
                ปลอดภัยไว้ก่อน.
                อย่าใส่ข้อมูลส่วนตัวที่ละเอียดอ่อนลงในเอกสารของคุณ.
                <Link href="#" style={{ marginLeft: "4px", color: token.colorPrimary }}>
                  ดูข้อมูลเพิ่มเติมเรื่องความเป็นส่วนตัว
                </Link>
              </Text>
            </Layout>

            {/* 4. Footer Action Button */}
            <Space
              orientation="horizontal"
              style={{ width: "100%", justifyContent: "center", marginTop: "60px" }}
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
                disabled={!job}
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
        confirmLoading={isSubmitting}
        okButtonProps={{ style: { backgroundColor: token.colorPrimary, borderRadius: "6px" } }}
        cancelButtonProps={{ style: { borderRadius: "6px" } }}
      >
        <div style={{ padding: "10px 0" }}>
          <Text style={{ fontSize: "16px" }}>
            คุณต้องการส่งใบสมัครสำหรับตำแหน่ง{" "}
            <Text strong>{job?.title}</Text> ที่{" "}
            <Text strong>{job?.schoolName}</Text> ใช่หรือไม่? <br />
            โรงเรียนจะได้รับโปรไฟล์ของคุณ
          </Text>
        </div>
      </Modal>
    </Layout>
  );
}

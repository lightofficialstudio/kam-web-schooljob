"use client";

// Orchestrator — ประกอบ Component และจัด Layout ของหน้าโปรไฟล์โรงเรียน
import BaseModal from "@/app/components/layouts/modal/base-modal";
import { useAuthStore } from "@/app/stores/auth-store";
import { CheckCircleFilled } from "@ant-design/icons";
import { Button, Col, Flex, Row, Spin, theme } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ProfileEditDrawer } from "./_components/profile-edit-drawer";
import { SchoolInfoTab } from "./_components/school-info-tab";
import { SchoolProfileHeader } from "./_components/school-profile-header";
import { SchoolProfileSidebar } from "./_components/school-profile-sidebar";
import {
  SchoolProfile,
  useSchoolProfileState,
} from "./_state/school-profile.state";

export default function EmployerProfilePage() {
  const {
    profile,
    setIsDrawerOpen,
    saveProfile,
    isSaving,
    isLoading,
    fetchProfile,
  } = useSchoolProfileState();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { token } = theme.useToken();
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  // ✨ รอ hydration ก่อน redirect (ป้องกัน flash)
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ✨ Guard: ตรวจสอบ auth หลัง hydrate เสร็จ
  useEffect(() => {
    if (!isMounted) return;
    if (!isAuthenticated || !user) {
      router.replace("/pages/signin?redirect=%2Fpages%2Femployer%2Fprofile");
      return;
    }
    if (user.role !== "EMPLOYER") {
      router.replace(
        user.role === "EMPLOYEE" ? "/pages/employee/profile" : "/",
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, isAuthenticated, user?.role]);

  // ✨ โหลดโปรไฟล์จาก API หลัง mount
  useEffect(() => {
    if (!isMounted || !user?.user_id) return;
    fetchProfile(user.user_id, user.email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, user?.user_id]);

  const handleEditClick = () => setIsDrawerOpen(true);

  // บันทึกโปรไฟล์ผ่าน store → API แล้วแสดง success modal
  const handleSave = async (values: SchoolProfile) => {
    if (!user?.user_id) return;
    await saveProfile(values, user.user_id);
    setIsDrawerOpen(false);
    setIsSuccessModalOpen(true);
  };

  // รอ hydration
  if (!isMounted) return null;

  // แสดง Loading spinner ขณะโหลดข้อมูลจาก API
  if (isLoading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: "100vh" }}>
        <Spin size="large" />
      </Flex>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: token.colorBgLayout,
        paddingBottom: 80,
      }}
    >
      {/* ─── Hero Header ─── */}
      <SchoolProfileHeader profile={profile} onEditClick={handleEditClick} />

      {/* ─── Main Content ─── */}
      <div
        style={{
          maxWidth: 1100,
          margin: "32px auto 0",
          padding: "0 24px",
        }}
      >
        <Row gutter={[24, 24]}>
          {/* Left: sidebar */}
          <Col xs={24} lg={7}>
            <SchoolProfileSidebar
              profile={profile}
              onEditClick={handleEditClick}
            />
          </Col>

          {/* Right: school info */}
          <Col xs={24} lg={17}>
            <SchoolInfoTab profile={profile} onEditClick={handleEditClick} />
          </Col>
        </Row>
      </div>

      {/* ─── Edit Drawer ─── */}
      <ProfileEditDrawer onSave={handleSave} />

      {/* ─── Success Modal ─── */}
      <BaseModal
        open={isSuccessModalOpen}
        onCancel={() => setIsSuccessModalOpen(false)}
        type="success"
        mainTitle="อัปเดตข้อมูลสำเร็จ"
        subTitle="ข้อมูลโปรไฟล์โรงเรียนของคุณถูกบันทึกเรียบร้อยแล้ว"
        icon={<CheckCircleFilled style={{ color: token.colorSuccess }} />}
      >
        <Button
          block
          type="primary"
          size="large"
          loading={isSaving}
          onClick={() => setIsSuccessModalOpen(false)}
        >
          ตกลง
        </Button>
      </BaseModal>
    </div>
  );
}

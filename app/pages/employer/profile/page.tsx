"use client";

// Orchestrator — ประกอบ Component และจัด Layout ของหน้าโปรไฟล์โรงเรียน
import BaseModal from "@/app/components/layouts/modal/base-modal";
import { CheckCircleFilled } from "@ant-design/icons";
import { Button, Col, Row, theme } from "antd";
import { useState } from "react";

import { ProfileEditDrawer } from "./_components/profile-edit-drawer";
import { SchoolInfoTab } from "./_components/school-info-tab";
import { SchoolProfileHeader } from "./_components/school-profile-header";
import { SchoolProfileSidebar } from "./_components/school-profile-sidebar";
import {
  SchoolProfile,
  useSchoolProfileState,
} from "./_state/school-profile.state";

export default function EmployerProfilePage() {
  const { profile, setIsDrawerOpen, saveProfile, isSaving } =
    useSchoolProfileState();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { token } = theme.useToken();

  const handleEditClick = () => setIsDrawerOpen(true);

  // บันทึกโปรไฟล์ผ่าน store → API แล้วแสดง success modal
  const handleSave = async (values: SchoolProfile) => {
    await saveProfile(values);
    setIsDrawerOpen(false);
    setIsSuccessModalOpen(true);
  };

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
            <SchoolInfoTab profile={profile} />
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

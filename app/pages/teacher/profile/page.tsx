"use client";

import {
  EditOutlined,
  EnvironmentOutlined,
  LinkOutlined,
  MailOutlined,
  UserOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons";
import { Avatar, Button, Form, Progress, Space, Tag, Row, Col, Typography, Card, Divider } from "antd";
import { useState } from "react";
import {
  BasicInfoSection,
  EducationHistorySection,
  GenderDobPhotoSection,
  ProfileEditDrawer,
  ProfileSectionWrapper,
  SkillsLocationSection,
  TeachingInfoSection,
  WorkExperienceSection,
} from "./components";
import { useProfileStore } from "./stores/profile-store";
import { useNotificationModalStore } from "@/app/stores/notification-modal-store";

const { Title, Text, Link } = Typography;

type SectionId =
  | "basic-info"
  | "personal-info"
  | "education"
  | "work-experience"
  | "teaching"
  | "skills"
  | "personal-summary";

export default function TeacherProfilePage() {
  const { profile, setProfile } = useProfileStore();
  const { openNotification } = useNotificationModalStore();
  const [form] = Form.useForm();

  const [editSection, setEditSection] = useState<SectionId | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Profile strength calculation
  const calculateStrength = () => {
    let score = 0;
    if (profile.firstName) score += 10;
    if (profile.lastName) score += 10;
    if (profile.phoneNumber) score += 10;
    if (profile.profileImageUrl) score += 10;
    if (profile.specialization?.length) score += 15;
    if (profile.workExperiences?.length) score += 15;
    if (profile.educations?.length) score += 15;
    if (profile.preferredProvinces?.length) score += 15;
    return Math.min(score, 100);
  };

  const strengthScore = calculateStrength();

  const handleOpenEdit = (sectionId: SectionId) => {
    setEditSection(sectionId);

    // Initialize form with current data
    if (sectionId === "basic-info") {
      form.setFieldsValue({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phoneNumber: profile.phoneNumber,
      });
    } else if (sectionId === "personal-info") {
      form.setFieldsValue({
        gender: profile.gender,
        dateOfBirth: profile.dateOfBirth,
      });
    } else if (sectionId === "teaching") {
      form.setFieldsValue({
        specialization: profile.specialization,
        gradeCanTeach: profile.gradeCanTeach,
        teachingExperience: profile.teachingExperience,
      });
    } else if (sectionId === "skills") {
      form.setFieldsValue({
        languagesSpoken: profile.languagesSpoken,
        itSkills: profile.itSkills,
        specialActivities: profile.specialActivities,
        preferredProvinces: profile.preferredProvinces,
      });
    }

    setIsDrawerOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      // Update store
      setProfile({ ...profile, ...values });

      openNotification({
        type: "success",
        mainTitle: "บันทึกข้อมูลสำเร็จ",
        description: "ข้อมูลโปรไฟล์ของคุณถูกอัปเดตเรียบร้อยแล้ว",
        icon: <CheckCircleFilled style={{ color: "#52c41a" }} />
      });
      
      setIsDrawerOpen(false);
      setEditSection(null);
    } catch (err) {
      console.error("Validation error:", err);
      openNotification({
        type: "error",
        mainTitle: "เกิดข้อผิดพลาด",
        description: "กรุณาตรวจสอบข้อมูลในฟอร์มให้ถูกต้องอีกครั้ง",
        icon: <CloseCircleFilled style={{ color: "#ff4d4f" }} />
      });
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", paddingBottom: "80px" }}>
      {/* 1. Header Banner Area */}
      <div style={{ 
        backgroundColor: "#001529", 
        height: "224px", 
        position: "relative", 
        overflow: "hidden" 
      }}>
        <div style={{ 
          position: "absolute", top: "-80px", right: "-80px", 
          width: "256px", height: "256px", 
          backgroundColor: "#ff006e", borderRadius: "50%", opacity: 0.8 
        }} />
        <div style={{ 
          position: "absolute", bottom: "40px", right: "25%", 
          width: "128px", height: "128px", 
          backgroundColor: "#3a0ca3", borderRadius: "50%", opacity: 0.6 
        }} />
      </div>

      <Row justify="center">
        <Col span={24} style={{ maxWidth: "1152px", padding: "0 24px" }}>
          <Row gutter={40}>
            {/* LEFT COLUMN: Main Profile Content */}
            <Col span={16} style={{ marginTop: "-64px", zIndex: 10 }}>
              {/* Header Identity Card */}
              <Card 
                bordered={false} 
                style={{ borderRadius: "12px", marginBottom: "32px", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)" }}
                styles={{ body: { padding: "32px" } }}
              >
                <Row justify="space-between" align="top">
                  <Col>
                    <Space size={32} align="start">
                      <div style={{ position: "relative" }}>
                        <Avatar
                          size={140}
                          icon={<UserOutlined />}
                          src={profile.profileImageUrl}
                          style={{ 
                            border: "4px solid #fff", 
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            backgroundColor: "#f3f4f6",
                            borderRadius: "16px"
                          }}
                        />
                        <Button 
                          shape="circle"
                          icon={<EditOutlined style={{ color: "#6b7280" }} />}
                          style={{ 
                            position: "absolute", bottom: "8px", right: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            border: "1px solid #e5e7eb"
                          }}
                        />
                      </div>
                      <div style={{ paddingTop: "8px" }}>
                        <Title 
                          level={1} 
                          style={{ margin: 0, textTransform: "uppercase", fontSize: "36px", fontWeight: 700, letterSpacing: "-0.025em" }}
                        >
                          {profile.firstName || "THANAT"}{" "}
                          {profile.lastName || "PROMPIRIYA"}
                        </Title>
                        <Space direction="vertical" size={8} style={{ marginTop: "16px" }}>
                          <Space size={12}>
                            <EnvironmentOutlined style={{ color: "#9ca3af" }} />
                            <Text type="secondary">
                              {profile.preferredProvinces?.[0] || "Bang Sue, Bangkok"}
                            </Text>
                          </Space>
                          <Space size={12}>
                            <MailOutlined style={{ color: "#9ca3af" }} />
                            <Text type="secondary">
                              {profile.email || "lightofficialstudio@gmail.com"}
                            </Text>
                          </Space>
                          <Space size={12}>
                            <LinkOutlined style={{ color: "#9ca3af" }} />
                            <Link href="#" style={{ color: "#3b82f6" }}>
                              th.schooljob.com/profiles/{(profile.firstName || "").toLowerCase()}
                            </Link>
                          </Space>
                        </Space>
                      </div>
                    </Space>
                  </Col>
                  <Col>
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleOpenEdit("basic-info")}
                    />
                  </Col>
                </Row>
              </Card>

              <Space direction="vertical" size={32} style={{ width: "100%" }}>
                {/* Personal Summary Section */}
                <ProfileSectionWrapper
                  title="Personal summary"
                  onEdit={() => handleOpenEdit("skills")}
                  id="personal-summary"
                >
                  <Text style={{ fontSize: "15px", color: "#4b5563", lineHeight: 1.6 }}>
                    {profile.specialActivities ||
                      "ยังไม่มีข้อมูลสรุปเบื้องต้น แนะนำประสบการณ์การสอนของคุณเพื่อให้ทางโรงเรียนรู้จักคุณมากขึ้น..."}
                  </Text>
                </ProfileSectionWrapper>

                {/* 3. ประสบการณ์การทำงาน */}
                <div id="work-experience">
                  <Row justify="space-between" align="middle" style={{ marginBottom: "16px" }}>
                    <Title level={2} style={{ margin: 0, fontSize: "24px", fontWeight: 700 }}>Career history</Title>
                  </Row>
                  <WorkExperienceSection />
                </div>

                {/* 4. ประวัติการศึกษา */}
                <div id="education">
                  <Row justify="space-between" align="middle" style={{ marginBottom: "16px", marginTop: "24px" }}>
                    <Title level={2} style={{ margin: 0, fontSize: "24px", fontWeight: 700 }}>Education</Title>
                  </Row>
                  <EducationHistorySection />
                </div>

                {/* 5. ข้อมูลการสอน & Skills */}
                <ProfileSectionWrapper
                  title="Teaching Expertise & Skills"
                  onEdit={() => handleOpenEdit("teaching")}
                >
                  <Space direction="vertical" size={24} style={{ width: "100%" }}>
                    <div>
                      <Text strong style={{ display: "block", marginBottom: "12px" }}>วิชาที่เชี่ยวชาญ</Text>
                      <Space size={[8, 8]} wrap>
                        {profile.specialization?.length ? (
                          profile.specialization.map((s) => (
                            <Tag
                              key={s}
                              color="blue"
                              style={{ padding: "4px 12px", borderRadius: "999px", border: "1px solid #bfdbfe" }}
                            >
                              {s}
                            </Tag>
                          ))
                        ) : (
                          <Text type="secondary" italic>ไม่ได้ระบุ</Text>
                        )}
                      </Space>
                    </div>
                    <div>
                      <Text strong style={{ display: "block", marginBottom: "12px" }}>ทักษะด้านภาษาและไอที</Text>
                      <Space size={[8, 8]} wrap>
                        {profile.languagesSpoken?.length &&
                          profile.languagesSpoken.map((l) => (
                            <Tag
                              key={l}
                              icon={<EnvironmentOutlined />}
                              style={{ padding: "4px 12px", borderRadius: "999px" }}
                            >
                              {l}
                            </Tag>
                          ))}
                        {profile.itSkills?.length &&
                          profile.itSkills.map((i) => (
                            <Tag
                              key={i}
                              color="orange"
                              style={{ padding: "4px 12px", borderRadius: "999px" }}
                            >
                              {i}
                            </Tag>
                          ))}
                      </Space>
                    </div>
                  </Space>
                </ProfileSectionWrapper>
              </Space>
            </Col>

            {/* RIGHT COLUMN: Sidebar Stats & Tools */}
            <Col span={8} style={{ paddingTop: "40px" }}>
              <Space direction="vertical" size={32} style={{ width: "100%", position: "sticky", top: "24px" }}>
                {/* 1. Profile Visibility */}
                <div style={{ cursor: "pointer" }}>
                  <Row justify="space-between" align="middle" style={{ marginBottom: "8px" }}>
                    <Text strong style={{ fontSize: "16px" }}>Profile visibility</Text>
                    <LinkOutlined style={{ color: "#9ca3af" }} />
                  </Row>
                  <Text type="secondary">Standard</Text>
                  <Divider style={{ margin: "24px 0 0 0" }} />
                </div>

                {/* 2. Profile Activity */}
                <div style={{ cursor: "pointer" }}>
                  <Row justify="space-between" align="middle" style={{ marginBottom: "8px" }}>
                    <Text strong style={{ fontSize: "16px" }}>Profile activity</Text>
                    <LinkOutlined style={{ color: "#9ca3af" }} />
                  </Row>
                  <Text type="secondary">
                    คุณปรากฏในการค้นหา <Text strong>109 ครั้ง</Text> สัปดาห์นี้
                  </Text>
                  <Divider style={{ margin: "24px 0 0 0" }} />
                </div>

                {/* 3. Verifications */}
                <div style={{ cursor: "pointer" }}>
                  <Row justify="space-between" align="middle" style={{ marginBottom: "8px" }}>
                    <Text strong style={{ fontSize: "16px" }}>Verifications</Text>
                    <LinkOutlined style={{ color: "#9ca3af" }} />
                  </Row>
                  <Text type="secondary" style={{ fontSize: "14px", display: "block", marginBottom: "16px" }}>
                    โปรไฟล์ที่มีการยืนยันตัวตน มีโอกาสถูกเลือกโดยโรงเรียนมากกว่า
                  </Text>
                  <Button
                    block
                    style={{ height: "40px", borderColor: "#001529", color: "#001529", fontWeight: 600 }}
                  >
                    Get verified
                  </Button>
                  <Divider style={{ margin: "24px 0 0 0" }} />
                </div>

                {/* 4. Profile Strength */}
                <Card bordered={false} styles={{ body: { padding: "8px 0" } }}>
                  <Title level={4} style={{ margin: "0 0 16px 0", fontSize: "16px" }}>Profile strength</Title>
                  <Progress
                    percent={strengthScore}
                    strokeColor="#10b981"
                    showInfo={false}
                    style={{ marginBottom: "16px" }}
                  />
                  <Text type="secondary" style={{ fontSize: "14px", display: "block", marginBottom: "24px" }}>
                    แสดงผลงานและประวัติของคุณให้โรงเรียนเห็นเพื่อโอกาสในการรับงานที่ตรงใจ
                  </Text>
                  <Button
                    block
                    style={{ height: "40px", borderColor: "#001529", color: "#001529", fontWeight: 600 }}
                  >
                    Add license
                  </Button>
                </Card>

                {/* Search promotion card */}
                <Card 
                  bordered={false} 
                  style={{ backgroundColor: "#f9fafb", borderRadius: "12px", border: "1px solid #f3f4f6" }}
                  styles={{ body: { padding: "24px", textAlign: "center" } }}
                >
                  <Space direction="vertical" size={16} align="center">
                    <Avatar.Group>
                      <Avatar style={{ backgroundColor: "#f472b6" }} icon={<UserOutlined />} />
                      <Avatar style={{ backgroundColor: "#60a5fa" }} icon={<UserOutlined />} />
                      <Avatar style={{ backgroundColor: "#a78bfa" }} icon={<UserOutlined />} />
                    </Avatar.Group>
                    <Text strong style={{ fontSize: "16px" }}>Search for people</Text>
                    <Text type="secondary" style={{ fontSize: "13px" }}>
                      Find people who have made their profile public.
                    </Text>
                  </Space>
                </Card>
              </Space>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Unified Edit Drawer */}
      <ProfileEditDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSave}
        title={`แก้ไข${
          editSection === "basic-info"
            ? "ข้อมูลพื้นฐาน"
            : editSection === "personal-info"
              ? "ข้อมูลส่วนตัว"
              : editSection === "teaching"
                ? "ข้อมูลการสอน"
                : editSection === "skills"
                  ? "ทักษะและสถานที่ทำงาน"
                  : "ข้อมูล"
        }`}
      >
        <Form form={form} layout="vertical">
          {editSection === "basic-info" && <BasicInfoSection form={form} />}
          {editSection === "personal-info" && (
            <GenderDobPhotoSection form={form} />
          )}
          {editSection === "teaching" && <TeachingInfoSection form={form} />}
          {editSection === "skills" && <SkillsLocationSection form={form} />}
        </Form>
      </ProfileEditDrawer>
    </div>
  );
}

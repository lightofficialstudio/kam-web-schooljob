"use client";

import { useNotificationModalStore } from "@/app/stores/notification-modal-store";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  EditOutlined,
  EnvironmentOutlined,
  LinkOutlined,
  MailOutlined,
  PlayCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Form,
  Layout,
  Progress,
  Row,
  Space,
  Tag,
  Typography,
  theme as antTheme,
} from "antd";
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

const { Title, Text, Link } = Typography;
const { Content } = Layout;

type SectionId =
  | "basic-info"
  | "personal-info"
  | "education"
  | "work-experience"
  | "teaching"
  | "skills"
  | "personal-summary";

export default function EmployeeProfilePage() {
  const { token } = antTheme.useToken();
  const { profile, setProfile, setMockupData } = useProfileStore();
  const { openNotification } = useNotificationModalStore();
  const [form] = Form.useForm();

  const handleMockup = () => {
    setMockupData();
    openNotification({
      type: "success",
      mainTitle: "จำลองข้อมูลสำเร็จ",
      description: "ระบบได้จำลองข้อมูลโปรไฟล์ให้คุณเรียบร้อยแล้ว",
      icon: <CheckCircleFilled style={{ color: token.colorSuccess }} />,
    });
  };

  const [editSection, setEditSection] = useState<SectionId | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
      setProfile({ ...profile, ...values });
      openNotification({
        type: "success",
        mainTitle: "บันทึกข้อมูลสำเร็จ",
        description: "ข้อมูลโปรไฟล์ของคุณถูกอัปเดตเรียบร้อยแล้ว",
        icon: <CheckCircleFilled style={{ color: token.colorSuccess }} />,
      });
      setIsDrawerOpen(false);
      setEditSection(null);
    } catch (err) {
      console.error("Validation error:", err);
      openNotification({
        type: "error",
        mainTitle: "เกิดข้อผิดพลาด",
        description: "กรุณาตรวจสอบข้อมูลในฟอร์มให้ถูกต้องอีกครั้ง",
        icon: <CloseCircleFilled style={{ color: token.colorError }} />,
      });
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", paddingBottom: 80 }}>
      {/* 1. Header Banner */}
      <Flex
        style={{
          height: 224,
          position: "relative",
          overflow: "hidden",
          backgroundColor: token.colorPrimary,
        }}
      >
        <Avatar
          size={256}
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            backgroundColor: token.colorError,
            opacity: 0.8,
          }}
        />
        <Avatar
          size={128}
          style={{
            position: "absolute",
            bottom: 40,
            right: "25%",
            backgroundColor: token.colorInfo,
            opacity: 0.6,
          }}
        />
      </Flex>

      <Content>
        <Row justify="center">
          <Col span={24} style={{ maxWidth: 1152, padding: "0 24px" }}>
            <Row gutter={40}>
              {/* LEFT COLUMN */}
              <Col span={16} style={{ marginTop: -64, zIndex: 10 }}>
                {/* Header Identity Card */}
                <Card
                  variant="outlined"
                  style={{
                    borderRadius: token.borderRadiusLG,
                    marginBottom: 32,
                    boxShadow: token.boxShadowTertiary,
                    borderColor: token.colorBorderSecondary,
                  }}
                  styles={{ body: { padding: 32 } }}
                >
                  <Row justify="space-between" align="top">
                    <Col>
                      <Space size={32} align="start">
                        <Badge
                          count={
                            <Button
                              shape="circle"
                              size="small"
                              icon={
                                <EditOutlined
                                  style={{
                                    color: token.colorTextDescription,
                                  }}
                                />
                              }
                              style={{
                                boxShadow: token.boxShadowSecondary,
                                borderColor: token.colorBorderSecondary,
                              }}
                            />
                          }
                          offset={[-8, 120]}
                        >
                          <Avatar
                            size={140}
                            shape="square"
                            icon={<UserOutlined />}
                            src={profile.profileImageUrl || null}
                            style={{
                              border: `4px solid ${token.colorBgContainer}`,
                              boxShadow: token.boxShadowSecondary,
                              backgroundColor: token.colorBgLayout,
                              borderRadius: token.borderRadiusLG,
                            }}
                          />
                        </Badge>

                        <Flex vertical style={{ paddingTop: 8 }}>
                          <Title
                            level={1}
                            style={{
                              margin: 0,
                              textTransform: "uppercase",
                              fontSize: 36,
                              fontWeight: 700,
                              letterSpacing: "-0.025em",
                            }}
                          >
                            {profile.firstName || "THANAT"}{" "}
                            {profile.lastName || "PROMPIRIYA"}
                          </Title>

                          {/* Mockup Button */}
                          <div style={{ marginTop: 8 }}>
                            <Button
                              type="primary"
                              ghost
                              size="small"
                              icon={<PlayCircleOutlined />}
                              onClick={handleMockup}
                              style={{
                                borderRadius: token.borderRadiusSM,
                                fontSize: "12px",
                              }}
                            >
                              จำลองข้อมูล (Mockup Data)
                            </Button>
                          </div>

                          <Flex vertical gap={8} style={{ marginTop: 16 }}>
                            <Space size={12}>
                              <EnvironmentOutlined
                                style={{ color: token.colorTextDescription }}
                              />
                              <Text type="secondary">
                                {profile.preferredProvinces?.[0] ||
                                  "Bang Sue, Bangkok"}
                              </Text>
                            </Space>
                            <Space size={12}>
                              <MailOutlined
                                style={{ color: token.colorTextDescription }}
                              />
                              <Text type="secondary">
                                {profile.email ||
                                  "lightofficialstudio@gmail.com"}
                              </Text>
                            </Space>
                            <Space size={12}>
                              <LinkOutlined
                                style={{ color: token.colorTextDescription }}
                              />
                              <Link href="#">
                                schoolboard.com/profiles/
                                {(profile.firstName || "").toLowerCase()}
                              </Link>
                            </Space>
                          </Flex>
                        </Flex>
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

                <Flex vertical gap={32} style={{ width: "100%" }}>
                  {/* Personal Summary */}
                  <ProfileSectionWrapper
                    title="สรุปข้อมูลส่วนตัว"
                    onEdit={() => handleOpenEdit("skills")}
                    id="personal-summary"
                  >
                    <Text style={{ fontSize: 15, lineHeight: 1.6 }}>
                      {profile.specialActivities ||
                        "ยังไม่มีข้อมูลสรุปเบื้องต้น แนะนำประสบการณ์การสอนของคุณเพื่อให้ทางโรงเรียนรู้จักคุณมากขึ้น..."}
                    </Text>
                  </ProfileSectionWrapper>

                  {/* Work Experience */}
                  <ProfileSectionWrapper
                    id="work-experience"
                    title="ประวัติการทำงาน"
                  >
                    <WorkExperienceSection />
                  </ProfileSectionWrapper>

                  {/* Education */}
                  <ProfileSectionWrapper id="education" title="ประวัติการศึกษา">
                    <EducationHistorySection />
                  </ProfileSectionWrapper>

                  {/* Teaching & Skills */}
                  <ProfileSectionWrapper
                    title="ความเชี่ยวชาญการสอนและทักษะ"
                    onEdit={() => handleOpenEdit("teaching")}
                  >
                    <Flex vertical gap={24} style={{ width: "100%" }}>
                      <Flex vertical gap={12} style={{ width: "100%" }}>
                        <Text strong style={{ display: "block" }}>
                          วิชาที่เชี่ยวชาญ
                        </Text>
                        <Space size={[8, 8]} wrap>
                          {profile.specialization?.length ? (
                            profile.specialization.map((s) => (
                              <Tag
                                key={s}
                                color="blue"
                                style={{
                                  padding: "4px 12px",
                                  borderRadius: 999,
                                }}
                              >
                                {s}
                              </Tag>
                            ))
                          ) : (
                            <Text type="secondary" italic>
                              ยังไม่ได้ระบุ
                            </Text>
                          )}
                        </Space>
                      </Flex>
                      <Flex vertical gap={12} style={{ width: "100%" }}>
                        <Text strong style={{ display: "block" }}>
                          ทักษะด้านภาษาและไอที
                        </Text>
                        <Space size={[8, 8]} wrap>
                          {profile.languagesSpoken?.length
                            ? profile.languagesSpoken.map((l) => (
                                <Tag
                                  key={l}
                                  icon={<EnvironmentOutlined />}
                                  style={{
                                    padding: "4px 12px",
                                    borderRadius: 999,
                                  }}
                                >
                                  {l}
                                </Tag>
                              ))
                            : null}
                          {profile.itSkills?.length
                            ? profile.itSkills.map((i) => (
                                <Tag
                                  key={i}
                                  color="orange"
                                  style={{
                                    padding: "4px 12px",
                                    borderRadius: 999,
                                  }}
                                >
                                  {i}
                                </Tag>
                              ))
                            : null}
                          {!profile.languagesSpoken?.length &&
                            !profile.itSkills?.length && (
                              <Text type="secondary" italic>
                                ยังไม่ได้ระบุ
                              </Text>
                            )}
                        </Space>
                      </Flex>
                    </Flex>
                  </ProfileSectionWrapper>
                </Flex>
              </Col>

              {/* RIGHT COLUMN: Sidebar */}
              <Col span={8} style={{ paddingTop: 40 }}>
                <Flex vertical gap={32} style={{ position: "sticky", top: 24 }}>
                  {/* Profile Visibility */}
                  <Flex vertical gap={8} style={{ cursor: "pointer" }}>
                    <Row justify="space-between" align="middle">
                      <Text strong style={{ fontSize: 16 }}>
                        การมองเห็นโปรไฟล์
                      </Text>
                      <LinkOutlined
                        style={{ color: token.colorTextDescription }}
                      />
                    </Row>
                    <Text type="secondary">ระดับเริ่มต้น</Text>
                    <Divider style={{ margin: "24px 0 0 0" }} />
                  </Flex>

                  {/* Profile Activity */}
                  <Flex vertical gap={8} style={{ cursor: "pointer" }}>
                    <Row justify="space-between" align="middle">
                      <Text strong style={{ fontSize: 16 }}>
                        ความเคลื่อนไหวโปรไฟล์
                      </Text>
                      <LinkOutlined
                        style={{ color: token.colorTextDescription }}
                      />
                    </Row>
                    <Text type="secondary">
                      คุณปรากฏในการค้นหา <Text strong>109 ครั้ง</Text>{" "}
                      สัปดาห์นี้
                    </Text>
                    <Divider style={{ margin: "24px 0 0 0" }} />
                  </Flex>

                  {/* Verifications */}
                  <Flex vertical gap={16} style={{ cursor: "pointer" }}>
                    <Row justify="space-between" align="middle">
                      <Text strong style={{ fontSize: 16 }}>
                        การยืนยันตัวตน
                      </Text>
                      <LinkOutlined
                        style={{ color: token.colorTextDescription }}
                      />
                    </Row>
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      โปรไฟล์ที่มีการยืนยันตัวตน
                      มีโอกาสถูกเลือกโดยโรงเรียนมากกว่า
                    </Text>
                    <Button
                      block
                      style={{
                        height: 40,
                        borderColor: token.colorText,
                        color: token.colorText,
                        fontWeight: 600,
                      }}
                    >
                      ยืนยันตัวตนเลย
                    </Button>
                    <Divider style={{ margin: "8px 0 0 0" }} />
                  </Flex>

                  {/* Profile Strength */}
                  <Card>
                    <Title level={4}>ความสมบูรณ์ของโปรไฟล์</Title>
                    <Progress
                      percent={strengthScore}
                      strokeColor={token.colorSuccess}
                      showInfo={false}
                      style={{ marginBottom: 16 }}
                    />
                    <Text
                      type="secondary"
                      style={{
                        fontSize: 14,
                        display: "block",
                        marginBottom: 24,
                      }}
                    >
                      เพิ่มข้อมูลใบอนุญาตประกอบวิชาชีพเพื่อให้โรงเรียนมั่นใจมากขึ้น
                    </Text>
                    <Button
                      block
                      style={{
                        height: 40,
                        borderColor: token.colorText,
                        color: token.colorText,
                        fontWeight: 600,
                      }}
                    >
                      เพิ่มใบประกอบวิชาชีพ
                    </Button>
                  </Card>

                  {/* Search promotion card */}
                  <Card
                    variant="borderless"
                    style={{
                      borderRadius: token.borderRadiusLG,
                      borderColor: token.colorBorderSecondary,
                    }}
                    styles={{ body: { padding: 24, textAlign: "center" } }}
                  >
                    <Flex vertical gap={16} align="center">
                      <Avatar.Group>
                        <Avatar
                          icon={<UserOutlined />}
                          style={{ backgroundColor: token.colorError }}
                        />
                        <Avatar
                          icon={<UserOutlined />}
                          style={{ backgroundColor: token.colorInfo }}
                        />
                        <Avatar
                          icon={<UserOutlined />}
                          style={{ backgroundColor: token.colorWarning }}
                        />
                      </Avatar.Group>
                      <Text strong style={{ fontSize: 16 }}>
                        ค้นหาคุณครูท่านอื่น
                      </Text>
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        ค้นหาคุณครูที่เปิดโปรไฟล์เป็นสาธารณะเพื่อแลกเปลี่ยนเทคนิค
                      </Text>
                    </Flex>
                  </Card>
                </Flex>
              </Col>
            </Row>
          </Col>
        </Row>
      </Content>

      {/* Edit Drawer */}
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
    </Layout>
  );
}

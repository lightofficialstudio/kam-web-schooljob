"use client";

import { useNotificationModalStore } from "@/app/stores/notification-modal-store";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  EditOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  LinkOutlined,
  LockOutlined,
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
  Flex,
  Form,
  Layout,
  Modal,
  Progress,
  Radio,
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
  PersonalSummarySection,
  ProfileEditDrawer,
  ProfileSectionWrapper,
  ResumeUploadSection,
  SkillsLocationSection,
  TeachingInfoSection,
  TeachingLicenseSection,
  TeachingSkillsSection,
  WorkExperienceSection,
} from "./_components";
import { useProfileStore } from "./_stores/profile-store";

const { Title, Text, Link } = Typography;
const { Content } = Layout;

type SectionId =
  | "basic-info"
  | "personal-info"
  | "education"
  | "work-experience"
  | "teaching"
  | "skills"
  | "teaching-skills"
  | "personal-summary";

export default function EmployeeProfilePage() {
  const { token } = antTheme.useToken();
  const { profile, setProfile, setMockupData } = useProfileStore();
  const { openNotification } = useNotificationModalStore();
  const [form] = Form.useForm();

  const [isMockupModalOpen, setIsMockupModalOpen] = useState(false);

  const handleSelectPreset = (preset: 1 | 2 | 3) => {
    setMockupData(preset);
    setIsMockupModalOpen(false);
    openNotification({
      type: "success",
      mainTitle: "จำลองข้อมูลสำเร็จ",
      description: `โหลดโปรไฟล์รูปแบบที่ ${preset} เรียบร้อยแล้ว`,
      icon: <CheckCircleFilled style={{ color: token.colorSuccess }} />,
    });
  };

  // ข้อมูล preset สำหรับแสดงใน Modal
  const MOCKUP_PRESETS = [
    {
      preset: 1 as const,
      label: "รูปแบบที่ 1",
      title: "ครูภาษาอังกฤษ",
      desc: "ประสบการณ์สูง 5–10 ปี · มีใบประกอบวิชาชีพ · มหาวิทยาลัยธรรมศาสตร์",
      color: "#11b6f5",
    },
    {
      preset: 2 as const,
      label: "รูปแบบที่ 2",
      title: "ครูคณิตศาสตร์-วิทยาศาสตร์",
      desc: "ครูรุ่นใหม่ ประสบการณ์น้อย · อยู่ระหว่างขอใบประกอบฯ · ม.เกษตรศาสตร์",
      color: "#52c41a",
    },
    {
      preset: 3 as const,
      label: "รูปแบบที่ 3",
      title: "ครูปฐมวัย",
      desc: "ประสบการณ์ 3–5 ปี · ไม่ต้องใช้ใบประกอบฯ · ม.ราชภัฏพระนคร",
      color: "#fa8c16",
    },
  ];

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
        gender: profile.gender,
        dateOfBirth: profile.dateOfBirth,
        nationality: profile.nationality,
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
    } else if (sectionId === "skills" || sectionId === "teaching-skills") {
      form.setFieldsValue({
        specialization: profile.specialization,
        languageAndItSkills: [
          ...(profile.languagesSpoken ?? []),
          ...(profile.itSkills ?? []),
        ],
      });
    } else if (sectionId === "personal-summary") {
      form.setFieldsValue({
        specialActivities: profile.specialActivities,
      });
    }
    setIsDrawerOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const { languageAndItSkills, ...rest } = values as Record<
        string,
        unknown
      > & { languageAndItSkills?: string[] };
      const merged = {
        ...profile,
        ...rest,
        // ✨ [เก็บ languageAndItSkills รวมไว้ใน languagesSpoken]
        ...(languageAndItSkills !== undefined
          ? { languagesSpoken: languageAndItSkills, itSkills: [] }
          : {}),
      };
      setProfile(merged);
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
                              onClick={() => setIsMockupModalOpen(true)}
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
                    onEdit={() => handleOpenEdit("personal-summary")}
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
                    onEdit={() => handleOpenEdit("teaching-skills")}
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
                                color="#11b6f5"
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

                  {/* Resume */}
                  <ProfileSectionWrapper id="resume" title="เรซูเม่ของฉัน">
                    <ResumeUploadSection />
                  </ProfileSectionWrapper>

                  {/* ใบประกอบวิชาชีพ */}
                  <ProfileSectionWrapper
                    id="teaching-license"
                    title="ใบประกอบวิชาชีพ"
                  >
                    <TeachingLicenseSection />
                  </ProfileSectionWrapper>
                </Flex>
              </Col>

              {/* RIGHT COLUMN: Sidebar */}
              <Col span={8} style={{ paddingTop: 40 }}>
                <Flex vertical gap={32} style={{ position: "sticky", top: 24 }}>
                  {/* การมองเห็นโปรไฟล์ */}
                  <Card
                    styles={{ body: { padding: 20 } }}
                    style={{ borderColor: token.colorBorderSecondary }}
                  >
                    <Flex vertical gap={12}>
                      <Text strong style={{ fontSize: 15 }}>
                        การมองเห็นโปรไฟล์
                      </Text>
                      <Radio.Group
                        value={profile.profileVisibility ?? "public"}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            profileVisibility: e.target.value,
                          })
                        }
                      >
                        <Flex vertical gap={12}>
                          <Radio value="public">
                            <Flex gap={6} align="center">
                              <EyeOutlined
                                style={{ color: token.colorSuccess }}
                              />
                              <Flex vertical gap={0}>
                                <Text strong style={{ fontSize: 13 }}>
                                  เปิดสาธารณะ
                                </Text>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  โรงเรียนสามารถค้นหาและดูโปรไฟล์ของคุณได้
                                </Text>
                              </Flex>
                            </Flex>
                          </Radio>
                          <Radio value="apply_only">
                            <Flex gap={6} align="center">
                              <LockOutlined
                                style={{ color: token.colorWarning }}
                              />
                              <Flex vertical gap={0}>
                                <Text strong style={{ fontSize: 13 }}>
                                  เฉพาะเมื่อสมัครงาน
                                </Text>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  โรงเรียนจะเห็นโปรไฟล์เมื่อคุณสมัครตำแหน่งงาน
                                </Text>
                              </Flex>
                            </Flex>
                          </Radio>
                        </Flex>
                      </Radio.Group>
                    </Flex>
                  </Card>

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
        onSave={() => form.submit()}
        title={
          editSection === "basic-info"
            ? "แก้ไขข้อมูลพื้นฐาน"
            : editSection === "personal-info"
              ? "แก้ไขข้อมูลส่วนตัว"
              : editSection === "teaching"
                ? "แก้ไขข้อมูลการสอน"
                : editSection === "skills"
                  ? "แก้ไขทักษะและสถานที่ทำงาน"
                  : editSection === "teaching-skills"
                    ? "แก้ไขความเชี่ยวชาญการสอนและทักษะ"
                    : editSection === "personal-summary"
                      ? "แก้ไขสรุปข้อมูลส่วนตัว"
                      : "แก้ไขข้อมูล"
        }
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          {editSection === "basic-info" && <BasicInfoSection form={form} />}
          {editSection === "personal-info" && (
            <GenderDobPhotoSection form={form} />
          )}
          {editSection === "teaching" && <TeachingInfoSection form={form} />}
          {editSection === "skills" && <SkillsLocationSection form={form} />}
          {editSection === "teaching-skills" && (
            <TeachingSkillsSection form={form} />
          )}
          {editSection === "personal-summary" && (
            <PersonalSummarySection form={form} />
          )}
        </Form>
      </ProfileEditDrawer>

      {/* ─── Modal เลือกรูปแบบ Mockup Data ─── */}
      <Modal
        open={isMockupModalOpen}
        onCancel={() => setIsMockupModalOpen(false)}
        footer={null}
        title={
          <Flex align="center" gap={8}>
            <PlayCircleOutlined style={{ color: token.colorPrimary }} />
            <span>เลือกรูปแบบข้อมูลจำลอง</span>
          </Flex>
        }
        width={480}
      >
        <Flex vertical gap={12} style={{ padding: "8px 0 4px" }}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            เลือกรูปแบบโปรไฟล์ครูที่ต้องการจำลอง
            ข้อมูลปัจจุบันจะถูกแทนที่ทั้งหมด
          </Text>
          {MOCKUP_PRESETS.map(({ preset, label, title, desc, color }) => (
            <Flex
              key={preset}
              align="center"
              justify="space-between"
              onClick={() => handleSelectPreset(preset)}
              style={{
                padding: "16px 20px",
                borderRadius: token.borderRadius,
                border: `1.5px solid ${token.colorBorderSecondary}`,
                backgroundColor: token.colorFillQuaternary,
                cursor: "pointer",
              }}
            >
              <Flex align="center" gap={14}>
                <Flex
                  align="center"
                  justify="center"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: `${color}18`,
                    color,
                    fontWeight: 700,
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  {preset}
                </Flex>
                <Flex vertical gap={2}>
                  <Flex align="center" gap={8}>
                    <Text strong style={{ fontSize: 14 }}>
                      {title}
                    </Text>
                    <Tag color={color} style={{ fontSize: 11, margin: 0 }}>
                      {label}
                    </Tag>
                  </Flex>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {desc}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Modal>
    </Layout>
  );
}

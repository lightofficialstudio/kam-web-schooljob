"use client";

import { uploadFile } from "@/app/lib/storage";
import { useAuthStore } from "@/app/stores/auth-store";
import { useNotificationModalStore } from "@/app/stores/notification-modal-store";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  EditOutlined,
  EnvironmentOutlined,
  ExclamationCircleFilled,
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
  Spin,
  Tag,
  Tooltip,
  Typography,
  theme as antTheme,
} from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  BasicInfoSection,
  EducationHistorySection,
  GenderDobPhotoSection,
  PersonalSummarySection,
  ProfileEditDrawer,
  ProfileSectionWrapper,
  ResumeUploadSection,
  SkillsLocationSection,
  TeachingLicenseSection,
  TeachingSkillsSection,
  WorkExperienceSection,
} from "./_components";
import { useProfileStore } from "./_stores/profile-store";
import { patchBasicInfo, patchSummary } from "./_api/employee-profile-api";

const { Title, Text, Link } = Typography;
const { Content } = Layout;

type SectionId =
  | "basic-info"
  | "personal-info"
  | "education"
  | "work-experience"
  | "skills"
  | "teaching-skills"
  | "personal-summary";

export default function EmployeeProfilePage() {
  const { token } = antTheme.useToken();
  const {
    profile,
    setProfile,
    updateField,
    setMockupData,
    fetchProfile,
    saveProfile,
    isLoading,
  } = useProfileStore();
  const { openNotification } = useNotificationModalStore();
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const router = useRouter();
  const [form] = Form.useForm();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // ✨ อัปโหลดรูปโปรไฟล์จากปุ่มดินสอบน Avatar โดยตรง (ไม่เปิด Drawer)
  const handleAvatarFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !user?.user_id) return;
    e.target.value = ""; // reset เพื่อให้เลือกไฟล์เดิมซ้ำได้
    try {
      const result = await uploadFile("avatars", user.user_id, file);
      updateField("profileImageUrl", result.url);
      // ✨ ใช้ patchBasicInfo แทน saveProfile — อัปเดตเฉพาะ profile_image_url
      await patchBasicInfo(user.user_id, { profile_image_url: result.url });
      updateUser({ profile_image_url: result.url });
    } catch (err) {
      console.error("❌ [Avatar] upload error:", err);
    }
  };

  // ✨ รอให้ Zustand hydrate จาก localStorage เสร็จก่อน (ป้องกัน redirect ผิดพลาดตอน refresh)
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ✨ Guard: ตรวจสอบหลังจาก hydrate เสร็จแล้วเท่านั้น
  useEffect(() => {
    if (!isMounted) return;
    if (!isAuthenticated || !user) {
      router.replace("/pages/signin?redirect=%2Fpages%2Femployee%2Fprofile");
      return;
    }
    if (user.role !== "EMPLOYEE") {
      router.replace(
        user.role === "EMPLOYER" ? "/pages/employer/profile" : "/",
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, isAuthenticated, user?.role]);

  // ✨ โหลดข้อมูลโปรไฟล์จาก API โดยใช้ user_id + email จาก auth-store
  // ส่ง email ไปด้วยเพื่อให้ API auto-create profile ถ้ายังไม่มีใน DB
  useEffect(() => {
    if (!isMounted) return;
    if (user?.user_id) {
      fetchProfile(user.user_id, user.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, user?.user_id]);

  // ✨ sync รูปโปรไฟล์จาก profileStore → authStore เมื่อโหลดเสร็จ (Navbar จะอัปเดตทันที)
  useEffect(() => {
    if (!profile.profileImageUrl) return;
    if (profile.profileImageUrl !== user?.profile_image_url) {
      updateUser({ profile_image_url: profile.profileImageUrl });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.profileImageUrl]);

  const [editSection, setEditSection] = useState<SectionId | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMockupModalOpen, setIsMockupModalOpen] = useState(false);

  // ✨ profileStrength คำนวณโดย API — UI แสดงผลเท่านั้น
  const strengthScore = profile.profileStrength?.score ?? 0;
  const missingFields = profile.profileStrength?.missingFields ?? [];

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

  const MOCKUP_PRESETS = [
    {
      preset: 1 as const,
      label: "รูปแบบที่ 1",
      title: "ครูภาษาอังกฤษ",
      desc: "ประสบการณ์สูง 5–10 ปี · มีใบประกอบวิชาชีพ · มหาวิทยาลัยธรรมศาสตร์",
      color: token.colorPrimary,
    },
    {
      preset: 2 as const,
      label: "รูปแบบที่ 2",
      title: "ครูคณิตศาสตร์-วิทยาศาสตร์",
      desc: "ครูรุ่นใหม่ ประสบการณ์น้อย · อยู่ระหว่างขอใบประกอบฯ · ม.เกษตรศาสตร์",
      color: token.colorSuccess,
    },
    {
      preset: 3 as const,
      label: "รูปแบบที่ 3",
      title: "ครูปฐมวัย",
      desc: "ประสบการณ์ 3–5 ปี · ไม่ต้องใช้ใบประกอบฯ · ม.ราชภัฏพระนคร",
      color: token.colorWarning,
    },
  ];

  const handleOpenEdit = (sectionId: SectionId) => {
    setEditSection(sectionId);
    if (sectionId === "basic-info") {
      form.setFieldsValue({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phoneNumber: profile.phoneNumber,
        gender: profile.gender,
        dateOfBirth: profile.dateOfBirth ? dayjs(profile.dateOfBirth) : null,
        nationality: profile.nationality,
      });
    } else if (sectionId === "personal-info") {
      form.setFieldsValue({
        gender: profile.gender,
        dateOfBirth: profile.dateOfBirth ? dayjs(profile.dateOfBirth) : null,
      });
    } else if (sectionId === "teaching-skills") {
      // ✨ TeachingSkillsSection ใช้ field: specialization + languageAndItSkills (combined)
      form.setFieldsValue({
        specialization: profile.specialization,
        languageAndItSkills: [
          ...(profile.languagesSpoken ?? []),
          ...(profile.itSkills ?? []),
        ],
      });
    } else if (sectionId === "skills") {
      // ✨ SkillsLocationSection ใช้ field แยก: languagesSpoken, itSkills, preferredProvinces, canRelocate
      form.setFieldsValue({
        languagesSpoken: profile.languagesSpoken ?? [],
        itSkills: profile.itSkills ?? [],
        preferredProvinces: profile.preferredProvinces ?? [],
        canRelocate: profile.canRelocate ?? false,
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
      const { languageAndItSkills, dateOfBirth, ...rest } = values as Record<
        string,
        unknown
      > & { languageAndItSkills?: string[]; dateOfBirth?: unknown };

      const dobStr =
        dateOfBirth !== undefined
          ? dayjs.isDayjs(dateOfBirth)
            ? (dateOfBirth as ReturnType<typeof dayjs>).format("YYYY-MM-DD")
            : ((dateOfBirth as string | undefined) ?? undefined)
          : undefined;

      const merged = {
        ...profile,
        ...rest,
        ...(dobStr !== undefined ? { dateOfBirth: dobStr } : {}),
        // ✨ languageAndItSkills รวม language + IT ไว้ด้วยกัน — เก็บทั้งหมดใน languagesSpoken
        ...(languageAndItSkills !== undefined
          ? { languagesSpoken: languageAndItSkills }
          : {}),
      };
      setProfile(merged);

      if (user?.user_id) {
        // ✨ route ไปยัง 1:1 API ตาม section ที่กำลังแก้ไข
        if (editSection === "basic-info" || editSection === "personal-info") {
          await patchBasicInfo(user.user_id, {
            first_name: merged.firstName || undefined,
            last_name: merged.lastName || undefined,
            phone_number: merged.phoneNumber ?? null,
            gender: merged.gender ?? null,
            date_of_birth: dobStr ?? null,
            nationality: merged.nationality ?? null,
            profile_image_url: merged.profileImageUrl ?? null,
            profile_visibility: merged.profileVisibility,
          });
        } else if (editSection === "skills") {
          // ✨ SkillsLocationSection — ส่ง field แยก languagesSpoken, itSkills, preferred_provinces, can_relocate
          const vals = values as Record<string, unknown>;
          await patchSummary(user.user_id, {
            preferred_provinces: (vals.preferredProvinces as string[]) ?? [],
            can_relocate: vals.canRelocate as boolean ?? false,
          });
        } else if (
          editSection === "teaching-skills" ||
          editSection === "personal-summary"
        ) {
          await patchSummary(user.user_id, {
            special_activities: merged.specialActivities ?? null,
            teaching_experience: merged.teachingExperience ?? null,
            recent_school: merged.recentSchool ?? null,
            can_relocate: merged.canRelocate,
            license_status: merged.licenseStatus || null,
            specializations: merged.specialization ?? [],
            grade_can_teaches: merged.gradeCanTeach ?? [],
            preferred_provinces: merged.preferredProvinces ?? [],
          });
        } else {
          // ✨ fallback สำหรับ section อื่น — log warn เพื่อตรวจสอบ
          console.warn("⚠️ [handleSave] unknown editSection fallback:", editSection);
          await saveProfile(user.user_id);
        }

        // ✨ re-fetch profileStrength หลัง save เพื่ออัปเดต % ความสมบูรณ์ (fire-and-forget)
        void fetchProfile(user.user_id, user.email);
      }

      // ✨ sync รูปโปรไฟล์กลับไปที่ authStore
      if (merged.profileImageUrl && merged.profileImageUrl !== user?.profile_image_url) {
        updateUser({ profile_image_url: merged.profileImageUrl });
      }

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

  // ✨ รอ hydration เสร็จก่อน — ป้องกัน flash redirect ตอน refresh
  if (!isMounted) return null;

  // ✨ แสดง Loading spinner ขณะโหลดข้อมูลจาก API
  if (isLoading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: "100vh" }}>
        <Spin size="large" />
      </Flex>
    );
  }

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
                        {/* ─── Hidden file input สำหรับ Avatar ─── */}
                        <input
                          ref={avatarInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          style={{ display: "none" }}
                          onChange={handleAvatarFileChange}
                        />
                        <Badge
                          count={
                            <Tooltip
                              title="อัปโหลดรูปภาพส่วนตัว"
                              placement="right"
                            >
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
                                onClick={() => avatarInputRef.current?.click()}
                              />
                            </Tooltip>
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
                            {profile.firstName || "-"} {profile.lastName || ""}
                          </Title>

                          {/* ✨ ปุ่มจำลองข้อมูล Mockup */}
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
                                  "ยังไม่ระบุจังหวัด"}
                              </Text>
                            </Space>
                            <Space size={12}>
                              <MailOutlined
                                style={{ color: token.colorTextDescription }}
                              />
                              <Text type="secondary">
                                {profile.email || user?.email || "-"}
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
                                color={token.colorPrimary}
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
                                  color={token.colorWarning}
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
                    <ResumeUploadSection userId={user?.user_id ?? ""} />
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
                        onChange={async (e) => {
                          const newVisibility = e.target.value as
                            | "public"
                            | "apply_only";
                          updateField("profileVisibility", newVisibility);
                          if (user?.user_id) {
                            try {
                              await patchBasicInfo(user.user_id, { profile_visibility: newVisibility });
                            } catch {
                              // ✨ rollback store ถ้า API fail
                              updateField("profileVisibility", profile.profileVisibility ?? "public");
                              openNotification({
                                type: "error",
                                mainTitle: "บันทึกไม่สำเร็จ",
                                description: "ไม่สามารถเปลี่ยนการมองเห็นโปรไฟล์ได้ กรุณาลองใหม่",
                              });
                            }
                          }
                        }}
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
                  <Card
                    styles={{ body: { padding: 20 } }}
                    style={{ borderColor: token.colorBorderSecondary }}
                  >
                    <Flex vertical gap={12}>
                      {/* ── Header ── */}
                      <Flex justify="space-between" align="center">
                        <Text strong style={{ fontSize: 15 }}>
                          ความสมบูรณ์ของโปรไฟล์
                        </Text>
                        <Text
                          style={{
                            fontSize: 22,
                            fontWeight: 800,
                            color:
                              strengthScore >= 80
                                ? token.colorSuccess
                                : strengthScore >= 50
                                  ? token.colorWarning
                                  : token.colorError,
                          }}
                        >
                          {strengthScore}%
                        </Text>
                      </Flex>

                      {/* ── Progress Bar ── */}
                      <Progress
                        percent={strengthScore}
                        showInfo={false}
                        strokeColor={
                          strengthScore >= 80
                            ? token.colorSuccess
                            : strengthScore >= 50
                              ? token.colorWarning
                              : token.colorError
                        }
                        strokeLinecap="round"
                        style={{ margin: 0 }}
                      />

                      {/* ── Missing Fields ── */}
                      {missingFields.length > 0 ? (
                        <Flex vertical gap={6} style={{ marginTop: 4 }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            เพิ่มข้อมูลต่อไปนี้เพื่อให้โปรไฟล์สมบูรณ์:
                          </Text>
                          {missingFields.map((field) => (
                            <Flex key={field} align="center" gap={6}>
                              <ExclamationCircleFilled
                                style={{
                                  color: token.colorWarning,
                                  fontSize: 12,
                                  flexShrink: 0,
                                }}
                              />
                              <Text
                                style={{
                                  fontSize: 12,
                                  color: token.colorTextSecondary,
                                }}
                              >
                                {field}
                              </Text>
                            </Flex>
                          ))}
                        </Flex>
                      ) : (
                        <Flex align="center" gap={6} style={{ marginTop: 4 }}>
                          <CheckCircleFilled
                            style={{ color: token.colorSuccess, fontSize: 14 }}
                          />
                          <Text
                            style={{
                              fontSize: 13,
                              color: token.colorSuccess,
                              fontWeight: 600,
                            }}
                          >
                            โปรไฟล์ของคุณสมบูรณ์แล้ว!
                          </Text>
                        </Flex>
                      )}
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
        onSave={() => form.submit()}
        loading={false}
        title={
          editSection === "basic-info"
            ? "แก้ไขข้อมูลพื้นฐาน"
            : editSection === "personal-info"
              ? "แก้ไขข้อมูลส่วนตัว"
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
            <GenderDobPhotoSection form={form} userId={user?.user_id ?? ""} />
          )}
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

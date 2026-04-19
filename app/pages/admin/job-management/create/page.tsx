"use client";

import { useAuthStore } from "@/app/stores/auth-store";
import { useNotificationModalStore } from "@/app/stores/notification-modal-store";
import { useJobPostStore } from "@/app/pages/employer/job/post/_stores/job-post-store";
import { BasicInfoSection } from "@/app/pages/employer/job/post/_components/basic-info-section";
import { JobDetailSection } from "@/app/pages/employer/job/post/_components/job-detail-section";
import { JobTipsSidebar } from "@/app/pages/employer/job/post/_components/job-tips-sidebar";
import { LocationSection } from "@/app/pages/employer/job/post/_components/location-section";
import { PostJobSkeleton } from "@/app/pages/employer/job/post/_components/post-job-skeleton";
import { PostSettingsSection } from "@/app/pages/employer/job/post/_components/post-settings-section";
import { SalarySection } from "@/app/pages/employer/job/post/_components/salary-section";
import {
  ArrowLeftOutlined,
  BankOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons";
import {
  theme as antTheme,
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  Flex,
  Form,
  Layout,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;
const { Content } = Layout;

// ✨ Shape ของข้อมูลโรงเรียนที่ดึงจาก API
interface SchoolOption {
  id: string;
  schoolName: string;
  province: string;
  logoUrl: string | null;
}

export default function AdminCreateJobPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const { token } = antTheme.useToken();
  const { user } = useAuthStore();
  const { openNotification } = useNotificationModalStore();
  const { setSalaryType, setSubmitting, isSubmitting } = useJobPostStore();

  // ✨ State สำหรับ school selector (local เพราะใช้เฉพาะหน้านี้)
  const [schoolOptions, setSchoolOptions] = useState<SchoolOption[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);

  // ✨ โหลดรายการโรงเรียนทั้งหมดเมื่อ mount
  useEffect(() => {
    const fetchSchools = async () => {
      setIsLoadingSchools(true);
      try {
        const { data } = await axios.get<{
          status_code: number;
          data: SchoolOption[];
        }>("/api/v1/admin/schools/read");
        setSchoolOptions(data.data ?? []);
      } catch (err) {
        console.error("❌ [AdminCreateJobPage] โหลดรายการโรงเรียนไม่สำเร็จ:", err);
        openNotification({
          type: "error",
          mainTitle: "โหลดรายการโรงเรียนไม่สำเร็จ",
          description: "กรุณารีเฟรชหน้าและลองใหม่อีกครั้ง",
          icon: <CloseCircleFilled style={{ color: token.colorError }} />,
        });
      } finally {
        setIsLoadingSchools(false);
      }
    };

    fetchSchools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✨ แปลง form values → API payload (เหมือน employer page)
  const toApiPayload = (values: Record<string, unknown>) => ({
    title: values.title,
    employment_type: values.employmentType ?? null,
    vacancy_count: values.vacancyCount ?? 1,
    subjects: (values.subjects as string[]) ?? [],
    grades: (values.grades as string[]) ?? [],
    salary_type: values.salary_type ?? "SPECIFY",
    salary_min: values.salaryFrom ?? null,
    salary_max: values.salaryTo ?? null,
    salary_negotiable: values.salary_type === "NEGOTIABLE",
    description: values.description ?? null,
    education_level: values.educationLevel ?? null,
    experience: values.experience ?? null,
    license: values.license ?? null,
    gender: values.gender ?? null,
    qualifications: values.qualifications ?? null,
    province: values.province,
    area: values.area ?? null,
    address: values.address ?? null,
    deadline_days: values.duration ?? null,
    is_published: values.status === true,
    benefits: (values.benefits as string[]) ?? [],
  });

  // ✨ บันทึกข้อมูลเมื่อกด Submit
  const onFinish = async (values: Record<string, unknown>) => {
    if (!user?.user_id) {
      openNotification({
        type: "error",
        mainTitle: "ไม่พบข้อมูลผู้ใช้",
        description: "กรุณาเข้าสู่ระบบใหม่",
        icon: <CloseCircleFilled style={{ color: token.colorError }} />,
      });
      return;
    }

    if (!selectedSchoolId) {
      openNotification({
        type: "error",
        mainTitle: "กรุณาเลือกโรงเรียน",
        description: "ต้องเลือกโรงเรียนที่ต้องการลงประกาศงานก่อน",
        icon: <CloseCircleFilled style={{ color: token.colorError }} />,
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = toApiPayload(values);

      await axios.post(
        `/api/v1/admin/jobs/create?admin_user_id=${user.user_id}&school_profile_id=${selectedSchoolId}`,
        payload,
      );

      openNotification({
        type: "success",
        mainTitle: "ลงประกาศงานสำเร็จ",
        description: "ประกาศงานถูกสร้างเรียบร้อยแล้ว",
        icon: <CheckCircleFilled style={{ color: token.colorSuccess }} />,
      });
      router.push("/pages/admin/job-management");
    } catch (err) {
      console.error("❌ [AdminCreateJobPage] สร้างประกาศงานไม่สำเร็จ:", err);
      openNotification({
        type: "error",
        mainTitle: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสร้างประกาศงานได้ กรุณาลองใหม่อีกครั้ง",
        icon: <CloseCircleFilled style={{ color: token.colorError }} />,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ✨ แสดง skeleton ขณะโหลดรายการโรงเรียน
  if (isLoadingSchools) {
    return (
      <Layout
        style={{
          minHeight: "100vh",
          backgroundColor: token.colorBgLayout,
          paddingBottom: 100,
        }}
      >
        <Flex
          vertical
          style={{
            backgroundColor: token.colorBgContainer,
            padding: "16px 0 24px",
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              maxWidth: 1152,
              margin: "12px auto 0",
              padding: "0 24px",
              width: "100%",
            }}
          />
        </Flex>
        <Content>
          <PostJobSkeleton />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: token.colorBgLayout,
        paddingBottom: 100,
      }}
    >
      {/* ✨ Header Navigation */}
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
              { title: <Link href="/pages/admin/dashboard">แดชบอร์ด</Link> },
              {
                title: (
                  <Link href="/pages/admin/job-management">จัดการงาน</Link>
                ),
              },
              { title: "สร้างประกาศงาน" },
            ]}
          />
          <Flex align="center" gap={12}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => router.back()}
            />
            <Title level={2} style={{ margin: 0 }}>
              สร้างประกาศงาน (Admin)
            </Title>
          </Flex>
        </Flex>
      </Flex>

      {/* ✨ Main Content */}
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
                  direction="vertical"
                  size={24}
                  style={{ width: "100%" }}
                >
                  {/* ✨ School Selector — เลือกโรงเรียนที่ต้องการลงประกาศงานแทน */}
                  <Card
                    title={
                      <Flex align="center" gap={8}>
                        <BankOutlined style={{ color: token.colorPrimary }} />
                        <Text strong>เลือกโรงเรียน</Text>
                        <Tag color="blue" style={{ marginLeft: 4 }}>
                          จำเป็น
                        </Tag>
                      </Flex>
                    }
                    styles={{
                      header: {
                        borderBottom: `1px solid ${token.colorBorderSecondary}`,
                      },
                    }}
                  >
                    <Form.Item
                      label="โรงเรียนที่ต้องการลงประกาศงานแทน"
                      required
                      style={{ marginBottom: 0 }}
                    >
                      <Select
                        showSearch
                        placeholder="ค้นหาและเลือกโรงเรียน..."
                        size="large"
                        value={selectedSchoolId}
                        onChange={(value: string) =>
                          setSelectedSchoolId(value)
                        }
                        filterOption={(input, option) => {
                          // ✨ ค้นหาจากชื่อโรงเรียนและจังหวัด
                          const label =
                            String(option?.label ?? "").toLowerCase();
                          return label.includes(input.toLowerCase());
                        }}
                        notFoundContent="ไม่พบโรงเรียนที่ค้นหา"
                        style={{ width: "100%" }}
                        options={schoolOptions.map((school) => ({
                          value: school.id,
                          label: `${school.schoolName} — ${school.province}`,
                          school,
                        }))}
                        optionRender={(option) => {
                          const school = (
                            option.data as { school: SchoolOption }
                          ).school;
                          return (
                            <Flex align="center" gap={10}>
                              <Avatar
                                src={school.logoUrl}
                                icon={<BankOutlined />}
                                size={32}
                                style={{
                                  backgroundColor:
                                    token.colorPrimaryBg,
                                  color: token.colorPrimary,
                                  flexShrink: 0,
                                }}
                              />
                              <Flex vertical gap={1}>
                                <Text strong style={{ fontSize: 13 }}>
                                  {school.schoolName}
                                </Text>
                                <Tag
                                  color="blue"
                                  style={{
                                    fontSize: 11,
                                    padding: "0 6px",
                                    width: "fit-content",
                                  }}
                                >
                                  {school.province}
                                </Tag>
                              </Flex>
                            </Flex>
                          );
                        }}
                      />
                    </Form.Item>
                  </Card>

                  {/* ✨ ส่วนฟอร์มเดิม — reuse จาก employer job post */}
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
                      disabled={!selectedSchoolId}
                      style={{ minWidth: 200, fontWeight: 600 }}
                    >
                      ยืนยันการลงประกาศงาน
                    </Button>
                  </Flex>
                </Space>
              </Col>

              {/* ✨ Sidebar — แสดงเฉพาะ desktop */}
              <Col xs={0} lg={8}>
                <JobTipsSidebar isEdit={false} />
              </Col>
            </Row>
          </Form>
        </Flex>
      </Content>
    </Layout>
  );
}

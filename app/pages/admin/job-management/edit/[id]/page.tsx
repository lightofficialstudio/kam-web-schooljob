"use client";

import { useAuthStore } from "@/app/stores/auth-store";
import {
  ArrowLeftOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons";
import {
  theme as antTheme,
  Avatar,
  Breadcrumb,
  Button,
  Col,
  Flex,
  Form,
  Layout,
  Row,
  Space,
  Typography,
} from "antd";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BasicInfoSection } from "@/app/pages/employer/job/post/_components/basic-info-section";
import { JobDetailSection } from "@/app/pages/employer/job/post/_components/job-detail-section";
import { JobTipsSidebar } from "@/app/pages/employer/job/post/_components/job-tips-sidebar";
import { loadAll, LocationSection } from "@/app/pages/employer/job/post/_components/location-section";
import { PostJobSkeleton } from "@/app/pages/employer/job/post/_components/post-job-skeleton";
import { PostSettingsSection } from "@/app/pages/employer/job/post/_components/post-settings-section";
import { SalarySection } from "@/app/pages/employer/job/post/_components/salary-section";
import { useJobPostStore } from "@/app/pages/employer/job/post/_stores/job-post-store";
import { useNotificationModalStore } from "@/app/stores/notification-modal-store";

const { Title, Text } = Typography;
const { Content } = Layout;

export default function AdminEditJobPage() {
  const [form] = Form.useForm();
  const router  = useRouter();
  const params  = useParams();
  const { token } = antTheme.useToken();
  const { user }  = useAuthStore();
  const { openNotification } = useNotificationModalStore();
  const { setSalaryType, setSubmitting, isSubmitting, setSelectedProvinceId, setSelectedDistrictId, reset } = useJobPostStore();

  const jobId = params?.id as string;
  const [isLoadingJob, setIsLoadingJob] = useState(true);
  const [schoolInfo, setSchoolInfo]     = useState<{ schoolName: string; logoUrl: string | null } | null>(null);

  // ✨ โหลดข้อมูลงานผ่าน Admin API (ไม่ต้อง ownership)
  useEffect(() => {
    if (!jobId || !user?.user_id) return;
    reset();

    (async () => {
      setIsLoadingJob(true);
      try {
        const { data: res } = await axios.get("/api/v1/admin/jobs/get-one", {
          params: { admin_user_id: user.user_id, job_id: jobId },
        });
        const data = res.data;

        setSchoolInfo(data.schoolProfile ?? null);

        // ✨ map ข้อมูลจาก DB กลับเป็น form values
        const { provinces, districts } = await loadAll();
        const prov = provinces.find((p: { name_th: string }) => p.name_th === data.province);
        const dist = districts.find((d: { name_th: string; province_id: number }) =>
          d.name_th === data.district && (!prov || d.province_id === prov.id)
        );
        if (prov) setSelectedProvinceId(prov.id);
        if (dist) setSelectedDistrictId(dist.id);

        const salaryType = data.salaryNegotiable
          ? "NEGOTIABLE"
          : data.salaryMin && data.salaryMax
            ? "RANGE"
            : "SPECIFY";
        setSalaryType(salaryType);

        form.setFieldsValue({
          title:          data.title,
          employmentType: data.jobType,
          vacancyCount:   data.positionsAvailable,
          subjects:       data.jobSubjects?.map((s: { subject: string }) => s.subject) ?? [],
          grades:         data.jobGrades?.map((g: { grade: string }) => g.grade) ?? [],
          salary_type:    salaryType,
          salaryFrom:     data.salaryMin,
          salaryTo:       data.salaryMax,
          description:    data.description,
          province:       data.province,
          area:           data.district,
          status:         data.status === "OPEN",
          benefits:       data.jobBenefits?.map((b: { benefit: string }) => b.benefit) ?? [],
          duration:       30,
        });
      } catch (err) {
        console.error("❌ [AdminEditJobPage] โหลดข้อมูลไม่สำเร็จ:", err);
        openNotification({
          type: "error",
          mainTitle: "โหลดข้อมูลไม่สำเร็จ",
          description: "ไม่สามารถดึงข้อมูลประกาศงานได้",
          icon: <CloseCircleFilled style={{ color: token.colorError }} />,
        });
      } finally {
        setIsLoadingJob(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, user?.user_id]);

  const toApiPayload = (values: Record<string, unknown>) => ({
    title:              values.title,
    employment_type:    values.employmentType ?? null,
    vacancy_count:      values.vacancyCount ?? 1,
    subjects:           (values.subjects as string[]) ?? [],
    grades:             (values.grades as string[]) ?? [],
    salary_type:        values.salary_type ?? "SPECIFY",
    salary_min:         values.salaryFrom ?? null,
    salary_max:         values.salaryTo ?? null,
    salary_negotiable:  values.salary_type === "NEGOTIABLE",
    description:        values.description ?? null,
    education_level:    values.educationLevel ?? null,
    experience:         values.experience ?? null,
    license:            values.license ?? null,
    gender:             values.gender ?? null,
    qualifications:     values.qualifications ?? null,
    province:           values.province,
    area:               values.area ?? null,
    address:            values.address ?? null,
    deadline_days:      values.duration ?? null,
    is_published:       values.status === true,
    benefits:           (values.benefits as string[]) ?? [],
  });

  const onFinish = async (values: Record<string, unknown>) => {
    if (!user?.user_id) return;
    setSubmitting(true);
    try {
      await axios.patch(
        `/api/v1/admin/jobs/update?admin_user_id=${user.user_id}&job_id=${jobId}`,
        toApiPayload(values),
      );
      openNotification({
        type: "success",
        mainTitle: "แก้ไขประกาศงานสำเร็จ",
        description: "ข้อมูลประกาศงานถูกอัปเดตเรียบร้อยแล้ว",
        icon: <CheckCircleFilled style={{ color: token.colorSuccess }} />,
      });
      router.push("/pages/admin/job-management/read");
    } catch (err) {
      console.error("❌ [AdminEditJobPage] บันทึกไม่สำเร็จ:", err);
      openNotification({
        type: "error",
        mainTitle: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        icon: <CloseCircleFilled style={{ color: token.colorError }} />,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoadingJob) {
    return (
      <Layout style={{ minHeight: "100vh", backgroundColor: token.colorBgLayout, paddingBottom: 100 }}>
        <div style={{ backgroundColor: token.colorBgContainer, padding: "24px", borderBottom: `1px solid ${token.colorBorderSecondary}`, marginBottom: 40 }}>
          <div style={{ maxWidth: 1152, margin: "0 auto" }}>
            <div style={{ height: 20, width: 200, background: token.colorFillSecondary, borderRadius: 4, marginBottom: 16 }} />
            <div style={{ height: 32, width: "40%", background: token.colorFillSecondary, borderRadius: 4 }} />
          </div>
        </div>
        <Content><PostJobSkeleton /></Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: token.colorBgLayout, paddingBottom: 100 }}>
      {/* Header */}
      <Flex
        vertical
        style={{
          backgroundColor: token.colorBgContainer,
          padding: "16px 0 24px",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          marginBottom: 40,
        }}
      >
        <Flex vertical gap={16} style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px", width: "100%" }}>
          <Breadcrumb
            items={[
              { title: <Link href="/pages/admin/dashboard">แดชบอร์ด</Link> },
              { title: <Link href="/pages/admin/job-management/read">จัดการประกาศงาน</Link> },
              { title: "แก้ไขประกาศงาน" },
            ]}
          />
          <Flex align="center" gap={12}>
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => router.back()} />
            {schoolInfo && (
              <Avatar src={schoolInfo.logoUrl ?? undefined} size={32} style={{ border: `1px solid ${token.colorBorderSecondary}`, flexShrink: 0 }}>
                {schoolInfo.schoolName[0]}
              </Avatar>
            )}
            <div>
              <Title level={4} style={{ margin: 0, lineHeight: 1.3 }}>แก้ไขประกาศงาน</Title>
              {schoolInfo && (
                <Text type="secondary" style={{ fontSize: 12 }}>{schoolInfo.schoolName}</Text>
              )}
            </div>
            <span
              style={{
                marginLeft: "auto",
                fontSize: 11,
                padding: "3px 10px",
                borderRadius: 20,
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#ef4444",
                fontWeight: 600,
              }}
            >
              Admin Mode
            </span>
          </Flex>
        </Flex>
      </Flex>

      {/* Form */}
      <Content>
        <Flex style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ vacancyCount: 1, salary_type: "SPECIFY", duration: 30, status: true }}
            scrollToFirstError
            style={{ width: "100%" }}
          >
            <Row gutter={40}>
              <Col xs={24} lg={16}>
                <Space orientation="vertical" size={24} style={{ width: "100%" }}>
                  <BasicInfoSection />
                  <SalarySection />
                  <JobDetailSection />
                  <LocationSection />
                  <PostSettingsSection />
                  <Flex justify="flex-end" gap={16} style={{ marginTop: 8 }}>
                    <Button size="large" style={{ minWidth: 120 }} onClick={() => router.back()}>
                      ยกเลิก
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      htmlType="submit"
                      loading={isSubmitting}
                      style={{ minWidth: 200, fontWeight: 600 }}
                    >
                      บันทึกการแก้ไข
                    </Button>
                  </Flex>
                </Space>
              </Col>
              <Col xs={0} lg={8}>
                <JobTipsSidebar isEdit />
              </Col>
            </Row>
          </Form>
        </Flex>
      </Content>
    </Layout>
  );
}

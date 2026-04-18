"use client";

import { Col, Flex, Layout, Result, Row, Skeleton, Card, theme as antTheme } from "antd";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { OpenJobsSection } from "./_components/open-jobs-section";
import { SchoolBenefitsSection } from "./_components/school-benefits-section";
import { SchoolInfoSection } from "./_components/school-info-section";
import { SchoolProfileHeader } from "./_components/school-profile-header";
import { useSchoolProfileStore } from "./_state/school-profile-store";

const { Content } = Layout;

export default function SchoolProfilePage() {
  const { token } = antTheme.useToken();
  const params = useParams();
  const schoolId = params.school_id as string;

  const { school, isLoading, error, fetchSchool, reset } = useSchoolProfileStore();

  // ✨ โหลดข้อมูลโรงเรียนเมื่อ mount และ reset เมื่อออก
  useEffect(() => {
    if (schoolId) fetchSchool(schoolId);
    return () => reset();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolId]);

  // ── Loading ──
  if (isLoading) {
    return (
      <Layout style={{ minHeight: "100vh", backgroundColor: token.colorBgLayout }}>
        <Skeleton.Image active style={{ width: "100%", height: 240 }} />
        <Content style={{ padding: "24px", maxWidth: 1100, margin: "0 auto", width: "100%" }}>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Flex vertical gap={24}>
                <Card style={{ borderRadius: token.borderRadiusLG }}>
                  <Skeleton active avatar={{ size: 100, shape: "square" }} paragraph={{ rows: 3 }} />
                </Card>
                <Card style={{ borderRadius: token.borderRadiusLG }}>
                  <Skeleton active paragraph={{ rows: 4 }} />
                </Card>
              </Flex>
            </Col>
            <Col xs={24} lg={8}>
              <Card style={{ borderRadius: token.borderRadiusLG }}>
                <Skeleton active paragraph={{ rows: 6 }} />
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }

  // ── Error / Not found ──
  if (error || !school) {
    return (
      <Layout style={{ minHeight: "100vh", backgroundColor: token.colorBgLayout }}>
        <Content style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Result
            status="404"
            title="ไม่พบข้อมูลโรงเรียน"
            subTitle={error ?? "โรงเรียนนี้อาจถูกลบหรือ URL ไม่ถูกต้อง"}
          />
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: token.colorBgLayout }}>
      {/* ── Header (Cover + Logo + Identity + Stats) ── */}
      <SchoolProfileHeader school={school} />

      <Content style={{ padding: "32px 24px 80px" }}>
        <Row justify="center">
          <Col span={24} style={{ maxWidth: 1100 }}>
            <Row gutter={[24, 24]}>

              {/* ── LEFT: ตำแหน่งงาน ── */}
              <Col xs={24} lg={16}>
                <OpenJobsSection jobs={school.jobs} schoolId={school.id} />
              </Col>

              {/* ── RIGHT: เกี่ยวกับ + สวัสดิการ ── */}
              <Col xs={24} lg={8}>
                <Flex vertical gap={24} style={{ position: "sticky", top: 24 }}>
                  <SchoolInfoSection school={school} />
                  <SchoolBenefitsSection benefits={school.benefits} />
                </Flex>
              </Col>

            </Row>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

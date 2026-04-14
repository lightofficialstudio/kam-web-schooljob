"use client";

import { useAuthStore } from "@/app/stores/auth-store";
import {
  BankOutlined,
  BookOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  CloseOutlined,
  EnvironmentOutlined,
  FireOutlined,
  InfoCircleOutlined,
  MoreOutlined,
  ShareAltOutlined,
  TeamOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Flex,
  Layout,
  Row,
  Space,
  Tag,
  Typography,
  theme as antTheme,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/th";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useJobSearchStore } from "../_state/job-search-store";

dayjs.extend(relativeTime);
dayjs.locale("th");

const { Title, Text } = Typography;

// ✨ ชุด banner สำหรับสุ่มแสดงเมื่อโรงเรียนไม่ได้อัปโหลดรูป
const BANNER_THEMES = [
  {
    gradient: "linear-gradient(135deg, #0d8fd4 0%, #11b6f5 55%, #5dd5fb 100%)",
    headline: (school: string) => school,
    sub: "เปิดรับสมัครบุคลากรทางการศึกษา",
    accent: "กำลังมองหาครูผู้มีอุดมการณ์",
    Icon: BankOutlined,
  },
  {
    gradient: "linear-gradient(135deg, #0878a8 0%, #0d8fd4 50%, #11b6f5 100%)",
    headline: () => "ร่วมทีมวิชาการ",
    sub: "กับ {school}",
    accent: "สร้างอนาคตที่ดีให้เยาวชนไทยไปด้วยกัน",
    Icon: BookOutlined,
  },
  {
    gradient: "linear-gradient(135deg, #001e45 0%, #0a4a8a 60%, #11b6f5 100%)",
    headline: () => "ตำแหน่งว่างใหม่",
    sub: "โรงเรียนกำลังมองหาครูที่ใช่",
    accent: "สมัครได้วันนี้ — อย่าพลาดโอกาสนี้",
    Icon: ThunderboltOutlined,
  },
  {
    gradient: "linear-gradient(135deg, #0d8fd4 0%, #0878a8 40%, #055a7a 100%)",
    headline: () => "รับสมัครครูด่วน",
    sub: "มีตำแหน่งว่างหลายอัตรา รอคุณอยู่",
    accent: "เปิดรับสมัครอย่างเป็นทางการ",
    Icon: FireOutlined,
  },
];

// ✨ Banner ของ Drawer — แสดงรูปจริงถ้ามี, ไม่มีสุ่ม banner สำหรับประกาศรับสมัคร
const JobBanner = ({ job }: { job: { id: string; schoolName: string; logoUrl?: string; subjects: string[]; vacancyCount: number } }) => {
  // ✨ กำหนด theme ตาม job.id (คงที่ต่อ job ไม่เปลี่ยนทุก render)
  const themeIndex = job.id.charCodeAt(0) % BANNER_THEMES.length;
  const theme = BANNER_THEMES[themeIndex];
  const { Icon } = theme;

  // ✨ Decorators ที่ใช้ร่วมกันทั้ง 2 โหมด
  const SharedDecorators = () => (
    <>
      {/* grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />
      {/* glow top-right */}
      <div style={{
        position: "absolute", top: "-30%", right: "-8%", pointerEvents: "none",
        width: 360, height: 360, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.11) 0%, transparent 65%)",
      }} />
      {/* glow bottom-left */}
      <div style={{
        position: "absolute", bottom: "-40%", left: "-6%", pointerEvents: "none",
        width: 280, height: 280, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(17,182,245,0.18) 0%, transparent 65%)",
      }} />
      {/* shimmer sweep — CSS keyframe via style tag */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.07) 50%, transparent 60%)",
        backgroundSize: "200% 100%",
        animation: "bannerShimmer 4s ease-in-out infinite",
      }} />
      {/* bottom fade → content card ลอยขึ้น smooth */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 64, pointerEvents: "none",
        background: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.18) 100%)",
      }} />
    </>
  );

  // ✨ มีรูปโรงเรียน → blur เป็น BG + โลโก้ชัดพร้อม glow ring
  if (job.logoUrl) {
    return (
      <div style={{ height: 240, position: "relative", overflow: "hidden", background: "#07101f" }}>
        {/* รูป blur */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${job.logoUrl})`,
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "blur(28px) brightness(0.25) saturate(1.4)",
          transform: "scale(1.14)",
        }} />
        {/* overlay gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(160deg, rgba(13,143,212,0.25) 0%, rgba(0,15,40,0.7) 100%)",
        }} />
        <SharedDecorators />

        {/* content */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center",
          gap: 20, padding: "0 48px",
        }}>
          {/* logo card + blue ring */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            {/* glow ring */}
            <div style={{
              position: "absolute", inset: -4, borderRadius: 20,
              background: "linear-gradient(135deg, rgba(17,182,245,0.6) 0%, rgba(93,213,251,0.3) 100%)",
              filter: "blur(6px)",
            }} />
            <div style={{
              position: "relative", width: 80, height: 80, borderRadius: 16,
              background: "#fff", overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 2px rgba(17,182,245,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={job.logoUrl} alt={job.schoolName} style={{ width: 64, height: 64, objectFit: "contain" }} />
            </div>
          </div>

          {/* text */}
          <div>
            {/* pill */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: "rgba(17,182,245,0.25)", backdropFilter: "blur(10px)",
              border: "1px solid rgba(17,182,245,0.45)",
              borderRadius: 100, padding: "3px 12px", marginBottom: 10,
            }}>
              <BankOutlined style={{ fontSize: 11, color: "#5dd5fb" }} />
              <Text style={{ color: "#5dd5fb", fontSize: 11, fontWeight: 600, letterSpacing: 0.4 }}>
                เปิดรับสมัคร {job.vacancyCount} อัตรา
              </Text>
            </div>
            <Title level={3} style={{ color: "#fff", margin: 0, lineHeight: 1.25, textShadow: "0 2px 16px rgba(0,0,0,0.5)" }}>
              {job.schoolName}
            </Title>
            {job.subjects.length > 0 && (
              <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, marginTop: 4, display: "block" }}>
                {job.subjects.slice(0, 3).join(" · ")}
              </Text>
            )}
          </div>
        </div>

        {/* shimmer keyframe */}
        <style>{`@keyframes bannerShimmer { 0%,100%{background-position:200% 0} 50%{background-position:0% 0} }`}</style>
      </div>
    );
  }

  // ✨ ไม่มีรูป → banner gradient + decorators + left-aligned content
  const headline = theme.headline(job.schoolName);
  const sub = theme.sub.replace("{school}", job.schoolName);

  return (
    <div style={{
      height: 240, background: theme.gradient,
      position: "relative", overflow: "hidden",
    }}>
      <SharedDecorators />

      {/* large ghost icon — bottom-right depth layer */}
      <Icon style={{
        position: "absolute", bottom: -20, right: 20, pointerEvents: "none",
        fontSize: 180, color: "rgba(255,255,255,0.045)",
        lineHeight: 1,
      }} />

      {/* content */}
      <div style={{
        position: "relative", zIndex: 1,
        padding: "0 48px", height: "100%",
        display: "flex", flexDirection: "column", justifyContent: "center",
      }}>
        {/* pill badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6, alignSelf: "flex-start",
          background: "rgba(255,255,255,0.14)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.22)",
          borderRadius: 100, padding: "5px 14px", marginBottom: 18,
        }}>
          <Icon style={{ fontSize: 11, color: "#fff" }} />
          <Text style={{ color: "#fff", fontSize: 12, fontWeight: 600, letterSpacing: 0.4 }}>
            เปิดรับสมัคร {job.vacancyCount} อัตรา
          </Text>
        </div>

        <Title level={2} style={{ color: "#fff", margin: 0, lineHeight: 1.15, fontWeight: 700, letterSpacing: -0.3 }}>
          {headline}
        </Title>
        <Title level={5} style={{ color: "rgba(255,255,255,0.82)", margin: "6px 0 0", fontWeight: 400 }}>
          {sub}
        </Title>
        <Text style={{ color: "rgba(255,255,255,0.48)", fontSize: 11, display: "block", marginTop: 12, letterSpacing: 1.2, fontWeight: 500 }}>
          {theme.accent.toUpperCase()}
        </Text>
      </div>

      <style>{`@keyframes bannerShimmer { 0%,100%{background-position:200% 0} 50%{background-position:0% 0} }`}</style>
    </div>
  );
};

// Drawer แสดงรายละเอียดงานแบบเต็ม (80% width) พร้อมปุ่มสมัคร
export const JobDetailDrawer = () => {
  const { token } = antTheme.useToken();
  const { user } = useAuthStore();
  const { selectedJob, isDrawerOpen, setIsDrawerOpen } = useJobSearchStore();

  return (
    <Drawer
      open={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
      size="80%"
      closable={false}
      styles={{ body: { padding: 0 } }}
    >
      {selectedJob && (
        <Layout
          style={{
            position: "relative",
            minHeight: "100%",
            backgroundColor: token.colorBgContainer,
          }}
        >
          {/* Sticky Action Bar */}
          <Layout.Header
            style={{
              position: "sticky",
              top: 0,
              zIndex: 100,
              backgroundColor: token.colorBgContainer,
              padding: "16px 24px",
              borderBottom: `1px solid ${token.colorBorderSecondary}`,
              height: "auto",
            }}
          >
            <Flex justify="flex-end" align="center" gap={12}>
              <Button
                type="text"
                icon={<ShareAltOutlined />}
                style={{ fontSize: 20 }}
              />
              <Button
                type="text"
                icon={<MoreOutlined />}
                style={{ fontSize: 20 }}
              />
              <Divider orientation="vertical" />
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => setIsDrawerOpen(false)}
                style={{ fontSize: 20 }}
              />
            </Flex>
          </Layout.Header>

          {/* Banner — ใช้รูปโรงเรียนถ้ามี, ถ้าไม่มีสุ่ม banner ที่สื่อถึงประกาศรับสมัคร */}
          <JobBanner job={selectedJob} />

          {/* Content */}
          <Layout.Content style={{ padding: "0 40px 80px", marginTop: -40 }}>
            {/* Job Header Card */}
            <Card
              variant="borderless"
              style={{
                borderRadius: token.borderRadiusLG,
                boxShadow: token.boxShadowTertiary,
                backgroundColor: token.colorBgContainer,
              }}
              styles={{ body: { padding: 32 } }}
            >
              <Row gutter={24} align="middle">
                <Col flex="80px">
                  <Avatar
                    shape="square"
                    size={80}
                    src={selectedJob.logoUrl ?? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(selectedJob.schoolName)}&backgroundColor=0d8fd4`}
                    style={{ borderRadius: 12 }}
                  />
                </Col>
                <Col flex="auto">
                  <Title level={3} style={{ margin: 0 }}>
                    {selectedJob.title}
                  </Title>
                  <Space size={8}>
                    <Text strong style={{ fontSize: 16 }}>
                      {selectedJob.schoolName}
                    </Text>
                    <Badge status="success" />
                    <Link href="#" style={{ color: "#11b6f5" }}>
                      ดูงานทั้งหมดจากโรงเรียนนี้
                    </Link>
                  </Space>
                </Col>
              </Row>

              <Flex vertical gap={8} style={{ marginTop: 24 }}>
                <Space size={12}>
                  <EnvironmentOutlined
                    style={{ color: token.colorTextSecondary }}
                  />
                  <Text>{selectedJob.address}</Text>
                </Space>
                <Space size={12}>
                  <TeamOutlined style={{ color: token.colorTextSecondary }} />
                  <Text>ฝ่ายวิชาการ / {selectedJob.subjects.join(", ")}</Text>
                </Space>
                <Space size={12}>
                  <ClockCircleOutlined
                    style={{ color: token.colorTextSecondary }}
                  />
                  <Text>งานเต็มเวลา</Text>
                </Space>
                <Text type="secondary" style={{ marginTop: 8 }}>
                  โพสต์เมื่อ {dayjs(selectedJob.postedAt).fromNow()} •
                  มีผู้สนใจสมัครจำนวนมาก
                </Text>
              </Flex>

              <Flex style={{ marginTop: 32 }}>
                <Link href={`/pages/job/${selectedJob.id}/apply`}>
                  <Button
                    type="primary"
                    size="large"
                    style={{
                      height: 48,
                      padding: "0 40px",
                      backgroundColor: "#11b6f5",
                      borderColor: "#11b6f5",
                      fontWeight: 600,
                    }}
                  >
                    สมัครงานทันที
                  </Button>
                </Link>
              </Flex>
            </Card>

            {/* Roles & Responsibilities */}
            <Flex vertical style={{ marginTop: 40 }}>
              <Title level={4}>หน้าที่และความรับผิดชอบ:</Title>
              <ul
                style={{
                  paddingLeft: 20,
                  lineHeight: 2,
                  color: token.colorText,
                  fontSize: 15,
                }}
              >
                <li>
                  <strong>จัดการเรียนการสอน:</strong> {selectedJob.description}{" "}
                  ในระดับชั้น {selectedJob.grades.join(", ")}
                </li>
                <li>
                  <strong>เตรียมแผนการจัดการเรียนรู้:</strong>{" "}
                  ออกแบบกิจกรรมการเรียนรู้ที่สอดคล้องกับหลักสูตรและเน้นผู้เรียนเป็นสำคัญ
                </li>
                <li>
                  <strong>วัดและประเมินผล:</strong>{" "}
                  ประเมินพัฒนาการของนักเรียนอย่างต่อเนื่องและจัดทำรายงานผลการเรียน
                </li>
                <li>
                  <strong>ให้คำปรึกษา:</strong>{" "}
                  ดูแลความประพฤติและให้คำแนะนำแก่นักเรียนร่วมกับผู้ปกครอง
                </li>
                <li>
                  เข้าร่วมกิจกรรมต่างๆ ของโรงเรียนและพัฒนาตนเองอย่างสม่ำเสมอ
                </li>
              </ul>
            </Flex>

            {/* Qualifications */}
            <Flex vertical style={{ marginTop: 40 }}>
              <Title level={4}>คุณสมบัติผู้สมัคร:</Title>
              <ul
                style={{
                  paddingLeft: 20,
                  lineHeight: 2,
                  color: token.colorText,
                  fontSize: 15,
                }}
              >
                <li>
                  วุฒิการศึกษระดับ {selectedJob.educationLevel}{" "}
                  ในสาขาที่เกี่ยวข้อง
                </li>
                <li>มีทักษะในการสื่อสารดีเยี่ยมและมีจิตวิทยาในการสอนเด็ก</li>
                <li>
                  หากมีใบอนุญาตประกอบวิชาชีพครู ({selectedJob.licenseRequired})
                  จะพิจารณาเป็นพิเศษ
                </li>
                <li>มีประสบการณ์การสอน {selectedJob.teachingExperience}</li>
                <li>สามารถทำงานร่วมกับผู้อื่นได้ดีและมีความรับผิดชอบสูง</li>
              </ul>
            </Flex>

            {/* How You Match — แสดงเมื่อ Login แล้ว */}
            {user && (
              <Card
                style={{
                  marginTop: 24,
                  borderRadius: 12,
                  border: "1px solid rgba(17, 182, 245, 0.35)",
                  background: "rgba(17, 182, 245, 0.04)",
                }}
                styles={{ body: { padding: 24 } }}
              >
                <Space size={8} style={{ marginBottom: 16 }}>
                  <Title level={5} style={{ margin: 0 }}>
                    ความเหมาะสมของคุณต่อตำแหน่งนี้
                  </Title>
                  <InfoCircleOutlined
                    style={{ color: token.colorTextSecondary }}
                  />
                </Space>
                <Text
                  type="secondary"
                  style={{ display: "block", marginBottom: 16 }}
                >
                  2 ทักษะและคุณสมบัติของคุณตรงกับความต้องการของโรงเรียน
                </Text>
                <Space size={[8, 12]} wrap>
                  <Tag
                    icon={<CheckCircleFilled />}
                    color="success"
                    style={{ padding: "4px 12px", borderRadius: 16 }}
                  >
                    ประสบการณ์การสอน {selectedJob.teachingExperience}
                  </Tag>
                  <Tag
                    icon={<CheckCircleFilled />}
                    color="success"
                    style={{ padding: "4px 12px", borderRadius: 16 }}
                  >
                    วุฒิ {selectedJob.educationLevel}
                  </Tag>
                </Space>
              </Card>
            )}

            {/* Welfare */}
            <Flex vertical style={{ marginTop: 40 }}>
              <Title level={4}>สวัสดิการและสถานที่ทำงาน:</Title>
              <Space wrap size={[8, 12]}>
                {(selectedJob.benefits && selectedJob.benefits.length > 0
                  ? selectedJob.benefits
                  : ["ประกันสังคม", "ประกันสุขภาพกลุ่ม", "โบนัสประจำปี", "ชุดยูนิฟอร์ม", "อาหารกลางวันฟรี"]
                ).map((w) => (
                  <Tag key={w} color="#11b6f5" style={{ padding: "4px 12px", borderRadius: 8 }}>
                    {w}
                  </Tag>
                ))}
              </Space>
            </Flex>

            <Divider style={{ margin: "40px 0" }} />
            <Flex justify="center">
              <Text style={{ color: "#11b6f5", letterSpacing: 3, fontWeight: 600, fontSize: 13, opacity: 0.7 }}>
                SCHOOL JOB BOARD
              </Text>
            </Flex>
          </Layout.Content>
        </Layout>
      )}
    </Drawer>
  );
};

"use client";

import { useAuthStore } from "@/app/stores/auth-store";
import {
  CheckCircleFilled,
  ClockCircleOutlined,
  CloseOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  MoreOutlined,
  ShareAltOutlined,
  TeamOutlined,
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

          {/* Banner */}
          <Flex
            align="center"
            justify="center"
            style={{
              height: 240,
              background: "linear-gradient(135deg, #0d8fd4 0%, #11b6f5 50%, #5dd5fb 100%)",
              padding: 40,
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Grid pattern overlay */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              pointerEvents: "none",
            }} />
            <Flex vertical style={{ position: "relative", zIndex: 1 }}>
              <Title level={2} style={{ color: "#fff", margin: 0, letterSpacing: 2 }}>
                KEEP LEARNING
              </Title>
              <Title
                level={4}
                style={{ color: "rgba(255,255,255,0.85)", marginTop: 8 }}
              >
                AND CURIOUS ON
              </Title>
            </Flex>
          </Flex>

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

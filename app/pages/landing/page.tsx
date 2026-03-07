"use client";

import LandingLayout from "@/app/components/layouts/landing/landing-layout";
import {
  CalendarOutlined,
  MessageOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
  TagOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { Badge, Button, Card, Col, Row, Select, Typography } from "antd";
import { useStore } from "./stores/landing-search-store";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function LandingPage() {
  const {
    examYear,
    startDate,
    studyFormat,
    setExamYear,
    setStartDate,
    setStudyFormat,
    resetAll,
  } = useStore();

  return (
    <LandingLayout>
      {/* Hero Section */}
      <div
        style={{
          padding: "160px 0 100px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
          background: "white",
        }}
      >
        {/* Decorative Bloom */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "-5%",
            width: "400px",
            height: "400px",
            background: "#E6F0FF",
            borderRadius: "50%",
            filter: "blur(80px)",
            opacity: 0.6,
          }}
        />

        <div
          style={{
            textAlign: "center",
            zIndex: 1,
            maxWidth: "1200px",
            width: "100%",
            padding: "0 24px",
          }}
        >
          <Badge
            status="processing"
            text={
              <Text strong style={{ color: "#0066FF", padding: "0 8px" }}>
                อัปเดตล่าสุด: DEK 68-69
              </Text>
            }
            style={{
              background: "#F0F7FF",
              padding: "4px 16px",
              borderRadius: "100px",
              marginBottom: "32px",
            }}
          />

          <Title
            style={{
              fontSize: "64px",
              fontWeight: 800,
              marginBottom: "24px",
              color: "#1E293B",
              lineHeight: 1.1,
            }}
          >
            ค้นหาคอร์สเรียนไทย <br />
            <span
              style={{
                background: "linear-gradient(90deg, #0066FF 0%, #38BDF8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ในแบบที่น้องต้องการ
            </span>
          </Title>

          <Paragraph
            style={{
              fontSize: "20px",
              color: "#64748B",
              maxWidth: "700px",
              margin: "0 auto 48px auto",
            }}
          >
            รวบรวมคอร์สติวเข้มและวางแผนการเรียนครบวงจร
            เตรียมพร้อมสู่รั้วมหาวิทยาลัย ด้วยเทคโนโลยีการค้นหาที่แม่นยำที่สุด
          </Paragraph>

          {/* Search Card */}
          <Card
            style={{
              maxWidth: "1000px",
              margin: "0 auto",
              boxShadow: "0 25px 50px -12px rgba(0, 102, 255, 0.08)",
              borderRadius: "32px",
              border: "none",
              padding: "8px",
            }}
          >
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={6}>
                <div style={{ textAlign: "left", padding: "0 12px" }}>
                  <Text
                    type="secondary"
                    strong
                    style={{
                      fontSize: "12px",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    รุ่นที่จะสอบ
                  </Text>
                  <Select
                    placeholder="เลือกชั้นปี"
                    variant="borderless"
                    style={{
                      width: "100%",
                      fontSize: "18px",
                      fontWeight: 600,
                    }}
                    value={examYear || undefined}
                    onChange={setExamYear}
                    suffixIcon={
                      <UsergroupAddOutlined style={{ color: "#0066FF" }} />
                    }
                  >
                    <Option value="67">DEK 67</Option>
                    <Option value="68">DEK 68</Option>
                    <Option value="69">DEK 69</Option>
                  </Select>
                </div>
              </Col>
              <Col xs={0} md={1}>
                <div
                  style={{
                    width: "1px",
                    height: "40px",
                    background: "#F1F5F9",
                    margin: "0 auto",
                  }}
                />
              </Col>
              <Col xs={24} md={5}>
                <div style={{ textAlign: "left", padding: "0 12px" }}>
                  <Text
                    type="secondary"
                    strong
                    style={{
                      fontSize: "12px",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    เริ่มเรียน
                  </Text>
                  <Select
                    placeholder="เดือนที่เริ่ม"
                    variant="borderless"
                    style={{
                      width: "100%",
                      fontSize: "18px",
                      fontWeight: 600,
                    }}
                    value={startDate || undefined}
                    onChange={setStartDate}
                    suffixIcon={
                      <CalendarOutlined style={{ color: "#0066FF" }} />
                    }
                  >
                    <Option value="apr">เมษายน</Option>
                    <Option value="may">พฤษภาคม</Option>
                  </Select>
                </div>
              </Col>
              <Col xs={0} md={1}>
                <div
                  style={{
                    width: "1px",
                    height: "40px",
                    background: "#F1F5F9",
                    margin: "0 auto",
                  }}
                />
              </Col>
              <Col xs={24} md={5}>
                <div style={{ textAlign: "left", padding: "0 12px" }}>
                  <Text
                    type="secondary"
                    strong
                    style={{
                      fontSize: "12px",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    รูปแบบ
                  </Text>
                  <Select
                    placeholder="เลือกรูปแบบ"
                    variant="borderless"
                    style={{
                      width: "100%",
                      fontSize: "18px",
                      fontWeight: 600,
                    }}
                    value={studyFormat || undefined}
                    onChange={setStudyFormat}
                    suffixIcon={
                      <PlayCircleOutlined style={{ color: "#0066FF" }} />
                    }
                  >
                    <Option value="online">Online</Option>
                    <Option value="onsite">On-site</Option>
                  </Select>
                </div>
              </Col>
              <Col xs={24} md={6}>
                <Button
                  type="primary"
                  size="large"
                  icon={<SearchOutlined />}
                  style={{
                    width: "100%",
                    height: "64px",
                    borderRadius: "20px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    boxShadow: "0 10px 15px -3px rgba(0, 102, 255, 0.3)",
                  }}
                >
                  ค้นหาคอร์สที่ใช่
                </Button>
              </Col>
            </Row>
          </Card>

          <div
            style={{
              marginTop: "32px",
              display: "flex",
              justifyContent: "center",
              gap: "32px",
            }}
          >
            <Button
              type="link"
              onClick={resetAll}
              icon={<ReloadOutlined />}
              style={{ color: "#94A3B8" }}
            >
              ล้างการค้นหา
            </Button>
            <Button
              type="link"
              icon={<SearchOutlined />}
              style={{ color: "#0066FF", fontWeight: "bold" }}
            >
              ดูวิชาที่ต้องใช้สอบตามคณะ
            </Button>
          </div>
        </div>
      </div>

      {/* Categories / Services */}
      <div
        style={{
          padding: "80px 24px",
          maxWidth: "1200px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <Row gutter={[32, 32]}>
          {[
            {
              title: "คอร์สทดลองเรียน",
              icon: <PlayCircleOutlined />,
              desc: "เรียนฟรี 2 ชั่วโมง ทุกวิชา",
              color: "#F97316",
              bg: "#FFF7ED",
            },
            {
              title: "ปรึกษาฟรี",
              icon: <MessageOutlined />,
              desc: "แชทคุยกับพี่แอดมิน 24 ชม.",
              color: "#0EA5E9",
              bg: "#F0F9FF",
            },
            {
              title: "โปรโมชันแพ็กคู่",
              icon: <TagOutlined />,
              desc: "ลดสูงสุด 30% เมื่อเลือกคู่",
              color: "#10B981",
              bg: "#ECFDF5",
            },
            {
              title: "แผนการเรียน",
              icon: <CalendarOutlined />,
              desc: "จัดตารางฟรีแบบรายบุคคล",
              color: "#8B5CF6",
              bg: "#F5F3FF",
            },
          ].map((item, idx) => (
            <Col xs={24} sm={12} md={6} key={idx}>
              <Card
                hoverable
                style={{
                  borderRadius: "24px",
                  border: "none",
                  height: "100%",
                }}
                styles={{ body: { padding: "32px" } }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    background: item.bg,
                    color: item.color,
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    marginBottom: "24px",
                  }}
                >
                  {item.icon}
                </div>
                <Title level={4} style={{ marginBottom: "12px" }}>
                  {item.title}
                </Title>
                <Text type="secondary" style={{ fontSize: "16px" }}>
                  {item.desc}
                </Text>
                <div
                  style={{
                    marginTop: "24px",
                    color: "#0066FF",
                    fontWeight: 600,
                  }}
                >
                  รายละเอียดเพิ่มเติม →
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Floating Contact */}
      <div
        style={{
          position: "fixed",
          right: "24px",
          bottom: "24px",
          zIndex: 1000,
        }}
      >
        <Badge count={2}>
          <Button
            type="primary"
            shape="circle"
            icon={<MessageOutlined style={{ fontSize: "24px" }} />}
            style={{
              width: "64px",
              height: "64px",
              boxShadow: "0 20px 25px -5px rgba(0, 102, 255, 0.4)",
            }}
          />
        </Badge>
      </div>
    </LandingLayout>
  );
}

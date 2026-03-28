"use client";

import {
  ArrowLeftOutlined,
  BookOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  FacebookFilled,
  LinkOutlined,
  TwitterOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Affix,
  theme as antTheme,
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  List,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import type { GlobalToken } from "antd/es/theme/interface";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const { Title, Text } = Typography;

// Mock Data สำหรับเนื้อหาบทความ
const MOCK_BLOG_DETAILS = {
  "1": {
    title: "5 เทคนิครับมือการสอนเด็ก Gen Alpha ให้สนุกและได้ความรู้",
    category: "เทคนิคการสอน",
    author: "ครูพี่นันท์",
    authorRole: "ผู้เชี่ยวชาญด้านนวัตกรรมการศึกษา",
    date: "10 มี.ค. 2569",
    views: "1,240",
    readingTime: "5 นาที",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
    content: (token: GlobalToken) => `
      <p style="color: ${token.colorText}">ในยุคที่เทคโนโลยีปรับเปลี่ยนไปอย่างรวดเร็ว เด็ก Gen Alpha (ผู้ที่เกิดตั้งแต่ปี 2010 เป็นต้นไป) เติบโตมาพร้อมกับหน้าจอและข้อมูลมหาศาล การใช้วิธีการสอนแบบเดิมๆ อาจไม่เพียงพออีกต่อไป...</p>

      <h2 style="margin-top: 32px; color: ${token.colorPrimary};">1. เปลี่ยนจากการ "สอน" เป็นการ "ชวนคุย"</h2>
      <p style="color: ${token.colorText}">เด็ก Gen Alpha ชอบการมีส่วนร่วมและแสดงความคิดเห็น การตั้งคำถามปลายเปิดให้พวกเขาได้คิดวิเคราะห์จะช่วยกระตุ้นความสนใจได้ดีกว่าการบรรยายฝ่ายเดียว</p>

      <h2 style="margin-top: 32px; color: ${token.colorPrimary};">2. ใช้ Gamification เข้ามาช่วย</h2>
      <p style="color: ${token.colorText}">การเล่นเกมไม่ใช่เรื่องไร้สาระ หากเราสอดแทรกบทเรียนลงไปในรูปแบบของภารกิจ (Missions) หรือการสะสมแต้ม จะทำให้เด็กๆ รู้สึกสนุกและอยากเอาชนะความท้าทายในบทเรียนนั้นๆ</p>

      <blockquote style="margin: 40px 0; padding: 24px; background: ${token.colorPrimaryBg}; border-left: 4px solid ${token.colorPrimary}; font-style: italic; font-size: 20px; color: ${token.colorTextDescription}">
        "หัวใจสำคัญของการาสอนเด็กยุคใหม่ คือการทำหน้าที่เป็นผู้อำนวยความสะดวก (Facilitator) ไม่ใช่องค์ความรู้เคลื่อนที่เพียงอย่างเดียว"
      </blockquote>

      <h2 style="margin-top: 32px; color: ${token.colorPrimary};">3. ผสมผสานสื่อ Multi-media ที่หลากหลาย</h2>
      <p style="color: ${token.colorText}">ความสนใจของเด็กยุคนี้ค่อนข้างสั้น (Short attention span) การสลับระหว่างวิดีโอสั้น กิจกรรมกลุ่ม และการลงมือทำจริง จะช่วยรักษาจดจ่อได้ดีขึ้น</p>

      <h2 style="margin-top: 32px; color: ${token.colorPrimary};">4. สอนให้ใช้เครื่องมือ ไม่ใช่แค่จำเนื้อหา</h2>
      <p style="color: ${token.colorText}">ในยุคที่มี AI และ Search engine การจำเนื้อหาทั้งหมดอาจไม่จำเป็นเท่ากับการรู้จัก "วิธีการค้นหา" และ "การกลั่นกรองข้อมูล" ที่ถูกต้อง</p>

      <h2 style="margin-top: 32px; color: ${token.colorPrimary};">5. สร้างพื้นที่ปลอดภัยในการลองผิดลองถูก</h2>
      <p style="color: ${token.colorText}">เด็ก Gen Alpha มักจะกลัวความล้มเหลวหากถูกกดดันด้วยคะแนนสอบเพียงอย่างเดียว การเน้นไปที่กระบวนการ (Process over Product) จะช่วยให้พวกเขากล้าคิดนอกกรอบมากขึ้น</p>
    `,
  },
};

const RELATED_BLOGS = [
  {
    id: 2,
    title: "เทคโนโลยี AI สำหรับครู: ช่วยเตรียมแผนการสอนใน 10 นาที",
    category: "เทคโนโลยีการศึกษา",
  },
  {
    id: 3,
    title: "จัดการ Work-Life Balance ฉบับคุณครู",
    category: "ไลฟ์สไตล์ครู",
  },
  {
    id: 4,
    title: "ใบประกอบวิชาชีพครู 2569: ขั้นตอนการต่ออายุ",
    category: "การพัฒนาวิชาชีพ",
  },
];

export default function BlogDetailPage() {
  const { token } = antTheme.useToken();
  const params = useParams();
  const router = useRouter();
  const blogId = params?.blog_id as string;

  const blog =
    MOCK_BLOG_DETAILS[blogId as keyof typeof MOCK_BLOG_DETAILS] ||
    MOCK_BLOG_DETAILS["1"];

  const contentHtml =
    typeof blog.content === "function" ? blog.content(token) : blog.content;

  return (
    <Row
      justify="center"
      style={{
        minHeight: "100vh",
        backgroundColor: token.colorBgLayout,
        paddingBottom: "100px",
      }}
    >
      <Col span={24}>
        {/* Header/Breadcrumb Section */}
        <Row
          justify="center"
          style={{
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            padding: "12px 0",
            backgroundColor: token.colorBgContainer,
          }}
        >
          <Col xs={24} lg={20} xl={18} style={{ padding: "0 24px" }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Breadcrumb
                  items={[
                    { title: <Link href="/pages/blog">บทความ</Link> },
                    { title: blog.category },
                    { title: "อ่านบทความ" },
                  ]}
                />
              </Col>
              <Col>
                <Button
                  type="text"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => router.push("/pages/blog")}
                >
                  กลับสู่หน้าหลัก
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Main Content Area */}
        <Row justify="center" style={{ marginTop: "40px" }}>
          <Col xs={24} lg={20} xl={18} style={{ padding: "0 24px" }}>
            <Space orientation="vertical" size={40} style={{ width: "100%" }}>
              {/* Title & Metadata */}
              <div style={{ textAlign: "center" }}>
                <Tag
                  color="#11b6f5"
                  style={{
                    marginBottom: "16px",
                    padding: "2px 12px",
                    borderRadius: "4px",
                  }}
                >
                  {blog.category}
                </Tag>
                <Title
                  level={1}
                  style={{
                    maxWidth: "900px",
                    margin: "0 auto 24px auto",
                    lineHeight: "1.3",
                    color: token.colorTextHeading,
                  }}
                >
                  {blog.title}
                </Title>
                <Space
                  separator={<Divider orientation="vertical" />}
                  style={{ color: token.colorTextDescription }}
                >
                  <Space>
                    <CalendarOutlined /> {blog.date}
                  </Space>
                  <Space>
                    <ClockCircleOutlined /> ใช้เวลาอ่าน {blog.readingTime}
                  </Space>
                  <Space>
                    <EyeOutlined /> {blog.views} เข้าชม
                  </Space>
                </Space>
              </div>

              {/* Hero Image */}
              <div
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "500px",
                  aspectRatio: "16/9",
                  borderRadius: token.borderRadiusLG * 2,
                  overflow: "hidden",
                  boxShadow: token.boxShadowSecondary,
                }}
              >
                <img
                  src={blog.image}
                  alt={blog.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* Grid Content with Sidebar */}
              <Row gutter={[64, 40]}>
                {/* Desktop Sticky Share (Left) */}
                <Col xs={0} lg={2}>
                  <Affix offsetTop={100}>
                    <Space
                      orientation="vertical"
                      size={16}
                      style={{ textAlign: "center", width: "100%" }}
                    >
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        แชร์
                      </Text>
                      <Button
                        shape="circle"
                        icon={<FacebookFilled style={{ color: "#1877F2" }} />}
                        size="large"
                      />
                      <Button
                        shape="circle"
                        icon={<TwitterOutlined style={{ color: "#1DA1F2" }} />}
                        size="large"
                      />
                      <Button
                        shape="circle"
                        icon={<LinkOutlined />}
                        size="large"
                      />
                    </Space>
                  </Affix>
                </Col>

                {/* Primary Article Content */}
                <Col xs={24} lg={15}>
                  <Typography>
                    <div
                      style={{
                        fontSize: "18px",
                        lineHeight: "1.9",
                        color: token.colorText,
                      }}
                      dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />
                  </Typography>

                  <Divider style={{ margin: "60px 0" }} />

                  {/* Author Profile */}
                  <Card
                    variant="borderless"
                    style={{
                      backgroundColor: token.colorFillAlter,
                      borderRadius: token.borderRadiusLG,
                    }}
                  >
                    <Row gutter={[16, 16]} align="middle">
                      <Col>
                        <Avatar
                          size={64}
                          icon={<UserOutlined />}
                          style={{ backgroundColor: token.colorPrimary }}
                        />
                      </Col>
                      <Col flex="auto">
                        <Title level={4} style={{ margin: 0 }}>
                          {blog.author}
                        </Title>
                        <Text type="secondary">{blog.authorRole}</Text>
                      </Col>
                      <Col xs={24} sm={24} md={6}>
                        <Button
                          type="primary"
                          ghost
                          block
                          style={{ borderRadius: "8px" }}
                        >
                          ติดตามผลงาน
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                </Col>

                {/* Sidebar (Right) */}
                <Col xs={24} lg={7}>
                  <Space
                    orientation="vertical"
                    size={40}
                    style={{ width: "100%" }}
                  >
                    <div>
                      <Title level={4} style={{ marginBottom: "24px" }}>
                        บทความที่เกี่ยวข้อง
                      </Title>
                      <List
                        itemLayout="vertical"
                        dataSource={RELATED_BLOGS}
                        renderItem={(item) => (
                          <List.Item style={{ padding: "16px 0" }}>
                            <Link href={`/pages/blog/${item.id}`}>
                              <Tag
                                color="#11b6f5"
                                style={{
                                  marginBottom: "8px",
                                  fontSize: "11px",
                                }}
                              >
                                {item.category}
                              </Tag>
                              <Title
                                level={5}
                                style={{
                                  margin: 0,
                                  fontSize: "15.5px",
                                  lineHeight: "1.4",
                                }}
                              >
                                {item.title}
                              </Title>
                            </Link>
                          </List.Item>
                        )}
                      />
                    </div>

                    <Card
                      style={{
                        borderRadius: token.borderRadiusLG,
                        backgroundColor: token.colorFillSecondary,
                        border: `1px solid ${token.colorBorder}`,
                      }}
                    >
                      <Space orientation="vertical" size={16}>
                        <BookOutlined
                          style={{
                            fontSize: "24px",
                            color: token.colorPrimary,
                          }}
                        />
                        <Title level={5} style={{ margin: 0 }}>
                          พร้อมก้าวหน้าในอาชีพครู?
                        </Title>
                        <Text type="secondary">
                          ลงทะเบียนเพื่อค้นหางานโรงเรียนที่ใช่สำหรับคุณวันนี้
                        </Text>
                        <Link href="/pages/signup">
                          <Button
                            type="primary"
                            block
                            size="large"
                            style={{
                              fontWeight: 600,
                            }}
                          >
                            สมัครสมาชิกฟรี
                          </Button>
                        </Link>
                      </Space>
                    </Card>
                  </Space>
                </Col>
              </Row>
            </Space>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

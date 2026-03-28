"use client";

import {
  BookOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  FireOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Input,
  Row,
  Space,
  Tabs,
  Tag,
  theme,
  Typography,
} from "antd";
import Link from "next/link";
import { useState } from "react";

const { Title, Text, Paragraph } = Typography;
const { useToken } = theme;

// สไตล์เสริม (Internal Styles)
const styles = {
  hero: {
    position: "relative" as const,
    overflow: "hidden" as const,
    padding: "80px 0 120px 0",
    textAlign: "center" as const,
  },
  dotPattern: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    backgroundImage:
      "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
    backgroundSize: "32px 32px",
  },
  featuredImage: {
    height: "100%",
    minHeight: "450px",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  cardImage: {
    height: "230px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative" as const,
  },
  categoryBadge: {
    position: "absolute" as const,
    top: "16px",
    left: "16px",
    borderRadius: "6px",
    backdropFilter: "blur(4px)",
    background: "rgba(24, 144, 255, 0.85)",
    border: "none",
  },
};

// Mock Data สำหรับบทความ
interface Blog {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  views: string;
  readingTime: string;
  image: string;
  featured: boolean;
}

const CATEGORIES = [
  { key: "all", label: "ทั้งหมด" },
  { key: "career", label: "การพัฒนาวิชาชีพ" },
  { key: "teaching", label: "เทคนิคการสอน" },
  { key: "technology", label: "เทคโนโลยีการศึกษา" },
  { key: "lifestyle", label: "ไลฟ์สไตล์ครู" },
  { key: "news", label: "ข่าวการศึกษา" },
];

const MOCK_BLOGS: Blog[] = [
  {
    id: 1,
    title: "5 เทคนิครับมือการสอนเด็ก Gen Alpha ให้สนุกและได้ความรู้",
    excerpt:
      "การสอนเด็กยุคใหม่ต้องอาศัยความเข้าใจในพฤติกรรมและความสนใจที่เปลี่ยนไป... มาดู 5 กลยุทธ์ที่ครูไทยต้องลองใช้ในห้องเรียนปี 2024",
    category: "เทคนิคการสอน",
    author: "ครูพี่นันท์",
    date: "10 มี.ค. 2569",
    views: "1.2k",
    readingTime: "5 นาที",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
    featured: true,
  },
  {
    id: 2,
    title: "เทคโนโลยี AI สำหรับครู: ช่วยเตรียมแผนการสอนใน 10 นาที",
    excerpt:
      "รู้จักเครื่องมือ AI ที่จะช่วยประหยัดเวลาการทำงานเอกสาร เพื่อให้ครูมีเวลาทุ่มเทกับการพัฒนาเด็กๆ ได้มากขึ้น",
    category: "เทคโนโลยีการศึกษา",
    author: "ดร.สมชาย",
    date: "8 มี.ค. 2569",
    views: "850",
    readingTime: "7 นาที",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 3,
    title: "จัดการ Work-Life Balance ฉบับคุณครู: ทำอย่างไรไม่ให้ Burnout",
    excerpt:
      "ภาระงานครูที่หนักอึ้งอาจนำไปสู่ภาวะหมดไฟ มาฝึกเทคนิคการจัดลำดับความสำคัญและรักษาสมดุลชีวิตให้มีความสุข",
    category: "ไลฟ์สไตล์ครู",
    author: "แอดมินกมล",
    date: "5 มี.ค. 2569",
    views: "2.1k",
    readingTime: "6 นาที",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 4,
    title: "ใบประกอบวิชาชีพครู 2569: สรุปทุกขั้นตอนการต่ออายุแบบเข้าใจง่าย",
    excerpt:
      "อัปเดตระเบียบการล่าสุดสำหรับการต่ออายุใบอนุญาตประกอบวิชาชีพ เอกสารที่ต้องใช้ และเกณฑ์การประเมินใหม่",
    category: "การพัฒนาวิชาชีพ",
    author: "ครูฝน",
    date: "2 มี.ค. 2569",
    views: "4.5k",
    readingTime: "10 นาที",
    image:
      "https://images.unsplash.com/photo-1454165833762-02cd50e2c3e8?q=80&w=800&auto=format&fit=crop",
    featured: false,
  },
  {
    id: 5,
    title: "รวมเว็บไซต์แจกเทมเพลต PowerPoint เพื่อการสอนฟรีและสวยงาม",
    excerpt:
      "ยกระดับการพรีเซนต์ในห้องเรียนด้วยเทมเพลตที่ถูกออกแบบมาเพื่อการศึกษาโดยเฉพาะ ดาวน์โหลดฟรี ใช้งานง่าย",
    category: "เทคโนโลยีการศึกษา",
    author: "แอดมินกี้",
    date: "28 ก.พ. 2569",
    views: "3.3k",
    readingTime: "4 นาที",
    image:
      "https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=800&auto=format&fit=crop",
    featured: false,
  },
];

export default function BlogListPage() {
  const { token } = useToken();
  const [activeTab, setActiveTab] = useState("all");
  const [searchText, setSearchText] = useState("");

  const filteredBlogs = MOCK_BLOGS.filter(
    (blog: Blog) =>
      (activeTab === "all" ||
        blog.category === CATEGORIES.find((c) => c.key === activeTab)?.label) &&
      (blog.title.toLowerCase().includes(searchText.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchText.toLowerCase())),
  );

  const featuredBlog = MOCK_BLOGS.find((b) => b.featured);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: token.colorBgLayout,
        paddingBottom: "80px",
      }}
    >
      {/* 1. Hero Section */}
      <section
        style={{
          ...styles.hero,
          background: `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryActive || token.colorPrimary} 100%)`,
          color: token.colorWhite,
        }}
      >
        <div style={styles.dotPattern} />
        <Row
          justify="center"
          align="middle"
          style={{ position: "relative", zIndex: 1, padding: "0 20px" }}
        >
          <Col xs={24} md={18} lg={12}>
            <Space orientation="vertical" size={24} style={{ width: "100%" }}>
              <Space orientation="vertical" size={12}>
                <Title
                  level={1}
                  style={{
                    color: token.colorWhite,
                    margin: 0,
                    fontWeight: 800,
                  }}
                >
                  บทความเพื่อคุณครู
                </Title>
                <Text
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "18px",
                  }}
                >
                  แหล่งรวมความรู้ เทคนิคการสอน
                  และแรงบันดาลใจเพื่อการพัฒนาวิชาชีพครูในยุคดิจิทัล
                </Text>
              </Space>

              <Row justify="center">
                <Col xs={24} sm={20} md={16}>
                  <Input
                    prefix={
                      <SearchOutlined
                        style={{ color: token.colorTextPlaceholder }}
                      />
                    }
                    placeholder="ค้นหาบทความที่คุณสนใจ..."
                    size="large"
                    style={{
                      borderRadius: "12px",
                      height: "56px",
                      border: "none",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                      fontSize: "16px",
                    }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                </Col>
              </Row>
            </Space>
          </Col>
        </Row>
      </section>

      <Row
        justify="center"
        style={{
          margin: "-60px 0 0 0",
          padding: "0 20px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Col span={24} style={{ maxWidth: "1240px" }}>
          <Space orientation="vertical" size={64} style={{ width: "100%" }}>
            {/* 2. Featured Post */}
            {!searchText && featuredBlog && (
              <Link href={`/pages/blog/${featuredBlog.id}`}>
                <Card
                  hoverable
                  style={{
                    borderRadius: "20px",
                    border: "none",
                    overflow: "hidden",
                    boxShadow: token.boxShadowSecondary,
                    background: token.colorBgContainer,
                  }}
                  styles={{ body: { padding: 0 } }}
                >
                  <Row>
                    <Col xs={24} md={12}>
                      <div
                        style={{
                          ...styles.featuredImage,
                          backgroundImage: `url(${featuredBlog.image})`,
                        }}
                      />
                    </Col>
                    <Col xs={24} md={12} style={{ padding: "48px" }}>
                      <Space
                        orientation="vertical"
                        size={32}
                        style={{
                          width: "100%",
                          height: "100%",
                          justifyContent: "center",
                        }}
                      >
                        <Space size={12}>
                          <Tag
                            color="volcano"
                            style={{
                              borderRadius: "6px",
                              padding: "4px 12px",
                              margin: 0,
                            }}
                          >
                            บทความแนะนำ <FireOutlined />
                          </Tag>
                          <Tag
                            color="processing"
                            style={{
                              borderRadius: "6px",
                              padding: "4px 12px",
                              margin: 0,
                            }}
                          >
                            {featuredBlog.category}
                          </Tag>
                        </Space>

                        <div>
                          <Title
                            level={2}
                            style={{ marginBottom: "20px", lineHeight: 1.3 }}
                          >
                            {featuredBlog.title}
                          </Title>
                          <Paragraph
                            style={{
                              color: token.colorTextSecondary,
                              fontSize: "17px",
                              lineHeight: 1.6,
                              margin: 0,
                            }}
                          >
                            {featuredBlog.excerpt}
                          </Paragraph>
                        </div>

                        <Space
                          separator={
                            <Divider
                              type="vertical"
                              style={{ borderColor: token.colorBorder }}
                            />
                          }
                          style={{ color: token.colorTextDescription }}
                        >
                          <Space>
                            <UserOutlined />{" "}
                            <Text type="secondary">{featuredBlog.author}</Text>
                          </Space>
                          <Space>
                            <CalendarOutlined />{" "}
                            <Text type="secondary">{featuredBlog.date}</Text>
                          </Space>
                          <Space>
                            <ClockCircleOutlined />{" "}
                            <Text type="secondary">
                              {featuredBlog.readingTime}
                            </Text>
                          </Space>
                        </Space>
                      </Space>
                    </Col>
                  </Row>
                </Card>
              </Link>
            )}

            {/* 3. Category Tabs & Blog Grid */}
            <Space orientation="vertical" size={48} style={{ width: "100%" }}>
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={CATEGORIES.map((cat) => ({
                  key: cat.key,
                  label: cat.label,
                }))}
                size="large"
                tabBarStyle={{
                  borderBottom: `2px solid ${token.colorBorderSecondary}`,
                  marginBottom: 0,
                }}
              />

              <Row gutter={[32, 48]}>
                {filteredBlogs
                  .filter((b) => !b.featured || searchText)
                  .map((blog) => (
                    <Col xs={24} sm={12} lg={8} key={blog.id}>
                      <Link href={`/pages/blog/${blog.id}`}>
                        <Card
                          hoverable
                          style={{
                            borderRadius: "16px",
                            border: "none",
                            height: "100%",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                            background: token.colorBgContainer,
                            display: "flex",
                            flexDirection: "column",
                          }}
                          styles={{
                            body: {
                              flex: 1,
                              display: "flex",
                              flexDirection: "column",
                              padding: "24px",
                            },
                          }}
                          cover={
                            <div
                              style={{
                                ...styles.cardImage,
                                backgroundImage: `url(${blog.image})`,
                                borderTopLeftRadius: "16px",
                                borderTopRightRadius: "16px",
                              }}
                            >
                              <Tag
                                color="#11b6f5"
                                variant="filled"
                                style={styles.categoryBadge}
                              >
                                {blog.category}
                              </Tag>
                            </div>
                          }
                        >
                          <Space
                            orientation="vertical"
                            size={16}
                            style={{ flex: 1, width: "100%" }}
                          >
                            <Title
                              level={4}
                              style={{
                                margin: 0,
                                minHeight: "64px",
                                lineHeight: 1.4,
                              }}
                            >
                              {blog.title}
                            </Title>
                            <Paragraph
                              ellipsis={{ rows: 3 }}
                              style={{
                                color: token.colorTextSecondary,
                                margin: 0,
                                fontSize: "14px",
                                lineHeight: 1.6,
                              }}
                            >
                              {blog.excerpt}
                            </Paragraph>
                          </Space>

                          <div style={{ marginTop: "24px" }}>
                            <Divider
                              style={{
                                margin: "0 0 16px 0",
                                borderColor: token.colorBorderSecondary,
                              }}
                            />
                            <Row justify="space-between" align="middle">
                              <Col>
                                <Space size={8}>
                                  <Avatar
                                    size="small"
                                    icon={<UserOutlined />}
                                    style={{
                                      backgroundColor: token.colorPrimary,
                                    }}
                                  />
                                  <Text
                                    type="secondary"
                                    style={{ fontSize: "12px" }}
                                  >
                                    {blog.author}
                                  </Text>
                                </Space>
                              </Col>
                              <Col>
                                <Space
                                  size={12}
                                  style={{
                                    color: token.colorTextDescription,
                                    fontSize: "12px",
                                  }}
                                >
                                  <Space size={4}>
                                    <ClockCircleOutlined /> {blog.readingTime}
                                  </Space>
                                  <Space size={4}>
                                    <EyeOutlined /> {blog.views}
                                  </Space>
                                </Space>
                              </Col>
                            </Row>
                          </div>
                        </Card>
                      </Link>
                    </Col>
                  ))}
              </Row>

              {/* 5. Empty State */}
              {filteredBlogs.length === 0 && (
                <Row
                  justify="center"
                  align="middle"
                  style={{ padding: "120px 0" }}
                >
                  <Col>
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <Text type="secondary" style={{ fontSize: "16px" }}>
                          ไม่พบบทความที่คุณกำลังค้นหา
                        </Text>
                      }
                    >
                      <Button
                        type="primary"
                        size="large"
                        shape="round"
                        style={{ marginTop: "16px" }}
                        onClick={() => {
                          setActiveTab("all");
                          setSearchText("");
                        }}
                      >
                        แสดงบทความทั้งหมด
                      </Button>
                    </Empty>
                  </Col>
                </Row>
              )}
            </Space>

            {/* 6. Newsletter / CTA */}
            <Card
              style={{
                borderRadius: "24px",
                background: token.colorBgContainer,
                border: `1px solid ${token.colorBorderSecondary}`,
                padding: "48px",
                boxShadow: "0 4px 30px rgba(0,0,0,0.03)",
              }}
            >
              <Row justify="center">
                <Col xs={24} md={18} lg={14} style={{ textAlign: "center" }}>
                  <Space
                    orientation="vertical"
                    size={32}
                    style={{ width: "100%" }}
                  >
                    <Avatar
                      size={64}
                      icon={<BookOutlined />}
                      style={{
                        backgroundColor: token.colorPrimaryBg,
                        color: token.colorPrimary,
                        borderRadius: "16px",
                      }}
                    />

                    <div>
                      <Title level={2} style={{ marginBottom: "16px" }}>
                        รับความรู้ใหม่ๆ ก่อนใคร
                      </Title>
                      <Paragraph
                        type="secondary"
                        style={{ fontSize: "16px", margin: 0 }}
                      >
                        ลงทะเบียนเพื่อรับข่าวสารและบทความดีๆ
                        สำหรับครูส่งตรงถึงอีเมลของคุณทุกสัปดาห์
                        ร่วมเป็นส่วนหนึ่งของชุมชนครูคุณภาพ
                      </Paragraph>
                    </div>

                    <Row justify="center">
                      <Col xs={24} sm={20}>
                        <Space.Compact style={{ width: "100%" }}>
                          <Input
                            size="large"
                            placeholder="ระบุอีเมลของคุณที่นี่..."
                            style={{
                              height: "54px",
                              borderRadius: "12px 0 0 12px",
                            }}
                          />
                          <Button
                            type="primary"
                            size="large"
                            style={{
                              height: "54px",
                              borderRadius: "0 12px 12px 0",
                              fontWeight: 600,
                              padding: "0 32px",
                            }}
                          >
                            ติดตามเลย
                          </Button>
                        </Space.Compact>
                      </Col>
                    </Row>
                  </Space>
                </Col>
              </Row>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
}

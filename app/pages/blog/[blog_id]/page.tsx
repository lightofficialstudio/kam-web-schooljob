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
  Input,
  Row,
  Space,
  Tabs,
  Tag,
  Typography,
} from "antd";
import Link from "next/link";
import { useState } from "react";

const { Title, Text, Paragraph } = Typography;

// Mock Data สำหรับบทความ
const CATEGORIES = [
  { key: "all", label: "ทั้งหมด" },
  { key: "career", label: "การพัฒนาวิชาชีพ" },
  { key: "teaching", label: "เทคนิคการสอน" },
  { key: "technology", label: "เทคโนโลยีการศึกษา" },
  { key: "lifestyle", label: "ไลฟ์สไตล์ครู" },
  { key: "news", label: "ข่าวการศึกษา" },
];

const MOCK_BLOGS = [
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
  const [activeTab, setActiveTab] = useState("all");
  const [searchText, setSearchText] = useState("");

  const filteredBlogs = MOCK_BLOGS.filter(
    (blog) =>
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
        backgroundColor: "#f9f9f9",
        paddingBottom: "80px",
      }}
    >
      {/* 1. Hero Section */}
      <div
        style={{
          backgroundColor: "#001e45",
          padding: "60px 0 100px 0",
          color: "white",
          textAlign: "center",
          background: "linear-gradient(135deg, #001e45 0%, #003366 100%)",
        }}
      >
        <Title level={1} style={{ color: "white", marginBottom: "16px" }}>
          บทความเพื่อคุณครู
        </Title>
        <Text
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: "18px",
            display: "block",
            marginBottom: "32px",
          }}
        >
          แหล่งรวมความรู้ เทคนิคการสอน และแรงบันดาลใจเพื่อการพัฒนาวิชาชีพครู
        </Text>
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 20px" }}>
          <Input
            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
            placeholder="ค้นหาบทความที่คุณสนใจ..."
            size="large"
            style={{
              borderRadius: "30px",
              height: "54px",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "-40px auto 0 auto",
          padding: "0 20px",
        }}
      >
        {/* 2. Featured Post */}
        {!searchText && featuredBlog && (
          <Link href={`/pages/blog/${featuredBlog.id}`}>
            <Card
              hoverable
              style={{
                borderRadius: "16px",
                border: "none",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              }}
              styles={{ body: { padding: 0 } }}
            >
              <Row>
                <Col xs={24} md={12}>
                  <div
                    style={{
                      height: "400px",
                      backgroundImage: `url(${featuredBlog.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </Col>
                <Col
                  xs={24}
                  md={12}
                  style={{
                    padding: "40px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Space style={{ marginBottom: "16px" }}>
                    <Tag color="volcano" style={{ borderRadius: "4px" }}>
                      บทความแนะนำ <FireOutlined />
                    </Tag>
                    <Tag color="blue">{featuredBlog.category}</Tag>
                  </Space>
                  <Title level={2}>{featuredBlog.title}</Title>
                  <Paragraph style={{ color: "#666", fontSize: "16px" }}>
                    {featuredBlog.excerpt}
                  </Paragraph>
                  <div style={{ marginTop: "auto" }}>
                    <Space
                      split={<Divider type="vertical" />}
                      style={{ color: "#8c8c8c" }}
                    >
                      <Space>
                        <UserOutlined /> {featuredBlog.author}
                      </Space>
                      <Space>
                        <CalendarOutlined /> {featuredBlog.date}
                      </Space>
                      <Space>
                        <ClockCircleOutlined /> {featuredBlog.readingTime}
                      </Space>
                    </Space>
                  </div>
                </Col>
              </Row>
            </Card>
          </Link>
        )}

        {/* 3. Category Tabs & Filters */}
        <div style={{ marginTop: "60px", marginBottom: "40px" }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={CATEGORIES.map((cat) => ({
              key: cat.key,
              label: cat.label,
            }))}
            size="large"
            tabBarStyle={{ borderBottom: "2px solid #e8e8e8" }}
          />
        </div>

        {/* 4. Blog Grid */}
        <Row gutter={[24, 48]}>
          {filteredBlogs
            .filter((b) => !b.featured || searchText)
            .map((blog) => (
              <Col xs={24} sm={12} lg={8} key={blog.id}>
                <Link href={`/pages/blog/${blog.id}`}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: "12px",
                      border: "none",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    }}
                    cover={
                      <div
                        style={{
                          height: "240px",
                          backgroundImage: `url(${blog.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          borderTopLeftRadius: "12px",
                          borderTopRightRadius: "12px",
                        }}
                      />
                    }
                  >
                    <div style={{ marginBottom: "12px" }}>
                      <Tag color="blue" style={{ borderRadius: "4px" }}>
                        {blog.category}
                      </Tag>
                    </div>
                    <Title
                      level={4}
                      style={{ margin: "0 0 12px 0", minHeight: "64px" }}
                    >
                      {blog.title}
                    </Title>
                    <Paragraph
                      ellipsis={{ rows: 3 }}
                      style={{ color: "#666", marginBottom: "24px" }}
                    >
                      {blog.excerpt}
                    </Paragraph>
                    <div style={{ marginTop: "auto" }}>
                      <Divider style={{ margin: "16px 0" }} />
                      <Row justify="space-between">
                        <Col>
                          <Space size={8}>
                            <Avatar size="small" icon={<UserOutlined />} />
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              {blog.author}
                            </Text>
                          </Space>
                        </Col>
                        <Col>
                          <Space
                            size={12}
                            style={{ color: "#bfbfbf", fontSize: "12px" }}
                          >
                            <Space>
                              <ClockCircleOutlined /> {blog.readingTime}
                            </Space>
                            <Space>
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
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <BookOutlined
              style={{
                fontSize: "64px",
                color: "#d9d9d9",
                marginBottom: "24px",
              }}
            />
            <Title level={4} style={{ color: "#bfbfbf" }}>
              ไม่พบบทความที่คุณกำลังค้นหา
            </Title>
            <Button
              type="primary"
              onClick={() => {
                setActiveTab("all");
                setSearchText("");
              }}
            >
              แสดงบทความทั้งหมด
            </Button>
          </div>
        )}

        {/* 6. Newsletter / CTA */}
        <Card
          style={{
            marginTop: "80px",
            borderRadius: "16px",
            backgroundColor: "#fff",
            border: "1px solid #f0f0f0",
            textAlign: "center",
            padding: "40px",
          }}
        >
          <Title level={3}>รับบทความใหม่ๆ ก่อนใคร</Title>
          <Paragraph
            type="secondary"
            style={{ fontSize: "16px", marginBottom: "32px" }}
          >
            ลงทะเบียนเพื่อรับข่าวสารและบทความดีๆ
            สำหรับครูส่งตรงถึงอีเมลของคุณทุกสัปดาห์
          </Paragraph>
          <Space.Compact style={{ width: "100%", maxWidth: "500px" }}>
            <Input
              size="large"
              placeholder="ระบุอีเมลของคุณที่นี่..."
              style={{ height: "48px" }}
            />
            <Button
              type="primary"
              size="large"
              style={{
                height: "48px",
                backgroundColor: "#e60278",
                borderColor: "#e60278",
                fontWeight: 600,
              }}
            >
              ติดตามเลย
            </Button>
          </Space.Compact>
        </Card>
      </div>
    </div>
  );
}

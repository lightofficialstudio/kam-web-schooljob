"use client";

import {
  ArrowLeftOutlined,
  BookOutlined,
  CalendarOutlined,
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
  Row,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchBlogById } from "../_api/blog-api";

const { Title, Text } = Typography;

interface BlogDetail {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  coverImageUrl?: string | null;
  publishedAt?: string | null;
  tags: string[];
  author: string;
  authorRole?: string;
  authorImageUrl?: string | null;
  related: { id: string; title: string; slug: string; category: string; coverImageUrl?: string | null }[];
}

const formatThaiDate = (iso?: string | null) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
};

export default function BlogDetailPage() {
  const { token } = antTheme.useToken();
  const params = useParams();
  const router = useRouter();
  const blogId = params?.blog_id as string;

  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!blogId) return;
    setIsLoading(true);
    fetchBlogById(blogId)
      .then((res) => {
        if (res.status_code === 200 && res.data) {
          setBlog(res.data);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [blogId]);

  if (isLoading) {
    return (
      <Row justify="center" style={{ padding: "60px 24px" }}>
        <Col xs={24} lg={16}>
          <Skeleton active paragraph={{ rows: 8 }} />
        </Col>
      </Row>
    );
  }

  if (notFound || !blog) {
    return (
      <Row justify="center" style={{ padding: "120px 24px", minHeight: "100vh" }}>
        <Col style={{ textAlign: "center" }}>
          <Title level={3}>ไม่พบบทความ</Title>
          <Link href="/pages/blog"><Button type="primary">กลับสู่หน้าบทความ</Button></Link>
        </Col>
      </Row>
    );
  }

  return (
    <Row justify="center" style={{ minHeight: "100vh", backgroundColor: token.colorBgLayout, paddingBottom: "100px" }}>
      <Col span={24}>
        {/* Header/Breadcrumb */}
        <Row justify="center" style={{ borderBottom: `1px solid ${token.colorBorderSecondary}`, padding: "12px 0", backgroundColor: token.colorBgContainer }}>
          <Col xs={24} lg={20} xl={18} style={{ padding: "0 24px" }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Breadcrumb items={[
                  { title: <Link href="/pages/blog">บทความ</Link> },
                  { title: blog.category },
                  { title: "อ่านบทความ" },
                ]} />
              </Col>
              <Col>
                <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => router.push("/pages/blog")}>
                  กลับสู่หน้าหลัก
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Main Content */}
        <Row justify="center" style={{ marginTop: "40px" }}>
          <Col xs={24} lg={20} xl={18} style={{ padding: "0 24px" }}>
            <Space orientation="vertical" size={40} style={{ width: "100%" }}>
              {/* Title & Metadata */}
              <div style={{ textAlign: "center" }}>
                <Tag color="#11b6f5" style={{ marginBottom: "16px", padding: "2px 12px", borderRadius: "4px" }}>
                  {blog.category}
                </Tag>
                <Title level={1} style={{ maxWidth: "900px", margin: "0 auto 24px auto", lineHeight: "1.3", color: token.colorTextHeading }}>
                  {blog.title}
                </Title>
                <Space separator={<Divider orientation="vertical" />} style={{ color: token.colorTextDescription }}>
                  <Space><CalendarOutlined /> {formatThaiDate(blog.publishedAt)}</Space>
                </Space>
              </div>

              {/* Hero Image */}
              {blog.coverImageUrl && (
                <div style={{ width: "100%", maxHeight: "500px", aspectRatio: "16/9", borderRadius: token.borderRadiusLG * 2, overflow: "hidden", boxShadow: token.boxShadowSecondary }}>
                  <img src={blog.coverImageUrl} alt={blog.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              )}

              {/* Grid Content with Sidebar */}
              <Row gutter={[64, 40]}>
                {/* Share Sidebar (Left) */}
                <Col xs={0} lg={2}>
                  <Affix offsetTop={100}>
                    <Space orientation="vertical" size={16} style={{ textAlign: "center", width: "100%" }}>
                      <Text type="secondary" style={{ fontSize: "12px" }}>แชร์</Text>
                      <Button shape="circle" icon={<FacebookFilled style={{ color: "#1877F2" }} />} size="large" />
                      <Button shape="circle" icon={<TwitterOutlined style={{ color: "#1DA1F2" }} />} size="large" />
                      <Button shape="circle" icon={<LinkOutlined />} size="large" onClick={() => navigator.clipboard.writeText(window.location.href)} />
                    </Space>
                  </Affix>
                </Col>

                {/* Article Content */}
                <Col xs={24} lg={15}>
                  <Typography>
                    <div
                      style={{ fontSize: "18px", lineHeight: "1.9", color: token.colorText }}
                      dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                  </Typography>

                  <Divider style={{ margin: "60px 0" }} />

                  {/* Author Profile */}
                  <Card variant="borderless" style={{ backgroundColor: token.colorFillAlter, borderRadius: token.borderRadiusLG }}>
                    <Row gutter={[16, 16]} align="middle">
                      <Col>
                        <Avatar size={64} src={blog.authorImageUrl} icon={<UserOutlined />} style={{ backgroundColor: token.colorPrimary }} />
                      </Col>
                      <Col flex="auto">
                        <Title level={4} style={{ margin: 0 }}>{blog.author}</Title>
                        <Text type="secondary">{blog.authorRole}</Text>
                      </Col>
                    </Row>
                  </Card>
                </Col>

                {/* Sidebar (Right) */}
                <Col xs={24} lg={7}>
                  <Space orientation="vertical" size={40} style={{ width: "100%" }}>
                    {blog.related.length > 0 && (
                      <div>
                        <Title level={4} style={{ marginBottom: "24px" }}>บทความที่เกี่ยวข้อง</Title>
                        <Space orientation="vertical" size={16} style={{ width: "100%" }}>
                          {blog.related.map((item) => (
                            <Link key={item.id} href={`/pages/blog/${item.id}`}>
                              <Card hoverable style={{ borderRadius: token.borderRadiusLG }} styles={{ body: { padding: "16px" } }}>
                                <Tag color="#11b6f5" style={{ marginBottom: "8px", fontSize: "11px" }}>{item.category}</Tag>
                                <Title level={5} style={{ margin: 0, fontSize: "15px", lineHeight: "1.4" }}>{item.title}</Title>
                              </Card>
                            </Link>
                          ))}
                        </Space>
                      </div>
                    )}

                    <Card style={{ borderRadius: token.borderRadiusLG, backgroundColor: token.colorFillSecondary, border: `1px solid ${token.colorBorder}` }}>
                      <Space orientation="vertical" size={16}>
                        <BookOutlined style={{ fontSize: "24px", color: token.colorPrimary }} />
                        <Title level={5} style={{ margin: 0 }}>พร้อมก้าวหน้าในอาชีพครู?</Title>
                        <Text type="secondary">ลงทะเบียนเพื่อค้นหางานโรงเรียนที่ใช่สำหรับคุณวันนี้</Text>
                        <Link href="/pages/signup">
                          <Button type="primary" block size="large" style={{ fontWeight: 600 }}>สมัครสมาชิกฟรี</Button>
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

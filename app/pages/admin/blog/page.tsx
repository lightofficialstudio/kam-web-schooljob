"use client";

// ✨ Admin Blog Management — Enterprise UI + AI Blog Assistant
import { useAuthStore } from "@/app/stores/auth-store";
import {
  AppstoreOutlined,
  BarsOutlined,
  FilterOutlined,
  PlusOutlined,
  ProjectOutlined,
  ReloadOutlined,
  RobotOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  Col,
  Flex,
  Input,
  Row,
  Select,
  Segmented,
  Tag,
  Tooltip,
  Typography,
  theme,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BlogAnalyticsSection } from "./_components/blog-analytics-section";
import { BlogEditorDrawer } from "./_components/blog-editor-drawer";
import { BlogKanban } from "./_components/blog-kanban";
import { BlogStatsBar } from "./_components/blog-stats-bar";
import { BlogTable } from "./_components/blog-table";
import { useAdminBlogStore } from "./_state/blog-store";

const { Title, Text } = Typography;

const CATEGORIES = [
  "การพัฒนาวิชาชีพ",
  "เทคนิคการสอน",
  "เทคโนโลยีการศึกษา",
  "ไลฟ์สไตล์ครู",
  "ข่าวการศึกษา",
  "ทั่วไป",
];

// ✨ Blog Grid Card
function BlogGridCard({ blog }: { blog: import("./_state/blog-store").AdminBlogItem }) {
  const { token } = theme.useToken();
  const { openEdit, quickPublish } = useAdminBlogStore();

  return (
    <Card
      variant="borderless"
      style={{
        borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        height: "100%", display: "flex", flexDirection: "column",
        transition: "box-shadow 0.2s",
      }}
      styles={{ body: { padding: 0, display: "flex", flexDirection: "column", height: "100%" } }}
      cover={
        blog.coverImageUrl ? (
          <div
            style={{
              height: 150, borderRadius: "16px 16px 0 0",
              backgroundImage: `url(${blog.coverImageUrl})`,
              backgroundSize: "cover", backgroundPosition: "center",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", top: 10, left: 10 }}>
              <Tag
                color={blog.status === "PUBLISHED" ? "success" : "default"}
                style={{ margin: 0, fontSize: 11, borderRadius: 6 }}
              >
                {blog.status === "PUBLISHED" ? "เผยแพร่แล้ว" : "Draft"}
              </Tag>
            </div>
          </div>
        ) : (
          <Flex align="center" justify="center"
            style={{
              height: 100, borderRadius: "16px 16px 0 0",
              background: `linear-gradient(135deg, ${token.colorPrimaryBg} 0%, ${token.colorInfoBg} 100%)`,
              position: "relative",
            }}
          >
            <Text style={{ fontSize: 32 }}>✍️</Text>
            <div style={{ position: "absolute", top: 10, left: 10 }}>
              <Tag
                color={blog.status === "PUBLISHED" ? "success" : "default"}
                style={{ margin: 0, fontSize: 11, borderRadius: 6 }}
              >
                {blog.status === "PUBLISHED" ? "เผยแพร่แล้ว" : "Draft"}
              </Tag>
            </div>
          </Flex>
        )
      }
    >
      <Flex vertical style={{ padding: "16px", flex: 1 }} gap={10}>
        <Flex align="center" justify="space-between">
          {blog.category && <Tag color="processing" style={{ fontSize: 11, borderRadius: 6, margin: 0 }}>{blog.category}</Tag>}
          <Text type="secondary" style={{ fontSize: 11 }}>
            {blog.status === "PUBLISHED"
              ? new Date(blog.publishedAt ?? "").toLocaleDateString("th-TH", { day: "numeric", month: "short" })
              : `แก้ไข ${new Date(blog.updatedAt).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}`}
          </Text>
        </Flex>

        <Text strong style={{ fontSize: 13, lineHeight: 1.4 }} ellipsis={{ tooltip: blog.title }}>
          {blog.title}
        </Text>

        {blog.excerpt && (
          <Text type="secondary" style={{ fontSize: 12, lineHeight: 1.5 }} ellipsis>
            {blog.excerpt}
          </Text>
        )}

        <Flex gap={4} wrap="wrap">
          {blog.tags.slice(0, 3).map((t) => <Tag key={t} style={{ fontSize: 10, borderRadius: 6, margin: 0 }}>{t}</Tag>)}
          {blog.tags.length > 3 && <Text type="secondary" style={{ fontSize: 11 }}>+{blog.tags.length - 3}</Text>}
        </Flex>

        <Flex align="center" justify="space-between" style={{ marginTop: "auto", paddingTop: 10, borderTop: `1px solid ${token.colorBorderSecondary}` }}>
          <Text type="secondary" style={{ fontSize: 11 }}>{blog.author.name}</Text>
          <Flex align="center" gap={4}>
            {blog.status === "PUBLISHED" && (
              <Tooltip title="ดูบทความ">
                <Button size="small" type="text" href={`/pages/blog/${blog.id}`} target="_blank">👁</Button>
              </Tooltip>
            )}
            <Button size="small" type="text" onClick={() => openEdit(blog)}>✏️</Button>
            <Tooltip title={blog.status === "DRAFT" ? "เผยแพร่ทันที" : "ย้ายกลับ Draft"}>
              <Button
                size="small"
                type={blog.status === "PUBLISHED" ? "default" : "primary"}
                style={{ fontSize: 11, height: 24 }}
                onClick={() => quickPublish(blog.id, blog.status)}
              >
                {blog.status === "DRAFT" ? "เผยแพร่" : "Draft"}
              </Button>
            </Tooltip>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}

export default function AdminBlogPage() {
  const { token } = theme.useToken();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const {
    blogs, isLoading,
    filterStatus, filterKeyword, filterCategory,
    viewMode,
    setFilterStatus, setFilterKeyword, setFilterCategory, setViewMode,
    openCreate, fetchBlogs, fetchStatsOverview,
  } = useAdminBlogStore();

  const [isMounted, setIsMounted] = useState(false);
  const [searchInput, setSearchInput] = useState(filterKeyword);

  useEffect(() => { setIsMounted(true); }, []);

  // ✨ Guard: ADMIN เท่านั้น
  useEffect(() => {
    if (!isMounted) return;
    if (!isAuthenticated || !user) { router.replace("/pages/signin"); return; }
    if (user.role !== "ADMIN") router.replace("/");
  }, [isMounted, isAuthenticated, user?.role]);

  // ✨ โหลดบทความ + สถิติ
  useEffect(() => {
    if (!isMounted || user?.role !== "ADMIN") return;
    fetchBlogs();
    fetchStatsOverview();
  }, [isMounted, filterStatus, filterKeyword, filterCategory]);

  // ✨ debounce search
  useEffect(() => {
    const t = setTimeout(() => setFilterKeyword(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  if (!isMounted) return null;

  const draftCount = blogs.filter((b) => b.status === "DRAFT").length;

  return (
    <div style={{ minHeight: "100vh", background: token.colorBgLayout }}>

      {/* ─── Hero Banner ─── */}
      <div
        style={{
          background: "linear-gradient(135deg, #001e45 0%, #0a4a8a 55%, #11b6f5 100%)",
          padding: "36px 0 72px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ✨ Decoration circles */}
        <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(17,182,245,0.12)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: "30%", width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 40, left: -40, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <Breadcrumb
            style={{ marginBottom: 16 }}
            items={[
              { title: <Link href="/pages/admin" style={{ color: "rgba(255,255,255,0.65)" }}>แดชบอร์ด</Link> },
              { title: <span style={{ color: "white" }}>จัดการบทความ</span> },
            ]}
          />

          <Flex align="flex-start" justify="space-between" wrap="wrap" gap={16}>
            <Flex vertical gap={6}>
              <Flex align="center" gap={10}>
                <Title level={2} style={{ margin: 0, color: "white" }}>จัดการบทความ</Title>
                {draftCount > 0 && (
                  <Badge
                    count={`${draftCount} Draft`}
                    style={{ background: "#fa8c16", fontSize: 11 }}
                  />
                )}
              </Flex>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
                สร้าง แก้ไข เผยแพร่บทความ · มี AI ช่วยเขียนในตัว
              </Text>
            </Flex>

            <Flex gap={10} align="center">
              <Tooltip title="AI จะช่วยเขียนชื่อ, สรุป, เนื้อหา, tags และวิเคราะห์ SEO ได้ใน Editor">
                <Tag
                  icon={<RobotOutlined />}
                  color="processing"
                  style={{
                    fontSize: 13, padding: "5px 14px", borderRadius: 20, cursor: "help",
                    background: "rgba(17,182,245,0.2)", borderColor: "rgba(17,182,245,0.5)", color: "white",
                  }}
                >
                  AI-Powered
                </Tag>
              </Tooltip>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={openCreate}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  borderColor: "rgba(255,255,255,0.4)",
                  color: "white",
                  fontWeight: 600,
                  height: 44,
                  borderRadius: 10,
                  backdropFilter: "blur(8px)",
                }}
              >
                สร้างบทความใหม่
              </Button>
            </Flex>
          </Flex>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div style={{ maxWidth: 1200, margin: "-36px auto 0", padding: "0 24px 80px", position: "relative" }}>

        {/* ─── Stats Bar ─── */}
        <div style={{ marginBottom: 20 }}>
          <BlogStatsBar />
        </div>

        {/* ─── Analytics Section ─── */}
        <div style={{ marginBottom: 20 }}>
          <BlogAnalyticsSection />
        </div>

        {/* ─── Filter + View Controls ─── */}
        <Card
          variant="borderless"
          style={{ borderRadius: 16, marginBottom: 18, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
          styles={{ body: { padding: "14px 20px" } }}
        >
          <Flex align="center" gap={10} wrap="wrap">
            <FilterOutlined style={{ color: token.colorTextTertiary }} />

            {/* ✨ Search */}
            <Input
              prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
              placeholder="ค้นหาชื่อบทความ, slug..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              allowClear
              style={{ width: 260, borderRadius: 10 }}
            />

            {/* ✨ Status filter */}
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: 150 }}
              options={[
                { value: "all", label: "ทุกสถานะ" },
                { value: "PUBLISHED", label: "เผยแพร่แล้ว" },
                { value: "DRAFT", label: "ฉบับร่าง" },
              ]}
            />

            {/* ✨ Category filter */}
            <Select
              value={filterCategory || undefined}
              onChange={setFilterCategory}
              placeholder="ทุกหมวดหมู่"
              allowClear
              style={{ width: 170 }}
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            />

            {/* ✨ Refresh */}
            <Tooltip title="รีเฟรชข้อมูล">
              <Button icon={<ReloadOutlined />} onClick={fetchBlogs} loading={isLoading} />
            </Tooltip>

            {/* ✨ View mode toggle */}
            <div style={{ marginLeft: "auto" }}>
              <Segmented
                value={viewMode}
                onChange={(v) => setViewMode(v as "grid" | "table" | "kanban")}
                options={[
                  { value: "grid", icon: <AppstoreOutlined />, label: "Grid" },
                  { value: "kanban", icon: <ProjectOutlined />, label: "Kanban" },
                  { value: "table", icon: <BarsOutlined />, label: "ตาราง" },
                ]}
              />
            </div>
          </Flex>
        </Card>

        {/* ─── Content View ─── */}
        {viewMode === "kanban" && <BlogKanban />}

        {viewMode === "table" && (
          <Card variant="borderless" style={{ borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
            <BlogTable />
          </Card>
        )}

        {viewMode === "grid" && (
          <Row gutter={[16, 16]}>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Col xs={24} sm={12} lg={8} key={i}>
                    <Card variant="borderless" style={{ borderRadius: 16 }}>
                      <div style={{ height: 100, background: token.colorFillSecondary, borderRadius: 10, marginBottom: 14 }} />
                      <div style={{ height: 12, background: token.colorFillSecondary, borderRadius: 6, marginBottom: 8, width: "80%" }} />
                      <div style={{ height: 12, background: token.colorFillSecondary, borderRadius: 6, width: "60%" }} />
                    </Card>
                  </Col>
                ))
              : blogs.length === 0
              ? (
                <Col xs={24}>
                  <Card variant="borderless" style={{ borderRadius: 16, textAlign: "center", padding: "60px 24px" }}>
                    <Text style={{ fontSize: 48, display: "block", marginBottom: 16 }}>📝</Text>
                    <Title level={4} style={{ color: token.colorTextSecondary }}>ยังไม่มีบทความ</Title>
                    <Text type="secondary">กดปุ่ม "สร้างบทความใหม่" หรือใช้ AI ช่วยเขียน</Text>
                    <div style={{ marginTop: 20 }}>
                      <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>สร้างบทความใหม่</Button>
                    </div>
                  </Card>
                </Col>
              )
              : blogs.map((blog) => (
                  <Col xs={24} sm={12} lg={8} key={blog.id}>
                    <BlogGridCard blog={blog} />
                  </Col>
                ))}
          </Row>
        )}
      </div>

      {/* ─── Editor Drawer (มี AI Assistant อยู่ด้านขวา) ─── */}
      <BlogEditorDrawer authorId={user?.user_id} />
    </div>
  );
}

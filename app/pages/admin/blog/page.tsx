"use client";

// ✨ หน้าจัดการบทความสำหรับ ADMIN — สร้าง, แก้ไข, ลบ, เผยแพร่
import { useAuthStore } from "@/app/stores/auth-store";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FileAddOutlined,
  FilterOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Col,
  Flex,
  Input,
  Modal,
  Pagination,
  Row,
  Select,
  Skeleton,
  Space,
  Tag,
  theme,
  Tooltip,
  Typography,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BlogEditorDrawer } from "./_components/blog-editor-drawer";
import { useAdminBlogStore } from "./_state/blog-store";

const { Title, Text, Paragraph } = Typography;

// ✨ แปลงวันที่ ISO → ภาษาไทย
const formatThaiDate = (iso?: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
};

export default function AdminBlogPage() {
  const { token } = theme.useToken();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const {
    blogs, total, isLoading, page,
    filterStatus, filterKeyword,
    setFilterStatus, setFilterKeyword, setPage,
    openCreate, openEdit, fetchBlogs, deleteBlog,
  } = useAdminBlogStore();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  // ✨ Guard: ADMIN เท่านั้น
  useEffect(() => {
    if (!isMounted) return;
    if (!isAuthenticated || !user) {
      router.replace("/pages/signin");
      return;
    }
    if (user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [isMounted, isAuthenticated, user?.role]);

  // ✨ โหลดรายการบทความ
  useEffect(() => {
    if (!isMounted || user?.role !== "ADMIN") return;
    fetchBlogs();
  }, [isMounted, filterStatus, filterKeyword, page]);

  // ✨ debounce search
  const [searchInput, setSearchInput] = useState(filterKeyword);
  useEffect(() => {
    const t = setTimeout(() => setFilterKeyword(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleDelete = (id: string, title: string) => {
    Modal.confirm({
      title: "ยืนยันการลบบทความ",
      content: (
        <Text>
          ต้องการลบบทความ{" "}
          <Text strong>&ldquo;{title}&rdquo;</Text>
          {" "}ใช่หรือไม่? ไม่สามารถกู้คืนได้
        </Text>
      ),
      okText: "ลบ",
      okButtonProps: { danger: true },
      cancelText: "ยกเลิก",
      onOk: () => deleteBlog(id),
    });
  };

  if (!isMounted) return null;

  const statsData = [
    { label: "บทความทั้งหมด", value: total, color: token.colorPrimary, icon: <FileAddOutlined /> },
    { label: "เผยแพร่แล้ว", value: blogs.filter(b => b.status === "PUBLISHED").length, color: "#52c41a", icon: <CheckCircleOutlined /> },
    { label: "ฉบับร่าง", value: blogs.filter(b => b.status === "DRAFT").length, color: "#fa8c16", icon: <ClockCircleOutlined /> },
  ];

  return (
    <div style={{ minHeight: "100vh", background: token.colorBgLayout }}>

      {/* ─── Hero Banner ─── */}
      <div
        style={{
          background: "linear-gradient(135deg, #001e45 0%, #0a4a8a 55%, #11b6f5 100%)",
          padding: "40px 0 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(17,182,245,0.12)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: "30%", width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <Breadcrumb
            style={{ marginBottom: 20 }}
            items={[
              { title: <Link href="/pages/admin" style={{ color: "rgba(255,255,255,0.65)" }}>แดชบอร์ด</Link> },
              { title: <span style={{ color: "white" }}>จัดการบทความ</span> },
            ]}
          />
          <Flex align="center" justify="space-between" wrap="wrap" gap={16}>
            <Flex vertical gap={4}>
              <Title level={2} style={{ margin: 0, color: "white" }}>จัดการบทความ</Title>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
                สร้าง แก้ไข และเผยแพร่บทความสำหรับครูและสถานศึกษา
              </Text>
            </Flex>
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
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div style={{ maxWidth: 1152, margin: "-40px auto 0", padding: "0 24px 80px", position: "relative" }}>

        {/* ─── Stats ─── */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {statsData.map((s) => (
            <Col xs={24} sm={8} key={s.label}>
              <Card
                variant="borderless"
                style={{ borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
              >
                <Flex align="center" gap={16}>
                  <Flex
                    align="center"
                    justify="center"
                    style={{
                      width: 48, height: 48, borderRadius: 12,
                      background: `${s.color}18`,
                      color: s.color, fontSize: 22,
                    }}
                  >
                    {s.icon}
                  </Flex>
                  <Flex vertical gap={2}>
                    <Text type="secondary" style={{ fontSize: 12 }}>{s.label}</Text>
                    <Text strong style={{ fontSize: 24, lineHeight: 1.2, color: s.color }}>{s.value}</Text>
                  </Flex>
                </Flex>
              </Card>
            </Col>
          ))}
        </Row>

        {/* ─── Filters ─── */}
        <Card
          variant="borderless"
          style={{ borderRadius: 16, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
        >
          <Flex align="center" gap={12} wrap="wrap">
            <FilterOutlined style={{ color: token.colorTextTertiary }} />
            <Input
              prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
              placeholder="ค้นหาชื่อบทความ, slug..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              allowClear
              style={{ width: 280, borderRadius: 10 }}
            />
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: 160, borderRadius: 10 }}
              options={[
                { value: "all", label: "ทุกสถานะ" },
                { value: "PUBLISHED", label: "เผยแพร่แล้ว" },
                { value: "DRAFT", label: "ฉบับร่าง" },
              ]}
            />
            <Text type="secondary" style={{ fontSize: 13, marginLeft: "auto" }}>
              ทั้งหมด {total} บทความ
            </Text>
          </Flex>
        </Card>

        {/* ─── Blog List ─── */}
        {isLoading ? (
          <Row gutter={[16, 16]}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Col xs={24} sm={12} lg={8} key={i}>
                <Card variant="borderless" style={{ borderRadius: 16 }}>
                  <Skeleton active avatar paragraph={{ rows: 3 }} />
                </Card>
              </Col>
            ))}
          </Row>
        ) : blogs.length === 0 ? (
          <Card
            variant="borderless"
            style={{ borderRadius: 16, textAlign: "center", padding: "80px 24px" }}
          >
            <FileAddOutlined style={{ fontSize: 48, color: token.colorTextQuaternary, marginBottom: 16 }} />
            <Title level={4} style={{ color: token.colorTextSecondary }}>ยังไม่มีบทความ</Title>
            <Text type="secondary">กดปุ่ม "สร้างบทความใหม่" เพื่อเริ่มต้น</Text>
            <div style={{ marginTop: 24 }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>สร้างบทความใหม่</Button>
            </div>
          </Card>
        ) : (
          <Row gutter={[16, 16]}>
            {blogs.map((blog) => (
              <Col xs={24} sm={12} lg={8} key={blog.id}>
                <Card
                  variant="borderless"
                  style={{ borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", height: "100%", display: "flex", flexDirection: "column" }}
                  styles={{ body: { padding: 0, display: "flex", flexDirection: "column", height: "100%" } }}
                  cover={
                    blog.coverImageUrl ? (
                      <div
                        style={{
                          height: 160,
                          backgroundImage: `url(${blog.coverImageUrl})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          borderRadius: "16px 16px 0 0",
                          position: "relative",
                        }}
                      >
                        <div style={{ position: "absolute", top: 12, left: 12 }}>
                          <Badge
                            status={blog.status === "PUBLISHED" ? "success" : "default"}
                            text={
                              <Tag
                                color={blog.status === "PUBLISHED" ? "success" : "default"}
                                style={{ margin: 0, fontSize: 11, borderRadius: 6 }}
                              >
                                {blog.status === "PUBLISHED" ? "เผยแพร่แล้ว" : "Draft"}
                              </Tag>
                            }
                          />
                        </div>
                      </div>
                    ) : (
                      <Flex
                        align="center"
                        justify="center"
                        style={{
                          height: 120,
                          background: `linear-gradient(135deg, ${token.colorPrimaryBg} 0%, ${token.colorInfoBg} 100%)`,
                          borderRadius: "16px 16px 0 0",
                          position: "relative",
                        }}
                      >
                        <FileAddOutlined style={{ fontSize: 36, color: token.colorPrimary }} />
                        <div style={{ position: "absolute", top: 12, left: 12 }}>
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
                  <Flex vertical style={{ padding: "20px", flex: 1 }} gap={12}>

                    {/* Category + date */}
                    <Flex align="center" justify="space-between">
                      {blog.category && <Tag color="processing" style={{ fontSize: 11, borderRadius: 6, margin: 0 }}>{blog.category}</Tag>}
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {blog.status === "PUBLISHED"
                          ? formatThaiDate(blog.publishedAt)
                          : `แก้ไข ${formatThaiDate(blog.updatedAt)}`}
                      </Text>
                    </Flex>

                    {/* Title */}
                    <Title level={5} style={{ margin: 0, lineHeight: 1.4, minHeight: 44 }} ellipsis={{ rows: 2 }}>
                      {blog.title}
                    </Title>

                    {/* Excerpt */}
                    {blog.excerpt && (
                      <Paragraph
                        type="secondary"
                        ellipsis={{ rows: 2 }}
                        style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}
                      >
                        {blog.excerpt}
                      </Paragraph>
                    )}

                    {/* Tags */}
                    {blog.tags.length > 0 && (
                      <Flex gap={4} wrap="wrap">
                        {blog.tags.slice(0, 3).map((t: string) => (
                          <Tag key={t} style={{ fontSize: 11, borderRadius: 6, margin: 0 }}>{t}</Tag>
                        ))}
                        {blog.tags.length > 3 && <Text type="secondary" style={{ fontSize: 11 }}>+{blog.tags.length - 3}</Text>}
                      </Flex>
                    )}

                    {/* Author + Actions */}
                    <Flex align="center" justify="space-between" style={{ marginTop: "auto", paddingTop: 12, borderTop: `1px solid ${token.colorBorderSecondary}` }}>
                      <Flex align="center" gap={8}>
                        <Avatar
                          size={24}
                          src={blog.author.imageUrl || undefined}
                          style={{ backgroundColor: token.colorPrimary, fontSize: 10 }}
                        >
                          {!blog.author.imageUrl && blog.author.name.charAt(0)}
                        </Avatar>
                        <Text type="secondary" style={{ fontSize: 12 }}>{blog.author.name}</Text>
                      </Flex>
                      <Space size={4}>
                        {blog.status === "PUBLISHED" && (
                          <Tooltip title="ดูบทความ">
                            <Button
                              size="small"
                              type="text"
                              icon={<EyeOutlined />}
                              href={`/pages/blog/${blog.id}`}
                              target="_blank"
                            />
                          </Tooltip>
                        )}
                        <Tooltip title="แก้ไข">
                          <Button
                            size="small"
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => openEdit(blog as any)}
                          />
                        </Tooltip>
                        <Tooltip title="ลบ">
                          <Button
                            size="small"
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(blog.id, blog.title)}
                          />
                        </Tooltip>
                      </Space>
                    </Flex>

                  </Flex>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* ─── Pagination ─── */}
        {total > 20 && (
          <Flex justify="center" style={{ marginTop: 32 }}>
            <Pagination
              current={page}
              total={total}
              pageSize={20}
              onChange={setPage}
              showSizeChanger={false}
            />
          </Flex>
        )}
      </div>

      {/* ─── Drawer สร้าง/แก้ไขบทความ ─── */}
      <BlogEditorDrawer authorId={user?.user_id} />
    </div>
  );
}

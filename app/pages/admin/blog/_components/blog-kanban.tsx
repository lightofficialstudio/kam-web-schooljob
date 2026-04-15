"use client";

// ✨ Blog Kanban — แสดง DRAFT vs PUBLISHED แบบ 2 คอลัมน์ พร้อม quick-publish toggle
import {
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  SendOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Empty,
  Flex,
  Modal,
  Skeleton,
  Switch,
  Tag,
  Tooltip,
  Typography,
  theme,
} from "antd";
import { AdminBlogItem, useAdminBlogStore } from "../_state/blog-store";

const { Text, Title } = Typography;

// ✨ แปลงวันที่
const fmtDate = (iso?: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
};

// ✨ Blog card ใน kanban column
function KanbanBlogCard({ blog }: { blog: AdminBlogItem }) {
  const { token } = theme.useToken();
  const { openEdit, deleteBlog, quickPublish } = useAdminBlogStore();

  const handleDelete = () => {
    Modal.confirm({
      title: "ยืนยันการลบบทความ",
      content: <Text>ต้องการลบ <Text strong>&ldquo;{blog.title}&rdquo;</Text> ใช่หรือไม่?</Text>,
      okText: "ลบ", okButtonProps: { danger: true },
      cancelText: "ยกเลิก",
      onOk: () => deleteBlog(blog.id),
    });
  };

  return (
    <Card
      variant="borderless"
      style={{
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        border: `1px solid ${token.colorBorderSecondary}`,
        marginBottom: 10,
      }}
      styles={{ body: { padding: "14px 16px" } }}
    >
      <Flex vertical gap={8}>
        {/* ✨ Cover thumbnail */}
        {blog.coverImageUrl && (
          <div
            style={{
              height: 90,
              backgroundImage: `url(${blog.coverImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: 8,
            }}
          />
        )}

        {/* ✨ Category + date */}
        <Flex align="center" justify="space-between">
          {blog.category
            ? <Tag color="processing" style={{ fontSize: 11, borderRadius: 6, margin: 0 }}>{blog.category}</Tag>
            : <span />}
          <Text type="secondary" style={{ fontSize: 11 }}>
            {blog.status === "PUBLISHED" ? fmtDate(blog.publishedAt) : `แก้ไข ${fmtDate(blog.updatedAt)}`}
          </Text>
        </Flex>

        {/* ✨ Title */}
        <Text strong style={{ fontSize: 13, lineHeight: 1.4 }} ellipsis={{ tooltip: blog.title }}>
          {blog.title}
        </Text>

        {/* ✨ Tags */}
        {blog.tags.length > 0 && (
          <Flex gap={4} wrap="wrap">
            {blog.tags.slice(0, 3).map((t) => (
              <Tag key={t} style={{ fontSize: 10, borderRadius: 6, margin: 0 }}>{t}</Tag>
            ))}
            {blog.tags.length > 3 && <Text type="secondary" style={{ fontSize: 11 }}>+{blog.tags.length - 3}</Text>}
          </Flex>
        )}

        {/* ✨ Footer: author + actions */}
        <Flex align="center" justify="space-between" style={{ paddingTop: 8, borderTop: `1px solid ${token.colorBorderSecondary}` }}>
          <Flex align="center" gap={6}>
            <Avatar size={20} src={blog.author.imageUrl ?? undefined} style={{ background: token.colorPrimary, fontSize: 10 }}>
              {!blog.author.imageUrl && blog.author.name.charAt(0)}
            </Avatar>
            <Text type="secondary" style={{ fontSize: 11 }} ellipsis>{blog.author.name}</Text>
          </Flex>

          <Flex align="center" gap={4}>
            {blog.status === "PUBLISHED" && (
              <Tooltip title="ดูบทความ">
                <Button size="small" type="text" icon={<EyeOutlined />} href={`/pages/blog/${blog.id}`} target="_blank" />
              </Tooltip>
            )}
            <Tooltip title="แก้ไข">
              <Button size="small" type="text" icon={<EditOutlined />} onClick={() => openEdit(blog)} />
            </Tooltip>
            <Tooltip title="ลบ">
              <Button size="small" type="text" danger icon={<DeleteOutlined />} onClick={handleDelete} />
            </Tooltip>
            <Tooltip title={blog.status === "DRAFT" ? "เผยแพร่ทันที" : "ย้ายกลับ Draft"}>
              <Switch
                size="small"
                checked={blog.status === "PUBLISHED"}
                checkedChildren={<SendOutlined />}
                unCheckedChildren={<ClockCircleOutlined />}
                onChange={() => quickPublish(blog.id, blog.status)}
              />
            </Tooltip>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}

// ✨ Kanban Column
function KanbanColumn({
  title,
  blogs,
  color,
  count,
}: {
  title: string;
  blogs: AdminBlogItem[];
  color: string;
  count: number;
}) {
  const { token } = theme.useToken();

  return (
    <Flex
      vertical
      style={{
        background: token.colorFillQuaternary,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderTop: `3px solid ${color}`,
        borderRadius: 14,
        padding: "16px",
        flex: 1,
        minWidth: 300,
        maxHeight: "calc(100vh - 360px)",
        overflowY: "auto",
      }}
    >
      <Flex align="center" gap={8} style={{ marginBottom: 14 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
        <Text strong style={{ fontSize: 14 }}>{title}</Text>
        <Tag style={{ marginLeft: "auto", borderRadius: 20, fontSize: 12, background: color + "20", borderColor: color, color }}>
          {count}
        </Tag>
      </Flex>

      {blogs.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<Text type="secondary" style={{ fontSize: 12 }}>ไม่มีบทความ</Text>} style={{ padding: "20px 0" }} />
      ) : (
        blogs.map((b) => <KanbanBlogCard key={b.id} blog={b} />)
      )}
    </Flex>
  );
}

export function BlogKanban() {
  const { blogs, isLoading } = useAdminBlogStore();
  const draft = blogs.filter((b) => b.status === "DRAFT");
  const published = blogs.filter((b) => b.status === "PUBLISHED");

  if (isLoading) {
    return (
      <Flex gap={16}>
        {[0, 1].map((i) => (
          <div key={i} style={{ flex: 1, minWidth: 300 }}>
            {[0, 1, 2].map((j) => (
              <Card key={j} variant="borderless" style={{ borderRadius: 12, marginBottom: 10 }}>
                <Skeleton active paragraph={{ rows: 3 }} />
              </Card>
            ))}
          </div>
        ))}
      </Flex>
    );
  }

  return (
    <Flex gap={16} align="flex-start" style={{ overflowX: "auto", paddingBottom: 8 }}>
      <KanbanColumn title="ฉบับร่าง (Draft)" blogs={draft} color="#fa8c16" count={draft.length} />
      <KanbanColumn title="เผยแพร่แล้ว" blogs={published} color="#52c41a" count={published.length} />
    </Flex>
  );
}

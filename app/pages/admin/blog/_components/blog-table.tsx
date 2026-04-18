"use client";

// ✨ Blog Table — ตารางรายการบทความพร้อม bulk actions + quick-publish
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Flex,
  Skeleton,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
  theme,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { AdminBlogItem, useAdminBlogStore } from "../_state/blog-store";

const { Text } = Typography;

const fmtDate = (iso?: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export function BlogTable() {
  const { token } = theme.useToken();
  const {
    blogs,
    total,
    isLoading,
    page,
    setPage,
    openEdit,
    deleteBlog,
    quickPublish,
    showModal,
  } = useAdminBlogStore();

  // ✨ เปิด confirm modal ก่อนลบ — ใช้ type="delete" เพื่อป้องกันการลบผิดพลาด
  const handleDelete = (blog: AdminBlogItem) => {
    showModal({
      type: "delete",
      title: `ลบบทความ “${blog.title}”?`,
      description: `บทความนี้จะถูกลบออกจากระบบถาวร ไม่สามารถย้อนกลับได้`,
      confirmLabel: "ลบถาวร",
      cancelLabel: "ยกเลิก",
      onConfirm: () => deleteBlog(blog.id),
    });
  };

  const columns: ColumnsType<AdminBlogItem> = [
    {
      title: "บทความ",
      key: "title",
      render: (_, b) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {b.coverImageUrl ? (
            <div
              style={{
                width: 48,
                height: 36,
                borderRadius: 6,
                flexShrink: 0,
                backgroundImage: `url(${b.coverImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ) : (
            <div
              style={{
                width: 48,
                height: 36,
                borderRadius: 6,
                flexShrink: 0,
                background: token.colorPrimaryBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: token.colorPrimary, fontSize: 16 }}>✍</Text>
            </div>
          )}
          <div>
            <Text strong style={{ fontSize: 13, display: "block" }} ellipsis>
              {b.title}
            </Text>
            <Text type="secondary" style={{ fontSize: 11 }}>
              /blog/{b.slug}
            </Text>
          </div>
        </div>
      ),
      width: 340,
    },
    {
      title: "หมวดหมู่",
      dataIndex: "category",
      key: "category",
      render: (cat: string) =>
        cat ? (
          <Tag color="processing" style={{ borderRadius: 6, fontSize: 11 }}>
            {cat}
          </Tag>
        ) : (
          <Text type="secondary">—</Text>
        ),
      width: 140,
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      render: (status: string, b) => (
        <Switch
          size="small"
          checked={status === "PUBLISHED"}
          checkedChildren="เผยแพร่"
          unCheckedChildren="Draft"
          onChange={() => quickPublish(b.id, b.status)}
        />
      ),
      width: 110,
    },
    {
      title: "ยอดวิว",
      key: "viewCount",
      render: (_, b) =>
        b.status === "PUBLISHED" ? (
          <Flex align="center" gap={4}>
            <EyeOutlined style={{ fontSize: 12, color: "#8c8c8c" }} />
            <Text style={{ fontSize: 13, fontWeight: 600 }}>
              {(b.viewCount ?? 0).toLocaleString()}
            </Text>
          </Flex>
        ) : (
          <Text type="secondary" style={{ fontSize: 12 }}>
            —
          </Text>
        ),
      width: 100,
      sorter: (a, b) => (a.viewCount ?? 0) - (b.viewCount ?? 0),
    },
    {
      title: "วันที่",
      key: "date",
      render: (_, b) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {b.status === "PUBLISHED"
            ? fmtDate(b.publishedAt)
            : `แก้ไข ${fmtDate(b.updatedAt)}`}
        </Text>
      ),
      width: 130,
      sorter: (a, b) =>
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    },
    {
      title: "ผู้เขียน",
      key: "author",
      render: (_, b) => (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Avatar
            size={22}
            src={b.author.imageUrl ?? undefined}
            style={{ background: token.colorPrimary, fontSize: 10 }}
          >
            {!b.author.imageUrl && b.author.name.charAt(0)}
          </Avatar>
          <Text style={{ fontSize: 12 }} ellipsis>
            {b.author.name}
          </Text>
        </div>
      ),
      width: 130,
    },
    {
      title: "",
      key: "actions",
      render: (_, b) => (
        <div style={{ display: "flex", gap: 2 }}>
          {b.status === "PUBLISHED" && (
            <Tooltip title="ดูบทความ">
              <Button
                size="small"
                type="text"
                icon={<EyeOutlined />}
                href={`/pages/blog/${b.id}`}
                target="_blank"
              />
            </Tooltip>
          )}
          <Tooltip title="แก้ไข">
            <Button
              size="small"
              type="text"
              icon={<EditOutlined />}
              onClick={() => openEdit(b)}
            />
          </Tooltip>
          <Tooltip title="ลบ">
            <Button
              size="small"
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(b)}
            />
          </Tooltip>
        </div>
      ),
      width: 100,
      fixed: "right",
    },
  ];

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  return (
    <Table
      columns={columns}
      dataSource={blogs}
      rowKey="id"
      pagination={{
        current: page,
        total,
        pageSize: 20,
        onChange: setPage,
        showSizeChanger: false,
        showTotal: (t) => `ทั้งหมด ${t} บทความ`,
        style: { marginTop: 16 },
      }}
      scroll={{ x: 900 }}
      size="middle"
      rowClassName={() => "blog-table-row"}
      onRow={(b) => ({
        onDoubleClick: () => openEdit(b),
        style: { cursor: "pointer" },
      })}
      style={{ background: "transparent" }}
    />
  );
}

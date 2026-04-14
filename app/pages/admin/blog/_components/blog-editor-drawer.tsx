"use client";

// ✨ Drawer สำหรับสร้าง/แก้ไขบทความ — รองรับ AI content generation ในอนาคต
import {
  BulbOutlined,
  FileTextOutlined,
  LinkOutlined,
  PictureOutlined,
  RobotOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Col,
  Divider,
  Drawer,
  Flex,
  Form,
  Input,
  Row,
  Select,
  Space,
  Tag,
  theme,
  Tooltip,
  Typography,
} from "antd";
import { useEffect } from "react";
import { useAdminBlogStore } from "../_state/blog-store";

const { Text } = Typography;
const { TextArea } = Input;

const CATEGORIES = [
  "การพัฒนาวิชาชีพ",
  "เทคนิคการสอน",
  "เทคโนโลยีการศึกษา",
  "ไลฟ์สไตล์ครู",
  "ข่าวการศึกษา",
  "ทั่วไป",
];

// ✨ แปลงชื่อบทความเป็น slug โดยอัตโนมัติ
const toSlug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 100);

export const BlogEditorDrawer: React.FC<{ authorId?: string }> = ({ authorId }) => {
  const { token } = theme.useToken();
  const { isDrawerOpen, editingBlog, isSubmitting, closeDrawer, submitBlog } = useAdminBlogStore();
  const [form] = Form.useForm();
  const isEdit = !!editingBlog;

  // ✨ โหลดข้อมูลบทความเดิมเมื่อเปิด Drawer แก้ไข
  useEffect(() => {
    if (isDrawerOpen) {
      if (editingBlog) {
        form.setFieldsValue({
          title: editingBlog.title,
          slug: editingBlog.slug,
          content: editingBlog.content ?? "",
          excerpt: editingBlog.excerpt ?? "",
          cover_image_url: editingBlog.coverImageUrl ?? "",
          category: editingBlog.category ?? undefined,
          tags: editingBlog.tags ?? [],
          status: editingBlog.status,
        });
      } else {
        form.resetFields();
        form.setFieldValue("status", "DRAFT");
      }
    }
  }, [isDrawerOpen, editingBlog]);

  // ✨ Auto-generate slug จาก title (เฉพาะตอนสร้างใหม่)
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEdit) {
      form.setFieldValue("slug", toSlug(e.target.value));
    }
  };

  const handleFinish = async (values: any) => {
    await submitBlog({
      ...values,
      author_id: authorId,
      cover_image_url: values.cover_image_url || undefined,
    });
  };

  return (
    <Drawer
      title={
        <Flex align="center" gap={10}>
          <Flex
            align="center"
            justify="center"
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: token.colorPrimaryBg,
              color: token.colorPrimary, fontSize: 16,
            }}
          >
            <FileTextOutlined />
          </Flex>
          <Text strong style={{ fontSize: 16 }}>
            {isEdit ? "แก้ไขบทความ" : "สร้างบทความใหม่"}
          </Text>
        </Flex>
      }
      placement="right"
      width={720}
      onClose={closeDrawer}
      open={isDrawerOpen}
      extra={
        <Space>
          <Button onClick={closeDrawer}>ยกเลิก</Button>
          <Button
            type="primary"
            loading={isSubmitting}
            onClick={() => form.submit()}
            style={{ background: "linear-gradient(135deg, #0d8fd4 0%, #11b6f5 100%)", border: "none" }}
          >
            {isEdit ? "บันทึกการแก้ไข" : "สร้างบทความ"}
          </Button>
        </Space>
      }
    >
      {/* ✨ AI Hook Banner — placeholder สำหรับ AI content generation */}
      <Alert
        type="info"
        showIcon
        icon={<RobotOutlined />}
        message={
          <Flex align="center" justify="space-between">
            <Text style={{ fontSize: 13 }}>
              <Text strong>AI Content Assistant</Text>
              {" "}— สามารถเชื่อมต่อ AI เพื่อช่วยเขียนเนื้อหา, สรุป และ SEO ได้ในอนาคต
            </Text>
            <Tooltip title="ฟีเจอร์นี้กำลังพัฒนา">
              <Button size="small" icon={<BulbOutlined />} disabled>
                ลองใช้ AI
              </Button>
            </Tooltip>
          </Flex>
        }
        style={{ marginBottom: 24, borderRadius: 10 }}
      />

      <Form form={form} layout="vertical" onFinish={handleFinish} size="large">

        {/* ─── ข้อมูลพื้นฐาน ─── */}
        <Form.Item
          name="title"
          label="ชื่อบทความ"
          rules={[{ required: true, message: "กรุณาระบุชื่อบทความ" }]}
        >
          <Input
            prefix={<FileTextOutlined style={{ color: token.colorTextTertiary }} />}
            placeholder="เช่น 5 เทคนิคการสอนที่ครูยุคใหม่ต้องรู้"
            onChange={handleTitleChange}
            style={{ borderRadius: 10 }}
          />
        </Form.Item>

        <Form.Item
          name="slug"
          label={
            <Flex align="center" gap={6}>
              <span>Slug (URL)</span>
              <Tooltip title="ใช้ใน URL เช่น /blog/5-teaching-tips — ตัวพิมพ์เล็ก a-z, 0-9, และ - เท่านั้น">
                <LinkOutlined style={{ color: token.colorTextTertiary, fontSize: 13 }} />
              </Tooltip>
            </Flex>
          }
          rules={[
            { required: true, message: "กรุณาระบุ slug" },
            { pattern: /^[a-z0-9-]+$/, message: "slug ต้องเป็น lowercase a-z, 0-9, และ - เท่านั้น" },
          ]}
        >
          <Input
            placeholder="5-teaching-tips"
            prefix={<Text type="secondary" style={{ fontSize: 13 }}>/blog/</Text>}
            style={{ borderRadius: 10 }}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="category" label="หมวดหมู่">
              <Select
                placeholder="เลือกหมวดหมู่"
                allowClear
                options={CATEGORIES.map((c) => ({ value: c, label: c }))}
                style={{ borderRadius: 10 }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="status" label="สถานะ" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: "DRAFT", label: <Tag color="default">Draft — ฉบับร่าง</Tag> },
                  { value: "PUBLISHED", label: <Tag color="success">Published — เผยแพร่แล้ว</Tag> },
                ]}
                style={{ borderRadius: 10 }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="tags" label={<Flex align="center" gap={6}><TagsOutlined /><span>Tags</span></Flex>}>
          <Select
            mode="tags"
            placeholder="พิมพ์แล้วกด Enter เพื่อเพิ่ม tag"
            style={{ borderRadius: 10 }}
          />
        </Form.Item>

        <Form.Item
          name="cover_image_url"
          label={<Flex align="center" gap={6}><PictureOutlined /><span>Cover Image URL</span></Flex>}
          rules={[{ type: "url", message: "กรุณาระบุ URL ที่ถูกต้อง" }]}
        >
          <Input
            placeholder="https://images.unsplash.com/..."
            style={{ borderRadius: 10 }}
          />
        </Form.Item>

        <Divider style={{ margin: "8px 0 20px" }} />

        <Form.Item name="excerpt" label="สรุปย่อ (Excerpt)">
          <TextArea
            rows={3}
            placeholder="สรุปบทความ 1-2 ประโยค — แสดงในหน้า listing และ SEO description (ไม่เกิน 500 ตัวอักษร)"
            maxLength={500}
            showCount
            style={{ borderRadius: 10 }}
          />
        </Form.Item>

        {/* ✨ Content — ใช้ TextArea ก่อน / เตรียม slot สำหรับ Rich Text Editor */}
        <Form.Item
          name="content"
          label={
            <Flex align="center" justify="space-between" style={{ width: "100%" }}>
              <span>เนื้อหาบทความ</span>
              <Tooltip title="รองรับ Markdown — **bold**, *italic*, ## หัวข้อ, - รายการ">
                <Tag color="processing" style={{ cursor: "help", fontSize: 11 }}>Markdown</Tag>
              </Tooltip>
            </Flex>
          }
          rules={[{ required: true, message: "กรุณาใส่เนื้อหาบทความ" }]}
        >
          {/*
            🤖 AI INTEGRATION POINT:
            แทนที่ TextArea ด้วย Rich Text Editor (เช่น TipTap, Quill)
            และเพิ่มปุ่ม "Generate with AI" ที่เรียก /api/v1/admin/blogs/ai-generate
            เพื่อสร้างเนื้อหาจาก title + outline ที่ผู้ใช้กรอก
          */}
          <TextArea
            rows={16}
            placeholder={`## หัวข้อหลัก\n\nเนื้อหาย่อหน้าแรก...\n\n## หัวข้อรอง\n\n- ประเด็นที่ 1\n- ประเด็นที่ 2`}
            style={{ borderRadius: 10, fontFamily: "monospace", fontSize: 13 }}
          />
        </Form.Item>

      </Form>
    </Drawer>
  );
};

"use client";

// ✨ Blog Editor Drawer — สร้าง/แก้ไขบทความ + AI Assistant panel ในตัว
import {
  FileTextOutlined,
  LinkOutlined,
  PictureOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import {
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
  Tooltip,
  Typography,
  theme,
} from "antd";
import { useEffect } from "react";
import { useAdminBlogStore } from "../_state/blog-store";
import { AiAssistantPanel } from "./ai-assistant-panel";

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

// ✨ auto-generate slug จาก title
const toSlug = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 100);

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
          content: (editingBlog as AdminBlogItemWithContent).content ?? "",
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
    if (!isEdit) form.setFieldValue("slug", toSlug(e.target.value));
  };

  const handleFinish = async (values: FormValues) => {
    await submitBlog({ ...values, author_id: authorId, cover_image_url: values.cover_image_url || undefined });
  };

  // ✨ AI callbacks — ใส่ค่าที่ AI generate ลงใน form ทันที
  const handleApplyTitle = (title: string) => form.setFieldValue("title", title);
  const handleApplyExcerpt = (excerpt: string) => form.setFieldValue("excerpt", excerpt);
  const handleApplyContent = (content: string) => form.setFieldValue("content", content);
  const handleApplyTags = (tags: string[]) => form.setFieldValue("tags", tags);

  // ✨ ดึงค่าปัจจุบันใน form สำหรับส่งให้ AI
  const getCurrentValues = () => form.getFieldsValue(["title", "content", "category"]);

  return (
    <Drawer
      title={
        <Flex align="center" gap={10}>
          <Flex align="center" justify="center"
            style={{ width: 32, height: 32, borderRadius: 8, background: token.colorPrimaryBg, color: token.colorPrimary, fontSize: 16 }}
          >
            <FileTextOutlined />
          </Flex>
          <Text strong style={{ fontSize: 16 }}>{isEdit ? "แก้ไขบทความ" : "สร้างบทความใหม่"}</Text>
        </Flex>
      }
      placement="right"
      width={900}
      onClose={closeDrawer}
      open={isDrawerOpen}
      styles={{ body: { padding: 0 } }}
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
      <Row style={{ height: "100%" }}>
        {/* ─── ฝั่งซ้าย: Form ─── */}
        <Col xs={24} md={14}
          style={{
            padding: "20px 24px",
            borderRight: `1px solid ${token.colorBorderSecondary}`,
            overflowY: "auto",
            height: "100%",
          }}
        >
          <Form form={form} layout="vertical" onFinish={handleFinish} size="large">

            <Form.Item name="title" label="ชื่อบทความ" rules={[{ required: true, message: "กรุณาระบุชื่อบทความ" }]}>
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
                  <Tooltip title="ใช้ใน URL เช่น /blog/5-teaching-tips">
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
              <Select mode="tags" placeholder="พิมพ์แล้วกด Enter เพื่อเพิ่ม tag" style={{ borderRadius: 10 }} />
            </Form.Item>

            <Form.Item
              name="cover_image_url"
              label={<Flex align="center" gap={6}><PictureOutlined /><span>Cover Image URL</span></Flex>}
              rules={[{ type: "url", message: "กรุณาระบุ URL ที่ถูกต้อง" }]}
            >
              <Input placeholder="https://images.unsplash.com/..." style={{ borderRadius: 10 }} />
            </Form.Item>

            <Divider style={{ margin: "8px 0 20px" }} />

            <Form.Item name="excerpt" label="สรุปย่อ (Excerpt)">
              <TextArea
                rows={3}
                placeholder="สรุปบทความ 1-2 ประโยค — แสดงในหน้า listing และ SEO"
                maxLength={500}
                showCount
                style={{ borderRadius: 10 }}
              />
            </Form.Item>

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
              <TextArea
                rows={18}
                placeholder={`## หัวข้อหลัก\n\nเนื้อหาย่อหน้าแรก...\n\n## หัวข้อรอง\n\n- ประเด็นที่ 1\n- ประเด็นที่ 2`}
                style={{ borderRadius: 10, fontFamily: "monospace", fontSize: 13 }}
              />
            </Form.Item>

          </Form>
        </Col>

        {/* ─── ฝั่งขวา: AI Assistant ─── */}
        <Col xs={0} md={10}
          style={{
            padding: "20px 20px",
            background: token.colorBgLayout,
            overflowY: "auto",
            height: "100%",
          }}
        >
          <AiAssistantPanel
            onApplyTitle={handleApplyTitle}
            onApplyExcerpt={handleApplyExcerpt}
            onApplyContent={handleApplyContent}
            onApplyTags={handleApplyTags}
            currentTitle={getCurrentValues().title}
            currentContent={getCurrentValues().content}
            currentCategory={getCurrentValues().category}
          />
        </Col>
      </Row>
    </Drawer>
  );
};

// ✨ type สำหรับ form values
interface FormValues {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  category?: string;
  tags?: string[];
  status: "DRAFT" | "PUBLISHED";
}

// ✨ เพิ่ม content field ใน AdminBlogItem สำหรับ edit
interface AdminBlogItemWithContent {
  content?: string;
}

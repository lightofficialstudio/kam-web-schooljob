"use client";

// ✨ Blog Editor Drawer — สร้าง/แก้ไขบทความ + AI Assistant panel ในตัว
import {
  DeleteOutlined,
  FileTextOutlined,
  LinkOutlined,
  PictureOutlined,
  TagsOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd";
import {
  Button,
  Col,
  Divider,
  Drawer,
  Flex,
  Form,
  Image,
  Input,
  Row,
  Segmented,
  Select,
  Space,
  Tag,
  Tooltip,
  Typography,
  Upload,
  theme,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
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
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 100);

export const BlogEditorDrawer: React.FC<{ authorId?: string }> = ({
  authorId,
}) => {
  const { token } = theme.useToken();
  const {
    isDrawerOpen,
    editingBlog,
    isSubmitting,
    closeDrawer,
    submitBlog,
    showModal,
  } = useAdminBlogStore();
  const [form] = Form.useForm();
  const isEdit = !!editingBlog;

  // ✨ state สำหรับ cover image (upload vs url)
  const [coverMode, setCoverMode] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");

  // ✨ โหลดข้อมูลบทความเดิมเมื่อเปิด Drawer แก้ไข
  useEffect(() => {
    if (isDrawerOpen) {
      if (editingBlog) {
        const existingCover = editingBlog.coverImageUrl ?? "";
        form.setFieldsValue({
          title: editingBlog.title,
          slug: editingBlog.slug,
          content: (editingBlog as AdminBlogItemWithContent).content ?? "",
          excerpt: editingBlog.excerpt ?? "",
          cover_image_url: existingCover,
          category: editingBlog.category ?? undefined,
          tags: editingBlog.tags ?? [],
          status: editingBlog.status,
        });
        // ✨ ตรวจว่า cover เดิมเป็น uploaded URL หรือ external link
        if (existingCover) {
          setUploadedUrl(existingCover);
          setCoverMode("url");
        } else {
          setUploadedUrl("");
          setCoverMode("upload");
        }
      } else {
        form.resetFields();
        form.setFieldValue("status", "DRAFT");
        setUploadedUrl("");
        setCoverMode("upload");
      }
    }
  }, [isDrawerOpen, editingBlog]);

  // ✨ Auto-generate slug จาก title (เฉพาะตอนสร้างใหม่)
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEdit) form.setFieldValue("slug", toSlug(e.target.value));
  };

  const handleFinish = async (values: FormValues) => {
    // ✨ ถ้าเป็น upload mode ให้ใช้ URL ที่ upload แล้ว แทน form field
    const coverUrl =
      coverMode === "upload"
        ? uploadedUrl || undefined
        : values.cover_image_url || undefined;
    await submitBlog({
      ...values,
      author_id: authorId,
      cover_image_url: coverUrl,
    });
  };

  // ✨ Upload ไปยัง Supabase Storage bucket "blog-covers"
  const handleUpload = async (file: UploadFile) => {
    if (!authorId) {
      showModal({
        type: "confirm",
        title: "กรุณาเข้าสู่ระบบก่อน",
        description: "ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่",
        confirmLabel: "ตกลง",
      });
      return false;
    }
    const rawFile = file.originFileObj ?? (file as unknown as File);
    if (!rawFile) return false;

    // ✨ ตรวจ MIME + ขนาด (client-side pre-check)
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(rawFile.type)) {
      showModal({
        type: "error",
        title: "ประเภทไฟล์ไม่รองรับ",
        description: "รองรับเฉพาะ JPEG, PNG, WebP และ GIF เท่านั้น",
        errorDetails: `MIME: ${rawFile.type}`,
      });
      return false;
    }
    if (rawFile.size > 5 * 1024 * 1024) {
      showModal({
        type: "error",
        title: "ไฟล์ใหญ่เกินไป",
        description: "ขนาดไฟล์ต้องไม่เกิน 5 MB",
        errorDetails: `ขนาดไฟล์: ${(rawFile.size / 1024 / 1024).toFixed(2)} MB`,
      });
      return false;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", rawFile);
      formData.append("bucket", "blog-covers");
      formData.append("user_id", authorId);
      const res = await axios.post("/api/v1/storage/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url: string = res.data.data.url;
      setUploadedUrl(url);
      form.setFieldValue("cover_image_url", url);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดระหว่างอัปโหลด";
      showModal({
        type: "error",
        title: "อัปโหลดไม่สำเร็จ",
        description: msg,
        errorDetails: err,
      });
    } finally {
      setUploading(false);
    }
    return false; // ✨ return false เพื่อป้องกัน antd Upload default behavior
  };

  const handleRemoveCover = () => {
    setUploadedUrl("");
    form.setFieldValue("cover_image_url", "");
  };

  // ✨ AI callbacks — ใส่ค่าที่ AI generate ลงใน form ทันที
  const handleApplyTitle = (title: string) =>
    form.setFieldValue("title", title);
  const handleApplyExcerpt = (excerpt: string) =>
    form.setFieldValue("excerpt", excerpt);
  const handleApplyContent = (content: string) =>
    form.setFieldValue("content", content);
  const handleApplyTags = (tags: string[]) => form.setFieldValue("tags", tags);

  // ✨ ดึงค่าปัจจุบันใน form สำหรับส่งให้ AI
  const getCurrentValues = () =>
    form.getFieldsValue(["title", "content", "category"]);

  return (
    <Drawer
      title={
        <Flex align="center" gap={10}>
          <Flex
            align="center"
            justify="center"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: token.colorPrimaryBg,
              color: token.colorPrimary,
              fontSize: 16,
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
      size="large"
      style={{ minWidth: 900 }}
      onClose={closeDrawer}
      open={isDrawerOpen}
      forceRender
      styles={{ body: { padding: 0 } }}
      extra={
        <Space>
          <Button onClick={closeDrawer}>ยกเลิก</Button>
          <Button
            type="primary"
            loading={isSubmitting}
            onClick={() => form.submit()}
            style={{
              background: "linear-gradient(135deg, #0d8fd4 0%, #11b6f5 100%)",
              border: "none",
            }}
          >
            {isEdit ? "บันทึกการแก้ไข" : "สร้างบทความ"}
          </Button>
        </Space>
      }
    >
      <Row style={{ height: "100%" }}>
        {/* ─── ฝั่งซ้าย: Form ─── */}
        <Col
          xs={24}
          md={14}
          style={{
            padding: "20px 24px",
            borderRight: `1px solid ${token.colorBorderSecondary}`,
            overflowY: "auto",
            height: "100%",
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            size="large"
          >
            <Form.Item
              name="title"
              label="ชื่อบทความ"
              rules={[{ required: true, message: "กรุณาระบุชื่อบทความ" }]}
            >
              <Input
                prefix={
                  <FileTextOutlined
                    style={{ color: token.colorTextTertiary }}
                  />
                }
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
                    <LinkOutlined
                      style={{ color: token.colorTextTertiary, fontSize: 13 }}
                    />
                  </Tooltip>
                </Flex>
              }
              rules={[
                { required: true, message: "กรุณาระบุ slug" },
                {
                  pattern: /^[a-z0-9-]+$/,
                  message: "slug ต้องเป็น lowercase a-z, 0-9, และ - เท่านั้น",
                },
              ]}
            >
              <Input
                placeholder="5-teaching-tips"
                prefix={
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    /blog/
                  </Text>
                }
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
                <Form.Item
                  name="status"
                  label="สถานะ"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={[
                      {
                        value: "DRAFT",
                        label: <Tag color="default">Draft — ฉบับร่าง</Tag>,
                      },
                      {
                        value: "PUBLISHED",
                        label: (
                          <Tag color="success">Published — เผยแพร่แล้ว</Tag>
                        ),
                      },
                    ]}
                    style={{ borderRadius: 10 }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="tags"
              label={
                <Flex align="center" gap={6}>
                  <TagsOutlined />
                  <span>Tags</span>
                </Flex>
              }
            >
              <Select
                mode="tags"
                placeholder="พิมพ์แล้วกด Enter เพื่อเพิ่ม tag"
                style={{ borderRadius: 10 }}
              />
            </Form.Item>

            <Form.Item
              label={
                <Flex align="center" gap={6}>
                  <PictureOutlined />
                  <span>Cover Image</span>
                </Flex>
              }
            >
              {/* ✨ Toggle upload vs URL */}
              <Segmented
                size="small"
                value={coverMode}
                onChange={(v) => setCoverMode(v as "upload" | "url")}
                options={[
                  {
                    value: "upload",
                    icon: <UploadOutlined />,
                    label: "อัปโหลด",
                  },
                  { value: "url", icon: <LinkOutlined />, label: "ใส่ลิงก์" },
                ]}
                style={{ marginBottom: 10 }}
              />

              {coverMode === "upload" ? (
                <Flex vertical gap={8}>
                  {uploadedUrl ? (
                    /* ✨ Preview รูปที่ upload แล้ว */
                    <div
                      style={{ position: "relative", display: "inline-block" }}
                    >
                      <Image
                        src={uploadedUrl}
                        alt="Cover preview"
                        width="100%"
                        style={{
                          borderRadius: 10,
                          maxHeight: 180,
                          objectFit: "cover",
                        }}
                        preview={false}
                      />
                      <Button
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={handleRemoveCover}
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          borderRadius: 6,
                        }}
                      >
                        ลบรูป
                      </Button>
                    </div>
                  ) : (
                    <Upload.Dragger
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      showUploadList={false}
                      beforeUpload={(file) => {
                        handleUpload(file as unknown as UploadFile);
                        return false;
                      }}
                      disabled={uploading}
                      style={{ borderRadius: 10 }}
                    >
                      <Flex
                        vertical
                        align="center"
                        gap={6}
                        style={{ padding: "12px 0" }}
                      >
                        {uploading ? (
                          <Text type="secondary" style={{ fontSize: 13 }}>
                            ⏳ กำลังอัปโหลด...
                          </Text>
                        ) : (
                          <>
                            <PictureOutlined
                              style={{
                                fontSize: 24,
                                color: token.colorTextTertiary,
                              }}
                            />
                            <Text type="secondary" style={{ fontSize: 13 }}>
                              คลิกหรือลากไฟล์มาวาง
                            </Text>
                            <Text type="secondary" style={{ fontSize: 11 }}>
                              JPEG, PNG, WebP, GIF · สูงสุด 5 MB
                            </Text>
                          </>
                        )}
                      </Flex>
                    </Upload.Dragger>
                  )}
                </Flex>
              ) : (
                /* ✨ URL input */
                <Form.Item
                  name="cover_image_url"
                  noStyle
                  rules={[{ type: "url", message: "กรุณาระบุ URL ที่ถูกต้อง" }]}
                >
                  <Input
                    prefix={
                      <LinkOutlined
                        style={{ color: token.colorTextTertiary }}
                      />
                    }
                    placeholder="https://images.unsplash.com/..."
                    style={{ borderRadius: 10 }}
                    onChange={(e) => setUploadedUrl(e.target.value)}
                  />
                </Form.Item>
              )}
            </Form.Item>

            {/* ✨ hidden field เก็บ URL จริง (ใช้ทั้ง 2 mode) */}
            <Form.Item name="cover_image_url" hidden>
              <Input />
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
                <Flex
                  align="center"
                  justify="space-between"
                  style={{ width: "100%" }}
                >
                  <span>เนื้อหาบทความ</span>
                  <Tooltip title="รองรับ Markdown — **bold**, *italic*, ## หัวข้อ, - รายการ">
                    <Tag
                      color="processing"
                      style={{ cursor: "help", fontSize: 11 }}
                    >
                      Markdown
                    </Tag>
                  </Tooltip>
                </Flex>
              }
              rules={[{ required: true, message: "กรุณาใส่เนื้อหาบทความ" }]}
            >
              <TextArea
                rows={18}
                placeholder={`## หัวข้อหลัก\n\nเนื้อหาย่อหน้าแรก...\n\n## หัวข้อรอง\n\n- ประเด็นที่ 1\n- ประเด็นที่ 2`}
                style={{
                  borderRadius: 10,
                  fontFamily: "monospace",
                  fontSize: 13,
                }}
              />
            </Form.Item>
          </Form>
        </Col>

        {/* ─── ฝั่งขวา: AI Assistant ─── */}
        <Col
          xs={0}
          md={10}
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

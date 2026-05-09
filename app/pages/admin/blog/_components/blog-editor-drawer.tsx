"use client";

// ✨ Blog Editor Drawer — สร้าง/แก้ไขบทความ + AI Assistant panel ในตัว
import {
  DeleteOutlined,
  FileTextOutlined,
  LinkOutlined,
  PictureOutlined,
  TagsOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Drawer,
  Flex,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Segmented,
  Select,
  Slider,
  Space,
  Tag,
  Tooltip,
  Typography,
  Upload,
  theme,
} from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import type { Area } from "react-easy-crop";
import Cropper from "react-easy-crop";
import { useAdminBlogStore } from "../_state/blog-store";
import { AiAssistantPanel } from "./ai-assistant-panel";
import { SeoCheckerPanel } from "./seo-checker-panel";

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

// ✨ auto-generate slug จาก title — รองรับภาษาไทย + ASCII URL-safe
const toSlug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\u0E00-\u0E7F\s-]/g, "") // ✨ เก็บอักษรไทย + ASCII URL chars
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 300);

// ✨ ตัด canvas จาก crop area pixels → Blob (ใช้สำหรับ upload)
const getCroppedBlob = (imageSrc: string, cropArea: Area): Promise<Blob> =>
  new Promise((resolve, reject) => {
    const image = new window.Image();
    image.setAttribute("crossOrigin", "anonymous");
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = cropArea.width;
      canvas.height = cropArea.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("canvas ctx null"));
        return;
      }
      ctx.drawImage(
        image,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        cropArea.width,
        cropArea.height,
      );
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
        "image/jpeg",
        0.92,
      );
    };
    image.onerror = reject;
    image.src = imageSrc;
  });

// ─── CoverCropModal — Modal ตัดรูป Cover Image ───────────────────────────────
interface CoverCropModalProps {
  open: boolean;
  imageSrc: string;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
}

const CoverCropModal: React.FC<CoverCropModalProps> = ({
  open,
  imageSrc,
  onCancel,
  onConfirm,
}) => {
  const { token } = theme.useToken();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [confirming, setConfirming] = useState(false);

  // ✨ reset เมื่อเปิด modal ใหม่
  useEffect(() => {
    if (open) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedArea(null);
    }
  }, [open]);

  const handleConfirm = async () => {
    if (!croppedArea) return;
    setConfirming(true);
    try {
      const blob = await getCroppedBlob(imageSrc, croppedArea);
      onConfirm(blob);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <Modal
      open={open}
      title="✂️ ตัดรูปหน้าปก"
      onCancel={onCancel}
      width={700}
      footer={
        <Flex justify="flex-end" gap={8}>
          <Button onClick={onCancel}>ยกเลิก</Button>
          <Button
            type="primary"
            loading={confirming}
            onClick={handleConfirm}
            disabled={!croppedArea}
          >
            ยืนยันการตัด
          </Button>
        </Flex>
      }
      destroyOnClose
    >
      {/* ✨ Crop area — aspect ratio 16:9 (เหมาะ blog cover) */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 360,
          background: token.colorBgLayout,
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={16 / 9}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(_, areaPixels) => setCroppedArea(areaPixels)}
        />
      </div>
      {/* ✨ Zoom slider */}
      <Flex align="center" gap={12} style={{ marginTop: 16 }}>
        <span
          style={{
            fontSize: 12,
            color: token.colorTextTertiary,
            whiteSpace: "nowrap",
          }}
        >
          ซูม
        </span>
        <Slider
          min={1}
          max={3}
          step={0.05}
          value={zoom}
          onChange={(v) => setZoom(v)}
          style={{ flex: 1 }}
        />
      </Flex>
    </Modal>
  );
};

// ─── BlogPreviewModal — ดูตัวอย่างบทความก่อนบันทึก ─────────────────────────────
interface BlogPreviewModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
  excerpt?: string;
  coverUrl?: string;
  authorName?: string;
  tags?: string[];
  category?: string;
}

// ✨ ลบ HTML document boilerplate ออกก่อน render (เหมือน public blog page)
const cleanHtml = (html: string) =>
  html
    .replace(/<!DOCTYPE[^>]*>/gi, "")
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<\/?html[^>]*>/gi, "")
    .replace(/<\/?body[^>]*>/gi, "")
    .trim();

const BlogPreviewModal: React.FC<BlogPreviewModalProps> = ({
  open,
  onClose,
  title,
  content,
  excerpt,
  coverUrl,
  authorName,
  tags,
  category,
}) => {
  const { token } = theme.useToken();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="👁️ ดูตัวอย่างบทความ"
      width="min(92vw, 900px)"
      footer={
        <Flex justify="flex-end">
          <Button onClick={onClose}>ปิด</Button>
        </Flex>
      }
      styles={{
        body: { maxHeight: "80vh", overflowY: "auto", padding: "0 24px 24px" },
      }}
      destroyOnClose
    >
      {/* ✨ รูปหน้าปก */}
      {coverUrl && (
        <Image
          src={coverUrl}
          alt={title}
          width="100%"
          style={{
            borderRadius: 12,
            maxHeight: 320,
            objectFit: "cover",
            marginBottom: 20,
            display: "block",
          }}
          preview={false}
        />
      )}

      {/* ✨ Title */}
      <Typography.Title
        level={2}
        style={{ margin: "16px 0 8px", fontSize: 26 }}
      >
        {title || "(ยังไม่มีชื่อ)"}
      </Typography.Title>

      {/* ✨ Meta: category + tags */}
      <Flex gap={6} wrap="wrap" style={{ marginBottom: 10 }}>
        {category && <Tag color="blue">{category}</Tag>}
        {tags?.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </Flex>

      {/* ✨ Author name */}
      {authorName && (
        <Flex align="center" gap={6} style={{ marginBottom: 14 }}>
          <UserOutlined style={{ color: token.colorTextTertiary }} />
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            {authorName}
          </Typography.Text>
        </Flex>
      )}

      {/* ✨ Excerpt */}
      {excerpt && (
        <div
          style={{
            padding: "12px 16px",
            background: token.colorFillSecondary,
            borderLeft: `3px solid ${token.colorPrimary}`,
            borderRadius: 6,
            marginBottom: 20,
            fontSize: 15,
            fontStyle: "italic",
            color: token.colorTextSecondary,
          }}
        >
          {excerpt}
        </div>
      )}

      <Divider style={{ margin: "0 0 16px" }} />

      {/* ✨ เนื้อหาบทความ — render HTML + ใช้ blog-content class เหมือนหน้า public */}
      <div
        className="blog-content"
        style={{ fontSize: 16, lineHeight: 1.9, color: token.colorText }}
        dangerouslySetInnerHTML={{ __html: cleanHtml(content) }}
      />
    </Modal>
  );
};

// ✨ type สำหรับ showModal callback ที่ส่งมาจาก store
type ShowModalFn = (opts: {
  type: "success" | "error" | "confirm" | "delete";
  title: string;
  description?: string;
  errorDetails?: unknown;
}) => void;

// ─── HtmlEditor — Custom Form Control ───────────────────────────────────────
// ✨ รับ value/onChange จาก Form.Item โดยตรง (Ant Design custom field pattern)
interface HtmlEditorProps {
  value?: string;
  onChange?: (val: string) => void;
  authorId?: string;
  showModal?: ShowModalFn;
}

const HtmlEditor: React.FC<HtmlEditorProps> = ({
  value = "",
  onChange,
  authorId,
  showModal,
}) => {
  const { token } = theme.useToken();
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [imgLoading, setImgLoading] = useState(false);
  // ✨ ติดตาม cursor position ใน textarea เพื่อแทรก HTML ณ ตำแหน่งที่ถูกต้อง
  const cursorPos = useRef({ start: 0, end: 0 });

  const trackCursor: React.ReactEventHandler<HTMLTextAreaElement> = (e) => {
    const ta = e.currentTarget;
    cursorPos.current = { start: ta.selectionStart, end: ta.selectionEnd };
  };

  // ✨ แทรก HTML snippet ณ cursor — รองรับ selected text เป็น inner content
  const insert = (before: string, after = "", placeholder = "ข้อความ") => {
    const { start, end } = cursorPos.current;
    const selected = value.slice(start, end);
    const html = `${before}${selected || placeholder}${after}`;
    onChange?.(value.slice(0, start) + html + value.slice(end));
  };

  // ✨ Upload รูปภาพในบทความ → บักเก็ต blog-images
  const handleImgUpload = async (file: File) => {
    if (!authorId) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      showModal?.({
        type: "error",
        title: "ประเภทไฟล์ไม่รองรับ",
        description: "รองรับ JPEG, PNG, WebP, GIF",
      });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showModal?.({
        type: "error",
        title: "ไฟล์ใหญ่เกินไป",
        description: "ขนาดสูงสุด 10 MB",
      });
      return;
    }
    setImgLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("bucket", "blog-images");
      fd.append("user_id", authorId);
      const res = await axios.post("/api/v1/storage/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data.data.url as string;
      // ✨ แทรก img tag ณ cursor position
      const { start } = cursorPos.current;
      const html = `<img src="${url}" alt="รูปภาพ" style="max-width:100%;border-radius:8px;" />`;
      onChange?.(value.slice(0, start) + html + value.slice(start));
    } catch {
      showModal?.({
        type: "error",
        title: "อัปโหลดรูปไม่สำเร็จ",
        description: "กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setImgLoading(false);
    }
  };

  // ✨ ปุ่ม toolbar สำหรับแทรก HTML tag พื้นฐาน
  const TOOLBAR = [
    { label: "B", before: "<strong>", after: "</strong>" },
    { label: "I", before: "<em>", after: "</em>" },
    { label: "H2", before: "<h2>", after: "</h2>" },
    { label: "H3", before: "<h3>", after: "</h3>" },
    { label: "P", before: "<p>", after: "</p>" },
    {
      label: "UL",
      before: "<ul>\n  <li>",
      after: "</li>\n</ul>",
      placeholder: "รายการ",
    },
    {
      label: "OL",
      before: "<ol>\n  <li>",
      after: "</li>\n</ol>",
      placeholder: "รายการ",
    },
    { label: "Link", before: '<a href="URL">', after: "</a>" },
    { label: "Code", before: "<code>", after: "</code>" },
  ];

  return (
    <Flex vertical gap={0}>
      {/* ✨ Toggle Edit / Preview */}
      <Flex align="center" justify="flex-end" style={{ marginBottom: 6 }}>
        <Segmented
          size="small"
          value={tab}
          onChange={(v) => setTab(v as "edit" | "preview")}
          options={[
            { value: "edit", label: "✏️ แก้ไข HTML" },
            { value: "preview", label: "👁️ ดูตัวอย่าง" },
          ]}
        />
      </Flex>

      {tab === "edit" ? (
        <>
          {/* ✨ HTML Toolbar */}
          <Flex
            wrap="wrap"
            align="center"
            gap={4}
            style={{
              padding: "6px 10px",
              background: token.colorFillSecondary,
              border: `1px solid ${token.colorBorder}`,
              borderBottom: "none",
              borderRadius: "10px 10px 0 0",
            }}
          >
            {TOOLBAR.map((t) => (
              <Button
                key={t.label}
                size="small"
                style={{
                  fontFamily: "monospace",
                  fontWeight: t.label === "B" ? 700 : 400,
                }}
                onClick={() => insert(t.before, t.after, t.placeholder)}
              >
                {t.label}
              </Button>
            ))}
            <Divider type="vertical" style={{ margin: "0 2px", height: 20 }} />
            {/* ✨ ปุ่มแทรกรูปภาพในเนื้อหาบทความ */}
            <Upload
              accept="image/jpeg,image/png,image/webp,image/gif"
              showUploadList={false}
              beforeUpload={(file) => {
                handleImgUpload(file);
                return false;
              }}
              disabled={imgLoading || !authorId}
            >
              <Button
                size="small"
                icon={<PictureOutlined />}
                loading={imgLoading}
                disabled={!authorId}
              >
                {imgLoading ? "กำลังอัปโหลด..." : "แทรกรูป"}
              </Button>
            </Upload>
          </Flex>

          {/* ✨ HTML TextArea */}
          <TextArea
            value={value}
            onChange={(e) => {
              cursorPos.current = {
                start: e.target.selectionStart,
                end: e.target.selectionEnd,
              };
              onChange?.(e.target.value);
            }}
            onSelect={trackCursor}
            onKeyUp={trackCursor}
            onMouseUp={trackCursor}
            rows={16}
            placeholder={`<h2>หัวข้อหลัก</h2>\n<p>เนื้อหาย่อหน้าแรก...</p>\n\n<h3>หัวข้อรอง</h3>\n<ul>\n  <li>ประเด็นที่ 1</li>\n  <li>ประเด็นที่ 2</li>\n</ul>`}
            rows={22}
            style={{
              borderRadius: "0 0 10px 10px",
              fontFamily: "monospace",
              fontSize: 13,
            }}
          />
        </>
      ) : (
        /* ✨ HTML Preview — render HTML ตรงๆ เหมือนหน้า blog จริง */
        <div
          dangerouslySetInnerHTML={{ __html: value }}
          style={{
            minHeight: 400,
            padding: "16px 20px",
            border: `1px solid ${token.colorBorder}`,
            borderRadius: 10,
            overflow: "auto",
            background: token.colorBgContainer,
            lineHeight: 1.8,
            fontSize: 15,
          }}
        />
      )}
    </Flex>
  );
};

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

  // ✨ state สำหรับ crop modal
  const [cropOpen, setCropOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string>("");

  // ✨ state สำหรับ preview modal
  const [previewOpen, setPreviewOpen] = useState(false);

  // ✨ โหลดข้อมูลบทความเดิมเมื่อเปิด Drawer แก้ไข
  useEffect(() => {
    if (isDrawerOpen) {
      if (editingBlog) {
        const existingCover = editingBlog.coverImageUrl ?? "";
        form.setFieldsValue({
          title: editingBlog.title,
          slug: editingBlog.slug,
          content: editingBlog.content ?? "",
          excerpt: editingBlog.excerpt ?? "",
          cover_image_url: existingCover,
          category: editingBlog.category ?? undefined,
          tags: editingBlog.tags ?? [],
          status: editingBlog.status,
          author_name:
            (editingBlog as AdminBlogItemWithAuthorName).authorName ?? "",
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

  // ✨ Upload ไปยัง Supabase Storage bucket "blog-covers" (รับ File หรือ Blob จาก crop)
  const handleUpload = async (fileOrBlob: File | Blob) => {
    if (!authorId) return;
    setUploading(true);
    try {
      const formData = new FormData();
      const fileName =
        fileOrBlob instanceof File
          ? fileOrBlob.name
          : `cover_${Date.now()}.jpg`;
      formData.append("file", fileOrBlob, fileName);
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
  };

  // ✨ เมื่อผู้ใช้เลือกไฟล์ → ตรวจสอบ MIME + size → เปิด crop modal
  const handleFileSelect = (rawFile: File) => {
    if (!authorId) {
      showModal({
        type: "confirm",
        title: "กรุณาเข้าสู่ระบบก่อน",
        description: "ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่",
        confirmLabel: "ตกลง",
      });
      return;
    }
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(rawFile.type)) {
      showModal({
        type: "error",
        title: "ประเภทไฟล์ไม่รองรับ",
        description: "รองรับเฉพาะ JPEG, PNG, WebP และ GIF เท่านั้น",
        errorDetails: `MIME: ${rawFile.type}`,
      });
      return;
    }
    if (rawFile.size > 20 * 1024 * 1024) {
      showModal({
        type: "error",
        title: "ไฟล์ใหญ่เกินไป",
        description: "ขนาดไฟล์ต้องไม่เกิน 20 MB",
        errorDetails: `ขนาดไฟล์: ${(rawFile.size / 1024 / 1024).toFixed(2)} MB`,
      });
      return;
    }
    // ✨ อ่าน file เป็น data URL แล้วเปิด crop modal
    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result as string);
      setCropOpen(true);
    };
    reader.readAsDataURL(rawFile);
  };

  // ✨ เมื่อยืนยันการ crop → upload blob ที่ตัดแล้ว
  const handleCropConfirm = async (blob: Blob) => {
    setCropOpen(false);
    await handleUpload(blob);
  };

  const handleRemoveCover = () => {
    setUploadedUrl("");
    form.setFieldValue("cover_image_url", "");
  };

  // ✨ watch form values แบบ real-time เพื่อส่งให้ SEO Checker
  const watchedTitle = Form.useWatch("title", form) as string | undefined;
  const watchedExcerpt = Form.useWatch("excerpt", form) as string | undefined;
  const watchedSlug = Form.useWatch("slug", form) as string | undefined;
  const watchedContent = Form.useWatch("content", form) as string | undefined;

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
      onClose={closeDrawer}
      open={isDrawerOpen}
      forceRender
      styles={{
        wrapper: { width: "min(96vw, 1600px)" },
        body: { padding: 0, overflow: "hidden" },
      }}
      extra={
        <Space>
          <Button onClick={closeDrawer}>ยกเลิก</Button>
          {/* ✨ ปุ่มดูตัวอย่างก่อนบันทึก */}
          <Button
            icon={<FileTextOutlined />}
            onClick={() => setPreviewOpen(true)}
          >
            ดูตัวอย่าง
          </Button>
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
      <Row style={{ height: "100%", overflow: "hidden", flexWrap: "nowrap" }}>
        {/* ─── ฝั่งซ้าย: Form ─── */}
        <Col
          flex="0 0 65%"
          style={{
            padding: "20px 24px",
            borderRight: `1px solid ${token.colorBorderSecondary}`,
            overflowY: "auto",
            height: "100%",
            minWidth: 0,
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
                  // ✨ รองรับภาษาไทย + ASCII URL-safe chars
                  pattern: /^[a-z0-9\u0E00-\u0E7F-]+$/,
                  message:
                    "slug ต้องเป็น a-z, 0-9, -, หรือตัวอักษรภาษาไทยเท่านั้น",
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
              name="author_name"
              label={
                <Flex align="center" gap={6}>
                  <UserOutlined />
                  <span>ชื่อนักเขียน</span>
                </Flex>
              }
              extra="ถ้าเว้นว่าง จะใช้ชื่อจากโปรไฟล์ผู้สร้างแทน"
            >
              <Input
                prefix={
                  <UserOutlined style={{ color: token.colorTextTertiary }} />
                }
                placeholder="เช่น ผู้ช่วยศาสตราจารย์ อ.องค์อินทร์"
                allowClear
                maxLength={100}
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
                        handleFileSelect(file); // ✨ เปิด crop modal แทน upload ตรง
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

            {/* ✨ Content editor — HTML พร้อม toolbar + preview + image upload */}
            <Form.Item
              name="content"
              label="เนื้อหาบทความ"
              rules={[{ required: true, message: "กรุณาใส่เนื้อหาบทความ" }]}
            >
              <HtmlEditor authorId={authorId} showModal={showModal} />
            </Form.Item>

            {/* ✨ Reading Time + Word Count badge — คำนวณ real-time ขณะพิมพ์ */}
            {(() => {
              const raw = (watchedContent ?? "").trim();
              // ✨ นับคำ: แยกด้วย whitespace และ zero-width chars, กรองบรรทัดว่าง
              const wordCount =
                raw.length === 0
                  ? 0
                  : raw.split(/[\s\u200b\u3000\n\r]+/).filter(Boolean).length;
              // ✨ เฉลี่ย 200 คำ/นาที สำหรับภาษาไทย (ภาษาอังกฤษ ~250)
              const minutes = Math.max(1, Math.ceil(wordCount / 200));
              return wordCount > 0 ? (
                <div
                  style={{
                    marginTop: -16,
                    marginBottom: 20,
                    textAlign: "right",
                  }}
                >
                  <Text
                    type="secondary"
                    style={{
                      fontSize: 12,
                      background: token.colorFillSecondary,
                      padding: "2px 10px",
                      borderRadius: 20,
                      display: "inline-block",
                    }}
                  >
                    ~{minutes} min read · {wordCount.toLocaleString()} คำ
                  </Text>
                </div>
              ) : null;
            })()}
          </Form>
        </Col>

        {/* ─── ฝั่งขวา: AI Assistant ─── */}
        <Col
          flex="0 0 35%"
          style={{
            padding: "20px",
            background: token.colorBgLayout,
            overflowY: "auto",
            height: "100%",
            minWidth: 0,
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

          {/* ─── SEO Checker — แสดงใต้ AI Assistant ─── */}
          <Divider style={{ margin: "20px 0 16px" }} />
          <SeoCheckerPanel
            title={watchedTitle}
            excerpt={watchedExcerpt}
            slug={watchedSlug}
          />
        </Col>
      </Row>

      {/* ✨ Crop Modal — เปิดเมื่อผู้ใช้เลือกไฟล์ cover */}
      <CoverCropModal
        open={cropOpen}
        imageSrc={cropImageSrc}
        onCancel={() => setCropOpen(false)}
        onConfirm={handleCropConfirm}
      />

      {/* ✨ Preview Modal — ดูตัวอย่างบทความก่อนบันทึก */}
      {previewOpen &&
        (() => {
          const vals = form.getFieldsValue();
          const previewCover =
            coverMode === "upload" ? uploadedUrl : (vals.cover_image_url ?? "");
          return (
            <BlogPreviewModal
              open={previewOpen}
              onClose={() => setPreviewOpen(false)}
              title={vals.title ?? ""}
              content={vals.content ?? ""}
              excerpt={vals.excerpt}
              coverUrl={previewCover || undefined}
              authorName={vals.author_name}
              tags={vals.tags}
              category={vals.category}
            />
          );
        })()}
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
  author_name?: string;
}

// ✨ extend AdminBlogItem เพื่อรองรับ authorName override จาก full blog fetch
interface AdminBlogItemWithAuthorName {
  authorName?: string | null;
}

"use client";

import { useTheme } from "@/app/contexts/theme-context";
import { useLandingStore } from "@/app/pages/landing/_state/landing-store";
import {
  GlobalOutlined,
  SearchOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import {
  theme as antTheme,
  Button,
  Cascader,
  Col,
  Flex,
  Input,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const JOB_CATEGORIES = [
  {
    value: "academic",
    label: "การสอน / วิชาการ",
    children: [
      { value: "math", label: "ครูคณิตศาสตร์" },
      { value: "english", label: "ครูภาษาอังกฤษ" },
      { value: "thai", label: "ครูภาษาไทย" },
      { value: "science", label: "ครูวิทยาศาสตร์" },
      { value: "early-childhood", label: "ครูปฐมวัย" },
    ],
  },
  {
    value: "support",
    label: "ธุรการ / สนับสนุน",
    children: [
      { value: "admin", label: "ธุรการโรงเรียน" },
      { value: "hr", label: "ฝ่ายบุคคล (HR)" },
      { value: "finance", label: "การเงิน / บัญชี" },
      { value: "it-support", label: "IT Support" },
    ],
  },
  {
    value: "construction",
    label: "งานก่อสร้างสถาปัตยกรรม",
    children: [
      { value: "const-tech", label: "งานช่างก่อสร้าง/อาคาร" },
      { value: "proj-mgmt", label: "งานบริหารโครงการ" },
      { value: "arch", label: "งานสถาปนิก" },
    ],
  },
];

const POPULAR_TAGS = ["ครูภาษาอังกฤษ", "ครูคณิตศาสตร์", "ธุรการโรงเรียน", "ครูปฐมวัย"];

// Hero Section พร้อม Search Bar สำหรับ Landing Page
export default function HeroSection() {
  const router = useRouter();
  const { mode } = useTheme();
  const { token } = antTheme.useToken();
  const isDark = mode === "dark";

  const { searchParams, setSearchParam, resetSearchParams, buildQueryString } =
    useLandingStore();

  // นำทางไปยังหน้า Job พร้อม Query String
  const handleSearch = () => {
    router.push(`/pages/job?${buildQueryString()}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: "calc(64px + 48px)",
        paddingBottom: "48px",
        paddingLeft: "24px",
        paddingRight: "24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        background: isDark
          ? "#0a0f1e"
          : "#f8fbff",
      }}
    >
      {/* ── Grid / Dot pattern overlay ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: isDark
            ? "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)"
            : "radial-gradient(circle, rgba(17,182,245,0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 70%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 70%, transparent 100%)",
        }}
      />

      {/* ── Gradient fade top & bottom ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isDark
            ? "linear-gradient(180deg, #0a0f1e 0%, transparent 25%, transparent 75%, #0a0f1e 100%)"
            : "linear-gradient(180deg, #f8fbff 0%, transparent 20%, transparent 80%, #f8fbff 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Glow blob — primary top-left ── */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          left: "-10%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(17,182,245,0.18) 0%, transparent 65%)"
            : "radial-gradient(circle, rgba(17,182,245,0.22) 0%, transparent 65%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* ── Glow blob — purple bottom-right ── */}
      <div
        style={{
          position: "absolute",
          bottom: "0%",
          right: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(99,102,241,0.16) 0%, transparent 65%)"
            : "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 65%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* ── Glow blob — teal center ── */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "300px",
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(ellipse, rgba(17,182,245,0.07) 0%, transparent 70%)"
            : "radial-gradient(ellipse, rgba(17,182,245,0.10) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "900px", width: "100%" }}>
        {/* Badge pill */}
        <Flex justify="center" style={{ marginBottom: 12 }}>
          <Tag
            style={{
              fontWeight: 600,
              fontSize: 12,
              padding: "4px 16px",
              borderRadius: "100px",
              backgroundColor: `${token.colorPrimary}18`,
              border: `1px solid ${token.colorPrimary}50`,
              color: token.colorPrimary,
              letterSpacing: "0.3px",
            }}
          >
            ✦ สมัครฟรีสำหรับคนหางาน
          </Tag>
        </Flex>

        <Title
          style={{
            fontSize: "clamp(36px, 5vw, 52px)",
            fontWeight: 700,
            marginBottom: 10,
            lineHeight: 1.2,
            letterSpacing: "-0.5px",
          }}
        >
          ศูนย์รวมงานสายการศึกษา{" "}
          <span style={{ color: token.colorPrimary }}>จากโรงเรียนทั่วประเทศ</span>
        </Title>

        <Paragraph
          style={{
            fontSize: 16,
            maxWidth: 580,
            margin: "0 auto 28px",
            color: token.colorTextSecondary,
            lineHeight: 1.7,
          }}
        >
          เชื่อมต่อโรงเรียนชั้นนำกับบุคลากรคุณภาพ ไม่ว่าจะเป็นครู อาจารย์
          ติวเตอร์ หรือบุคลากรทางการศึกษา ค้นหาและสมัครงานได้ในที่เดียว
        </Paragraph>

        {/* Search Card */}
        <div
          style={{
            width: "100%",
            background: token.colorBgContainer,
            boxShadow: isDark
              ? "0 20px 60px rgba(0,0,0,0.5)"
              : "0 20px 60px rgba(17,182,245,0.10), 0 4px 20px rgba(0,0,0,0.06)",
            borderRadius: "20px",
            padding: "20px",
            border: `1px solid ${isDark ? token.colorBorder : token.colorBorderSecondary}`,
          }}
        >
          {/* Main Search Row */}
          <Row gutter={[0, 0]} align="middle">
            {/* ช่องค้นหาคีย์เวิร์ด */}
            <Col xs={24} lg={8}>
              <Flex vertical gap={4} style={{ padding: "0 12px" }}>
                <Text
                  strong
                  style={{ fontSize: "14px", color: isDark ? "#A0AEC0" : "#8c8c8c" }}
                >
                  ค้นหางานที่สนใจ
                </Text>
                <Input
                  prefix={<SearchOutlined style={{ color: token.colorPrimary }} />}
                  placeholder="ตำแหน่งงาน, วิชาเอก หรือโรงเรียน"
                  value={searchParams.keyword}
                  onChange={(e) => setSearchParam("keyword", e.target.value)}
                  size="large"
                  style={{
                    borderRadius: "12px",
                    backgroundColor: isDark ? "#1A202C" : "#f5f5f5",
                    border: isDark
                      ? `1px solid ${token.colorBorder}`
                      : "1px solid #e8e8e8",
                  }}
                />
              </Flex>
            </Col>

            {/* ตัวเลือกหมวดหมู่งาน */}
            <Col xs={24} lg={9}>
              <Flex vertical gap={4} style={{ padding: "0 12px" }}>
                <Text
                  strong
                  style={{ fontSize: "14px", color: isDark ? "#A0AEC0" : "#8c8c8c" }}
                >
                  ตำแหน่งงาน
                </Text>
                <Cascader
                  options={JOB_CATEGORIES}
                  multiple
                  maxTagCount={1}
                  value={searchParams.category}
                  onChange={(value) =>
                    setSearchParam("category", value as string[][])
                  }
                  maxTagPlaceholder={(omittedValues) => (
                    <Tag color="processing" style={{ borderRadius: "6px" }}>
                      +{omittedValues.length} ประเภท
                    </Tag>
                  )}
                  placeholder="เลือกตำแหน่งที่สนใจ"
                  style={{ width: "100%" }}
                  size="large"
                  showCheckedStrategy={Cascader.SHOW_CHILD}
                  suffixIcon={
                    <SolutionOutlined style={{ color: token.colorPrimary }} />
                  }
                  expandTrigger="click"
                />
              </Flex>
            </Col>

            {/* ตัวเลือกสถานที่ */}
            <Col xs={24} lg={7}>
              <Flex vertical gap={4} style={{ padding: "0 12px" }}>
                <Text
                  strong
                  style={{ fontSize: "14px", color: isDark ? "#A0AEC0" : "#8c8c8c" }}
                >
                  สถานที่
                </Text>
                <Select
                  placeholder="ทุกจังหวัด"
                  style={{ width: "100%" }}
                  size="large"
                  value={searchParams.location}
                  onChange={(value) => setSearchParam("location", value)}
                  suffixIcon={
                    <GlobalOutlined style={{ color: token.colorPrimary }} />
                  }
                >
                  <Option value="bkk">กรุงเทพมหานคร</Option>
                  <Option value="center">ภาคกลาง</Option>
                  <Option value="north">ภาคเหนือ</Option>
                  <Option value="east">ภาคตะวันออก</Option>
                </Select>
              </Flex>
            </Col>
          </Row>

          {/* Advanced Filters Row */}
          <div
            style={{
              marginTop: "12px",
              padding: "16px 12px 0",
              borderTop: `1px solid ${token.colorBorderSecondary || token.colorBorder}`,
            }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={12} md={6} lg={5}>
                <Select
                  placeholder="รูปแบบการจ้างงาน"
                  style={{ width: "100%" }}
                  size="large"
                  allowClear
                  value={searchParams.employmentType}
                  onChange={(value) => setSearchParam("employmentType", value)}
                >
                  <Option value="fulltime">งานเต็มเวลา (Full-time)</Option>
                  <Option value="parttime">พาร์ทไทม์ (Part-time)</Option>
                  <Option value="contract">สัญญาจ้าง / อัตราจ้าง</Option>
                </Select>
              </Col>
              <Col xs={12} md={6} lg={5}>
                <Select
                  placeholder="ใบประกอบวิชาชีพ"
                  style={{ width: "100%" }}
                  size="large"
                  allowClear
                  value={searchParams.license}
                  onChange={(value) => setSearchParam("license", value)}
                >
                  <Option value="required">ต้องมีใบประกอบฯ</Option>
                  <Option value="not-required">ไม่ต้องมีใบประกอบฯ</Option>
                  <Option value="pending">อยู่ระหว่างขอรับใบประกอบฯ</Option>
                </Select>
              </Col>
              <Col xs={12} md={6} lg={5}>
                <Select
                  placeholder="ช่วงเงินเดือน"
                  style={{ width: "100%" }}
                  size="large"
                  allowClear
                  value={searchParams.salaryRange}
                  onChange={(value) => setSearchParam("salaryRange", value)}
                >
                  <Option value="0-15000">ต่ำกว่า 15,000</Option>
                  <Option value="15000-25000">15,000 - 25,000</Option>
                  <Option value="25000-40000">25,000 - 40,000</Option>
                  <Option value="40000+">40,000 ขึ้นไป</Option>
                </Select>
              </Col>
              <Col xs={12} md={6} lg={5}>
                <Select
                  placeholder="ประกาศเมื่อ"
                  style={{ width: "100%" }}
                  size="large"
                  allowClear
                  value={searchParams.postedAt}
                  onChange={(value) => setSearchParam("postedAt", value)}
                >
                  <Option value="today">วันนี้</Option>
                  <Option value="3days">3 วันที่ผ่านมา</Option>
                  <Option value="7days">7 วันที่ผ่านมา</Option>
                  <Option value="30days">30 วันที่ผ่านมา</Option>
                </Select>
              </Col>
              <Col xs={24} lg={4}>
                <Flex justify="flex-end">
                  <Button
                    type="link"
                    block
                    style={{ color: "#8c8c8c" }}
                    onClick={resetSearchParams}
                  >
                    รีเซ็ตเงื่อนไข
                  </Button>
                </Flex>
              </Col>
            </Row>
          </div>

          {/* Search Button */}
          <div style={{ marginTop: "16px", padding: "0 4px" }}>
            <Button
              type="primary"
              block
              size="large"
              icon={<SearchOutlined style={{ fontSize: "18px" }} />}
              onClick={handleSearch}
              style={{
                height: "52px",
                borderRadius: "16px",
                fontWeight: 600,
                fontSize: "16px",
                boxShadow: "0 8px 20px rgba(24, 144, 255, 0.25)",
              }}
            >
              ค้นหาตำแหน่งงาน
            </Button>
          </div>
        </div>

        {/* Popular Tags */}
        <Space
          size={8}
          wrap
          style={{ marginTop: "16px", justifyContent: "center" }}
        >
          <Text type="secondary">ตำแหน่งยอดนิยม: </Text>
          {POPULAR_TAGS.map((tag) => (
            <Tag
              key={tag}
              style={{
                cursor: "pointer",
                padding: "4px 12px",
                borderRadius: "6px",
                backgroundColor: isDark ? "#2D3748" : "#fff",
                border: isDark
                  ? `1px solid ${token.colorBorder}`
                  : "1px solid #d9d9d9",
              }}
            >
              {tag}
            </Tag>
          ))}
        </Space>
      </div>
    </div>
  );
}

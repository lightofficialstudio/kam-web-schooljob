"use client";

import { useTheme } from "@/app/contexts/theme-context";
import {
  GlobalOutlined,
  RocketOutlined,
  SearchOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import {
  theme as antTheme,
  Badge,
  Button,
  Card,
  Cascader,
  Col,
  Input,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import { useState } from "react";

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

export default function LandingPage() {
  const { mode, toggleTheme } = useTheme();
  const { token } = antTheme.useToken();
  const isDark = mode === "dark";

  const [searchParams, setSearchParams] = useState({
    keyword: "",
    category: [] as string[][],
    location: null as string | null,
    employmentType: null as string | null,
    license: null as string | null,
    salaryRange: null as string | null,
    postedAt: null as string | null,
  });

  const handleReset = () => {
    setSearchParams({
      keyword: "",
      category: [],
      location: null,
      employmentType: null,
      license: null,
      salaryRange: null,
      postedAt: null,
    });
  };

  return (
    <>
      {/* 🚀 Hero Section - The "One-Stop" Job Portal for Education */}
      <div
        style={{
          padding: "160px 24px 80px 24px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          background: isDark
            ? `linear-gradient(180deg, #1A202C 0%, ${token.colorBgBase} 100%)`
            : "linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%)",
        }}
      >
        {/* Decorative elements - Minimal Abstract using Local SVG */}
        <div
          style={{
            position: "absolute",
            top: "12%",
            right: "5%",
            width: "320px",
            opacity: 0.8,
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <img
            src="/images/flat/undraw_web-search_7oif.svg"
            alt="Search Illustration"
            style={{
              width: "100%",
              filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.05))",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "-5%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(24,144,255,0.1) 0%, rgba(255,255,255,0) 70%)",
            filter: "blur(100px)",
          }}
        />

        <div
          style={{
            zIndex: 1,
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <Badge
            count="สมัครฟรีสำหรับคนหางาน"
            style={{
              fontWeight: 600,
              padding: "0 12px",
              height: "32px",
              lineHeight: "32px",
              borderRadius: "100px",
              marginBottom: "24px",
            }}
          />

          <Title
            style={{
              fontSize: "56px",
              fontWeight: 800,
              marginBottom: "16px",
              lineHeight: 1.2,
            }}
          >
            ศูนย์รวมงานสายการศึกษา <br />
            <span>อันดับ 1 ในประเทศไทย</span>
          </Title>

          <Paragraph
            style={{
              fontSize: "18px",
              maxWidth: "800px",
              margin: "0 auto 40px auto",
            }}
          >
            เชื่อมต่อโรงเรียนชั้นนำกับบุคลาการคุณภาพ ไม่ว่าจะเป็นงานครู,
            อาจารย์, ติวเตอร์ หรือเจ้าหน้าที่สนับสนุน ครบจบในที่เดียว
          </Paragraph>

          {/* 🔍 Premium Search Bar - Redesigned for better UX */}
          <div
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
              background: token.colorBgContainer,
              boxShadow: isDark
                ? "0 30px 60px rgba(0, 0, 0, 0.4)"
                : "0 30px 60px rgba(0, 0, 0, 0.12)",
              borderRadius: "32px",
              padding: "24px",
              border: isDark ? `1px solid ${token.colorBorder}` : "none",
            }}
          >
            <Row gutter={[0, 0]} align="middle">
              {/* 💻 Search Input */}
              <Col xs={24} lg={8}>
                <div style={{ padding: "0 24px", textAlign: "left" }}>
                  <Text
                    strong
                    style={{
                      fontSize: "14px",
                      color: isDark ? "#A0AEC0" : "#8c8c8c",
                    }}
                  >
                    ค้นหางานที่คุณสนใจ
                  </Text>
                  <Input
                    prefix={
                      <SearchOutlined style={{ color: token.colorPrimary }} />
                    }
                    placeholder="ตำแหน่งงาน, วิชาเอก หรือโรงเรียน"
                    value={searchParams.keyword}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        keyword: e.target.value,
                      })
                    }
                    style={{
                      fontSize: "16px",
                      padding: "12px 16px",
                      fontWeight: "500",
                      borderRadius: "12px",
                      border: isDark
                        ? `1px solid ${token.colorBorder}`
                        : "1px solid #e8e8e8",
                      backgroundColor: isDark ? "#1A202C" : "#f5f5f5",
                    }}
                  />
                </div>
              </Col>

              {/* 📂 Job Categories (Cascader) */}
              <Col xs={24} lg={9}>
                <div style={{ padding: "0 24px", textAlign: "left" }}>
                  <Text
                    strong
                    style={{
                      fontSize: "14px",
                      color: isDark ? "#A0AEC0" : "#8c8c8c",
                    }}
                  >
                    ประเภทงาน
                  </Text>
                  <Cascader
                    options={JOB_CATEGORIES}
                    multiple
                    maxTagCount={1}
                    value={searchParams.category}
                    onChange={(value) =>
                      setSearchParams({
                        ...searchParams,
                        category: value as string[][],
                      })
                    }
                    maxTagPlaceholder={(omittedValues) => (
                      <Tag color="processing" style={{ borderRadius: "6px" }}>
                        +{omittedValues.length} ประเภท
                      </Tag>
                    )}
                    placeholder="เลือกตำแหน่งที่สนใจ"
                    style={{
                      width: "100%",
                      fontSize: "16px",
                    }}
                    size="large"
                    showCheckedStrategy={Cascader.SHOW_CHILD}
                    suffixIcon={
                      <SolutionOutlined style={{ color: token.colorPrimary }} />
                    }
                    expandTrigger="click"
                  />
                </div>
              </Col>

              {/* 📍 Location Select */}
              <Col xs={24} lg={7}>
                <div style={{ padding: "0 24px", textAlign: "left" }}>
                  <Text
                    strong
                    style={{
                      fontSize: "14px",
                      color: isDark ? "#A0AEC0" : "#8c8c8c",
                    }}
                  >
                    สถานที่
                  </Text>
                  <Select
                    placeholder="ทุกจังหวัด"
                    style={{
                      width: "100%",
                      fontSize: "16px",
                    }}
                    size="large"
                    value={searchParams.location}
                    onChange={(value) =>
                      setSearchParams({ ...searchParams, location: value })
                    }
                    suffixIcon={
                      <GlobalOutlined style={{ color: token.colorPrimary }} />
                    }
                  >
                    <Option value="bkk">กรุงเทพมหานคร</Option>
                    <Option value="center">ภาคกลาง</Option>
                    <Option value="north">ภาคเหนือ</Option>
                    <Option value="east">ภาคตะวันออก</Option>
                  </Select>
                </div>
              </Col>
            </Row>

            {/* � Advanced Filters Row */}
            <div
              style={{
                marginTop: "24px",
                padding: "0 24px",
                paddingTop: "16px",
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
                    onChange={(value) =>
                      setSearchParams({
                        ...searchParams,
                        employmentType: value,
                      })
                    }
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
                    onChange={(value) =>
                      setSearchParams({ ...searchParams, license: value })
                    }
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
                    onChange={(value) =>
                      setSearchParams({ ...searchParams, salaryRange: value })
                    }
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
                    onChange={(value) =>
                      setSearchParams({ ...searchParams, postedAt: value })
                    }
                  >
                    <Option value="today">วันนี้</Option>
                    <Option value="3days">3 วันที่ผ่านมา</Option>
                    <Option value="7days">7 วันที่ผ่านมา</Option>
                    <Option value="30days">30 วันที่ผ่านมา</Option>
                  </Select>
                </Col>
                <Col xs={24} lg={4}>
                  <Button
                    type="link"
                    block
                    style={{ color: "#8c8c8c" }}
                    onClick={handleReset}
                  >
                    รีเซ็ตเงื่อนไข
                  </Button>
                </Col>
              </Row>
            </div>

            {/* �🔘 Search Button - Moved to bottom */}
            <div style={{ marginTop: "24px", padding: "0 8px" }}>
              <Button
                type="primary"
                block
                size="large"
                icon={<SearchOutlined style={{ fontSize: "20px" }} />}
                style={{
                  height: "60px",
                  borderRadius: "20px",
                  fontWeight: "800",
                  fontSize: "18px",
                  boxShadow: "0 10px 20px rgba(24, 144, 255, 0.2)",
                }}
              >
                ค้นหาตำแหน่งงานเลยตอนนี้
              </Button>
            </div>
          </div>

          <Space direction="vertical" size={8} style={{ marginTop: "24px" }}>
            <Text type="secondary">อาชีพยอดนิยม: </Text>
            <Space size={[8, 8]} wrap>
              {[
                "ครูภาษาอังกฤษ",
                "ครูคณิตศาสตร์",
                "ธุรการโรงเรียน",
                "ครูปฐมวัย",
              ].map((tag) => (
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
          </Space>
        </div>
      </div>

      {/* 🆕 Latest Job Posts Section */}
      <div
        style={{
          padding: "80px 24px",
          background: isDark ? "#0D1117" : "#fdfdfd",
          borderTop: `1px solid ${token.colorBorder}`,
          borderBottom: `1px solid ${token.colorBorder}`,
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "40px",
            }}
          >
            <div>
              <Badge status="processing" text="อัปเดตล่าสุด" />
              <Title level={2} style={{ marginTop: "12px", marginBottom: 0 }}>
                ตำแหน่งงานใหม่ที่น่าสนใจ
              </Title>
            </div>
            <Button type="link" size="large">
              ดูงานทั้งหมด <RocketOutlined />
            </Button>
          </div>

          <div
            style={{
              overflowX: "auto",
              paddingBottom: "20px",
              display: "flex",
              gap: "24px",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
            }}
            className="job-scroll-container"
          >
            {[
              {
                title: "ครูสอนภาษาอังกฤษ (EP)",
                school: "โรงเรียนนานาชาติแสงดาว",
                location: "กรุงเทพมหานคร",
                salary: "35,000 - 50,000",
                tags: ["Full-time", "English"],
              },
              {
                title: "ครูอาสาสมัครสอนคณิตศาสตร์",
                school: "โรงเรียนบ้านนาพัฒนา",
                location: "เชียงใหม่",
                salary: "18,000 - 25,000",
                tags: ["Contract", "Math"],
              },
              {
                title: "เจ้าหน้าที่ธุรการประสานงานวิจัย",
                school: "มหาวิทยาลัยนวัตกรรม",
                location: "นนทบุรี",
                salary: "22,000 - 30,000",
                tags: ["Full-time", "Admin"],
              },
              {
                title: "ครูสอนศิลปะ (Part-time)",
                school: "สถาบันอาร์ตดีล",
                location: "กรุงเทพมหานคร",
                salary: "500 - 800 / ชม.",
                tags: ["Part-time", "Art"],
              },
              {
                title: "หัวหน้าฝ่ายวิชาการ",
                school: "โรงเรียนปัญญาวิมล",
                location: "ชลบุรี",
                salary: "45,000 - 60,000",
                tags: ["Full-time", "Management"],
              },
            ].map((job, idx) => (
              <div
                key={idx}
                style={{
                  minWidth: "350px",
                  flexShrink: 0,
                }}
              >
                <Card
                  hoverable
                  style={{ borderRadius: "20px", height: "100%" }}
                  bodyStyle={{ padding: "24px" }}
                >
                  <Space
                    direction="vertical"
                    size={16}
                    style={{ width: "100%" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Badge count="New" color="#52c41a" />
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        2 ชม. ที่แล้ว
                      </Text>
                    </div>
                    <div>
                      <Title
                        level={4}
                        style={{
                          marginBottom: "4px",
                          height: "56px",
                          overflow: "hidden",
                        }}
                      >
                        {job.title}
                      </Title>
                      <Text strong style={{ color: "#1890ff" }}>
                        {job.school}
                      </Text>
                    </div>
                    <Space direction="vertical" size={4}>
                      <Text type="secondary">
                        <GlobalOutlined /> {job.location}
                      </Text>
                      <Text strong style={{ color: "#52c41a" }}>
                        ฿ {job.salary}
                      </Text>
                    </Space>
                    <Space size={[4, 4]} wrap>
                      {job.tags.map((tag) => (
                        <Tag key={tag} color="blue">
                          {tag}
                        </Tag>
                      ))}
                    </Space>
                    <Button
                      type="primary"
                      block
                      style={{ borderRadius: "10px" }}
                    >
                      ดูรายละเอียด
                    </Button>
                  </Space>
                </Card>
              </div>
            ))}
          </div>

          <style jsx global>{`
            .job-scroll-container::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>
      </div>

      {/* 🏢 Employer Solutions Section */}
      <div
        style={{
          padding: "100px 24px",
          background: isDark
            ? `linear-gradient(135deg, #1A202C 0%, ${token.colorBgBase} 100%)`
            : "linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Row gutter={[64, 48]} align="middle">
            <Col xs={24} md={12}>
              <Badge
                status="processing"
                text={<Text strong>สำหรับสถานศึกษา</Text>}
              />
              <Title style={{ fontSize: "40px", marginTop: "16px" }}>
                พบกับบุคลากรที่ตรงใจ <br />
                <span>ได้เร็วกว่าที่เคย</span>
              </Title>
              <Paragraph
                style={{
                  fontSize: "16px",
                  marginBottom: "32px",
                }}
              >
                เราช่วยแก้ปัญหา "หาครูยาก" ด้วยระบบจัดการประกาศงานที่ทันสมัย
                คัดกรองบุคลากรตามวิชาเอกที่ต้องการ และระบบนัดสัมภาษณ์อัตโนมัติ
              </Paragraph>
              <Space
                direction="vertical"
                size={16}
                style={{ marginBottom: "40px" }}
              >
                {[
                  "ประกาศงานไม่จำกัดตำแหน่ง",
                  "เข้าถึงฐานข้อมูลประวัติครู (Active candidates)",
                  "ระบบ Dashboard ติดตามสถานะผู้สมัคร",
                  "ส่งแจ้งเตือนผ่าน Line OA ถึงกลุ่มเป้าหมาย",
                ].map((feature, i) => (
                  <Space key={i}>
                    <RocketOutlined />
                    <Text strong>{feature}</Text>
                  </Space>
                ))}
              </Space>
              <Button
                type="primary"
                size="large"
                style={{
                  height: "56px",
                  padding: "0 40px",
                  borderRadius: "16px",
                }}
              >
                ลงทะเบียนสถานศึกษาเริ่มต้น 8,000 บ./ปี
              </Button>
            </Col>
            <Col xs={24} md={12}>
              <div
                style={{
                  height: "450px",
                  borderRadius: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "40px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Minimalist Abstract Image for Employers using Local SVG */}
                <div
                  style={{
                    width: "100%",
                    maxWidth: "400px",
                    zIndex: 1,
                  }}
                >
                  <img
                    src="/images/flat/undraw_hiring_8szx.svg"
                    alt="Employer Solutions"
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
                {/* Background Decoration */}
                <div
                  style={{
                    position: "absolute",
                    width: "150%",
                    height: "150%",
                    backgroundColor: isDark ? "#1A202C" : "#fff",
                    borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
                    top: "10%",
                    left: "10%",
                    zIndex: 0,
                    opacity: isDark ? 0.3 : 0.5,
                  }}
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* 🎓 Job Seeker Features */}
      <div
        style={{
          padding: "80px 24px",
          background: isDark ? "#101622" : "#fafafa",
          borderTop: `1px solid ${token.colorBorder}`,
        }}
      >
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}
        >
          <Title level={2}>สิทธิประโยชน์สำหรับผู้หางาน</Title>
          <Paragraph style={{ marginBottom: "48px" }}>
            ฝากประวัติไว้กับเรา โอกาสได้งานใหม่ในโรงเรียนฝันอยู่ไม่ไกล
          </Paragraph>
          <Row gutter={[24, 24]}>
            {[
              {
                title: "ฝากประวัติฟรี",
                desc: "สร้าง Resume ออนไลน์ระดับมืออาชีพ",
                localIcon: "/images/flat/undraw_resume_jrgi.svg",
              },
              {
                title: "แจ้งเตือนงานตรงใจ",
                desc: "รับค่างานใหม่ตามวิชาเอกที่คุณระบุ",
                localIcon: "/images/flat/undraw_job-offers_55y0.svg",
              },
              {
                title: "ติดตามสถานะ",
                desc: "ดูประวัติการสมัครและนัดสัมภาษณ์งาน",
                localIcon: "/images/flat/undraw_interview_yz52.svg",
              },
              {
                title: "ประกาศเกียรติคุณ",
                desc: "ระบบยืนยันวิทยฐานะและการเข้าอบรม",
                localIcon: "/images/flat/undraw_project-completed_ug9i.svg",
              },
            ].map((item, i) => (
              <Col xs={24} sm={12} md={6} key={i}>
                <Card
                  hoverable
                  style={{
                    height: "100%",
                    borderRadius: "20px",
                    border: "none",
                  }}
                >
                  <Space
                    direction="vertical"
                    align="center"
                    style={{ width: "100%" }}
                    size={24}
                  >
                    <div
                      style={{
                        width: "64px",
                        height: "64px",
                        borderRadius: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "28px",
                        marginBottom: "16px",
                        background: isDark
                          ? "rgba(24, 144, 255, 0.15)"
                          : "#f0f7ff",
                        border: isDark
                          ? "1px solid rgba(24, 144, 255, 0.3)"
                          : "none",
                      }}
                    >
                      <img
                        src={item.localIcon}
                        alt={item.title}
                        style={{
                          width: "36px",
                          height: "36px",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                    <Space
                      direction="vertical"
                      align="center"
                      style={{ width: "100%" }}
                      size={8}
                    >
                      <Title level={4} style={{ margin: 0 }}>
                        {item.title}
                      </Title>
                      <Text type="secondary">{item.desc}</Text>
                    </Space>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
          <Button
            size="large"
            shape="round"
            style={{ marginTop: "48px", height: "54px", padding: "0 40px" }}
          >
            สร้างโปรไฟล์หางานฟรีเลยตอนนี้
          </Button>
        </div>
      </div>
    </>
  );
}

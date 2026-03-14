"use client";

import {
  CheckCircleFilled,
  ClockCircleOutlined,
  CloseOutlined,
  DollarCircleOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  HeartOutlined,
  HistoryOutlined,
  InfoCircleOutlined,
  MoreOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  ShareAltOutlined,
  SolutionOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  theme as antTheme,
  Avatar,
  Badge,
  Button,
  Card,
  Cascader,
  Col,
  Divider,
  Drawer,
  Input,
  Layout,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/th";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

dayjs.extend(relativeTime);
dayjs.locale("th");

const { Title, Text, Link, Paragraph } = Typography;
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

// Mock Data 10 รายการ ตามฟิลด์ใน School Board Requirement
const MOCK_JOBS = [
  {
    id: "1",
    title: "ครูสอนภาษาอังกฤษ (English Teacher)",
    subjects: ["ภาษาอังกฤษ"],
    grades: ["มัธยมต้น", "มัธยมปลาย"],
    vacancyCount: 2,
    salaryType: "ระบุเงินเดือน",
    salaryMin: 25000,
    salaryMax: 35000,
    description:
      "รับสมัครครูสอนภาษาอังกฤษ มีประสบการณ์การสอนในระดับมัธยม เน้นทักษะการสื่อสารและกิจกรรมในห้องเรียน",
    educationLevel: "ปริญญาตรีขึ้นไป",
    teachingExperience: "1 - 3 ปี",
    licenseRequired: "มีรับผู้ที่กำลังดำเนินการ",
    gender: "ไม่จำกัด",
    schoolName: "โรงเรียนนานาชาติแสงทอง",
    province: "กรุงเทพมหานคร",
    address: "เขตบางนา กรุงเทพฯ",
    postedAt: "2026-03-09T10:00:00Z",
    isNew: true,
  },
  {
    id: "2",
    title: "ครูสอนคณิตศาสตร์",
    subjects: ["คณิตศาสตร์"],
    grades: ["ประถมศึกษา"],
    vacancyCount: 1,
    salaryType: "ตามประสบการณ์",
    description:
      "ต้องการครูคณิตศาสตร์ที่รักเด็ก มีเทคนิคการสอนที่สนุกสนาน เข้าใจง่าย",
    educationLevel: "ปริญญาตรีขึ้นไป",
    teachingExperience: "น้อยกว่า 1 ปี",
    licenseRequired: "จำเป็นต้องมี",
    gender: "หญิง",
    schoolName: "โรงเรียนประถมวิทยา",
    province: "นนทบุรี",
    address: "อ.เมือง นนทบุรี",
    postedAt: "2026-03-08T15:30:00Z",
    isNew: true,
  },
  {
    id: "3",
    title: "ครูสอนวิทยาศาสตร์ (ฟิสิกส์)",
    subjects: ["วิทยาศาสตร์", "ฟิสิกส์"],
    grades: ["มัธยมปลาย"],
    vacancyCount: 1,
    salaryType: "ระบุเงินเดือน",
    salaryMin: 30000,
    salaryMax: 45000,
    description: "เน้นการสอนปฏิบัติการและการเตรียมตัวสอบเข้ามหาวิทยาลัย",
    educationLevel: "ปริญญาโทขึ้นไป",
    teachingExperience: "3 - 5 ปี",
    licenseRequired: "จำเป็นต้องมี",
    gender: "ไม่จำกัด",
    schoolName: "โรงเรียนสาธิตเกษตร",
    province: "กรุงเทพมหานคร",
    address: "เขตจตุจักร กรุงเทพฯ",
    postedAt: "2026-03-07T09:00:00Z",
    isNew: false,
  },
  {
    id: "4",
    title: "ครูพี่เลี้ยงเด็กอนุบาล",
    subjects: ["กิจกรรมปฐมวัย"],
    grades: ["อนุบาล"],
    vacancyCount: 3,
    salaryType: "ระบุเงินเดือน",
    salaryMin: 18000,
    salaryMax: 22000,
    description:
      "ดูแลเด็กเล็ก ช่วยเหลือครูประจำชั้นในกิจกรรมต่างๆ รักความสะอาดและใจเย็น",
    educationLevel: "มัธยมศึกษา/ปวช",
    teachingExperience: "ไม่กำหนด",
    licenseRequired: "ไม่จำเป็นต้องมี",
    gender: "หญิง",
    schoolName: "โรงเรียนอนุบาลรักลูก",
    province: "ปทุมธานี",
    address: "คลองหลวง ปทุมธานี",
    postedAt: "2026-03-09T08:00:00Z",
    isNew: true,
  },
  {
    id: "5",
    title: "ครูสอนคอมพิวเตอร์และ Coding",
    subjects: ["คอมพิวเตอร์", "วิทยาการคำนวณ"],
    grades: ["ประถมศึกษา", "มัธยมต้น"],
    vacancyCount: 1,
    salaryType: "ระบุเงินเดือน",
    salaryMin: 28000,
    salaryMax: 40000,
    description:
      "สอนพื้นฐานการเขียนโปรแกรม Scratch, Python และการใช้เทคโนโลยีสารสนเทศ",
    educationLevel: "ปริญญาตรีขึ้นไป",
    teachingExperience: "1 - 3 ปี",
    licenseRequired: "ยินดีรับผู้ที่กำลังดำเนินการ",
    gender: "ไม่จำกัด",
    schoolName: "โรงเรียนเทคโนวิทยา",
    province: "สมุทรปราการ",
    address: "อ.เมือง สมุทรปราการ",
    postedAt: "2026-03-05T11:00:00Z",
    isNew: false,
  },
  {
    id: "6",
    title: "ครูสอนภาษาจีน",
    subjects: ["ภาษาจีน"],
    grades: ["ประถมศึกษา", "มัธยมต้น", "มัธยมปลาย"],
    vacancyCount: 2,
    salaryType: "ตามประสบการณ์",
    description: "สอนภาษาจีนพื้นฐานจนถึงระดับ HSK 4 มีสื่อการสอนที่ทันสมัย",
    educationLevel: "ปริญญาตรีขึ้นไป",
    teachingExperience: "1 - 3 ปี",
    licenseRequired: "ยินดีรับผู้ที่กำลังดำเนินการ",
    gender: "ไม่จำกัด",
    schoolName: "โรงเรียนภาษาโลก",
    province: "กรุงเทพมหานคร",
    address: "เขตสัมพันธวงศ์ กรุงเทพฯ",
    postedAt: "2026-03-09T14:00:00Z",
    isNew: true,
  },
  {
    id: "7",
    title: "ครูสอนศิลปะ (Art Teacher)",
    subjects: ["ศิลปะ"],
    grades: ["ประถมศึกษา"],
    vacancyCount: 1,
    salaryType: "ระบุเงินเดือน",
    salaryMin: 22000,
    salaryMax: 28000,
    description: "ส่งเสริมจินตนาการเด็กผ่านงานศิลปะหลากหลายรูปแบบ",
    educationLevel: "ปริญญาตรีขึ้นไป",
    teachingExperience: "น้อยกว่า 1 ปี",
    licenseRequired: "ไม่จำเป็นต้องมี",
    gender: "ไม่จำกัด",
    schoolName: "โรงเรียนสร้างสรรค์วิทย์",
    province: "เชียงใหม่",
    address: "อ.เมือง เชียงใหม่",
    postedAt: "2026-03-08T10:00:00Z",
    isNew: false,
  },
  {
    id: "8",
    title: "ครูสอนวิชาสังคมศึกษา",
    subjects: ["สังคมศึกษา", "ประวัติศาสตร์"],
    grades: ["มัธยมต้น"],
    vacancyCount: 1,
    salaryType: "ระบุเงินเดือน",
    salaryMin: 24000,
    salaryMax: 30000,
    description:
      "รับสมัครครูที่มีความรู้ในวิชาสังคมศึกษาและประวัติศาสตร์ไทย-สากล",
    educationLevel: "ปริญญาตรีขึ้นไป",
    teachingExperience: "3 - 5 ปี",
    licenseRequired: "จำเป็นต้องมี",
    gender: "ไม่จำกัด",
    schoolName: "โรงเรียนเก่งวิทยา",
    province: "นครปฐม",
    address: "อ.พุทธมณฑล นครปฐม",
    postedAt: "2026-03-04T12:00:00Z",
    isNew: false,
  },
  {
    id: "9",
    title: "ครูสอนพลศึกษา",
    subjects: ["พลศึกษา", "สุขศึกษา"],
    grades: ["มัธยมต้น", "มัธยมปลาย"],
    vacancyCount: 2,
    salaryType: "ระบุเงินเดือน",
    salaryMin: 20000,
    salaryMax: 26000,
    description: "ดูแลกิจกรรมกีฬาและสุขภาพของนักเรียน มีทักษะกีฬาที่หลากหลาย",
    educationLevel: "ปริญญาตรีขึ้นไป",
    teachingExperience: "1 - 3 ปี",
    licenseRequired: "ยินดีรับผู้ที่กำลังดำเนินการ",
    gender: "ชาย",
    schoolName: "โรงเรียนกีฬาแห่งชาติ",
    province: "ชลบุรี",
    address: "อ.เมือง ชลบุรี",
    postedAt: "2026-03-09T16:00:00Z",
    isNew: true,
  },
  {
    id: "10",
    title: "ครูสอนดนตรีไทย-สากล",
    subjects: ["ดนตรีไทย", "ดนตรีสากล"],
    grades: ["ประถมศึกษา", "มัธยมต้น"],
    vacancyCount: 1,
    salaryType: "ไม่ระบุ",
    description: "สอนเครื่องดนตรีเบื้องต้นและทฤษฎีดนตรี จัดตั้งวงดนตรีโรงเรียน",
    educationLevel: "ปริญญาตรีขึ้นไป",
    teachingExperience: "ไม่กำหนด",
    licenseRequired: "ยินดีรับผู้ที่กำลังดำเนินการ",
    gender: "ไม่จำกัด",
    schoolName: "โรงเรียนศิลป์ดนตรี",
    province: "กรุงเทพมหานคร",
    address: "เขตดุสิต กรุงเทพฯ",
    postedAt: "2026-03-06T13:00:00Z",
    isNew: false,
  },
];

export default function JobSearchPage() {
  const searchParams = useSearchParams();
  const { token } = antTheme.useToken();

  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    category: [] as string[][],
    location: searchParams.get("location") || (null as string | null),
    employmentType:
      searchParams.get("employmentType") || (null as string | null),
    license: searchParams.get("license") || (null as string | null),
    salaryRange: searchParams.get("salaryRange") || (null as string | null),
    postedAt: searchParams.get("postedAt") || (null as string | null),
  });

  // ✨ [Sync initial category from URL]
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      try {
        setFilters((prev) => ({ ...prev, category: JSON.parse(cat) }));
      } catch (e) {
        console.error("Failed to parse category from URL", e);
      }
    }
  }, [searchParams]);

  const [selectedJob, setSelectedJob] = useState<(typeof MOCK_JOBS)[0] | null>(
    null,
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenJob = (job: (typeof MOCK_JOBS)[0]) => {
    setSelectedJob(job);
    setIsDrawerOpen(true);
  };

  const handleReset = () => {
    setFilters({
      keyword: "",
      category: [],
      location: null,
      employmentType: null,
      license: null,
      salaryRange: null,
      postedAt: null,
    });
  };

  const filteredJobs = useMemo(() => {
    return MOCK_JOBS.filter((job) => {
      if (
        filters.keyword &&
        !job.title.toLowerCase().includes(filters.keyword.toLowerCase()) &&
        !job.schoolName.toLowerCase().includes(filters.keyword.toLowerCase())
      ) {
        return false;
      }
      if (filters.location) {
        const locationMap: Record<string, string[]> = {
          bkk: ["กรุงเทพมหานคร"],
          center: ["นนทบุรี", "ปทุมธานี", "สมุทรปราการ", "นครปฐม"],
          north: ["เชียงใหม่"],
        };
        const provinces = locationMap[filters.location] || [filters.location];
        if (!provinces.includes(job.province)) return false;
      }
      if (filters.license) {
        if (
          filters.license === "required" &&
          job.licenseRequired !== "จำเป็นต้องมี"
        )
          return false;
        if (
          filters.license === "not-required" &&
          job.licenseRequired !== "ไม่จำเป็นต้องมี"
        )
          return false;
      }
      if (filters.salaryRange && job.salaryType === "ระบุเงินเดือน") {
        const [min, max] = filters.salaryRange.split("-").map(Number);
        const sMin = job.salaryMin ?? 0;
        const sMax = job.salaryMax ?? 0;
        if (max) {
          if (sMin > max || sMax < min) return false;
        } else if (filters.salaryRange === "40000+" && sMax < 40000) {
          return false;
        }
      }
      return true;
    });
  }, [filters]);

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundColor: token.colorBgLayout,
      }}
    >
      {/* 1. Adjusted Header Search Area - Aligned with Landing Page */}
      <Layout.Header
        style={{
          backgroundColor: token.colorPrimary,
          height: "auto",
          padding: "40px 0",
          color: token.colorTextLightSolid,
        }}
      >
        <Row justify="center">
          <Col span={24} style={{ maxWidth: "1200px", padding: "0 24px" }}>
            <Card
              styles={{
                body: {
                  padding: "32px",
                },
              }}
              style={{
                borderRadius: token.borderRadiusLG * 2,
                border: `1px solid ${token.colorBorderSecondary}`,
                backgroundColor: token.colorBgContainer,
                boxShadow: token.boxShadowSecondary,
              }}
            >
              <Row gutter={[20, 20]} align="middle">
                {/* 💻 Search Input */}
                <Col xs={24} lg={8}>
                  <Text
                    strong
                    style={{
                      fontSize: "13px",
                      color: token.colorTextDescription,
                      display: "block",
                      marginBottom: "8px",
                      marginLeft: "4px",
                    }}
                  >
                    ค้นหางานที่คุณสนใจ
                  </Text>
                  <Input
                    prefix={
                      <SearchOutlined style={{ color: token.colorPrimary }} />
                    }
                    placeholder="ตำแหน่งงาน, วิชาเอก หรือโรงเรียน"
                    value={filters.keyword}
                    onChange={(e) =>
                      setFilters({ ...filters, keyword: e.target.value })
                    }
                    size="large"
                    style={{
                      borderRadius: token.borderRadius,
                      height: "52px",
                      fontSize: "15px",
                      border: `1px solid ${token.colorBorder}`,
                      backgroundColor: token.colorBgContainer,
                      color: token.colorText,
                    }}
                  />
                </Col>

                {/* 📂 Job Categories */}
                <Col xs={24} lg={9}>
                  <Text
                    strong
                    style={{
                      fontSize: "13px",
                      color: token.colorTextDescription,
                      display: "block",
                      marginBottom: "8px",
                      marginLeft: "4px",
                    }}
                  >
                    ประเภทงาน
                  </Text>
                  <Cascader
                    options={JOB_CATEGORIES}
                    multiple
                    maxTagCount={1}
                    value={filters.category}
                    onChange={(value) =>
                      setFilters({ ...filters, category: value as string[][] })
                    }
                    placeholder="เลือกตำแหน่งที่สนใจ"
                    style={{ width: "100%" }}
                    size="large"
                    showCheckedStrategy={Cascader.SHOW_CHILD}
                    suffixIcon={
                      <SolutionOutlined style={{ color: token.colorPrimary }} />
                    }
                  />
                </Col>

                {/* 📍 Location */}
                <Col xs={24} lg={7}>
                  <Text
                    strong
                    style={{
                      fontSize: "13px",
                      color: token.colorTextDescription,
                      display: "block",
                      marginBottom: "8px",
                      marginLeft: "4px",
                    }}
                  >
                    สถานที่
                  </Text>
                  <Select
                    placeholder="ทุกจังหวัด"
                    style={{ width: "100%" }}
                    size="large"
                    value={filters.location}
                    onChange={(value) =>
                      setFilters({ ...filters, location: value })
                    }
                    suffixIcon={
                      <GlobalOutlined style={{ color: token.colorPrimary }} />
                    }
                    allowClear
                  >
                    <Option value="bkk">กรุงเทพมหานคร</Option>
                    <Option value="center">ภาคกลาง</Option>
                    <Option value="north">ภาคเหนือ</Option>
                    <Option value="east">ภาคตะวันออก</Option>
                  </Select>
                </Col>

                {/* Advanced Filters Row */}
                <Col span={24}>
                  <Layout
                    style={{
                      marginTop: "8px",
                      paddingTop: "24px",
                      borderTop: `1px solid ${token.colorBorderSecondary}`,
                      backgroundColor: "transparent",
                    }}
                  >
                    <Row gutter={[16, 16]} align="middle">
                      <Col xs={12} md={6}>
                        <Select
                          placeholder="รูปแบบการจ้างงาน"
                          style={{ width: "100%" }}
                          size="large"
                          allowClear
                          value={filters.employmentType}
                          onChange={(value) =>
                            setFilters({ ...filters, employmentType: value })
                          }
                        >
                          <Option value="fulltime">
                            งานเต็มเวลา (Full-time)
                          </Option>
                          <Option value="parttime">
                            พาร์ทไทม์ (Part-time)
                          </Option>
                          <Option value="contract">
                            สัญญาจ้าง / อัตราจ้าง
                          </Option>
                        </Select>
                      </Col>
                      <Col xs={12} md={6}>
                        <Select
                          placeholder="ใบประกอบวิชาชีพ"
                          style={{ width: "100%" }}
                          size="large"
                          allowClear
                          value={filters.license}
                          onChange={(value) =>
                            setFilters({ ...filters, license: value })
                          }
                        >
                          <Option value="required">ต้องมีใบประกอบฯ</Option>
                          <Option value="not-required">
                            ไม่ต้องมีใบประกอบฯ
                          </Option>
                          <Option value="pending">
                            อยู่ระหว่างขอรับใบประกอบฯ
                          </Option>
                        </Select>
                      </Col>
                      <Col xs={12} md={6}>
                        <Select
                          placeholder="ช่วงเงินเดือน"
                          style={{ width: "100%" }}
                          size="large"
                          allowClear
                          value={filters.salaryRange}
                          onChange={(value) =>
                            setFilters({ ...filters, salaryRange: value })
                          }
                        >
                          <Option value="0-15000">ต่ำกว่า 15,000</Option>
                          <Option value="15000-25000">15,000 - 25,000</Option>
                          <Option value="25000-40000">25,000 - 40,000</Option>
                          <Option value="40000+">40,000 ขึ้นไป</Option>
                        </Select>
                      </Col>
                      <Col xs={12} md={6}>
                        <Button
                          type="link"
                          onClick={handleReset}
                          style={{
                            color: token.colorTextDescription,
                            fontSize: "14px",
                          }}
                        >
                          รีเซ็ตเงื่อนไขทั้งหมด
                        </Button>
                      </Col>
                    </Row>
                  </Layout>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Layout.Header>

      {/* 2. Main content Area */}
      <Layout.Content>
        <Row
          justify="center"
          style={{ marginTop: "40px", paddingBottom: "80px" }}
        >
          <Col span={24} style={{ maxWidth: "1152px", padding: "0 24px" }}>
            <Row gutter={40}>
              {/* LEFT COLUMN: Job Listings */}
              <Col span={16}>
                <Layout
                  style={{
                    marginBottom: "20px",
                    backgroundColor: "transparent",
                  }}
                >
                  <Title
                    level={4}
                    style={{
                      display: "inline-block",
                      marginRight: "8px",
                      margin: 0,
                    }}
                  >
                    {filters.keyword
                      ? `ผลการค้นหาสำหรับ "${filters.keyword}"`
                      : "งานที่แนะนำสำหรับคุณ"}
                  </Title>
                  <Badge
                    count={filteredJobs.length}
                    style={{ backgroundColor: token.colorTextQuaternary }}
                  />
                </Layout>

                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <Card
                        key={job.id}
                        hoverable
                        onClick={() => handleOpenJob(job)}
                        style={{
                          borderRadius: token.borderRadiusLG,
                          border: `1px solid ${token.colorBorderSecondary}`,
                        }}
                        styles={{ body: { padding: "24px" } }}
                      >
                        <Row gutter={16}>
                          <Col flex="auto">
                            <Space
                              direction="vertical"
                              size={4}
                              style={{ width: "100%" }}
                            >
                              <Title
                                level={4}
                                style={{
                                  margin: 0,
                                  color: token.colorTextHeading,
                                }}
                              >
                                {job.title}
                              </Title>
                              <Text
                                strong
                                style={{ color: token.colorTextSecondary }}
                              >
                                {job.schoolName}
                              </Text>

                              <Space
                                size={12}
                                wrap
                                style={{ marginTop: "12px" }}
                              >
                                {job.isNew && (
                                  <Tag
                                    color="success"
                                    style={{
                                      borderRadius: token.borderRadiusSM,
                                      margin: 0,
                                      border: "none",
                                    }}
                                  >
                                    มาใหม่
                                  </Tag>
                                )}
                                {job.educationLevel.includes("ปริญญาโท") && (
                                  <Tag
                                    color="processing"
                                    style={{
                                      borderRadius: token.borderRadiusSM,
                                      margin: 0,
                                      border: "none",
                                    }}
                                  >
                                    เน้นวุฒิสูง
                                  </Tag>
                                )}
                              </Space>

                              <Layout
                                style={{
                                  marginTop: "16px",
                                  backgroundColor: "transparent",
                                }}
                              >
                                <Space direction="vertical" size={4}>
                                  <Space size={12}>
                                    <ClockCircleOutlined
                                      style={{ color: token.colorTextTertiary }}
                                    />
                                    <Text type="secondary">งานเต็มเวลา</Text>
                                  </Space>
                                  <Space size={12}>
                                    <EnvironmentOutlined
                                      style={{ color: token.colorTextTertiary }}
                                    />
                                    <Text type="secondary">{job.address}</Text>
                                  </Space>
                                  <Space size={12}>
                                    <DollarCircleOutlined
                                      style={{ color: token.colorTextTertiary }}
                                    />
                                    <Text type="secondary">
                                      {job.salaryType === "ระบุเงินเดือน"
                                        ? `฿${job.salaryMin?.toLocaleString()} - ฿${job.salaryMax?.toLocaleString()} ต่อเดือน`
                                        : "ตามประสบการณ์ / ไม่ระบุ"}
                                    </Text>
                                  </Space>
                                </Space>
                              </Layout>

                              <Layout
                                style={{
                                  marginTop: "16px",
                                  color: token.colorTextSecondary,
                                  fontSize: "14px",
                                  backgroundColor: "transparent",
                                }}
                              >
                                <ul style={{ paddingLeft: "18px", margin: 0 }}>
                                  <li>รับทั้งสิ้น {job.vacancyCount} อัตรา</li>
                                  <li>ประสบการณ์: {job.teachingExperience}</li>
                                  <li>ใบอนุญาต: {job.licenseRequired}</li>
                                </ul>
                              </Layout>
                            </Space>
                          </Col>
                          <Col flex="100px" style={{ textAlign: "right" }}>
                            <Avatar
                              shape="square"
                              size={80}
                              src={`https://api.dicebear.com/7.x/initials/svg?seed=${job.schoolName}&backgroundColor=003366`}
                            />
                          </Col>
                        </Row>

                        <Divider style={{ margin: "20px 0" }} />

                        <Row justify="space-between" align="middle">
                          <Col>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              <HistoryOutlined />{" "}
                              {dayjs(job.postedAt).fromNow()}
                            </Text>
                          </Col>
                          <Col>
                            <Space size={12}>
                              <Button icon={<HeartOutlined />} />
                              <Button
                                type="link"
                                style={{
                                  color: token.colorTextSecondary,
                                  fontWeight: 600,
                                }}
                              >
                                ไม่สนใจ
                              </Button>
                            </Space>
                          </Col>
                        </Row>
                      </Card>
                    ))
                  ) : (
                    <Card
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        borderRadius: token.borderRadiusLG,
                      }}
                    >
                      <TeamOutlined
                        style={{
                          fontSize: "48px",
                          color: token.colorTextQuaternary,
                          marginBottom: "16px",
                        }}
                      />
                      <Title level={4}>ไม่พบงานที่ตรงตามเงื่อนไข</Title>
                      <Text type="secondary">
                        ลองปรับเปลี่ยนคำค้นหาหรือตัวกรองใหม่อีกครั้ง
                      </Text>
                    </Card>
                  )}
                </Space>
              </Col>

              {/* RIGHT COLUMN: Sidebar Tools */}
              <Col span={8}>
                <Space direction="vertical" size={24} style={{ width: "100%" }}>
                  {/* 1. Saved Searches */}
                  <Card
                    bordered={false}
                    style={{ borderRadius: token.borderRadiusLG }}
                  >
                    <Title level={5}>การค้นหาที่บันทึกไว้</Title>
                    <Text
                      type="secondary"
                      style={{
                        fontSize: "14px",
                        display: "block",
                        marginBottom: "16px",
                      }}
                    >
                      ใช้ปุ่มบันทึกการค้นหาด้านล่างผลการค้นหาเพื่อบันทึกและรับงานใหม่ทางอีเมล
                    </Text>
                  </Card>

                  {/* 2. Saved Jobs */}
                  <Card
                    bordered={false}
                    style={{ borderRadius: token.borderRadiusLG }}
                  >
                    <Title level={5}>งานที่บันทึกไว้</Title>
                    <Text
                      type="secondary"
                      style={{
                        fontSize: "14px",
                        display: "block",
                        marginBottom: "16px",
                      }}
                    >
                      คลิกไอคอนหัวใจในแต่ละประกาศงานเพื่อบันทึกไว้ดูภายหลังได้ในทุกอุปกรณ์ของคุณ
                    </Text>
                  </Card>

                  {/* 3. Safety Tip */}
                  <Card
                    bordered={false}
                    style={{
                      backgroundColor: token.colorBgLayout,
                      borderRadius: token.borderRadiusLG,
                      border: `1px solid ${token.colorBorderSecondary}`,
                    }}
                    styles={{ body: { padding: "24px" } }}
                  >
                    <Space direction="vertical" size={16}>
                      <SafetyCertificateOutlined
                        style={{ fontSize: "32px", color: token.colorSuccess }}
                      />
                      <Text strong style={{ fontSize: "16px" }}>
                        ปลอดภัยไว้ก่อน!
                      </Text>
                      <Text type="secondary" style={{ fontSize: "13px" }}>
                        อย่าโอนเงินหรือให้ข้อมูลส่วนตัวที่สำคัญหากพบพิรุธในการรับสมัครงาน
                      </Text>
                      <Button type="link" style={{ padding: 0 }}>
                        อ่านคำแนะนำเพิ่มเติม
                      </Button>
                    </Space>
                  </Card>
                </Space>
              </Col>
            </Row>
          </Col>
        </Row>
      </Layout.Content>

      {/* 3. Job Details Drawer (70% Width) */}
      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        width="70%"
        closable={false}
        styles={{ body: { padding: 0 } }}
      >
        {selectedJob && (
          <Layout
            style={{
              position: "relative",
              minHeight: "100%",
              backgroundColor: token.colorBgContainer,
            }}
          >
            {/* Header Sticky Action Bar */}
            <Layout.Header
              style={{
                position: "sticky",
                top: 0,
                zIndex: 100,
                backgroundColor: token.colorBgContainer,
                padding: "16px 24px",
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "12px",
                height: "auto",
              }}
            >
              <Button
                type="text"
                icon={<ShareAltOutlined />}
                style={{ fontSize: "20px" }}
              />
              <Button
                type="text"
                icon={<MoreOutlined />}
                style={{ fontSize: "20px" }}
              />
              <Divider type="vertical" />
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={() => setIsDrawerOpen(false)}
                style={{ fontSize: "20px" }}
              />
            </Layout.Header>

            {/* Banner Image Area */}
            <Layout
              style={{
                height: "240px",
                background: `linear-gradient(135deg, ${token.colorError} 0%, ${token.colorPrimary} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: token.colorTextLightSolid,
                textAlign: "center",
                padding: "40px",
              }}
            >
              <Layout style={{ backgroundColor: "transparent" }}>
                <Title
                  level={2}
                  style={{ color: token.colorTextLightSolid, margin: 0 }}
                >
                  KEEP LEARNING
                </Title>
                <Title
                  level={4}
                  style={{
                    color: token.colorTextLightSolid,
                    opacity: 0.8,
                    marginTop: "8px",
                  }}
                >
                  AND CURIOUS ON
                </Title>
              </Layout>
            </Layout>

            {/* Content Area */}
            <Layout.Content
              style={{
                padding: "0 40px 80px 40px",
                marginTop: "-40px",
                backgroundColor: "transparent",
              }}
            >
              <Card
                bordered={false}
                style={{
                  borderRadius: token.borderRadiusLG,
                  boxShadow: token.boxShadowTertiary,
                  backgroundColor: token.colorBgContainer,
                }}
                styles={{ body: { padding: "32px" } }}
              >
                <Row gutter={24} align="middle">
                  <Col flex="80px">
                    <Avatar
                      shape="square"
                      size={80}
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedJob.schoolName}&backgroundColor=003366`}
                    />
                  </Col>
                  <Col flex="auto">
                    <Title level={3} style={{ margin: 0 }}>
                      {selectedJob.title}
                    </Title>
                    <Space size={8}>
                      <Text strong style={{ fontSize: "16px" }}>
                        {selectedJob.schoolName}
                      </Text>
                      <Badge status="success" />
                      <Link href="#" style={{ color: "#1890ff" }}>
                        ดูงานทั้งหมดจากโรงเรียนนี้
                      </Link>
                    </Space>
                  </Col>
                </Row>

                <div style={{ marginTop: "24px" }}>
                  <Row gutter={[0, 16]}>
                    <Col span={24}>
                      <Space size={12}>
                        <EnvironmentOutlined style={{ color: "#8c8c8c" }} />
                        <Text>{selectedJob.address}</Text>
                      </Space>
                    </Col>
                    <Col span={24}>
                      <Space size={12}>
                        <TeamOutlined style={{ color: "#8c8c8c" }} />
                        <Text>
                          ฝ่ายวิชาการ / {selectedJob.subjects.join(", ")}
                        </Text>
                      </Space>
                    </Col>
                    <Col span={24}>
                      <Space size={12}>
                        <ClockCircleOutlined style={{ color: "#8c8c8c" }} />
                        <Text>งานเต็มเวลา</Text>
                      </Space>
                    </Col>
                  </Row>

                  <Text
                    type="secondary"
                    style={{ display: "block", marginTop: "16px" }}
                  >
                    โพสต์เมื่อ {dayjs(selectedJob.postedAt).fromNow()} •
                    มีผู้สนใจสมัครจำนวนมาก
                  </Text>
                </div>

                <div style={{ marginTop: "32px" }}>
                  <Space size={16}>
                    <Link href={`/pages/job/${selectedJob.id}/apply`}>
                      <Button
                        type="primary"
                        size="large"
                        style={{
                          height: "48px",
                          padding: "0 40px",
                          borderRadius: "8px",
                          backgroundColor: "#e60278",
                          borderColor: "#e60278",
                          fontWeight: 600,
                        }}
                      >
                        สมัครด่วน (Quick Apply)
                      </Button>
                    </Link>
                    <Button
                      size="large"
                      style={{
                        height: "48px",
                        padding: "0 40px",
                        borderRadius: "8px",
                        fontWeight: 600,
                      }}
                    >
                      บันทึกงาน
                    </Button>
                  </Space>
                </div>
              </Card>

              {/* How you match section */}
              <Card
                style={{
                  marginTop: "24px",
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                  border: "1px solid #f0f0f0",
                }}
                styles={{ body: { padding: "24px" } }}
              >
                <Space size={8} style={{ marginBottom: "16px" }}>
                  <Title level={5} style={{ margin: 0 }}>
                    ความเหมาะสมของคุณต่อตำแหน่งนี้
                  </Title>
                  <InfoCircleOutlined style={{ color: "#8c8c8c" }} />
                </Space>
                <Text
                  type="secondary"
                  style={{ display: "block", marginBottom: "16px" }}
                >
                  2 ทักษะและคุณสมบัติของคุณตรงกับความต้องการของโรงเรียน
                </Text>
                <Space size={[8, 12]} wrap>
                  <Tag
                    icon={<CheckCircleFilled />}
                    color="success"
                    style={{ padding: "4px 12px", borderRadius: "16px" }}
                  >
                    ประสบการณ์การสอน {selectedJob.teachingExperience}
                  </Tag>
                  <Tag
                    icon={<CheckCircleFilled />}
                    color="success"
                    style={{ padding: "4px 12px", borderRadius: "16px" }}
                  >
                    วุฒิ {selectedJob.educationLevel}
                  </Tag>
                </Space>
              </Card>

              {/* Roles and Responsibilities */}
              <div style={{ marginTop: "40px" }}>
                <Title level={4}>หน้าที่และความรับผิดชอบ:</Title>
                <ul
                  style={{
                    paddingLeft: "20px",
                    lineHeight: "2",
                    color: "#434343",
                    fontSize: "15px",
                  }}
                >
                  <li>
                    <strong>จัดการเรียนการสอน:</strong>{" "}
                    {selectedJob.description} ในระดับชั้น{" "}
                    {selectedJob.grades.join(", ")}
                  </li>
                  <li>
                    <strong>เตรียมแผนการจัดการเรียนรู้:</strong>{" "}
                    ออกแบบกิจกรรมการเรียนรู้ที่สอดคล้องกับหลักสูตรและเน้นผู้เรียนเป็นสำคัญ
                  </li>
                  <li>
                    <strong>วัดและประเมินผล:</strong>{" "}
                    ประเมินพัฒนาการของนักเรียนอย่างต่อเนื่องและจัดทำรายงานผลการเรียน
                  </li>
                  <li>
                    <strong>ให้คำปรึกษา:</strong>{" "}
                    ดูแลความประพฤติและให้คำแนะนำแก่นักเรียนร่วมกับผู้ปกครอง
                  </li>
                  <li>
                    เข้าร่วมกิจกรรมต่างๆ ของโรงเรียนและพัฒนาตนเองอย่างสม่ำเสมอ
                  </li>
                </ul>
              </div>

              {/* Qualifications */}
              <div style={{ marginTop: "40px" }}>
                <Title level={4}>คุณสมบัติผู้สมัคร:</Title>
                <ul
                  style={{
                    paddingLeft: "20px",
                    lineHeight: "2",
                    color: "#434343",
                    fontSize: "15px",
                  }}
                >
                  <li>
                    วุฒิการศึกษาระดับ {selectedJob.educationLevel}{" "}
                    ในสาขาที่เกี่ยวข้อง
                  </li>
                  <li>มีทักษะในการสื่อสารดีเยี่ยมและมีจิตวิทยาในการสอนเด็ก</li>
                  <li>
                    หากมีใบอนุญาตประกอบวิชาชีพครู ({selectedJob.licenseRequired}
                    ) จะพิจารณาเป็นพิเศษ
                  </li>
                  <li>มีประสบการณ์การสอน {selectedJob.teachingExperience}</li>
                  <li>สามารถทำงานร่วมกับผู้อื่นได้ดีและมีความรับผิดชอบสูง</li>
                </ul>
              </div>

              {/* Welfare */}
              <div style={{ marginTop: "40px" }}>
                <Title level={4}>สวัสดิการและสถานที่ทำงาน:</Title>
                <Space wrap size={[24, 12]}>
                  <Tag color="default" style={{ padding: "4px 12px" }}>
                    ประกันสังคม
                  </Tag>
                  <Tag color="default" style={{ padding: "4px 12px" }}>
                    ประกันสุขภาพกลุ่ม
                  </Tag>
                  <Tag color="default" style={{ padding: "4px 12px" }}>
                    โบนัสประจำปี
                  </Tag>
                  <Tag color="default" style={{ padding: "4px 12px" }}>
                    ชุดยูนิฟอร์ม
                  </Tag>
                  <Tag color="default" style={{ padding: "4px 12px" }}>
                    อาหารกลางวันฟรี
                  </Tag>
                </Space>
              </div>

              <Divider style={{ margin: "40px 0" }} />

              <div style={{ textAlign: "center" }}>
                <Title
                  level={4}
                  style={{
                    color: token.colorTextQuaternary,
                    letterSpacing: "2px",
                  }}
                >
                  SCHOOL JOB BOARD
                </Title>
              </div>
            </Layout.Content>
          </Layout>
        )}
      </Drawer>
    </Layout>
  );
}

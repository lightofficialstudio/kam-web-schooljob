"use client";

import {
  ClockCircleOutlined,
  DollarCircleOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  HistoryOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Input,
  Row,
  Select,
  Space,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/th";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";

dayjs.extend(relativeTime);
dayjs.locale("th");

const { Title, Text } = Typography;

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
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f7f9" }}>
      {/* 1. Header Search Area (JobsDB Blue Style) */}
      <div
        style={{
          backgroundColor: "#001e45",
          padding: "48px 0",
          color: "white",
        }}
      >
        <Row justify="center">
          <Col span={24} style={{ maxWidth: "1152px", padding: "0 24px" }}>
            <Row gutter={[16, 16]}>
              <Col span={10}>
                <Text
                  style={{
                    color: "white",
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: 600,
                  }}
                >
                  ค้นหางาน
                </Text>
                <Input
                  size="large"
                  placeholder="ค้นหาชื่อตำแหน่งงาน, คีย์เวิร์ด..."
                  prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ height: "48px" }}
                />
              </Col>
              <Col span={10}>
                <Text
                  style={{
                    color: "white",
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: 600,
                  }}
                >
                  สถานที่ทำงาน
                </Text>
                <Select
                  size="large"
                  placeholder="ทุกจังหวัด / เขตพื้นที่"
                  prefix={<EnvironmentOutlined />}
                  style={{ width: "100%", height: "48px" }}
                  showSearch
                  value={location || undefined}
                  onChange={setLocation}
                  options={[
                    { value: "กรุงเทพมหานคร", label: "กรุงเทพมหานคร" },
                    { value: "นนทบุรี", label: "นนทบุรี" },
                    { value: "สมุทรปราการ", label: "สมุทรปราการ" },
                    { value: "ปทุมธานี", label: "ปทุมธานี" },
                  ]}
                />
              </Col>
              <Col span={4} style={{ display: "flex", alignItems: "flex-end" }}>
                <Button
                  type="primary"
                  size="large"
                  block
                  style={{
                    height: "48px",
                    backgroundColor: "#e60278",
                    borderColor: "#e60278",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  ค้นหาเลย
                </Button>
              </Col>
              <Col span={24}>
                <Button type="link" style={{ color: "white", padding: 0 }}>
                  ตัวเลือกเพิ่มเติม <SearchOutlined />
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      {/* 2. Main content Area */}
      <Row
        justify="center"
        style={{ marginTop: "40px", paddingBottom: "80px" }}
      >
        <Col span={24} style={{ maxWidth: "1152px", padding: "0 24px" }}>
          <Row gutter={40}>
            {/* LEFT COLUMN: Job Listings */}
            <Col span={16}>
              <div style={{ marginBottom: "20px" }}>
                <Title
                  level={4}
                  style={{ display: "inline-block", marginRight: "8px" }}
                >
                  งานที่แนะนำสำหรับคุณ
                </Title>
                <Badge
                  count={MOCK_JOBS.length}
                  style={{ backgroundColor: "#9ca3af" }}
                />
              </div>

              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                {MOCK_JOBS.map((job) => (
                  <Card
                    key={job.id}
                    hoverable
                    style={{
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
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
                            style={{ margin: 0, color: "#001e45" }}
                          >
                            {job.title}
                          </Title>
                          <Text strong style={{ color: "#4B5563" }}>
                            {job.schoolName}
                          </Text>

                          <Space size={12} wrap style={{ marginTop: "12px" }}>
                            {job.isNew && (
                              <Tag
                                color="green"
                                style={{
                                  borderRadius: "4px",
                                  margin: 0,
                                  border: "none",
                                }}
                              >
                                มาใหม่
                              </Tag>
                            )}
                            {job.educationLevel.includes("ปริญญาโท") && (
                              <Tag
                                color="purple"
                                style={{
                                  borderRadius: "4px",
                                  margin: 0,
                                  border: "none",
                                }}
                              >
                                เน้นวุฒิสูง
                              </Tag>
                            )}
                          </Space>

                          <div style={{ marginTop: "16px" }}>
                            <Space direction="vertical" size={4}>
                              <Space size={12}>
                                <ClockCircleOutlined
                                  style={{ color: "#9ca3af" }}
                                />
                                <Text type="secondary">งานเต็มเวลา</Text>
                              </Space>
                              <Space size={12}>
                                <EnvironmentOutlined
                                  style={{ color: "#9ca3af" }}
                                />
                                <Text type="secondary">{job.address}</Text>
                              </Space>
                              <Space size={12}>
                                <DollarCircleOutlined
                                  style={{ color: "#9ca3af" }}
                                />
                                <Text type="secondary">
                                  {job.salaryType === "ระบุเงินเดือน"
                                    ? `฿${job.salaryMin?.toLocaleString()} - ฿${job.salaryMax?.toLocaleString()} ต่อเดือน`
                                    : "ตามประสบการณ์ / ไม่ระบุ"}
                                </Text>
                              </Space>
                            </Space>
                          </div>

                          <div
                            style={{
                              marginTop: "16px",
                              color: "#6b7280",
                              fontSize: "14px",
                            }}
                          >
                            <ul style={{ paddingLeft: "18px", margin: 0 }}>
                              <li>รับทั้งสิ้น {job.vacancyCount} อัตรา</li>
                              <li>ประสบการณ์: {job.teachingExperience}</li>
                              <li>ใบอนุญาต: {job.licenseRequired}</li>
                            </ul>
                          </div>
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
                          <HistoryOutlined /> {dayjs(job.postedAt).fromNow()}
                        </Text>
                      </Col>
                      <Col>
                        <Space size={12}>
                          <Button icon={<HeartOutlined />} />
                          <Button
                            type="link"
                            style={{ color: "#4b5563", fontWeight: 600 }}
                          >
                            ไม่สนใจ
                          </Button>
                        </Space>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </Space>
            </Col>

            {/* RIGHT COLUMN: Sidebar Tools */}
            <Col span={8}>
              <Space direction="vertical" size={24} style={{ width: "100%" }}>
                {/* 1. Saved Searches */}
                <Card bordered={false} style={{ borderRadius: "12px" }}>
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
                <Card bordered={false} style={{ borderRadius: "12px" }}>
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
                    backgroundColor: "#f9fafb",
                    borderRadius: "12px",
                    border: "1px solid #f3f4f6",
                  }}
                  styles={{ body: { padding: "24px" } }}
                >
                  <Space direction="vertical" size={16}>
                    <SafetyCertificateOutlined
                      style={{ fontSize: "32px", color: "#10b981" }}
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
    </div>
  );
}

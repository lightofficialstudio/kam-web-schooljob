"use client";

import {
  AppstoreOutlined,
  GlobalOutlined,
  MessageOutlined,
  RocketOutlined,
  SearchOutlined,
  SolutionOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import {
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
  return (
    <>
      {/* 🚀 Hero Section - The "One-Stop" Job Portal for Education */}
      <div
        style={{
          padding: "160px 24px 80px 24px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%)",
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            right: "-5%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
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
              background: "#fff",
              boxShadow: "0 30px 60px rgba(0, 0, 0, 0.12)",
              borderRadius: "32px",
              padding: "24px",
            }}
          >
            <Row gutter={[0, 0]} align="middle">
              {/* 💻 Search Input */}
              <Col xs={24} lg={8}>
                <div style={{ padding: "0 24px", textAlign: "left" }}>
                  <Text strong style={{ fontSize: "14px", color: "#8c8c8c" }}>
                    ค้นหางานที่คุณสนใจ
                  </Text>
                  <Input
                    prefix={<SearchOutlined style={{ color: "#1890ff" }} />}
                    placeholder="ตำแหน่งงาน, วิชาเอก หรือโรงเรียน"
                    style={{
                      fontSize: "16px",
                      padding: "12px 16px",
                      fontWeight: "500",
                      borderRadius: "12px",
                      border: "1px solid #e8e8e8",
                      backgroundColor: "#f5f5f5",
                    }}
                  />
                </div>
              </Col>

              {/* 📂 Job Categories (Cascader) */}
              <Col xs={24} lg={9}>
                <div style={{ padding: "0 24px", textAlign: "left" }}>
                  <Text strong style={{ fontSize: "14px", color: "#8c8c8c" }}>
                    ประเภทงาน
                  </Text>
                  <Cascader
                    options={JOB_CATEGORIES}
                    multiple
                    maxTagCount={1}
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
                      <SolutionOutlined style={{ color: "#1890ff" }} />
                    }
                    expandTrigger="click"
                  />
                </div>
              </Col>

              {/* 📍 Location Select */}
              <Col xs={24} lg={7}>
                <div style={{ padding: "0 24px", textAlign: "left" }}>
                  <Text strong style={{ fontSize: "14px", color: "#8c8c8c" }}>
                    สถานที่
                  </Text>
                  <Select
                    placeholder="ทุกจังหวัด"
                    style={{
                      width: "100%",
                      fontSize: "16px",
                    }}
                    size="large"
                    suffixIcon={<GlobalOutlined style={{ color: "#1890ff" }} />}
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
                borderTop: "1px solid #f0f0f0",
              }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={12} md={6} lg={5}>
                  <Select
                    placeholder="รูปแบบการจ้างงาน"
                    style={{ width: "100%" }}
                    size="large"
                    allowClear
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
                  >
                    <Option value="today">วันนี้</Option>
                    <Option value="3days">3 วันที่ผ่านมา</Option>
                    <Option value="7days">7 วันที่ผ่านมา</Option>
                    <Option value="30days">30 วันที่ผ่านมา</Option>
                  </Select>
                </Col>
                <Col xs={24} lg={4}>
                  <Button type="link" block style={{ color: "#8c8c8c" }}>
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
          background: "#fdfdfd",
          borderTop: "1px solid #f0f0f0",
          borderBottom: "1px solid #f0f0f0",
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
          background: "linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)",
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
              <Card
                cover={
                  <div
                    style={{
                      height: "350px",
                      borderRadius: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <SolutionOutlined
                      style={{
                        fontSize: "120px",
                        opacity: 0.3,
                      }}
                    />
                  </div>
                }
                style={{ borderRadius: "24px" }}
                variant="borderless"
              />
            </Col>
          </Row>
        </div>
      </div>

      {/* 🎓 Job Seeker Features */}
      <div
        style={{
          padding: "80px 24px",
          background: "#fafafa",
          borderTop: "1px solid #f0f0f0",
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
                icon: <SolutionOutlined />,
              },
              {
                title: "แจ้งเตือนงานตรงใจ",
                desc: "รับค่างานใหม่ตามวิชาเอกที่คุณระบุ",
                icon: <MessageOutlined />,
              },
              {
                title: "ติดตามสถานะ",
                desc: "ดูประวัติการสมัครและนัดสัมภาษณ์งาน",
                icon: <AppstoreOutlined />,
              },
              {
                title: "ประกาศเกียรติคุณ",
                desc: "ระบบยืนยันวิทยฐานะและการเข้าอบรม",
                icon: <TrophyOutlined />,
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
                        width: "60px",
                        height: "60px",
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "28px",
                      }}
                    >
                      {item.icon}
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

      {/* 💬 Support Floating */}
      <div
        style={{
          position: "fixed",
          right: "24px",
          bottom: "24px",
          zIndex: 1000,
        }}
      >
        <Badge dot status="processing">
          <Button
            type="primary"
            shape="circle"
            icon={<MessageOutlined style={{ fontSize: "24px" }} />}
            style={{
              width: "64px",
              height: "64px",
            }}
          />
        </Badge>
      </div>
    </>
  );
}

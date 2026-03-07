"use client";

import {
  AppstoreOutlined,
  BankOutlined,
  CalendarOutlined,
  FileSearchOutlined,
  GlobalOutlined,
  MessageOutlined,
  RocketOutlined,
  SearchOutlined,
  SolutionOutlined,
  TrophyOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
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

          {/* 🔍 Premium Search Bar */}
          <Card
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.06)",
              borderRadius: "24px",
              padding: "12px",
            }}
          >
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} lg={9}>
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="ชื่อตำแหน่งงาน, วิชาเอก หรือชื่อโรงเรียน"
                  variant="borderless"
                  style={{ fontSize: "16px", padding: "8px 12px" }}
                />
              </Col>
              <Col xs={0} lg={1}>
                <div
                  style={{
                    width: "1px",
                    height: "30px",
                    margin: "0 auto",
                  }}
                />
              </Col>
              <Col xs={24} lg={5}>
                <Select
                  placeholder="ตำแหน่งที่สนใจ"
                  variant="borderless"
                  style={{ width: "100%", textAlign: "left" }}
                  suffixIcon={<SolutionOutlined />}
                >
                  <Option value="teacher">ครูผู้สอน / อาจารย์</Option>
                  <Option value="tutor">ติวเตอร์ / ครูอัตราจ้าง</Option>
                  <Option value="admin">ธุรการ / การเงิน</Option>
                  <Option value="it">ไอที / ตลาดดิจิทัล</Option>
                </Select>
              </Col>
              <Col xs={0} lg={1}>
                <div
                  style={{
                    width: "1px",
                    height: "30px",
                    margin: "0 auto",
                  }}
                />
              </Col>
              <Col xs={24} lg={5}>
                <Select
                  placeholder="ทุกจังหวัด"
                  variant="borderless"
                  style={{ width: "100%", textAlign: "left" }}
                  suffixIcon={<GlobalOutlined />}
                >
                  <Option value="bkk">กรุงเทพมหานคร</Option>
                  <Option value="center">ภาคกลาง</Option>
                  <Option value="north">ภาคเหนือ</Option>
                  <Option value="east">ภาคตะวันออก</Option>
                </Select>
              </Col>
              <Col xs={24} lg={3}>
                <Button
                  type="primary"
                  block
                  size="large"
                  icon={<SearchOutlined />}
                  style={{
                    height: "54px",
                    borderRadius: "16px",
                    fontWeight: "bold",
                  }}
                >
                  ค้นหางาน
                </Button>
              </Col>
            </Row>
          </Card>

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

      {/* 📊 Statistics Section */}
      <div style={{ padding: "40px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Row gutter={[32, 32]}>
            {[
              {
                label: "ตำแหน่งงานเปิดรับ",
                value: "2,500+",
                icon: <FileSearchOutlined />,
              },
              {
                label: "สถาบันการศึกษา",
                value: "1,200+",
                icon: <BankOutlined />,
              },
              {
                label: "ผู้สมัครโปรไฟล์คุณภาพ",
                value: "45,000+",
                icon: <UsergroupAddOutlined />,
              },
              {
                label: "นัดสัมภาษณ์งาน/เดือน",
                value: "850+",
                icon: <CalendarOutlined />,
              },
            ].map((stat, idx) => (
              <Col xs={12} md={6} key={idx}>
                <Card
                  variant="borderless"
                  style={{ textAlign: "center", borderRadius: "20px" }}
                >
                  <div
                    style={{
                      fontSize: "24px",
                      marginBottom: "8px",
                    }}
                  >
                    {stat.icon}
                  </div>
                  <Title level={2} style={{ margin: 0 }}>
                    {stat.value}
                  </Title>
                  <Text type="secondary" strong>
                    {stat.label}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* 🏢 Employer Solutions Section */}
      <div style={{ padding: "100px 24px" }}>
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
      <div style={{ padding: "80px 24px" }}>
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

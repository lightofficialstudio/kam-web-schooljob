"use client";

import {
  BankOutlined,
  CalendarOutlined,
  CheckCircleFilled,
  EditOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  List,
  Row,
  Space,
  Tabs,
  Tag,
  Typography,
} from "antd";
import Link from "next/link";
import React from "react";

const { Title, Text, Paragraph } = Typography;

const MOCK_SCHOOL_PROFILE = {
  name: "โรงเรียนนานาชาติคัมสคูล (Kam School International)",
  type: "โรงเรียนเอกชน (นานาชาติ)",
  location: "เขตจตุจักร, กรุงเทพมหานคร",
  address: "123/45 ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900",
  website: "www.kamschool.ac.th",
  email: "hr@kamschool.ac.th",
  phone: "02-123-4567",
  established: "2545 (24 ปี)",
  size: "500 - 1,000 คน",
  description:
    "โรงเรียนนานาชาติคัมสคูล มุ่งเน้นการพัฒนาศักยภาพผู้เรียนสู่ความเป็นเลิศในระดับสากล ผ่านนวัตกรรมการเรียนรู้ที่ทันสมัยและสภาพแวดล้อมที่เอื้อต่อการสร้างสรรค์ เรากำลังมองหาบุคลากรทางการศึกษาที่มีความมุ่งมั่นเพื่อมาร่วมเป็นส่วนหนึ่งของครอบครัวเรา",
  vision: "สร้างผู้นำแห่งอนาคต ด้วยคุณธรรมและนวัตกรรม",
  gallery: [
    "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523050335392-9bf5675f42ec?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop",
  ],
};

export default function EmployerProfilePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        paddingBottom: "80px",
      }}
    >
      {/* 🌟 Header Banner Section */}
      <div
        style={{
          height: "280px",
          background: "linear-gradient(135deg, #001e45 0%, #003370 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            height: "100%",
            position: "relative",
          }}
        >
          <img
            src="https://illustrations.popsy.co/white/work-from-home.svg"
            alt="Decoration"
            style={{
              position: "absolute",
              right: "40px",
              bottom: "0",
              height: "100%",
              opacity: 0.2,
            }}
          />
        </div>
      </div>

      <div
        style={{
          maxWidth: "1100px",
          margin: "-80px auto 0",
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Row gutter={[24, 24]}>
          {/* 🟦 Left Column: Profile Info Card */}
          <Col xs={24} lg={8}>
            <Card
              variant="borderless"
              style={{
                borderRadius: "24px",
                textAlign: "center",
                boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
              }}
            >
              <Avatar
                size={140}
                icon={<BankOutlined />}
                src="https://api.dicebear.com/7.x/initials/svg?seed=KS"
                style={{
                  marginTop: "-110px",
                  border: "6px solid white",
                  backgroundColor: "#e60278",
                  boxShadow: "0 8px 24px rgba(230,2,120,0.2)",
                }}
              />
              <div style={{ marginTop: "16px" }}>
                <Title level={3} style={{ margin: 0 }}>
                  {MOCK_SCHOOL_PROFILE.name}
                </Title>
                <Tag
                  color="blue"
                  style={{ marginTop: "8px", borderRadius: "4px" }}
                >
                  <CheckCircleFilled /> ยืนยันตัวตนแล้ว
                </Tag>
              </div>

              <Divider />

              <div style={{ textAlign: "left" }}>
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                  <Space>
                    <EnvironmentOutlined style={{ color: "#8c8c8c" }} />{" "}
                    <Text>{MOCK_SCHOOL_PROFILE.location}</Text>
                  </Space>
                  <Space>
                    <GlobalOutlined style={{ color: "#8c8c8c" }} />{" "}
                    <a href={MOCK_SCHOOL_PROFILE.website}>
                      {MOCK_SCHOOL_PROFILE.website}
                    </a>
                  </Space>
                  <Space>
                    <MailOutlined style={{ color: "#8c8c8c" }} />{" "}
                    <Text>{MOCK_SCHOOL_PROFILE.email}</Text>
                  </Space>
                  <Space>
                    <PhoneOutlined style={{ color: "#8c8c8c" }} />{" "}
                    <Text>{MOCK_SCHOOL_PROFILE.phone}</Text>
                  </Space>
                </Space>
              </div>

              <Button
                block
                type="primary"
                icon={<EditOutlined />}
                style={{
                  marginTop: "24px",
                  height: "45px",
                  borderRadius: "12px",
                  backgroundColor: "#001e45",
                }}
              >
                แก้ไขข้อมูลโปรไฟล์
              </Button>
            </Card>

            <Card
              title="ภาพถ่ายโรงเรียน"
              variant="borderless"
              style={{
                borderRadius: "24px",
                marginTop: "24px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
              }}
            >
              <Row gutter={[8, 8]}>
                {MOCK_SCHOOL_PROFILE.gallery.map((img, idx) => (
                  <Col span={24} key={idx}>
                    <img
                      src={img}
                      alt="School"
                      style={{
                        width: "100%",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "12px",
                      }}
                    />
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>

          {/* ⬜ Right Column: Details & Jobs */}
          <Col xs={24} lg={16}>
            <Tabs
              defaultActiveKey="1"
              size="large"
              tabBarStyle={{ marginBottom: "24px" }}
              items={[
                {
                  key: "1",
                  label: "ข้อมูลโรงเรียน",
                  children: (
                    <Space
                      direction="vertical"
                      size={24}
                      style={{ width: "100%" }}
                    >
                      <Card
                        variant="borderless"
                        style={{
                          borderRadius: "24px",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
                        }}
                      >
                        <Title level={4}>
                          <SafetyCertificateOutlined
                            style={{ color: "#e60278" }}
                          />{" "}
                          เกี่ยวกับเรา
                        </Title>
                        <Paragraph
                          style={{
                            color: "#4b5563",
                            fontSize: "16px",
                            lineHeight: "1.8",
                          }}
                        >
                          {MOCK_SCHOOL_PROFILE.description}
                        </Paragraph>

                        <Divider />

                        <Row gutter={[24, 24]}>
                          <Col span={12}>
                            <StatisticItem
                              label="ประเภทโรงเรียน"
                              value={MOCK_SCHOOL_PROFILE.type}
                              icon={<BankOutlined />}
                            />
                          </Col>
                          <Col span={12}>
                            <StatisticItem
                              label="จำนวนบุคลากร"
                              value={MOCK_SCHOOL_PROFILE.size}
                              icon={<TeamOutlined />}
                            />
                          </Col>
                          <Col span={12}>
                            <StatisticItem
                              label="ก่อตั้งเมื่อปี"
                              value={MOCK_SCHOOL_PROFILE.established}
                              icon={<CalendarOutlined />}
                            />
                          </Col>
                          <Col span={12}>
                            <StatisticItem
                              label="วิสัยทัศน์"
                              value={MOCK_SCHOOL_PROFILE.vision}
                              icon={<GlobalOutlined />}
                            />
                          </Col>
                        </Row>
                      </Card>

                      <Card
                        variant="borderless"
                        style={{
                          borderRadius: "24px",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
                        }}
                      >
                        <Title level={4}>ที่ตั้งโรงเรียน</Title>
                        <Text type="secondary">
                          {MOCK_SCHOOL_PROFILE.address}
                        </Text>
                        <div
                          style={{
                            marginTop: "16px",
                            borderRadius: "16px",
                            overflow: "hidden",
                            height: "250px",
                            backgroundColor: "#eef2f6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Space direction="vertical" align="center">
                            <EnvironmentOutlined
                              style={{ fontSize: "32px", color: "#e60278" }}
                            />
                            <Text type="secondary">Google Map Placeholder</Text>
                          </Space>
                        </div>
                      </Card>
                    </Space>
                  ),
                },
                {
                  key: "2",
                  label: "ประกาศรับสมัครงาน",
                  children: (
                    <Card
                      variant="borderless"
                      style={{
                        borderRadius: "24px",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
                      }}
                    >
                      <Title level={4}>ตำแหน่งที่กำลังเปิดรับ</Title>
                      <List
                        itemLayout="horizontal"
                        dataSource={[
                          {
                            title: "ครูสอนภาษาอังกฤษ (Full-time)",
                            date: "2 วันที่แล้ว",
                            applicants: 12,
                          },
                          {
                            title: "ครูสอนคณิตศาสตร์ (Part-time)",
                            date: "5 วันที่แล้ว",
                            applicants: 3,
                          },
                        ]}
                        renderItem={(item) => (
                          <List.Item
                            actions={[
                              <Link href="/pages/employer/job/read" key="view">
                                ดูรายละเอียด
                              </Link>,
                            ]}
                          >
                            <List.Item.Meta
                              avatar={
                                <Avatar
                                  icon={<TeamOutlined />}
                                  style={{
                                    backgroundColor: "#f0f9ff",
                                    color: "#0369a1",
                                  }}
                                />
                              }
                              title={<Text strong>{item.title}</Text>}
                              description={
                                <Space split={<Divider type="vertical" />}>
                                  <Text type="secondary">
                                    <CalendarOutlined /> {item.date}
                                  </Text>
                                  <Text type="secondary">
                                    <TeamOutlined /> {item.applicants} ผู้สมัคร
                                  </Text>
                                </Space>
                              }
                            />
                          </List.Item>
                        )}
                      />
                    </Card>
                  ),
                },
              ]}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}

function StatisticItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Space align="start" size={12}>
      <div
        style={{
          padding: "8px",
          backgroundColor: "#f1f5f9",
          borderRadius: "8px",
          color: "#1e293b",
        }}
      >
        {icon}
      </div>
      <div>
        <Text type="secondary" style={{ fontSize: "12px", display: "block" }}>
          {label}
        </Text>
        <Text strong style={{ fontSize: "15px" }}>
          {value}
        </Text>
      </div>
    </Space>
  );
}

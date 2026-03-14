"use client";

import BaseModal from "@/app/components/layouts/modal/base-modal";
import {
  BankOutlined,
  BookOutlined,
  CalendarOutlined,
  CheckCircleFilled,
  EditOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  MailOutlined,
  MedicineBoxOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Row,
  Space,
  Tabs,
  Tag,
  theme,
  Typography,
} from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ProfileEditDrawer } from "./components/profile-edit-drawer";
import { StatisticItem } from "./components/statistic-item";
import {
  SchoolProfile,
  useSchoolProfileStore,
} from "./stores/school-profile-store";

const { Title, Text, Paragraph } = Typography;

export default function EmployerProfilePage() {
  const { profile, setProfile, setIsDrawerOpen } = useSchoolProfileStore();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { token } = theme.useToken();

  const handleEditClick = () => {
    setIsDrawerOpen(true);
  };

  const handleSave = (values: SchoolProfile) => {
    setProfile(values);
    setIsDrawerOpen(false);
    setIsSuccessModalOpen(true);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: token.colorBgLayout,
        paddingBottom: "80px",
      }}
    >
      {/* 🌟 Header Banner Section */}
      <Flex
        vertical
        align="center"
        justify="center"
        style={{
          height: "280px",
          background: "#001e45", // ทึบ มองง่าย
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            width: "100%",
            margin: "0 auto",
            height: "100%",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: "40px",
              bottom: "20px",
              height: "200px",
              width: "300px",
              zIndex: 0,
            }}
          >
            <Image
              src="/images/flat/undraw_hiring_8szx.svg"
              alt="Decoration"
              fill
              style={{
                objectFit: "contain",
              }}
            />
          </div>
          <Flex
            vertical
            justify="center"
            style={{
              height: "100%",
              padding: "0 40px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Title
              level={1}
              style={{ color: "white", margin: 0, fontSize: "48px" }}
            >
              โปรไฟล์โรงเรียน
            </Title>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: "20px" }}>
              จัดการข้อมูลและประกาศรับสมัครงานของคุณ
            </Text>
          </Flex>
        </div>
      </Flex>

      <div
        style={{
          maxWidth: "1100px",
          margin: "40px auto 0", // เปลี่ยนจาก -40px เป็น 40px เพื่อให้ไม่ทับกับส่วน Header
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Row gutter={[24, 24]}>
          {/* 🟦 Left Column: Profile Info Card */}
          <Col xs={24} lg={8}>
            <Flex vertical gap={24}>
              <Card
                variant="borderless"
                style={{
                  borderRadius: "16px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)", // เน้นเงาชัดเจนขึ้น
                  borderWidth: "2px",
                  borderStyle: "solid",
                  borderColor: token.colorBorderSecondary, // มีขอบให้ตัดชัด
                  backgroundColor: token.colorBgContainer, // มั่นใจว่ามีพื้นหลังทึบ
                }}
              >
                <Flex vertical align="center" gap={16}>
                  <Avatar
                    size={140}
                    icon={<BankOutlined />}
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`}
                    style={{
                      marginTop: "0", // ลบ Margin ติดลบออกเพื่อให้แสดงภายใน Card ปกติ
                      borderWidth: "6px",
                      borderStyle: "solid",
                      borderColor: "white",
                      backgroundColor: "#e60278",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  />
                  <Flex
                    vertical
                    align="center"
                    gap={8}
                    style={{ width: "100%" }}
                  >
                    <Title
                      level={2}
                      style={{
                        margin: 0,
                        textAlign: "center",
                        fontSize: "28px",
                      }}
                    >
                      {profile.name}
                    </Title>
                    <Space wrap justify="center">
                      <Tag
                        color="blue"
                        style={{
                          fontSize: "14px",
                          padding: "4px 12px",
                          borderRadius: "4px",
                          fontWeight: "bold",
                        }}
                      >
                        <CheckCircleFilled /> ยืนยันตัวตนแล้ว
                      </Tag>
                      <Tag
                        style={{
                          fontSize: "14px",
                          padding: "4px 12px",
                          borderRadius: "4px",
                          fontWeight: "bold",
                        }}
                      >
                        {profile.type}
                      </Tag>
                    </Space>
                  </Flex>

                  <Divider
                    style={{
                      margin: "16px 0",
                      borderBlockStart: `2px solid ${token.colorBorderSecondary}`,
                    }}
                  />

                  <Flex
                    vertical
                    gap={20}
                    style={{ width: "100%" }}
                    align="start"
                  >
                    <Space align="start" size={12}>
                      <EnvironmentOutlined
                        style={{
                          color: "#e60278",
                          fontSize: "20px",
                          marginTop: "4px",
                        }}
                      />
                      <Text style={{ fontSize: "16px", fontWeight: 500 }}>
                        {profile.location}
                      </Text>
                    </Space>
                    {profile.website && (
                      <Space size={12}>
                        <GlobalOutlined
                          style={{ color: "#e60278", fontSize: "20px" }}
                        />
                        <a
                          href={`https://${profile.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: "16px",
                            fontWeight: 500,
                            color: token.colorPrimary,
                          }}
                        >
                          {profile.website}
                        </a>
                      </Space>
                    )}
                    <Space size={12}>
                      <MailOutlined
                        style={{ color: "#e60278", fontSize: "20px" }}
                      />
                      <Text style={{ fontSize: "16px", fontWeight: 500 }}>
                        {profile.email}
                      </Text>
                    </Space>
                    <Space size={12}>
                      <PhoneOutlined
                        style={{ color: "#e60278", fontSize: "20px" }}
                      />
                      <Text style={{ fontSize: "16px", fontWeight: 500 }}>
                        {profile.phone}
                      </Text>
                    </Space>
                  </Flex>

                  <Button
                    block
                    type="primary"
                    size="large"
                    icon={<EditOutlined />}
                    onClick={handleEditClick}
                    style={{
                      marginTop: "16px",
                      height: "54px",
                      borderRadius: "8px",
                      background: "#001e45",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    แก้ไขข้อมูลโปรไฟล์
                  </Button>
                </Flex>
              </Card>

              {/* Section 5: School Photos */}
              {profile.gallery && profile.gallery.length > 0 && (
                <Card
                  title={
                    <Title level={4} style={{ margin: 0 }}>
                      ภาพถ่ายโรงเรียน
                    </Title>
                  }
                  variant="borderless"
                  style={{
                    borderRadius: "16px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    borderWidth: "2px",
                    borderStyle: "solid",
                    borderColor: token.colorBorderSecondary,
                  }}
                >
                  <Flex vertical gap={16}>
                    {profile.gallery.map((img, idx) => (
                      <div
                        key={idx}
                        style={{
                          width: "100%",
                          height: "180px",
                          position: "relative",
                          borderRadius: "8px",
                          overflow: "hidden",
                          borderWidth: "1px",
                          borderStyle: "solid",
                          borderColor: token.colorBorder,
                        }}
                      >
                        <Image
                          src={img}
                          alt="School"
                          fill
                          style={{
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    ))}
                  </Flex>
                </Card>
              )}
            </Flex>
          </Col>

          {/* ⬜ Right Column: Details & Jobs */}
          <Col xs={24} lg={16}>
            <Tabs
              defaultActiveKey="2"
              size="large"
              type="card" // แบบ Card เห็นชัดกว่า
              tabBarStyle={{
                marginBottom: "24px",
                background: token.colorBgContainer, // พื้นหลังของแถบ Tabs
                borderRadius: "12px 12px 0 0",
                padding: "8px 8px 0 8px",
                borderTopWidth: "1px",
                borderLeftWidth: "1px",
                borderRightWidth: "1px",
                borderBottomWidth: "0px",
                borderStyle: "solid",
                borderColor: token.colorBorderSecondary,
              }}
              items={[
                {
                  key: "2",
                  label: (
                    <span
                      style={{
                        padding: "0 20px",
                        fontSize: "18px",
                        fontWeight: "bold",
                      }}
                    >
                      ประกาศรับสมัครงาน
                    </span>
                  ),
                  children: (
                    <Card
                      variant="borderless"
                      style={{
                        borderRadius: "0 0 16px 16px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        borderLeftWidth: "2px",
                        borderRightWidth: "2px",
                        borderBottomWidth: "2px",
                        borderTopWidth: "0px",
                        borderStyle: "solid",
                        borderColor: token.colorBorderSecondary,
                        backgroundColor: token.colorBgContainer, // เพิ่มพื้นหลังทึบ
                      }}
                    >
                      <Flex
                        align="center"
                        justify="space-between"
                        style={{ marginBottom: "20px" }}
                      >
                        <Title level={3} style={{ margin: 0 }}>
                          ตำแหน่งที่เปิดรับ
                        </Title>
                        <div
                          style={{
                            height: "60px",
                            width: "100px",
                            position: "relative",
                          }}
                        >
                          <Image
                            src="/images/flat/undraw_job-offers_55y0.svg"
                            alt="Jobs"
                            fill
                            style={{
                              objectFit: "contain",
                            }}
                          />
                        </div>
                      </Flex>
                      <Flex vertical gap={16}>
                        {[
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
                        ].map((item, index) => (
                          <Card
                            key={index}
                            size="small"
                            style={{
                              padding: "12px",
                              borderWidth: "1px",
                              borderStyle: "solid",
                              borderColor: token.colorBorderSecondary,
                              borderRadius: "12px",
                              background: token.colorBgContainer,
                            }}
                          >
                            <Flex align="center" justify="space-between">
                              <Flex align="center" gap={16}>
                                <Avatar
                                  size={48}
                                  icon={<TeamOutlined />}
                                  style={{
                                    backgroundColor: "#f0f5ff",
                                    color: "#2f54eb",
                                    border: "1px solid #adc6ff",
                                  }}
                                />
                                <Flex vertical>
                                  <Text
                                    style={{
                                      fontSize: "18px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {item.title}
                                  </Text>
                                  <Space
                                    separator={
                                      <Divider orientation="vertical" />
                                    }
                                    style={{ marginTop: "4px" }}
                                  >
                                    <Text
                                      style={{
                                        fontSize: "14px",
                                        color: token.colorTextSecondary,
                                      }}
                                    >
                                      <CalendarOutlined /> {item.date}
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: "14px",
                                        color: "#e60278",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      <TeamOutlined /> {item.applicants}{" "}
                                      ผู้สมัคร
                                    </Text>
                                  </Space>
                                </Flex>
                              </Flex>
                              <Link href="/pages/employer/job/read">
                                <Button
                                  type="primary"
                                  size="middle"
                                  style={{
                                    borderRadius: "6px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ดูรายละเอียด
                                </Button>
                              </Link>
                            </Flex>
                          </Card>
                        ))}
                      </Flex>
                    </Card>
                  ),
                },
                {
                  key: "1",
                  label: (
                    <span
                      style={{
                        padding: "0 20px",
                        fontSize: "18px",
                        fontWeight: "bold",
                      }}
                    >
                      ข้อมูลโรงเรียน
                    </span>
                  ),
                  children: (
                    <Flex vertical gap={24}>
                      {/* Section 3: About School */}
                      {(profile.description || profile.vision) && (
                        <Card
                          variant="borderless"
                          style={{
                            borderRadius: "16px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            borderWidth: "2px",
                            borderStyle: "solid",
                            borderColor: token.colorBorderSecondary,
                            backgroundColor: token.colorBgContainer, // เพิ่มพื้นหลังทึบ
                          }}
                        >
                          {profile.description && (
                            <Flex vertical gap={16}>
                              <Title
                                level={3}
                                style={{
                                  margin: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "12px",
                                }}
                              >
                                <div
                                  style={{
                                    background: "#e60278",
                                    padding: "8px",
                                    borderRadius: "8px",
                                    display: "flex",
                                  }}
                                >
                                  <SafetyCertificateOutlined
                                    style={{ color: "white" }}
                                  />
                                </div>
                                เกี่ยวกับเรา
                              </Title>
                              <Paragraph
                                style={{
                                  color: token.colorText,
                                  fontSize: "18px",
                                  lineHeight: "1.8",
                                  whiteSpace: "pre-line",
                                }}
                              >
                                {profile.description}
                              </Paragraph>
                            </Flex>
                          )}
                          {profile.vision && (
                            <Flex
                              vertical
                              gap={16}
                              style={{ marginTop: "32px" }}
                            >
                              <Divider
                                style={{
                                  borderBlockStartWidth: "2px",
                                  borderBlockStartStyle: "solid",
                                  borderBlockStartColor:
                                    token.colorBorderSecondary,
                                }}
                              />
                              <Title
                                level={3}
                                style={{
                                  margin: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "12px",
                                }}
                              >
                                <div
                                  style={{
                                    background: "#001e45",
                                    padding: "8px",
                                    borderRadius: "8px",
                                    display: "flex",
                                  }}
                                >
                                  <ThunderboltOutlined
                                    style={{ color: "white" }}
                                  />
                                </div>
                                วิสัยทัศน์
                              </Title>
                              <Paragraph
                                style={{
                                  color: token.colorText,
                                  fontSize: "18px",
                                  lineHeight: "1.8",
                                }}
                              >
                                {profile.vision}
                              </Paragraph>
                            </Flex>
                          )}
                        </Card>
                      )}

                      {/* Section 4: Benefits */}
                      {profile.benefits && profile.benefits.length > 0 && (
                        <Card
                          title={
                            <Title
                              level={3}
                              style={{
                                margin: 0,
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                              }}
                            >
                              <div
                                style={{
                                  background: "#52c41a",
                                  padding: "8px",
                                  borderRadius: "8px",
                                  display: "flex",
                                }}
                              >
                                <MedicineBoxOutlined
                                  style={{ color: "white" }}
                                />
                              </div>
                              สวัสดิการและจุดเด่น
                            </Title>
                          }
                          variant="borderless"
                          style={{
                            borderRadius: "16px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            backgroundColor: token.colorBgContainer, // เพิ่มพื้นหลังทึบ
                            borderWidth: "2px",
                            borderStyle: "solid",
                            borderColor: token.colorBorderSecondary,
                          }}
                        >
                          <Row gutter={[20, 20]}>
                            {profile.benefits.map((benefit, index) => (
                              <Col xs={24} sm={12} key={index}>
                                <Space size={12}>
                                  <CheckCircleFilled
                                    style={{
                                      color: "#52c41a",
                                      fontSize: "20px",
                                    }}
                                  />
                                  <Text
                                    style={{
                                      fontSize: "17px",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {benefit}
                                  </Text>
                                </Space>
                              </Col>
                            ))}
                          </Row>
                        </Card>
                      )}

                      {/* Section 6: Additional Info */}
                      <Card
                        title={
                          <Title
                            level={3}
                            style={{
                              margin: 0,
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <div
                              style={{
                                background: "#fa8c16",
                                padding: "8px",
                                borderRadius: "8px",
                                display: "flex",
                              }}
                            >
                              <InfoCircleOutlined style={{ color: "white" }} />
                            </div>
                            ข้อมูลเพิ่มเติม
                          </Title>
                        }
                        variant="borderless"
                        style={{
                          borderRadius: "16px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          backgroundColor: token.colorBgContainer, // เพิ่มพื้นหลังทึบ
                          borderWidth: "2px",
                          borderStyle: "solid",
                          borderColor: token.colorBorderSecondary,
                        }}
                      >
                        <Row gutter={[24, 24]}>
                          {profile.type && (
                            <Col xs={24} sm={12}>
                              <StatisticItem
                                label="ประเภทโรงเรียน"
                                value={profile.type}
                                icon={
                                  <BankOutlined style={{ fontSize: "24px" }} />
                                }
                              />
                            </Col>
                          )}
                          {profile.size && (
                            <Col xs={24} sm={12}>
                              <StatisticItem
                                label="จำนวนบุคลากร"
                                value={profile.size}
                                icon={
                                  <TeamOutlined style={{ fontSize: "24px" }} />
                                }
                              />
                            </Col>
                          )}
                          {profile.curriculum && (
                            <Col xs={24} sm={12}>
                              <StatisticItem
                                label="หลักสูตร"
                                value={profile.curriculum}
                                icon={
                                  <BookOutlined style={{ fontSize: "24px" }} />
                                }
                              />
                            </Col>
                          )}
                          {profile.established && (
                            <Col xs={24} sm={12}>
                              <StatisticItem
                                label="ก่อตั้งเมื่อปี"
                                value={profile.established}
                                icon={
                                  <CalendarOutlined
                                    style={{ fontSize: "24px" }}
                                  />
                                }
                              />
                            </Col>
                          )}
                          {profile.levels && profile.levels.length > 0 && (
                            <Col span={24}>
                              <StatisticItem
                                label="ระดับชั้นที่เปิดสอน"
                                value={profile.levels.join(", ")}
                                icon={
                                  <EditOutlined style={{ fontSize: "24px" }} />
                                }
                              />
                            </Col>
                          )}
                        </Row>
                      </Card>

                      <Card
                        title={
                          <Title level={4} style={{ margin: 0 }}>
                            ที่ตั้งโรงเรียน
                          </Title>
                        }
                        variant="borderless"
                        style={{
                          borderRadius: "16px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          backgroundColor: token.colorBgContainer, // เพิ่มพื้นหลังทึบ
                          borderWidth: "2px",
                          borderStyle: "solid",
                          borderColor: token.colorBorderSecondary,
                        }}
                      >
                        <Flex vertical gap={20}>
                          <Text style={{ fontSize: "16px", fontWeight: 500 }}>
                            {profile.address}
                          </Text>
                          <Flex
                            align="center"
                            justify="center"
                            style={{
                              borderRadius: "12px",
                              borderWidth: "1px",
                              borderStyle: "solid",
                              borderColor: "#d9d9d9",
                            }}
                          >
                            <Flex vertical align="center" gap={8}>
                              <EnvironmentOutlined
                                style={{ fontSize: "48px", color: "#e60278" }}
                              />
                              <Text
                                style={{ fontSize: "18px", color: "#8c8c8c" }}
                              >
                                Google Map Placeholder
                              </Text>
                            </Flex>
                          </Flex>
                        </Flex>
                      </Card>
                    </Flex>
                  ),
                },
              ]}
            />
          </Col>
        </Row>
      </div>

      <ProfileEditDrawer onSave={handleSave} />

      <BaseModal
        open={isSuccessModalOpen}
        onCancel={() => setIsSuccessModalOpen(false)}
        type="success"
        mainTitle="อัปเดตข้อมูลสำเร็จ"
        subTitle="ข้อมูลโปรไฟล์โรงเรียนของคุณถูกบันทึกเรียบร้อยแล้ว"
        icon={<CheckCircleFilled style={{ color: token.colorSuccess }} />}
      >
        <Button
          block
          type="primary"
          size="large"
          onClick={() => setIsSuccessModalOpen(false)}
        >
          ตกลง
        </Button>
      </BaseModal>
    </div>
  );
}

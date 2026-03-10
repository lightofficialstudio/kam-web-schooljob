"use client";

import {
  ArrowLeftOutlined,
  DownOutlined,
  EditOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Radio,
  Row,
  Select,
  Space,
  Steps,
  Typography,
} from "antd";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

const { Title, Text } = Typography;

export default function JobApplyPage() {
  const params = useParams();
  const router = useRouter();
  const [resumeOption, setResumeOption] = useState("select");
  const [coverLetterOption, setCoverLetterOption] = useState("none");

  // ข้อมูลจำลอง (Mock Data) สำหรับบริษัท
  const jobInfo = {
    title: "ครูสอนภาษาอังกฤษ (English Teacher)",
    company: "โรงเรียนนานาชาติแสงทอง",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=ST&backgroundColor=003366",
  };

  const steps = [
    { title: "เลือกเอกสาร" },
    { title: "คำถามจากนายจ้าง" },
    { title: "อัปเดตโปรไฟล์" },
    { title: "ตรวจสอบและส่ง" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fff",
        paddingBottom: "100px",
      }}
    >
      {/* Navigation Header */}
      <div style={{ padding: "16px 40px", borderBottom: "1px solid #f0f0f0" }}>
        <Link href="/pages/job">
          <Button type="text" icon={<ArrowLeftOutlined />}>
            กลับไปที่หน้าค้นหา
          </Button>
        </Link>
      </div>

      <Row justify="center" style={{ marginTop: "40px" }}>
        <Col xs={24} sm={22} md={18} lg={14} xl={12}>
          {/* 1. Job Summary Header */}
          <div style={{ display: "flex", gap: "24px", marginBottom: "40px" }}>
            <Avatar
              shape="square"
              size={80}
              src={jobInfo.logo}
              style={{ border: "1px solid #f0f0f0" }}
            />
            <div>
              <Text type="secondary" style={{ fontSize: "14px" }}>
                กำลังสมัครตำแหน่งคลิก
              </Text>
              <Title level={3} style={{ margin: "4px 0" }}>
                {jobInfo.title}
              </Title>
              <Text strong>{jobInfo.company}</Text>
              <div style={{ marginTop: "4px" }}>
                <Link href="#" style={{ fontSize: "14px" }}>
                  ดูรายละเอียดงาน
                </Link>
              </div>
            </div>
          </div>

          {/* 2. Steps Indicator */}
          <div style={{ marginBottom: "60px" }}>
            <Steps
              current={0}
              size="small"
              items={steps}
              labelPlacement="vertical"
            />
          </div>

          {/* 3. User Profile Card (JobsDB Dark Style) */}
          <Card
            bordered={false}
            style={{
              backgroundColor: "#001e45",
              borderRadius: "16px",
              color: "white",
              position: "relative",
              overflow: "hidden",
              marginBottom: "40px",
            }}
          >
            {/* Decoration Circles */}
            <div
              style={{
                position: "absolute",
                right: "-50px",
                bottom: "-50px",
                width: "200px",
                height: "200px",
                backgroundColor: "#e60278",
                borderRadius: "50%",
                opacity: 0.8,
              }}
            />
            <div
              style={{
                position: "absolute",
                right: "20px",
                top: "-30px",
                width: "100px",
                height: "100px",
                backgroundColor: "#164c7e",
                borderRadius: "50%",
                opacity: 0.5,
              }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
              <Title
                level={4}
                style={{
                  color: "white",
                  margin: 0,
                  textTransform: "uppercase",
                }}
              >
                THANAT PROMPIRIYA
              </Title>
              <Space
                direction="vertical"
                size={8}
                style={{ marginTop: "16px" }}
              >
                <Text
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <EnvironmentOutlined /> Bang Sue, Bangkok
                </Text>
                <Text
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <PhoneOutlined /> +66 0646356524
                </Text>
                <Text
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <MailOutlined /> lightofficialstudio@gmail.com
                </Text>
              </Space>
              <div style={{ marginTop: "24px" }}>
                <Button
                  ghost
                  icon={<EditOutlined />}
                  style={{
                    borderRadius: "6px",
                    fontWeight: 600,
                    padding: "0 24px",
                  }}
                >
                  แก้ไข
                </Button>
              </div>
            </div>
          </Card>

          {/* 4. Resume Selection Section */}
          <div style={{ marginBottom: "40px" }}>
            <Title level={4}>เรซูเม่ (Resumé)</Title>
            <Radio.Group
              value={resumeOption}
              onChange={(e) => setResumeOption(e.target.value)}
              style={{ width: "100%" }}
            >
              <Space direction="vertical" style={{ width: "100%" }} size={16}>
                <Radio value="upload">อัปโหลดเรซูเม่</Radio>

                <Radio value="select" style={{ width: "100%" }}>
                  <div style={{ width: "100%" }}>
                    เลือกเรซูเม่
                    {resumeOption === "select" && (
                      <Select
                        placeholder="กรุณาเลือกเรซูเม่"
                        style={{ width: "100%", marginTop: "12px" }}
                        suffixIcon={<DownOutlined />}
                        defaultValue="resume-1"
                        options={[
                          {
                            value: "resume-1",
                            label: "Thanat_Resume_2024.pdf",
                          },
                          {
                            value: "resume-2",
                            label: "Teacher_English_Profile.pdf",
                          },
                        ]}
                      />
                    )}
                  </div>
                </Radio>

                <Radio value="none">ไม่รวมเรซูเม่</Radio>
              </Space>
            </Radio.Group>
          </div>

          {/* 5. Cover Letter Section */}
          <div style={{ marginBottom: "40px" }}>
            <Title level={4}>จดหมายนำหน้า (Cover letter)</Title>
            <Radio.Group
              value={coverLetterOption}
              onChange={(e) => setCoverLetterOption(e.target.value)}
              style={{ width: "100%" }}
            >
              <Space direction="vertical" style={{ width: "100%" }} size={16}>
                <Radio value="upload">อัปโหลดจดหมายนำหน้า</Radio>
                <Radio value="write">เขียนจดหมายนำหน้า</Radio>
                <Radio value="none">ไม่รวมจดหมายนำหน้า</Radio>
              </Space>
            </Radio.Group>
          </div>

          <Text
            type="secondary"
            style={{ fontSize: "13px", display: "block", marginBottom: "24px" }}
          >
            ปลอดภัยไว้ก่อน. อย่าใส่ข้อมูลส่วนตัวที่ละเอียดอ่อนลงในเอกสารของคุณ.
            <Link href="#" style={{ marginLeft: "4px" }}>
              ดูข้อมูลเพิ่มเติมเรื่องความเป็นส่วนตัว
            </Link>
          </Text>

          {/* 6. Footer Action Button */}
          <div style={{ textAlign: "center", marginTop: "60px" }}>
            <Button
              type="primary"
              size="large"
              style={{
                height: "48px",
                padding: "0 60px",
                borderRadius: "8px",
                backgroundColor: "#164c7e",
                borderColor: "#164c7e",
                fontWeight: 600,
              }}
            >
              ดำเนินการต่อ (Continue)
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
}

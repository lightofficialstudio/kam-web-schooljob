"use client";

import {
  DownOutlined,
  FileTextOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import {
  theme as antTheme,
  Card,
  Layout,
  Radio,
  Select,
  Space,
  Typography,
} from "antd";
import { useApplyStore } from "../stores/apply-store";

const { Text } = Typography;

export default function DocumentSection() {
  const { token } = antTheme.useToken();
  const {
    resumeOption,
    setResumeOption,
    coverLetterOption,
    setCoverLetterOption,
    selectedResume,
    setSelectedResume,
  } = useApplyStore();

  return (
    <Space
      direction="vertical"
      size={24}
      style={{ width: "100%", marginBottom: 40 }}
    >
      {/* Resume Section */}
      <Card
        title={
          <Space size={12}>
            <FileTextOutlined
              style={{ color: token.colorPrimary, fontSize: "20px" }}
            />
            <Text strong style={{ fontSize: "18px" }}>
              เรซูเม่ (Resumé)
            </Text>
          </Space>
        }
        variant="outlined"
        style={{
          borderRadius: token.borderRadiusLG,
          borderColor: token.colorBorderSecondary,
          backgroundColor: token.colorBgContainer,
          boxShadow: token.boxShadowTertiary,
        }}
        styles={{
          header: {
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            padding: "16px 24px",
          },
          body: { padding: "24px" },
        }}
      >
        <Radio.Group
          value={resumeOption}
          onChange={(e) => setResumeOption(e.target.value)}
          style={{ width: "100%" }}
        >
          <Space direction="vertical" style={{ width: "100%" }} size={20}>
            <Radio value="upload">
              <Text
                style={{
                  color: token.colorText,
                  fontSize: "16px",
                  marginLeft: "8px",
                }}
              >
                อัปโหลดเรซูเม่ใหม่ (.pdf, .doc)
              </Text>
            </Radio>

            <Radio value="select" style={{ width: "100%" }}>
              <Layout
                style={{
                  backgroundColor: "transparent",
                  width: "100%",
                  display: "inline-flex",
                  flexDirection: "column",
                  paddingLeft: "8px",
                }}
              >
                <Text style={{ color: token.colorText, fontSize: "16px" }}>
                  เลือกเรซูเม่ที่มีอยู่ในระบบ
                </Text>
                {resumeOption === "select" && (
                  <Select
                    placeholder="กรุณาเลือกเรซูเม่"
                    style={{ width: "100%", marginTop: 12 }}
                    size="large"
                    suffixIcon={<DownOutlined />}
                    value={selectedResume}
                    onChange={setSelectedResume}
                    options={[
                      { value: "resume-1", label: "Thanat_Resume_2024.pdf" },
                      {
                        value: "resume-2",
                        label: "Teacher_English_Profile.pdf",
                      },
                    ]}
                  />
                )}
              </Layout>
            </Radio>

            <Radio value="none">
              <Text
                style={{
                  color: token.colorTextSecondary,
                  fontSize: "16px",
                  marginLeft: "8px",
                }}
              >
                ไม่รวมเรซูเม่ (ฉันจะส่งภายหลัง)
              </Text>
            </Radio>
          </Space>
        </Radio.Group>
      </Card>

      {/* Cover Letter Section */}
      <Card
        title={
          <Space size={12}>
            <ProfileOutlined
              style={{ color: token.colorPrimary, fontSize: "20px" }}
            />
            <Text strong style={{ fontSize: "18px" }}>
              จดหมายนำหน้า (Cover letter)
            </Text>
          </Space>
        }
        variant="outlined"
        style={{
          borderRadius: token.borderRadiusLG,
          borderColor: token.colorBorderSecondary,
          backgroundColor: token.colorBgContainer,
          boxShadow: token.boxShadowTertiary,
        }}
        styles={{
          header: {
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            padding: "16px 24px",
          },
          body: { padding: "24px" },
        }}
      >
        <Radio.Group
          value={coverLetterOption}
          onChange={(e) => setCoverLetterOption(e.target.value)}
          style={{ width: "100%" }}
        >
          <Space direction="vertical" style={{ width: "100%" }} size={20}>
            <Radio value="upload">
              <Text
                style={{
                  color: token.colorText,
                  fontSize: "16px",
                  marginLeft: "8px",
                }}
              >
                อัปโหลดจดหมายนำหน้า
              </Text>
            </Radio>
            <Radio value="write">
              <Text
                style={{
                  color: token.colorText,
                  fontSize: "16px",
                  marginLeft: "8px",
                }}
              >
                เขียนจดหมายแนะนำตัวหน้าเว็บ
              </Text>
            </Radio>
            <Radio value="none">
              <Text
                style={{
                  color: token.colorTextSecondary,
                  fontSize: "16px",
                  marginLeft: "8px",
                }}
              >
                ไม่รวมจดหมายนำหน้า
              </Text>
            </Radio>
          </Space>
        </Radio.Group>
      </Card>
    </Space>
  );
}

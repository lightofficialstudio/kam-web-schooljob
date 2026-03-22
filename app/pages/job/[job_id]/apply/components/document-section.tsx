"use client";

import {
  DownOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  ProfileOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  theme as antTheme,
  Button,
  Card,
  Input,
  Layout,
  Radio,
  Select,
  Space,
  Typography,
  Upload,
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
      {/* Introduction Section */}
      <Card
        title={
          <Space size={12}>
            <ProfileOutlined
              style={{ color: token.colorPrimary, fontSize: "20px" }}
            />
            <Text strong style={{ fontSize: "18px" }}>
              ข้อความแนะนำตัว
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
        <Input.TextArea
          rows={5}
          placeholder="แนะนำตัว หรือบอกเหตุผลที่สนใจตำแหน่งนี้ เพื่อให้โรงเรียนรู้จักคุณมากขึ้น (ไม่บังคับ)"
          style={{
            borderRadius: "12px",
            padding: "16px",
            fontSize: "15px",
          }}
        />
      </Card>

      {/* Resume Section */}
      <Card
        title={
          <Space size={12}>
            <FileTextOutlined
              style={{ color: token.colorPrimary, fontSize: "20px" }}
            />
            <Text strong style={{ fontSize: "18px" }}>
              เรซูเม่ (Resume)
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
              {resumeOption === "upload" && (
                <div style={{ marginTop: 12, paddingLeft: 32 }}>
                  <Upload maxCount={1}>
                    <Button icon={<UploadOutlined />}>คลิกเพื่ออัปโหลด</Button>
                  </Upload>
                </div>
              )}
            </Radio>

            <Radio value="none">
              <Text
                style={{
                  color: token.colorTextSecondary,
                  fontSize: "16px",
                  marginLeft: "8px",
                }}
              >
                ไม่แนบเรซูเม่
              </Text>
            </Radio>
          </Space>
        </Radio.Group>
      </Card>

      {/* Other Documents Section */}
      <Card
        title={
          <Space size={12}>
            <FolderOpenOutlined
              style={{ color: token.colorPrimary, fontSize: "20px" }}
            />
            <Text strong style={{ fontSize: "18px" }}>
              เอกสารอื่น ๆ (เช่น Portfolio, ประกาศนียบัตร)
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
        <Space direction="vertical" style={{ width: "100%" }} size={16}>
          <Text type="secondary">
            คุณสามารถอัปโหลดไฟล์เพิ่มเติมได้ (เช่น แฟ้มสะสมผลงาน หรือเอกสารอื่น
            ๆ ที่เป็นประโยชน์)
          </Text>
          <Upload
            action="/api/upload"
            listType="text"
            maxCount={3}
            multiple
            style={{ width: "100%" }}
          >
            <Button
              icon={<UploadOutlined />}
              size="large"
              style={{ width: "100%", height: "50px", borderRadius: "8px" }}
            >
              คลิกเพื่ออัปโหลดเอกสาร (ไม่เกิน 3 ไฟล์)
            </Button>
          </Upload>
          <Text
            type="secondary"
            style={{ fontSize: "12px", display: "block", marginTop: "8px" }}
          >
            รองรับไฟล์ .pdf, .jpg, .png, .doc (ขนาดไม่เกิน 10MB ต่อไฟล์)
          </Text>
        </Space>
      </Card>
    </Space>
  );
}

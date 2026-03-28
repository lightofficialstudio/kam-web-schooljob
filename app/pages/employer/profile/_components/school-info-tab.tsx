"use client";

// Tab ข้อมูลโรงเรียน — เกี่ยวกับเรา, วิสัยทัศน์, สวัสดิการ, ข้อมูลเพิ่มเติม, ที่ตั้ง
import {
  BankOutlined,
  BookOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  MedicineBoxOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import {
  Card,
  Col,
  Descriptions,
  Empty,
  Flex,
  List,
  Row,
  Tag,
  Typography,
} from "antd";

import type { SchoolProfile } from "../_state/school-profile.state";

const { Title, Paragraph, Text } = Typography;

// Section header component ใช้ซ้ำได้ภายใน tab นี้
const SectionTitle: React.FC<{
  icon: React.ReactNode;
  color: string;
  text: string;
}> = ({ icon, color, text }) => (
  <Flex align="center" gap={10} style={{ marginBottom: 16 }}>
    <Flex
      align="center"
      justify="center"
      style={{
        background: color,
        width: 36,
        height: 36,
        borderRadius: 8,
        color: "white",
        fontSize: 16,
        flexShrink: 0,
      }}
    >
      {icon}
    </Flex>
    <Title level={4} style={{ margin: 0 }}>
      {text}
    </Title>
  </Flex>
);

interface SchoolInfoTabProps {
  profile: SchoolProfile;
}

export const SchoolInfoTab: React.FC<SchoolInfoTabProps> = ({ profile }) => {
  const hasAboutSection = profile.description || profile.vision;
  const hasBenefits = profile.benefits && profile.benefits.length > 0;

  return (
    <Flex vertical gap={20}>
      {/* ─── เกี่ยวกับเรา + วิสัยทัศน์ ─── */}
      {hasAboutSection && (
        <Card variant="borderless" style={{ borderRadius: 16 }}>
          {profile.description && (
            <>
              <SectionTitle
                icon={<SafetyCertificateOutlined />}
                color="#e60278"
                text="เกี่ยวกับเรา"
              />
              <Paragraph
                style={{ fontSize: 15, lineHeight: 1.9, marginBottom: 0 }}
              >
                {profile.description}
              </Paragraph>
            </>
          )}

          {profile.vision && (
            <div style={{ marginTop: profile.description ? 24 : 0 }}>
              {profile.description && (
                <div
                  style={{
                    height: 1,
                    background: "var(--ant-color-border)",
                    marginBottom: 24,
                  }}
                />
              )}
              <SectionTitle
                icon={<ThunderboltOutlined />}
                color="#001e45"
                text="วิสัยทัศน์"
              />
              <div
                style={{
                  borderLeft: "4px solid #11b6f5",
                  paddingLeft: 16,
                  background: "var(--ant-color-fill-quaternary)",
                  borderRadius: "0 8px 8px 0",
                  padding: "12px 16px",
                }}
              >
                <Paragraph
                  style={{
                    fontSize: 16,
                    fontStyle: "italic",
                    margin: 0,
                    lineHeight: 1.7,
                  }}
                >
                  &ldquo;{profile.vision}&rdquo;
                </Paragraph>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* ─── สวัสดิการ ─── */}
      {hasBenefits && (
        <Card variant="borderless" style={{ borderRadius: 16 }}>
          <SectionTitle
            icon={<MedicineBoxOutlined />}
            color="#52c41a"
            text="สวัสดิการและจุดเด่น"
          />
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 2 }}
            dataSource={profile.benefits}
            renderItem={(benefit) => (
              <List.Item style={{ marginBottom: 4 }}>
                <Flex align="center" gap={10}>
                  <CheckCircleOutlined
                    style={{ color: "#52c41a", fontSize: 18, flexShrink: 0 }}
                  />
                  <Text style={{ fontSize: 15 }}>{benefit}</Text>
                </Flex>
              </List.Item>
            )}
          />
        </Card>
      )}

      {/* ─── ข้อมูลเพิ่มเติม (Descriptions) ─── */}
      <Card variant="borderless" style={{ borderRadius: 16 }}>
        <SectionTitle
          icon={<InfoCircleOutlined />}
          color="#fa8c16"
          text="ข้อมูลเพิ่มเติม"
        />
        <Descriptions
          bordered
          column={{ xs: 1, sm: 2 }}
          size="middle"
          labelStyle={{ fontWeight: 600, width: 160 }}
        >
          {profile.type && (
            <Descriptions.Item
              label={
                <Flex align="center" gap={6}>
                  <BankOutlined /> ประเภทโรงเรียน
                </Flex>
              }
            >
              {profile.type}
            </Descriptions.Item>
          )}
          {profile.size && (
            <Descriptions.Item
              label={
                <Flex align="center" gap={6}>
                  <TeamOutlined /> จำนวนบุคลากร
                </Flex>
              }
            >
              {profile.size}
            </Descriptions.Item>
          )}
          {profile.curriculum && (
            <Descriptions.Item
              label={
                <Flex align="center" gap={6}>
                  <BookOutlined /> หลักสูตร
                </Flex>
              }
            >
              {profile.curriculum}
            </Descriptions.Item>
          )}
          {profile.established && (
            <Descriptions.Item
              label={
                <Flex align="center" gap={6}>
                  <CalendarOutlined /> ก่อตั้งปี พ.ศ.
                </Flex>
              }
            >
              {profile.established}
            </Descriptions.Item>
          )}
          {profile.levels && profile.levels.length > 0 && (
            <Descriptions.Item
              label={
                <Flex align="center" gap={6}>
                  <BookOutlined /> ระดับชั้นที่เปิดสอน
                </Flex>
              }
              span={2}
            >
              <Flex gap={6} wrap="wrap">
                {profile.levels.map((level) => (
                  <Tag key={level} color="blue">
                    {level}
                  </Tag>
                ))}
              </Flex>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* ─── ที่ตั้งโรงเรียน ─── */}
      <Card variant="borderless" style={{ borderRadius: 16 }}>
        <SectionTitle
          icon={<EnvironmentOutlined />}
          color="#11b6f5"
          text="ที่ตั้งโรงเรียน"
        />
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Flex align="flex-start" gap={8}>
              <EnvironmentOutlined
                style={{
                  color: "#e60278",
                  fontSize: 16,
                  marginTop: 3,
                  flexShrink: 0,
                }}
              />
              <Text style={{ fontSize: 15 }}>{profile.address}</Text>
            </Flex>
          </Col>
          <Col span={24}>
            <Flex
              align="center"
              justify="center"
              vertical
              gap={8}
              style={{
                height: 180,
                background: "var(--ant-color-fill-quaternary)",
                borderRadius: 12,
                border: "1px dashed var(--ant-color-border)",
              }}
            >
              <EnvironmentOutlined
                style={{ fontSize: 40, color: "#e60278", opacity: 0.5 }}
              />
              <Text type="secondary">Google Maps · กำลังพัฒนา</Text>
            </Flex>
          </Col>
        </Row>
      </Card>

      {/* แสดง empty state หากไม่มีข้อมูลใดเลย */}
      {!hasAboutSection && !hasBenefits && !profile.type && (
        <Empty description="ยังไม่มีข้อมูลโรงเรียน กรุณาแก้ไขโปรไฟล์" />
      )}
    </Flex>
  );
};

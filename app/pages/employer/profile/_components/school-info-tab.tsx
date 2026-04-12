"use client";

// Tab ข้อมูลโรงเรียน — เกี่ยวกับเรา, วิสัยทัศน์, สวัสดิการ, ข้อมูลเพิ่มเติม, ที่ตั้ง
import {
  BankOutlined,
  BookOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  EditOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  MedicineBoxOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Flex, Row, Tag, theme, Typography } from "antd";

import type { SchoolProfile } from "../_state/school-profile.state";

const { Title, Paragraph, Text } = Typography;

// ─── EmptyFieldPrompt ────────────────────────────────────────────────────────
// แสดงเมื่อไม่มีข้อมูล พร้อมปุ่มจูงใจให้ผู้ใช้กรอก
const EmptyFieldPrompt: React.FC<{
  hint: string;
  onEdit: () => void;
}> = ({ hint, onEdit }) => {
  const { token } = theme.useToken();
  return (
    <Flex
      align="center"
      justify="space-between"
      style={{
        padding: "14px 18px",
        borderRadius: 10,
        border: `1.5px dashed ${token.colorBorder}`,
        background: token.colorFillQuaternary,
      }}
    >
      <Text type="secondary" style={{ fontSize: 14 }}>
        {hint}
      </Text>
      <Button
        size="small"
        type="link"
        icon={<EditOutlined />}
        onClick={onEdit}
        style={{ padding: 0, fontWeight: 600 }}
      >
        กรอกข้อมูล
      </Button>
    </Flex>
  );
};

// InfoItem — แสดง label + value แบบ 2-column ต่อ 1 row อ่านง่าย
const InfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}> = ({ icon, label, value }) => {
  const { token } = theme.useToken();
  return (
    <Flex
      align="flex-start"
      gap={12}
      style={{
        padding: "14px 16px",
        borderRadius: 10,
        background: token.colorFillQuaternary,
        border: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <Flex
        align="center"
        justify="center"
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: token.colorFillTertiary,
          color: token.colorTextSecondary,
          flexShrink: 0,
          fontSize: 16,
        }}
      >
        {icon}
      </Flex>
      <Flex vertical gap={2}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {label}
        </Text>
        <Text strong style={{ fontSize: 14 }}>
          {value}
        </Text>
      </Flex>
    </Flex>
  );
};

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
  onEditClick: () => void;
}

export const SchoolInfoTab: React.FC<SchoolInfoTabProps> = ({
  profile,
  onEditClick,
}) => {
  const hasBenefits = profile.benefits && profile.benefits.length > 0;

  return (
    <Flex vertical gap={20}>
      {/* ─── เกี่ยวกับเรา + วิสัยทัศน์ ─── */}
      <Card variant="borderless" style={{ borderRadius: 16 }}>
        <SectionTitle
          icon={<SafetyCertificateOutlined />}
          color="#e60278"
          text="เกี่ยวกับเรา"
        />
        {profile.description ? (
          <Paragraph style={{ fontSize: 15, lineHeight: 1.9, marginBottom: 0 }}>
            {profile.description}
          </Paragraph>
        ) : (
          <EmptyFieldPrompt
            hint="✍️ แนะนำโรงเรียนของคุณ — ข้อมูลนี้ช่วยให้ครูสนใจสมัครงานมากขึ้น!"
            onEdit={onEditClick}
          />
        )}

        <div
          style={{
            height: 1,
            background: "var(--ant-color-border)",
            margin: "20px 0",
          }}
        />

        <SectionTitle
          icon={<ThunderboltOutlined />}
          color="#001e45"
          text="วิสัยทัศน์"
        />
        {profile.vision ? (
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
        ) : (
          <EmptyFieldPrompt
            hint="🎯 วิสัยทัศน์ที่ชัดเจนสร้างความน่าเชื่อถือและดึงดูดครูที่มีคุณภาพ"
            onEdit={onEditClick}
          />
        )}
      </Card>

      {/* ─── สวัสดิการ ─── */}
      <Card variant="borderless" style={{ borderRadius: 16 }}>
        <SectionTitle
          icon={<MedicineBoxOutlined />}
          color="#52c41a"
          text="สวัสดิการและจุดเด่น"
        />
        {hasBenefits ? (
          <Row gutter={[16, 8]}>
            {profile.benefits.map((benefit) => (
              <Col key={benefit} xs={24} sm={12}>
                <Flex align="center" gap={10} style={{ marginBottom: 4 }}>
                  <CheckCircleOutlined
                    style={{ color: "#52c41a", fontSize: 18, flexShrink: 0 }}
                  />
                  <Text style={{ fontSize: 15 }}>{benefit}</Text>
                </Flex>
              </Col>
            ))}
          </Row>
        ) : (
          <EmptyFieldPrompt
            hint="🎁 โรงเรียนที่ระบุสวัสดิการชัดเจนได้รับผู้สมัครมากกว่าถึง 3 เท่า!"
            onEdit={onEditClick}
          />
        )}
      </Card>

      {/* ─── ข้อมูลเพิ่มเติม ─── */}
      <Card variant="borderless" style={{ borderRadius: 16 }}>
        <SectionTitle
          icon={<InfoCircleOutlined />}
          color="#fa8c16"
          text="ข้อมูลเพิ่มเติม"
        />
        <Row gutter={[16, 16]}>
          {profile.type && (
            <Col xs={24} sm={12}>
              <InfoItem
                icon={<BankOutlined />}
                label="ประเภทโรงเรียน"
                value={profile.type}
              />
            </Col>
          )}
          {profile.size && (
            <Col xs={24} sm={12}>
              <InfoItem
                icon={<TeamOutlined />}
                label="จำนวนบุคลากร"
                value={profile.size}
              />
            </Col>
          )}
          {profile.curriculum && (
            <Col xs={24} sm={12}>
              <InfoItem
                icon={<BookOutlined />}
                label="หลักสูตร"
                value={profile.curriculum}
              />
            </Col>
          )}
          {profile.established && (
            <Col xs={24} sm={12}>
              <InfoItem
                icon={<CalendarOutlined />}
                label="ก่อตั้งปี พ.ศ."
                value={profile.established}
              />
            </Col>
          )}
          {profile.levels && profile.levels.length > 0 && (
            <Col span={24}>
              <InfoItem
                icon={<BookOutlined />}
                label="ระดับชั้นที่เปิดสอน"
                value={
                  <Flex gap={6} wrap="wrap">
                    {profile.levels.map((level) => (
                      <Tag key={level} color="blue">
                        {level}
                      </Tag>
                    ))}
                  </Flex>
                }
              />
            </Col>
          )}
        </Row>
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
            {profile.address ? (
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
            ) : (
              <EmptyFieldPrompt
                hint="📍 ที่อยู่เต็มช่วยให้ครูในพื้นที่ค้นพบโรงเรียนของคุณได้ง่ายขึ้น"
                onEdit={onEditClick}
              />
            )}
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
    </Flex>
  );
};

"use client";

// ✨ Tab ข้อมูลโรงเรียน — เกี่ยวกับเรา, วิสัยทัศน์, สวัสดิการ, ข้อมูลเพิ่มเติม, ที่ตั้ง
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
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Flex, Row, Tag, theme, Typography } from "antd";
import Image from "next/image";

import type { SchoolProfile } from "../_state/school-profile.state";

const { Title, Paragraph, Text } = Typography;

// ─── EmptyFieldPrompt ────────────────────────────────────────────────────────
const EmptyFieldPrompt: React.FC<{ hint: string; onEdit: () => void }> = ({
  hint,
  onEdit,
}) => {
  const { token } = theme.useToken();
  return (
    <Flex
      align="center"
      justify="space-between"
      style={{
        padding: "14px 18px",
        borderRadius: 14,
        border: `2px dashed ${token.colorErrorBorder}`,
        background: token.colorErrorBg,
        transition: "all 0.3s ease",
      }}
      className="hover:bg-red-100/50"
    >
      <Flex vertical gap={4}>
        <Text
          style={{
            fontSize: 13,
            color: token.colorError,
            fontWeight: 700,
            display: "flex",
            alignCenter: "center",
            gap: 6,
          }}
        >
          <InfoCircleOutlined /> โปรดระบุข้อมูล *
        </Text>
        <Text
          type="secondary"
          style={{ fontSize: 14, color: token.colorErrorText }}
        >
          {hint}
        </Text>
      </Flex>
      <Button
        size="middle"
        type="primary"
        danger
        icon={<EditOutlined />}
        onClick={onEdit}
        style={{
          padding: "0 20px",
          fontWeight: 800,
          borderRadius: 10,
          boxShadow: `0 4px 12px ${token.colorErrorShadow}`,
        }}
      >
        กรอกข้อมูล
      </Button>
    </Flex>
  );
};

// ─── InfoItem ────────────────────────────────────────────────────────────────
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

// ─── SectionTitle ─────────────────────────────────────────────────────────────
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
  const { token } = theme.useToken();
  const hasBenefits = profile.benefits && profile.benefits.length > 0;

  return (
    <Flex vertical gap={20}>
      {/* ─── Cover Image (ถ้ามี) ─── */}
      {profile.coverImageUrl && (
        <div
          style={{
            width: "100%",
            height: 220,
            position: "relative",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <Image
            src={profile.coverImageUrl}
            alt="ภาพปกโรงเรียน"
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      )}

      {/* ─── เกี่ยวกับเรา + วิสัยทัศน์ ─── */}
      <Card variant="borderless" style={{ borderRadius: 16 }}>
        <SectionTitle
          icon={<SafetyCertificateOutlined />}
          color={token.colorPrimary}
          text="เกี่ยวกับเรา"
        />
        {profile.description ? (
          <Paragraph style={{ fontSize: 15, lineHeight: 1.9, marginBottom: 0 }}>
            {profile.description}
          </Paragraph>
        ) : (
          <EmptyFieldPrompt
            hint="แนะนำโรงเรียนของคุณ — ข้อมูลนี้ช่วยให้ครูสนใจสมัครงานมากขึ้น!"
            onEdit={onEditClick}
          />
        )}

        <div
          style={{
            height: 1,
            background: token.colorBorderSecondary,
            margin: "20px 0",
          }}
        />

        <SectionTitle
          icon={<ThunderboltOutlined />}
          color={token.colorPrimary}
          text="วิสัยทัศน์"
        />
        {profile.vision ? (
          <div
            style={{
              borderLeft: `4px solid ${token.colorPrimary}`,
              background: token.colorFillQuaternary,
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
            hint="วิสัยทัศน์ที่ชัดเจนสร้างความน่าเชื่อถือและดึงดูดครูที่มีคุณภาพ"
            onEdit={onEditClick}
          />
        )}
      </Card>

      {/* ─── สวัสดิการ ─── */}
      <Card variant="borderless" style={{ borderRadius: 16 }}>
        <SectionTitle
          icon={<MedicineBoxOutlined />}
          color={token.colorPrimary}
          text="สวัสดิการและจุดเด่น"
        />
        {hasBenefits ? (
          <Row gutter={[16, 8]}>
            {profile.benefits!.map((benefit) => (
              <Col key={benefit} xs={24} sm={12}>
                <Flex align="center" gap={10} style={{ marginBottom: 4 }}>
                  <CheckCircleOutlined
                    style={{ color: token.colorSuccess, fontSize: 18, flexShrink: 0 }}
                  />
                  <Text style={{ fontSize: 15 }}>{benefit}</Text>
                </Flex>
              </Col>
            ))}
          </Row>
        ) : (
          <EmptyFieldPrompt
            hint="โรงเรียนที่ระบุสวัสดิการชัดเจนได้รับผู้สมัครมากกว่าถึง 3 เท่า!"
            onEdit={onEditClick}
          />
        )}
      </Card>

      {/* ─── ข้อมูลเพิ่มเติม ─── */}
      <Card variant="borderless" style={{ borderRadius: 16 }}>
        <SectionTitle
          icon={<InfoCircleOutlined />}
          color={token.colorPrimary}
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
          {profile.affiliation && (
            <Col xs={24} sm={12}>
              <InfoItem
                icon={<SafetyCertificateOutlined />}
                label="สังกัด"
                value={profile.affiliation}
              />
            </Col>
          )}
          {profile.teacherCount !== undefined && profile.teacherCount > 0 && (
            <Col xs={24} sm={12}>
              <InfoItem
                icon={<TeamOutlined />}
                label="จำนวนครู"
                value={`${profile.teacherCount.toLocaleString()} คน`}
              />
            </Col>
          )}
          {profile.studentCount !== undefined && profile.studentCount > 0 && (
            <Col xs={24} sm={12}>
              <InfoItem
                icon={<UserOutlined />}
                label="จำนวนนักเรียน"
                value={`${profile.studentCount.toLocaleString()} คน`}
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
          color={token.colorPrimary}
          text="ที่ตั้งโรงเรียน"
        />
        <Row gutter={[16, 16]}>
          <Col span={24}>
            {profile.address ? (
              <Flex align="flex-start" gap={8}>
                <EnvironmentOutlined
                  style={{
                    color: token.colorPrimary,
                    fontSize: 16,
                    marginTop: 3,
                    flexShrink: 0,
                  }}
                />
                <Text style={{ fontSize: 15 }}>{profile.address}</Text>
              </Flex>
            ) : (
              <EmptyFieldPrompt
                hint="ที่อยู่เต็มช่วยให้ครูในพื้นที่ค้นพบโรงเรียนของคุณได้ง่ายขึ้น"
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
                background: token.colorFillQuaternary,
                borderRadius: 12,
                border: `1px dashed ${token.colorBorder}`,
              }}
            >
              <EnvironmentOutlined
                style={{ fontSize: 40, color: token.colorTextQuaternary }}
              />
              <Text type="secondary">Google Maps · กำลังพัฒนา</Text>
            </Flex>
          </Col>
        </Row>
      </Card>
    </Flex>
  );
};

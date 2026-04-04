"use client";

import {
  BookOutlined,
  BulbOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Col,
  Divider,
  Flex,
  Modal,
  Row,
  Tag,
  Timeline,
  Typography,
  theme,
} from "antd";
import { useApplicantDrawerStore } from "../_state/applicant-drawer-store";

const { Text, Title } = Typography;
const PRIMARY = "#11b6f5";

// หัวข้อ Section ใน Modal
const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => {
  const { token } = theme.useToken();
  return (
    <Flex align="center" gap={8} style={{ marginBottom: 12 }}>
      <Flex
        align="center"
        justify="center"
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          backgroundColor: `${PRIMARY}18`,
          color: PRIMARY,
          fontSize: 14,
        }}
      >
        {icon}
      </Flex>
      <Text strong style={{ fontSize: 14, color: token.colorText }}>
        {title}
      </Text>
    </Flex>
  );
};

// Modal แสดงโปรไฟล์เต็มของผู้สมัคร (read-only)
export const ApplicantProfileModal = () => {
  const { token } = theme.useToken();
  const { profileModalOpen, selectedApplicant, closeProfileModal } = useApplicantDrawerStore();

  if (!selectedApplicant) return null;
  const a = selectedApplicant;

  return (
    <Modal
      open={profileModalOpen}
      onCancel={closeProfileModal}
      footer={null}
      width={940}
      title={null}
      styles={{
        body: { padding: 0, maxHeight: "88vh", overflowY: "auto" },
        content: { borderRadius: 16, overflow: "hidden" },
      }}
    >
      {/* ─── Hero Banner ─── */}
      <Flex
        style={{
          background: `linear-gradient(135deg, ${PRIMARY} 0%, #0ea5e9 100%)`,
          padding: "36px 40px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circle */}
        <Flex
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }}
        />
        <Flex align="flex-end" gap={20}>
          <Avatar
            size={80}
            icon={<UserOutlined />}
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              border: "3px solid rgba(255,255,255,0.5)",
              fontSize: 32,
              flexShrink: 0,
            }}
          />
          <Flex vertical gap={4} style={{ paddingBottom: 4 }}>
            <Title level={3} style={{ margin: 0, color: "#fff", fontWeight: 700 }}>
              {a.name}
            </Title>
            <Flex gap={16} wrap="wrap">
              <Flex align="center" gap={5}>
                <MailOutlined style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }} />
                <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>{a.email}</Text>
              </Flex>
              <Flex align="center" gap={5}>
                <PhoneOutlined style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }} />
                <Text style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>{a.phone}</Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      {/* ─── Content ─── */}
      <Flex vertical gap={0} style={{ padding: "28px 40px 40px" }}>
        {/* Summary Card */}
        {a.summary && (
          <Flex
            style={{
              background: token.colorFillQuaternary,
              borderRadius: 12,
              padding: "18px 22px",
              marginBottom: 32,
              border: `1px solid ${token.colorBorderSecondary}`,
            }}
          >
            <Text style={{ fontSize: 14, lineHeight: 1.8, color: token.colorText }}>
              {a.summary}
            </Text>
          </Flex>
        )}

        <Row gutter={[32, 32]}>
          {/* Left Column */}
          <Col xs={24} md={14}>
            {/* ประวัติการทำงาน */}
            {a.workExperiences?.length ? (
              <>
                <SectionHeader icon={<SolutionOutlined />} title="ประวัติการทำงาน" />
                <Timeline
                  style={{ marginBottom: 32 }}
                  items={a.workExperiences.map((w) => ({
                    color: PRIMARY,
                    children: (
                      <Flex vertical gap={4} style={{ paddingBottom: 8 }}>
                        <Text strong style={{ fontSize: 14 }}>{w.jobTitle}</Text>
                        <Text type="secondary" style={{ fontSize: 13 }}>{w.companyName}</Text>
                        <Flex align="center" gap={4}>
                          <CalendarOutlined style={{ color: token.colorTextTertiary, fontSize: 12 }} />
                          <Text type="secondary" style={{ fontSize: 12 }}>{w.period}</Text>
                        </Flex>
                        {w.description && (
                          <Text style={{ fontSize: 13, color: token.colorTextSecondary, marginTop: 6, lineHeight: 1.7 }}>
                            {w.description}
                          </Text>
                        )}
                      </Flex>
                    ),
                  }))}
                />
              </>
            ) : null}

            {/* ประวัติการศึกษา */}
            {a.educations?.length ? (
              <>
                <Divider style={{ margin: "8px 0 24px" }} />
                <SectionHeader icon={<BookOutlined />} title="ประวัติการศึกษา" />
                <Flex vertical gap={14} style={{ marginBottom: 8 }}>
                  {a.educations.map((edu, i) => (
                    <Flex
                      key={i}
                      style={{
                        padding: "12px 14px",
                        borderRadius: 10,
                        border: `1px solid ${token.colorBorderSecondary}`,
                        backgroundColor: token.colorFillQuaternary,
                      }}
                      vertical
                      gap={3}
                    >
                      <Flex justify="space-between" align="flex-start">
                        <Text strong style={{ fontSize: 13 }}>{edu.major}</Text>
                        {edu.gpa && (
                          <Tag color="blue" style={{ fontSize: 11 }}>GPA {edu.gpa}</Tag>
                        )}
                      </Flex>
                      <Text type="secondary" style={{ fontSize: 12 }}>{edu.institution}</Text>
                      <Flex align="center" gap={8}>
                        <Tag style={{ fontSize: 11, borderRadius: 6 }}>{edu.level}</Tag>
                        {edu.graduationYear && (
                          <Text type="secondary" style={{ fontSize: 11 }}>สำเร็จการศึกษา พ.ศ. {edu.graduationYear}</Text>
                        )}
                      </Flex>
                    </Flex>
                  ))}
                </Flex>
              </>
            ) : null}
          </Col>

          {/* Right Column: Skills & Info */}
          <Col xs={24} md={10}>
            {/* วิชาที่สอน */}
            <SectionHeader icon={<BulbOutlined />} title="วิชาที่เชี่ยวชาญ" />
            <Flex gap={8} wrap="wrap" style={{ marginBottom: 28 }}>
              {a.subjects.map((s) => (
                <Tag key={s} color={PRIMARY} style={{ borderRadius: 20, fontSize: 12, padding: "2px 12px" }}>{s}</Tag>
              ))}
            </Flex>

            {/* ระดับชั้นที่สอน */}
            {a.gradeCanTeach?.length ? (
              <>
                <SectionHeader icon={<TeamOutlined />} title="ระดับชั้นที่สอน" />
                <Flex gap={8} wrap="wrap" style={{ marginBottom: 28 }}>
                  {a.gradeCanTeach.map((g) => (
                    <Tag key={g} style={{ borderRadius: 20, fontSize: 12, padding: "2px 12px" }}>{g}</Tag>
                  ))}
                </Flex>
              </>
            ) : null}

            {/* ประสบการณ์ */}
            <SectionHeader icon={<CalendarOutlined />} title="ประสบการณ์" />
            <Flex
              align="center"
              gap={8}
              style={{
                padding: "12px 16px",
                borderRadius: 10,
                backgroundColor: `${PRIMARY}12`,
                marginBottom: 28,
              }}
            >
              <Text strong style={{ color: PRIMARY, fontSize: 15 }}>{a.experience}</Text>
            </Flex>

            {/* ภาษา */}
            {a.languagesSpoken?.length ? (
              <>
                <SectionHeader icon={<GlobalOutlined />} title="ภาษา" />
                <Flex gap={8} wrap="wrap" style={{ marginBottom: 28 }}>
                  {a.languagesSpoken.map((l) => (
                    <Tag key={l} color="cyan" style={{ borderRadius: 20, fontSize: 12, padding: "2px 12px" }}>{l}</Tag>
                  ))}
                </Flex>
              </>
            ) : null}

            {/* ทักษะ IT */}
            {a.itSkills?.length ? (
              <>
                <SectionHeader icon={<SolutionOutlined />} title="ทักษะ IT" />
                <Flex gap={8} wrap="wrap" style={{ marginBottom: 28 }}>
                  {a.itSkills.map((s) => (
                    <Tag key={s} color="orange" style={{ borderRadius: 20, fontSize: 12, padding: "2px 12px" }}>{s}</Tag>
                  ))}
                </Flex>
              </>
            ) : null}

            {/* จังหวัดที่ต้องการทำงาน */}
            {a.preferredProvinces?.length ? (
              <>
                <SectionHeader icon={<EnvironmentOutlined />} title="จังหวัดที่สนใจ" />
                <Flex gap={8} wrap="wrap">
                  {a.preferredProvinces.map((p) => (
                    <Tag key={p} icon={<EnvironmentOutlined />} style={{ borderRadius: 20, fontSize: 12, padding: "2px 12px" }}>{p}</Tag>
                  ))}
                </Flex>
              </>
            ) : null}
          </Col>
        </Row>
      </Flex>
    </Modal>
  );
};

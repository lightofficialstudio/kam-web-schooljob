"use client";

import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MailOutlined,
  PhoneOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Drawer,
  Empty,
  Flex,
  Popconfirm,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  NEW_APPLICANTS_MODE,
  type ApplicantStatus,
  useApplicantDrawerStore,
} from "../_state/applicant-drawer-store";

const { Text, Title } = Typography;

const PRIMARY = "#11b6f5";

// Config สถานะผู้สมัคร: สี, ข้อความ, icon
const STATUS_CONFIG: Record<
  ApplicantStatus,
  { color: string; text: string; bg: string; border: string }
> = {
  PENDING:  { color: "#F59E0B", text: "รอพิจารณา",      bg: "#FFFBEB", border: "#FDE68A" },
  INTERVIEW:{ color: PRIMARY,   text: "นัดสัมภาษณ์",    bg: "#EFF9FF", border: "#BAE6FD" },
  ACCEPTED: { color: "#10B981", text: "รับเข้าทำงาน",   bg: "#F0FDF4", border: "#BBF7D0" },
  REJECTED: { color: "#EF4444", text: "ไม่ผ่านการคัดเลือก", bg: "#FEF2F2", border: "#FECACA" },
};

const FILTER_TABS: { key: ApplicantStatus | "ALL"; label: string }[] = [
  { key: "ALL",       label: "ทั้งหมด" },
  { key: "PENDING",   label: "รอพิจารณา" },
  { key: "INTERVIEW", label: "นัดสัมภาษณ์" },
  { key: "ACCEPTED",  label: "รับเข้าทำงาน" },
  { key: "REJECTED",  label: "ไม่ผ่าน" },
];

// Drawer แสดงรายชื่อผู้สมัครของตำแหน่งที่เลือก พร้อมจัดการสถานะ
export const ApplicantDrawer = () => {
  const {
    isOpen,
    selectedJobId,
    selectedJobTitle,
    filterStatus,
    closeDrawer,
    setFilterStatus,
    getApplicants,
    getAllApplicants,
    updateApplicantStatus,
  } = useApplicantDrawerStore();

  const isNewMode = selectedJobId === NEW_APPLICANTS_MODE;
  const applicants = getApplicants();
  const allUnfiltered = getAllApplicants();

  // นับผู้สมัครแต่ละสถานะจาก raw list (ไม่ผ่าน filterStatus)
  const countByStatus = (status: ApplicantStatus | "ALL") => {
    if (status === "ALL") return allUnfiltered.length;
    return allUnfiltered.filter((a) => a.status === status).length;
  };

  return (
    <Drawer
      title={
        <Flex vertical gap={2}>
          <Title level={5} style={{ margin: 0 }}>
            ผู้สมัครทั้งหมด
          </Title>
          <Text type="secondary" style={{ fontSize: 13, fontWeight: 400 }}>
            {selectedJobTitle}
          </Text>
        </Flex>
      }
      placement="right"
      size="large"
      open={isOpen}
      onClose={closeDrawer}
      styles={{ body: { padding: "0" } }}
    >
      {/* Filter Tabs */}
      <Flex
        gap={8}
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #F1F5F9",
          overflowX: "auto",
          flexShrink: 0,
        }}
      >
        {FILTER_TABS.map((tab) => {
          const count = countByStatus(tab.key);
          const isActive = filterStatus === tab.key;
          return (
            <Button
              key={tab.key}
              size="small"
              onClick={() => setFilterStatus(tab.key)}
              style={{
                borderRadius: 20,
                fontWeight: isActive ? 700 : 400,
                background: isActive ? PRIMARY : "#F1F5F9",
                color: isActive ? "#fff" : "#64748B",
                border: "none",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
              {count > 0 && (
                <Badge
                  count={count}
                  size="small"
                  style={{
                    marginLeft: 4,
                    backgroundColor: isActive ? "rgba(255,255,255,0.3)" : "#E2E8F0",
                    color: isActive ? "#fff" : "#64748B",
                    boxShadow: "none",
                    fontSize: 10,
                  }}
                />
              )}
            </Button>
          );
        })}
      </Flex>

      {/* Applicant List */}
      <Flex vertical style={{ padding: "16px 24px", gap: 12, overflowY: "auto" }}>
        {applicants.length === 0 ? (
          <Flex justify="center" align="center" style={{ padding: "60px 0" }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Text type="secondary">ไม่มีผู้สมัครในสถานะนี้</Text>
              }
            />
          </Flex>
        ) : (
          applicants.map((applicant) => {
            const cfg = STATUS_CONFIG[applicant.status];
            return (
              <Flex
                key={applicant.key}
                vertical
                gap={12}
                style={{
                  padding: "16px",
                  borderRadius: 12,
                  border: "1px solid #E2E8F0",
                  backgroundColor: "#FAFAFA",
                }}
              >
                {/* Row 1: Avatar + Name + Status */}
                <Flex justify="space-between" align="flex-start">
                  <Flex gap={12} align="center">
                    <Avatar
                      size={44}
                      style={{ backgroundColor: PRIMARY, fontSize: 18, flexShrink: 0 }}
                      icon={<UserOutlined />}
                    />
                    <Flex vertical gap={3}>
                      <Text strong style={{ fontSize: 15 }}>{applicant.name}</Text>
                      <Flex gap={4} wrap="wrap">
                        {applicant.subjects.map((s) => (
                          <Tag key={s} color="blue" style={{ margin: 0, fontSize: 11 }}>
                            {s}
                          </Tag>
                        ))}
                        {/* แสดงชื่อตำแหน่งเมื่ออยู่ใน mode ผู้สมัครใหม่ทั้งหมด */}
                        {isNewMode && applicant.jobTitle && (
                          <Tag color="purple" style={{ margin: 0, fontSize: 11 }}>
                            {applicant.jobTitle}
                          </Tag>
                        )}
                      </Flex>
                    </Flex>
                  </Flex>
                  <Tag
                    style={{
                      color: cfg.color,
                      backgroundColor: cfg.bg,
                      border: `1px solid ${cfg.border}`,
                      borderRadius: 20,
                      fontWeight: 600,
                      fontSize: 11,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {cfg.text}
                  </Tag>
                </Flex>

                {/* Row 2: Info */}
                <Flex gap={20} wrap="wrap">
                  <Flex align="center" gap={5}>
                    <SolutionOutlined style={{ color: "#94A3B8", fontSize: 13 }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      ประสบการณ์ <Text strong style={{ color: "#0F172A", fontSize: 12 }}>{applicant.experience}</Text>
                    </Text>
                  </Flex>
                  <Flex align="center" gap={5}>
                    <CalendarOutlined style={{ color: "#94A3B8", fontSize: 13 }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      สมัครเมื่อ <Text strong style={{ color: "#0F172A", fontSize: 12 }}>{applicant.appliedAt}</Text>
                    </Text>
                  </Flex>
                </Flex>

                <Flex align="center" gap={5}>
                  <SolutionOutlined style={{ color: "#94A3B8", fontSize: 13 }} />
                  <Text type="secondary" style={{ fontSize: 12 }}>{applicant.education}</Text>
                </Flex>

                {/* Row 3: Contact + Actions */}
                <Flex justify="space-between" align="center" wrap="wrap" gap={8}>
                  <Flex gap={12}>
                    <Tooltip title={applicant.email}>
                      <Button
                        type="text"
                        size="small"
                        icon={<MailOutlined style={{ color: "#94A3B8" }} />}
                        style={{ padding: "0 4px", height: "auto" }}
                      />
                    </Tooltip>
                    <Tooltip title={applicant.phone}>
                      <Button
                        type="text"
                        size="small"
                        icon={<PhoneOutlined style={{ color: "#94A3B8" }} />}
                        style={{ padding: "0 4px", height: "auto" }}
                      />
                    </Tooltip>
                  </Flex>

                  {/* Action Buttons ตามสถานะปัจจุบัน */}
                  <Flex gap={8}>
                    {applicant.status === "PENDING" && (
                      <>
                        <Button
                          size="small"
                          icon={<CalendarOutlined />}
                          style={{
                            borderRadius: 8,
                            borderColor: PRIMARY,
                            color: PRIMARY,
                          }}
                          onClick={() => updateApplicantStatus(applicant.key, "INTERVIEW")}
                        >
                          นัดสัมภาษณ์
                        </Button>
                        <Popconfirm
                          title="ยืนยันการปฏิเสธ"
                          description="คุณแน่ใจหรือไม่ว่าต้องการปฏิเสธผู้สมัครคนนี้?"
                          okText="ยืนยัน"
                          cancelText="ยกเลิก"
                          okButtonProps={{ danger: true }}
                          onConfirm={() => updateApplicantStatus(applicant.key, "REJECTED")}
                        >
                          <Button size="small" danger style={{ borderRadius: 8 }}>
                            ปฏิเสธ
                          </Button>
                        </Popconfirm>
                      </>
                    )}
                    {applicant.status === "INTERVIEW" && (
                      <>
                        <Button
                          size="small"
                          type="primary"
                          icon={<CheckCircleOutlined />}
                          style={{ borderRadius: 8 }}
                          onClick={() => updateApplicantStatus(applicant.key, "ACCEPTED")}
                        >
                          รับเข้าทำงาน
                        </Button>
                        <Popconfirm
                          title="ยืนยันการปฏิเสธ"
                          description="คุณแน่ใจหรือไม่ว่าต้องการปฏิเสธผู้สมัครคนนี้?"
                          okText="ยืนยัน"
                          cancelText="ยกเลิก"
                          okButtonProps={{ danger: true }}
                          onConfirm={() => updateApplicantStatus(applicant.key, "REJECTED")}
                        >
                          <Button size="small" danger style={{ borderRadius: 8 }}>
                            ไม่ผ่าน
                          </Button>
                        </Popconfirm>
                      </>
                    )}
                    {applicant.status === "ACCEPTED" && (
                      <Tag
                        icon={<CheckCircleOutlined />}
                        color="success"
                        style={{ borderRadius: 8, fontWeight: 600 }}
                      >
                        รับเข้าทำงานแล้ว
                      </Tag>
                    )}
                    {applicant.status === "REJECTED" && (
                      <Tag
                        icon={<CloseCircleOutlined />}
                        color="error"
                        style={{ borderRadius: 8, fontWeight: 600 }}
                      >
                        ไม่ผ่านการคัดเลือก
                      </Tag>
                    )}
                  </Flex>
                </Flex>
              </Flex>
            );
          })
        )}
      </Flex>
    </Drawer>
  );
};

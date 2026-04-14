"use client";

import { useAuthStore } from "@/app/stores/auth-store";
import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
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
  Skeleton,
  Tag,
  Tooltip,
  Typography,
  theme,
} from "antd";
import {
  NEW_APPLICANTS_MODE,
  useApplicantDrawerStore,
  type ApplicantStatus,
} from "../_state/applicant-drawer-store";
import { ApplicantProfileModal } from "./applicant-profile-modal";

const { Text, Title } = Typography;

const PRIMARY = "#11b6f5";

// config สถานะผู้สมัคร: ใช้ preset color ของ AntD ที่รองรับ dark mode
const STATUS_CONFIG: Record<
  ApplicantStatus,
  { tagColor: string; text: string }
> = {
  PENDING: { tagColor: "warning", text: "รอพิจารณา" },
  INTERVIEW: { tagColor: "processing", text: "นัดสัมภาษณ์" },
  ACCEPTED: { tagColor: "success", text: "รับเข้าทำงาน" },
  REJECTED: { tagColor: "error", text: "ไม่ผ่านการคัดเลือก" },
};

const FILTER_TABS: { key: ApplicantStatus | "ALL"; label: string }[] = [
  { key: "ALL", label: "ทั้งหมด" },
  { key: "PENDING", label: "รอพิจารณา" },
  { key: "INTERVIEW", label: "นัดสัมภาษณ์" },
  { key: "ACCEPTED", label: "รับเข้าทำงาน" },
  { key: "REJECTED", label: "ไม่ผ่าน" },
];

// Drawer แสดงรายชื่อผู้สมัครของตำแหน่งที่เลือก พร้อมจัดการสถานะ
export const ApplicantDrawer = () => {
  const {
    isOpen,
    selectedJobId,
    selectedJobTitle,
    filterStatus,
    isLoading,
    closeDrawer,
    setFilterStatus,
    getApplicants,
    getAllApplicants,
    updateApplicantStatus,
    openProfileModal,
  } = useApplicantDrawerStore();
  const { user } = useAuthStore();

  const isNewMode = selectedJobId === NEW_APPLICANTS_MODE;
  const applicants = getApplicants();
  const allUnfiltered = getAllApplicants();
  const { token } = theme.useToken();

  // นับผู้สมัครแต่ละสถานะจาก raw list (ไม่ผ่าน filterStatus)
  const countByStatus = (status: ApplicantStatus | "ALL") => {
    if (status === "ALL") return allUnfiltered.length;
    return allUnfiltered.filter((a) => a.status === status).length;
  };

  return (
    <>
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
        width={600}
        open={isOpen}
        onClose={closeDrawer}
        styles={{ body: { padding: "0" } }}
      >
        {/* Filter Tabs */}
        <Flex
          gap={8}
          style={{
            padding: "16px 24px",
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
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
                  background: isActive ? PRIMARY : token.colorFillSecondary,
                  color: isActive ? "#fff" : token.colorTextSecondary,
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
                      backgroundColor: isActive
                        ? "rgba(255,255,255,0.3)"
                        : "#E2E8F0",
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
        <Flex
          vertical
          style={{ padding: "16px 24px", gap: 12, overflowY: "auto" }}
        >
          {isLoading ? (
            // ✨ Skeleton Loading เสมือนจริงเพื่อ UX ที่ดีที่สุด
            [1, 2, 3, 4].map((i) => (
              <Flex
                key={i}
                vertical
                gap={16}
                style={{
                  padding: "16px",
                  borderRadius: 12,
                  border: `1px solid ${token.colorBorderSecondary}`,
                  backgroundColor: token.colorFillQuaternary,
                }}
              >
                <Flex justify="space-between" align="center">
                  <Flex gap={12} align="center">
                    <Skeleton.Avatar active size={44} shape="circle" />
                    <Flex vertical gap={4}>
                      <Skeleton.Input
                        active
                        size="small"
                        style={{ width: 120 }}
                      />
                      <Skeleton.Input
                        active
                        size="small"
                        style={{ width: 80, height: 16 }}
                      />
                    </Flex>
                  </Flex>
                  <Skeleton.Button
                    active
                    size="small"
                    style={{ width: 80, borderRadius: 20 }}
                  />
                </Flex>
                <Skeleton active paragraph={{ rows: 2 }} title={false} />
                <Flex justify="space-between" align="center">
                  <Skeleton.Input active size="small" style={{ width: 100 }} />
                  <Flex gap={8}>
                    <Skeleton.Button
                      active
                      size="small"
                      style={{ width: 80, borderRadius: 8 }}
                    />
                    <Skeleton.Button
                      active
                      size="small"
                      style={{ width: 60, borderRadius: 8 }}
                    />
                  </Flex>
                </Flex>
              </Flex>
            ))
          ) : applicants.length === 0 ? (
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
                    border: `1px solid ${token.colorBorderSecondary}`,
                    backgroundColor: token.colorFillQuaternary,
                  }}
                >
                  {/* Row 1: Avatar + Name + Status */}
                  <Flex justify="space-between" align="flex-start">
                    <Flex gap={12} align="center">
                      <Avatar
                        size={44}
                        style={{
                          backgroundColor: PRIMARY,
                          fontSize: 18,
                          flexShrink: 0,
                        }}
                        icon={<UserOutlined />}
                      />
                      <Flex vertical gap={3}>
                        <Text strong style={{ fontSize: 15 }}>
                          {applicant.name}
                        </Text>
                        <Flex gap={4} wrap="wrap">
                          {applicant.subjects.map((s) => (
                            <Tag
                              key={s}
                              color="blue"
                              style={{ margin: 0, fontSize: 11 }}
                            >
                              {s}
                            </Tag>
                          ))}
                          {/* แสดงชื่อตำแหน่งเมื่ออยู่ใน mode ผู้สมัครใหม่ทั้งหมด */}
                          {isNewMode && applicant.jobTitle && (
                            <Tag
                              color="purple"
                              style={{ margin: 0, fontSize: 11 }}
                            >
                              {applicant.jobTitle}
                            </Tag>
                          )}
                        </Flex>
                      </Flex>
                    </Flex>
                    <Tag
                      color={cfg.tagColor}
                      style={{
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
                      <SolutionOutlined
                        style={{
                          color: token.colorTextTertiary,
                          fontSize: 13,
                        }}
                      />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        ประสบการณ์{" "}
                        <Text strong style={{ fontSize: 12 }}>
                          {applicant.experience}
                        </Text>
                      </Text>
                    </Flex>
                    <Flex align="center" gap={5}>
                      <CalendarOutlined
                        style={{
                          color: token.colorTextTertiary,
                          fontSize: 13,
                        }}
                      />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        สมัครเมื่อ{" "}
                        <Text strong style={{ fontSize: 12 }}>
                          {applicant.appliedAt.split("-").reverse().join("/")}
                        </Text>
                      </Text>
                    </Flex>
                  </Flex>

                  <Flex align="center" gap={5}>
                    <SolutionOutlined
                      style={{ color: token.colorTextTertiary, fontSize: 13 }}
                    />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {applicant.education}
                    </Text>
                  </Flex>

                  {/* Row 3: Contact + Actions */}
                  <Flex
                    justify="space-between"
                    align="center"
                    wrap="wrap"
                    gap={8}
                  >
                    <Flex gap={4} align="center">
                      <Tooltip title={applicant.email}>
                        <Button
                          type="text"
                          size="small"
                          icon={
                            <MailOutlined
                              style={{ color: token.colorTextTertiary }}
                            />
                          }
                          style={{ padding: "0 4px", height: "auto" }}
                        />
                      </Tooltip>
                      <Tooltip title={applicant.phone}>
                        <Button
                          type="text"
                          size="small"
                          icon={
                            <PhoneOutlined
                              style={{ color: token.colorTextTertiary }}
                            />
                          }
                          style={{ padding: "0 4px", height: "auto" }}
                        />
                      </Tooltip>
                      <Tooltip title="ดูโปรไฟล์เต็ม">
                        <Button
                          type="text"
                          size="small"
                          icon={<EyeOutlined style={{ color: PRIMARY }} />}
                          style={{ padding: "0 4px", height: "auto" }}
                          onClick={() => openProfileModal(applicant)}
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
                            onClick={() =>
                              updateApplicantStatus(
                                applicant.key,
                                "INTERVIEW",
                                user?.user_id ?? "",
                              )
                            }
                          >
                            นัดสัมภาษณ์
                          </Button>
                          <Popconfirm
                            title="ยืนยันการปฏิเสธ"
                            description="คุณแน่ใจหรือไม่ว่าต้องการปฏิเสธผู้สมัครคนนี้?"
                            okText="ยืนยัน"
                            cancelText="ยกเลิก"
                            okButtonProps={{ danger: true }}
                            onConfirm={() =>
                              updateApplicantStatus(
                                applicant.key,
                                "REJECTED",
                                user?.user_id ?? "",
                              )
                            }
                          >
                            <Button
                              size="small"
                              danger
                              style={{ borderRadius: 8 }}
                            >
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
                            onClick={() =>
                              updateApplicantStatus(
                                applicant.key,
                                "ACCEPTED",
                                user?.user_id ?? "",
                              )
                            }
                          >
                            รับเข้าทำงาน
                          </Button>
                          <Popconfirm
                            title="ยืนยันการปฏิเสธ"
                            description="คุณแน่ใจหรือไม่ว่าต้องการปฏิเสธผู้สมัครคนนี้?"
                            okText="ยืนยัน"
                            cancelText="ยกเลิก"
                            okButtonProps={{ danger: true }}
                            onConfirm={() =>
                              updateApplicantStatus(
                                applicant.key,
                                "REJECTED",
                                user?.user_id ?? "",
                              )
                            }
                          >
                            <Button
                              size="small"
                              danger
                              style={{ borderRadius: 8 }}
                            >
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

      {/* Modal โปรไฟล์เต็มของผู้สมัคร */}
      <ApplicantProfileModal />
    </>
  );
};

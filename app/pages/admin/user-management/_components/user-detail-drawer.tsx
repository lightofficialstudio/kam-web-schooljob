"use client";

// ✨ User Detail Drawer — รายละเอียด User เต็มรูปแบบ + Audit Log + Actions
import {
  BankOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CrownOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  GlobalOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyOutlined,
  StopOutlined,
  TeamOutlined,
  UnlockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Col,
  Descriptions,
  Drawer,
  Flex,
  Row,
  Select,
  Skeleton,
  Space,
  Statistic,
  Table,
  Tag,
  Timeline,
  Tooltip,
  Typography,
  theme,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UserDetail } from "../_api/user-management-api";
import { useUserManagementStore } from "../_state/user-management-store";

// ✨ Application row type
type AppRow = UserDetail["recentApplications"][number];
// ✨ Job row type
type JobRow = NonNullable<UserDetail["schoolProfile"]>["recentJobs"][number];

const { Text, Title } = Typography;

// ✨ แปลงวันที่เป็นภาษาไทย
const formatThai = (iso?: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ✨ สีตาม event type ใน audit
const auditColor: Record<string, string> = {
  auth: "blue",
  profile: "green",
  activity: "orange",
  system: "red",
};

const auditIcon: Record<string, React.ReactNode> = {
  auth: <SafetyOutlined />,
  profile: <UserOutlined />,
  activity: <ClockCircleOutlined />,
  system: <ExclamationCircleOutlined />,
};

export function UserDetailDrawer() {
  const { token } = theme.useToken();
  const {
    drawerOpen,
    drawerDetail,
    isLoadingDetail,
    isUpdatingUser,
    closeDrawer,
    updateUserRole,
    banUser,
    deleteUser,
    showModal,
    setModalLoading,
  } = useUserManagementStore();

  const d = drawerDetail;

  // ─── Actions ───
  const handleRoleChange = async (role: string) => {
    if (!d) return;
    try {
      await updateUserRole(d.id, role);
      showModal({
        type: "success",
        title: "เปลี่ยน Role สำเร็จ",
        description: `เปลี่ยน Role ของ ${d.email} เป็น ${role} เรียบร้อยแล้ว`,
      });
    } catch (err) {
      showModal({
        type: "error",
        title: "เปลี่ยน Role ไม่สำเร็จ",
        description: "เกิดข้อผิดพลาดขณะเปลี่ยน Role",
        errorDetails: err,
      });
    }
  };

  const handleBan = (ban: boolean) => {
    if (!d) return;
    showModal({
      type: "confirm",
      title: ban ? "แบน User นี้?" : "ปลด Ban User นี้?",
      description: ban
        ? `ผู้ใช้ ${d.email} จะไม่สามารถเข้าสู่ระบบได้`
        : `ผู้ใช้ ${d.email} จะกลับมาใช้งานได้ปกติ`,
      confirmLabel: ban ? "แบน" : "ปลด Ban",
      cancelLabel: "ยกเลิก",
      onConfirm: async () => {
        setModalLoading(true);
        try {
          await banUser(d.id, ban);
          showModal({
            type: "success",
            title: ban ? "แบน User สำเร็จ" : "ปลด Ban สำเร็จ",
            description: `ดำเนินการกับ ${d.email} เรียบร้อยแล้ว`,
          });
        } catch (err) {
          showModal({
            type: "error",
            title: "ดำเนินการไม่สำเร็จ",
            description: "เกิดข้อผิดพลาดขณะดำเนินการ",
            errorDetails: err,
          });
        }
      },
    });
  };

  const handleDelete = () => {
    if (!d) return;
    showModal({
      type: "delete",
      title: "ลบ User นี้ถาวร?",
      description: `ลบ ${d.email} ออกจากระบบทั้งหมด — ลบทั้ง Supabase Auth + Prisma Profile และ data ทั้งหมด ไม่สามารถย้อนกลับได้`,
      confirmLabel: "ลบถาวร",
      cancelLabel: "ยกเลิก",
      onConfirm: async () => {
        setModalLoading(true);
        try {
          await deleteUser(d.id);
          showModal({
            type: "success",
            title: "ลบ User สำเร็จ",
            description: `${d.email} ถูกลบออกจากระบบเรียบร้อยแล้ว`,
          });
          closeDrawer();
        } catch (err) {
          showModal({
            type: "error",
            title: "ลบ User ไม่สำเร็จ",
            description: "เกิดข้อผิดพลาดขณะลบ User",
            errorDetails: err,
          });
        }
      },
    });
  };

  // ─── Application table columns ───
  const appColumns: ColumnsType<any> = [
    {
      title: "ตำแหน่งงาน",
      dataIndex: "jobTitle",
      key: "jobTitle",
      render: (v) => <Text style={{ fontSize: 12 }}>{v}</Text>,
    },
    {
      title: "โรงเรียน",
      dataIndex: "schoolName",
      key: "schoolName",
      render: (v) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {v}
        </Text>
      ),
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (v) => {
        const map: Record<string, string> = {
          PENDING: "warning",
          INTERVIEW: "processing",
          ACCEPTED: "success",
          REJECTED: "error",
        };
        const label: Record<string, string> = {
          PENDING: "รอพิจารณา",
          INTERVIEW: "สัมภาษณ์",
          ACCEPTED: "รับ",
          REJECTED: "ไม่รับ",
        };
        return <Tag color={map[v] ?? "default"}>{label[v] ?? v}</Tag>;
      },
    },
    {
      title: "สมัครเมื่อ",
      dataIndex: "appliedAt",
      key: "appliedAt",
      width: 130,
      render: (v) => (
        <Text type="secondary" style={{ fontSize: 11 }}>
          {formatThai(v)}
        </Text>
      ),
    },
  ];

  // ─── Job table columns (EMPLOYER) ───
  const jobColumns: ColumnsType<JobRow> = [
    {
      title: "ตำแหน่งงาน",
      dataIndex: "title",
      key: "title",
      render: (v) => <Text style={{ fontSize: 12 }}>{v}</Text>,
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      width: 90,
      render: (v) => (
        <Tag
          color={v === "OPEN" ? "success" : v === "DRAFT" ? "default" : "error"}
        >
          {v === "OPEN" ? "รับสมัคร" : v === "DRAFT" ? "Draft" : "ปิดแล้ว"}
        </Tag>
      ),
    },
    {
      title: "ผู้สมัคร",
      dataIndex: "_count",
      key: "_count",
      width: 80,
      render: (v) => (
        <Text style={{ fontSize: 12 }}>{v?.applications ?? 0} คน</Text>
      ),
    },
    {
      title: "สร้างเมื่อ",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (v) => (
        <Text type="secondary" style={{ fontSize: 11 }}>
          {formatThai(v)}
        </Text>
      ),
    },
  ];

  return (
    <Drawer
      open={drawerOpen}
      onClose={closeDrawer}
      size="large"
      title={
        d ? (
          <Flex align="center" gap={12}>
            <Avatar
              size={40}
              src={d.profile?.profileImageUrl}
              icon={<UserOutlined />}
              style={{ background: token.colorPrimary }}
            />
            <Flex vertical gap={2}>
              <Text strong style={{ fontSize: 15 }}>
                {d.profile?.fullName || d.email}
              </Text>
              <Flex align="center" gap={6}>
                <Tag
                  color={
                    d.profile?.role === "ADMIN"
                      ? "error"
                      : d.profile?.role === "EMPLOYER"
                        ? "processing"
                        : "success"
                  }
                  style={{ margin: 0, fontSize: 11 }}
                >
                  {d.profile?.role === "ADMIN"
                    ? "ผู้ดูแล"
                    : d.profile?.role === "EMPLOYER"
                      ? "โรงเรียน"
                      : "ครู"}
                </Tag>
                {d.isEmailVerified ? (
                  <Badge
                    status="success"
                    text={<Text style={{ fontSize: 11 }}>ยืนยันแล้ว</Text>}
                  />
                ) : (
                  <Badge
                    status="warning"
                    text={<Text style={{ fontSize: 11 }}>ยังไม่ยืนยัน</Text>}
                  />
                )}
                {d.isBanned && (
                  <Tag color="red" style={{ margin: 0, fontSize: 11 }}>
                    <StopOutlined /> แบน
                  </Tag>
                )}
              </Flex>
            </Flex>
          </Flex>
        ) : (
          "รายละเอียด User"
        )
      }
      extra={
        d && (
          <Space>
            {/* ─── เปลี่ยน Role ─── */}
            <Tooltip title="เปลี่ยน Role">
              <Select
                value={d.profile?.role ?? "EMPLOYEE"}
                onChange={handleRoleChange}
                loading={isUpdatingUser}
                size="small"
                style={{ width: 120 }}
                options={[
                  { value: "EMPLOYEE", label: "ครู" },
                  { value: "EMPLOYER", label: "โรงเรียน" },
                  { value: "ADMIN", label: "ผู้ดูแล" },
                ]}
              />
            </Tooltip>
            {/* ─── Ban/Unban ─── */}
            {d.isBanned ? (
              <Button
                size="small"
                icon={<UnlockOutlined />}
                onClick={() => handleBan(false)}
                loading={isUpdatingUser}
              >
                ปลด Ban
              </Button>
            ) : (
              <Button
                size="small"
                danger
                icon={<LockOutlined />}
                onClick={() => handleBan(true)}
                loading={isUpdatingUser}
              >
                แบน
              </Button>
            )}
            {/* ─── ลบ ─── */}
            <Button
              size="small"
              danger
              type="primary"
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              loading={isUpdatingUser}
            >
              ลบ
            </Button>
          </Space>
        )
      }
      styles={{ body: { padding: "16px 24px" } }}
    >
      {isLoadingDetail ? (
        <Skeleton active paragraph={{ rows: 20 }} />
      ) : !d ? (
        <Text type="secondary">ไม่พบข้อมูล</Text>
      ) : (
        <Flex vertical gap={20}>
          {/* ─── Stats Cards ─── */}
          <Row gutter={[12, 12]}>
            {[
              {
                label: d.profile?.role === "EMPLOYER" ? "ประกาศงาน" : "ใบสมัคร",
                value:
                  d.profile?.role === "EMPLOYER"
                    ? d.stats.jobCount
                    : d.stats.applicationCount,
                icon: <FileTextOutlined />,
                color: token.colorPrimary,
              },
              {
                label: "สมาชิกองค์กร",
                value: d.stats.orgMemberCount,
                icon: <TeamOutlined />,
                color: "#52c41a",
              },
              {
                label: "บทความ",
                value: d.stats.blogCount,
                icon: <BookOutlined />,
                color: "#fa8c16",
              },
              {
                label: "เข้าสู่ระบบล่าสุด",
                value: d.lastSignInAt
                  ? formatThai(d.lastSignInAt)
                  : "ยังไม่เคย",
                icon: <ClockCircleOutlined />,
                color: token.colorTextSecondary,
                isText: true,
              },
            ].map((s) => (
              <Col xs={12} sm={6} key={s.label}>
                <Flex
                  vertical
                  align="center"
                  gap={4}
                  style={{
                    padding: "12px 8px",
                    borderRadius: 10,
                    background: token.colorFillQuaternary,
                    border: `1px solid ${token.colorBorderSecondary}`,
                  }}
                >
                  <Text style={{ color: s.color, fontSize: 18 }}>{s.icon}</Text>
                  {s.isText ? (
                    <Text
                      style={{
                        fontSize: 10,
                        textAlign: "center",
                        color: token.colorTextSecondary,
                      }}
                    >
                      {s.value}
                    </Text>
                  ) : (
                    <Statistic
                      value={s.value as number}
                      styles={{
                        content: {
                          fontSize: 22,
                          fontWeight: 700,
                          color: s.color,
                        },
                      }}
                    />
                  )}
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {s.label}
                  </Text>
                </Flex>
              </Col>
            ))}
          </Row>

          {/* ─── Auth Info ─── */}
          <div>
            <Flex align="center" gap={8} style={{ marginBottom: 10 }}>
              <SafetyOutlined style={{ color: token.colorPrimary }} />
              <Text strong>ข้อมูล Auth (Supabase)</Text>
            </Flex>
            <Descriptions
              size="small"
              bordered
              column={2}
              styles={{ label: { fontWeight: 600, fontSize: 12, width: 140 }, content: { fontSize: 12 } }}
            >
              <Descriptions.Item label="User ID" span={2}>
                <Text code style={{ fontSize: 11 }}>
                  {d.id}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <MailOutlined /> อีเมล
                  </>
                }
              >
                {d.email}
              </Descriptions.Item>
              <Descriptions.Item label="ยืนยันอีเมล">
                {d.isEmailVerified ? (
                  <Text style={{ color: "#52c41a" }}>
                    <CheckCircleOutlined /> {formatThai(d.emailConfirmedAt)}
                  </Text>
                ) : (
                  <Text type="warning">
                    <CloseCircleOutlined /> ยังไม่ยืนยัน
                  </Text>
                )}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <PhoneOutlined /> โทรศัพท์
                  </>
                }
              >
                {d.phone ?? "—"}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <>
                    <GlobalOutlined /> Provider
                  </>
                }
              >
                <Tag>{d.provider}</Tag>
                {d.providers.length > 1 &&
                  d.providers.map((p) => <Tag key={p}>{p}</Tag>)}
              </Descriptions.Item>
              <Descriptions.Item label="สถานะ">
                {d.isBanned ? (
                  <Tag color="red">
                    <StopOutlined /> แบน
                  </Tag>
                ) : (
                  <Tag color="green">
                    <CheckCircleOutlined /> ปกติ
                  </Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="สมัครเมื่อ">
                {formatThai(d.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="เข้าสู่ระบบล่าสุด">
                {formatThai(d.lastSignInAt)}
              </Descriptions.Item>
            </Descriptions>
          </div>

          {/* ─── Profile Info ─── */}
          {d.profile ? (
            <div>
              <Flex align="center" gap={8} style={{ marginBottom: 10 }}>
                <UserOutlined style={{ color: token.colorPrimary }} />
                <Text strong>ข้อมูล Profile (Prisma)</Text>
              </Flex>
              <Descriptions
                size="small"
                bordered
                column={2}
                styles={{ label: { fontWeight: 600, fontSize: 12, width: 140 }, content: { fontSize: 12 } }}
              >
                <Descriptions.Item label="ชื่อ-นามสกุล">
                  {d.profile.fullName || <Text type="secondary">—</Text>}
                </Descriptions.Item>
                <Descriptions.Item label="เพศ">
                  {d.profile.gender ?? "—"}
                </Descriptions.Item>
                <Descriptions.Item label="โทรศัพท์">
                  {d.profile.phoneNumber ?? "—"}
                </Descriptions.Item>
                <Descriptions.Item label="สัญชาติ">
                  {d.profile.nationality ?? "—"}
                </Descriptions.Item>
                <Descriptions.Item label="การมองเห็น Profile">
                  <Tag>{d.profile.profileVisibility ?? "—"}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="สถานะใบอนุญาต">
                  {d.profile.licenseStatus ? (
                    <Tag>{d.profile.licenseStatus}</Tag>
                  ) : (
                    "—"
                  )}
                </Descriptions.Item>
                {d.profile.role === "EMPLOYEE" && (
                  <>
                    <Descriptions.Item label="ประสบการณ์สอน">
                      {d.profile.teachingExperience ?? "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="ย้ายได้">
                      {d.profile.canRelocate ? (
                        <Text style={{ color: "#52c41a" }}>ได้</Text>
                      ) : (
                        <Text type="secondary">ไม่ได้</Text>
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="วิชาที่เชี่ยวชาญ" span={2}>
                      {d.profile.specializations.length > 0
                        ? d.profile.specializations.map((s) => (
                            <Tag key={s} style={{ marginBottom: 2 }}>
                              {s}
                            </Tag>
                          ))
                        : "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="ระดับชั้นที่สอนได้" span={2}>
                      {d.profile.gradeCanTeaches.length > 0
                        ? d.profile.gradeCanTeaches.map((g) => (
                            <Tag key={g} style={{ marginBottom: 2 }}>
                              {g}
                            </Tag>
                          ))
                        : "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="จังหวัดที่ต้องการ" span={2}>
                      {d.profile.preferredProvinces.length > 0
                        ? d.profile.preferredProvinces.map((p) => (
                            <Tag key={p} style={{ marginBottom: 2 }}>
                              {p}
                            </Tag>
                          ))
                        : "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="โรงเรียนล่าสุด" span={2}>
                      {d.profile.recentSchool ?? "—"}
                    </Descriptions.Item>
                    <Descriptions.Item label="ประวัติการทำงาน">
                      {d.profile.workExperienceCount} รายการ
                    </Descriptions.Item>
                    <Descriptions.Item label="ประวัติการศึกษา">
                      {d.profile.educationCount} รายการ
                    </Descriptions.Item>
                  </>
                )}
              </Descriptions>
            </div>
          ) : (
            <Flex
              align="center"
              justify="center"
              gap={8}
              style={{
                padding: "16px",
                borderRadius: 10,
                background: token.colorWarningBg,
                border: `1px solid ${token.colorWarningBorder}`,
              }}
            >
              <ExclamationCircleOutlined
                style={{ color: token.colorWarning }}
              />
              <Text style={{ color: token.colorWarning }}>
                User นี้ยังไม่มี Prisma Profile
                (สมัครแต่ยังไม่ได้ตั้งค่าโปรไฟล์)
              </Text>
            </Flex>
          )}

          {/* ─── School Profile (EMPLOYER) ─── */}
          {d.schoolProfile && (
            <div>
              <Flex align="center" gap={8} style={{ marginBottom: 10 }}>
                <BankOutlined style={{ color: token.colorPrimary }} />
                <Text strong>ข้อมูลโรงเรียน</Text>
                <Tag
                  color={
                    d.schoolProfile.accountPlan === "enterprise"
                      ? "purple"
                      : d.schoolProfile.accountPlan === "premium"
                        ? "processing"
                        : "default"
                  }
                >
                  {d.schoolProfile.accountPlan?.toUpperCase()}
                </Tag>
              </Flex>
              <Descriptions
                size="small"
                bordered
                column={2}
                styles={{ label: { fontWeight: 600, fontSize: 12, width: 140 }, content: { fontSize: 12 } }}
              >
                <Descriptions.Item label="ชื่อโรงเรียน" span={2}>
                  {d.schoolProfile.schoolName}
                </Descriptions.Item>
                <Descriptions.Item label="จังหวัด">
                  {d.schoolProfile.province}
                </Descriptions.Item>
                <Descriptions.Item label="Job Quota">
                  {d.stats.jobCount} /{" "}
                  {d.schoolProfile.jobQuotaMax >= 999
                    ? "∞"
                    : d.schoolProfile.jobQuotaMax}
                </Descriptions.Item>
                <Descriptions.Item label="สมาชิก Active">
                  {d.stats.orgMemberCount} คน
                </Descriptions.Item>
              </Descriptions>

              {/* ─── ประกาศงานล่าสุด ─── */}
              {d.schoolProfile.recentJobs.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <Text
                    type="secondary"
                    style={{ fontSize: 12, display: "block", marginBottom: 6 }}
                  >
                    ประกาศงานล่าสุด
                  </Text>
                  <Table
                    dataSource={d.schoolProfile.recentJobs}
                    columns={
                      jobColumns as ColumnsType<
                        (typeof d.schoolProfile.recentJobs)[0]
                      >
                    }
                    rowKey="id"
                    size="small"
                    pagination={false}
                    scroll={{ x: 400 }}
                  />
                </div>
              )}

              {/* ─── Org Members ─── */}
              {d.schoolProfile.orgMembers.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <Text
                    type="secondary"
                    style={{ fontSize: 12, display: "block", marginBottom: 6 }}
                  >
                    สมาชิกองค์กร ({d.schoolProfile.orgMembers.length} คน)
                  </Text>
                  <Flex vertical gap={4}>
                    {d.schoolProfile.orgMembers.map((m, i) => (
                      <Flex
                        key={i}
                        align="center"
                        justify="space-between"
                        style={{
                          padding: "6px 10px",
                          borderRadius: 6,
                          background: token.colorFillQuaternary,
                          border: `1px solid ${token.colorBorderSecondary}`,
                        }}
                      >
                        <Text style={{ fontSize: 12 }}>
                          {m.name || m.email}
                        </Text>
                        <Flex gap={6}>
                          <Tag style={{ margin: 0, fontSize: 10 }}>
                            {m.role}
                          </Tag>
                          <Badge
                            status="success"
                            text={
                              <Text style={{ fontSize: 10 }}>{m.status}</Text>
                            }
                          />
                        </Flex>
                      </Flex>
                    ))}
                  </Flex>
                </div>
              )}
            </div>
          )}

          {/* ─── Recent Applications (EMPLOYEE) ─── */}
          {d.recentApplications.length > 0 && (
            <div>
              <Flex align="center" gap={8} style={{ marginBottom: 10 }}>
                <FileTextOutlined style={{ color: token.colorPrimary }} />
                <Text strong>
                  ใบสมัครงานล่าสุด ({d.recentApplications.length} รายการ)
                </Text>
              </Flex>
              <Table
                dataSource={d.recentApplications}
                columns={
                  appColumns as ColumnsType<(typeof d.recentApplications)[0]>
                }
                rowKey="id"
                size="small"
                pagination={{ pageSize: 5, size: "small" }}
                scroll={{ x: 500 }}
              />
            </div>
          )}

          {/* ─── Audit Timeline ─── */}
          <div>
            <Flex align="center" gap={8} style={{ marginBottom: 12 }}>
              <ClockCircleOutlined style={{ color: token.colorPrimary }} />
              <Text strong>
                Activity Timeline ({d.auditTimeline.length} รายการ)
              </Text>
            </Flex>
            <div
              style={{
                maxHeight: 400,
                overflowY: "auto",
                padding: "4px 0",
              }}
            >
              <Timeline
                mode="start"
                items={d.auditTimeline.map((item) => ({
                  color: auditColor[item.type] ?? "gray",
                  icon: auditIcon[item.type],
                  title: (
                    <Text
                      type="secondary"
                      style={{ fontSize: 11, whiteSpace: "nowrap" }}
                    >
                      {formatThai(item.timestamp)}
                    </Text>
                  ),
                  content: (
                    <Flex vertical gap={2}>
                      <Text strong style={{ fontSize: 13 }}>
                        {item.event}
                      </Text>
                      {item.detail && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {item.detail}
                        </Text>
                      )}
                    </Flex>
                  ),
                }))}
              />
            </div>
          </div>

          {/* ─── Raw Supabase Metadata ─── */}
          <div>
            <Flex align="center" gap={8} style={{ marginBottom: 8 }}>
              <CrownOutlined style={{ color: token.colorTextTertiary }} />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Supabase user_metadata (raw)
              </Text>
            </Flex>
            <pre
              style={{
                fontSize: 11,
                background: token.colorFillQuaternary,
                border: `1px solid ${token.colorBorderSecondary}`,
                borderRadius: 8,
                padding: "10px 14px",
                overflowX: "auto",
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
              }}
            >
              {JSON.stringify(d.supabaseMetadata, null, 2)}
            </pre>
          </div>
        </Flex>
      )}
    </Drawer>
  );
}

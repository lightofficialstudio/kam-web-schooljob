"use client";

// ✨ หน้าจัดการ Package สำหรับ ADMIN — CRUD Plan + เปลี่ยน Plan โรงเรียน (Dynamic ทั้งหมดจาก DB)
import { useAuthStore } from "@/app/stores/auth-store";
import {
  CrownOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  EditOutlined,
  FilterOutlined,
  LinkOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  SearchOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  Empty,
  Flex,
  message,
  Pagination,
  Progress,
  Row,
  Select,
  Skeleton,
  Table,
  Tag,
  theme,
  Tooltip,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DeletePlanModal, PlanFormModal } from "./_components/plan-form-modal";
import { PlanChangeModal } from "./_components/plan-change-modal";
import {
  PackagePlanItem,
  PlanFormData,
  SchoolPackageItem,
  usePackageStore,
} from "./_state/package-store";
import Input from "antd/es/input/Input";

const { Title, Text } = Typography;

// ✨ แปลงวันที่ ISO → ภาษาไทย
const formatThaiDate = (iso?: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// ✨ Plan Tag Component — ใช้ config จาก DB (dynamic)
const PlanTag: React.FC<{ plan: string; planDef?: PackagePlanItem }> = ({
  plan,
  planDef,
}) => {
  if (!planDef)
    return (
      <Tag style={{ fontFamily: "monospace", fontSize: 11 }}>{plan}</Tag>
    );
  return (
    <Tag
      style={{
        fontWeight: 700,
        fontSize: 12,
        borderRadius: 6,
        padding: "2px 10px",
        border: `1.5px solid ${planDef.color}`,
        background: `${planDef.color}18`,
        color: planDef.color,
      }}
    >
      {planDef.badgeIcon === "crown" && (
        <CrownOutlined style={{ marginRight: 4 }} />
      )}
      {planDef.badgeIcon === "thunder" && (
        <ThunderboltOutlined style={{ marginRight: 4 }} />
      )}
      {planDef.label}
    </Tag>
  );
};

export default function PackageManagementPage() {
  const { token } = theme.useToken();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const {
    plans,
    isLoadingPlans,
    isSavingPlan,
    isDeletingPlan,
    fetchPlans,
    seedPlans,
    createPlan,
    patchPlan,
    deletePlan,
    schools,
    total,
    summary,
    isLoading,
    isUpdating,
    filterPlan,
    filterKeyword,
    page,
    setFilterPlan,
    setFilterKeyword,
    setPage,
    fetchSummary,
    fetchSchools,
    updatePlan,
  } = usePackageStore();

  const [isMounted, setIsMounted] = useState(false);
  const [searchInput, setSearchInput] = useState(filterKeyword);

  // ─── Plan Form Modal state ───
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [planModalMode, setPlanModalMode] = useState<"create" | "edit">("create");
  const [editingPlan, setEditingPlan] = useState<PackagePlanItem | null>(null);

  // ─── Delete Plan Modal state ───
  const [deletingPlanItem, setDeletingPlanItem] = useState<PackagePlanItem | null>(null);

  // ─── Plan Change Modal state (เปลี่ยน plan ของโรงเรียน) ───
  const [modalSchool, setModalSchool] = useState<SchoolPackageItem | null>(null);
  const [modalTargetPlan, setModalTargetPlan] = useState<PackagePlanItem | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ✨ Guard: ADMIN เท่านั้น
  useEffect(() => {
    if (!isMounted) return;
    if (!isAuthenticated || !user) {
      router.replace("/pages/signin");
      return;
    }
    if (user.role !== "ADMIN") router.replace("/");
  }, [isMounted, isAuthenticated, user?.role]);

  // ✨ โหลดข้อมูลเมื่อ mount
  useEffect(() => {
    if (!isMounted || user?.role !== "ADMIN") return;
    fetchSummary();
    fetchSchools();
    fetchPlans(true);
  }, [isMounted]);

  // ✨ refetch เมื่อ filter เปลี่ยน
  useEffect(() => {
    if (!isMounted || user?.role !== "ADMIN") return;
    fetchSchools();
  }, [filterPlan, filterKeyword, page]);

  // ✨ debounce search keyword
  useEffect(() => {
    const t = setTimeout(() => setFilterKeyword(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ✨ หา planDef จาก plans array (dynamic)
  const getPlanDef = (planKey: string) =>
    plans.find((p) => p.plan === planKey) ?? null;

  // ─── Plan Form handlers ───
  const openCreatePlan = () => {
    setPlanModalMode("create");
    setEditingPlan(null);
    setPlanModalOpen(true);
  };

  const openEditPlan = (plan: PackagePlanItem) => {
    setPlanModalMode("edit");
    setEditingPlan(plan);
    setPlanModalOpen(true);
  };

  const handlePlanSubmit = async (data: PlanFormData) => {
    try {
      if (planModalMode === "create") {
        await createPlan(data);
        message.success(`สร้าง Package Plan "${data.label}" สำเร็จ`);
      } else if (editingPlan) {
        const { plan: _key, ...patchData } = data;
        await patchPlan(editingPlan.plan, patchData);
        message.success(`อัปเดต Package Plan "${data.label}" สำเร็จ`);
      }
      setPlanModalOpen(false);
      fetchSummary();
    } catch {
      message.error("บันทึก Package Plan ไม่สำเร็จ");
    }
  };

  const handleDeletePlan = async () => {
    if (!deletingPlanItem) return;
    try {
      await deletePlan(deletingPlanItem.plan);
      message.success(`ลบ Package Plan "${deletingPlanItem.label}" สำเร็จ`);
      setDeletingPlanItem(null);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message_th?: string } } };
      message.error(
        e?.response?.data?.message_th ?? "ลบ Package Plan ไม่สำเร็จ",
      );
    }
  };

  // ─── Plan Change (โรงเรียน) handlers ───
  const openPlanModal = (school: SchoolPackageItem, targetPlanItem: PackagePlanItem) => {
    if (targetPlanItem.plan === school.accountPlan) return;
    setModalSchool(school);
    setModalTargetPlan(targetPlanItem);
  };

  const handleConfirmPlan = async (jobQuotaMax: number) => {
    if (!modalSchool || !modalTargetPlan) return;
    try {
      await updatePlan(modalSchool.id, modalTargetPlan.plan, jobQuotaMax);
      message.success(
        `เปลี่ยน Package ของ "${modalSchool.schoolName}" เป็น ${modalTargetPlan.label} สำเร็จ`,
      );
    } catch {
      message.error("เปลี่ยน Package ไม่สำเร็จ");
    } finally {
      setModalSchool(null);
      setModalTargetPlan(null);
    }
  };

  if (!isMounted) return null;

  // ─── Summary Stats Cards (dynamic จาก plans + summary) ───
  const statsCards = [
    {
      key: "all",
      label: "โรงเรียนทั้งหมด",
      value: summary.total,
      color: token.colorPrimary,
    },
    ...plans
      .filter((p) => p.isActive)
      .map((p) => ({
        key: p.plan,
        label: p.label,
        value: summary[p.plan] ?? 0,
        color: p.color,
      })),
  ];

  // ─── Filter Options (dynamic จาก plans) ───
  const planFilterOptions = [
    { value: "all", label: "ทุก Package" },
    ...plans.map((p) => ({ value: p.plan, label: p.label })),
  ];

  // ─── Table Columns ───
  const columns: ColumnsType<SchoolPackageItem> = [
    {
      title: "โรงเรียน",
      key: "school",
      width: 260,
      fixed: "left",
      render: (_, r) => (
        <Flex align="center" gap={12}>
          <Avatar
            size={40}
            src={r.logoUrl || undefined}
            style={{
              backgroundColor: token.colorPrimary,
              fontSize: 14,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {!r.logoUrl && r.schoolName.charAt(0)}
          </Avatar>
          <Flex vertical gap={2}>
            <Text strong style={{ fontSize: 13, lineHeight: 1.3 }}>
              {r.schoolName}
            </Text>
            <Text type="secondary" style={{ fontSize: 11 }}>
              {r.province} {r.schoolType ? `• ${r.schoolType}` : ""}
            </Text>
          </Flex>
        </Flex>
      ),
    },
    {
      title: "ผู้ดูแล",
      key: "owner",
      width: 200,
      render: (_, r) => (
        <Flex vertical gap={2}>
          <Text style={{ fontSize: 13 }}>{r.owner.name}</Text>
          <Flex align="center" gap={4}>
            <MailOutlined style={{ fontSize: 11, color: token.colorTextTertiary }} />
            <Text type="secondary" style={{ fontSize: 11 }}>
              {r.owner.email}
            </Text>
          </Flex>
          {r.owner.phoneNumber && (
            <Flex align="center" gap={4}>
              <PhoneOutlined
                style={{ fontSize: 11, color: token.colorTextTertiary }}
              />
              <Text type="secondary" style={{ fontSize: 11 }}>
                {r.owner.phoneNumber}
              </Text>
            </Flex>
          )}
        </Flex>
      ),
    },
    {
      title: "Package ปัจจุบัน",
      key: "plan",
      width: 140,
      align: "center",
      render: (_, r) => (
        <PlanTag plan={r.accountPlan} planDef={getPlanDef(r.accountPlan) ?? undefined} />
      ),
    },
    {
      title: "Job Quota",
      key: "quota",
      width: 180,
      render: (_, r) => (
        <Flex vertical gap={4}>
          <Flex align="center" justify="space-between">
            <Text style={{ fontSize: 12 }}>
              {r.activeJobCount} /{" "}
              {r.jobQuotaMax >= 999 ? "∞" : r.jobQuotaMax} งาน
            </Text>
            <Text type="secondary" style={{ fontSize: 11 }}>
              {r.quotaUsagePercent}%
            </Text>
          </Flex>
          <Progress
            percent={r.quotaUsagePercent}
            size="small"
            showInfo={false}
            strokeColor={
              r.quotaUsagePercent >= 90
                ? "#ff4d4f"
                : r.quotaUsagePercent >= 70
                  ? "#fa8c16"
                  : "#52c41a"
            }
          />
        </Flex>
      ),
    },
    {
      title: "เปลี่ยน Package",
      key: "change",
      width: 40 + plans.filter((p) => p.isActive).length * 80,
      render: (_, r) => (
        <Flex gap={6} align="center" wrap="wrap">
          {plans
            .filter((p) => p.isActive)
            .map((planItem) => {
              const isCurrent = r.accountPlan === planItem.plan;
              const loading = isUpdating === r.id;
              return (
                <Tooltip
                  key={planItem.plan}
                  title={
                    isCurrent
                      ? "Package ปัจจุบัน"
                      : `เปลี่ยนเป็น ${planItem.label}`
                  }
                >
                  <Button
                    size="small"
                    type={isCurrent ? "primary" : "default"}
                    disabled={isCurrent || loading}
                    loading={loading && modalTargetPlan?.plan === planItem.plan}
                    onClick={() => openPlanModal(r, planItem)}
                    style={{
                      borderColor: planItem.color,
                      color: isCurrent ? "white" : planItem.color,
                      background: isCurrent ? planItem.color : "transparent",
                      fontWeight: 600,
                      fontSize: 11,
                      borderRadius: 6,
                      height: 28,
                      padding: "0 10px",
                    }}
                  >
                    {planItem.label}
                  </Button>
                </Tooltip>
              );
            })}
        </Flex>
      ),
    },
    {
      title: "สมัครเมื่อ",
      key: "createdAt",
      width: 110,
      render: (_, r) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {formatThaiDate(r.createdAt)}
        </Text>
      ),
    },
    {
      title: "อัปเดตล่าสุด",
      key: "updatedAt",
      width: 110,
      render: (_, r) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {formatThaiDate(r.updatedAt)}
        </Text>
      ),
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: token.colorBgLayout }}>
      {/* ─── Hero Banner ─── */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #001e45 0%, #0a4a8a 55%, #11b6f5 100%)",
          padding: "40px 0 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(17,182,245,0.12)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -40,
            left: "30%",
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            position: "relative",
          }}
        >
          <Breadcrumb
            style={{ marginBottom: 20 }}
            items={[
              {
                title: (
                  <Link
                    href="/pages/admin"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    แดชบอร์ด
                  </Link>
                ),
              },
              {
                title: <span style={{ color: "white" }}>จัดการ Package</span>,
              },
            ]}
          />
          <Flex align="flex-start" justify="space-between" wrap="wrap" gap={16}>
            <Flex vertical gap={4}>
              <Title level={2} style={{ margin: 0, color: "white" }}>
                จัดการ Package
              </Title>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
                สร้าง/แก้ไข Plan และจัดการ Job Quota ให้สถานศึกษา — Dynamic
                ทั้งหมดโดย Admin
              </Text>
            </Flex>
            {/* ✨ Payment Gateway Hook Banner */}
            <Flex
              align="center"
              gap={10}
              style={{
                padding: "10px 16px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(8px)",
              }}
            >
              <ThunderboltOutlined style={{ color: "#fadb14", fontSize: 16 }} />
              <Flex vertical gap={1}>
                <Text style={{ color: "white", fontSize: 12, fontWeight: 600 }}>
                  Payment Gateway Ready
                </Text>
                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>
                  POST /api/v1/admin/packages/update → ลูกค้าได้รับ Plan ทันที
                </Text>
              </Flex>
              <Tooltip title="เชื่อม Omise / Stripe / PromptPay โดยเรียก endpoint นี้หลังชำระเงินสำเร็จ">
                <LinkOutlined
                  style={{ color: "rgba(255,255,255,0.6)", cursor: "help" }}
                />
              </Tooltip>
            </Flex>
          </Flex>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div
        style={{
          maxWidth: 1280,
          margin: "-40px auto 0",
          padding: "0 24px 80px",
          position: "relative",
        }}
      >
        {/* ─── Summary Stats (dynamic) ─── */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {statsCards.map((s) => (
            <Col xs={12} sm={6} key={s.key}>
              <Card
                variant="borderless"
                style={{
                  borderRadius: 16,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  cursor: s.key !== "all" ? "pointer" : "default",
                  border:
                    filterPlan === s.key
                      ? `2px solid ${s.color}`
                      : `2px solid transparent`,
                  transition: "all 0.2s",
                }}
                onClick={() => setFilterPlan(s.key)}
              >
                <Flex vertical align="center" gap={6}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {s.label}
                  </Text>
                  <Text
                    strong
                    style={{ fontSize: 32, lineHeight: 1, color: s.color }}
                  >
                    {s.value}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    โรงเรียน
                  </Text>
                </Flex>
              </Card>
            </Col>
          ))}
        </Row>

        {/* ─── Package Plan Cards (CRUD) ─── */}
        <Card
          variant="borderless"
          style={{
            borderRadius: 16,
            marginBottom: 24,
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
          title={
            <Flex align="center" justify="space-between">
              <Flex align="center" gap={8}>
                <DatabaseOutlined style={{ color: token.colorPrimary }} />
                <Text strong>Package Plans ({plans.length})</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  — จัดการจาก Admin ได้เลย ไม่ต้องผ่าน Developer
                </Text>
              </Flex>
              <Flex gap={8}>
                {plans.length === 0 && !isLoadingPlans && (
                  <Button size="small" onClick={seedPlans}>
                    Seed ค่าเริ่มต้น
                  </Button>
                )}
                <Button
                  type="primary"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={openCreatePlan}
                >
                  สร้าง Plan ใหม่
                </Button>
              </Flex>
            </Flex>
          }
        >
          {isLoadingPlans ? (
            <Skeleton active paragraph={{ rows: 3 }} />
          ) : plans.length === 0 ? (
            <Empty
              description="ยังไม่มี Package Plan — กด Seed ค่าเริ่มต้น หรือ สร้างใหม่"
              style={{ padding: "32px 0" }}
            />
          ) : (
            <Row gutter={[16, 16]}>
              {plans.map((plan) => (
                <Col xs={24} sm={12} md={8} key={plan.plan}>
                  <Card
                    size="small"
                    variant="borderless"
                    style={{
                      borderRadius: 12,
                      borderTop: `4px solid ${plan.color}`,
                      opacity: plan.isActive ? 1 : 0.55,
                      background: token.colorBgContainer,
                      boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                    }}
                    extra={
                      <Flex gap={4}>
                        <Tooltip title="แก้ไข Plan">
                          <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => openEditPlan(plan)}
                            style={{ color: plan.color }}
                          />
                        </Tooltip>
                        <Tooltip title="ลบ Plan">
                          <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            loading={isDeletingPlan === plan.plan}
                            onClick={() => setDeletingPlanItem(plan)}
                          />
                        </Tooltip>
                      </Flex>
                    }
                    title={
                      <Flex align="center" gap={8}>
                        <Tag
                          style={{
                            fontWeight: 700,
                            fontSize: 12,
                            border: `1.5px solid ${plan.color}`,
                            color: plan.color,
                            background: `${plan.color}18`,
                          }}
                        >
                          {plan.badgeIcon === "crown" && (
                            <CrownOutlined style={{ marginRight: 4 }} />
                          )}
                          {plan.badgeIcon === "thunder" && (
                            <ThunderboltOutlined style={{ marginRight: 4 }} />
                          )}
                          {plan.label}
                        </Tag>
                        {!plan.isActive && (
                          <Tag color="default" style={{ fontSize: 10 }}>
                            ปิดใช้งาน
                          </Tag>
                        )}
                      </Flex>
                    }
                  >
                    <Flex vertical gap={8}>
                      {/* ─── ราคา + Quota ─── */}
                      <Flex justify="space-between">
                        <Text strong style={{ color: plan.color, fontSize: 16 }}>
                          {plan.price === 0
                            ? "ฟรี"
                            : `฿${plan.price.toLocaleString()}/เดือน`}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Quota:{" "}
                          {plan.jobQuota >= 999
                            ? "ไม่จำกัด"
                            : `${plan.jobQuota} งาน`}
                        </Text>
                      </Flex>

                      {/* ─── Features ─── */}
                      <Flex vertical gap={3}>
                        {plan.features.slice(0, 4).map((f) => (
                          <Flex key={f} align="center" gap={6}>
                            <div
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                background: plan.color,
                                flexShrink: 0,
                              }}
                            />
                            <Text style={{ fontSize: 11 }}>{f}</Text>
                          </Flex>
                        ))}
                        {plan.features.length > 4 && (
                          <Text type="secondary" style={{ fontSize: 10 }}>
                            +{plan.features.length - 4} รายการ
                          </Text>
                        )}
                      </Flex>

                      {/* ─── Meta ─── */}
                      <Flex justify="space-between">
                        <Text
                          type="secondary"
                          style={{ fontSize: 10, fontFamily: "monospace" }}
                        >
                          key: {plan.plan}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 10 }}>
                          เตือนที่ {plan.quotaWarningThreshold}%
                        </Text>
                      </Flex>
                    </Flex>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card>

        {/* ─── Filter Bar ─── */}
        <Card
          variant="borderless"
          style={{
            borderRadius: 16,
            marginBottom: 16,
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <Flex align="center" gap={12} wrap="wrap">
            <FilterOutlined style={{ color: token.colorTextTertiary }} />
            <Input
              prefix={
                <SearchOutlined style={{ color: token.colorTextTertiary }} />
              }
              placeholder="ค้นหาชื่อโรงเรียน, จังหวัด, อีเมล..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              allowClear
              style={{ width: 300, borderRadius: 10 }}
            />
            <Select
              value={filterPlan}
              onChange={setFilterPlan}
              style={{ width: 180 }}
              options={planFilterOptions}
            />
            <Text type="secondary" style={{ fontSize: 13, marginLeft: "auto" }}>
              พบ {total} โรงเรียน
            </Text>
          </Flex>
        </Card>

        {/* ─── Table ─── */}
        <Card
          variant="borderless"
          style={{
            borderRadius: 16,
            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          {isLoading ? (
            <Skeleton active paragraph={{ rows: 8 }} />
          ) : (
            <Table<SchoolPackageItem>
              dataSource={schools}
              columns={columns}
              rowKey="id"
              pagination={false}
              scroll={{ x: 1200 }}
              size="middle"
              locale={{ emptyText: "ไม่พบข้อมูลโรงเรียน" }}
              rowClassName={(r) =>
                isUpdating === r.id ? "ant-table-row-loading" : ""
              }
            />
          )}
          {total > 20 && (
            <Flex justify="flex-end" style={{ marginTop: 16 }}>
              <Pagination
                current={page}
                total={total}
                pageSize={20}
                onChange={setPage}
                showSizeChanger={false}
                showTotal={(t) => `ทั้งหมด ${t} รายการ`}
              />
            </Flex>
          )}
        </Card>
      </div>

      {/* ─── Plan Form Modal (สร้าง/แก้ไข Plan) ─── */}
      <PlanFormModal
        open={planModalOpen}
        mode={planModalMode}
        editingPlan={editingPlan}
        plans={plans}
        isSaving={isSavingPlan}
        onSubmit={handlePlanSubmit}
        onCancel={() => setPlanModalOpen(false)}
      />

      {/* ─── Delete Plan Modal ─── */}
      <DeletePlanModal
        open={!!deletingPlanItem}
        plan={deletingPlanItem}
        isDeleting={isDeletingPlan === deletingPlanItem?.plan}
        onConfirm={handleDeletePlan}
        onCancel={() => setDeletingPlanItem(null)}
      />

      {/* ─── Plan Change Modal (เปลี่ยน plan ให้โรงเรียน) ─── */}
      <PlanChangeModal
        school={modalSchool}
        targetPlan={modalTargetPlan}
        currentPlanDef={
          modalSchool ? getPlanDef(modalSchool.accountPlan) : null
        }
        open={!!modalSchool && !!modalTargetPlan}
        isUpdating={isUpdating === modalSchool?.id}
        onConfirm={handleConfirmPlan}
        onCancel={() => {
          setModalSchool(null);
          setModalTargetPlan(null);
        }}
      />
    </div>
  );
}

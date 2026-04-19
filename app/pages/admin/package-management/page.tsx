"use client";

// ✨ Admin Package Management — CRUD Plan + School Detail + Bulk Change + Revenue + Quota Alert
import { useAuthStore } from "@/app/stores/auth-store";
import { ModalComponent } from "@/app/components/modal/modal.component";
import {
  CheckSquareOutlined,
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
  SwapOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  Empty,
  Flex,
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
import Input from "antd/es/input/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BulkPlanModal } from "./_components/bulk-plan-modal";
import { PlanFormModal } from "./_components/plan-form-modal";
import { PlanChangeModal } from "./_components/plan-change-modal";
import { QuotaAlertPanel } from "./_components/quota-alert-panel";
import { RevenueProjectionPanel } from "./_components/revenue-projection-panel";
import { SchoolDetailDrawer } from "./_components/school-detail-drawer";
import {
  PackagePlanItem,
  PlanFormData,
  SchoolPackageItem,
  usePackageStore,
} from "./_state/package-store";

const { Title, Text } = Typography;

const formatThaiDate = (iso?: string | null) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
};

const PlanTag: React.FC<{ plan: string; planDef?: PackagePlanItem }> = ({ plan, planDef }) => {
  if (!planDef) return <Tag style={{ fontFamily: "monospace", fontSize: 11 }}>{plan}</Tag>;
  return (
    <Tag style={{ fontWeight: 700, fontSize: 12, borderRadius: 6, padding: "2px 10px", border: `1.5px solid ${planDef.color}`, background: `${planDef.color}18`, color: planDef.color }}>
      {planDef.badgeIcon === "crown" && <CrownOutlined style={{ marginRight: 4 }} />}
      {planDef.badgeIcon === "thunder" && <ThunderboltOutlined style={{ marginRight: 4 }} />}
      {planDef.label}
    </Tag>
  );
};

// ✨ State สำหรับ ModalComponent
interface StatusModal {
  open: boolean;
  type: "success" | "error" | "confirm" | "delete";
  title: string;
  description?: string;
  errorDetails?: unknown;
  onConfirm?: () => void;
}

const MODAL_CLOSED: StatusModal = { open: false, type: "success", title: "" };

export default function PackageManagementPage() {
  const { token } = theme.useToken();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const {
    plans, isLoadingPlans, isSavingPlan, isDeletingPlan,
    fetchPlans, seedPlans, createPlan, patchPlan, deletePlan,
    schools, total, summary, isLoading, isUpdating,
    filterPlan, filterKeyword, page,
    setFilterPlan, setFilterKeyword, setPage,
    fetchSummary, fetchSchools, updatePlan,
    openDrawer,
    selectedIds, isBulkUpdating, toggleSelect, selectAll, clearSelection, bulkUpdatePlan,
  } = usePackageStore();

  const [isMounted, setIsMounted] = useState(false);
  const [searchInput, setSearchInput] = useState(filterKeyword);
  const [statusModal, setStatusModal] = useState<StatusModal>(MODAL_CLOSED);

  // ─── Plan Form Modal ───
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [planModalMode, setPlanModalMode] = useState<"create" | "edit">("create");
  const [editingPlan, setEditingPlan] = useState<PackagePlanItem | null>(null);
  const [deletingPlanItem, setDeletingPlanItem] = useState<PackagePlanItem | null>(null);

  // ─── Single Plan Change Modal ───
  const [modalSchool, setModalSchool] = useState<SchoolPackageItem | null>(null);
  const [modalTargetPlan, setModalTargetPlan] = useState<PackagePlanItem | null>(null);

  // ─── Bulk Plan Change Modal ───
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkTargetPlan, setBulkTargetPlan] = useState<PackagePlanItem | null>(null);

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (!isAuthenticated || !user) { router.replace("/pages/signin"); return; }
    if (user.role !== "ADMIN") router.replace("/");
  }, [isMounted, isAuthenticated, user?.role]);

  useEffect(() => {
    if (!isMounted || user?.role !== "ADMIN") return;
    fetchSummary();
    fetchSchools();
    fetchPlans(true);
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted || user?.role !== "ADMIN") return;
    fetchSchools();
  }, [filterPlan, filterKeyword, page]);

  useEffect(() => {
    const t = setTimeout(() => setFilterKeyword(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const getPlanDef = (planKey: string) => plans.find((p) => p.plan === planKey) ?? null;

  // ─── Plan Form Handlers ───
  const openCreatePlan = () => { setPlanModalMode("create"); setEditingPlan(null); setPlanModalOpen(true); };
  const openEditPlan = (plan: PackagePlanItem) => { setPlanModalMode("edit"); setEditingPlan(plan); setPlanModalOpen(true); };

  const handlePlanSubmit = async (data: PlanFormData) => {
    try {
      if (planModalMode === "create") {
        await createPlan(data);
        setPlanModalOpen(false);
        fetchSummary();
        setStatusModal({
          open: true, type: "success",
          title: "สร้าง Package Plan สำเร็จ",
          description: `Plan "${data.label}" ถูกสร้างและพร้อมใช้งานแล้ว`,
        });
      } else if (editingPlan) {
        const { plan: _key, ...patchData } = data;
        await patchPlan(editingPlan.plan, patchData);
        setPlanModalOpen(false);
        fetchSummary();
        setStatusModal({
          open: true, type: "success",
          title: "อัปเดต Package Plan สำเร็จ",
          description: `Plan "${data.label}" ถูกบันทึกเรียบร้อยแล้ว`,
        });
      }
    } catch (err) {
      setPlanModalOpen(false);
      setStatusModal({
        open: true, type: "error",
        title: "บันทึก Package Plan ไม่สำเร็จ",
        description: "ไม่สามารถบันทึกข้อมูลได้ กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง",
        errorDetails: err,
      });
    }
  };

  // ✨ เปิด modal ยืนยันการลบ (type="delete")
  const openDeleteConfirm = (plan: PackagePlanItem) => {
    setDeletingPlanItem(plan);
    setStatusModal({
      open: true, type: "delete",
      title: `ลบ Package Plan "${plan.label}"?`,
      description: "⚠️ ไม่สามารถลบได้ถ้ายังมีโรงเรียนใช้ Plan นี้อยู่ การกระทำนี้ไม่สามารถย้อนกลับได้",
      onConfirm: async () => {
        setStatusModal(MODAL_CLOSED);
        try {
          await deletePlan(plan.plan);
          setStatusModal({
            open: true, type: "success",
            title: "ลบ Package Plan สำเร็จ",
            description: `Plan "${plan.label}" ถูกลบออกจากระบบแล้ว`,
          });
        } catch (err) {
          const e = err as { response?: { data?: { message_th?: string } } };
          const reason = e?.response?.data?.message_th ?? "ไม่สามารถลบได้ อาจมีโรงเรียนที่ยังใช้ Plan นี้อยู่";
          setStatusModal({
            open: true, type: "error",
            title: "ลบ Package Plan ไม่สำเร็จ",
            description: reason,
            errorDetails: err,
          });
        }
      },
    });
  };

  // ─── Single Plan Change ───
  const openPlanModal = (school: SchoolPackageItem, targetPlanItem: PackagePlanItem) => {
    if (targetPlanItem.plan === school.accountPlan) return;
    setModalSchool(school);
    setModalTargetPlan(targetPlanItem);
  };

  const handleConfirmPlan = async (jobQuotaMax: number) => {
    if (!modalSchool || !modalTargetPlan) return;
    const schoolName = modalSchool.schoolName;
    const planLabel = modalTargetPlan.label;
    setModalSchool(null);
    setModalTargetPlan(null);
    try {
      await updatePlan(modalSchool.id, modalTargetPlan.plan, jobQuotaMax);
      setStatusModal({
        open: true, type: "success",
        title: "เปลี่ยน Package สำเร็จ",
        description: `"${schoolName}" ได้รับ Package ${planLabel} เรียบร้อยแล้ว`,
      });
    } catch (err) {
      setStatusModal({
        open: true, type: "error",
        title: "เปลี่ยน Package ไม่สำเร็จ",
        description: `ไม่สามารถเปลี่ยน Package ของ "${schoolName}" ได้ กรุณาลองใหม่`,
        errorDetails: err,
      });
    }
  };

  // ─── Detail Drawer → Plan Change ───
  const handleDrawerChangePlan = (schoolId: string, targetPlan: PackagePlanItem) => {
    const school = schools.find((s) => s.id === schoolId);
    if (school) openPlanModal(school, targetPlan);
  };

  // ─── Bulk Plan Change ───
  const openBulkModal = (targetPlan: PackagePlanItem) => {
    if (selectedIds.length === 0) {
      setStatusModal({
        open: true, type: "confirm",
        title: "ยังไม่ได้เลือกโรงเรียน",
        description: "กรุณาติ๊กเลือกโรงเรียนอย่างน้อย 1 แห่งในตาราง ก่อนกด Bulk Change",
      });
      return;
    }
    setBulkTargetPlan(targetPlan);
    setBulkModalOpen(true);
  };

  const handleBulkConfirm = async (quota: number) => {
    if (!bulkTargetPlan) return;
    const count = selectedIds.length;
    const planLabel = bulkTargetPlan.label;
    setBulkModalOpen(false);
    setBulkTargetPlan(null);
    try {
      await bulkUpdatePlan(bulkTargetPlan.plan, quota);
      setStatusModal({
        open: true, type: "success",
        title: "Bulk Update สำเร็จ",
        description: `เปลี่ยน ${count} โรงเรียน → Package ${planLabel} เรียบร้อยแล้ว`,
      });
    } catch (err) {
      setStatusModal({
        open: true, type: "error",
        title: "Bulk Update ไม่สำเร็จ",
        description: "ไม่สามารถอัปเดตโรงเรียนบางส่วนหรือทั้งหมดได้ กรุณาลองใหม่หรือทำทีละรายการ",
        errorDetails: err,
      });
    }
  };

  if (!isMounted) return null;

  // ─── Summary Stats ───
  const statsCards = [
    { key: "all", label: "โรงเรียนทั้งหมด", value: summary.total, color: token.colorPrimary },
    ...plans.filter((p) => p.isActive).map((p) => ({ key: p.plan, label: p.label, value: summary[p.plan] ?? 0, color: p.color })),
  ];

  const planFilterOptions = [
    { value: "all", label: "ทุก Package" },
    ...plans.map((p) => ({ value: p.plan, label: p.label })),
  ];

  const selectedSchools = schools.filter((s) => selectedIds.includes(s.id));
  const allSelected = schools.length > 0 && schools.every((s) => selectedIds.includes(s.id));

  // ─── Table Columns ───
  const columns: ColumnsType<SchoolPackageItem> = [
    {
      title: (
        <Checkbox
          checked={allSelected}
          indeterminate={selectedIds.length > 0 && !allSelected}
          onChange={(e) => e.target.checked ? selectAll() : clearSelection()}
        />
      ),
      key: "select",
      width: 44,
      fixed: "left",
      render: (_, r) => (
        <Checkbox
          checked={selectedIds.includes(r.id)}
          onChange={() => toggleSelect(r.id)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      title: "โรงเรียน",
      key: "school",
      width: 240,
      fixed: "left",
      render: (_, r) => (
        <Flex align="center" gap={12}>
          <Avatar size={38} src={r.logoUrl || undefined} style={{ backgroundColor: token.colorPrimary, fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
            {!r.logoUrl && r.schoolName.charAt(0)}
          </Avatar>
          <Flex vertical gap={1}>
            <Text strong style={{ fontSize: 13, lineHeight: 1.3 }}>{r.schoolName}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>{r.province}{r.schoolType ? ` · ${r.schoolType}` : ""}</Text>
          </Flex>
        </Flex>
      ),
    },
    {
      title: "ผู้ดูแล",
      key: "owner",
      width: 190,
      render: (_, r) => (
        <Flex vertical gap={2}>
          <Text style={{ fontSize: 12 }}>{r.owner.name}</Text>
          <Flex align="center" gap={4}>
            <MailOutlined style={{ fontSize: 10, color: token.colorTextTertiary }} />
            <Text type="secondary" style={{ fontSize: 11 }}>{r.owner.email}</Text>
          </Flex>
          {r.owner.phoneNumber && (
            <Flex align="center" gap={4}>
              <PhoneOutlined style={{ fontSize: 10, color: token.colorTextTertiary }} />
              <Text type="secondary" style={{ fontSize: 11 }}>{r.owner.phoneNumber}</Text>
            </Flex>
          )}
        </Flex>
      ),
    },
    {
      title: "Package",
      key: "plan",
      width: 130,
      align: "center",
      render: (_, r) => <PlanTag plan={r.accountPlan} planDef={getPlanDef(r.accountPlan) ?? undefined} />,
    },
    {
      title: "Job Quota",
      key: "quota",
      width: 170,
      render: (_, r) => (
        <Flex vertical gap={4}>
          <Flex justify="space-between">
            <Text style={{ fontSize: 12 }}>{r.activeJobCount} / {r.jobQuotaMax >= 999 ? "∞" : r.jobQuotaMax} งาน</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>{r.quotaUsagePercent}%</Text>
          </Flex>
          <Progress
            percent={r.quotaUsagePercent}
            size="small"
            showInfo={false}
            strokeColor={r.quotaUsagePercent >= 90 ? "#ff4d4f" : r.quotaUsagePercent >= 70 ? "#fa8c16" : "#52c41a"}
          />
        </Flex>
      ),
    },
    {
      title: "เปลี่ยน Package",
      key: "change",
      width: 40 + plans.filter((p) => p.isActive).length * 80,
      render: (_, r) => (
        <Flex gap={6} wrap="wrap">
          {plans.filter((p) => p.isActive).map((planItem) => {
            const isCurrent = r.accountPlan === planItem.plan;
            return (
              <Tooltip key={planItem.plan} title={isCurrent ? "Package ปัจจุบัน" : `เปลี่ยนเป็น ${planItem.label}`}>
                <Button
                  size="small"
                  type={isCurrent ? "primary" : "default"}
                  disabled={isCurrent || isUpdating === r.id}
                  onClick={(e) => { e.stopPropagation(); openPlanModal(r, planItem); }}
                  style={{ borderColor: planItem.color, color: isCurrent ? "white" : planItem.color, background: isCurrent ? planItem.color : "transparent", fontWeight: 600, fontSize: 11, borderRadius: 6, height: 28, padding: "0 10px" }}
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
      width: 100,
      render: (_, r) => <Text type="secondary" style={{ fontSize: 12 }}>{formatThaiDate(r.createdAt)}</Text>,
    },
    {
      title: "อัปเดตล่าสุด",
      key: "updatedAt",
      width: 100,
      render: (_, r) => <Text type="secondary" style={{ fontSize: 12 }}>{formatThaiDate(r.updatedAt)}</Text>,
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: token.colorBgLayout }}>
      {/* ─── Hero Banner ─── */}
      <div style={{ background: "linear-gradient(135deg, #001e45 0%, #0a4a8a 55%, #11b6f5 100%)", padding: "40px 0 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(17,182,245,0.12)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: "30%", width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <Breadcrumb style={{ marginBottom: 20 }} items={[
            { title: <Link href="/pages/admin" style={{ color: "rgba(255,255,255,0.65)" }}>แดชบอร์ด</Link> },
            { title: <span style={{ color: "white" }}>แพ็กเกจสมาชิก</span> },
          ]} />
          <Flex align="flex-start" justify="space-between" wrap="wrap" gap={16}>
            <Flex vertical gap={4}>
              <Title level={2} style={{ margin: 0, color: "white" }}>แพ็กเกจสมาชิก</Title>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
                สร้าง/แก้ไข Plan · Revenue Intelligence · Quota Alert · Bulk Update
              </Text>
            </Flex>
            <Flex align="center" gap={10} style={{ padding: "10px 16px", borderRadius: 12, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(8px)" }}>
              <ThunderboltOutlined style={{ color: "#fadb14", fontSize: 16 }} />
              <Flex vertical gap={1}>
                <Text style={{ color: "white", fontSize: 12, fontWeight: 600 }}>Payment Gateway Ready</Text>
                <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>PUT /api/v1/admin/packages/update → ลูกค้าได้รับ Plan ทันที</Text>
              </Flex>
              <Tooltip title="เชื่อม Omise / Stripe / PromptPay โดยเรียก endpoint นี้หลังชำระเงินสำเร็จ">
                <LinkOutlined style={{ color: "rgba(255,255,255,0.6)", cursor: "help" }} />
              </Tooltip>
            </Flex>
          </Flex>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div style={{ maxWidth: 1280, margin: "-40px auto 0", padding: "0 24px 80px", position: "relative" }}>

        {/* ─── Summary Stats ─── */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {statsCards.map((s) => (
            <Col xs={12} sm={6} key={s.key}>
              <Card variant="borderless" style={{ borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.06)", cursor: s.key !== "all" ? "pointer" : "default", border: filterPlan === s.key ? `2px solid ${s.color}` : "2px solid transparent", transition: "all 0.2s" }} onClick={() => setFilterPlan(s.key)}>
                <Flex vertical align="center" gap={6}>
                  <Text type="secondary" style={{ fontSize: 12 }}>{s.label}</Text>
                  <Text strong style={{ fontSize: 32, lineHeight: 1, color: s.color }}>{s.value}</Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>โรงเรียน</Text>
                </Flex>
              </Card>
            </Col>
          ))}
        </Row>

        {/* ─── Feature 3: Revenue Intelligence ─── */}
        <RevenueProjectionPanel plans={plans} />

        {/* ─── Feature 2: Quota Alert ─── */}
        <QuotaAlertPanel
          plans={plans}
          onChangePlan={(school, targetPlan) => openPlanModal(school, targetPlan)}
          onViewDetail={(schoolId) => openDrawer(schoolId)}
        />

        {/* ─── Package Plan Cards (CRUD) ─── */}
        <Card variant="borderless" style={{ borderRadius: 16, marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
          title={
            <Flex align="center" justify="space-between">
              <Flex align="center" gap={8}>
                <DatabaseOutlined style={{ color: token.colorPrimary }} />
                <Text strong>Package Plans ({plans.length})</Text>
                <Text type="secondary" style={{ fontSize: 12 }}>— Admin จัดการได้โดยตรง</Text>
              </Flex>
              <Flex gap={8}>
                {plans.length === 0 && !isLoadingPlans && (
                  <Button size="small" onClick={seedPlans}>Seed ค่าเริ่มต้น</Button>
                )}
                <Button type="primary" size="small" icon={<PlusOutlined />} onClick={openCreatePlan}>สร้าง Plan ใหม่</Button>
              </Flex>
            </Flex>
          }
        >
          {isLoadingPlans ? <Skeleton active paragraph={{ rows: 3 }} /> : plans.length === 0 ? (
            <Empty description="ยังไม่มี Package Plan — กด Seed ค่าเริ่มต้น หรือ สร้างใหม่" style={{ padding: "32px 0" }} />
          ) : (
            <Row gutter={[16, 16]}>
              {plans.map((plan) => (
                <Col xs={24} sm={12} md={8} key={plan.plan}>
                  <Card size="small" variant="borderless" style={{ borderRadius: 12, borderTop: `4px solid ${plan.color}`, opacity: plan.isActive ? 1 : 0.55, background: token.colorBgContainer, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}
                    extra={
                      <Flex gap={4}>
                        <Tooltip title="แก้ไข Plan">
                          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => openEditPlan(plan)} style={{ color: plan.color }} />
                        </Tooltip>
                        <Tooltip title="ลบ Plan">
                          <Button type="text" size="small" danger icon={<DeleteOutlined />} loading={isDeletingPlan === plan.plan} onClick={() => openDeleteConfirm(plan)} />
                        </Tooltip>
                      </Flex>
                    }
                    title={
                      <Flex align="center" gap={8}>
                        <Tag style={{ fontWeight: 700, fontSize: 12, border: `1.5px solid ${plan.color}`, color: plan.color, background: `${plan.color}18` }}>
                          {plan.badgeIcon === "crown" && <CrownOutlined style={{ marginRight: 4 }} />}
                          {plan.badgeIcon === "thunder" && <ThunderboltOutlined style={{ marginRight: 4 }} />}
                          {plan.label}
                        </Tag>
                        {!plan.isActive && <Tag color="default" style={{ fontSize: 10 }}>ปิดใช้งาน</Tag>}
                      </Flex>
                    }
                  >
                    <Flex vertical gap={8}>
                      <Flex justify="space-between">
                        <Text strong style={{ color: plan.color, fontSize: 16 }}>
                          {plan.price === 0 ? "ฟรี" : `฿${plan.price.toLocaleString()}/เดือน`}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Quota: {plan.jobQuota >= 999 ? "ไม่จำกัด" : `${plan.jobQuota} งาน`}
                        </Text>
                      </Flex>
                      <Flex vertical gap={3}>
                        {plan.features.slice(0, 4).map((f) => (
                          <Flex key={f} align="center" gap={6}>
                            <div style={{ width: 5, height: 5, borderRadius: "50%", background: plan.color, flexShrink: 0 }} />
                            <Text style={{ fontSize: 11 }}>{f}</Text>
                          </Flex>
                        ))}
                        {plan.features.length > 4 && <Text type="secondary" style={{ fontSize: 10 }}>+{plan.features.length - 4} รายการ</Text>}
                      </Flex>
                      <Flex justify="space-between">
                        <Text type="secondary" style={{ fontSize: 10, fontFamily: "monospace" }}>key: {plan.plan}</Text>
                        <Text type="secondary" style={{ fontSize: 10 }}>เตือนที่ {plan.quotaWarningThreshold}%</Text>
                      </Flex>
                    </Flex>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card>

        {/* ─── Filter Bar + Bulk Actions ─── */}
        <Card variant="borderless" style={{ borderRadius: 16, marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <Flex align="center" gap={12} wrap="wrap">
            <FilterOutlined style={{ color: token.colorTextTertiary }} />
            <Input
              prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
              placeholder="ค้นหาชื่อโรงเรียน, จังหวัด, อีเมล..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              allowClear
              style={{ width: 280, borderRadius: 10 }}
            />
            <Select value={filterPlan} onChange={setFilterPlan} style={{ width: 160 }} options={planFilterOptions} />

            {/* ─── Feature 4: Bulk Action Bar ─── */}
            {selectedIds.length > 0 && (
              <Flex
                align="center"
                gap={8}
                style={{ marginLeft: "auto", padding: "6px 12px", borderRadius: 10, background: token.colorPrimaryBg, border: `1px solid ${token.colorPrimaryBorder}` }}
              >
                <CheckSquareOutlined style={{ color: token.colorPrimary, fontSize: 13 }} />
                <Text style={{ fontSize: 12, color: token.colorPrimary, fontWeight: 600 }}>
                  เลือก {selectedIds.length} โรงเรียน
                </Text>
                <Flex gap={4}>
                  {plans.filter((p) => p.isActive).map((p) => (
                    <Button
                      key={p.plan}
                      size="small"
                      icon={<SwapOutlined />}
                      onClick={() => openBulkModal(p)}
                      loading={isBulkUpdating}
                      style={{ borderColor: p.color, color: p.color, fontSize: 11, height: 26, padding: "0 8px", borderRadius: 6 }}
                    >
                      → {p.label}
                    </Button>
                  ))}
                </Flex>
                <Button type="text" size="small" onClick={clearSelection} style={{ fontSize: 11, color: token.colorTextSecondary }}>
                  ยกเลิก
                </Button>
              </Flex>
            )}

            {selectedIds.length === 0 && (
              <Text type="secondary" style={{ fontSize: 13, marginLeft: "auto" }}>พบ {total} โรงเรียน</Text>
            )}
          </Flex>
        </Card>

        {/* ─── Table ─── */}
        <Card variant="borderless" style={{ borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          {isLoading ? <Skeleton active paragraph={{ rows: 8 }} /> : (
            <Table<SchoolPackageItem>
              dataSource={schools}
              columns={columns}
              rowKey="id"
              pagination={false}
              scroll={{ x: 1280 }}
              size="middle"
              locale={{ emptyText: "ไม่พบข้อมูลโรงเรียน" }}
              onRow={(r) => ({
                onClick: () => openDrawer(r.id),
                style: { cursor: "pointer" },
              })}
              rowClassName={(r) => selectedIds.includes(r.id) ? "ant-table-row-selected" : ""}
            />
          )}
          {total > 20 && (
            <Flex justify="flex-end" style={{ marginTop: 16 }}>
              <Pagination current={page} total={total} pageSize={20} onChange={setPage} showSizeChanger={false} showTotal={(t) => `ทั้งหมด ${t} รายการ`} />
            </Flex>
          )}
        </Card>
      </div>

      {/* ─── Modals & Drawers ─── */}
      <PlanFormModal open={planModalOpen} mode={planModalMode} editingPlan={editingPlan} plans={plans} isSaving={isSavingPlan} onSubmit={handlePlanSubmit} onCancel={() => setPlanModalOpen(false)} />

      <PlanChangeModal school={modalSchool} targetPlan={modalTargetPlan} currentPlanDef={modalSchool ? getPlanDef(modalSchool.accountPlan) : null} open={!!modalSchool && !!modalTargetPlan} isUpdating={isUpdating === modalSchool?.id} onConfirm={handleConfirmPlan} onCancel={() => { setModalSchool(null); setModalTargetPlan(null); }} />

      {/* ─── Feature 1: School Detail Drawer ─── */}
      <SchoolDetailDrawer
        plans={plans}
        onChangePlan={(schoolId, targetPlan) => handleDrawerChangePlan(schoolId, targetPlan)}
      />

      {/* ─── Feature 4: Bulk Plan Modal ─── */}
      <BulkPlanModal
        open={bulkModalOpen}
        targetPlan={bulkTargetPlan}
        selectedSchools={selectedSchools}
        plans={plans}
        onConfirm={handleBulkConfirm}
        onCancel={() => { setBulkModalOpen(false); setBulkTargetPlan(null); }}
      />

      {/* ─── Status Modal (ModalComponent) — รายงานผล success/error/confirm/delete ─── */}
      <ModalComponent
        open={statusModal.open}
        type={statusModal.type}
        title={statusModal.title}
        description={statusModal.description}
        errorDetails={statusModal.errorDetails}
        loading={
          statusModal.type === "delete"
            ? isDeletingPlan !== null
            : false
        }
        onClose={() => { setStatusModal(MODAL_CLOSED); setDeletingPlanItem(null); }}
        onConfirm={statusModal.onConfirm}
      />
    </div>
  );
}

"use client";

// ✨ หน้าจัดการ Package สำหรับ ADMIN — ดู/เปลี่ยน plan โรงเรียน, แก้ไขราคา, รองรับ Payment Gateway
import {
  PACKAGE_DEFINITIONS,
  PlanType,
} from "@/app/api/v1/admin/packages/validation/package-schema";
import { useAuthStore } from "@/app/stores/auth-store";
import {
  CrownOutlined,
  EditOutlined,
  FilterOutlined,
  LinkOutlined,
  MailOutlined,
  PhoneOutlined,
  SearchOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
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
import { PlanChangeModal } from "./_components/plan-change-modal";
import { SchoolPackageItem, usePackageStore } from "./_state/package-store";

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

// ✨ Plan Tag Component
const PlanTag: React.FC<{ plan: string }> = ({ plan }) => {
  const def = PACKAGE_DEFINITIONS[plan as PlanType];
  if (!def) return <Tag>{plan}</Tag>;
  return (
    <Tag
      color={def.color}
      style={{
        fontWeight: 700,
        fontSize: 12,
        borderRadius: 6,
        padding: "2px 10px",
        border: `1.5px solid ${def.color}`,
        background: `${def.color}18`,
        color: def.color,
      }}
    >
      {plan === "enterprise" && <CrownOutlined style={{ marginRight: 4 }} />}
      {def.label}
    </Tag>
  );
};

export default function PackageManagementPage() {
  const { token } = theme.useToken();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const {
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
    packagePrices,
    isUpdatingPrice,
    fetchPackagePrices,
    updatePackagePrice,
  } = usePackageStore();

  const [isMounted, setIsMounted] = useState(false);
  const [searchInput, setSearchInput] = useState(filterKeyword);
  // ✨ Modal state (เปลี่ยน plan)
  const [modalSchool, setModalSchool] = useState<SchoolPackageItem | null>(
    null,
  );
  const [modalTargetPlan, setModalTargetPlan] = useState<PlanType | null>(null);
  // ✨ Modal state (แก้ไขราคา)
  const [priceModalPlan, setPriceModalPlan] = useState<PlanType | null>(null);
  const [priceForm] = Form.useForm();

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
    fetchPackagePrices();
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

  const openPlanModal = (school: SchoolPackageItem, plan: PlanType) => {
    if (plan === school.accountPlan) return;
    setModalSchool(school);
    setModalTargetPlan(plan);
  };

  const handleConfirmPlan = async (jobQuotaMax: number) => {
    if (!modalSchool || !modalTargetPlan) return;
    try {
      await updatePlan(modalSchool.id, modalTargetPlan, jobQuotaMax);
      message.success(
        `เปลี่ยน Package ของ "${modalSchool.schoolName}" เป็น ${PACKAGE_DEFINITIONS[modalTargetPlan].label} สำเร็จ`,
      );
    } catch {
      message.error("เปลี่ยน Package ไม่สำเร็จ");
    } finally {
      setModalSchool(null);
      setModalTargetPlan(null);
    }
  };

  // ✨ เปิด Modal แก้ไขราคา
  const openPriceModal = (plan: PlanType) => {
    setPriceModalPlan(plan);
    priceForm.setFieldsValue({
      price: packagePrices[plan] ?? PACKAGE_DEFINITIONS[plan].price,
    });
  };

  // ✨ ยืนยันการแก้ไขราคา
  const handleConfirmPrice = async () => {
    if (!priceModalPlan) return;
    try {
      const { price } = await priceForm.validateFields();
      await updatePackagePrice(priceModalPlan, price);
      message.success(
        `อัปเดตราคา ${PACKAGE_DEFINITIONS[priceModalPlan].label} สำเร็จ`,
      );
      setPriceModalPlan(null);
    } catch (err) {
      if ((err as { errorFields?: unknown })?.errorFields) return;
      message.error("อัปเดตราคาไม่สำเร็จ");
    }
  };

  if (!isMounted) return null;

  // ─── Stats Cards ───────────────────────────────────────────────
  const statsCards = [
    {
      key: "all",
      label: "โรงเรียนทั้งหมด",
      value: summary.total,
      color: token.colorPrimary,
    },
    {
      key: "basic",
      label: "Basic",
      value: summary.basic,
      color: PACKAGE_DEFINITIONS.basic.color,
    },
    {
      key: "premium",
      label: "Premium",
      value: summary.premium,
      color: PACKAGE_DEFINITIONS.premium.color,
    },
    {
      key: "enterprise",
      label: "Enterprise",
      value: summary.enterprise,
      color: PACKAGE_DEFINITIONS.enterprise.color,
    },
  ];

  // ─── Table Columns ──────────────────────────────────────────────
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
            <MailOutlined
              style={{ fontSize: 11, color: token.colorTextTertiary }}
            />
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
      render: (_, r) => <PlanTag plan={r.accountPlan} />,
      filters: [
        { text: "Basic", value: "basic" },
        { text: "Premium", value: "premium" },
        { text: "Enterprise", value: "enterprise" },
      ],
      onFilter: (value, r) => r.accountPlan === value,
    },
    {
      title: "Job Quota",
      key: "quota",
      width: 180,
      render: (_, r) => (
        <Flex vertical gap={4}>
          <Flex align="center" justify="space-between">
            <Text style={{ fontSize: 12 }}>
              {r.activeJobCount} / {r.jobQuotaMax === 999 ? "∞" : r.jobQuotaMax}{" "}
              งาน
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
      width: 260,
      render: (_, r) => (
        <Flex gap={6} align="center">
          {(["basic", "premium", "enterprise"] as PlanType[]).map((plan) => {
            const def = PACKAGE_DEFINITIONS[plan];
            const isCurrent = r.accountPlan === plan;
            const isLoading = isUpdating === r.id;
            return (
              <Tooltip
                key={plan}
                title={
                  isCurrent ? "Package ปัจจุบัน" : `เปลี่ยนเป็น ${def.label}`
                }
              >
                <Button
                  size="small"
                  type={isCurrent ? "primary" : "default"}
                  disabled={isCurrent || isLoading}
                  loading={isLoading && modalTargetPlan === plan}
                  onClick={() => openPlanModal(r, plan)}
                  style={{
                    borderColor: def.color,
                    color: isCurrent ? "white" : def.color,
                    background: isCurrent ? def.color : "transparent",
                    fontWeight: 600,
                    fontSize: 11,
                    borderRadius: 6,
                    height: 28,
                    padding: "0 10px",
                  }}
                >
                  {def.label}
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
              { title: <span style={{ color: "white" }}>จัดการ Package</span> },
            ]}
          />
          <Flex align="flex-start" justify="space-between" wrap="wrap" gap={16}>
            <Flex vertical gap={4}>
              <Title level={2} style={{ margin: 0, color: "white" }}>
                จัดการ Package
              </Title>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>
                กำหนด Plan และ Job Quota ให้สถานศึกษา — รองรับ Payment Gateway
                อัตโนมัติ
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
        {/* ─── Summary Stats ─── */}
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
                onClick={() => {
                  if (s.key !== "all") setFilterPlan(s.key as any);
                  else setFilterPlan("all");
                }}
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

        {/* ─── Package Definition Cards ─── */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {(["basic", "premium", "enterprise"] as PlanType[]).map((plan) => {
            const def = PACKAGE_DEFINITIONS[plan];
            // ✨ ใช้ราคาจาก DB ถ้ามี — fallback ไปค่าใน definition
            const livePrice = packagePrices[plan] ?? def.price;
            return (
              <Col xs={24} sm={8} key={plan}>
                <Card
                  variant="borderless"
                  style={{
                    borderRadius: 16,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                    borderTop: `4px solid ${def.color}`,
                  }}
                >
                  <Flex vertical gap={12}>
                    <Flex align="center" justify="space-between">
                      <Tag
                        color={def.color}
                        style={{
                          fontWeight: 700,
                          fontSize: 13,
                          borderRadius: 6,
                        }}
                      >
                        {def.label}
                      </Tag>
                      <Flex align="center" gap={8}>
                        <Text strong style={{ fontSize: 18, color: def.color }}>
                          {livePrice === 0
                            ? "ฟรี"
                            : `฿${livePrice.toLocaleString()}`}
                          {livePrice > 0 && (
                            <Text
                              type="secondary"
                              style={{ fontSize: 11, fontWeight: 400 }}
                            >
                              /เดือน
                            </Text>
                          )}
                        </Text>
                        {/* ✨ ปุ่มแก้ไขราคา */}
                        {plan !== "basic" && (
                          <Tooltip title="แก้ไขราคา">
                            <Button
                              type="text"
                              size="small"
                              icon={<EditOutlined />}
                              onClick={() => openPriceModal(plan)}
                              style={{ color: def.color }}
                            />
                          </Tooltip>
                        )}
                      </Flex>
                    </Flex>
                    <Flex vertical gap={4}>
                      {def.features.map((f) => (
                        <Flex key={f} align="center" gap={6}>
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: def.color,
                              flexShrink: 0,
                            }}
                          />
                          <Text style={{ fontSize: 12 }}>{f}</Text>
                        </Flex>
                      ))}
                    </Flex>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      Job Quota:{" "}
                      {def.jobQuota === 999
                        ? "ไม่จำกัด"
                        : `${def.jobQuota} ประกาศ`}
                    </Text>
                  </Flex>
                </Card>
              </Col>
            );
          })}
        </Row>

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
              style={{ width: 160 }}
              options={[
                { value: "all", label: "ทุก Package" },
                { value: "basic", label: "Basic" },
                { value: "premium", label: "Premium" },
                { value: "enterprise", label: "Enterprise" },
              ]}
            />
            <Text type="secondary" style={{ fontSize: 13, marginLeft: "auto" }}>
              พบ {total} โรงเรียน
            </Text>
          </Flex>
        </Card>

        {/* ─── Table ─── */}
        <Card
          variant="borderless"
          style={{ borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
        >
          {isLoading ? (
            <Skeleton active paragraph={{ rows: 8 }} />
          ) : (
            <Table<SchoolPackageItem>
              dataSource={schools}
              columns={columns}
              rowKey="id"
              pagination={false}
              scroll={{ x: 1180 }}
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

      {/* ─── Plan Change Modal ─── */}
      <PlanChangeModal
        school={modalSchool}
        targetPlan={modalTargetPlan}
        open={!!modalSchool && !!modalTargetPlan}
        isUpdating={isUpdating === modalSchool?.id}
        onConfirm={handleConfirmPlan}
        onCancel={() => {
          setModalSchool(null);
          setModalTargetPlan(null);
        }}
      />

      {/* ─── Price Edit Modal ─── */}
      <Modal
        open={!!priceModalPlan}
        title={
          priceModalPlan ? (
            <Flex align="center" gap={8}>
              <EditOutlined
                style={{ color: PACKAGE_DEFINITIONS[priceModalPlan].color }}
              />
              <span>แก้ไขราคา {PACKAGE_DEFINITIONS[priceModalPlan].label}</span>
            </Flex>
          ) : null
        }
        okText="บันทึก"
        cancelText="ยกเลิก"
        onOk={handleConfirmPrice}
        onCancel={() => {
          setPriceModalPlan(null);
          priceForm.resetFields();
        }}
        confirmLoading={isUpdatingPrice}
        width={400}
      >
        <Form form={priceForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="price"
            label="ราคา (บาท/เดือน)"
            rules={[
              { required: true, message: "กรุณาระบุราคา" },
              { type: "number", min: 1, message: "ราคาต้องมากกว่า 0" },
            ]}
          >
            <InputNumber
              min={1}
              step={10}
              style={{ width: "100%" }}
              formatter={(v) => `฿ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => Number(v!.replace(/฿\s?|(,*)/g, ""))}
              placeholder="เช่น 1990"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

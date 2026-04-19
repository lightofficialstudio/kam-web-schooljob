"use client";

// ✨ Modal สร้าง/แก้ไข Package Plan — Admin จัดการได้ครบทุก field
import {
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  ColorPicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
  Tag,
  Typography,
} from "antd";
import { useEffect } from "react";
import { PackagePlanItem, PlanFormData } from "../_state/package-store";

const { Text } = Typography;

interface PlanFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  editingPlan: PackagePlanItem | null;
  plans: PackagePlanItem[]; // ✨ ใช้สำหรับ upgradeTarget options
  isSaving: boolean;
  onSubmit: (data: PlanFormData) => void;
  onCancel: () => void;
}

export const PlanFormModal: React.FC<PlanFormModalProps> = ({
  open,
  mode,
  editingPlan,
  plans,
  isSaving,
  onSubmit,
  onCancel,
}) => {
  const [form] = Form.useForm<PlanFormData>();
  const colorValue = Form.useWatch("color", form);

  // ✨ โหลดค่าเข้า form เมื่อ edit
  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && editingPlan) {
      form.setFieldsValue({
        plan: editingPlan.plan,
        label: editingPlan.label,
        color: editingPlan.color,
        price: editingPlan.price,
        job_quota: editingPlan.jobQuota,
        features: editingPlan.features,
        quota_warning_threshold: editingPlan.quotaWarningThreshold,
        badge_icon: editingPlan.badgeIcon,
        upgrade_target: editingPlan.upgradeTarget ?? undefined,
        sort_order: editingPlan.sortOrder,
        is_active: editingPlan.isActive,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        color: "#11b6f5",
        price: 0,
        job_quota: 5,
        quota_warning_threshold: 80,
        badge_icon: "default",
        sort_order: plans.length,
        is_active: true,
        features: [""],
      });
    }
  }, [open, mode, editingPlan]);

  const handleOk = async () => {
    const values = await form.validateFields();
    // ✨ กรอง features ว่างออก
    const cleanFeatures = (values.features ?? []).filter(
      (f: string) => f && f.trim(),
    );
    onSubmit({ ...values, features: cleanFeatures });
  };

  // ✨ plan options สำหรับ upgradeTarget (ยกเว้น plan ตัวเอง)
  const upgradeTargetOptions = [
    { value: "", label: "ไม่มี (สูงสุดแล้ว)" },
    ...plans
      .filter((p) => p.plan !== editingPlan?.plan)
      .map((p) => ({ value: p.plan, label: p.label })),
  ];

  return (
    <Modal
      open={open}
      title={mode === "create" ? "สร้าง Package Plan ใหม่" : "แก้ไข Package Plan"}
      okText={mode === "create" ? "สร้าง Plan" : "บันทึก"}
      cancelText="ยกเลิก"
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={isSaving}
      width={600}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        {/* ─── Plan Key (สร้างได้เท่านั้น — ห้ามแก้ key หลังสร้าง) ─── */}
        <Form.Item
          name="plan"
          label="Plan Key"
          tooltip="ใช้เป็น ID ภายใน เช่น basic, premium, gold — แก้ไขภายหลังไม่ได้"
          rules={[
            { required: true, message: "กรุณาระบุ Plan Key" },
            {
              pattern: /^[a-z0-9_]+$/,
              message: "ใช้ได้แค่ a-z, 0-9, _ เท่านั้น",
            },
          ]}
        >
          <Input
            placeholder="เช่น basic, premium, gold"
            disabled={mode === "edit"}
            style={{ fontFamily: "monospace" }}
          />
        </Form.Item>

        {/* ─── Label + Color ─── */}
        <Flex gap={12}>
          <Form.Item
            name="label"
            label="ชื่อแสดงผล"
            rules={[{ required: true, message: "กรุณาระบุชื่อ" }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="เช่น Basic, Premium, Gold" />
          </Form.Item>

          <Form.Item
            name="color"
            label="สี (Hex)"
            rules={[
              { required: true, message: "กรุณาระบุสี" },
              {
                pattern: /^#[0-9a-fA-F]{3,8}$/,
                message: "ต้องเป็น Hex เช่น #11b6f5",
              },
            ]}
            style={{ width: 180 }}
          >
            <Flex align="center" gap={8}>
              <ColorPicker
                value={colorValue}
                onChange={(c) => form.setFieldValue("color", c.toHexString())}
                disabledAlpha
              />
              <Input
                value={colorValue}
                onChange={(e) => form.setFieldValue("color", e.target.value)}
                placeholder="#11b6f5"
                style={{ fontFamily: "monospace" }}
              />
            </Flex>
          </Form.Item>
        </Flex>

        {/* ─── ราคา + Job Quota ─── */}
        <Flex gap={12}>
          <Form.Item
            name="price"
            label="ราคา (บาท/เดือน)"
            rules={[{ required: true, message: "กรุณาระบุราคา" }]}
            style={{ flex: 1 }}
          >
            <InputNumber
              min={0}
              step={100}
              style={{ width: "100%" }}
              formatter={(v) => `฿ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => Number(v!.replace(/฿\s?|(,*)/g, ""))}
              placeholder="0 = ฟรี"
            />
          </Form.Item>

          <Form.Item
            name="job_quota"
            label="Job Quota (999 = ไม่จำกัด)"
            rules={[{ required: true, message: "กรุณาระบุ quota" }]}
            style={{ flex: 1 }}
          >
            <InputNumber
              min={0}
              max={99999}
              step={1}
              style={{ width: "100%" }}
              placeholder="เช่น 5, 20, 999"
            />
          </Form.Item>
        </Flex>

        {/* ─── Features List (Dynamic) ─── */}
        <Form.Item label="Features (จุดขายของ Plan นี้)">
          <Form.List name="features">
            {(fields, { add, remove }) => (
              <Flex vertical gap={8}>
                {fields.map(({ key, name }) => (
                  <Flex key={key} align="center" gap={8}>
                    <Form.Item
                      name={name}
                      noStyle
                      rules={[{ required: true, message: "กรุณาระบุ feature" }]}
                    >
                      <Input placeholder="เช่น ประกาศงาน 5 ตำแหน่ง" />
                    </Form.Item>
                    <Button
                      type="text"
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() => remove(name)}
                      disabled={fields.length <= 1}
                    />
                  </Flex>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add("")}
                  icon={<PlusOutlined />}
                  style={{ width: "100%" }}
                >
                  เพิ่ม Feature
                </Button>
              </Flex>
            )}
          </Form.List>
        </Form.Item>

        {/* ─── Badge Icon + Upgrade Target ─── */}
        <Flex gap={12}>
          <Form.Item name="badge_icon" label="Badge Icon" style={{ flex: 1 }}>
            <Select
              options={[
                { value: "default", label: "Default (ไม่มี icon)" },
                { value: "thunder", label: "⚡ Thunder" },
                { value: "crown", label: "👑 Crown" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="upgrade_target"
            label="แนะนำ Upgrade ไป Plan"
            style={{ flex: 1 }}
          >
            <Select
              options={upgradeTargetOptions}
              allowClear
              placeholder="ไม่มี"
            />
          </Form.Item>
        </Flex>

        {/* ─── Quota Warning + Sort Order ─── */}
        <Flex gap={12}>
          <Form.Item
            name="quota_warning_threshold"
            label="เตือนเมื่อใช้ Quota (%)"
            tooltip="แสดง warning เมื่อใช้ quota เกิน % นี้"
            style={{ flex: 1 }}
          >
            <InputNumber min={0} max={100} style={{ width: "100%" }} addonAfter="%" />
          </Form.Item>

          <Form.Item
            name="sort_order"
            label="ลำดับแสดงผล"
            tooltip="น้อย = แสดงก่อน"
            style={{ flex: 1 }}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Flex>

        {/* ─── Active Toggle ─── */}
        <Form.Item name="is_active" label="สถานะ Plan" valuePropName="checked">
          <Switch
            checkedChildren="เปิดใช้งาน"
            unCheckedChildren="ปิดใช้งาน"
          />
        </Form.Item>

        {/* ─── Preview ─── */}
        {colorValue && (
          <Flex align="center" gap={8} style={{ marginTop: 4 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              ตัวอย่าง Tag:
            </Text>
            <Tag
              style={{
                fontWeight: 700,
                fontSize: 12,
                borderRadius: 6,
                padding: "2px 10px",
                border: `1.5px solid ${colorValue}`,
                background: `${colorValue}18`,
                color: colorValue,
              }}
            >
              {form.getFieldValue("label") || "Label"}
            </Tag>
          </Flex>
        )}
      </Form>
    </Modal>
  );
};


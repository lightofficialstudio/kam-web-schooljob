"use client";

// ✨ Edit Option Modal — ฟอร์มแก้ไข label + sortOrder (value ห้ามเปลี่ยน)
import {
  Alert,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Typography,
} from "antd";
import { useEffect } from "react";
import { GROUP_META, useConfigStore } from "../_state/config-store";

const { Text } = Typography;

// ✨ แปลง ISO string เป็นวันที่ภาษาไทย พร้อมเวลา
function formatThaiDateTime(iso: string): string {
  return new Date(iso).toLocaleString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EditOptionModal() {
  const {
    isEditModalOpen,
    editingOption,
    isSaving,
    updateLabel,
    closeEditModal,
  } = useConfigStore();

  const [form] = Form.useForm();

  // ✨ โหลดค่าเดิมเมื่อ modal เปิด
  useEffect(() => {
    if (isEditModalOpen && editingOption) {
      form.setFieldsValue({
        label: editingOption.label,
        sort_order: editingOption.sortOrder,
      });
    }
  }, [isEditModalOpen, editingOption, form]);

  const handleOk = async () => {
    if (!editingOption) return;
    try {
      const values = await form.validateFields();
      await updateLabel(editingOption.id, values.label, values.sort_order ?? 0);
      closeEditModal();
    } catch (err) {
      // ✨ Form validation error — antd แสดง error เอง
      if ((err as { errorFields?: unknown })?.errorFields) return;
      // ✨ store แสดง error modal แล้ว
    }
  };

  // ✨ หน้าที่ได้รับผลกระทบจาก group นี้
  const usedInPages = editingOption
    ? (GROUP_META[editingOption.group]?.usedIn ?? [])
    : [];

  return (
    <Modal
      title="แก้ไขตัวเลือก"
      open={isEditModalOpen}
      onOk={handleOk}
      onCancel={closeEditModal}
      okText="บันทึก"
      cancelText="ยกเลิก"
      confirmLoading={isSaving}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        {/* ✨ Warning — แสดงเมื่อ item กำลังใช้งานอยู่ */}
        {editingOption?.isActive && usedInPages.length > 0 && (
          <Alert
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
            message="label นี้กำลังถูกใช้งานอยู่"
            description={
              <>
                การเปลี่ยนชื่อจะกระทบ UX ใน{" "}
                <strong>{usedInPages.length} หน้า</strong>:{" "}
                {usedInPages.join(", ")}
              </>
            }
          />
        )}
        <Form.Item
          name="label"
          label="ชื่อที่แสดงผล"
          rules={[{ required: true, message: "กรุณาระบุชื่อ" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="sort_order" label="ลำดับการแสดงผล">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        {editingOption && (
          <Text type="secondary" style={{ fontSize: 12 }}>
            Value: <code>{editingOption.value}</code> (ไม่สามารถแก้ไขได้)
          </Text>
        )}

        {/* ✨ Audit trail — แสดง createdAt / updatedAt */}
        {editingOption && (
          <>
            <Divider style={{ margin: "12px 0" }} />
            <Flex gap={24}>
              <Flex vertical gap={2}>
                <Text type="secondary" style={{ fontSize: 11 }}>
                  สร้างเมื่อ
                </Text>
                <Text style={{ fontSize: 12 }}>
                  {formatThaiDateTime(editingOption.createdAt)}
                </Text>
              </Flex>
              <Flex vertical gap={2}>
                <Text type="secondary" style={{ fontSize: 11 }}>
                  แก้ไขล่าสุด
                </Text>
                <Text style={{ fontSize: 12, fontWeight: 500 }}>
                  {formatThaiDateTime(editingOption.updatedAt)}
                </Text>
              </Flex>
            </Flex>
          </>
        )}
      </Form>
    </Modal>
  );
}

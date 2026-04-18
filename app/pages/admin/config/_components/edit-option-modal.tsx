"use client";

// ✨ Edit Option Modal — ฟอร์มแก้ไข label + sortOrder (value ห้ามเปลี่ยน)
import { Form, Input, InputNumber, Modal, Typography } from "antd";
import { useEffect } from "react";
import { useConfigStore } from "../_state/config-store";

const { Text } = Typography;

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
      </Form>
    </Modal>
  );
}

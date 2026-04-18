"use client";

// ✨ Add Option Modal — ฟอร์มเพิ่มตัวเลือกใหม่ใน group ที่กำลัง active
import { Form, Input, InputNumber, Modal, Select } from "antd";
import { useEffect } from "react";
import { GROUP_META, useConfigStore } from "../_state/config-store";

export function AddOptionModal() {
  const {
    options,
    isAddModalOpen,
    defaultParentValue,
    activeGroup,
    isSaving,
    addOption,
    closeAddModal,
  } = useConfigStore();

  const [form] = Form.useForm();

  // ✨ root options สำหรับ dropdown เลือก Parent
  const flatOptions = options.filter((o) => o.group === activeGroup);
  const rootOptions = flatOptions.filter((o) => !o.parentValue && o.isActive);
  const isHierarchical = flatOptions.some((o) => o.parentValue !== null);

  // ✨ pre-fill parent value เมื่อ modal เปิดจากปุ่ม "เพิ่ม" ใน row parent
  useEffect(() => {
    if (isAddModalOpen) {
      form.resetFields();
      if (defaultParentValue) {
        form.setFieldValue("parent_value", defaultParentValue);
      }
    }
  }, [isAddModalOpen, defaultParentValue, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await addOption({
        group: activeGroup,
        label: values.label,
        value: values.value,
        parent_value: values.parent_value ?? null,
        sort_order: values.sort_order ?? 0,
      });
      closeAddModal();
    } catch (err) {
      // ✨ Form validation error — ไม่ต้องทำอะไร (antd แสดง error เอง)
      if ((err as { errorFields?: unknown })?.errorFields) return;
      // ✨ store แสดง error modal แล้ว
    }
  };

  return (
    <Modal
      title={`เพิ่มตัวเลือกใน "${GROUP_META[activeGroup]?.label ?? activeGroup}"`}
      open={isAddModalOpen}
      onOk={handleOk}
      onCancel={closeAddModal}
      okText="เพิ่ม"
      cancelText="ยกเลิก"
      confirmLoading={isSaving}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="label"
          label="ชื่อที่แสดงผล"
          rules={[{ required: true, message: "กรุณาระบุชื่อ" }]}
        >
          <Input placeholder="เช่น ครูภาษาไทย" />
        </Form.Item>

        <Form.Item
          name="value"
          label="Value (ค่าที่ใช้ใน DB)"
          rules={[{ required: true, message: "กรุณาระบุ value" }]}
          extra="snake_case เช่น thai_teacher"
        >
          <Input placeholder="เช่น thai_teacher" />
        </Form.Item>

        {/* ✨ แสดง parent selector เฉพาะ group ที่รองรับ hierarchy */}
        {(isHierarchical || rootOptions.length > 0) && (
          <Form.Item
            name="parent_value"
            label="หมวดหมู่หลัก (Parent)"
            extra="เว้นว่างถ้าเป็นหมวดหมู่หลัก"
          >
            <Select
              allowClear
              placeholder="(ไม่เลือก = เป็นหมวดหมู่หลัก)"
              options={rootOptions.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
            />
          </Form.Item>
        )}

        <Form.Item name="sort_order" label="ลำดับการแสดงผล" initialValue={0}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

"use client";

import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Switch,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
  theme,
} from "antd";
import { useEffect, useState } from "react";
import { ConfigOption } from "./_api/config-api";
import { useConfigStore } from "./_state/config-store";

const { Title, Text } = Typography;

// ✨ แสดงชื่อ group เป็นภาษาไทย
const GROUP_LABELS: Record<string, string> = {
  school_type: "ประเภทโรงเรียน",
  school_level: "ระดับชั้นที่เปิดสอน",
  job_category: "หมวดหมู่งาน (ตำแหน่งงาน)",
};

// ✨ [Orchestrator] หน้าจัดการ Config Options สำหรับ Admin
export default function AdminConfigPage() {
  const { token } = theme.useToken();
  const {
    options,
    isLoading,
    isSaving,
    fetchOptions,
    addOption,
    toggleActive,
    removeOption,
    updateLabel,
  } = useConfigStore();
  const [messageApi, contextHolder] = message.useMessage();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<ConfigOption | null>(null);
  const [activeGroup, setActiveGroup] = useState("school_type");
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  // ✨ กรองเฉพาะ group ที่เลือก
  const filteredOptions = options.filter((o) => o.group === activeGroup);

  // ✨ สร้าง Tab items จาก group ที่มีใน options + group ที่รู้จัก
  const allGroups = [
    ...new Set([...Object.keys(GROUP_LABELS), ...options.map((o) => o.group)]),
  ];
  const tabItems = allGroups.map((g) => ({
    key: g,
    label: GROUP_LABELS[g] ?? g,
  }));

  // ✨ ดึง root-level options ของ group ปัจจุบัน สำหรับใช้เป็นตัวเลือก parent
  const parentOptions = options.filter(
    (o) => o.group === activeGroup && o.parentValue === null && o.isActive,
  );

  const handleAdd = async () => {
    try {
      const values = await addForm.validateFields();
      await addOption({
        group: activeGroup,
        label: values.label,
        value: values.value,
        parent_value: values.parent_value ?? null,
        sort_order: values.sort_order ?? 0,
      });
      messageApi.success("เพิ่มตัวเลือกสำเร็จ");
      addForm.resetFields();
      setIsAddModalOpen(false);
    } catch (err) {
      if ((err as { errorFields?: unknown })?.errorFields) return; // validation error
      messageApi.error("เพิ่มตัวเลือกไม่สำเร็จ กรุณาลองใหม่");
    }
  };

  const handleEdit = (option: ConfigOption) => {
    setEditingOption(option);
    editForm.setFieldsValue({
      label: option.label,
      sort_order: option.sortOrder,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSave = async () => {
    if (!editingOption) return;
    try {
      const values = await editForm.validateFields();
      await updateLabel(editingOption.id, values.label, values.sort_order ?? 0);
      messageApi.success("แก้ไขสำเร็จ");
      setIsEditModalOpen(false);
    } catch (err) {
      if ((err as { errorFields?: unknown })?.errorFields) return;
      messageApi.error("แก้ไขไม่สำเร็จ กรุณาลองใหม่");
    }
  };

  const handleDelete = async (id: string) => {
    await removeOption(id);
    messageApi.success("ลบสำเร็จ");
  };

  const handleToggle = async (id: string, checked: boolean) => {
    await toggleActive(id, checked);
    messageApi.success(checked ? "เปิดใช้งานแล้ว" : "ปิดใช้งานแล้ว");
  };

  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "sortOrder",
      width: 80,
      sorter: (a: ConfigOption, b: ConfigOption) => a.sortOrder - b.sortOrder,
    },
    {
      title: "ชื่อที่แสดง",
      dataIndex: "label",
      render: (label: string, record: ConfigOption) => (
        <Flex align="center" gap={8}>
          <Text>{label}</Text>
          {!record.isActive && (
            <Tag color="default" style={{ fontSize: 11 }}>
              ปิดใช้งาน
            </Tag>
          )}
        </Flex>
      ),
    },
    {
      title: "Value (ค่าที่ใช้ใน DB)",
      dataIndex: "value",
      render: (value: string) => (
        <Text
          type="secondary"
          style={{ fontFamily: "monospace", fontSize: 13 }}
        >
          {value}
        </Text>
      ),
    },
    {
      title: "Parent",
      dataIndex: "parentValue",
      render: (parentValue: string | null) =>
        parentValue ? (
          <Tag style={{ fontFamily: "monospace", fontSize: 11 }}>
            {parentValue}
          </Tag>
        ) : (
          <Text type="secondary" style={{ fontSize: 12 }}>
            —
          </Text>
        ),
    },
    {
      title: "สถานะ",
      dataIndex: "isActive",
      width: 100,
      render: (isActive: boolean, record: ConfigOption) => (
        <Switch
          checked={isActive}
          size="small"
          loading={isSaving}
          onChange={(checked) => handleToggle(record.id, checked)}
        />
      ),
    },
    {
      title: "",
      key: "actions",
      width: 100,
      render: (_: unknown, record: ConfigOption) => (
        <Flex gap={4}>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="ลบตัวเลือกนี้?"
            description="การลบจะไม่กระทบข้อมูลที่บันทึกไว้แล้ว"
            onConfirm={() => handleDelete(record.id)}
            okText="ลบ"
            okButtonProps={{ danger: true }}
            cancelText="ยกเลิก"
          >
            <Button type="text" size="small" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Flex vertical gap={24}>
        {/* Header */}
        <Flex align="center" justify="space-between">
          <Flex align="center" gap={12}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: token.colorPrimaryBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SettingOutlined
                style={{ color: token.colorPrimary, fontSize: 18 }}
              />
            </div>
            <Flex vertical gap={0}>
              <Title level={4} style={{ margin: 0 }}>
                จัดการตัวเลือก Dropdown
              </Title>
              <Text type="secondary" style={{ fontSize: 13 }}>
                ประเภทโรงเรียน, ระดับชั้น และอื่นๆ ที่แสดงในฟอร์มลงทะเบียน
              </Text>
            </Flex>
          </Flex>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              addForm.resetFields();
              setIsAddModalOpen(true);
            }}
          >
            เพิ่มตัวเลือก
          </Button>
        </Flex>

        {/* Stats */}
        <Row gutter={[16, 16]}>
          {allGroups.map((g) => {
            const count = options.filter((o) => o.group === g).length;
            const activeCount = options.filter(
              (o) => o.group === g && o.isActive,
            ).length;
            return (
              <Col key={g} xs={24} sm={12} md={8}>
                <Card
                  variant="borderless"
                  style={{
                    border: `1px solid ${token.colorBorderSecondary}`,
                    borderRadius: 12,
                    cursor: "pointer",
                    borderColor:
                      activeGroup === g
                        ? token.colorPrimary
                        : token.colorBorderSecondary,
                  }}
                  onClick={() => setActiveGroup(g)}
                >
                  <Flex justify="space-between" align="center">
                    <Flex vertical gap={2}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {GROUP_LABELS[g] ?? g}
                      </Text>
                      <Text strong style={{ fontSize: 20 }}>
                        {count}
                      </Text>
                    </Flex>
                    <Badge
                      count={activeCount}
                      style={{ backgroundColor: token.colorSuccess }}
                    />
                  </Flex>
                </Card>
              </Col>
            );
          })}
        </Row>

        {/* Table */}
        <Card
          variant="borderless"
          style={{
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: 16,
          }}
        >
          <Tabs
            activeKey={activeGroup}
            onChange={setActiveGroup}
            items={tabItems}
            style={{ marginBottom: 16 }}
          />
          <Table
            dataSource={filteredOptions}
            columns={columns}
            rowKey="id"
            loading={isLoading}
            pagination={false}
            size="middle"
            rowClassName={(record) => (!record.isActive ? "opacity-50" : "")}
          />
        </Card>
      </Flex>

      {/* Modal เพิ่มตัวเลือก */}
      <Modal
        title={`เพิ่มตัวเลือกใน "${GROUP_LABELS[activeGroup] ?? activeGroup}"`}
        open={isAddModalOpen}
        onOk={handleAdd}
        onCancel={() => setIsAddModalOpen(false)}
        okText="เพิ่ม"
        cancelText="ยกเลิก"
        confirmLoading={isSaving}
      >
        <Form form={addForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="label"
            label="ชื่อที่แสดงผล"
            rules={[{ required: true, message: "กรุณาระบุชื่อ" }]}
          >
            <Input placeholder="เช่น โรงเรียนรัฐบาล" />
          </Form.Item>
          <Form.Item
            name="value"
            label="Value (ค่าที่ใช้ใน DB)"
            rules={[{ required: true, message: "กรุณาระบุ value" }]}
            extra="snake_case เช่น academic, math, english"
          >
            <Input placeholder="เช่น academic" />
          </Form.Item>
          {/* ✨ แสดง parent selector เฉพาะ group ที่รองรับ hierarchy */}
          {parentOptions.length > 0 && (
            <Form.Item
              name="parent_value"
              label="หมวดหมู่หลัก (Parent)"
              extra="เว้นว่างถ้าเป็นหมวดหมู่หลัก"
            >
              <Select
                allowClear
                placeholder="(ไม่เลือก = เป็นหมวดหมู่หลัก)"
                options={parentOptions.map((o) => ({
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

      {/* Modal แก้ไข */}
      <Modal
        title="แก้ไขตัวเลือก"
        open={isEditModalOpen}
        onOk={handleEditSave}
        onCancel={() => setIsEditModalOpen(false)}
        okText="บันทึก"
        cancelText="ยกเลิก"
        confirmLoading={isSaving}
      >
        <Form form={editForm} layout="vertical" style={{ marginTop: 16 }}>
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
    </>
  );
}

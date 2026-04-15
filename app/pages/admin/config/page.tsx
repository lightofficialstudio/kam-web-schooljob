"use client";

import {
  DeleteOutlined,
  EditOutlined,
  FolderOutlined,
  PlusOutlined,
  SettingOutlined,
  TagOutlined,
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

// ✨ ชื่อ Group ภาษาไทย
const GROUP_LABELS: Record<string, string> = {
  school_type: "ประเภทโรงเรียน",
  school_level: "ระดับชั้นที่เปิดสอน",
  job_category: "หมวดหมู่งาน (ตำแหน่งงาน)",
};

// ✨ โครงสร้าง Tree แบบ Ant Design Table
interface TreeConfigOption extends ConfigOption {
  children?: TreeConfigOption[];
}

// ✨ แปลงรายการ flat → tree (parent → children)
const buildTreeData = (options: ConfigOption[]): TreeConfigOption[] => {
  const roots = options
    .filter((o) => !o.parentValue)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  return roots.map((parent) => {
    const children = options
      .filter((o) => o.parentValue === parent.value)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    return { ...parent, children: children.length > 0 ? children : undefined };
  });
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
  // ✨ pre-fill parent เมื่อกดปุ่ม "เพิ่มรายการ" ในแถว parent
  const [defaultParentValue, setDefaultParentValue] = useState<string | null>(
    null,
  );
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  // ✨ options ของ group ที่เลือก (flat)
  const flatOptions = options.filter((o) => o.group === activeGroup);

  // ✨ tree dataSource สำหรับ Table
  const treeData = buildTreeData(flatOptions);

  // ✨ root-level options สำหรับ dropdown เลือก Parent
  const rootOptions = flatOptions.filter((o) => !o.parentValue && o.isActive);

  // ✨ group ที่มี hierarchy (มี children อยู่)
  const isHierarchical = flatOptions.some((o) => o.parentValue !== null);

  // ✨ Tab items
  const allGroups = [
    ...new Set([...Object.keys(GROUP_LABELS), ...options.map((o) => o.group)]),
  ];
  const tabItems = allGroups.map((g) => ({
    key: g,
    label: GROUP_LABELS[g] ?? g,
  }));

  const openAddModal = (parentValue?: string) => {
    addForm.resetFields();
    if (parentValue) {
      setDefaultParentValue(parentValue);
      addForm.setFieldValue("parent_value", parentValue);
    } else {
      setDefaultParentValue(null);
    }
    setIsAddModalOpen(true);
  };

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
      setDefaultParentValue(null);
      setIsAddModalOpen(false);
    } catch (err) {
      if ((err as { errorFields?: unknown })?.errorFields) return;
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

  // ✨ columns สำหรับ Tree Table (hierarchy)
  const treeColumns = [
    {
      title: "หมวดหมู่ / ตำแหน่ง",
      dataIndex: "label",
      render: (label: string, record: TreeConfigOption) => {
        const isParent = !record.parentValue;
        return (
          <Flex align="center" gap={8}>
            {isParent ? (
              <FolderOutlined
                style={{ color: token.colorPrimary, fontSize: 14 }}
              />
            ) : (
              <TagOutlined
                style={{ color: token.colorTextTertiary, fontSize: 12 }}
              />
            )}
            <Text strong={isParent} style={{ fontSize: isParent ? 14 : 13 }}>
              {label}
            </Text>
            {!record.isActive && (
              <Tag color="default" style={{ fontSize: 11 }}>
                ปิดใช้งาน
              </Tag>
            )}
          </Flex>
        );
      },
    },
    {
      title: "Value (DB)",
      dataIndex: "value",
      width: 200,
      render: (value: string) => (
        <Text
          type="secondary"
          style={{ fontFamily: "monospace", fontSize: 12 }}
        >
          {value}
        </Text>
      ),
    },
    {
      title: "สถานะ",
      dataIndex: "isActive",
      width: 90,
      render: (isActive: boolean, record: TreeConfigOption) => (
        <Switch
          checked={isActive}
          size="small"
          loading={isSaving}
          onChange={(c) => handleToggle(record.id, c)}
        />
      ),
    },
    {
      title: "",
      key: "actions",
      width: 130,
      render: (_: unknown, record: TreeConfigOption) => {
        const isParent = !record.parentValue;
        return (
          <Flex gap={4} align="center">
            {/* ✨ ปุ่มเพิ่ม child เฉพาะ parent row */}
            {isParent && (
              <Button
                type="text"
                size="small"
                icon={<PlusOutlined />}
                onClick={() => openAddModal(record.value)}
                style={{ color: token.colorPrimary, fontSize: 11 }}
              >
                เพิ่ม
              </Button>
            )}
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
            <Popconfirm
              title="ลบตัวเลือกนี้?"
              description={
                isParent
                  ? "การลบหมวดหมู่หลักจะลบรายการย่อยทั้งหมดด้วย"
                  : "การลบจะไม่กระทบข้อมูลที่บันทึกไว้แล้ว"
              }
              onConfirm={() => handleDelete(record.id)}
              okText="ลบ"
              okButtonProps={{ danger: true }}
              cancelText="ยกเลิก"
            >
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                danger
              />
            </Popconfirm>
          </Flex>
        );
      },
    },
  ];

  // ✨ columns สำหรับ Flat Table (ไม่มี hierarchy)
  const flatColumns = [
    {
      title: "ลำดับ",
      dataIndex: "sortOrder",
      width: 70,
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
      title: "สถานะ",
      dataIndex: "isActive",
      width: 100,
      render: (isActive: boolean, record: ConfigOption) => (
        <Switch
          checked={isActive}
          size="small"
          loading={isSaving}
          onChange={(c) => handleToggle(record.id, c)}
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
                ประเภทโรงเรียน, ระดับชั้น, หมวดหมู่งาน และอื่นๆ
                ที่แสดงในฟอร์มระบบ
              </Text>
            </Flex>
          </Flex>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openAddModal()}
          >
            เพิ่มตัวเลือก
          </Button>
        </Flex>

        {/* Stats Cards */}
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
                    border: `1px solid ${activeGroup === g ? token.colorPrimary : token.colorBorderSecondary}`,
                    borderRadius: 12,
                    cursor: "pointer",
                    transition: "border-color 0.2s",
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
            onChange={(g) => setActiveGroup(g)}
            items={tabItems}
            style={{ marginBottom: 16 }}
          />

          {isHierarchical ? (
            // ✨ Tree Table — แสดง parent → children แบบ expandable
            <Table<TreeConfigOption>
              dataSource={treeData}
              columns={treeColumns}
              rowKey="id"
              loading={isLoading}
              pagination={false}
              size="middle"
              defaultExpandAllRows
              indentSize={28}
              rowClassName={(record) => {
                if (!record.parentValue) return "font-semibold";
                return !record.isActive ? "opacity-50" : "";
              }}
              style={
                {
                  "& .ant-table-row-level-0 td": {
                    background: token.colorFillAlter,
                  },
                } as React.CSSProperties
              }
            />
          ) : (
            // ✨ Flat Table — สำหรับ group ที่ไม่มี hierarchy
            <Table<ConfigOption>
              dataSource={flatOptions}
              columns={flatColumns}
              rowKey="id"
              loading={isLoading}
              pagination={false}
              size="middle"
              rowClassName={(record) => (!record.isActive ? "opacity-50" : "")}
            />
          )}
        </Card>
      </Flex>

      {/* Modal เพิ่มตัวเลือก */}
      <Modal
        title={`เพิ่มตัวเลือกใน "${GROUP_LABELS[activeGroup] ?? activeGroup}"`}
        open={isAddModalOpen}
        onOk={handleAdd}
        onCancel={() => {
          setIsAddModalOpen(false);
          setDefaultParentValue(null);
        }}
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

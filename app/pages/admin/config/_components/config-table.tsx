"use client";

// ✨ Config Table — Tabs + Tree/Flat Table + Column definitions
import {
  DeleteOutlined,
  EditOutlined,
  FolderOutlined,
  PlusOutlined,
  TagOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Flex,
  Switch,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  theme,
} from "antd";
import { ConfigOption } from "../_api/config-api";
import { GROUP_META, useConfigStore } from "../_state/config-store";

const { Text } = Typography;

// ✨ UsedInBadges — แสดง chip หน้าที่ใช้ config group นี้ เพื่อ QA/Admin ตรวจสอบ
function UsedInBadges({ group }: { group: string }) {
  const usedIn = GROUP_META[group]?.usedIn;
  if (!usedIn?.length) return null;
  return (
    <Flex gap={4} wrap="wrap">
      {usedIn.map((path) => (
        <Tooltip
          key={path}
          title={`หน้านี้ใช้ตัวเลือก group นี้ — ตรวจสอบหลังแก้ไข`}
        >
          <Tag
            style={{
              fontSize: 10,
              borderRadius: 20,
              padding: "0 7px",
              margin: 0,
              cursor: "default",
              fontFamily: "monospace",
              background: "rgba(17,182,245,0.08)",
              border: "1px solid rgba(17,182,245,0.3)",
              color: "#0d8fd4",
            }}
          >
            {path}
          </Tag>
        </Tooltip>
      ))}
    </Flex>
  );
}

// ✨ โครงสร้าง Tree สำหรับ Ant Design Table
interface TreeConfigOption extends ConfigOption {
  children?: TreeConfigOption[];
}

// ✨ แปลง flat array → tree (parent → children)
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

export function ConfigTable() {
  const { token } = theme.useToken();
  const {
    options,
    isLoading,
    isSaving,
    activeGroup,
    setActiveGroup,
    toggleActive,
    removeOption,
    openAddModal,
    openEditModal,
    showModal,
  } = useConfigStore();

  // ✨ options เฉพาะ group ที่ active อยู่
  const flatOptions = options.filter((o) => o.group === activeGroup);
  const treeData = buildTreeData(flatOptions);
  const isHierarchical = flatOptions.some((o) => o.parentValue !== null);

  // ✨ Tab items — ใช้ GROUP_META เป็น label + fallback ถ้ามี group ใหม่จาก DB
  const allGroups = [
    ...new Set([...Object.keys(GROUP_META), ...options.map((o) => o.group)]),
  ];
  const tabItems = allGroups.map((g) => ({
    key: g,
    label: GROUP_META[g]?.label ?? g,
  }));

  // ✨ confirm modal ก่อนลบ
  const handleDeleteConfirm = (id: string, isParent: boolean) => {
    showModal({
      type: "delete",
      title: isParent ? "ลบหมวดหมู่หลัก?" : "ลบตัวเลือกนี้?",
      description: isParent
        ? "การลบหมวดหมู่หลักจะลบรายการย่อยทั้งหมดด้วย การลบจะไม่กระทบข้อมูลที่บันทึกไว้แล้ว"
        : "การลบจะไม่กระทบข้อมูลที่บันทึกไว้แล้ว",
      onConfirm: () => removeOption(id),
    });
  };

  // ─── Tree Table Columns ───────────────────────────────────────────────────────

  const treeColumns = [
    {
      title: (
        <Flex align="center" gap={8}>
          <span>หมวดหมู่ / ตำแหน่ง</span>
          <UsedInBadges group={activeGroup} />
        </Flex>
      ),
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
          onChange={(c) => toggleActive(record.id, c)}
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
            <Tooltip title="แก้ไข">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => openEditModal(record)}
              />
            </Tooltip>
            <Tooltip title="ลบ">
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleDeleteConfirm(record.id, isParent)}
              />
            </Tooltip>
          </Flex>
        );
      },
    },
  ];

  // ─── Flat Table Columns ───────────────────────────────────────────────────────

  const flatColumns = [
    {
      title: "ลำดับ",
      dataIndex: "sortOrder",
      width: 70,
      sorter: (a: ConfigOption, b: ConfigOption) => a.sortOrder - b.sortOrder,
    },
    {
      title: (
        <Flex align="center" gap={8}>
          <span>ชื่อที่แสดง</span>
          <UsedInBadges group={activeGroup} />
        </Flex>
      ),
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
          onChange={(c) => toggleActive(record.id, c)}
        />
      ),
    },
    {
      title: "",
      key: "actions",
      width: 100,
      render: (_: unknown, record: ConfigOption) => (
        <Flex gap={4}>
          <Tooltip title="แก้ไข">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => openEditModal(record)}
            />
          </Tooltip>
          <Tooltip title="ลบ">
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDeleteConfirm(record.id, false)}
            />
          </Tooltip>
        </Flex>
      ),
    },
  ];

  return (
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

      {isHierarchical ? (
        // ✨ Tree Table — parent → children expandable
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
        />
      ) : (
        // ✨ Flat Table — group ที่ไม่มี hierarchy
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
  );
}

"use client";

// ✨ Config Table — Tabs + Drag-and-drop sortable Table (dnd-kit)
import {
  DeleteOutlined,
  EditOutlined,
  FolderOutlined,
  HolderOutlined,
  PlusOutlined,
  TagOutlined,
} from "@ant-design/icons";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
import React from "react";
import { ConfigOption } from "../_api/config-api";
import { GROUP_META, useConfigStore } from "../_state/config-store";

const { Text } = Typography;

// ✨ UsedInBadges — แสดง chip หน้าที่ใช้ config group นี้
function UsedInBadges({ group }: { group: string }) {
  const usedIn = GROUP_META[group]?.usedIn;
  if (!usedIn?.length) return null;
  return (
    <Flex gap={4} wrap="wrap">
      {usedIn.map((path) => (
        <Tooltip
          key={path}
          title="หน้านี้ใช้ตัวเลือก group นี้ — ตรวจสอบหลังแก้ไข"
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

// ─── Tree types ───────────────────────────────────────────────────────────────

interface TreeConfigOption extends ConfigOption {
  children?: TreeConfigOption[];
}

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

// ─── Sortable row wrapper ─────────────────────────────────────────────────────
// ✨ Bug #3+4 fix: useSortable เรียกที่นี่ครั้งเดียว — ไม่มี DragHandleCell แยก
//    เพื่อป้องกัน double useSortable conflict ต่อ id เดียวกัน
//    HolderOutlined ในคอลัมน์เป็นแค่ visual hint, drag triggers ผ่าน row เต็ม

function SortableRow({
  id,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement> & { id: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <tr
      ref={setNodeRef}
      {...props}
      {...attributes}
      {...listeners}
      style={{
        ...props.style,
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
        background: isDragging ? "rgba(17,182,245,0.06)" : undefined,
        zIndex: isDragging ? 9999 : undefined,
        position: isDragging ? "relative" : undefined,
        cursor: isDragging ? "grabbing" : "grab",
      }}
    >
      {children}
    </tr>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

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
    batchReorder,
  } = useConfigStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  // ✨ options เฉพาะ group ที่ active อยู่
  const flatOptions = options
    .filter((o) => o.group === activeGroup)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const treeData = buildTreeData(flatOptions);
  const isHierarchical = flatOptions.some((o) => o.parentValue !== null);

  // ✨ Tab items
  const allGroups = [
    ...new Set([...Object.keys(GROUP_META), ...options.map((o) => o.group)]),
  ];
  const tabItems = allGroups.map((g) => ({
    key: g,
    label: (
      <Flex align="center" gap={6}>
        <span>{GROUP_META[g]?.label ?? g}</span>
        {(GROUP_META[g]?.usedIn?.length ?? 0) > 0 && (
          <Tag
            style={{
              fontSize: 10,
              borderRadius: 20,
              padding: "0 6px",
              margin: 0,
              background: "rgba(17,182,245,0.1)",
              border: "1px solid rgba(17,182,245,0.3)",
              color: "#0d8fd4",
            }}
          >
            {GROUP_META[g].usedIn.length} หน้า
          </Tag>
        )}
      </Flex>
    ),
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

  // ✨ drag end handler สำหรับ flat table
  const handleFlatDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const oldIndex = flatOptions.findIndex((o) => o.id === active.id);
    const newIndex = flatOptions.findIndex((o) => o.id === over.id);
    const reordered = arrayMove(flatOptions, oldIndex, newIndex);
    batchReorder(reordered.map((o) => o.id));
  };

  // ✨ drag end handler สำหรับ tree table (เฉพาะ parent-level)
  const parentOptions = treeData;
  const handleTreeDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const oldIndex = parentOptions.findIndex((o) => o.id === active.id);
    const newIndex = parentOptions.findIndex((o) => o.id === over.id);
    const reordered = arrayMove(parentOptions, oldIndex, newIndex);
    // ✨ เก็บ id ทั้ง parent และ children ตามลำดับ
    const orderedIds: string[] = [];
    reordered.forEach((p) => {
      orderedIds.push(p.id);
      (p.children ?? []).forEach((c) => orderedIds.push(c.id));
    });
    batchReorder(orderedIds);
  };

  // ─── Tree Table Columns ──────────────────────────────────────────────────────

  const treeColumns = [
    {
      title: "",
      key: "drag",
      width: 32,
      // ✨ Bug #3 fix: HolderOutlined เป็นแค่ visual hint — drag ทำงานผ่าน SortableRow
      render: (_: unknown, record: TreeConfigOption) =>
        !record.parentValue ? (
          <HolderOutlined
            style={{ color: token.colorTextDisabled, fontSize: 14 }}
          />
        ) : null,
    },
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
                onClick={(e) => {
                  e.stopPropagation();
                  openAddModal(record.value);
                }}
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
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(record);
                }}
              />
            </Tooltip>
            <Tooltip title="ลบ">
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                danger
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteConfirm(record.id, isParent);
                }}
              />
            </Tooltip>
          </Flex>
        );
      },
    },
  ];

  // ─── Flat Table Columns ──────────────────────────────────────────────────────

  const flatColumns = [
    {
      title: "",
      key: "drag",
      width: 32,
      render: () => (
        <HolderOutlined
          style={{ color: token.colorTextDisabled, fontSize: 14 }}
        />
      ),
    },
    {
      title: "ลำดับ",
      dataIndex: "sortOrder",
      width: 60,
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
              onClick={(e) => {
                e.stopPropagation();
                openEditModal(record);
              }}
            />
          </Tooltip>
          <Tooltip title="ลบ">
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              danger
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteConfirm(record.id, false);
              }}
            />
          </Tooltip>
        </Flex>
      ),
    },
  ];

  // ─── Row component factories ─────────────────────────────────────────────────

  // ✨ Tree: ใช้ SortableRow เฉพาะ parent row — children เป็น <tr> ธรรมดา
  const TreeBodyRow = ({
    children,
    ...rowProps
  }: React.HTMLAttributes<HTMLTableRowElement> & {
    "data-row-key"?: string;
  }) => {
    const rowKey = rowProps["data-row-key"];
    const isParent = rowKey ? treeData.some((p) => p.id === rowKey) : false;
    if (isParent && rowKey) {
      return (
        <SortableRow id={rowKey} {...rowProps}>
          {children}
        </SortableRow>
      );
    }
    return <tr {...rowProps}>{children}</tr>;
  };

  // ✨ Flat: ทุก row เป็น SortableRow
  const FlatBodyRow = ({
    children,
    ...rowProps
  }: React.HTMLAttributes<HTMLTableRowElement> & {
    "data-row-key"?: string;
  }) => {
    const rowKey = rowProps["data-row-key"];
    if (rowKey) {
      return (
        <SortableRow id={rowKey} {...rowProps}>
          {children}
        </SortableRow>
      );
    }
    return <tr {...rowProps}>{children}</tr>;
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

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
        // ✨ Tree Table — drag เฉพาะ parent row เพื่อเรียงหมวดหมู่
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleTreeDragEnd}
        >
          <SortableContext
            items={parentOptions.map((o) => o.id)}
            strategy={verticalListSortingStrategy}
          >
            <Table<TreeConfigOption>
              dataSource={treeData}
              columns={treeColumns}
              rowKey="id"
              loading={isLoading}
              pagination={false}
              size="small"
              expandable={{ defaultExpandAllRows: true }}
              components={{ body: { row: TreeBodyRow } }}
            />
          </SortableContext>
        </DndContext>
      ) : (
        // ✨ Flat Table — drag ทุก row ได้
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleFlatDragEnd}
        >
          <SortableContext
            items={flatOptions.map((o) => o.id)}
            strategy={verticalListSortingStrategy}
          >
            <Table<ConfigOption>
              dataSource={flatOptions}
              columns={flatColumns}
              rowKey="id"
              loading={isLoading}
              pagination={false}
              size="small"
              components={{ body: { row: FlatBodyRow } }}
            />
          </SortableContext>
        </DndContext>
      )}
    </Card>
  );
}

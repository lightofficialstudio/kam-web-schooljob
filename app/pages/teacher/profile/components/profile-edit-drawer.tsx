"use client";

import { Button, Drawer, Space } from "antd";
import React, { ReactNode } from "react";

interface ProfileEditDrawerProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  loading?: boolean;
  children: ReactNode;
  width?: number | string;
}

export const ProfileEditDrawer: React.FC<ProfileEditDrawerProps> = ({
  title,
  isOpen,
  onClose,
  onSave,
  loading = false,
  children,
  width = 520,
}) => {
  return (
    <Drawer
      title={<span className="text-lg font-bold text-gray-800">{title}</span>}
      placement="right"
      onClose={onClose}
      open={isOpen}
      width={width}
      extra={
        <Space>
          <Button onClick={onClose}>ยกเลิก</Button>
          <Button type="primary" onClick={onSave} loading={loading}>
            บันทึก
          </Button>
        </Space>
      }
      footer={
        <div className="flex justify-end p-2 px-4 border-t border-gray-100">
          <Space>
            <Button onClick={onClose}>ปิด</Button>
            <Button type="primary" onClick={onSave} loading={loading}>
              บันทึกข้อมูล
            </Button>
          </Space>
        </div>
      }
    >
      <div className="py-2">{children}</div>
    </Drawer>
  );
};

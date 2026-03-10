"use client";

import { EditOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import React, { ReactNode } from "react";

interface ProfileSectionWrapperProps {
  title: string;
  onEdit?: () => void;
  children: ReactNode;
  id?: string;
  extra?: ReactNode;
}

export const ProfileSectionWrapper: React.FC<ProfileSectionWrapperProps> = ({
  title,
  onEdit,
  children,
  id,
  extra,
}) => {
  return (
    <Card
      id={id}
      bordered={false}
      className="mb-8"
      styles={{ body: { padding: "0 0 24px 0" } }}
      title={
        <span className="text-2xl font-bold text-gray-800 tracking-tight">
          {title}
        </span>
      }
      extra={
        <div className="flex items-center gap-2">
          {extra}
          {onEdit && (
            <Button
              type="text"
              shape="circle"
              icon={
                <EditOutlined className="text-gray-400 text-lg hover:text-blue-500" />
              }
              onClick={onEdit}
            />
          )}
        </div>
      }
    >
      <div className="py-2 px-1">{children}</div>
      <div className="border-b border-gray-100 mt-4 mx-1" />
    </Card>
  );
};

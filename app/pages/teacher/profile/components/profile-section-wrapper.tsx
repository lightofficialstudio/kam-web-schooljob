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
      bordered={true}
      style={{
        borderRadius: "12px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
        border: "1px solid #f0f0f0",
      }}
      className="mb-8"
      styles={{
        header: {
          borderBottom: "1px solid #f5f5f5",
          padding: "16px 24px",
        },
        body: {
          padding: "24px",
        },
      }}
      title={
        <span className="text-xl font-bold text-gray-800 tracking-tight">
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
      <div className="py-2">{children}</div>
    </Card>
  );
};

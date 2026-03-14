"use client";

import { EditOutlined } from "@ant-design/icons";
import { Button, Card, Space, Typography, theme as antTheme } from "antd";
import React, { ReactNode } from "react";

const { Title } = Typography;

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
  const { token } = antTheme.useToken();

  return (
    <Card
      id={id}
      style={{
        marginBottom: token.marginLG,
        borderRadius: token.borderRadiusLG,
        border: `1px solid ${token.colorBorderSecondary}`,
      }}
      styles={{
        header: {
          padding: "16px 24px",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        },
        body: {
          padding: "24px",
        },
      }}
      title={
        <Title 
          level={4} 
          style={{ 
            margin: 0, 
            fontWeight: 700, 
            color: token.colorTextHeading,
            letterSpacing: "-0.02em"
          }}
        >
          {title}
        </Title>
      }
      extra={
        <Space size="middle">
          {extra}
          {onEdit && (
            <Button
              type="text"
              shape="circle"
              icon={
                <EditOutlined 
                  style={{ 
                    color: token.colorTextDescription,
                    fontSize: "18px"
                  }} 
                />
              }
              onClick={onEdit}
            />
          )}
        </Space>
      }
    >
      {children}
    </Card>
  );
};
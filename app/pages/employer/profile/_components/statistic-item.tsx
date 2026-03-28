"use client";

import { Flex, Typography, theme } from "antd";
import React from "react";

const { Text } = Typography;

interface StatisticItemProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

export const StatisticItem: React.FC<StatisticItemProps> = ({
  label,
  value,
  icon,
}) => {
  const { token } = theme.useToken();

  return (
    <Flex align="flex-start" gap={12}>
      <div
        style={{
          padding: "8px",
          backgroundColor: token.colorFillTertiary,
          borderRadius: "8px",
          color: token.colorText,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <Flex vertical gap={0}>
        <Text type="secondary" style={{ fontSize: "12px", display: "block" }}>
          {label}
        </Text>
        <Text strong style={{ fontSize: "15px" }}>
          {value}
        </Text>
      </Flex>
    </Flex>
  );
};

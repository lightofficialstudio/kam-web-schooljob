"use client";

import { Card, Flex, Skeleton, Space, theme } from "antd";

interface SectionSkeletonProps {
  title?: boolean;
  rows?: number;
}

export const SectionSkeleton = ({
  title = true,
  rows = 3,
}: SectionSkeletonProps) => {
  const { token } = theme.useToken();

  return (
    <Card
      variant="borderless"
      style={{
        borderRadius: 16,
        border: `1px solid ${token.colorBorderSecondary}`,
        marginBottom: 24,
      }}
    >
      <Flex vertical gap={16}>
        {title && (
          <Space>
            <Skeleton.Avatar active size="small" shape="circle" />
            <Skeleton.Input active size="small" style={{ width: 120 }} />
          </Space>
        )}
        <Skeleton active paragraph={{ rows }} title={false} />
      </Flex>
    </Card>
  );
};

export const SidebarSkeleton = () => {
  const { token } = theme.useToken();

  return (
    <Flex vertical gap={24}>
      {/* Skeleton for Plan Card */}
      <Card
        variant="borderless"
        style={{
          borderRadius: 24,
          background: token.colorBgContainer,
          border: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Flex vertical gap={16}>
          <Skeleton.Input active size="small" style={{ width: "60%" }} />
          <Skeleton.Button active block style={{ height: 40 }} />
          <Skeleton active paragraph={{ rows: 2 }} title={false} />
        </Flex>
      </Card>

      {/* Skeleton for Tips Card */}
      <Card
        variant="borderless"
        style={{
          borderRadius: 20,
          background: token.colorBgContainer,
          border: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Flex vertical gap={12}>
          <Skeleton.Input active size="small" style={{ width: "40%" }} />
          <Skeleton active paragraph={{ rows: 4 }} title={false} />
        </Flex>
      </Card>
    </Flex>
  );
};

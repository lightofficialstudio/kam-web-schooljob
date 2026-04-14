"use client";

import { Card, Col, Flex, Row, Skeleton, Space, theme } from "antd";

export const MyJobsSkeleton = () => {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "-32px auto 0",
        padding: "0 24px",
        width: "100%",
      }}
    >
      <Flex vertical gap={24}>
        {/* Package Banner Skeleton */}
        <Card
          variant="borderless"
          className="shadow-sm"
          style={{
            borderRadius: 16,
            background: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Flex align="center" justify="space-between" gap={24} wrap="wrap">
            <Flex gap={16} align="center" style={{ flex: 1 }}>
              <Skeleton.Avatar active size={48} shape="square" />
              <div style={{ flex: 1 }}>
                <Skeleton.Input
                  active
                  size="small"
                  style={{ width: 120, marginBottom: 8 }}
                />
                <Skeleton.Input active size="small" style={{ width: "80%" }} />
              </div>
            </Flex>
            <div style={{ width: 200 }}>
              <Skeleton.Input
                active
                size="small"
                style={{ width: 100, marginBottom: 8 }}
              />
              <Skeleton.Button
                active
                block
                size="small"
                style={{ height: 8 }}
              />
            </div>
          </Flex>
        </Card>

        {/* Stats Section Skeleton */}
        <Row gutter={[24, 24]}>
          {[1, 2, 3, 4].map((i) => (
            <Col key={i} xs={24} sm={12} lg={6}>
              <Card
                variant="borderless"
                style={{ borderRadius: 16, background: token.colorBgContainer }}
              >
                <Skeleton
                  active
                  avatar={{ size: 32 }}
                  paragraph={{ rows: 1 }}
                  title={false}
                />
              </Card>
            </Col>
          ))}
        </Row>

        {/* Filter Section Skeleton */}
        <Card
          variant="borderless"
          style={{ borderRadius: 16, background: token.colorBgContainer }}
        >
          <Flex gap={16} wrap="wrap">
            <Skeleton.Input active style={{ width: 200 }} />
            <Skeleton.Input active style={{ width: 150 }} />
            <Skeleton.Input active style={{ width: 150 }} />
          </Flex>
        </Card>

        {/* Table Skeleton */}
        <Card
          variant="borderless"
          style={{
            borderRadius: 16,
            background: token.colorBgContainer,
            padding: 0,
          }}
        >
          <div className="p-4 border-b border-gray-100 flex justify-between">
            <Skeleton.Input active size="small" style={{ width: 100 }} />
            <Skeleton.Input active size="small" style={{ width: 100 }} />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="p-6 border-b border-gray-50 flex items-center justify-between"
            >
              <Flex gap={16} align="center" style={{ flex: 1 }}>
                <Skeleton.Avatar active size={40} shape="circle" />
                <div style={{ flex: 1 }}>
                  <Skeleton.Input
                    active
                    size="small"
                    style={{ width: 200, marginBottom: 8 }}
                  />
                  <Skeleton.Input active size="small" style={{ width: 150 }} />
                </div>
              </Flex>
              <Space size={12}>
                <Skeleton.Button active size="small" style={{ width: 80 }} />
                <Skeleton.Button active size="small" style={{ width: 32 }} />
              </Space>
            </div>
          ))}
        </Card>
      </Flex>
    </div>
  );
};

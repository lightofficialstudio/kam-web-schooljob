"use client";

import { Card, Col, Flex, Row, Skeleton, Space, theme } from "antd";

export const PostJobSkeleton = () => {
  const { token } = theme.useToken();

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", width: "100%" }}>
      <Row gutter={40}>
        {/* Main Content Skeleton */}
        <Col xs={24} lg={16}>
          <Flex vertical gap={24}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Card
                key={i}
                variant="borderless"
                style={{
                  borderRadius: 16,
                  border: `1px solid ${token.colorBorderSecondary}`,
                  background: token.colorBgContainer,
                }}
              >
                <Flex vertical gap={16}>
                  <Space>
                    <Skeleton.Avatar active size="small" shape="circle" />
                    <Skeleton.Input active size="small" style={{ width: 150 }} />
                  </Space>
                  <Skeleton active paragraph={{ rows: i === 3 ? 6 : 3 }} title={false} />
                </Flex>
              </Card>
            ))}
          </Flex>
        </Col>

        {/* Sidebar Skeleton */}
        <Col xs={0} lg={8}>
          <Flex vertical gap={24} style={{ position: "sticky", top: 120 }}>
            <Card
              variant="borderless"
              style={{
                borderRadius: 24,
                padding: "24px",
                border: `1px solid ${token.colorBorderSecondary}`,
                background: token.colorBgContainer,
              }}
            >
              <Flex vertical gap={16}>
                <Skeleton.Input active size="small" style={{ width: "60%" }} />
                <Skeleton.Button active block style={{ height: 48, borderRadius: 12 }} />
                <Skeleton active paragraph={{ rows: 2 }} title={false} />
              </Flex>
            </Card>
            <Card
              variant="borderless"
              style={{
                borderRadius: 20,
                padding: "20px",
                border: `1px solid ${token.colorBorderSecondary}`,
                background: token.colorBgContainer,
              }}
            >
              <Skeleton active paragraph={{ rows: 6 }} title />
            </Card>
          </Flex>
        </Col>
      </Row>
    </div>
  );
};

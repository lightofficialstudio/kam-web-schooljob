"use client";

import { Card, Col, Flex, Row, Skeleton, theme, Typography } from "antd";

const { Title } = Typography;

export const SchoolProfileSkeleton = () => {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: token.colorBgLayout,
        paddingBottom: 80,
      }}
    >
      {/* ─── Hero Header Skeleton ─── */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #001e45 0%, #0a4a8a 60%, #11b6f5 100%)",
          paddingBottom: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 0" }}
        >
          <Flex align="flex-start" gap={20} wrap="wrap">
            <Skeleton.Avatar
              active
              size={100}
              shape="circle"
              style={{ border: "4px solid rgba(255,255,255,0.25)" }}
            />
            <Flex
              vertical
              gap={12}
              style={{ flex: 1, minWidth: 200, paddingTop: 12 }}
            >
              <Skeleton.Input active size="large" style={{ width: 300 }} />
              <Flex gap={8}>
                <Skeleton.Button active size="small" style={{ width: 80 }} />
                <Skeleton.Button active size="small" style={{ width: 120 }} />
              </Flex>
            </Flex>
          </Flex>

          {/* Tab Skeleton Simulation */}
          <Flex gap={32} style={{ marginTop: 32, paddingLeft: 8 }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  paddingBottom: 12,
                  borderBottom: i === 1 ? "3px solid #fff" : "none",
                  opacity: i === 1 ? 1 : 0.5,
                }}
              >
                <Skeleton.Input
                  active
                  size="small"
                  style={{ width: 80, height: 14 }}
                />
              </div>
            ))}
          </Flex>
        </div>
      </div>

      {/* ─── Main Content Skeleton ─── */}
      <div style={{ maxWidth: 1100, margin: "32px auto 0", padding: "0 24px" }}>
        <Row gutter={[24, 24]}>
          {/* Left Sidebar Skeleton */}
          <Col xs={24} lg={7}>
            <Flex vertical gap={20}>
              <Card variant="borderless" style={{ borderRadius: 16 }}>
                <Flex vertical align="center" gap={20}>
                  <Skeleton.Avatar
                    active
                    size={120}
                    shape="square"
                    style={{ borderRadius: 12 }}
                  />
                  <Skeleton active paragraph={{ rows: 4 }} title={false} />
                  <Skeleton.Button active block style={{ height: 40 }} />
                </Flex>
              </Card>
              <Card variant="borderless" style={{ borderRadius: 16 }}>
                <Skeleton active paragraph={{ rows: 3 }} title />
              </Card>
            </Flex>
          </Col>

          {/* Right Content Skeleton */}
          <Col xs={24} lg={17}>
            <Flex vertical gap={20}>
              {/* Cover Image Skeleton */}
              <Skeleton.Button
                active
                block
                style={{ height: 220, borderRadius: 16 }}
              />

              <Card variant="borderless" style={{ borderRadius: 16 }}>
                <Skeleton active paragraph={{ rows: 5 }} title />
                <Divider style={{ margin: "24px 0" }} />
                <Skeleton active paragraph={{ rows: 4 }} title />
              </Card>

              <Card variant="borderless" style={{ borderRadius: 16 }}>
                <Row gutter={[16, 16]}>
                  {[1, 2, 3, 4].map((i) => (
                    <Col xs={24} sm={12} key={i}>
                      <Skeleton.Button
                        active
                        block
                        style={{ height: 60, borderRadius: 10 }}
                      />
                    </Col>
                  ))}
                </Row>
              </Card>
            </Flex>
          </Col>
        </Row>
      </div>
    </div>
  );
};

const Divider = ({ style }: { style?: React.CSSProperties }) => (
  <div
    style={{ height: 1, backgroundColor: "#f0f0f0", width: "100%", ...style }}
  />
);

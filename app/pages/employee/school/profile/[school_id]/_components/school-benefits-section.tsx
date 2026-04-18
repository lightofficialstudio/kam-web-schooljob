"use client";

import { CheckCircleFilled } from "@ant-design/icons";
import {
  Card,
  Col,
  Flex,
  Row,
  Typography,
  theme as antTheme,
} from "antd";
import type { SchoolProfileDetail } from "../_api/school-profile-api";

const { Title, Text } = Typography;

interface SchoolBenefitsSectionProps {
  benefits: SchoolProfileDetail["benefits"];
}

// ✨ แสดงสวัสดิการที่โรงเรียนมีให้
export const SchoolBenefitsSection = ({ benefits }: SchoolBenefitsSectionProps) => {
  const { token } = antTheme.useToken();

  if (!benefits.length) return null;

  return (
    <Card
      style={{
        borderRadius: token.borderRadiusLG,
        border: `1px solid ${token.colorBorderSecondary}`,
      }}
      styles={{ body: { padding: 28 } }}
    >
      <Title level={4} style={{ margin: "0 0 20px" }}>
        🎁 สวัสดิการของโรงเรียน
      </Title>
      <Row gutter={[12, 12]}>
        {benefits.map((benefit, i) => (
          <Col xs={24} sm={12} key={i}>
            <Flex gap={10} align="center">
              <CheckCircleFilled
                style={{ color: token.colorSuccess, fontSize: 16, flexShrink: 0 }}
              />
              <Text style={{ fontSize: 14 }}>{benefit}</Text>
            </Flex>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

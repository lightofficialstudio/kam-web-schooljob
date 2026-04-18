"use client";

import { CheckCircleFilled, GiftOutlined } from "@ant-design/icons";
import { Card, Col, Row, Typography, theme as antTheme } from "antd";
import type { SchoolProfileDetail } from "../_api/school-profile-api";

const { Title, Text } = Typography;

interface SchoolBenefitsSectionProps {
  benefits: SchoolProfileDetail["benefits"];
}

// ✨ แสดงสวัสดิการที่โรงเรียนมีให้
export const SchoolBenefitsSection = ({
  benefits,
}: SchoolBenefitsSectionProps) => {
  const { token } = antTheme.useToken();

  if (!benefits.length) return null;

  return (
    <Card
      className="shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-none! transition-all duration-300"
      style={{
        borderRadius: 32,
        backgroundColor: token.colorBgContainer,
      }}
      styles={{ body: { padding: 32 } }}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-2xl bg-gold-50 text-gold-600">
          <GiftOutlined className="text-xl" />
        </div>
        <Title
          level={4}
          className="m-0! font-black text-2xl tracking-tight"
          style={{ color: "#0F172A" }}
        >
          สวัสดิการและจุดเด่น
        </Title>
      </div>

      <Row gutter={[16, 16]}>
        {benefits.map((benefit, i) => (
          <Col span={24} key={i}>
            <div
              className="px-6 py-4 rounded-2xl flex items-center gap-4 border border-slate-50 dark:border-slate-800 hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-300 group"
              style={{ background: token.colorBgLayout }}
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 text-[#437FC7] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <CheckCircleFilled className="text-sm" />
              </div>
              <Text className="text-slate-600 dark:text-slate-300 font-bold text-base">
                {benefit}
              </Text>
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

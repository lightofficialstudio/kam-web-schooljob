"use client";

import { Layout, Typography } from "antd";

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

export default function Footer() {
  return (
    <AntFooter
      style={{
        textAlign: "center",
        padding: "48px 0",
        background: "white",
        borderTop: "1px solid #F1F5F9",
      }}
    >
      <Text type="secondary">© 2026 KAM SCHOOLJOB. All rights reserved.</Text>
    </AntFooter>
  );
}

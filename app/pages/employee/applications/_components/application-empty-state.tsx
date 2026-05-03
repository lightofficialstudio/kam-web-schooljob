"use client";

import { FileSearchOutlined } from "@ant-design/icons";
import { Button, theme, Typography } from "antd";
import Link from "next/link";

const { Text } = Typography;

interface ApplicationEmptyStateProps {
  filtered?: boolean;
}

export const ApplicationEmptyState: React.FC<ApplicationEmptyStateProps> = ({
  filtered = false,
}) => {
  const { token } = theme.useToken();

  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-8"
      style={{ textAlign: "center" }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: token.colorFillTertiary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
          fontSize: 36,
          color: token.colorTextTertiary,
        }}
      >
        <FileSearchOutlined />
      </div>

      <Text
        strong
        style={{ fontSize: 16, color: token.colorText, display: "block", marginBottom: 8 }}
      >
        {filtered ? "ไม่มีใบสมัครในสถานะนี้" : "ยังไม่มีใบสมัครงาน"}
      </Text>

      <Text
        type="secondary"
        style={{ fontSize: 14, display: "block", marginBottom: 24, maxWidth: 320 }}
      >
        {filtered
          ? "ลองเลือกดูสถานะอื่น หรือกลับไปดูทั้งหมด"
          : "เริ่มค้นหางานที่เหมาะกับคุณ แล้วกดสมัครได้เลย"}
      </Text>

      {!filtered && (
        <Link href="/pages/job">
          <Button type="primary" size="large" style={{ borderRadius: 10 }}>
            ค้นหางานตอนนี้
          </Button>
        </Link>
      )}
    </div>
  );
};

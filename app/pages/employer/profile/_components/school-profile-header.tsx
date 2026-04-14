"use client";

// Banner header สำหรับโปรไฟล์โรงเรียน — แสดง Avatar, ชื่อ, badges และปุ่มแก้ไข
import {
  BankOutlined,
  CheckCircleFilled,
  EditOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Button, Flex, Tag, Typography } from "antd";
import Image from "next/image";

import type { SchoolProfile } from "../_state/school-profile.state";

const { Title } = Typography;

interface SchoolProfileHeaderProps {
  profile: SchoolProfile;
  onEditClick: () => void;
}

export const SchoolProfileHeader: React.FC<SchoolProfileHeaderProps> = ({
  profile,
  onEditClick,
}) => {
  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #001e45 0%, #0a4a8a 60%, #11b6f5 100%)",
        paddingBottom: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative illustration */}
      <div
        style={{
          position: "absolute",
          right: 40,
          bottom: 0,
          width: 280,
          height: 220,
          opacity: 0.12,
          pointerEvents: "none",
        }}
      >
        <Image
          src="/images/flat/undraw_hiring_8szx.svg"
          alt=""
          fill
          style={{ objectFit: "contain", objectPosition: "bottom" }}
        />
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 0" }}>
        {/* Top row — avatar + name + action */}
        <Flex align="flex-start" gap={20} wrap="wrap">
          <Badge
            count={
              <CheckCircleFilled style={{ color: "#52c41a", fontSize: 18 }} />
            }
            offset={[-8, 88]}
          >
            <Avatar
              size={100}
              icon={!profile.logoUrl ? <BankOutlined /> : undefined}
              src={profile.logoUrl || undefined}
              style={{
                background: "linear-gradient(135deg, #0d8fd4 0%, #11b6f5 100%)",
                border: "4px solid rgba(255,255,255,0.25)",
                flexShrink: 0,
                fontSize: 36,
                color: "#fff",
              }}
            >
              {!profile.logoUrl && profile.name?.charAt(0)}
            </Avatar>
          </Badge>

          <Flex vertical gap={8} style={{ flex: 1, minWidth: 200 }}>
            <Title
              level={2}
              style={{ color: "white", margin: 0, lineHeight: 1.2 }}
            >
              {profile.name}
            </Title>
            <Flex gap={8} wrap="wrap">
              {profile.type && (
                <Tag color="gold" style={{ fontSize: 13, margin: 0 }}>
                  {profile.type}
                </Tag>
              )}
              {profile.affiliation && (
                <Tag
                  color="default"
                  style={{
                    fontSize: 13,
                    margin: 0,
                    background: "rgba(255,255,255,0.12)",
                    borderColor: "rgba(255,255,255,0.25)",
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  {profile.affiliation.split(" ")[0]}
                </Tag>
              )}
              <Tag
                icon={<EnvironmentOutlined />}
                color="default"
                style={{
                  fontSize: 13,
                  margin: 0,
                  background: "rgba(255,255,255,0.15)",
                  borderColor: "rgba(255,255,255,0.3)",
                  color: "white",
                }}
              >
                {[profile.district, profile.location].filter(Boolean).join(", ")}
              </Tag>
            </Flex>
          </Flex>

          <Button
            icon={<EditOutlined />}
            onClick={onEditClick}
            style={{
              color: "white",
              borderColor: "rgba(255,255,255,0.4)",
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(6px)",
              flexShrink: 0,
            }}
          >
            แก้ไขโปรไฟล์
          </Button>
        </Flex>

        {/* bottom padding */}
        <div style={{ height: 32 }} />
      </div>
    </div>
  );
};

"use client";

import { useAuthStore } from "@/app/stores/auth-store";
import { LogoutOutlined, MenuOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Avatar, Button, Col, Dropdown, Row, Tooltip, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AdminNavbarProps {
  onMenuClick?: () => void;
  title?: string;
  mode: "light" | "dark";
}

export function AdminNavbar({ onMenuClick, title, mode }: AdminNavbarProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // ✨ [Initialize mounted state]
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✨ [Dropdown menu สำหรับ User]
  const userMenu: MenuProps["items"] = [
    {
      key: "profile",
      label: "โปรไฟล์",
      onClick: () => router.push("/pages/admin/profile"),
    },
    {
      key: "settings",
      label: "การตั้งค่า",
      onClick: () => router.push("/pages/admin/settings"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "ออกจากระบบ",
      onClick: () => {
        logout();
        router.push("/pages/signin");
      },
    },
  ];

  if (!mounted) return null;

  return (
    <Row
      align="middle"
      justify="space-between"
      style={{
        padding: "0 24px",
        height: "64px",
      }}
    >
      {/* ✨ [Left: Menu Toggle + Title] */}
      <Col flex="auto">
        <Row align="middle" gutter={24}>
          <Col>
            <Tooltip title="สลับแถบด้านข้าง">
              <Button
                type="text"
                icon={<MenuOutlined style={{ fontSize: "18px" }} />}
                onClick={onMenuClick}
              />
            </Tooltip>
          </Col>
          <Col>
            <Typography.Title
              level={3}
              style={{
                margin: 0,
                fontWeight: 700,
              }}
            >
              {title || "แดชบอร์ดแอดมิน"}
            </Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: "12px" }}>
              KAM - School Job Platform
            </Typography.Text>
          </Col>
        </Row>
      </Col>

      {/* ✨ [Right: User Menu] */}
      <Col>
        <Row align="middle" gutter={12}>
          {user && (
            <>
              <Col>
                <Row
                  align="middle"
                  gutter={12}
                  style={{
                    paddingRight: "16px",
                    borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <Col>
                    <Typography.Text
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        display: "block",
                      }}
                    >
                      {user.full_name || "ผู้ใช้"}
                    </Typography.Text>
                    <Typography.Text
                      type="secondary"
                      style={{ fontSize: "12px", display: "block" }}
                    >
                      {user.role === "ADMIN"
                        ? "ผู้ดูแลระบบ"
                        : user.role === "SCHOOL"
                          ? "โรงเรียน"
                          : "ครู"}
                    </Typography.Text>
                  </Col>
                  <Col>
                    <Avatar
                      size={40}
                      icon={<UserOutlined />}
                      style={{
                        background:
                          "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      }}
                    >
                      {(user.full_name || "A").charAt(0).toUpperCase()}
                    </Avatar>
                  </Col>
                </Row>
              </Col>
            </>
          )}
          <Col>
            <Dropdown menu={{ items: userMenu }} trigger={["click"]}>
              <Tooltip title="เมนูผู้ใช้">
                <Button
                  type="text"
                  icon={<LogoutOutlined style={{ fontSize: "18px" }} />}
                />
              </Tooltip>
            </Dropdown>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

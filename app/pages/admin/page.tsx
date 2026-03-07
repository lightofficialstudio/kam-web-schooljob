"use client";

import { AdminLayout } from "@/app/components/layouts/admin/admin-layout";
import { AdminGuard } from "@/app/components/layouts/admin/admin-guard";
import { Card, Col, Row, Statistic } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";

/**
 * 📊 Admin Dashboard Page
 */
export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminLayout title="Dashboard">
        <div className="space-y-6">
          {/* ✨ [Header] */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Admin Dashboard
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Welcome to the admin control panel
            </p>
          </div>

          {/* ✨ [Statistics Cards] */}
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Users"
                  value={2}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: "#0066FF" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Admins"
                  value={1}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: "#FF4D4F" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Active Sessions"
                  value={1}
                  prefix={<AppstoreOutlined />}
                  valueStyle={{ color: "#52C41A" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Database Records"
                  value={2}
                  prefix={<DatabaseOutlined />}
                  valueStyle={{ color: "#722ED1" }}
                />
              </Card>
            </Col>
          </Row>

          {/* ✨ [Info Cards] */}
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Card title="System Status" className="bg-green-50">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-700">Database</span>
                    <span className="text-green-600 font-semibold">
                      ✓ Connected
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-700">API Server</span>
                    <span className="text-green-600 font-semibold">
                      ✓ Running
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-700">Authentication</span>
                    <span className="text-green-600 font-semibold">
                      ✓ Active
                    </span>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Quick Actions">
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded cursor-pointer hover:bg-blue-100 transition">
                    <p className="font-medium text-blue-900">
                      👥 Manage Users
                    </p>
                    <p className="text-xs text-blue-700">
                      View and manage all users
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded cursor-pointer hover:bg-purple-100 transition">
                    <p className="font-medium text-purple-900">
                      📊 View Reports
                    </p>
                    <p className="text-xs text-purple-700">
                      System analytics and reports
                    </p>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}

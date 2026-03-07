"use client";

import { AdminLayout } from "@/app/components/layouts/admin";
import { useAuthStore } from "@/app/stores/auth-store";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { user } = useAuthStore();

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* ✨ [Welcome Section] */}
        <div className="bg-linear-to-r from-blue-600 to-blue-800 rounded-lg shadow p-6 text-white">
          <h2 className="text-3xl font-bold">
            Welcome back, {user?.full_name || "Admin"}! 👋
          </h2>
          <p className="mt-2 text-blue-100">
            Here's what's happening with your platform today.
          </p>
        </div>

        {/* ✨ [Stats Grid] */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Link href="/admin/user-management">
              <Card hoverable className="cursor-pointer">
                <Statistic
                  title="Total Users"
                  value={182}
                  prefix={<TeamOutlined className="text-blue-600" />}
                />
              </Card>
            </Link>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="Active Jobs"
                value={45}
                prefix={<FileTextOutlined className="text-green-600" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="Completed"
                value={234}
                prefix={<CheckCircleOutlined className="text-emerald-600" />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable>
              <Statistic
                title="Pending"
                value={12}
                prefix={<ClockCircleOutlined className="text-amber-600" />}
              />
            </Card>
          </Col>
        </Row>

        {/* ✨ [Recent Activity] */}
        <Card title="Recent Activity" className="shadow">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900">
                  New user registered
                </p>
                <p className="text-sm text-slate-600">
                  thanat.light@schoolbright.co joined as TEACHER
                </p>
              </div>
              <span className="text-xs text-slate-500">Just now</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900">Job posted</p>
                <p className="text-sm text-slate-600">
                  New teaching position at Bangkok International School
                </p>
              </div>
              <span className="text-xs text-slate-500">2 hours ago</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded">
              <div className="w-3 h-3 bg-amber-600 rounded-full"></div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900">
                  Application submitted
                </p>
                <p className="text-sm text-slate-600">
                  New application for English Teacher position
                </p>
              </div>
              <span className="text-xs text-slate-500">5 hours ago</span>
            </div>
          </div>
        </Card>

        {/* ✨ [Quick Links] */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Link href="/admin/user-management">
              <Card hoverable className="text-center py-6">
                <TeamOutlined className="text-3xl text-blue-600 mb-2" />
                <p className="font-semibold text-slate-900">Manage Users</p>
                <p className="text-sm text-slate-600">
                  View & manage all users
                </p>
              </Card>
            </Link>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card hoverable className="text-center py-6">
              <FileTextOutlined className="text-3xl text-green-600 mb-2" />
              <p className="font-semibold text-slate-900">Manage Jobs</p>
              <p className="text-sm text-slate-600">
                View & manage job postings
              </p>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card hoverable className="text-center py-6">
              <CheckCircleOutlined className="text-3xl text-emerald-600 mb-2" />
              <p className="font-semibold text-slate-900">Applications</p>
              <p className="text-sm text-slate-600">Review job applications</p>
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
}

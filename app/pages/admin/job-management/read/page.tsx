"use client";

import { AuditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Flex, message, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/app/stores/auth-store";
import { AuditLogDrawer } from "./_components/audit-log-drawer";
import { JobDetailDrawer } from "./_components/job-detail-drawer";
import { JobFilterBar } from "./_components/job-filter-bar";
import { JobTable } from "./_components/job-table";
import { StatsBar } from "./_components/stats-bar";
import { useAdminJobStore } from "./_state/admin-job-store";

const { Title } = Typography;

export default function AdminJobManagementPage() {
  const router   = useRouter();
  const { user } = useAuthStore();

  const {
    jobs, total, totalPages, page, pageSize, isLoading,
    fetchJobs, setPage,
    openDrawer, openAuditDrawer, fetchAuditLogs,
    updateStatus, deleteJob,
  } = useAdminJobStore();

  const adminUserId = user?.user_id ?? "";

  // ✨ โหลดงานตอน mount
  useEffect(() => {
    if (adminUserId) fetchJobs(adminUserId);
  }, [adminUserId]);

  const handleSearch = () => {
    setPage(1);
    fetchJobs(adminUserId);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    fetchJobs(adminUserId);
  };

  const handleUpdateStatus = async (jobId: string, status: "OPEN" | "CLOSED" | "DRAFT") => {
    try {
      await updateStatus(adminUserId, jobId, status);
      message.success("อัปเดตสถานะสำเร็จ");
    } catch {
      message.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  };

  const handleDelete = async (jobId: string) => {
    try {
      await deleteJob(adminUserId, jobId);
      message.success("ลบประกาศงานสำเร็จ");
    } catch {
      message.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  };

  const handleOpenAuditLog = () => {
    openAuditDrawer();
    fetchAuditLogs(adminUserId, 1);
  };

  return (
    <Flex vertical gap={20} style={{ padding: "0 4px" }}>
      {/* header */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
        <Title level={4} style={{ margin: 0 }}>
          จัดการประกาศงาน
        </Title>
        <Flex gap={8}>
          <Button icon={<AuditOutlined />} onClick={handleOpenAuditLog}>
            Audit Log
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push("/pages/admin/job-management/create")}
          >
            สร้างประกาศงาน
          </Button>
        </Flex>
      </Flex>

      {/* สถิติ */}
      <StatsBar jobs={jobs} total={total} />

      {/* filter */}
      <JobFilterBar onSearch={handleSearch} />

      {/* ตาราง */}
      <JobTable
        jobs={jobs}
        total={total}
        page={page}
        pageSize={pageSize}
        isLoading={isLoading}
        adminUserId={adminUserId}
        onPageChange={handlePageChange}
        onViewDetail={openDrawer}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDelete}
      />

      {/* Drawers */}
      <JobDetailDrawer adminUserId={adminUserId} onUpdateStatus={handleUpdateStatus} />
      <AuditLogDrawer adminUserId={adminUserId} />
    </Flex>
  );
}

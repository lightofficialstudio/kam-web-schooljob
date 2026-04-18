"use client";

import { ModalComponent } from "@/app/components/modal/modal.component";
import { useAuthStore } from "@/app/stores/auth-store";
import { AuditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuditLogDrawer } from "./_components/audit-log-drawer";
import { JobDetailDrawer } from "./_components/job-detail-drawer";
import { JobFilterBar } from "./_components/job-filter-bar";
import { JobTable } from "./_components/job-table";
import { StatsBar } from "./_components/stats-bar";
import { useAdminJobStore } from "./_state/admin-job-store";

const { Title } = Typography;

export default function AdminJobManagementPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const {
    jobs,
    total,
    page,
    pageSize,
    isLoading,
    fetchJobs,
    setPage,
    openDrawer,
    openAuditDrawer,
    fetchAuditLogs,
    updateStatus,
    deleteJob,
    modal,
    hideModal,
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

  // ✨ store จัดการ showModal success/error เอง — page แค่ delegate + catch silently
  const handleUpdateStatus = async (
    jobId: string,
    status: "OPEN" | "CLOSED" | "DRAFT",
  ) => {
    try {
      await updateStatus(adminUserId, jobId, status);
    } catch {
      // ✨ store แสดง modal error แล้ว
    }
  };

  const handleDelete = async (jobId: string) => {
    try {
      await deleteJob(adminUserId, jobId);
    } catch {
      // ✨ store แสดง modal error แล้ว
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

      {/* ✨ สถิติ */}
      <StatsBar jobs={jobs} total={total} isLoading={isLoading} />

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
        onViewDetail={(job) => openDrawer(job, adminUserId)}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDelete}
      />

      {/* Drawers */}
      <JobDetailDrawer onUpdateStatus={handleUpdateStatus} />
      <AuditLogDrawer adminUserId={adminUserId} />

      {/* ✨ Status Modal — Success / Error / Warning */}
      <ModalComponent
        open={modal.open}
        type={modal.type}
        title={modal.title}
        description={modal.description}
        errorDetails={modal.errorDetails}
        onClose={hideModal}
        onConfirm={modal.onConfirm ?? hideModal}
        confirmLabel={modal.confirmLabel}
        cancelLabel={modal.cancelLabel}
      />
    </Flex>
  );
}

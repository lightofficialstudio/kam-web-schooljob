import { ModalComponent } from "@/app/components/modal/modal.component";
import { Button, Col, Form, Row } from "antd";
import React, { useState } from "react";

interface SectionFormProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
  onSubmit: (values: any) => Promise<void>;
  onReset?: () => void;
}

export const SectionForm: React.FC<SectionFormProps> = ({
  title,
  icon,
  color,
  children,
  onSubmit,
  onReset,
}) => {
  const [form] = Form.useForm();
  // ✨ โครงสร้าง local modal state
  interface ModalState {
    open: boolean;
    type: "success" | "error" | "confirm" | "delete";
    title: string;
    description: string;
    errorDetails?: unknown;
  }
  const MODAL_CLOSED: ModalState = {
    open: false,
    type: "success",
    title: "",
    description: "",
  };

  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<ModalState>(MODAL_CLOSED);

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      await onSubmit(values);
      setModal({
        open: true,
        type: "success",
        title: "บันทึกสำเร็จ",
        description: `บันทึก${title}เรียบร้อยแล้ว`,
      });
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message_th?: string } };
        message?: string;
      };
      const description =
        axiosErr?.response?.data?.message_th ||
        axiosErr?.message ||
        `ไม่สามารถบันทึก${title}ได้ กรุณาลองใหม่`;
      setModal({
        open: true,
        type: "error",
        title: "บันทึกไม่สำเร็จ",
        description,
        errorDetails: err,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    onReset?.();
  };

  return (
    <>
      <div
        style={{
          marginBottom: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "white",
          overflow: "hidden",
        }}
      >
        {/* Section Header */}
        <div
          style={{
            padding: "24px 32px",
            backgroundColor: "#fafafa",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div style={{ fontSize: "24px", color }}>{icon}</div>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
            {title}
          </h3>
        </div>

        {/* Form Content */}
        <div style={{ padding: "32px" }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            autoComplete="off"
          >
            {children}

            {/* Form Actions */}
            <Row gutter={16} style={{ marginTop: "32px" }}>
              <Col xs={24} sm={12}>
                <Button
                  htmlType="submit"
                  type="primary"
                  size="large"
                  loading={loading}
                  block
                  style={{
                    height: "44px",
                    fontSize: "14px",
                    fontWeight: "600",
                    borderRadius: "6px",
                  }}
                >
                  บันทึก{title}
                </Button>
              </Col>
              <Col xs={24} sm={12}>
                <Button
                  htmlType="reset"
                  size="large"
                  onClick={handleReset}
                  block
                  style={{
                    height: "44px",
                    fontSize: "14px",
                    fontWeight: "600",
                    borderRadius: "6px",
                  }}
                >
                  ยกเลิก
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>

      {/* ✨ Modal กลาง — ทุก state รายงานผ่านนี้ */}
      <ModalComponent
        open={modal.open}
        type={modal.type}
        title={modal.title}
        description={modal.description}
        errorDetails={modal.errorDetails}
        onClose={() => setModal(MODAL_CLOSED)}
        confirmLabel="ตกลง"
      />
    </>
  );
};

import BaseModal from "@/app/components/layouts/modal/base-modal";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
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
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({
    mainTitle: "",
    description: "",
    icon: null as React.ReactNode,
    type: "success" as "success" | "error" | "warning" | "info",
  });

  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      await onSubmit(values);

      setModalContent({
        mainTitle: "สำเร็จ",
        description: `บันทึก${title}เรียบร้อยแล้ว`,
        icon: (
          <CheckCircleOutlined style={{ color: "#22c55e", fontSize: "48px" }} />
        ),
        type: "success",
      });
      setModalVisible(true);

      setTimeout(() => {
        setModalVisible(false);
      }, 2000);
    } catch (error) {
      console.error("Error saving data:", error);
      setModalContent({
        mainTitle: "ข้อผิดพลาด",
        description: `ไม่สามารถบันทึก${title}ได้ กรุณาลองใหม่`,
        icon: (
          <ExclamationCircleOutlined
            style={{ color: "#ef4444", fontSize: "48px" }}
          />
        ),
        type: "error",
      });
      setModalVisible(true);
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

      {/* Notification Modal */}
      <BaseModal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        mainTitle={modalContent.mainTitle}
        description={modalContent.description}
        icon={modalContent.icon}
        type={modalContent.type}
      />
    </>
  );
};

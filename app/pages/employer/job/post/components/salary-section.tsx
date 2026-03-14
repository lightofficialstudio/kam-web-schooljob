"use client";

import { DollarOutlined } from "@ant-design/icons";
import { Card, Col, Form, InputNumber, Row, Select, Space, theme } from "antd";
import { useJobPostStore } from "../stores/job-post-store";

const { Option } = Select;

export default function SalarySection() {
  const { salaryType, setSalaryType } = useJobPostStore();
  const { token } = theme.useToken();

  return (
    <Card
      title={
        <Space>
          <DollarOutlined style={{ color: token.colorSuccess }} />{" "}
          ข้อมูลเงินเดือน
        </Space>
      }
      variant="borderless"
      style={{
        borderRadius: "16px",
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item
            label="รูปแบบเงินเดือน"
            name="salary_type"
            rules={[{ required: true, message: "กรุณาเลือกรูปแบบเงินเดือน" }]}
          >
            <Select size="large" onChange={(val) => setSalaryType(val)}>
              <Option value="NOT_SPECIFIED">ไม่ระบุ</Option>
              <Option value="NEGOTIABLE">ตามประสบการณ์</Option>
              <Option value="SPECIFY">ระบุเงินเดือน</Option>
            </Select>
          </Form.Item>
        </Col>
        {salaryType === "SPECIFY" && (
          <>
            <Col xs={24} md={12}>
              <Form.Item label="เงินเดือนเริ่มต้น (บาท)" name="salaryFrom">
                <InputNumber
                  size="large"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  style={{ width: "100%" }}
                  placeholder="เช่น 15,000"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="เงินเดือนสูงสุด (บาท)" name="salaryTo">
                <InputNumber
                  size="large"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  style={{ width: "100%" }}
                  placeholder="เช่น 25,000"
                />
              </Form.Item>
            </Col>
          </>
        )}
      </Row>
    </Card>
  );
}

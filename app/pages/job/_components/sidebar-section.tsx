"use client";

import { DeleteOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Divider,
  Empty,
  Flex,
  Space,
  Typography,
  theme as antTheme,
} from "antd";
import { useJobSearchStore } from "../_state/job-search-store";
import { useSavedJobsStore } from "../_state/saved-jobs-store";

const { Title, Text } = Typography;

// Sidebar ขวามือ: การค้นหาที่บันทึก, งานที่บันทึก, เคล็ดลับความปลอดภัย
export const SidebarSection = () => {
  const { token } = antTheme.useToken();
  const { savedJobIds, toggleSavedJob } = useSavedJobsStore();
  const { jobs, openJobDrawer } = useJobSearchStore();

  // ดึงข้อมูล Job เต็มจาก store โดยใช้ savedJobIds เป็น key
  const savedJobs = jobs.filter((j) => savedJobIds.includes(j.id));

  return (
    <Flex vertical gap={24}>
      {/* Saved Searches */}
      <Card variant="borderless" style={{ borderRadius: token.borderRadiusLG }}>
        <Space align="center" style={{ marginBottom: 8 }}>
          <Title level={5} style={{ margin: 0 }}>
            การค้นหาที่บันทึกไว้
          </Title>
          <Badge
            count="พบกันเร็วๆนี้"
            style={{ backgroundColor: token.colorInfo, fontSize: 10 }}
          />
        </Space>
        <Text type="secondary" style={{ fontSize: 14, display: "block" }}>
          ใช้ปุ่มบันทึกการค้นหาด้านล่างผลการค้นหาเพื่อบันทึกและรับงานใหม่ทางอีเมล
        </Text>
      </Card>

      {/* Saved Jobs — แสดงงานที่บันทึกไว้จริง */}
      <Card variant="borderless" style={{ borderRadius: token.borderRadiusLG }}>
        <Space align="center" style={{ marginBottom: 12 }}>
          <Title level={5} style={{ margin: 0 }}>
            งานที่บันทึกไว้
          </Title>
          <Badge
            count={savedJobs.length}
            showZero
            style={{ backgroundColor: savedJobs.length > 0 ? token.colorPrimary : token.colorTextQuaternary }}
          />
        </Space>

        {savedJobs.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text type="secondary" style={{ fontSize: 13 }}>
                กดไอคอนหัวใจบนการ์ดงานเพื่อบันทึกไว้ดูภายหลัง
              </Text>
            }
          />
        ) : (
          <Flex vertical>
            {savedJobs.map((job, index) => (
              <div key={job.id}>
                <Flex justify="space-between" align="center" style={{ padding: "8px 0" }}>
                  <Flex vertical style={{ flex: 1, minWidth: 0, marginRight: 8 }}>
                    <Text
                      strong
                      style={{ fontSize: 13, cursor: "pointer" }}
                      onClick={() => openJobDrawer(job)}
                      ellipsis
                    >
                      {job.title}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }} ellipsis>
                      {job.schoolName}
                    </Text>
                  </Flex>
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => toggleSavedJob(job.id)}
                    title="ลบออกจากรายการบันทึก"
                  />
                </Flex>
                {index < savedJobs.length - 1 && <Divider style={{ margin: 0 }} />}
              </div>
            ))}
          </Flex>
        )}
      </Card>

      {/* Safety Tip */}
      <Card
        variant="borderless"
        style={{
          backgroundColor: token.colorBgLayout,
          borderRadius: token.borderRadiusLG,
          border: `1px solid ${token.colorBorderSecondary}`,
        }}
        styles={{ body: { padding: 24 } }}
      >
        <Flex vertical gap={12}>
          <SafetyCertificateOutlined style={{ fontSize: 32, color: token.colorSuccess }} />
          <Text strong style={{ fontSize: 16 }}>ปลอดภัยไว้ก่อน!</Text>
          <Text type="secondary" style={{ fontSize: 13 }}>
            อย่าโอนเงินหรือให้ข้อมูลส่วนตัวที่สำคัญหากพบพิรุธในการรับสมัครงาน
          </Text>
          <Button type="link" style={{ padding: 0 }}>
            อ่านคำแนะนำเพิ่มเติม
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
};

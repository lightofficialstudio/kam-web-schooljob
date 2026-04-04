"use client";

import {
  GlobalOutlined,
  SearchOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Cascader,
  Col,
  Divider,
  Flex,
  Input,
  Layout,
  Row,
  Select,
  Slider,
  Typography,
  theme as antTheme,
} from "antd";
import { useJobSearchStore } from "../_state/job-search-store";

const { Text } = Typography;
const { Option } = Select;

const JOB_CATEGORIES = [
  {
    value: "academic",
    label: "การสอน / วิชาการ",
    children: [
      { value: "math", label: "ครูคณิตศาสตร์" },
      { value: "english", label: "ครูภาษาอังกฤษ" },
      { value: "thai", label: "ครูภาษาไทย" },
      { value: "science", label: "ครูวิทยาศาสตร์" },
      { value: "early-childhood", label: "ครูปฐมวัย" },
    ],
  },
  {
    value: "support",
    label: "ธุรการ / สนับสนุน",
    children: [
      { value: "admin", label: "ธุรการโรงเรียน" },
      { value: "hr", label: "ฝ่ายบุคคล (HR)" },
      { value: "finance", label: "การเงิน / บัญชี" },
      { value: "it-support", label: "IT Support" },
    ],
  },
  {
    value: "construction",
    label: "งานก่อสร้างสถาปัตยกรรม",
    children: [
      { value: "const-tech", label: "งานช่างก่อสร้าง/อาคาร" },
      { value: "proj-mgmt", label: "งานบริหารโครงการ" },
      { value: "arch", label: "งานสถาปนิก" },
    ],
  },
];

// ส่วนค้นหางานหลัก: keyword, ประเภทงาน, จังหวัด และ filters ขั้นสูง
export const SearchFilterSection = () => {
  const { token } = antTheme.useToken();
  const { filters, setFilters, resetFilters } = useJobSearchStore();

  const [salaryMin, salaryMax] = filters.salaryRange;
  const isSalaryActive = salaryMin > 0 || salaryMax < 100000;

  return (
    <Layout.Header
      style={{
        backgroundColor: token.colorPrimary,
        height: "auto",
        padding: "40px 0",
      }}
    >
      <Row justify="center">
        <Col span={24} style={{ maxWidth: 1200, padding: "0 24px" }}>
          <Card
            styles={{ body: { padding: 32 } }}
            style={{
              borderRadius: token.borderRadiusLG * 2,
              border: `1px solid ${token.colorBorderSecondary}`,
              backgroundColor: token.colorBgContainer,
              boxShadow: token.boxShadowSecondary,
            }}
          >
            <Row gutter={[20, 20]} align="middle">
              {/* Keyword Search */}
              <Col xs={24} lg={8}>
                <Flex vertical gap={8}>
                  <Text strong style={{ fontSize: 13, color: token.colorTextDescription }}>
                    ค้นหางานที่คุณสนใจ
                  </Text>
                  <Input
                    prefix={<SearchOutlined style={{ color: token.colorPrimary }} />}
                    placeholder="ตำแหน่งงาน, วิชาเอก หรือโรงเรียน"
                    value={filters.keyword}
                    onChange={(e) => setFilters({ keyword: e.target.value })}
                    size="large"
                    style={{ height: 52, fontSize: 15 }}
                  />
                </Flex>
              </Col>

              {/* Job Categories */}
              <Col xs={24} lg={9}>
                <Flex vertical gap={8}>
                  <Text strong style={{ fontSize: 13, color: token.colorTextDescription }}>
                    ประเภทงาน
                  </Text>
                  <Cascader
                    options={JOB_CATEGORIES}
                    multiple
                    maxTagCount={1}
                    value={filters.category}
                    onChange={(value) => setFilters({ category: value as string[][] })}
                    placeholder="เลือกตำแหน่งที่สนใจ"
                    style={{ width: "100%" }}
                    size="large"
                    showCheckedStrategy={Cascader.SHOW_CHILD}
                    suffixIcon={<SolutionOutlined style={{ color: token.colorPrimary }} />}
                  />
                </Flex>
              </Col>

              {/* Location */}
              <Col xs={24} lg={7}>
                <Flex vertical gap={8}>
                  <Text strong style={{ fontSize: 13, color: token.colorTextDescription }}>
                    สถานที่
                  </Text>
                  <Select
                    placeholder="ทุกจังหวัด"
                    style={{ width: "100%" }}
                    size="large"
                    value={filters.location}
                    onChange={(value) => setFilters({ location: value })}
                    suffixIcon={<GlobalOutlined style={{ color: token.colorPrimary }} />}
                    allowClear
                  >
                    <Option value="bkk">กรุงเทพมหานคร</Option>
                    <Option value="center">ภาคกลาง</Option>
                    <Option value="north">ภาคเหนือ</Option>
                    <Option value="east">ภาคตะวันออก</Option>
                  </Select>
                </Flex>
              </Col>

              {/* Advanced Filters */}
              <Col span={24}>
                <Divider style={{ margin: "8px 0 16px" }} />
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={24} md={12}>
                    <Select
                      placeholder="ประเภทโรงเรียน"
                      style={{ width: "100%" }}
                      size="large"
                      allowClear
                      value={filters.schoolType}
                      onChange={(value) => setFilters({ schoolType: value })}
                    >
                      <Option value="รัฐบาล">โรงเรียนรัฐบาล</Option>
                      <Option value="เอกชน">โรงเรียนเอกชน</Option>
                      <Option value="นานาชาติ">โรงเรียนนานาชาติ</Option>
                      <Option value="สาธิต">โรงเรียนสาธิต</Option>
                    </Select>
                  </Col>
                  <Col xs={24} md={12}>
                    <Select
                      placeholder="ใบประกอบวิชาชีพ"
                      style={{ width: "100%" }}
                      size="large"
                      allowClear
                      value={filters.license}
                      onChange={(value) => setFilters({ license: value })}
                    >
                      <Option value="required">ต้องมีใบประกอบฯ</Option>
                      <Option value="not-required">ไม่ต้องมีใบประกอบฯ</Option>
                      <Option value="pending">อยู่ระหว่างขอรับใบประกอบฯ</Option>
                    </Select>
                  </Col>
                </Row>
              </Col>

              {/* Advanced Filters — แถวที่ 2: Salary Slider + Reset */}
              <Col span={24}>
                <Row gutter={[16, 8]} align="middle">
                  <Col xs={24} md={18}>
                    <Flex vertical gap={4}>
                      <Text style={{ fontSize: 13, color: token.colorTextDescription }}>
                        ช่วงเงินเดือน (บาท)
                        {isSalaryActive && (
                          <Text strong style={{ marginLeft: 8, color: token.colorPrimary }}>
                            ฿{salaryMin.toLocaleString()} — ฿{salaryMax.toLocaleString()}
                          </Text>
                        )}
                      </Text>
                      <Slider
                        range
                        min={0}
                        max={100000}
                        step={5000}
                        value={filters.salaryRange}
                        onChange={(value) =>
                          setFilters({ salaryRange: value as [number, number] })
                        }
                        tooltip={{
                          formatter: (v) => `฿${v?.toLocaleString()}`,
                        }}
                        marks={{
                          0: "0",
                          25000: "25K",
                          50000: "50K",
                          75000: "75K",
                          100000: "100K+",
                        }}
                      />
                    </Flex>
                  </Col>
                  <Col xs={24} md={6} style={{ textAlign: "right" }}>
                    <Button
                      type="link"
                      onClick={resetFilters}
                      style={{ color: token.colorTextDescription, fontSize: 14 }}
                    >
                      รีเซ็ตเงื่อนไขทั้งหมด
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Layout.Header>
  );
};

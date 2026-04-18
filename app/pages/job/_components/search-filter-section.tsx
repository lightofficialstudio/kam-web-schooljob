"use client";

import {
  BankOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  FileProtectOutlined,
  FilterOutlined,
  GlobalOutlined,
  ReloadOutlined,
  SearchOutlined,
  SolutionOutlined,
  TeamOutlined,
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
  Tag,
  Typography,
  theme as antTheme,
} from "antd";
import { useEffect, useState } from "react";
import { useJobSearchStore } from "../_state/job-search-store";

const { Text } = Typography;
const { Option } = Select;

// ✨ ตัวเลือก static ที่ไม่ขึ้นกับ DB
const EMPLOYMENT_TYPE_OPTIONS = [
  { value: "fulltime", label: "Full-time (เต็มเวลา)" },
  { value: "parttime", label: "Part-time (นอกเวลา)" },
  { value: "contract", label: "สัญญาจ้าง" },
  { value: "temporary", label: "ชั่วคราว" },
  { value: "volunteer", label: "อาสาสมัคร" },
];

const LICENSE_OPTIONS = [
  { value: "required", label: "ต้องมีใบประกอบวิชาชีพ" },
  { value: "not-required", label: "ไม่ต้องมีใบประกอบวิชาชีพ" },
  { value: "pending", label: "อยู่ระหว่างขอรับใบประกอบฯ" },
];

const POSTED_AT_OPTIONS = [
  { value: "today", label: "วันนี้" },
  { value: "3days", label: "3 วันที่ผ่านมา" },
  { value: "7days", label: "7 วันที่ผ่านมา" },
  { value: "30days", label: "30 วันที่ผ่านมา" },
];

const GRADE_LEVEL_OPTIONS = [
  { value: "อนุบาล", label: "อนุบาล" },
  { value: "ประถมศึกษา", label: "ประถมศึกษา" },
  { value: "มัธยมศึกษาตอนต้น", label: "มัธยมศึกษาตอนต้น (ม.1–3)" },
  { value: "มัธยมศึกษาตอนปลาย", label: "มัธยมศึกษาตอนปลาย (ม.4–6)" },
  { value: "อาชีวศึกษา", label: "อาชีวศึกษา (ปวช./ปวส.)" },
];

// ✨ ส่วนค้นหางานหลัก — ดึง options จาก DB/GitHub ทั้งหมด ไม่มี hardcode
export const SearchFilterSection = () => {
  const { token } = antTheme.useToken();
  const {
    filters,
    setFilters,
    resetFilters,
    jobCategories,
    geoOptions,
    schoolTypeOptions,
    isLoadingCategories,
    isLoadingGeo,
    fetchOptions,
  } = useJobSearchStore();

  const [showAdvanced, setShowAdvanced] = useState(false);

  const [salaryMin, salaryMax] = filters.salaryRange;
  const isSalaryActive = salaryMin > 0 || salaryMax < 100000;

  // ✨ นับจำนวน active filters ขั้นสูง
  const advancedActiveCount = [
    filters.schoolType,
    filters.license,
    filters.employmentType,
    filters.gradeLevel,
    filters.postedAt,
    isSalaryActive ? "active" : null,
  ].filter(Boolean).length;

  // ✨ โหลด options ครั้งเดียวตอน mount
  useEffect(() => {
    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            {/* ── แถวค้นหาหลัก ── */}
            <Row gutter={[20, 20]} align="middle">
              {/* Keyword */}
              <Col xs={24} lg={8}>
                <Flex vertical gap={8}>
                  <Text
                    strong
                    style={{ fontSize: 13, color: token.colorTextDescription }}
                  >
                    ค้นหางานที่คุณสนใจ
                  </Text>
                  <Input
                    prefix={
                      <SearchOutlined style={{ color: token.colorPrimary }} />
                    }
                    placeholder="ตำแหน่งงาน, วิชาเอก หรือโรงเรียน"
                    value={filters.keyword}
                    onChange={(e) => setFilters({ keyword: e.target.value })}
                    size="large"
                    style={{ height: 52, fontSize: 15 }}
                    allowClear
                  />
                </Flex>
              </Col>

              {/* Job Categories — โหลดจาก DB (ConfigOption group=job_category) */}
              <Col xs={24} lg={9}>
                <Flex vertical gap={8}>
                  <Text
                    strong
                    style={{ fontSize: 13, color: token.colorTextDescription }}
                  >
                    ประเภทงาน / วิชาเอก
                  </Text>
                  <Cascader
                    options={jobCategories}
                    loading={isLoadingCategories}
                    multiple
                    maxTagCount={1}
                    value={filters.category}
                    onChange={(value) =>
                      setFilters({ category: value as string[][] })
                    }
                    placeholder={
                      isLoadingCategories
                        ? "กำลังโหลด..."
                        : "เลือกตำแหน่งที่สนใจ"
                    }
                    style={{ width: "100%" }}
                    size="large"
                    showCheckedStrategy={Cascader.SHOW_CHILD}
                    showSearch
                    suffixIcon={
                      <SolutionOutlined style={{ color: token.colorPrimary }} />
                    }
                  />
                </Flex>
              </Col>

              {/* Location — โหลดจากหวัด/เขต GitHub API */}
              <Col xs={24} lg={7}>
                <Flex vertical gap={8}>
                  <Text
                    strong
                    style={{ fontSize: 13, color: token.colorTextDescription }}
                  >
                    สถานที่
                  </Text>
                  <Cascader
                    options={geoOptions}
                    loading={isLoadingGeo}
                    showSearch
                    placeholder={
                      isLoadingGeo ? "กำลังโหลด..." : "เลือกจังหวัด / เขต"
                    }
                    style={{ width: "100%" }}
                    size="large"
                    value={filters.location ? [filters.location] : undefined}
                    onChange={(value) =>
                      setFilters({
                        location: value
                          ? (value[value.length - 1] as string)
                          : null,
                      })
                    }
                    expandTrigger="hover"
                    suffixIcon={
                      <GlobalOutlined style={{ color: token.colorPrimary }} />
                    }
                    allowClear
                  />
                </Flex>
              </Col>
            </Row>

            <Divider style={{ margin: "20px 0 16px" }} />

            {/* ── ปุ่มเปิด Advanced + badge ── */}
            <Flex justify="space-between" align="center">
              <Flex gap={8} align="center">
                <Button
                  type={showAdvanced ? "primary" : "default"}
                  ghost={showAdvanced}
                  icon={<FilterOutlined />}
                  onClick={() => setShowAdvanced((v) => !v)}
                  size="middle"
                  style={{ borderRadius: token.borderRadius }}
                >
                  ตัวกรองขั้นสูง
                  {advancedActiveCount > 0 && (
                    <Tag
                      color={token.colorPrimary}
                      style={{
                        marginLeft: 6,
                        borderRadius: 99,
                        fontSize: 11,
                        padding: "0 6px",
                        lineHeight: "18px",
                        height: 18,
                      }}
                    >
                      {advancedActiveCount}
                    </Tag>
                  )}
                </Button>
                {(advancedActiveCount > 0 ||
                  filters.keyword ||
                  filters.category.length > 0 ||
                  filters.location) && (
                  <Button
                    type="text"
                    icon={<ReloadOutlined />}
                    onClick={resetFilters}
                    size="middle"
                    style={{ color: token.colorTextDescription }}
                  >
                    รีเซ็ตทั้งหมด
                  </Button>
                )}
              </Flex>

              {/* Active filter tags */}
              <Flex
                gap={6}
                wrap="wrap"
                justify="flex-end"
                style={{ flex: 1, marginLeft: 12 }}
              >
                {filters.location && (
                  <Tag
                    closable
                    onClose={() => setFilters({ location: null })}
                    color="blue"
                    icon={<GlobalOutlined />}
                  >
                    {filters.location}
                  </Tag>
                )}
                {filters.schoolType && (
                  <Tag
                    closable
                    onClose={() => setFilters({ schoolType: null })}
                    color="cyan"
                    icon={<BankOutlined />}
                  >
                    {schoolTypeOptions.find(
                      (o) => o.value === filters.schoolType,
                    )?.label ?? filters.schoolType}
                  </Tag>
                )}
                {filters.license && (
                  <Tag
                    closable
                    onClose={() => setFilters({ license: null })}
                    color="gold"
                    icon={<FileProtectOutlined />}
                  >
                    {
                      LICENSE_OPTIONS.find((o) => o.value === filters.license)
                        ?.label
                    }
                  </Tag>
                )}
                {filters.employmentType && (
                  <Tag
                    closable
                    onClose={() => setFilters({ employmentType: null })}
                    color="green"
                    icon={<TeamOutlined />}
                  >
                    {
                      EMPLOYMENT_TYPE_OPTIONS.find(
                        (o) => o.value === filters.employmentType,
                      )?.label
                    }
                  </Tag>
                )}
                {filters.gradeLevel && (
                  <Tag
                    closable
                    onClose={() => setFilters({ gradeLevel: null })}
                    color="purple"
                    icon={<SolutionOutlined />}
                  >
                    {filters.gradeLevel}
                  </Tag>
                )}
                {filters.postedAt && (
                  <Tag
                    closable
                    onClose={() => setFilters({ postedAt: null })}
                    color="orange"
                    icon={<ClockCircleOutlined />}
                  >
                    {
                      POSTED_AT_OPTIONS.find(
                        (o) => o.value === filters.postedAt,
                      )?.label
                    }
                  </Tag>
                )}
              </Flex>
            </Flex>

            {/* ── Advanced Filters (แสดงเมื่อ showAdvanced) ── */}
            {showAdvanced && (
              <>
                <Divider style={{ margin: "16px 0" }} />
                <Row gutter={[16, 16]}>
                  {/* ประเภทโรงเรียน — โหลดจาก DB (ConfigOption group=school_type) */}
                  <Col xs={24} sm={12} md={8}>
                    <Flex vertical gap={6}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: token.colorTextDescription,
                        }}
                      >
                        <BankOutlined style={{ marginRight: 6 }} />
                        ประเภทโรงเรียน
                      </Text>
                      <Select
                        placeholder="ทุกประเภท"
                        style={{ width: "100%" }}
                        size="large"
                        allowClear
                        loading={isLoadingCategories}
                        value={filters.schoolType}
                        onChange={(value) =>
                          setFilters({ schoolType: value ?? null })
                        }
                        options={schoolTypeOptions}
                      />
                    </Flex>
                  </Col>

                  {/* ใบประกอบวิชาชีพ */}
                  <Col xs={24} sm={12} md={8}>
                    <Flex vertical gap={6}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: token.colorTextDescription,
                        }}
                      >
                        <FileProtectOutlined style={{ marginRight: 6 }} />
                        ใบประกอบวิชาชีพ
                      </Text>
                      <Select
                        placeholder="ทุกเงื่อนไข"
                        style={{ width: "100%" }}
                        size="large"
                        allowClear
                        value={filters.license}
                        onChange={(value) =>
                          setFilters({ license: value ?? null })
                        }
                      >
                        {LICENSE_OPTIONS.map((o) => (
                          <Option key={o.value} value={o.value}>
                            {o.label}
                          </Option>
                        ))}
                      </Select>
                    </Flex>
                  </Col>

                  {/* รูปแบบการจ้างงาน */}
                  <Col xs={24} sm={12} md={8}>
                    <Flex vertical gap={6}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: token.colorTextDescription,
                        }}
                      >
                        <TeamOutlined style={{ marginRight: 6 }} />
                        รูปแบบการจ้างงาน
                      </Text>
                      <Select
                        placeholder="ทุกรูปแบบ"
                        style={{ width: "100%" }}
                        size="large"
                        allowClear
                        value={filters.employmentType}
                        onChange={(value) =>
                          setFilters({ employmentType: value ?? null })
                        }
                      >
                        {EMPLOYMENT_TYPE_OPTIONS.map((o) => (
                          <Option key={o.value} value={o.value}>
                            {o.label}
                          </Option>
                        ))}
                      </Select>
                    </Flex>
                  </Col>

                  {/* ระดับชั้นที่สอน */}
                  <Col xs={24} sm={12} md={8}>
                    <Flex vertical gap={6}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: token.colorTextDescription,
                        }}
                      >
                        <SolutionOutlined style={{ marginRight: 6 }} />{" "}
                        ระดับชั้นที่สอน
                      </Text>
                      <Select
                        placeholder="ทุกระดับ"
                        style={{ width: "100%" }}
                        size="large"
                        allowClear
                        value={filters.gradeLevel}
                        onChange={(value) =>
                          setFilters({ gradeLevel: value ?? null })
                        }
                      >
                        {GRADE_LEVEL_OPTIONS.map((o) => (
                          <Option key={o.value} value={o.value}>
                            {o.label}
                          </Option>
                        ))}
                      </Select>
                    </Flex>
                  </Col>

                  {/* ประกาศเมื่อ */}
                  <Col xs={24} sm={12} md={8}>
                    <Flex vertical gap={6}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: token.colorTextDescription,
                        }}
                      >
                        <ClockCircleOutlined style={{ marginRight: 6 }} />
                        ประกาศเมื่อ
                      </Text>
                      <Select
                        placeholder="ทุกช่วงเวลา"
                        style={{ width: "100%" }}
                        size="large"
                        allowClear
                        value={filters.postedAt}
                        onChange={(value) =>
                          setFilters({ postedAt: value ?? null })
                        }
                      >
                        {POSTED_AT_OPTIONS.map((o) => (
                          <Option key={o.value} value={o.value}>
                            {o.label}
                          </Option>
                        ))}
                      </Select>
                    </Flex>
                  </Col>

                  {/* วันเริ่มงาน placeholder (ขยายได้) */}
                  <Col xs={24} sm={12} md={8}>
                    <Flex vertical gap={6}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: token.colorTextDescription,
                        }}
                      >
                        <CalendarOutlined style={{ marginRight: 6 }} />
                        เปิดรับสมัครถึง
                      </Text>
                      <Select
                        placeholder="ทุกช่วง"
                        style={{ width: "100%" }}
                        size="large"
                        allowClear
                        disabled
                      >
                        <Option value="open">ยังเปิดรับ</Option>
                      </Select>
                    </Flex>
                  </Col>
                </Row>

                {/* Salary Slider */}
                <Row gutter={[16, 8]} style={{ marginTop: 20 }} align="middle">
                  <Col span={24}>
                    <Flex vertical gap={4}>
                      <Text
                        style={{
                          fontSize: 12,
                          color: token.colorTextDescription,
                        }}
                      >
                        <span style={{ marginRight: 6 }}>฿</span> ช่วงเงินเดือน
                        (บาท)
                        {isSalaryActive && (
                          <Text
                            strong
                            style={{ marginLeft: 8, color: token.colorPrimary }}
                          >
                            ฿{salaryMin.toLocaleString()} — ฿
                            {salaryMax.toLocaleString()}
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
                </Row>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </Layout.Header>
  );
};

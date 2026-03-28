"use client";

import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Empty, Tag } from "antd";
import React, { ReactNode } from "react";

interface ProfileSection {
  id: string;
  title: string;
  icon: ReactNode;
  isCompleted?: boolean;
  itemCount?: number;
}

interface ProfileLayoutProps {
  sections: ProfileSection[];
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
  content?: ReactNode;
  onAddItem?: () => void;
  items?: any[];
  onEditItem?: (index: number) => void;
  onDeleteItem?: (index: number) => void;
  renderItem?: (item: any, index: number) => ReactNode;
}

export const ProfileLayout: React.FC<ProfileLayoutProps> = ({
  sections,
  activeSection,
  onSectionClick,
  content,
  onAddItem,
  items = [],
  onEditItem,
  onDeleteItem,
  renderItem,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ข้อมูลประวัติส่วนตัว
          </h1>
          <p className="text-gray-600">จัดการข้อมูลประวัติของคุณ</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-3">
            <Card className="shadow-sm sticky top-6">
              <div className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => onSectionClick(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
                      activeSection === section.id
                        ? "bg-[#11b6f5]/10 border-[#11b6f5]/30 text-[#11b6f5] font-medium"
                        : "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{section.icon}</span>
                      <span className="text-sm">{section.title}</span>
                    </div>
                    {section.isCompleted && (
                      <Tag color="green" className="text-xs">
                        ✓
                      </Tag>
                    )}
                    {section.itemCount !== undefined &&
                      section.itemCount > 0 && (
                        <Tag color="#11b6f5" className="text-xs">
                          {section.itemCount}
                        </Tag>
                      )}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="col-span-9">
            {content ? (
              <Card className="shadow-sm">{content}</Card>
            ) : (
              <Card className="shadow-sm">
                {items && items.length > 0 ? (
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 hover:border-[#11b6f5]/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {renderItem ? (
                              renderItem(item, index)
                            ) : (
                              <div className="text-gray-700">
                                {JSON.stringify(item)}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 ml-4">
                            {onEditItem && (
                              <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => onEditItem(index)}
                                className="text-[#11b6f5] hover:text-[#0ea5e0]"
                              />
                            )}
                            {onDeleteItem && (
                              <Button
                                type="text"
                                size="small"
                                icon={<DeleteOutlined />}
                                onClick={() => onDeleteItem(index)}
                                className="text-red-600 hover:text-red-800"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {onAddItem && (
                      <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        block
                        onClick={onAddItem}
                        className="mt-4"
                      >
                        เพิ่มรายการ
                      </Button>
                    )}
                  </div>
                ) : (
                  <Empty
                    description="ยังไม่มีข้อมูล"
                    style={{ marginTop: 48, marginBottom: 48 }}
                  >
                    {onAddItem && (
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={onAddItem}
                      >
                        เพิ่มรายการแรก
                      </Button>
                    )}
                  </Empty>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

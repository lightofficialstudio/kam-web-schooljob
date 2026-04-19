#!/usr/bin/env node
/**
 * 🎨 Ant Design Docs MCP Server
 * ดึงข้อมูล Ant Design documentation ล่าสุดให้ AI ใช้งาน
 * ป้องกันการใช้ component ที่ deprecated แล้ว
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const ANTD_BASE_URL = "https://ant.design";

// ✨ Helper: ดึง HTML จาก URL และแปลงเป็น plain text
async function fetchPageText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; MCP-AntDesignBot/1.0; +https://ant.design)",
      Accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} จาก ${url}`);
  }

  const html = await res.text();

  // 🔧 ลบ tag HTML ออก เหลือแค่ text (simple regex approach)
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s{3,}/g, "\n\n")
    .trim();
}

// ✨ สร้าง MCP Server instance
const server = new McpServer({
  name: "antd-docs",
  version: "1.0.0",
});

// ─────────────────────────────────────────────
// 📋 Tool 1: antd_overview
// ดึงรายการ component ทั้งหมดจาก overview page
// ─────────────────────────────────────────────
server.tool(
  "antd_overview",
  "ดึงรายการ Ant Design components ทั้งหมดจาก overview page " +
    "(https://ant.design/components/overview) " +
    "ใช้ก่อนทุกครั้งที่จะใช้ component เพื่อตรวจสอบว่า component นั้นยังมีอยู่และไม่ deprecated",
  {},
  async () => {
    try {
      const text = await fetchPageText(`${ANTD_BASE_URL}/components/overview`);
      return {
        content: [
          {
            type: "text",
            text:
              `# Ant Design Components Overview\nSource: ${ANTD_BASE_URL}/components/overview\n\n` +
              text.slice(0, 20000), // จำกัด token ไม่ให้เกิน
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `เกิดข้อผิดพลาด: ${err instanceof Error ? err.message : String(err)}`,
          },
        ],
        isError: true,
      };
    }
  },
);

// ─────────────────────────────────────────────
// 📋 Tool 2: antd_component_docs
// ดึง docs ของ component เฉพาะตัว
// ─────────────────────────────────────────────
server.tool(
  "antd_component_docs",
  "ดึงเอกสาร API และตัวอย่างการใช้งาน Ant Design component เฉพาะตัว " +
    "เช่น antd_component_docs({ component: 'button' }) " +
    "ใช้เมื่อต้องการทราบ props, API, และ deprecated fields ของ component นั้น",
  {
    component: z
      .string()
      .toLowerCase()
      .describe(
        "ชื่อ component เป็น kebab-case เช่น 'button', 'date-picker', 'select', 'table'",
      ),
  },
  async ({ component }) => {
    const url = `${ANTD_BASE_URL}/components/${component}`;
    try {
      const text = await fetchPageText(url);
      return {
        content: [
          {
            type: "text",
            text:
              `# Ant Design — ${component}\nSource: ${url}\n\n` +
              text.slice(0, 25000),
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `ไม่พบ component "${component}" หรือเกิดข้อผิดพลาด: ${err instanceof Error ? err.message : String(err)}\nลองตรวจสอบชื่อ component ที่ ${ANTD_BASE_URL}/components/overview`,
          },
        ],
        isError: true,
      };
    }
  },
);

// ─────────────────────────────────────────────
// 📋 Tool 3: antd_changelog
// ดึง CHANGELOG เพื่อตรวจสอบ breaking changes / deprecated
// ─────────────────────────────────────────────
server.tool(
  "antd_changelog",
  "ดึง Ant Design CHANGELOG เพื่อตรวจสอบ breaking changes, deprecated APIs, " +
    "และการเปลี่ยนแปลงล่าสุด — ใช้เมื่อไม่แน่ใจว่า API ยังใช้ได้อยู่หรือเปล่า",
  {},
  async () => {
    try {
      const text = await fetchPageText(`${ANTD_BASE_URL}/changelog`);
      return {
        content: [
          {
            type: "text",
            text:
              `# Ant Design Changelog\nSource: ${ANTD_BASE_URL}/changelog\n\n` +
              text.slice(0, 20000),
          },
        ],
      };
    } catch (err) {
      return {
        content: [
          {
            type: "text",
            text: `เกิดข้อผิดพลาด: ${err instanceof Error ? err.message : String(err)}`,
          },
        ],
        isError: true,
      };
    }
  },
);

// 🚀 Start server via stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);

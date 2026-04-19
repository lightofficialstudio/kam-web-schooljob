import { NextRequest, NextResponse } from "next/server";

// ✨ paths ที่ไม่ต้อง intercept ไม่ว่า maintenance จะเปิดหรือปิด
const BYPASS_PATHS = [
  "/maintenance",
  "/api/v1/system/maintenance",
  "/api/v1/admin/site-settings",
  "/pages/signin",
  "/pages/admin",
  "/_next",
  "/favicon",
  "/robots",
  "/sitemap",
];

function isBypassed(pathname: string): boolean {
  return BYPASS_PATHS.some((p) => pathname.startsWith(p));
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✨ ข้าม paths ที่ระบุ (admin, signin, API system, static files)
  if (isBypassed(pathname)) {
    return NextResponse.next();
  }

  try {
    // ✨ เรียก maintenance API ภายใน (absolute URL ที่ point กลับมาที่ server เดียวกัน)
    const baseUrl = request.nextUrl.origin;
    const res = await fetch(`${baseUrl}/api/v1/system/maintenance`, {
      // ✨ revalidate ทุก 10 วินาที — ลด latency, ไม่ hit DB ทุก request
      next: { revalidate: 10 },
    });

    if (res.ok) {
      const json = await res.json();
      if (json?.data?.isMaintenanceMode === true) {
        // ✨ redirect ไปหน้า maintenance (preserve origin เพื่อ back ได้)
        const url = request.nextUrl.clone();
        url.pathname = "/maintenance";
        return NextResponse.redirect(url);
      }
    }
  } catch {
    // ✨ ถ้า fetch ล้มเหลว (cold start, DB ไม่พร้อม) → ปล่อยผ่านได้
  }

  return NextResponse.next();
}

export const config = {
  // ✨ match ทุก path ยกเว้น _next/static, _next/image, favicon
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

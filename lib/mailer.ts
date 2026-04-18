import nodemailer from "nodemailer";

// ✨ สร้าง nodemailer transporter จาก env (server-side เท่านั้น)
const transporter = nodemailer.createTransport({
  host: process.env.NEXT_PUBLIC_MAILER_HOST,
  port: Number(process.env.NEXT_PUBLIC_MAILER_PORT ?? 587),
  secure: process.env.NEXT_PUBLIC_MAILER_SECURE === "true",
  auth: {
    user: process.env.NEXT_PUBLIC_MAILER_USER,
    pass: process.env.NEXT_PUBLIC_MAILER_PASS,
  },
});

export interface SendInviteEmailParams {
  toEmail: string;
  schoolName: string;
  inviterName: string;
  roleName: string;
  inviteToken: string;
  expiresAt: Date;
}

// ✨ ส่งอีเมลเชิญสมาชิกเข้าร่วมองค์กร
export const sendInviteEmail = async ({
  toEmail,
  schoolName,
  inviterName,
  roleName,
  inviteToken,
  expiresAt,
}: SendInviteEmailParams) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const acceptUrl = `${appUrl}/pages/employer/delegated-access?token=${inviteToken}`;

  const expireText = expiresAt.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  await transporter.sendMail({
    from: `"SchoolJob" <${process.env.NEXT_PUBLIC_MAILER_USER}>`,
    to: toEmail,
    subject: `คำเชิญเข้าร่วม ${schoolName} บน SchoolJob`,
    html: `
<!DOCTYPE html>
<html lang="th" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>คำเชิญเข้าร่วมทีม — SchoolJob</title>
</head>
<body style="margin:0;padding:0;background:#0F172A;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

  <!-- Preheader -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    ${inviterName} ได้เชิญคุณเข้าร่วม ${schoolName} ในฐานะ ${roleName} · SchoolJob
  </div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0F172A;min-height:100vh;">
    <tr>
      <td align="center" valign="top" style="padding:48px 16px;">

        <!-- Card -->
        <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">

          <!-- ─── Top Brand Bar ─── -->
          <tr>
            <td style="background:#11b6f5;height:4px;border-radius:4px 4px 0 0;"></td>
          </tr>

          <!-- ─── Header ─── -->
          <tr>
            <td style="background:#1E293B;padding:40px 48px 36px;border-left:1px solid #334155;border-right:1px solid #334155;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <!-- Wordmark -->
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background:linear-gradient(135deg,#11b6f5 0%,#0d8fd4 100%);border-radius:10px;width:40px;height:40px;text-align:center;vertical-align:middle;">
                          <span style="color:#ffffff;font-size:20px;font-weight:900;line-height:40px;letter-spacing:-1px;">S</span>
                        </td>
                        <td style="padding-left:12px;vertical-align:middle;">
                          <span style="color:#F8FAFC;font-size:18px;font-weight:700;letter-spacing:-0.3px;">School<span style="color:#11b6f5;">Job</span></span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" valign="middle">
                    <span style="background:#0F172A;color:#94A3B8;font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;padding:5px 12px;border-radius:20px;border:1px solid #334155;">
                      Team Invitation
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ─── Hero Section ─── -->
          <tr>
            <td style="background:linear-gradient(160deg,#0d8fd4 0%,#11b6f5 50%,#5dd5fb 100%);padding:48px 48px 44px;border-left:1px solid #0d8fd4;border-right:1px solid #0d8fd4;position:relative;">

              <!-- Grid overlay (decorative) -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <p style="margin:0 0 8px;color:rgba(255,255,255,0.7);font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">คำเชิญจาก</p>
                    <h1 style="margin:0 0 4px;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.5px;line-height:1.2;">${schoolName}</h1>
                    <p style="margin:0;color:rgba(255,255,255,0.8);font-size:14px;font-weight:400;">เชิญคุณเข้าร่วมเป็นส่วนหนึ่งของทีม</p>

                    <!-- Role Badge -->
                    <table cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;">
                      <tr>
                        <td style="background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.3);border-radius:8px;padding:10px 20px;backdrop-filter:blur(4px);">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="width:8px;height:8px;background:#ffffff;border-radius:50%;vertical-align:middle;"></td>
                              <td style="padding-left:10px;vertical-align:middle;">
                                <span style="color:#ffffff;font-size:13px;font-weight:700;letter-spacing:0.3px;">ตำแหน่ง: ${roleName}</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ─── Body ─── -->
          <tr>
            <td style="background:#1E293B;padding:40px 48px;border-left:1px solid #334155;border-right:1px solid #334155;">

              <p style="margin:0 0 8px;font-size:16px;color:#F8FAFC;font-weight:600;">สวัสดี,</p>
              <p style="margin:0 0 28px;font-size:15px;color:#94A3B8;line-height:1.75;">
                <span style="color:#CBD5E1;font-weight:600;">${inviterName}</span>
                ได้เชิญคุณเข้าร่วมองค์กร
                <span style="color:#CBD5E1;font-weight:600;">${schoolName}</span>
                บนแพลตฟอร์ม SchoolJob เพื่อจัดการประกาศงานและทีมงานร่วมกัน
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <a href="${acceptUrl}"
                      style="display:inline-block;background:linear-gradient(135deg,#11b6f5 0%,#0d8fd4 100%);color:#ffffff;text-decoration:none;padding:16px 44px;border-radius:12px;font-size:15px;font-weight:700;letter-spacing:0.3px;box-shadow:0 8px 24px rgba(17,182,245,0.35);">
                      ยอมรับคำเชิญ
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                <tr>
                  <td style="height:1px;background:linear-gradient(90deg,transparent,#334155 20%,#334155 80%,transparent);"></td>
                </tr>
              </table>

              <!-- Detail Card -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:#0F172A;border-radius:12px;padding:24px 24px;border:1px solid #334155;">
                    <p style="margin:0 0 16px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#475569;">รายละเอียดคำเชิญ</p>

                    <!-- Row: To -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
                      <tr>
                        <td width="120" style="font-size:12px;color:#475569;font-weight:600;vertical-align:top;padding-top:1px;">ส่งถึง</td>
                        <td style="font-size:13px;color:#CBD5E1;font-weight:500;">${toEmail}</td>
                      </tr>
                    </table>

                    <!-- Row: Role -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
                      <tr>
                        <td width="120" style="font-size:12px;color:#475569;font-weight:600;vertical-align:top;padding-top:1px;">ตำแหน่ง</td>
                        <td style="font-size:13px;color:#11b6f5;font-weight:700;">${roleName}</td>
                      </tr>
                    </table>

                    <!-- Row: Expires -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
                      <tr>
                        <td width="120" style="font-size:12px;color:#475569;font-weight:600;vertical-align:top;padding-top:1px;">หมดอายุ</td>
                        <td style="font-size:13px;color:#CBD5E1;font-weight:500;">${expireText}</td>
                      </tr>
                    </table>

                    <!-- Divider -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px;">
                      <tr><td style="height:1px;background:#1E293B;"></td></tr>
                    </table>

                    <!-- Link fallback -->
                    <p style="margin:0 0 6px;font-size:11px;color:#475569;font-weight:600;letter-spacing:0.5px;">หากปุ่มด้านบนไม่ทำงาน ให้คัดลอกลิงก์นี้:</p>
                    <p style="margin:0;font-size:11px;color:#11b6f5;word-break:break-all;line-height:1.6;">${acceptUrl}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0;font-size:12px;color:#475569;line-height:1.7;">
                หากคุณไม่ต้องการยอมรับคำเชิญนี้ สามารถละเว้นอีเมลฉบับนี้ได้ ลิงก์จะหมดอายุโดยอัตโนมัติ
              </p>
            </td>
          </tr>

          <!-- ─── Footer ─── -->
          <tr>
            <td style="background:#0F172A;padding:24px 48px;border:1px solid #334155;border-top:1px solid #1E293B;border-radius:0 0 12px 12px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:12px;color:#334155;">
                      School<span style="color:#11b6f5;">Job</span>
                      &nbsp;&middot;&nbsp;
                      <span style="color:#1E3A5F;">Thai Education Career Platform</span>
                    </p>
                  </td>
                  <td align="right">
                    <p style="margin:0;font-size:11px;color:#334155;">&copy; 2026 SchoolJob</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
    `,
  });
};

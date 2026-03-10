import { expect, test } from "@playwright/test";

test.describe("Authentication Automated Testing", () => {
  const randomEmail = () =>
    `test-${Math.floor(Math.random() * 100000)}@example.com`;

  test("Employee (Teacher) Signup & Login Flow", async ({ page }) => {
    const email = randomEmail();
    const password = "Password123!";
    const fullName = "Test Employee";

    // 1. Go to Signup Page
    await page.goto("/pages/signup");

    // 2. Select Employee (Teacher) role - Default is already Teacher usually
    await page
      .locator("label")
      .filter({ hasText: "ครูผู้สอน" })
      .click({ force: true });

    // 3. Fill Signup Form
    await page.getByPlaceholder("ชื่อ-นามสกุล").fill(fullName);
    await page.getByPlaceholder("name@domain.com").fill(email);
    await page.getByPlaceholder("••••••••").first().fill(password);
    await page.getByPlaceholder("••••••••").last().fill(password);

    // 4. Submit Signup
    await page
      .getByRole("button", { name: "สมัครสมาชิก", exact: true })
      .click({ force: true });

    // 5. Handle Modal (Success or Error)
    const successHeader = page.locator("h2", { hasText: "สมัครสมาชิกสำเร็จ" });
    const errorHeader = page.locator("h2", { hasText: "เกิดข้อผิดพลาด" });

    await Promise.race([
      successHeader.waitFor({ state: "visible", timeout: 15000 }),
      errorHeader.waitFor({ state: "visible", timeout: 15000 }),
    ]).catch(() => {});

    if (await errorHeader.isVisible()) {
      const errorMsg = await page.locator(".ant-modal-body").innerText();
      throw new Error(`Signup failed with error: ${errorMsg}`);
    }

    await expect(successHeader).toBeVisible({ timeout: 15000 });
    await page.getByRole("button", { name: "ตกลง" }).click();

    // 6. Login
    await page.goto("/pages/signin");
    await page.getByPlaceholder("อีเมล").fill(email);
    await page.getByPlaceholder("รหัสผ่าน").fill(password);
    await page
      .getByRole("button", { name: "เข้าสู่ระบบ", exact: true })
      .click();

    // 7. Handle Login Redirect/Modal
    await expect(page.getByText("เข้าสู่ระบบสำเร็จ")).toBeVisible({
      timeout: 10000,
    });
    await page.getByRole("button", { name: "ตกลง" }).click();

    // 8. Verify Dashboard / Navbar shows name
    // Search in the whole page as the user might be in different places
    await expect(page.getByText(fullName)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("ครูผู้สอน")).toBeVisible();
  });

  test("Employer (School) Signup & Login Flow", async ({ page }) => {
    const email = randomEmail();
    const password = "Password123!";
    const fullName = "Test School Employer";

    // 1. Go to Signup Page
    await page.goto("/pages/signup");

    // 2. Select Employer role
    await page
      .locator("label")
      .filter({ hasText: "สถานศึกษา" })
      .click({ force: true });

    // 3. Fill Signup Form
    await page.getByPlaceholder("ชื่อ-นามสกุล").fill(fullName);
    await page.getByPlaceholder("name@domain.com").fill(email);
    await page.getByPlaceholder("••••••••").first().fill(password);
    await page.getByPlaceholder("••••••••").last().fill(password);

    // 4. Submit Signup
    await page
      .getByRole("button", { name: "สมัครสมาชิก", exact: true })
      .click({ force: true });

    // 5. Handle Modal (Success or Error)
    const employerSuccessHeader = page.locator("h2", {
      hasText: "สมัครสมาชิกสำเร็จ",
    });
    const employerErrorHeader = page.locator("h2", {
      hasText: "เกิดข้อผิดพลาด",
    });

    await Promise.race([
      employerSuccessHeader.waitFor({ state: "visible", timeout: 15000 }),
      employerErrorHeader.waitFor({ state: "visible", timeout: 15000 }),
    ]).catch(() => {});

    if (await employerErrorHeader.isVisible()) {
      const errorMsg = await page.locator(".ant-modal-body").innerText();
      throw new Error(`Employer Signup failed with error: ${errorMsg}`);
    }

    await expect(employerSuccessHeader).toBeVisible({ timeout: 15000 });
    await page.getByRole("button", { name: "ตกลง" }).click();

    // 6. Login
    await page.goto("/pages/signin");
    await page.getByPlaceholder("อีเมล").fill(email);
    await page.getByPlaceholder("รหัสผ่าน").fill(password);
    await page
      .getByRole("button", { name: "เข้าสู่ระบบ", exact: true })
      .click();

    // 7. Handle Login Redirect/Modal
    await expect(page.getByText("เข้าสู่ระบบสำเร็จ")).toBeVisible({
      timeout: 10000,
    });
    await page.getByRole("button", { name: "ตกลง" }).click();

    // 8. Verify Employer Dashboard Redirect
    await expect(page).toHaveURL(/.*\/employer\/job\/read/, { timeout: 15000 });
    await expect(page.getByText(fullName)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("สถานศึกษา")).toBeVisible();
  });
});

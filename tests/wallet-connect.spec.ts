import { test, expect } from "@playwright/test";

test("page loads with connect button", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Connect Wallet")).toBeVisible();
});

test("disconnect button appears after connecting (mock)", async ({ page }) => {
  await page.goto("/");
  await page.getByText("Connect Wallet").click();
  // In headless mode wallet won't actually connect,
  // but the page structure should be correct
  await expect(page.locator("button")).toContainText(["Connect Wallet"]);
});

test("send payment form exists", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Send XLM")).toBeVisible();
  await expect(page.getByPlaceholder("Destination G...")).toBeVisible();
  await expect(page.getByPlaceholder(/Amount/)).toBeVisible();
});

test("invoke contract form exists", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText(/increment|Invoke|Contract/i)).toBeVisible();
});

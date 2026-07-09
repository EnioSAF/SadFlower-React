import { expect, test } from "@playwright/test";

test.describe("SadFlower visual smoke", () => {
  test("home desktop renders visible first screen", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await expect(page.getByAltText("Overlay Image")).toBeVisible();
    const screenshot = await page.screenshot({
      fullPage: true,
      animations: "disabled",
    });

    expect(screenshot.byteLength).toBeGreaterThan(10_000);
  });
});

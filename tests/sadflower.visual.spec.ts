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
  test("Articles icon renders blog titles returned by Strapi", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("version", "1.0.2");
      localStorage.setItem("hasVisited", "true");
    });
    await page.goto("/");
    await page.getByAltText("Articles.exe").click({ force: true });

    await expect(page.getByText("La Crème")).toBeVisible();
    await expect(page.getByText("DevLog 1 : Project EREM")).toBeVisible();
  });
});

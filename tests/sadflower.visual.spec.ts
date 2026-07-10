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

  test("MyWork icon opens faux browser window", async ({ page }) => {
    await page.goto("/");
    await page.getByAltText("MyWork.exe").click();
    await expect(page.getByText("MyWork.exe", { exact: true }).last()).toBeVisible();
    await expect(page.getByText("WELCOME TO MY WORK")).toBeVisible();
    await page.getByRole("button", { name: /Ask about it/ }).first().click();
    await expect(page.getByText("Quick quote / reservation")).toBeVisible();
  });
});

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

  test("MentionLegal behaves like a physical point-and-click book", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile-chrome", "La scène mobile plein écran sera conçue séparément.");
    await page.addInitScript(() => {
      localStorage.setItem("version", "1.0.2");
      localStorage.setItem("hasVisited", "true");
    });
    await page.goto("/");
    await page.getByAltText("MentionLegal.exe").click();
    await expect(page.getByRole("dialog", { name: "MentionLegal.exe" })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Legal Library/ })).toBeVisible();
    await page.getByRole("button", { name: "Ouvrir le registre" }).click();
    await expect(page.getByRole("heading", { name: "Le registre de bord" })).toBeVisible();
    await page.waitForTimeout(600);
    await page.getByRole("button", { name: "Tourner la page suivante" }).click();
    await expect(page.getByRole("heading", { name: "Sommaire" })).toBeVisible();
    await page.waitForTimeout(600);
    await page.getByRole("button", { name: "Ouvrir RGPD" }).click();
    await expect(page.getByRole("heading", { name: "Vie privée & données personnelles" })).toBeVisible();
    await page.waitForTimeout(800);
    await page.keyboard.press("ArrowLeft");
    await expect(page.getByRole("heading", { name: "Mentions légales" })).toBeVisible();
    await page.waitForTimeout(600);
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("heading", { name: "Vie privée & données personnelles" })).toBeVisible();
    await page.waitForTimeout(600);
    await page.getByRole("button", { name: "Ouvrir CGV" }).click();
    await page.waitForTimeout(1500);
    for (let turn = 0; turn < 3; turn += 1) {
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(600);
    }
    await expect(page.getByRole("button", { name: "Rouvrir le registre" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Fin du registre" })).toBeVisible();
    await page.getByRole("button", { name: "Fermer le livre" }).click();
    await expect(page.getByRole("dialog", { name: "MentionLegal.exe" })).toBeHidden();
  });

  test("MentionLegal preserves the physical sheet during both flip directions", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile-chrome", "La scène mobile plein écran sera conçue séparément.");
    await page.addInitScript(() => {
      localStorage.setItem("version", "1.0.2");
      localStorage.setItem("hasVisited", "true");
    });
    await page.goto("/");
    await page.getByAltText("MentionLegal.exe").click();
    await page.getByRole("button", { name: "Ouvrir le registre" }).click();
    await page.waitForTimeout(600);
    await expect(page.locator(".leaf-front-cover.is-active-turn")).toBeVisible();
    await expect(page.locator(".leaf-front-cover.is-active-turn .leaf-back")).toHaveCSS("visibility", "visible");
    await page.waitForTimeout(700);
    await expect(page.locator(".leaf-front-cover.is-turned .leaf-back .bookplate")).toBeVisible();

    await expect(page.locator(".book-object > .book-close")).toBeVisible();
    await expect(page.locator(".leaf-paper")).toHaveCount(10);
    const sceneBeforeDrag = await page.locator(".mention-book-scene").boundingBox();
    const topBorder = await page.locator(".drag-top").boundingBox();
    if (!sceneBeforeDrag || !topBorder) throw new Error("Le livre ou sa bordure de déplacement est introuvable.");
    await page.mouse.move(topBorder.x + topBorder.width / 2, topBorder.y + topBorder.height / 2);
    await page.mouse.down();
    await page.mouse.move(topBorder.x + topBorder.width / 2 + 35, topBorder.y + topBorder.height / 2 + 20, { steps: 4 });
    await page.mouse.up();
    const sceneAfterDrag = await page.locator(".mention-book-scene").boundingBox();
    if (!sceneAfterDrag) throw new Error("Le livre est introuvable après déplacement.");
    expect(sceneAfterDrag.x - sceneBeforeDrag.x).toBeGreaterThan(25);
    expect(sceneAfterDrag.y - sceneBeforeDrag.y).toBeGreaterThan(10);

    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(100);
    const forwardLeaf = page.locator(".book-leaf.is-active-turn").last();
    await expect(forwardLeaf.locator(".leaf-front")).toHaveCSS("visibility", "visible");
    await expect(forwardLeaf.locator(".leaf-back")).toHaveCSS("visibility", "hidden");
    await page.waitForTimeout(260);
    await expect(forwardLeaf.locator(".leaf-front")).toHaveCSS("visibility", "hidden");
    await expect(forwardLeaf.locator(".leaf-back")).toHaveCSS("visibility", "visible");
    await page.waitForTimeout(300);

    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(100);
    const backwardLeaf = page.locator(".book-leaf.is-active-turn").last();
    await expect(backwardLeaf.locator(".leaf-back")).toHaveCSS("visibility", "visible");
    await expect(backwardLeaf.locator(".leaf-front")).toHaveCSS("visibility", "hidden");
    await expect(backwardLeaf.locator(".leaf-back > :first-child")).toHaveCSS("transform", "none");
    await page.waitForTimeout(260);
    await expect(backwardLeaf.locator(".leaf-back")).toHaveCSS("visibility", "hidden");
    await expect(backwardLeaf.locator(".leaf-front")).toHaveCSS("visibility", "visible");

    await expect(page.locator(".book-toolbar")).toHaveCount(0);
    await expect(page.locator(".book-drag-handle")).toHaveCount(0);
    await expect(page.locator(".page-corner")).toHaveCount(0);
    await expect(page.locator(".book-drag-zone")).toHaveCount(4);
    await expect(page.locator(".bookmark-tab")).toHaveCount(6);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "MentionLegal.exe" })).toBeHidden();
  });

  test("privacy route exposes the same legal document", async ({ page }) => {
    await page.goto("/confidentialite");
    await expect(page.getByRole("heading", { name: "Vie privée & données personnelles" })).toBeVisible();
    await expect(page.getByRole("link", { name: "RGPD", exact: true })).toHaveClass(/active/);
  });
});

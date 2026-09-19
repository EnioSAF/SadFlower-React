import { expect, test } from '@playwright/test';

test('clicking the visible strip opens the pack and leaves three cards face down', async ({ page }) => {
  await page.goto('/demo/booster');
  await expect(page.getByRole('heading', { name: 'BOOSTER SADFLOWER' })).toBeVisible();
  await page.getByRole('button', { name: 'Déchirer le booster' }).click();
  await expect(page.getByText('CARTE 01 / 03')).toBeVisible();
  await expect(page.locator('.booster-demo__card-back')).toHaveCount(3);
  await expect(page.getByRole('button', { name: 'Retourner la carte' })).toBeVisible();
});

test('each card flips before the next one is drawn, then the pack can restart', async ({ page }) => {
  await page.goto('/demo/booster');
  await page.getByRole('button', { name: 'Déchirer le booster' }).click();
  await expect(page.getByRole('button', { name: 'Retourner la carte' })).toBeVisible();
  await page.getByRole('button', { name: 'Retourner la carte' }).click();
  await expect(page.locator('.holo-card')).toBeVisible();
  await page.getByRole('button', { name: 'Carte suivante' }).click();
  await expect(page.getByText('CARTE 02 / 03')).toBeVisible();
  await expect(page.locator('.booster-demo__card-back')).toHaveCount(2);
  await page.getByRole('button', { name: 'Retourner la carte' }).click();
  await page.getByRole('button', { name: 'Carte suivante' }).click();
  await expect(page.getByText('CARTE 03 / 03')).toBeVisible();
  await expect(page.locator('.booster-demo__card-back')).toHaveCount(1);
  await page.getByRole('button', { name: 'Retourner la carte' }).click();
  await page.getByRole('button', { name: 'Voir le tirage' }).click();
  await expect(page.getByText('PACK OUVERT')).toBeVisible();
  await page.getByRole('button', { name: 'Réessayer' }).click();
  await expect(page.getByRole('button', { name: 'Déchirer le booster' })).toBeVisible();
});

test('the tear strip can be dragged with a pointer', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Desktop pointer drag; mobile flow is covered by the keyboard-independent reveal test.');
  await page.goto('/demo/booster');
  const strip = page.getByRole('button', { name: 'Déchirer le booster' });
  const bounds = await strip.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.move(bounds!.x + 12, bounds!.y + bounds!.height / 2);
  await page.mouse.down();
  await page.mouse.move(bounds!.x + bounds!.width - 4, bounds!.y + bounds!.height / 2, { steps: 12 });
  await page.mouse.up();
  await expect(page.getByText('CARTE 01 / 03')).toBeVisible();
});

test('the tear strip responds to touch', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Touch interaction is checked on the mobile project.');
  await page.goto('/demo/booster');
  const bounds = await page.getByRole('button', { name: 'Déchirer le booster' }).boundingBox();
  expect(bounds).not.toBeNull();
  await page.touchscreen.tap(bounds!.x + bounds!.width - 4, bounds!.y + bounds!.height / 2);
  await expect(page.getByText('CARTE 01 / 03')).toBeVisible();
});

test('reduced-motion preference skips the automatic tear animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/demo/booster');
  await page.getByRole('button', { name: 'Déchirer le booster' }).click();
  await expect(page.getByRole('button', { name: 'Retourner la carte' })).toBeVisible({ timeout: 250 });
});

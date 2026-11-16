import {test, expect} from '@playwright/test';
import {measurePair} from '../m101ContrastIndependent.mjs';

const initial = measurePair(35, 86);
const shifted = measurePair(36, 86);

test('landscape, Escape, contrast, and VERIFY values stay consistent', async ({page}) => {
  test.setTimeout(90_000);
  await page.setViewportSize({width: 844, height: 390});
  await page.goto('/#journey=1');
  const stage = page.locator('.light-act .reveal-stage');
  await expect(stage).toHaveAttribute('data-ready', 'true', {timeout: 30_000});
  expect((await stage.boundingBox())!.height).toBeLessThanOrEqual(390);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const finding = page.locator('.light-act .reveal-finding');
  await expect(finding).toContainText(`Central contrast: ${initial.displayed}.`);
  expect((await finding.boundingBox())!.y).toBeLessThan((await page.locator('.light-act .reveal-demonstrations').boundingBox())!.y);

  const summary = page.locator('.observatory-tools > summary');
  await summary.click();
  await expect(page.locator('.observatory-tools')).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(page.locator('.observatory-tools')).not.toHaveAttribute('open', '');
  await expect(summary).toBeFocused();

  await page.getByRole('link', {name: 'What supports this view? ↓', exact: true}).click();
  const verify = page.locator('.light-act .comparison-verify');
  await expect(verify).toHaveAttribute('open', '');
  await expect(verify).toContainText(`Common samples: ${initial.verify45.common} / ${initial.verify45.total}`);
  await expect(verify).toContainText(`${initial.verify45.meanA} MJy/sr`);
  await expect(verify).toContainText(`${initial.verify45.meanB} MJy/sr`);

  await page.getByRole('button', {name: 'Show these measurements', exact: true}).click();
  await expect(verify).toContainText('radius 8 native pixels');
  await expect(verify).toContainText(`Common samples: ${initial.verify8.common} / ${initial.verify8.total}`);
  await expect(verify).toContainText(`${initial.verify8.meanA} MJy/sr`);
  await expect(verify).toContainText(`${initial.verify8.meanB} MJy/sr`);
  await expect(page.getByRole('button', {name: 'Inspect 3I/ATLAS', exact: true})).toBeVisible();
});

test('wavelength changes, keyboard selection, and rapid switching update VERIFY values', async ({page}) => {
  test.setTimeout(90_000);
  await page.goto('/#journey=1');
  const stage = page.locator('.light-act .reveal-stage');
  await expect(stage).toHaveAttribute('data-ready', 'true', {timeout: 30_000});
  await page.getByRole('button', {name: 'Show these measurements', exact: true}).click();
  const verify = page.locator('.light-act .comparison-verify');
  await expect(verify).toContainText(`${initial.verify8.meanA} MJy/sr`);

  const wavelengthA = page.getByLabel('Wavelength A channel');
  await wavelengthA.focus();
  await page.keyboard.press('ArrowDown');
  await expect(stage).toHaveAttribute('data-pair', '36/86');
  await expect(stage).toHaveAttribute('data-ready', 'true');
  await expect(page.locator('.light-act .reveal-finding')).toContainText(`Central contrast: ${shifted.displayed}.`);
  await expect(verify).toContainText(`Common samples: ${shifted.verify8.common} / ${shifted.verify8.total}`);
  await expect(verify).toContainText(`${shifted.verify8.meanA} MJy/sr`);
  await expect(verify).not.toContainText(`${initial.verify8.meanA} MJy/sr`);

  const wavelengthB = page.getByLabel('Wavelength B channel');
  await wavelengthB.focus();
  await page.keyboard.press('ArrowUp');
  await expect(stage).toHaveAttribute('data-pair', '36/85');
  await expect(stage).toHaveAttribute('data-ready', 'true');
  const keyed = measurePair(36, 85);
  await expect(verify).toContainText(`${keyed.verify8.meanB} MJy/sr`);
  await expect(verify).not.toContainText(`${shifted.verify8.meanB} MJy/sr`);

  await wavelengthA.selectOption('1');
  await wavelengthA.selectOption('102');
  await wavelengthA.selectOption('36');
  await expect(stage).toHaveAttribute('data-pair', '36/85');
  await expect(stage).toHaveAttribute('data-ready', 'true');
  const stale102 = measurePair(102, 85);
  const stale1 = measurePair(1, 85);
  await expect(verify).toContainText(`${keyed.verify8.meanA} MJy/sr`);
  await expect(verify).not.toContainText(`${stale102.verify8.meanA} MJy/sr`);
  await expect(verify).not.toContainText(`${stale1.verify8.meanA} MJy/sr`);
});

import {test,expect} from '@playwright/test';
import fs from 'node:fs';
for(const [width,height] of [[1440,900],[1280,800],[390,844],[375,667]]){
 test(`first impression is real, readable and one action at ${width}x${height}`,async({page},info)=>{
  await page.setViewportSize({width,height});await page.goto('/');
  await expect(page.getByRole('heading',{name:'The universe leaves evidence.',exact:true})).toBeVisible();await expect(page.locator('.hero-copy .eyebrow')).toContainText('NASA/IPAC IRSA');
  const begin=page.getByRole('button',{name:'Begin exploring',exact:true});await expect(begin).toBeVisible();
  const b=(await begin.boundingBox())!;expect(b.x).toBeGreaterThanOrEqual(0);expect(b.x+b.width).toBeLessThanOrEqual(width);expect(b.y+b.height).toBeLessThanOrEqual(height);
  const img=page.locator('.hero-observation img');await expect(img).toBeVisible();await expect(img).toHaveJSProperty('naturalWidth',267);await expect(img).toHaveJSProperty('naturalHeight',267);
  expect(await page.locator('.hero-description').evaluate(e=>parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(16);
  await page.screenshot({path:info.outputPath('HOME.png')});await begin.focus();expect(await begin.evaluate(e=>parseFloat(getComputedStyle(e).outlineWidth))).toBeGreaterThanOrEqual(2);await begin.press('Enter');
  await expect(page.locator('.light-act .reveal-stage')).toHaveAttribute('data-ready','true');await expect(page.getByRole('heading',{name:'One galaxy. Different light.',exact:true})).toBeVisible();
  await expect(page.locator('.light-act')).toContainText('wavelength');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const divider=page.getByRole('slider',{name:'Spectral Reveal divider'});await divider.focus();const old=await divider.getAttribute('aria-valuenow');await divider.press('ArrowRight');expect(await divider.getAttribute('aria-valuenow')).not.toBe(old);await page.screenshot({path:info.outputPath('SEE.png')});
 });
 test(`evidence reveal and actual Passport preserve identity at ${width}x${height}`,async({page},info)=>{
  await page.setViewportSize({width,height});await page.goto('/#journey=3');const canvas=page.locator('.atlas-act canvas');await expect(canvas).toBeVisible();await canvas.focus();await canvas.press('ArrowRight');
  await expect(page.locator('.inspection-receipt')).toContainText('Native pixel');await expect(page.locator('.inspection-receipt')).toContainText('Flags');
  await page.getByRole('button',{name:/Passport$/}).click();await expect(page.locator('.passport-sheet')).toBeVisible();await expect(page.locator('.passport-sheet')).toContainText('Not validated');
  const event=page.waitForEvent('download');await page.getByRole('button',{name:/Download actual evidence Passport/}).click();const download=await event;const stream=await download.createReadStream();const chunks:Buffer[]=[];for await(const c of stream!)chunks.push(Buffer.from(c));const p=JSON.parse(Buffer.concat(chunks).toString());
  expect(p.inspection.observationId).toBe(p.observation.id);expect(p.inspection.pixel).not.toBeNull();expect(p.measurementValidated).toBe(false);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await page.screenshot({path:info.outputPath('PASSPORT.png')});
 });
}
test('curated target links remain purposeful and motion/source disclosures stay honest',async({page})=>{await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await expect(page.getByRole('link',{name:/R Draconis/})).toHaveAttribute('href','#investigation-find');await expect(page.getByRole('link',{name:/3I\/ATLAS/})).toHaveAttribute('href','#journey=2');await page.locator('.observatory-tools > summary').click();await expect(page.locator('.observatory-tools')).toContainText('DOI unresolved');await expect(page.locator('.observatory-tools')).toContainText('AI-assisted');expect(await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true)});

test('wavelength evidence keeps the actual selected channels and context',async({page})=>{await page.goto('/#journey=1');await expect(page.locator('.reveal-stage')).toHaveAttribute('data-ready','true');await page.getByLabel('Wavelength A channel').selectOption('102');await expect(page.locator('.reveal-stage')).toHaveAttribute('data-pair','102/86');await page.getByRole('link',{name:'What supports this view? ↓',exact:true}).click();await expect(page.locator('.comparison-verify')).toHaveAttribute('open','');await expect(page.locator('.comparison-verify')).toContainText('A: CH 102');expect(new URL(page.url()).hash).toBe('#journey=1')});

import {test,expect} from '@playwright/test';
import fs from 'node:fs';
const manifest=JSON.parse(fs.readFileSync(new URL('../../public/investigations/atlas-v1/manifest.json',import.meta.url),'utf8'));
for(const [width,height]of[[1440,900],[1280,800],[390,844],[375,667]])test(`external finding preserves actual exposure and inspection at ${width}x${height}`,async({page,context})=>{
 await page.setViewportSize({width,height});await page.goto('/#journey=2');const group=page.getByRole('group',{name:'Journey archived exposures'});await group.getByRole('button').first().click();const canvas=page.locator('.atlas-act canvas');await expect(canvas).toBeVisible();await canvas.focus();await canvas.press('ArrowRight');
 const link=page.locator('.atlas-act .atlas-view-notes > a');const source=manifest.claims.find((c:any)=>c.id==='activity').source;
 await expect(link).toHaveAttribute('href',source);await expect(link).toHaveAttribute('target','_blank');await expect(link).toHaveAttribute('rel',/noopener/);await expect(link).toContainText('opens a new tab');
 // Intercept only the external reference request. This verifies navigation/state,
 // not NASA website availability; original science assets load normally.
 let requested='';await context.route(source,r=>{requested=r.request().url();return r.abort()});const popupEvent=context.waitForEvent('page');await link.click();const popup=await popupEvent;await expect.poll(()=>requested).toBe(source);await popup.close();
 expect(new URL(page.url()).hash).toBe('#journey=2');await expect(group.getByRole('button').first()).toHaveAttribute('aria-pressed','true');await expect(canvas).toHaveAttribute('aria-label',new RegExp(manifest.observations[0].observedAt));
 await page.getByRole('button',{name:/Passport$/}).click();const event=page.waitForEvent('download');await page.getByRole('button',{name:/Download actual evidence Passport/}).click();const download=await event;const stream=await download.createReadStream();const chunks:Buffer[]=[];for await(const c of stream!)chunks.push(Buffer.from(c));const record=JSON.parse(Buffer.concat(chunks).toString());expect(record.observation.id).toBe(manifest.observations[0].id);expect(record.inspection.pixel).not.toBeNull();expect(record.measurementValidated).toBe(false);
});

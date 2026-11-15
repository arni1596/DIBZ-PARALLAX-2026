import {test,expect} from '@playwright/test';

test('evidence tabs have keyboard selection, linked panels and current source identity',async({page})=>{
 await page.goto('/#single');await page.getByRole('link',{name:'The evidence',exact:false}).click();
 const data=page.getByRole('tab',{name:'DATA',exact:true});await data.focus();await data.press('ArrowRight');
 const source=page.getByRole('tab',{name:'SOURCE',exact:true});await expect(source).toBeFocused();await expect(source).toHaveAttribute('aria-selected','true');
 await expect(page.getByRole('tabpanel')).toHaveAttribute('aria-labelledby',await source.getAttribute('id') as string);
 await expect(page.getByRole('tabpanel')).toContainText('Public IRSA source bytes matched');await expect(page.getByRole('tabpanel')).toContainText(/calibration/i);
 await source.press('End');await expect(page.getByRole('tab',{name:'LIMITS',exact:true})).toBeFocused();await page.keyboard.press('ArrowRight');await expect(data).toBeFocused();
});

test('profile is one chart Tab stop and supports keyboard and near-miss selection',async({page})=>{
 await page.goto('/#single');await page.getByRole('button',{name:'Investigate a region',exact:true}).click();
 const chart=page.locator('.profile-chart');await expect(chart).toBeVisible({timeout:20000});
 await expect(chart.locator('[role=button][tabindex="0"]')).toHaveCount(1);
 const first=chart.locator('[role=button][tabindex="0"]');await first.focus();await first.press('Home');await page.keyboard.press('ArrowRight');
 await expect(chart.locator('[role=button][tabindex="0"]')).toHaveAttribute('aria-pressed','true');
 const before=await chart.locator('[role=button][tabindex="0"]').getAttribute('data-channel');await page.keyboard.press('End');
 const end=await chart.locator('[role=button][tabindex="0"]').getAttribute('data-channel');expect(end).not.toBe(before);
 const hit=chart.locator('.profile-hit-area');const box=(await hit.boundingBox())!;await page.mouse.click(box.x+box.width*.45,box.y+box.height*.15);
 expect(await chart.locator('[role=button][aria-pressed=true]').getAttribute('data-channel')).not.toBe(end);
 await expect(chart).toContainText('MJy/sr');
});

test('narrow, tablet and landscape journeys retain layout and original image dimensions',async({page},info)=>{
 for(const [width,height]of[[320,568],[768,1024],[844,390],[720,450]]){
  await page.setViewportSize({width,height});await page.goto('/');await expect(page.getByRole('button',{name:'Begin exploring',exact:true})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await expect(page.locator('.hero-observation img')).toHaveJSProperty('naturalWidth',267);
  await page.screenshot({path:info.outputPath(`home-${width}.png`)});
 }
});

test('invalid coordinates are rejected and the field-guide dialog restores focus',async({page})=>{
 await page.goto('/#single');await page.getByRole('button',{name:'Investigate a region',exact:true}).click();
 const x=page.getByRole('spinbutton',{name:'Selected pixel X',exact:true});await expect(x).toBeVisible();const previous=await x.inputValue();await x.fill('267');
 await expect(page.getByRole('alert')).toContainText('between 0 and 266');await expect(x).toHaveValue(previous);
 const guide=page.getByRole('button',{name:'A quick field guide',exact:true});await guide.click();await expect(page.getByRole('dialog')).toBeVisible();
 await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);await expect(guide).toBeFocused();
});


test('copied source summary reflects the recorded match without claiming calibrated measurements',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(text:string)=>{(window as any).__copiedSummary=text}}})});
 await page.goto('/#journey=1');await expect(page.locator('.reveal-stage')).toHaveAttribute('data-ready','true');
 await page.getByRole('button',{name:'Copy summary + view link',exact:true}).click();
 const text=await page.evaluate(()=>(window as any).__copiedSummary);expect(text).toContain('source bytes matched');expect(text).toContain('calibration lineage unverified');expect(text).not.toContain('candidate remote origin; not authenticated');
});

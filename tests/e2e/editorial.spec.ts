import {test,expect} from '@playwright/test';

test('the complete narrated journey includes history and preserves inspection',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Compare wavelengths',exact:true}).click();
 await expect(page.locator('.reveal-stage')).toHaveAttribute('data-ready','true');
 await page.getByRole('button',{name:'Listen or read'}).click();
 await expect(page.getByRole('button',{name:'Close narration'})).toBeFocused();
 await page.getByRole('button',{name:'Explore dated observations'}).click();
 await expect(page).toHaveURL(/journey=2/);
 await page.getByRole('button',{name:'Examine the evidence',exact:false}).first().click();
 await expect(page).toHaveURL(/journey=3/);
 const canvas=page.locator('.atlas-act canvas');await expect(canvas).toBeVisible();await canvas.focus();await canvas.press('ArrowRight');
 await expect(page.locator('.inspection-receipt')).toContainText('Native pixel');
 await page.locator('.chapter-next').filter({hasText:'Why astronomers look twice'}).click();
 await expect(page).toHaveURL(/journey=4/);await expect(page.locator('.history-act')).toContainText('Clyde Tombaugh');
 await page.locator('.history-act .chapter-next').click();await expect(page).toHaveURL(/journey=5/);
 await expect(page.locator('.passport-sheet')).toContainText('Not validated');
 await expect(page.locator('.passport-sheet')).not.toContainText('Not performed');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('missing audio uses the displayed script; stop, chapter change and close cancel speech',async({page})=>{
 // Deterministic media failure/voice fixture tests lifecycle, not audible voice quality.
 await page.addInitScript(()=>{
  const calls:{text:string;lang:string;rate:number}[]=[];let cancels=0;
  Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{getVoices:()=>[],speak:(u:SpeechSynthesisUtterance)=>calls.push({text:u.text,lang:u.lang,rate:u.rate}),cancel:()=>{cancels++}}});
  Object.defineProperty(window,'__speechTest',{value:{calls,get cancels(){return cancels}}});
 });
 await page.route('**/narration/**',r=>r.fulfill({status:404,body:''}));
 await page.goto('/#journey=1');await page.getByRole('button',{name:'Listen or read'}).click();
 await page.getByRole('button',{name:'Play narration',exact:true}).click();
 await expect(page.getByRole('status').filter({hasText:'Using your browser voice.'})).toBeVisible();
 const calls=await page.evaluate(()=>(window as any).__speechTest.calls);expect(calls[0].text).toBe(await page.locator('.guided-story-script').innerText());expect(calls[0].lang).toBe('en-US');
 await page.getByRole('button',{name:'Stop narration',exact:true}).click();
 await page.getByRole('button',{name:'Play narration',exact:true}).click();
 await page.getByRole('button',{name:'Explore dated observations'}).click();await expect(page.getByRole('button',{name:'Play narration',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Close narration'}).press('Escape');await expect(page.getByRole('button',{name:'Listen or read'})).toBeFocused();
 expect(await page.evaluate(()=>(window as any).__speechTest.cancels)).toBeGreaterThan(3);
});

test('without browser speech or MP3s the transcript remains readable',async({page})=>{
 await page.addInitScript(()=>{delete (window as any).speechSynthesis;delete (window as any).SpeechSynthesisUtterance});
 await page.route('**/narration/**',r=>r.fulfill({status:404,body:''}));
 await page.goto('/#journey=4');await page.getByRole('button',{name:'Listen or read'}).click();await page.getByRole('button',{name:'Play narration',exact:true}).click();
 await expect(page.locator('.guided-story-status')).toContainText('Audio is unavailable');await expect(page.locator('.guided-story-script')).toContainText('Clyde Tombaugh');
 await page.getByRole('button',{name:'Close narration'}).click();await expect(page.getByRole('button',{name:'Listen or read'})).toBeFocused();
});

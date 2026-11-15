import {test,expect} from '@playwright/test';
test('FIND → SEE → VERIFY exports only authentic, qualified evidence',async({page})=>{
 await page.goto('/#investigation-find');await expect(page.getByRole('heading',{name:/What can this patch/})).toBeVisible();
 await page.getByRole('link',{name:/Explore the observations/}).click();
 const viewer=page.locator('.inv-observation canvas');await expect(viewer).toBeVisible();await viewer.focus();await viewer.press('ArrowRight');
 await page.getByRole('button',{name:/Epoch 02/}).click();await expect(page.locator('.inv-sample')).toContainText('2025-12-10');
 await page.getByRole('button',{name:/2. Examine the excluded core/}).click();await expect(page.locator('.inv-sample')).toContainText('OVERFLOW');await expect(page.locator('.inv-sample')).toContainText('SUR_ERROR');
 await page.getByLabel('Side by side',{exact:true}).check();await expect(page.locator('.inv-observation canvas')).toHaveCount(2);
 await page.locator('.inv-provenance > summary').click();await expect(page.locator('.inv-provenance')).toContainText('Unavailable or unverified');
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Export evidence ↓',exact:true}).click();const download=await downloadPromise;
 const stream=await download.createReadStream();const chunks:Buffer[]=[];for await(const chunk of stream!)chunks.push(Buffer.from(chunk));const report=JSON.parse(Buffer.concat(chunks).toString());
 expect(report.observation.id).toBe('rdra_row_0052');expect(report.sample.value).toBeNull();expect(report.sample.flags).toBe(2097158);expect(report.officialApproval).toBe(false);expect(report.comparison.difference).toBe(false);expect(report.processing.syntheticData).toBe(false);
 await expect(page.locator('body')).not.toContainText('NASA discovery certificate');
});
test('missing real image buffers show an error, never synthetic fallback',async({page})=>{await page.route('**/rdra_row_0001.image.f32',route=>route.fulfill({status:404,body:'Missing test asset'}));await page.goto('/#investigation-find');await expect(page.getByRole('alert')).toContainText('Observation asset unavailable');await expect(page.locator('.inv-observation canvas')).toHaveCount(0);});

test('field navigation keeps dated evidence contextual and survives refresh',async({page})=>{
 await page.goto('/#investigation-find');await page.getByRole('button',{name:'M101 dates',exact:true}).click();
 await expect(page.getByLabel('Dated observation A')).toBeVisible();await expect(page.locator('#evidence')).toHaveCount(0);
 await page.reload();await expect(page.getByLabel('Dated observation A')).toBeVisible();
 await page.getByRole('button',{name:'M101 wavelengths',exact:true}).click();await expect(page.getByLabel('Wavelength A channel')).toBeVisible();
 await expect(page.getByText(/Saved view rejected/)).toHaveCount(0);
 await page.getByRole('button',{name:'Investigation',exact:true}).click();await expect(page.locator('.inv-observation canvas')).toBeVisible();
 await expect(page.getByRole('button',{name:'M101 wavelengths',exact:true})).toBeVisible();
});


test('narrative requires intentional inspection and never gates direct scientific evidence',async({page})=>{
 await page.goto('/#investigation-find');await expect(page.locator('.inv-see')).toHaveAttribute('data-inspection','uninspected');await expect(page.locator('.inv-inspection-response')).toHaveCount(0);
 await page.getByRole('link',{name:/Explore the observations/}).click();await page.getByRole('button',{name:/2. Examine the excluded core/}).click();await expect(page.locator('.inv-see')).toHaveAttribute('data-inspection','excluded');await expect(page.locator('.inv-inspection-response')).toContainText('VARIANCE');
 await page.getByRole('button',{name:/Epoch 02/}).click();await expect(page.locator('.inv-see')).toHaveAttribute('data-inspection','uninspected');await page.getByRole('button',{name:/1. Inspect a usable pixel/}).click();await expect(page.locator('.inv-see')).toHaveAttribute('data-inspection','accepted');await expect(page.locator('.inv-pixel-readout')).toContainText('35.6962');
 await page.goto('/#investigation-verify');await page.reload();await expect(page.locator('#verify-title')).toBeVisible();await expect(page.locator('.inv-reasoning')).toContainText('19 of 19');await expect(page.locator('.inv-see')).toHaveAttribute('data-inspection','uninspected');
});

test('guided accepted to excluded to accepted shares one native selection',async({page})=>{
 await page.goto('/#investigation-see');const readout=page.locator('.inv-pixel-readout');await expect(readout).toContainText('x 21 / y 18');await expect(page.locator('.inv-see')).toHaveAttribute('data-inspection','uninspected');
 await page.getByRole('button',{name:/1. Inspect a usable pixel/}).click();await expect(readout).toContainText('49.2761');await expect(page.locator('.inv-interpretation')).not.toContainText('Detector threshold');
 await page.getByRole('button',{name:/2. Examine the excluded core/}).click();await expect(readout).toContainText('x 23 / y 23');await expect(page.locator('.inv-inspection-response')).toContainText('SUR_ERROR');await expect(page.locator('.inv-sample')).toContainText('Unavailable');
 await page.getByRole('button',{name:/1. Inspect a usable pixel/}).click();await expect(readout).toContainText('49.2761');await expect(page.locator('.inv-interpretation')).not.toContainText('Onboard processing');
});

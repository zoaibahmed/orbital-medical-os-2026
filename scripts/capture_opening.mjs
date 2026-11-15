import {chromium,expect} from '@playwright/test';
import {mkdir,writeFile,readFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const out='docs/reviews/opening-experience';await mkdir(out,{recursive:true});
const args=['--use-angle=d3d11','--ignore-gpu-blocklist','--enable-gpu'];
const browser=await chromium.launch({args});
const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference',recordVideo:{dir:`${out}/raw-video`,size:{width:1280,height:800}}});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
const report={browser:browser.version(),url:'http://127.0.0.1:5175/',args,viewport:[1440,900],videoSize:[1280,800],errors,poses:[],responsive:[]};
await page.goto(report.url);await page.evaluate(()=>document.fonts.ready);
await expect(page.getByTestId('opening-status')).toHaveAttribute('data-state','ready',{timeout:60000});
await page.waitForTimeout(700);
report.renderer=await page.locator('canvas').evaluate(c=>{const gl=c.getContext('webgl2');const ext=gl?.getExtension('WEBGL_debug_renderer_info');return ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):null;});
const take=async name=>{await page.screenshot({path:`${out}/${name}.png`});report.poses.push({name,scrollY:await page.evaluate(()=>scrollY),pose:JSON.parse(await page.locator('canvas').getAttribute('data-opening-pose'))});};
await take('01-introduction');await page.waitForTimeout(1200);
const range=await page.evaluate(()=>document.querySelector('main').offsetHeight-innerHeight);
for(let i=1;i<=20;i++){await page.mouse.wheel(0,range/20);await page.waitForTimeout(200);if(i===10)await take('02-scroll-transition');}
// Wheel deltas can end a fractional pixel short; native End completes the document scroll.
await page.keyboard.press('End');
await expect.poll(async()=>JSON.parse(await page.locator('canvas').getAttribute('data-opening-pose')).progress,{timeout:15000}).toBe(1);
await take('03-arrival');await page.waitForTimeout(1800);
for(let i=0;i<12;i++){await page.mouse.wheel(0,-range/12);await page.waitForTimeout(120);}
await page.keyboard.press('Home');
await expect.poll(async()=>JSON.parse(await page.locator('canvas').getAttribute('data-opening-pose')).progress,{timeout:15000}).toBe(0);
await page.getByRole('button',{name:'Medical index'}).click();await page.screenshot({path:`${out}/04-mission-index.png`});await page.waitForTimeout(800);await page.keyboard.press('Escape');
await page.getByRole('button',{name:'Emergency rehearsal'}).click();await page.screenshot({path:`${out}/06-emergency.png`});await page.keyboard.press('Escape');
const video=page.video();await context.close();await video.saveAs(`${out}/opening-scroll.webm`);report.videoBytes=(await stat(`${out}/opening-scroll.webm`)).size;
const mobile=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'no-preference'});
await mobile.goto(report.url);await mobile.evaluate(()=>document.fonts.ready);await mobile.screenshot({path:`${out}/05-mobile-introduction.png`});
for(const width of [320,390,768,1024,1440]){await mobile.setViewportSize({width,height:900});await mobile.waitForTimeout(400);report.responsive.push(await mobile.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,canvas:!!document.querySelector('canvas')})));}
await mobile.setViewportSize({width:390,height:844});await mobile.goto(report.url);await mobile.getByRole('button',{name:'Enable 3D exploration'}).click();await expect(mobile.getByTestId('opening-status')).toHaveAttribute('data-state','ready',{timeout:60000});await mobile.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));await mobile.waitForTimeout(1300);await mobile.screenshot({path:`${out}/07-mobile-3d-opt-in.png`});
await mobile.emulateMedia({reducedMotion:'reduce'});await mobile.setViewportSize({width:1440,height:900});await mobile.goto(report.url);await expect(mobile.getByTestId('opening-status')).toHaveAttribute('data-state','ready',{timeout:60000});await mobile.screenshot({path:`${out}/08-reduced-motion.png`});
const assets=JSON.parse(await readFile('src/scene/assets/generated-manifest.json','utf8'));report.modelVerification=[];for(const a of assets){const b=await readFile(`public/${a.path}`);const hash=createHash('sha256').update(b).digest('hex');if(hash!==a.sha256)throw Error('Model changed');report.modelVerification.push({id:a.id,bytes:b.length,sha256:hash});}
if(errors.length)throw Error(errors.join('\n'));if(report.responsive.some(r=>r.width<r.scrollWidth))throw Error('Horizontal overflow');
await writeFile(`${out}/verification.json`,JSON.stringify(report,null,2));await browser.close();console.log(JSON.stringify(report));

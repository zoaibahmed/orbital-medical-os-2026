import { test as base } from '@playwright/test'
export { expect } from '@playwright/test'
/** Existing authored-fixture regressions stay deterministic; fullstack.spec uses real HTTP. */
export const test = base.extend<{ offlineFixtures: void }>({
  offlineFixtures: [async ({page},use)=>{
    await page.route('**/api/crew/*/state', route=>route.abort())
    await use()
  }, {auto:true}],
})

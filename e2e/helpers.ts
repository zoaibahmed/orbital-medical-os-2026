import { expect, type Page } from '@playwright/test'
export const ready = (page: Page) => expect(page.getByTestId('environment-status')).toHaveAttribute('data-state','ready',{timeout:90000})
export async function chapter(page: Page, name: string) { await page.getByRole('navigation',{name:'Chapters'}).getByRole('button',{name:new RegExp(name)}).click() }
export const settled = (page: Page) => expect(page.locator('canvas')).toHaveAttribute('data-camera-transition','settled')

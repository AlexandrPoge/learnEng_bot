import sharp from 'sharp';
import { ruleImageSvg } from './rule-layout.js';
import type { Lesson } from '../../../packages/domain/types.js';
export { ruleImagePages, ruleImageKey, ruleImageSvg } from './rule-layout.js';
export async function renderRuleImage(lesson: Lesson, page: number) {
  return sharp(Buffer.from(ruleImageSvg(lesson, page))).png().toBuffer();
}

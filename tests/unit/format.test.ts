import { test } from 'node:test';
import assert from 'node:assert/strict';
import { richText, exampleBlocks, splitMessage } from '../../apps/bot/src/format.js';
import { sectionCard, topicCard } from '../../apps/bot/src/navigation.js';
import { lessons } from '../../packages/content/catalog.js';
import { sectionPages } from '../../packages/content/presentation.js';

test('English, translation and explanation are separated, with UTF-16-safe bold spans', () => {
  const formatted = exampleBlocks('She reads. — Она читает. После she нужна форма reads.');
  assert.match(formatted.text, /🇬🇧 Пример\nShe reads\.\n\n🇷🇺 Перевод\nОна читает\.\n\n🔎 Почему так\nПосле/u);
  assert.ok(formatted.entities.some((entity) => formatted.text.slice(entity.offset, entity.offset + entity.length) === 'She reads.'));
});

test('long rich messages preserve text and valid entities when splitting around emoji', () => {
  const original = richText().add('🧒 '.repeat(1200), 'bold').add('<b>Текст репетитора & пример</b>').build();
  const chunks = splitMessage(original.text, original.entities);
  assert.equal(chunks.map((chunk) => chunk.text).join(''), original.text);
  for (const chunk of chunks) {
    assert.ok(chunk.text.length <= 1900);
    assert.equal(/^[\uDC00-\uDFFF]/u.test(chunk.text), false);
    for (const entity of chunk.entities ?? []) assert.ok(entity.offset >= 0 && entity.offset + entity.length <= chunk.text.length);
  }
  assert.ok(chunks.at(-1).text.includes('<b>Текст репетитора & пример</b>'));
});

test('every child and adult card in the curriculum produces valid formatting', () => {
  for (const lesson of lessons) {
    for (const child of [true, false]) {
      const cards = [topicCard(lesson, child)];
      for (const section of ['rule', 'examples', 'traps']) {
        for (let page = 0; page < sectionPages(lesson, section).length; page++) cards.push(sectionCard(lesson, section, page, child));
      }
      for (const card of cards) {
        assert.ok(card.text.includes('\n\n'), lesson.id);
        for (const entity of card.entities) {
          assert.ok(entity.length > 0 && entity.offset >= 0 && entity.offset + entity.length <= card.text.length, lesson.id);
          assert.ok(['bold', 'code'].includes(entity.type));
        }
      }
    }
  }
});

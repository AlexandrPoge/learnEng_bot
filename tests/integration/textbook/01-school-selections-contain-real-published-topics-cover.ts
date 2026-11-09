import { test } from 'node:test';
import assert from 'node:assert/strict';
import { schoolYears, schoolLessons } from '../../../packages/content/school.js';
import { lessons, validateCatalog } from '../../../packages/content/catalog.js';

test('school selections contain real published topics, cover the library and include senior B1-B2 material', () => {
  const all = new Set<string>();
  for (const year of schoolYears) {
    assert.equal(new Set(year.lessonIds).size, year.lessonIds.length);
    assert.ok(year.lessonIds.every((id) => lessons.some((l) => l.id === id)));
    const items = schoolLessons(year.grade, lessons);
    assert.ok(items.length);
    items.forEach((l) => all.add(l.id));
    if (year.grade >= 8) assert.ok(items.some((l) => l.level === 'B1' || l.level === 'B2'));
  }
  assert.equal(all.size, lessons.length);
  const override = { ...lessons[0], schoolGrades: [7] };
  assert.equal(schoolLessons(1, [override]).length, 0);
  assert.equal(schoolLessons(7, [override]).length, 1);
  assert.equal(schoolLessons(1, [{ ...override, schoolGrades: [] }]).length, 0);
  assert.throws(() => validateCatalog([{ ...override, schoolGrades: [12] }]), /классы/u);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lessons, validateCatalog } from '../../packages/content/catalog.js';
import { gradeAnswer } from '../../packages/domain/grading.js';

test('all published topics have usable questions and unambiguous choice keys', () => {
  assert.equal(validateCatalog(), true);
  assert.ok(lessons.length >= 20);
  for (const lesson of lessons) {
    assert.ok(lesson.questions.length >= 5, lesson.id);
    for (const question of lesson.questions) {
      for (const answer of question.accepted) assert.equal(gradeAnswer(question, answer), true);
      if (question.type === 'choice') {
        assert.equal(
          question.options.filter((answer) => gradeAnswer(question, answer)).length,
          1,
          `${lesson.id}/${question.id}`,
        );
      }
    }
  }
});

test('catalog validation rejects broken lessons before they reach students', () => {
  assert.throws(() => validateCatalog([lessons[0], lessons[0]]), /ID/u);
  const broken = structuredClone(lessons[0]);
  broken.questions[0].accepted = ['not an option'];
  assert.throws(() => validateCatalog([broken]), /упражнение/u);
  const empty = { ...lessons[0], questions: [] };
  assert.throws(() => validateCatalog([empty]), /Нет упражнений/u);
});

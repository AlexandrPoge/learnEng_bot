import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gradeAnswer } from '../../packages/domain/grading.mjs';

test('accepts harmless typography but does not forgive a grammar mistake', () => {
  const question = { accepted: ["She doesn't work."] };
  assert.equal(gradeAnswer(question, '  SHE doesn’t   work! '), true);
  assert.equal(gradeAnswer(question, "She doesn't works"), false);
  assert.equal(gradeAnswer({ accepted: ['watches'] }, 'watch'), false);
});

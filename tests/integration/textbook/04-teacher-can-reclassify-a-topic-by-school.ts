import { harness } from './helpers.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { availableLessons } from '../../../apps/bot/src/editor.js';
import { schoolYears, schoolLessons } from '../../../packages/content/school.js';

test('teacher can reclassify a topic by school grade while its level and existing attempts are preserved', () => {
  const h = harness();
  h.send(20, '/practice alphabet');
  const attempt = h.state.attempts[h.state.users['20'].activeAttempt!];
  h.send(10, '/edit alphabet');
  h.click(10, 'editor:grades');
  h.send(10, '12');
  assert.equal(h.state.editors!['10'].inputField, 'school_grades');
  h.send(10, '5, 6');
  h.send(10, '/publish');
  assert.deepEqual(h.state.lessonOverrides!.alphabet.schoolGrades, [5, 6]);
  assert.equal(
    schoolLessons(1, availableLessons(h.state)).some((l) => l.id === 'alphabet'),
    false,
  );
  assert.equal(
    schoolLessons(5, availableLessons(h.state)).some((l) => l.id === 'alphabet'),
    true,
  );
  assert.equal(h.state.lessonOverrides!.alphabet.level, 'A1');
  assert.equal(attempt.lesson.schoolGrades, undefined);
  h.send(21, '/edit alphabet');
  assert.match(h.last(21).text!, /доступен репетитору/u);
  h.send(10, '/edit alphabet');
  h.send(10, '/school_grades 0');
  h.send(10, '/publish');
  assert.equal(
    schoolYears.some((y) =>
      schoolLessons(y.grade, availableLessons(h.state)).some((l) => l.id === 'alphabet'),
    ),
    false,
  );
  assert.equal(availableLessons(h.state).find((l) => l.id === 'alphabet')?.level, 'A1');
});

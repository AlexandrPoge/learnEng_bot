import { unit } from './course-builder.js';
import type { Category, GrammarStrand, Level, QuestionInput, Resource } from '../domain/types.js';

const root = 'https://foxford.ru/wiki/angliyskiy-yazyk';
// Прямые страницы, которые удалось открыть при проверке каталога 08.11.2026.
const sources: Record<string, string> = {
  'would-like': 'would-like-primary',
  'dummy-it': 'dummy-it-primary',
  countries: 'strany-na-anglijskom',
  adjectives: 'prilagatelnye',
  'all-both': 'ispolzovanie-all-none-both-neither-some-most-s-sushchestvitelnymi',
  'geography-articles': 'artikl-the-s-geograficheskimi-nazvaniyami-article-the-with-geographical-names',
  'ed-ing-adjectives': 'otglagolnye-prilagatelnye-na-ed-ili-ing-adjectives-with-ed-and-ing',
  'comparative-adverbs': 'sravnitelnaya-stepen-narechij-comparative',
  'movement-prepositions': 'predlogi-napravleniya-prepositions-of-movement',
  'have-to': 'have-to-primary',
  'should-advice': 'modalnyj-glagol-should',
  'writing-email': 'kak-napisat-ehlektronnoe-pismo-drugu-writing-an-email',
  'writing-postcard': 'kak-napisat-otkrytku-drugu-writing-a-postcard',
  'describing-photo': 'opisanie-fotografii-describing-a-photo',
  'past-perfect': 'past-perfect',
  passive: 'glagoly-v-stradatelnom-zaloge-passive-voice',
  'reported-statements': 'kosvennayarechvutverditelnyhpredlozheniyahreportedstatements',
  'relative-clauses': 'pridatochnye-opredelitelnye-relative-clauses',
  'second-conditional': 'uslovnye-predlozheniya-vtorogo-tipa-tipa-second-conditional',
  'subject-questions': 'voprosy-k-podlejashemu-i-dopolnenyu',
  'word-formation': 'osnovnye-sposoby-slovoobrazovaniya-types-of-word-formation',
  'third-conditional': 'uslovnye-predlozheniya-tretego-tipa-third-conditional',
  'future-continuous': 'budushchee-dlitelnoe-vremya-future-continuous',
  'modal-deductions': 'modalnye-glagoly-dlya-vyrazheniya-predpolozheniya-might-may-must-can-t-could',
  causative: 'konstrukciya-have-something-done-the-causative-have-something-done',
  'verb-pattern-meaning': 'glagol-infinitiv-ili-ing-forma-verb-infinitive-or-ing-form',
  'comparing-photos': 'sravnenie-fotografij-comparing-photos',
};

// Правила, примеры и тесты написаны для бота; статьи и изображения не копируются.
export function schoolUnit(
  id: string,
  title: string,
  level: Level,
  grades: number[],
  strand: GrammarStrand,
  icon: string,
  goal: string,
  memory: string,
  rules: string[],
  examples: string[],
  traps: string[],
  questions: QuestionInput[],
  category: Category = 'grammar',
) {
  const slug = sources[id];
  const resource: Resource = {
    title: slug ? `Фоксфорд: ${title}` : `Каталог Фоксфорда: ${title}`,
    url: slug ? `${root}/${slug}` : root,
    provider: 'Фоксфорд Учебник',
    language: 'ru',
    kind: 'article',
    checkedAt: '2026-11-08',
    note: slug
      ? 'Дополнительная статья по теме. Объяснения и задания внутри бота — собственные.'
      : `Это общий каталог. Найди тему «${title}»; отдельную страницу при проверке открыть не удалось. Основной урок целиком доступен в боте.`,
  };
  const seed = Array.from(id).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const balanced = questions.map((q, i) => {
    if (q.type !== 'choice') return q;
    const offset = (seed + i) % q.options.length;
    return { ...q, options: [...q.options.slice(offset), ...q.options.slice(0, offset)] };
  });
  return {
    ...unit(id, title, level, icon, goal, memory, rules, examples, traps, balanced, category),
    schoolGrades: grades,
    strand,
    resources: [resource],
  };
}

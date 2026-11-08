import type { Lesson, Section } from '../domain/types.js';
// Краткие ориентиры для первого знакомства. Подробности остаются в правиле.
const guides: Record<string, [string, string, string, string]> = {
  'to-be': ['🧩', 'Скажи, кто ты, какой ты и где ты.', 'I am · He / She / It is · You / We / They are', 'В английском нужно слово-связка. «Я счастлив» → I am happy. Am соединяет I и happy.'],
  pronouns: ['👥', 'Замени имя коротким словом и расскажи, чья это вещь.', 'She — она · her — её / ей · my book — моя книга · mine — моя', 'Маша → she. «Я вижу Машу» → I see her. «Моя книга» → my book.'],
  articles: ['🍎', 'Научись говорить «какой-то» и «тот самый».', 'a / an — один из многих · the — тот самый', 'Сначала: I see a cat — вижу какую-то кошку. Потом: The cat is white — эта кошка белая.'],
  plurals: ['🧸', 'Скажи, что предметов несколько.', 'one book → two books', 'Одна книга — book. Две — books. Чаще всего добавляем -s, но у некоторых слов особая форма.'],
  'there-is': ['🏠', 'Расскажи, что находится в комнате или рядом.', 'There is + один · There are + несколько', 'Посмотри на стол. Одна книга? There is a book. Две книги? There are two books.'],
  'have-got': ['🎒', 'Расскажи о вещах и о том, что у кого-то есть.', 'I have got · She has got', 'У меня есть мяч: I have got a ball. У неё есть мяч: She has got a ball.'],
  'present-simple': ['🔁', 'Расскажи, что ты делаешь обычно.', 'I play · She plays · Does she play?', 'Ты играешь каждый день? I play every day. Это привычка. С he, she, it в обычном утверждении добавь -s.'],
  'prepositions-time': ['🕒', 'Скажи, когда что-то происходит.', 'at 9:00 · on Monday · in June', 'Точное время — at. День недели — on. Месяц или год — in. Это удобная первая подсказка; особые случаи разберём отдельно.'],
  'prepositions-place': ['📍', 'Помоги найти предмет.', 'in — внутри · on — на · under — под', 'Мяч в коробке: in the box. На коробке: on the box. Под коробкой: under the box.'],
  'present-continuous': ['⏳', 'Расскажи, что происходит прямо сейчас.', 'am / is / are + глагол-ing', 'Представь, что смотришь на друга: он сейчас читает. He is reading. Для действия сейчас нужны is и reading.'],
  can: ['🏊', 'Расскажи, что умеешь, и попроси разрешение.', 'can + глагол без to', 'Я умею плавать: I can swim. После can оставь глагол как есть: swim, не swims.'],
  'daily-routine': ['🌤', 'Расскажи о своём дне.', 'wake up → have breakfast → do homework → go to bed', 'Представь день как цепочку: проснулся, позавтракал, сделал уроки, лёг спать. Для каждого дела выучим короткую фразу.'],
  'past-simple': ['📅', 'Расскажи о том, что произошло вчера.', 'I played · I went · Did you go?', 'Вчера ты играл: I played yesterday. Это уже закончилось. У go особая форма — went.'],
  'past-continuous': ['🎬', 'Расскажи, что происходило в момент прошлого.', 'was / were + глагол-ing', 'Вчера в пять я читал: I was reading at five yesterday. Представь кадр фильма: действие ещё продолжается.'],
  'future-forms': ['🔮', 'Расскажи о планах и обещаниях.', 'will + глагол · am / is / are going to + глагол', 'Обещаешь помочь? I will help. Уже решил учиться? I am going to study. Выбор зависит от того, что ты хочешь сказать.'],
  'present-perfect': ['✨', 'Свяжи событие с настоящим и сравни его с «вчера».', 'have / has + третья форма', 'Я потерял ключи и сейчас их нет: I have lost my keys. Если уточняем «вчера»: I lost my keys yesterday.'],
  comparisons: ['📏', 'Сравни два предмета или выбери самый большой.', 'small → smaller → the smallest', 'Один мяч больше другого: bigger. Самый большой из всех: the biggest. С длинными словами нужны more и most.'],
  quantifiers: ['🧺', 'Расскажи, сколько чего-то есть.', 'many books · much water · some apples', 'Книги можно посчитать: many books. Воду так не считаем: much water. Отдельно можно посчитать стаканы воды.'],
  modals: ['🧭', 'Различай совет, правило и запрет.', 'should — стоит · must — нужно · mustn’t — нельзя', 'Совет другу: You should rest. Запрет: You mustn’t enter. А don’t have to означает «не обязательно».'],
  'gerund-infinitive': ['📚', 'Соединяй два действия правильно.', 'enjoy reading · want to read', 'После enjoy говорим reading. После want — to read. Учим эти слова парами, чтобы они запоминались вместе.'],
};

export function enrichLesson(lesson: Lesson): Lesson {
  const guide = guides[lesson.id];
  return guide ? { ...lesson, icon: guide[0], goal: guide[1], memory: guide[2], childIntro: guide[3] } : lesson;
}

// Сначала смотрим на актуальный текст: правки репетитора не заменяются
// встроенными объяснениями, даже если они сделаны для старой версии урока.
export function lessonSections(lesson: Pick<Lesson, 'theory'>, { fallback = true } = {}): Record<Section, string[]> {
  const sections: Record<Section, string[]> = { rule: [], examples: [], traps: [] };
  let section: Section = 'rule';
  for (const raw of lesson.theory.split('\n')) {
    let line = raw.trim();
    if (!line) continue;
    if (/^Примеры:/iu.test(line)) { section = 'examples'; line = line.replace(/^Примеры:\s*/iu, ''); }
    if (/^Ловушк[аи]:/iu.test(line)) { section = 'traps'; line = line.replace(/^Ловушк[аи]:\s*/iu, ''); }
    if (line) sections[section].push(line);
  }
  if (fallback && !sections.rule.length) sections.rule.push('Начни с примеров и обрати внимание на форму предложения.');
  if (fallback && !sections.examples.length) sections.examples.push('Репетитор ещё не добавил отдельные примеры к этому уроку.');
  if (fallback && !sections.traps.length) sections.traps.push('Не спеши: прочитай предложение целиком и сравни свой ответ с правилом.');
  return sections;
}

export function sectionPages(lesson: Lesson, section: Section) {
  // Одна мысль на карточку. Длинный текст репетитора тоже разбивается.
  const pages: string[] = [];
  for (const paragraph of lessonSections(lesson)[section] ?? []) {
    const words = paragraph.split(/\s+/u);
    let chunk = '';
    for (const word of words) {
      if (chunk && chunk.length + word.length + 1 > 650) { pages.push(chunk); chunk = ''; }
      chunk += `${chunk ? ' ' : ''}${word}`;
    }
    if (chunk) pages.push(chunk);
  }
  return pages;
}

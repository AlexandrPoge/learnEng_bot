import { lesson, choice as c, gap as g } from './lesson-builder.js';

export const a2Lessons = [
  lesson('past-simple', 'Past Simple', 'A2', [
    'Завершённые события в прошлом: yesterday, last week, in 2020.',
    'Правильный глагол + -ed; неправильный — вторая форма: go → went.',
    'Вопрос: Did you go? Отрицание: I didn’t go. Be: was / were, без did.',
  ], ['She visited her friend yesterday. — Она навестила друга вчера.', 'We went home. — Мы пошли домой.'], [
    'После did / didn’t используем начальную форму: didn’t go, а не didn’t went.', 'Вопрос с be: Were you tired?, а не Did you be tired?'], [
    c('Yesterday I ___ to the park.', ['go', 'went', 'gone'], 'went', 'Go → went: завершённое действие вчера.'),
    g('Впиши форму visit: She ___ us last week.', 'visited', 'Visit — правильный глагол: visited.'),
    c('Did he ___ the film?', ['saw', 'seen', 'see'], 'see', 'После did — начальная форма see.'),
    g('Впиши was или were: They ___ at home yesterday.', 'were', 'С they в прошлом используем were.'),
    c('Выбери отрицание.', ['I didn’t went.', 'I didn’t go.', 'I don’t went.'], 'I didn’t go.', 'Didn’t + начальная форма.'),
  ]),
  lesson('past-continuous', 'Past Continuous', 'A2', [
    'Процесс в определённый момент прошлого: was / were + -ing.',
    'Часто длительное действие — фон, а короткое событие — Past Simple: I was cooking when he called.',
  ], ['At eight yesterday I was reading. — Вчера в восемь я читал.', 'They were sleeping when the phone rang. — Они спали, когда зазвонил телефон.'], [
    'I / he / she / it was; you / we / they were.', 'When и while сами по себе не определяют время: важен смысл ситуации.'], [
    c('At 8 p.m. yesterday, she ___ dinner.', ['was cooking', 'is cooking', 'were cooking'], 'was cooking', 'Процесс в момент прошлого: she was cooking.'),
    g('Впиши was или were: We ___ walking when it started raining.', 'were', 'С we используется were.'),
    c('I was sleeping when the phone ___.', ['rings', 'rang', 'ringing'], 'rang', 'Короткое событие на фоне процесса: rang.'),
    g('Напиши -ing форму sit: ___', 'sitting', 'Sit → sitting: удваиваем t.'),
    c('Выбери вопрос о процессе в прошлом.', ['Did you sleeping?', 'Were you sleeping?', 'Was you sleeping?'], 'Were you sleeping?', 'You were → Were you ...?'),
  ]),
  lesson('future-forms', 'Будущее: will / going to / Continuous', 'A2', [
    'Will + глагол: решение в момент речи, обещание, прогноз.',
    'Be going to + глагол: намерение или прогноз по наблюдаемым признакам.',
    'Present Continuous может описывать договорённость: I’m meeting Anna tomorrow.',
  ], ['The phone is ringing. I’ll answer it. — Телефон звонит. Я отвечу.', 'Look at those clouds! It’s going to rain. — Посмотри на тучи! Будет дождь.'], [
    'После will нет to: will help.', 'Going to требует be: She is going to study.', 'Будущие формы иногда взаимозаменяемы: здесь выбираем по указанному контексту.'], [
    c('Впиши форму в обещание: I promise I ___ help you.', ['will', 'am', 'going'], 'will', 'Обещание: will + глагол.'),
    g('Впиши am / is / are: She ___ going to learn English.', 'is', 'She is going to ...'),
    c('Look! That glass is falling. It ___ break.', ['is going to', 'going to', 'is'], 'is going to', 'Прогноз по видимым признакам: is going to break.'),
    g('Впиши глагол: I will ___ (call) you tomorrow.', 'call', 'После will — начальная форма без to.'),
    c('Договорённость уже назначена. Выбери правильную форму.', ['I meeting Anna tomorrow.', 'I am meeting Anna tomorrow.', 'I am meet Anna tomorrow.'], 'I am meeting Anna tomorrow.', 'Present Continuous: am + meeting.'),
  ]),
  lesson('present-perfect', 'Present Perfect и Past Simple', 'A2', [
    'Present Perfect: have / has + третья форма; опыт до настоящего момента или результат, связанный с настоящим.',
    'Past Simple: событие в завершённом прошлом, часто с yesterday, last week, in 2020.',
    'Ever — когда-либо; never — никогда; yet — ещё / уже в вопросах и отрицаниях.',
  ], ['I have lost my keys. — Я потерял ключи (актуальный результат).', 'I lost my keys yesterday. — Я потерял ключи вчера.', 'Have you ever been to London? — Ты когда-нибудь был в Лондоне?'], [
    'С yesterday обычно нужен Past Simple: I saw him yesterday.', 'Третья форма go — gone; been to обычно говорит об опыте посещения с возвращением.'], [
    c('I ___ him yesterday.', ['have seen', 'saw', 'has seen'], 'saw', 'Yesterday — завершённое время в прошлом.'),
    g('Впиши have или has: She ___ finished her homework.', 'has', 'She has + третья форма.'),
    c('Have you ever ___ to London?', ['been', 'went', 'was'], 'been', 'Для опыта посещения: have been to.'),
    g('Напиши третью форму eat: ___', 'eaten', 'Eat → ate → eaten.'),
    c('We haven’t finished ___.', ['yet', 'yesterday', 'last week'], 'yet', 'Yet часто стоит в конце отрицаний в Present Perfect.'),
  ]),
  lesson('comparisons', 'Сравнительная и превосходная степень', 'A2', [
    'Короткие прилагательные: small → smaller → the smallest.',
    'Длинные прилагательные: interesting → more interesting → the most interesting.',
    'Неправильные: good → better → the best; bad → worse → the worst. Сравнение: than.',
  ], ['This bag is cheaper than that one. — Эта сумка дешевле той.', 'She is the tallest person in the room. — Она самая высокая в комнате.'], [
    'Не more better: better уже сравнительная степень.', 'Big → bigger, happy → happier.'], [
    c('My room is ___ than yours.', ['small', 'smaller', 'smallest'], 'smaller', 'Сравнение двух комнат: smaller than.'),
    g('Напиши сравнительную степень good: ___', 'better', 'Неправильная форма: better.'),
    c('This is ___ interesting book in the library.', ['more', 'the most', 'most than'], 'the most', 'Превосходная степень длинного прилагательного: the most.'),
    g('Напиши сравнительную степень big: ___', 'bigger', 'Удваиваем g: bigger.'),
    c('Choose the correct sentence.', ['She is more better now.', 'She is better now.', 'She is best than now.'], 'She is better now.', 'Better не требует more.'),
  ]),
  lesson('quantifiers', 'Some / any / much / many', 'A2', [
    'Many — с исчисляемыми во множественном числе; much — с неисчисляемыми.',
    'Some часто в утверждениях; any — в вопросах и отрицаниях.',
    'Some также бывает в предложениях и просьбах, когда ожидается согласие: Would you like some tea?',
  ], ['How many apples? How much water?', 'There are some apples. There isn’t any milk.', 'A few friends — несколько друзей; a little water — немного воды.'], [
    'Money, advice, information в этих значениях неисчисляемые.', 'В обычных утверждениях a lot of часто естественнее, чем much: I have a lot of time.'], [
    c('How ___ money do you need?', ['many', 'much', 'a few'], 'much', 'Money — неисчисляемое.'),
    g('Впиши much или many: How ___ books have you got?', 'many', 'Books можно посчитать.'),
    c('Would you like ___ tea?', ['some', 'many', 'a few'], 'some', 'В предложении напитка естественно some.'),
    g('Впиши some или any: There isn’t ___ milk left.', 'any', 'В отрицании обычно any.'),
    c('I need ___ advice.', ['an', 'some', 'many'], 'some', 'Advice — неисчисляемое: some advice.'),
  ]),
  lesson('modals', 'Should / must / have to', 'A2', [
    'Should + глагол — совет. Must + глагол — сильная необходимость; have to + глагол — необходимость по обстоятельствам или правилам.',
    'Mustn’t — запрещено; don’t have to — не обязательно.',
    'В прошлом для необходимости обычно had to. Для вопросов с have to: Do you have to ...?',
  ], ['You should rest. — Тебе стоит отдохнуть.', 'You mustn’t smoke here. — Здесь нельзя курить.', 'You don’t have to come. — Тебе не обязательно приходить.'], [
    'Mustn’t и don’t have to не синонимы.', 'После should / must нет to, но have to содержит to.'], [
    c('Скажи «Тебе стоит отдохнуть». You ___ rest.', ['should', 'should to', 'shoulds'], 'should', 'Совет: should + глагол.'),
    g('Впиши must или have: We ___ to wear a uniform at school.', 'have', 'Have to + глагол.'),
    c('«Входить запрещено»: You ___ enter.', ['mustn’t', 'don’t have to', 'should to'], 'mustn’t', 'Mustn’t означает запрет.'),
    g('Впиши форму have: Yesterday I ___ to work late.', 'had', 'Необходимость в прошлом: had to.'),
    c('«Приходить не обязательно»: You ___ come.', ['mustn’t', 'don’t have to', 'doesn’t have to'], 'don’t have to', 'Don’t have to — нет необходимости.'),
  ]),
  lesson('gerund-infinitive', 'Герундий и инфинитив: базовые сочетания', 'A2', [
    'После enjoy и finish используем -ing: enjoy reading, finish working.',
    'После want, decide, hope используем to + глагол: want to learn.',
    'После предлога обычно -ing: good at swimming. Like / love допускают обе формы во многих контекстах.',
  ], ['I enjoy reading. — Мне нравится читать.', 'She decided to study. — Она решила учиться.', 'He is good at cooking. — Он хорошо готовит.'], [
    'Не enjoy to read: enjoy reading.', 'Не все глаголы подчиняются одной схеме; некоторые меняют смысл в зависимости от формы.'], [
    c('I enjoy ___.', ['to read', 'reading', 'read'], 'reading', 'После enjoy — -ing.'),
    g('Впиши to или at: She wants ___ learn English.', 'to', 'Want to + глагол.'),
    c('He is good at ___.', ['swim', 'to swim', 'swimming'], 'swimming', 'После предлога at — -ing.'),
    g('Впиши форму work: I finished ___ at six.', 'working', 'После finish — -ing.'),
    c('We decided ___ home.', ['going', 'to go', 'go'], 'to go', 'После decide — to + глагол.'),
  ]),
];

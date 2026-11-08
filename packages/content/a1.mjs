import { lesson, choice as c, gap as g } from './lesson-builder.mjs';

export const a1Lessons = [
  lesson('to-be', 'To be: am / is / are', 'A1', [
    'Be связывает человека или предмет с описанием: кто он, какой он, где он.',
    'I am; he / she / it is; you / we / they are. Отрицание: добавить not.',
    'В вопросе be ставим перед подлежащим: Are you ready?',
  ], ['I am a student. — Я ученик / студент.', 'She is at home. — Она дома.', 'They are not tired. — Они не устали.'], [
    'Нельзя пропускать be: She is happy, а не She happy.', 'Вопрос: Is he here? — без do / does.',
  ], [
    c('I ___ ready.', ['am', 'is', 'are'], 'am', 'С I используется am.'),
    c('They ___ at school.', ['am', 'is', 'are'], 'are', 'С they используется are.'),
    g('Впиши be: My sister ___ a doctor.', 'is', 'My sister = she: is.'),
    c('Выбери вопрос.', ['Do you are happy?', 'Are you happy?', 'You happy?'], 'Are you happy?', 'В вопросе are ставим перед you.'),
    g('Впиши be: We ___ not late.', 'are', 'We are not late — мы не опоздали.'),
  ]),
  lesson('pronouns', 'Местоимения: I / me / my / mine', 'A1', [
    'Подлежащее: I, you, he, she, it, we, they. Дополнение: me, you, him, her, it, us, them.',
    'Перед существительным: my, your, his, her, its, our, their.',
    'Без существительного: mine, yours, his, hers, ours, theirs.',
  ], ['She knows me. — Она меня знает.', 'This is my book. This book is mine. — Это моя книга.'], [
    'My book, но This book is mine: после mine существительное не ставим.', 'Its = его/её (о предмете или животном); it’s = it is или it has.',
  ], [
    c('Anna is my friend. ___ is kind.', ['He', 'She', 'Her'], 'She', 'Анна — подлежащее: she.'),
    g('Впиши местоимение: I like Tom. I like ___.', 'him', 'После like нужен объект: him.'),
    c('This is ___ bag. It belongs to me.', ['mine', 'my', 'me'], 'my', 'Перед bag используем my.'),
    g('Впиши местоимение: This pen belongs to me. It is ___.', 'mine', 'Без существительного используем mine.'),
    c('The cat is eating ___ food.', ['its', 'it’s', 'it'], 'its', 'Its food — его еда. Апостроф не нужен.'),
  ]),
  lesson('articles', 'Артикли: a / an / the', 'A1', [
    'A / an: один из многих, впервые упоминаемый исчисляемый предмет в единственном числе.',
    'A перед согласным звуком; an перед гласным звуком. The — когда ясно, какой именно предмет.',
    'Общие понятия во множественном числе или с неисчисляемым существительным часто без артикля: Cats sleep. Water is important.',
  ], ['I see a dog. The dog is black. — Вижу собаку. Эта собака чёрная.', 'An apple, an hour, a university.'], [
    'Важен звук: an hour (h не произносится), a university (начинается с /j/).', 'Нельзя a water в значении воды вообще.',
  ], [
    c('I have ___ apple.', ['a', 'an', 'the'], 'an', 'Apple начинается с гласного звука.'),
    g('Впиши a или an: It takes ___ hour.', 'an', 'Hour начинается с гласного звука.'),
    c('I bought a book. ___ book is interesting.', ['A', 'An', 'The'], 'The', 'Речь об уже упомянутой книге.'),
    g('Впиши a или an: She studies at ___ university.', 'a', 'University начинается со звука /j/.'),
    c('Выбери фразу: «Вода важна» (вода вообще).', ['A water is important.', 'Water is important.', 'An water is important.'], 'Water is important.', 'Water — неисчисляемое существительное; здесь артикль не нужен.'),
  ]),
  lesson('plurals', 'Множественное число существительных', 'A1', [
    'Обычно добавляем -s: book → books. После -s, -sh, -ch, -x часто -es: box → boxes.',
    'Согласная + y: city → cities; гласная + y: boy → boys.',
    'Есть неправильные формы: child → children, person → people, man → men, foot → feet.',
  ], ['One bus → two buses.', 'One child → three children.'], [
    'Не childrens: children уже множественное число.', 'Money не имеет обычной формы множественного числа в значении «деньги».'], [
    g('Напиши множественное число: book → ___', 'books', 'Обычно добавляем -s.'),
    c('One city → two ___.', ['citys', 'cities', 'cityes'], 'cities', 'После согласной y заменяем на -ies.'),
    g('Напиши множественное число: child → ___', 'children', 'Это неправильная форма: children.'),
    c('One boy → three ___.', ['boies', 'boys', 'boyes'], 'boys', 'Перед y стоит гласная, просто добавляем -s.'),
    g('Напиши множественное число: box → ___', 'boxes', 'После x добавляем -es.'),
  ]),
  lesson('there-is', 'There is / there are', 'A1', [
    'Чтобы сказать, что где-то что-то есть: there is + единственное число или неисчисляемое; there are + множественное.',
    'Вопросы: Is there ...? Are there ...? Отрицания: There isn’t ... / There aren’t ...',
  ], ['There is a cat on the chair. — На стуле кошка.', 'There are two books on the desk. — На столе две книги.'], [
    'There is water, а не There are water.', 'There описывает наличие, а it может указывать на уже известный предмет.'], [
    c('There ___ a shop near my house.', ['is', 'are', 'am'], 'is', 'A shop — единственное число.'),
    g('Впиши is или are: There ___ three chairs.', 'are', 'Three chairs — множественное число.'),
    c('___ there any milk in the fridge?', ['Are', 'Is', 'Do'], 'Is', 'Milk — неисчисляемое: Is there.'),
    g('Впиши is или are: There ___ not any buses today.', 'are', 'Buses — множественное число.'),
    c('Выбери вопрос про два окна.', ['Is there two windows?', 'Are there two windows?', 'Do there two windows?'], 'Are there two windows?', 'Для множественного числа: Are there ...?'),
  ]),
  lesson('have-got', 'Have got / has got', 'A1', [
    'Для обладания: I / you / we / they have got; he / she / it has got.',
    'Вопрос: Have you got ...? Has she got ...? Отрицание: haven’t got / hasn’t got.',
    'Также можно: Do you have a bike? У этой конструкции своя форма вопроса.',
  ], ['She has got a bike. — У неё есть велосипед.', 'Have you got a pen? — У тебя есть ручка?'], [
    'Не Does she has got? Выбери Has she got? или Does she have?', 'Has got — не форма для описания привычных действий вроде have breakfast.'], [
    c('He ___ got a dog.', ['have', 'has', 'is'], 'has', 'С he используем has got.'),
    g('Впиши have или has: We ___ got a garden.', 'have', 'С we используем have got.'),
    c('___ she got a brother?', ['Does', 'Have', 'Has'], 'Has', 'Вопрос: Has she got ...?'),
    g('Впиши have или has: I ___ not got a car.', 'have', 'I have not got = I haven’t got.'),
    c('Выбери правильный вопрос.', ['Does he have a bike?', 'Does he has a bike?', 'Do he has got a bike?'], 'Does he have a bike?', 'После does — начальная форма have.'),
  ]),
  lesson('prepositions-time', 'Предлоги времени: in / on / at', 'A1', [
    'In — месяцы, годы, сезоны и части дня: in May, in 2026, in winter, in the morning.',
    'On — дни и даты: on Monday, on 5 May. At — время на часах: at 9 o’clock; at night.',
    'С next, last, this, every обычно без предлога: next Monday, every day.',
  ], ['I work at nine. — Я работаю в девять.', 'We meet on Friday. — Мы встречаемся в пятницу.'], [
    'At night, но in the morning.', 'On Monday morning, потому что назван конкретный день.'], [
    c('We meet ___ Monday.', ['in', 'on', 'at'], 'on', 'Перед днём недели ставим on.'),
    g('Впиши in / on / at: The lesson starts ___ 10:00.', 'at', 'Перед временем на часах — at.'),
    c('My birthday is ___ June.', ['at', 'on', 'in'], 'in', 'Перед названием месяца — in.'),
    g('Впиши in / on / at: I sleep ___ night.', 'at', 'Устойчивое сочетание: at night.'),
    c('Выбери правильную фразу.', ['on next Monday', 'next Monday', 'at next Monday'], 'next Monday', 'Перед next Monday предлог не нужен.'),
  ]),
  lesson('prepositions-place', 'Предлоги места', 'A1', [
    'In — внутри; on — на поверхности; under — под; next to — рядом с; between — между.',
    'At часто обозначает точку или место деятельности: at the bus stop, at school.',
  ], ['The book is on the desk. — Книга на столе.', 'The cat is under the table. — Кошка под столом.', 'The keys are in the bag. — Ключи внутри сумки.'], [
    'On the wall — на стене, in the room — в комнате.', 'Для положения между двумя объектами используем between.'], [
    c('The keys are inside the bag. They are ___ the bag.', ['on', 'in', 'under'], 'in', 'Внутри сумки — in.'),
    g('Переведи только предлог: под столом → ___ the table.', 'under', 'Под — under.'),
    c('The picture hangs ___ the wall.', ['in', 'under', 'on'], 'on', 'На поверхности стены — on.'),
    g('Впиши предлог: B is ___ A and C.', 'between', 'Между двумя объектами — between.'),
    c('The bus will stop here. Wait ___ the bus stop.', ['at', 'under', 'between'], 'at', 'Остановка как точка ожидания — at the bus stop.'),
  ]),
  lesson('present-continuous', 'Present Continuous', 'A1', [
    'Для действия прямо сейчас: am / is / are + глагол с -ing.',
    'Отрицание: She is not reading. Вопрос: Is she reading?',
    'В этой теме тренируем действия в момент речи. Некоторые глаголы состояния, например know, обычно не используют в Continuous.',
  ], ['I am cooking now. — Я сейчас готовлю.', 'They are playing outside. — Они играют на улице.'], [
    'Не пропускай be: I am working, а не I working.', 'Make → making, run → running.'], [
    c('Look! She ___ a book.', ['reads', 'is reading', 'read'], 'is reading', 'Действие сейчас: is + reading.'),
    g('Впиши am / is / are: They ___ watching TV now.', 'are', 'С they используем are.'),
    c('Выбери вопрос о действии сейчас.', ['Are you working?', 'Do you working?', 'You are work?'], 'Are you working?', 'В вопросе are ставим перед you.'),
    g('Напиши -ing форму make: ___', 'making', 'Убираем немое e перед -ing.'),
    c('Выбери обычную форму: «Я знаю ответ».', ['I am knowing the answer.', 'I know the answer.', 'I knowing the answer.'], 'I know the answer.', 'Know в этом значении обычно не используют в Continuous.'),
  ]),
  lesson('can', 'Can / can’t: умения и разрешение', 'A1', [
    'Can + начальная форма глагола: умение, возможность или разрешение.',
    'Форма одна для всех: I can, she can. Вопрос: Can you ...? Отрицание: cannot / can’t.',
  ], ['She can swim. — Она умеет плавать.', 'Can I open the window? — Можно открыть окно?'], [
    'После can не ставим to и не добавляем -s.', 'Вопрос с can не требует do / does.'], [
    c('She can ___ well.', ['swims', 'to swim', 'swim'], 'swim', 'После can — начальная форма без to.'),
    g('Впиши can или does: ___ he play the guitar? — Yes, he can.', 'can', 'Краткий ответ he can соответствует вопросу Can he ...?'),
    c('Выбери отрицание.', ['He doesn’t can drive.', 'He can’t drive.', 'He can’t drives.'], 'He can’t drive.', 'Can’t + начальная форма.'),
    g('Напиши полную форму can’t одним словом: ___', 'cannot', 'Полная форма: cannot.'),
    c('Попроси разрешение открыть дверь.', ['Can I open the door?', 'Do I can open the door?', 'Can I to open the door?'], 'Can I open the door?', 'Для разрешения: Can I + глагол?'),
  ]),
  lesson('daily-routine', 'Лексика: повседневные дела', 'A1', [
    'Learn phrases: wake up — просыпаться; get up — вставать; have breakfast — завтракать; go to work — идти на работу.',
    'Do homework — делать домашнее задание; go to bed — ложиться спать.',
  ], ['I get up at seven. — Я встаю в семь.', 'We have breakfast at home. — Мы завтракаем дома.'], [
    'Do homework, а не make homework.', 'Go to bed — без the, когда речь о том, чтобы лечь спать.'], [
    c('«Просыпаться» по-английски:', ['wake up', 'go to bed', 'have lunch'], 'wake up', 'Wake up — просыпаться.'),
    g('Впиши do или make: I ___ my homework after school.', 'do', 'Устойчивое сочетание: do homework.'),
    c('«Завтракать» по-английски:', ['do breakfast', 'have breakfast', 'make homework'], 'have breakfast', 'Have breakfast — завтракать; make breakfast — готовить завтрак.'),
    g('Впиши предлог: I go ___ work by bus.', 'to', 'Go to work — ехать / идти на работу.'),
    c('Выбери «ложиться спать».', ['go to the bed', 'go to bed', 'go in bed'], 'go to bed', 'Go to bed — ложиться спать.'),
  ], 'vocabulary'),
];

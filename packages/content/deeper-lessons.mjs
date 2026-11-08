// Авторские объяснения и примеры; внешние материалы вынесены в resources.mjs.
const extra = {
  'to-be': [
    ['Сначала найди, о ком говорим. I требует am; один человек he/she — is; несколько людей we/they — are. You всегда с are, даже если собеседник один.', 'Как собрать фразу: кто → am/is/are → описание или место. Для вопроса поменяй первые две части местами.'],
    ['You are my friend. — Ты мой друг. Разбор: you + are + кто ты для меня.', 'My dog is small. — Моя собака маленькая. Разбор: my dog = it, значит is.', 'We are in the classroom. — Мы в классе. Are связывает we и место.', 'Is your brother at home? — Твой брат дома? Is стоит перед тем, о ком спрашиваем.', 'I am not hungry. — Я не голоден. Not стоит сразу после am.'],
    ['Сравни: She is a teacher — кто она; She teaches English — что она делает. Is не добавляем перед каждым обычным глаголом.', 'Сокращения: I’m = I am; isn’t = is not; aren’t = are not. В кратком утвердительном ответе: Yes, I am, не Yes, I’m.'],
  ],
  pronouns: [
    ['Задай вопрос к слову: кто делает? → he/she/they. Кого видят или кому помогают? → him/her/them. Чья вещь перед названием? → his/her/their.', 'Выбирай my или mine по следующему слову: если дальше идёт название вещи, нужно my. Если название не повторяем, подходит mine.'],
    ['Ben is here. He is ready. — Бен здесь. Он готов. He заменяет имя в роли того, кто готов.', 'I help him. — Я помогаю ему. Him стоит после help.', 'They know us. — Они знают нас. They выполняют действие, us получают его.', 'These are our pencils. — Это наши карандаши. Our стоит перед pencils.', 'This coat is hers. — Это её пальто. После hers название вещи не повторяем.'],
    ['❌ Me am happy → ✅ I am happy. В начале фразы для того, кто счастлив, нужно I.', 'Her может означать и «её вещь», и «ей/её» после действия: her bag; I see her. Смотри на место слова в предложении.'],
  ],
  articles: [
    ['Перед выбором спроси: предмет можно посчитать? Он один? Собеседник уже понимает, о каком предмете речь? A/an подходят для одного ещё не определённого предмета.', 'The не означает «один»: он подходит и для нескольких известных предметов. A/an не ставим перед множественным числом.'],
    ['I need a pencil. — Мне нужен карандаш. Подойдёт любой, поэтому a.', 'Please close the door. — Пожалуйста, закрой дверь. Понятно, какую дверь, поэтому the.', 'She has an umbrella. — У неё зонт. Первый звук umbrella гласный: an.', 'The shoes by the bed are mine. — Туфли у кровати мои. Уточнение показывает, какие именно туфли.', 'I like dogs. — Я люблю собак. Говорим о собаках вообще, без артикля.'],
    ['❌ an book → ✅ a book. Выбор зависит от следующего звука, не от перевода слова.', 'Не ставь сразу два определителя: my bag, а не the my bag. Слово my уже показывает, чья это вещь.'],
  ],
  plurals: [
    ['Окончание множественного числа относится к существительному. Прилагательное рядом не меняется: one red apple → two red apples.', 'Не угадывай неправильные формы по русскому слову. Запоминай пары: tooth → teeth, mouse → mice. Для нового слова проверь словарь.'],
    ['Three red kites. — Три красных воздушных змея. -s получает kites, но не red.', 'Two dishes. — Два блюда. После sh добавляется -es.', 'Five babies. — Пять малышей. Согласная + y превращается в -ies.', 'Four toys. — Четыре игрушки. Перед y гласная, поэтому просто -s.', 'My feet are cold. — Мои ноги замёрзли. Foot меняется на feet, а рядом нужно are.'],
    ['❌ two childs → ✅ two children. У children уже есть значение множественного числа.', 'Не все слова на -f меняются одинаково: leaf → leaves, но roof → roofs. Такие слова лучше проверять по словарю.'],
  ],
  'there-is': [
    ['Эта конструкция отвечает на вопрос «что там есть?». Порядок: there is/are → предмет → место. Слово there в такой фразе не обязательно переводится как «там».', 'Для краткого ответа повторяем there: Is there a park? — Yes, there is. Are there shops? — No, there aren’t.'],
    ['There is a lamp beside the bed. — Возле кровати есть лампа. Сообщаем о наличии одного предмета.', 'There are four plates on the table. — На столе четыре тарелки. Plates — множественное число.', 'There is some juice in the glass. — В стакане немного сока. Juice здесь неисчисляемое, нужен is.', 'Is there a library near here? — Здесь рядом есть библиотека? В вопросе is идёт первым.', 'There aren’t any toys on the floor. — На полу нет игрушек. Для toys используем aren’t.'],
    ['Сравни: There is a cat in the box — сообщаем о кошке. The cat is in the box — говорим, где уже известная кошка.', '❌ There have two rooms → ✅ There are two rooms. Для наличия в месте используем be, не have.'],
  ],
  'have-got': [
    ['Сначала выбери have или has по тому, кто обладает вещью. My sister = she → has got. My friends = they → have got.', 'Краткий ответ строится без got: Have you got a ruler? — Yes, I have. Has he got a ruler? — No, he hasn’t.'],
    ['My sister has got a new bike. — У моей сестры новый велосипед. Sister = she.', 'The children have got a ball. — У детей есть мяч. Children = they.', 'Has your friend got a pet? — У твоего друга есть питомец? Has переносится в начало.', 'I haven’t got a ruler. — У меня нет линейки. Not добавляется к have.', 'Do they have a garden? — У них есть сад? Здесь выбрана конструкция have без got, поэтому do.'],
    ['❌ Has she got has a cat? → ✅ Has she got a cat? Не повторяй has внутри вопроса.', 'Про прошлое: I had a bike when I was six. В этом значении обычно had, а не have got.'],
  ],
  'present-simple': [
    ['Сначала реши, о чём речь: привычка, расписание или факт? Затем выбери форму по тому, кто действует. My mum = she; my friends = they.', 'Вопрос собирается так: Do/Does → кто → начальная форма → остальное. В отрицании: кто → don’t/doesn’t → начальная форма.'],
    ['My mum reads before bed. — Мама читает перед сном. Mum = she, поэтому reads.', 'We walk to school every day. — Мы каждый день ходим в школу пешком. Регулярное действие, we без -s.', 'The sun rises in the east. — Солнце встаёт на востоке. Это общий факт; the sun = it.', 'Does your friend play chess? — Твой друг играет в шахматы? -s уже отражено в does, поэтому play.', 'I don’t eat meat. — Я не ем мясо. После don’t идёт eat без изменений.'],
    ['Сравни: I read every evening — привычка; I am reading now — процесс сейчас. Смотри на смысл, а не только на одно знакомое слово.', '❌ She doesn’t likes milk → ✅ She doesn’t like milk. Does/doesn’t уже показывает третье лицо.'],
  ],
  'prepositions-time': [
    ['Удобный порядок выбора: точка на часах → at; конкретный день или дата → on; месяц, год или сезон → in. Это отправная схема, у устойчивых сочетаний есть особенности.', 'Если назван день и часть дня вместе, выбирай on: on Tuesday afternoon. Без дня: in the afternoon.'],
    ['The train leaves at six. — Поезд отправляется в шесть. Точка на часах: at.', 'We have art on Wednesday. — В среду у нас рисование. День недели: on.', 'School starts in September. — Учёба начинается в сентябре. Месяц: in.', 'I visit my gran on Sunday evening. — Я навещаю бабушку в воскресенье вечером. Есть конкретный день: on.', 'I practise English every morning. — Я занимаюсь английским каждое утро. После every предлог не ставим.'],
    ['❌ in Monday → ✅ on Monday. Дни недели требуют on.', 'Не копируй русское «в» одним предлогом: «в мае» — in May, «в пятницу» — on Friday, «в восемь» — at eight.'],
  ],
  'prepositions-place': [
    ['Смотри на отношение предмета к месту: внутри границ — in; на поверхности — on; под предметом — under. Не выбирай только по русскому «в/на».', 'At часто показывает место как точку или занятие: at the station, at school. In подчёркивает нахождение внутри: in the classroom.'],
    ['The toy is in the drawer. — Игрушка в ящике. Она внутри, поэтому in.', 'The note is on the fridge. — Записка на холодильнике. На его поверхности, поэтому on.', 'The shoes are under the chair. — Ботинки под стулом. Ниже него: under.', 'The bakery is between the bank and the café. — Пекарня между банком и кафе. Два ориентира: between.', 'Meet me at the school gate. — Встретимся у школьных ворот. Ворота — точка встречи: at.'],
    ['Сравни: in the car, но on the bus. Для транспорта запоминай устойчивые сочетания.', 'Next to — рядом, between — между. Для between назови два ориентира или понятную группу объектов.'],
  ],
  'present-continuous': [
    ['Конструктор фразы: кто → am/is/are → действие с -ing. Если убрать be, конструкция развалится. Отрицание not ставим после be.', 'Не каждое действие «вообще» происходит прямо сейчас. Сравни постоянную привычку и наблюдаемый процесс; глаголы состояния вроде want обычно идут в Simple.'],
    ['The baby is sleeping now. — Малыш сейчас спит. Baby = it/he/she, поэтому is.', 'We are making a cake. — Мы сейчас готовим торт. We требует are; make → making.', 'Are they playing outside? — Они сейчас играют на улице? Are переходит в начало.', 'I am not using your pen. — Я сейчас не пользуюсь твоей ручкой. Not стоит после am.', 'He is running to the bus. — Он бежит к автобусу. Run → running: удваивается n.'],
    ['❌ They playing → ✅ They are playing. Не забывай are.', 'Сравни: She plays tennis on Saturdays — привычка; She is playing tennis now — процесс сейчас.'],
  ],
  can: [
    ['Can не меняется по лицам: I can, he can, they can. Следующий глагол тоже остаётся в начальной форме.', 'Для вопроса поменяй порядок: You can draw → Can you draw? Для ответа достаточно Yes, I can / No, I can’t.'],
    ['My brother can skate. — Мой брат умеет кататься на коньках. Без окончания -s после can.', 'Can you draw a tree? — Ты умеешь нарисовать дерево? Can стоит перед you.', 'I can’t reach the shelf. — Я не могу дотянуться до полки. Can’t обозначает невозможность.', 'Can we sit here? — Можно нам здесь сесть? Это просьба о разрешении.', 'Yes, she can. — Да, она умеет. В кратком ответе не повторяем основной глагол.'],
    ['❌ Do you can sing? → ✅ Can you sing? Не добавляй do к can.', 'Can — умение или возможность; like — нравится. I can swim не означает, что мне обязательно нравится плавать.'],
  ],
  'daily-routine': [
    ['Учи действия целыми сочетаниями: brush my teeth, get dressed, have lunch. Так не придётся переводить каждое слово отдельно.', 'Для последовательности пригодятся first — сначала, then — потом, after that — после этого. Регулярные действия описываем в Present Simple.'],
    ['I brush my teeth after breakfast. — Я чищу зубы после завтрака. Запоминаем brush my teeth целиком.', 'She gets dressed at seven. — Она одевается в семь. She требует gets.', 'We have lunch at school. — Мы обедаем в школе. Have lunch — обедать.', 'First I do my homework, then I play. — Сначала делаю уроки, потом играю. First и then показывают порядок.', 'I go to bed at nine. — Я ложусь спать в девять. Go to bed — готовое сочетание.'],
    ['Wake up — проснуться; get up — встать с кровати. Между ними может пройти время.', '❌ make my teeth → ✅ brush my teeth. Для чистки зубов нужен brush.'],
  ],
  'past-simple': [
    ['Определи, завершилось ли время события: yesterday, last month или конкретная дата в прошлом. Для таких событий тренируем Past Simple.', 'Правильные глаголы: live → lived, study → studied, stop → stopped. Неправильные формы нужно учить отдельно: see → saw, buy → bought.'],
    ['We cleaned our room yesterday. — Мы убрали комнату вчера. Clean — правильный глагол, добавляем -ed.', 'She bought a notebook last week. — На прошлой неделе она купила тетрадь. Buy → bought.', 'Did you see the rainbow? — Ты видел радугу? После did — see, не saw.', 'He didn’t finish the puzzle. — Он не закончил пазл. После didn’t — finish.', 'Was your lesson interesting? — Урок был интересным? У be своя форма вопроса, без did.'],
    ['❌ Did she visited you? → ✅ Did she visit you? Прошлое уже показано словом did.', 'В утверждении обычный глагол сам принимает прошедшую форму: She visited, без did, если не нужно особое усиление.'],
  ],
  'past-continuous': [
    ['Представь стоп-кадр вчерашнего дня: что было в процессе в этот момент? I/he/she/it was; you/we/they were; затем -ing.', 'Если произошло короткое событие, его можно поставить в Past Simple, а продолжающееся фоновое действие — в Past Continuous.'],
    ['At four, I was doing my homework. — В четыре я делал уроки. Это процесс в указанное время.', 'She was drawing when I came in. — Она рисовала, когда я вошёл. Рисование — фон; came — событие.', 'They were not listening. — Они не слушали. Not стоит после were.', 'Were you waiting for me? — Ты ждал меня? Were ставим перед you.', 'While I was reading, my sister was building a tower. — Пока я читал, сестра строила башню. Два параллельных процесса.'],
    ['❌ We was playing → ✅ We were playing. С we нужен were.', 'Сравни: I read the book yesterday — законченное событие; I was reading at eight — процесс в восемь, завершение не указано.'],
  ],
  'future-forms': [
    ['Выбирай по намерению: обещание или решение сейчас — часто will; заранее принятое намерение — going to; договорённость — Present Continuous.', 'Вопросы строятся по выбранной форме: Will you come? Are you going to come? Are you coming tomorrow? Не смешивай вспомогательные слова.'],
    ['I’ll carry your bag. — Я понесу твою сумку. Предложение помощи в момент речи.', 'We are going to paint our room. — Мы собираемся покрасить комнату. Намерение уже есть.', 'She is meeting her friend after school. — После школы она встречается с подругой. Договорённость.', 'I won’t forget your birthday. — Я не забуду твой день рождения. Won’t = will not.', 'Are you going to join us? — Ты собираешься к нам присоединиться? Вопрос начинается с are.'],
    ['❌ She going to come → ✅ She is going to come. У going to должно быть be.', 'Возможны разные будущие формы с близким смыслом. Без контекста нельзя считать каждую альтернативу ошибкой.'],
  ],
  'present-perfect': [
    ['В конструкции две части: have/has и третья форма. Для правильных глаголов она совпадает с -ed; у неправильных своя: write → written.', 'Опыт до сейчас: ever/never. Длительность до сейчас: for + промежуток, since + начальная точка. С законченным вчерашним временем обычно Past Simple.'],
    ['I have made a paper boat. — Я сделал бумажный кораблик. Сейчас можно показать результат.', 'She has never tried skating. — Она никогда не пробовала кататься на коньках. Речь об опыте до сейчас.', 'Have you finished your drawing? — Ты закончил рисунок? Важен нынешний результат.', 'We have lived here for two years. — Мы живём здесь два года. Период продолжается до сейчас.', 'He moved here in 2021. — Он переехал сюда в 2021 году. Указано завершённое прошлое: Past Simple.'],
    ['❌ She have finished → ✅ She has finished. Для she нужен has.', 'For two weeks — как долго; since Monday — с какого момента. Не путай for и since.'],
  ],
  comparisons: [
    ['Сравнение двух объектов: comparative + than. Самый среди группы: the + superlative. Для коротких слов часто -er/-est, для длинных — more/most.', 'Окончание -y после согласной меняется на -i: easy → easier → easiest. Одна гласная между согласными в big даёт bigger/biggest.'],
    ['This road is shorter than that one. — Эта дорога короче той. Сравниваем две дороги.', 'My bag is heavier than yours. — Моя сумка тяжелее твоей. Heavy → heavier.', 'This game is more exciting than the old one. — Эта игра увлекательнее старой. Длинное exciting требует more.', 'She is the fastest runner in our class. — Она самая быстрая бегунья в нашем классе. Выбираем одну из группы.', 'Today is better than yesterday. — Сегодня лучше, чем вчера. Good → better — особая форма.'],
    ['❌ the most tallest → ✅ the tallest. Не сочетай most и -est.', 'Than — «чем» в сравнении; then — «потом». Эти слова похожи по написанию, но выполняют разные задачи.'],
  ],
  quantifiers: [
    ['Сначала выбери тип существительного: штуки, которые считаем, или масса/понятие. Затем выбирай many/much и a few/a little.', 'A lot of подходит к обоим типам. Some/any зависят не только от вопросительного знака: в предложении угощения и просьбах часто используется some.'],
    ['There are a few cookies left. — Осталось несколько печений. Cookies можно посчитать.', 'Add a little milk. — Добавь немного молока. Milk здесь неисчисляемое.', 'Do you have any questions? — Есть вопросы? В обычном вопросе подходит any.', 'Can I have some bread, please? — Можно мне немного хлеба? Это просьба, поэтому some естественно.', 'There is a lot of snow outside. — На улице много снега. A lot of подходит к неисчисляемому snow.'],
    ['❌ many information → ✅ much information / a lot of information. Information неисчисляемое.', 'A few — немного, но есть; few — мало, почти нет. Артикль a может менять оттенок смысла.'],
  ],
  modals: [
    ['Спроси себя: я советую, требую, запрещаю или говорю, что делать необязательно? Эти смыслы выбирают разные конструкции.', 'Should и must не меняются по лицам. Have to меняется: I have to, she has to; вопросы с do/does: Does she have to ...?'],
    ['You should take a break. — Тебе стоит сделать перерыв. Это совет.', 'We have to be at school by nine. — Мы должны быть в школе к девяти. Это требование расписания.', 'He has to wear a uniform. — Он должен носить форму. He → has to.', 'You mustn’t touch this switch. — Этот выключатель трогать нельзя. Это запрет.', 'You don’t have to bring food. — Еду приносить необязательно. Можно принести, но необходимости нет.'],
    ['❌ She musts go → ✅ She must go. У must нет окончания -s.', 'Сравни: You mustn’t run here — бегать запрещено; You don’t have to run — бежать необязательно.'],
  ],
  'gerund-infinitive': [
    ['Когда два действия идут подряд, вторую форму часто определяет первое слово: enjoy + -ing; decide + to. Запоминай сочетание, а не только перевод.', 'После обычного предлога второй глагол обычно получает -ing: after eating, before leaving. Но to в want to — часть инфинитива.'],
    ['We enjoy making things. — Нам нравится мастерить. После enjoy стоит making.', 'He hopes to win the game. — Он надеется выиграть игру. После hope — to win.', 'She finished drawing the map. — Она закончила рисовать карту. После finish — drawing.', 'Wash your hands before eating. — Вымой руки перед едой. После предлога before — eating.', 'They decided to walk home. — Они решили идти домой пешком. После decide — to walk.'],
    ['❌ I want learning → ✅ I want to learn. После want используем to + глагол.', 'Stop doing — прекратить действие; stop to do — остановиться ради другого действия. Для таких глаголов форма меняет смысл.'],
  ],
};

export function deepenLesson(lesson, sections) {
  const addition = extra[lesson.id];
  if (!addition) return lesson;
  const expanded = { rule: [...sections.rule, ...addition[0]], examples: [...sections.examples, ...addition[1]], traps: [...sections.traps, ...addition[2]] };
  return { ...lesson, version: lesson.version + 1, theory: [expanded.rule.join('\n'), `Примеры:\n${expanded.examples.join('\n')}`, `Ловушки:\n${expanded.traps.join('\n')}`].join('\n\n') };
}

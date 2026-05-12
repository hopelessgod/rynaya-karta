import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════ */
const RUNE_CHARS = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ','ᛇ','ᛈ','ᛉ','ᛋ','ᛏ','ᛒ','ᛖ','ᛗ','ᛚ','ᛜ','ᛞ','ᛟ'];

const RUNES = [
  {id:0, sym:'ᚠ', name:'Феху',    lat:'Fehu',    planet:'Луна',       zodiac:'Телец',    meaning:'Богатство · Ресурс · Жизненная сила',       detail:'Феху — руна первозданной силы, текущей как река. Она описывает способность накапливать, удерживать и умножать — не только деньги, но саму жизненную энергию. Луна как её астрологический архетип хранит то, что питает нас изнутри. В натальной карте Феху указывает на природный ресурс, который доступен человеку от рождения.'},
  {id:1, sym:'ᚢ', name:'Уруз',    lat:'Uruz',    planet:'Плутон',     zodiac:'Овен',     meaning:'Первичная сила · Обновление · Инстинкт',    detail:'Уруз — дикий тур, не знающий узды. Это руна трансформации через столкновение с первозданным. Плутон как её зеркало несёт ту же разрушительную обновляющую силу. Там, где Уруз появляется в карте, человек рано или поздно встречается со своей природной мощью — и либо её осваивает, либо она сминает его.'},
  {id:2, sym:'ᚦ', name:'Турисаз', lat:'Thurisaz', planet:'Сатурн',    zodiac:'Козерог',  meaning:'Граница · Испытание · Шип судьбы',         detail:'Турисаз — шип, защищающий и ранящий. Сатурн как учитель через ограничение. Эта руна говорит о том, что не всякий путь открыт — и это не наказание, а указание. Где в карте стоит Турисаз, там судьба ставит шлагбаум, требуя зрелости перед движением дальше.'},
  {id:3, sym:'ᚨ', name:'Ансуз',   lat:'Ansuz',   planet:'Меркурий',  zodiac:'Близнецы', meaning:'Слово · Послание · Голос богов',            detail:'Ансуз — дыхание Одина, превращённое в речь. Меркурий как вестник несёт то же значение: информация, связь, способность называть невидимое словом. Ансуз в карте указывает на особую связь с информационным полем — умение слышать то, что другие пропускают.'},
  {id:4, sym:'ᚱ', name:'Райдо',   lat:'Raidho',  planet:'Юпитер',    zodiac:'Весы',     meaning:'Путь · Закон · Движение по судьбе',        detail:'Райдо — руна дороги и правосудия. Юпитер расширяет горизонты, Весы ищут баланс — вместе они описывают путь, проложенный честью и законом. Там, где стоит Райдо, человек находит своё движение не через силу, а через правильное направление.'},
  {id:5, sym:'ᚲ', name:'Кано',    lat:'Kano',    planet:'Марс',      zodiac:'Овен',     meaning:'Огонь · Страсть · Заклание в горне',       detail:'Кано — факел, освещающий тьму. Марс в Овне — чистый порыв, лишённый страха. Эта руна говорит о том, что сила рождается через погружение в огонь, а не уклонение от него. Кано требует полной самоотдачи в точке своего проявления.'},
  {id:6, sym:'ᚷ', name:'Гебо',    lat:'Gebo',    planet:'Уран',      zodiac:'Водолей',  meaning:'Дар · Партнёрство · Равный обмен',         detail:'Гебо — руна дара и баланса в союзе. Уран в Водолее открывает новые формы партнёрства, выходящие за рамки привычного. Истинный дар требует равного ответа — Гебо всегда указывает на взаимность, без которой связь разрушается.'},
  {id:7, sym:'ᚹ', name:'Вуньо',   lat:'Wunjo',   planet:'Солнце',    zodiac:'Дева',     meaning:'Радость · Гармония · Свет после тьмы',     detail:'Вуньо — руна совершенства, достигнутого через кропотливый труд. Солнце в Деве сияет не ярко, но ровно — и именно в этом его особая красота. Вуньо в карте указывает на зону подлинной радости, которая приходит не через случай, а через мастерство.'},
  {id:8, sym:'ᚺ', name:'Хагалаз', lat:'Hagalaz', planet:'Нептун',    zodiac:'Рыбы',     meaning:'Разрушение · Хаос · Очищение через кризис', detail:'Хагалаз — ледяной град, разрушающий старые структуры. Нептун несёт растворение границ. Вместе они описывают судьбоносные катастрофы, которые в итоге оказываются очищением. Там, где стоит Хагалаз, человек однажды всё теряет — и обнаруживает, что потерял только лишнее.'},
  {id:9, sym:'ᚾ', name:'Наутиз',  lat:'Nauthiz', planet:'Сатурн',    zodiac:'Стрелец',  meaning:'Нужда · Путы · Необходимость как учитель', detail:'Наутиз — узда на скачущем коне. Сатурн в Стрельце говорит: твои идеалы прекрасны, но сначала — выдержи испытание реальностью. Наутиз показывает, где человек ощущает сжатие, — и именно там скрыт источник его силы.'},
  {id:10,sym:'ᛁ', name:'Иса',     lat:'Isa',     planet:'Марс',      zodiac:'Скорпион', meaning:'Лёд · Остановка · Скрытый контроль',       detail:'Иса — сосулька с жалом. Марс в Скорпионе — ярость, сдержанная под ледяной поверхностью. Руна паузы перед решающим ударом, холодного расчёта и несломленной воли. Иса требует терпения там, где всё внутри кричит о действии.'},
  {id:11,sym:'ᛃ', name:'Йера',    lat:'Jera',    planet:'Юпитер',    zodiac:'Дева',     meaning:'Урожай · Цикл · Время как союзник',        detail:'Йера — руна правильного времени. Юпитер в Деве говорит: великое строится терпением, не порывом. Каждый цикл завершается урожаем тому, кто работал в срок. Там, где стоит Йера, нельзя торопить — можно только выращивать.'},
  {id:12,sym:'ᛇ', name:'Эйваз',   lat:'Eihwaz',  planet:'Прозерпина',zodiac:'Стрелец',  meaning:'Ось мира · Трансформация · Путь между мирами', detail:'Эйваз — тис, дерево смерти и вечности. Прозерпина проходит между мирами и возвращается изменённой. Эта руна описывает трансформацию через добровольное погружение в тьму. Кто не боится спуститься — поднимается иным.'},
  {id:13,sym:'ᛈ', name:'Перт',    lat:'Perth',   planet:'Нептун',    zodiac:'Рак',      meaning:'Тайна · Судьба · Лоно скрытого',           detail:'Перт — закрытый кубок судьбы. Нептун в Раке — глубина бессознательного, память рода, скрытые привязанности. То, что не называется вслух, но определяет всё. Перт в карте указывает на скрытый ресурс или скрытую уязвимость — и то и другое работает вне сознания.'},
  {id:14,sym:'ᛉ', name:'Алгиз',   lat:'Algiz',   planet:'Уран',      zodiac:'Рак',      meaning:'Защита · Связь с богами · Прорыв',         detail:'Алгиз — рога лося, поднятые к небу. Уран как прорыв в неизведанное. Эта руна одновременно защищает и призывает — она говорит об особой связи с высшими силами. Где стоит Алгиз, человек чувствует над собой покровительство — и несёт за него ответственность.'},
  {id:15,sym:'ᛋ', name:'Совело',  lat:'Sowilo',  planet:'Солнце',    zodiac:'Лев',      meaning:'Солнце · Статус · Путь победы',            detail:'Совело — молния солнца, пробивающая тучи. Солнце во Льве — архетип царственного самовыражения. Эта руна говорит о праве сиять, вести и быть замеченным. Совело в карте — это зона непобедимости, когда человек действует из своей настоящей природы.'},
  {id:16,sym:'ᛏ', name:'Тейваз',  lat:'Tiwaz',   planet:'Марс',      zodiac:'Овен',     meaning:'Воля · Победа через жертву · Копьё',       detail:'Тейваз — рука бога, вложенная в пасть волка. Марс в Овне — герой, готовый пожертвовать собой ради высшей правды. Руна честной борьбы без оглядки на цену. Там, где стоит Тейваз, от человека требуется настоящее мужество — не показное, а тихое.'},
  {id:17,sym:'ᛒ', name:'Беркана', lat:'Berkano', planet:'Венера',    zodiac:'Телец',    meaning:'Женское начало · Рождение · Красота',      detail:'Беркана — берёза, символ возрождения после зимы. Венера в Тельце — чувственная красота, материнская нежность, способность создавать новую жизнь из любви. Беркана в карте указывает на зону плодородия — там, где человек способен взрастить нечто по-настоящему живое.'},
  {id:18,sym:'ᛖ', name:'Эваз',    lat:'Ehwaz',   planet:'Меркурий',  zodiac:'Близнецы', meaning:'Движение · Полёт · Открытые пути',         detail:'Эваз — конь и всадник как единое существо. Меркурий в Близнецах — скорость мысли, открытые коммуникации, способность существовать в двух мирах одновременно. Там, где стоит Эваз, человек обретает особую подвижность — мысли, тела или судьбы.'},
  {id:19,sym:'ᛗ', name:'Манназ',  lat:'Mannaz',  planet:'Солнце',    zodiac:'Водолей',  meaning:'Человек · Разум · Самосознание',           detail:'Манназ — зеркало человечности. Солнце в Водолее — индивидуальность, выражающая себя через служение большему. Эта руна описывает способность видеть себя со стороны и принять свою уникальность без стыда. Манназ в карте — зона зрелой самоидентификации.'},
  {id:20,sym:'ᛚ', name:'Лагуз',   lat:'Laguz',   planet:'Нептун',    zodiac:'Рыбы',     meaning:'Воды · Поток · Бессознательное',           detail:'Лагуз — река, текущая из глубины. Нептун как растворение в большем. Эта руна говорит о силе, которая приходит не из контроля, а из доверия течению. Там, где стоит Лагуз, сопротивление истощает — и только принятие открывает путь.'},
  {id:21,sym:'ᛜ', name:'Ингуз',   lat:'Ingwaz',  planet:'Венера',    zodiac:'Телец',    meaning:'Плодородие · Накопление · Семя силы',      detail:'Ингуз — семя, хранящее в себе целый лес. Венера в знаке накопления говорит: не торопись, всё великое созревает медленно. Эта руна описывает внутренний ресурс, который нельзя растратить — только не замечать. Ингуз в карте — указание на скрытый потенциал.'},
  {id:22,sym:'ᛞ', name:'Дагаз',   lat:'Dagaz',   planet:'Хирон',     zodiac:'Близнецы', meaning:'Рассвет · Переход · Исцеление через осознание', detail:'Дагаз — момент между тьмой и светом. Хирон как целитель, прошедший через собственную рану. Эта руна описывает исцеление, которое возможно только через полное принятие. Там, где стоит Дагаз, скрыта точка перехода — из старого «я» в новое.'},
  {id:23,sym:'ᛟ', name:'Отила',   lat:'Othala',  planet:'Сатурн',    zodiac:'Козерог',  meaning:'Наследие · Традиция · Страж границ',       detail:'Отила — родовая земля, переданная по наследству. Сатурн в Козероге — хранитель традиций, архитектор долгосрочного. Эта руна говорит о том, что истинное богатство — это то, что можно передать дальше. Там, где стоит Отила, человек несёт ответственность перед родом.'},
];

const FAQ = [
  {q:'Как руна выбирается для каждой точки карты?', a:'Каждая планета натальной карты имеет своё рунное соответствие, выведенное из системы символических резонансов. Солнце — Совело, Луна — Феху, Марс — Тейваз. Это доказательная система, разработанная на основе мифологии, архетипической психологии и астрологической традиции — а не произвольный выбор.'},
  {q:'Зачем мне точное время рождения?', a:'Время рождения определяет асцендент — восходящий градус зодиака в момент появления на свет. Без точного времени разбор будет неполным: вы получите только общие черты, без персональной динамики рунного ряда. Если времени нет — работаем с тем, что есть, с пометкой.'},
  {q:'Что я получаю бесплатно после ввода данных?', a:'Одну руну — по знаку вашего Солнца. Это стержневая руна, показывающая вашу базовую стратегию жизни: как вы действуете, в чём черпаете силу, что ведёт вас через тёмные периоды. Короткое описание — без рекомендаций. Полный разбор доступен в пакетах.'},
  {q:'Чем три пакета отличаются друг от друга?', a:'«Карта Себя» — PDF с полным разбором всех 10 рун натальной карты. «Путь Изменения» — добавляется персональный рунный став и практические рекомендации. «Лично с Мастером» — всё вышеперечисленное плюс консультация 60–90 минут и 30 дней личного чата.'},
  {q:'Сколько времени занимает разбор после оплаты?', a:'Обычно 3–5 рабочих дней. В высокий сезон — до 7 дней. Вы получите уведомление на email, как только разбор будет готов. Для пакета «Лично с Мастером» — запись на консультацию через календарь сразу после оплаты.'},
  {q:'Это магия или психология?', a:'Это психология через язык символов. Руны — архетипический язык, который существовал тысячелетия именно потому, что описывает реальные паттерны человеческой психики. Мы работаем с вашей картой рационально — как с зеркалом вашей структуры, не как с предсказанием.'},
  {q:'Можно подарить разбор другому человеку?', a:'Да. При оформлении укажите данные того, кому предназначен разбор — дату, время и место рождения, а также контактный email. Разбор будет отправлен напрямую получателю или вам — по желанию.'},
  {q:'Как с возвратом, если что-то не подойдёт?', a:'Если разбор не соответствует заявленному качеству или содержит очевидные ошибки — мы переделаем его или вернём деньги. Возврат по причине «не понравилось содержание» не предусмотрен, так как работа является авторской и персонализированной.'},
];

/* ═══════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Cinzel:wght@400;500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --black:#060403;
  --deep:#0c0906;
  --bark:#16100a;
  --amber:#c4861c;
  --gold:#d4ab4e;
  --gold-pale:#e8d088;
  --smoke:#e8ddd0;
  --stone:#8a7d6e;
  --ash:#4a4238;
  --ease:cubic-bezier(0.16,1,0.3,1);
}
html{scroll-behavior:smooth;font-size:16px}
body{background:var(--black);color:var(--smoke);font-family:'Cormorant Garamond',Georgia,serif;overflow-x:hidden;cursor:default}
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-track{background:var(--black)}
::-webkit-scrollbar-thumb{background:var(--ash);border-radius:2px}
a{text-decoration:none;color:inherit}
button{font-family:inherit;cursor:pointer}
input,select{font-family:inherit}

/* ── GRAIN OVERLAY ── */
#grain{position:fixed;inset:0;z-index:9998;pointer-events:none;opacity:.038;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");background-size:200px}

/* ── NAVBAR ── */
.nav{position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:100;display:flex;align-items:center;gap:36px;padding:13px 28px;border-radius:60px;background:rgba(6,4,3,.35);backdrop-filter:blur(24px) saturate(180%);border:1px solid rgba(196,134,28,.18);transition:all .6s var(--ease);white-space:nowrap}
.nav.scrolled{background:rgba(6,4,3,.88);border-color:rgba(196,134,28,.3);box-shadow:0 8px 48px rgba(0,0,0,.45)}
.nav-logo{font-family:'Cinzel',serif;font-size:14px;letter-spacing:5px;color:var(--gold-pale);font-weight:500}
.nav-links{display:flex;gap:28px;list-style:none}
.nav-link{font-family:'Cinzel',serif;font-size:9px;letter-spacing:3px;color:var(--stone);text-transform:uppercase;position:relative;transition:color .3s;padding:4px 0}
.nav-link::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:var(--amber);transition:width .45s var(--ease)}
.nav-link:hover{color:var(--smoke)}
.nav-link:hover::after{width:100%}
.cta-pill{font-family:'Cinzel',serif;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--amber);border:1px solid rgba(196,134,28,.5);border-radius:60px;padding:10px 22px;background:transparent;position:relative;overflow:hidden;transition:color .4s,border-color .3s}
.cta-pill::before{content:'';position:absolute;inset:0;background:var(--amber);transform:scaleX(0);transform-origin:left;transition:transform .5s var(--ease);border-radius:60px}
.cta-pill:hover{color:var(--black);border-color:var(--amber)}
.cta-pill:hover::before{transform:scaleX(1)}
.cta-pill span{position:relative;z-index:1}

/* ── HERO ── */
.hero{position:relative;min-height:100vh;display:flex;align-items:center;overflow:hidden}
.hero-bg{position:absolute;inset:0;z-index:0;background:radial-gradient(ellipse 55% 75% at 72% 52%,rgba(160,80,8,.38) 0%,rgba(100,48,4,.18) 45%,transparent 68%),radial-gradient(ellipse 32% 44% at 68% 80%,rgba(110,52,4,.42) 0%,transparent 48%),radial-gradient(ellipse 70% 65% at 22% 55%,rgba(12,8,3,.96) 0%,transparent 65%),linear-gradient(168deg,#050302 0%,#110b06 50%,#0a0804 100%)}
.hero-img{position:absolute;inset:0;z-index:1;background-size:cover;background-position:center 30%;opacity:.52;transition:opacity 1s}
.hero-vignette{position:absolute;inset:0;z-index:2;background:radial-gradient(ellipse at 50% 50%,transparent 20%,rgba(6,4,3,.65) 75%),linear-gradient(to right,rgba(6,4,3,.9) 0%,rgba(6,4,3,.4) 40%,transparent 65%),linear-gradient(to bottom,rgba(6,4,3,.3) 0%,transparent 25%,transparent 65%,rgba(6,4,3,.85) 100%)}
.hero-content{position:relative;z-index:10;padding:0 8vw;max-width:620px}
.hero-eyebrow{font-family:'Cinzel',serif;font-size:10px;letter-spacing:5px;color:var(--amber);text-transform:uppercase;display:block;margin-bottom:28px;opacity:0;animation:fadeUp 1.2s var(--ease) .3s forwards}
.hero-title{font-family:'Cormorant Garamond',serif;font-size:clamp(1.8rem,4vw,3.6rem);font-weight:300;line-height:1.25;font-style:italic;color:var(--smoke);margin-bottom:24px;opacity:0;animation:fadeUp 1.4s var(--ease) .5s forwards}
.hero-title em{font-style:normal;color:var(--gold-pale)}
.hero-sub{font-size:clamp(.95rem,1.4vw,1.1rem);font-weight:300;color:var(--stone);line-height:1.75;max-width:460px;margin-bottom:48px;opacity:0;animation:fadeUp 1.4s var(--ease) .7s forwards}
.hero-btns{display:flex;gap:14px;flex-wrap:wrap;opacity:0;animation:fadeUp 1.4s var(--ease) .9s forwards}
.hero-agaya{position:absolute;right:-1vw;top:50%;transform:translateY(-50%);font-family:'Cinzel',serif;font-size:clamp(6rem,14vw,16rem);font-weight:600;color:transparent;-webkit-text-stroke:1px rgba(196,134,28,.12);user-select:none;pointer-events:none;z-index:5;line-height:1;letter-spacing:-3px;opacity:0;animation:fadeIn 2.5s var(--ease) 1.2s forwards}
.hero-scroll{position:absolute;bottom:40px;left:50%;transform:translateX(-50%);z-index:10;font-family:'Cinzel',serif;font-size:8px;letter-spacing:4px;color:var(--ash);text-transform:uppercase;display:flex;flex-direction:column;align-items:center;gap:10px;opacity:0;animation:fadeIn 2s var(--ease) 1.5s forwards}
.hero-scroll-line{width:1px;height:40px;background:linear-gradient(to bottom,transparent,var(--amber));animation:pulse 2.5s ease-in-out infinite}

/* ── BUTTONS ── */
.btn-main{font-family:'Cinzel',serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;padding:16px 36px;background:var(--amber);color:var(--black);border:none;border-radius:60px;position:relative;overflow:hidden;transition:transform .3s var(--ease),box-shadow .3s;box-shadow:0 0 28px rgba(196,134,28,.28)}
.btn-main:hover{transform:translateY(-2px);box-shadow:0 4px 40px rgba(196,134,28,.5)}
.btn-ghost{font-family:'Cinzel',serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;padding:16px 36px;background:transparent;color:var(--smoke);border:1px solid rgba(232,221,208,.22);border-radius:60px;transition:all .4s var(--ease)}
.btn-ghost:hover{border-color:rgba(196,134,28,.45);color:var(--gold-pale);background:rgba(196,134,28,.07)}

/* ── WHEEL ── */
.wheel-wrap{position:absolute;right:5vw;top:50%;transform:translateY(-50%);z-index:8;cursor:grab;user-select:none}
.wheel-wrap:active{cursor:grabbing}

/* ── SECTIONS ── */
.sec{position:relative;padding:110px 8vw}
.sec-dark{background:#09070400}
.sec-deeper{background:var(--deep)}
.sec-label{font-family:'Cinzel',serif;font-size:9px;letter-spacing:5px;color:var(--amber);text-transform:uppercase;display:block;margin-bottom:14px}
.sec-title{font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,4vw,3.4rem);font-weight:300;font-style:italic;color:var(--smoke);line-height:1.2;margin-bottom:60px}
.divider{text-align:center;padding:14px 0;font-size:14px;color:rgba(196,134,28,.18);letter-spacing:14px;user-select:none}

/* ── FORM ── */
.form-wrap{max-width:560px;margin:0 auto;padding:0}
.f-label{font-family:'Cinzel',serif;font-size:9px;letter-spacing:3px;color:var(--stone);text-transform:uppercase;display:block;margin-bottom:8px}
.f-input{width:100%;background:rgba(255,255,255,.055);border:1px solid rgba(196,134,28,.15);border-radius:6px;padding:16px 20px;color:var(--smoke);font-family:'Cormorant Garamond',serif;font-size:19px;outline:none;transition:border-color .3s,background .3s;margin-bottom:16px}
.f-input:focus{border-color:rgba(196,134,28,.55);background:rgba(255,255,255,.075)}
.f-input::placeholder{color:var(--ash)}
.f-row-2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.f-submit{width:100%;padding:20px;background:linear-gradient(135deg,var(--amber) 0%,#8c4a0a 100%);color:var(--black);border:none;border-radius:60px;font-family:'Cormorant Garamond',serif;font-size:22px;font-style:italic;transition:opacity .3s,transform .3s var(--ease),box-shadow .3s;box-shadow:0 4px 40px rgba(196,134,28,.45);margin-top:12px}
.f-submit:hover{opacity:.9;transform:translateY(-2px);box-shadow:0 8px 56px rgba(196,134,28,.6)}
.rune-rev{text-align:center;padding:40px 0 20px}
.rune-rev-sym{font-size:104px;color:var(--amber);display:block;line-height:1;margin-bottom:20px;animation:runeAppear 1.6s var(--ease) forwards;text-shadow:0 0 60px rgba(196,134,28,.55),0 0 120px rgba(196,134,28,.22)}
.rune-rev-name{font-family:'Cinzel',serif;font-size:13px;letter-spacing:4px;color:var(--gold-pale);text-transform:uppercase;margin-bottom:12px}
.rune-rev-meaning{font-size:17px;font-style:italic;color:var(--stone);margin-bottom:28px;line-height:1.6}
.rune-rev-note{font-family:'Cinzel',serif;font-size:9px;letter-spacing:2px;color:var(--ash);margin-bottom:28px;text-transform:uppercase}

/* ── PACKAGES ── */
.pkg-list-full{display:flex;flex-direction:column;gap:32px}
.pkg-card-full{background:rgba(14,10,6,.82);border:1px solid rgba(196,134,28,.12);border-radius:4px;overflow:hidden;transition:all .5s var(--ease)}
.pkg-card-full.feat{border-color:rgba(196,134,28,.3)}
.pkg-card-full:hover{border-color:rgba(196,134,28,.32);box-shadow:0 20px 60px rgba(0,0,0,.5),0 0 48px rgba(196,134,28,.07)}
.pkg-card-img-wrap{position:relative;height:200px;overflow:hidden}
.pkg-card-img-wrap img{width:100%;height:100%;object-fit:cover;opacity:.55;transition:opacity .5s}
.pkg-card-full:hover .pkg-card-img-wrap img{opacity:.72}
.pkg-card-img-wrap .pkg-img-overlay{position:absolute;inset:0;background:linear-gradient(to right,rgba(14,10,6,.88) 0%,rgba(14,10,6,.5) 38%,transparent 68%),linear-gradient(to bottom,transparent 30%,rgba(14,10,6,.65) 100%)}
.pkg-img-label{position:absolute;bottom:22px;left:32px;display:flex;align-items:center;gap:16px;z-index:5}
.pkg-sym{font-size:40px;color:rgba(196,134,28,.7);line-height:1;transition:color .4s}
.pkg-card-full:hover .pkg-sym{color:var(--amber);text-shadow:0 0 20px rgba(196,134,28,.5)}
.pkg-name{font-family:'Cinzel',serif;font-size:12px;letter-spacing:3px;color:var(--gold-pale);text-transform:uppercase;margin-bottom:4px}
.pkg-type-lbl{font-family:'Cormorant Garamond',serif;font-size:14px;font-style:italic;color:var(--stone)}
.pkg-body{display:grid;grid-template-columns:1fr 300px}
.pkg-body-left{padding:40px 44px}
.pkg-body-right{padding:40px 36px;background:rgba(8,5,2,.58);border-left:1px solid rgba(196,134,28,.1);display:flex;flex-direction:column;justify-content:space-between}
.pkg-desc{font-size:17px;font-style:italic;color:var(--stone);margin-bottom:0;line-height:1.7}
.pkg-what-title{font-family:'Cinzel',serif;font-size:8px;letter-spacing:3px;color:var(--ash);text-transform:uppercase;margin:24px 0 12px;display:block}
.pkg-list{list-style:none;margin-bottom:8px}
.pkg-list li{font-size:14px;color:var(--stone);padding:8px 0;border-bottom:1px solid rgba(196,134,28,.07);display:flex;gap:10px;align-items:flex-start}
.pkg-list li::before{content:'ᛟ';color:rgba(196,134,28,.5);flex-shrink:0;margin-top:1px}
.pkg-excl{list-style:none;margin-bottom:8px}
.pkg-excl li{font-size:14px;color:var(--ash);padding:7px 0;display:flex;gap:10px;align-items:flex-start}
.pkg-excl li::before{content:'×';color:rgba(196,134,28,.3);flex-shrink:0}
.pkg-price-label{font-family:'Cinzel',serif;font-size:8px;letter-spacing:4px;color:var(--stone);text-transform:uppercase;display:block;margin-bottom:14px}
.pkg-price{font-family:'Cormorant Garamond',serif;font-size:clamp(2.4rem,3.5vw,3.8rem);font-weight:300;color:var(--smoke);display:block;line-height:1;margin-bottom:10px;letter-spacing:-1px}
.pkg-price-note{font-size:13px;color:var(--stone);font-style:italic;margin-bottom:28px;line-height:1.5}
.pkg-buy-btn{width:100%;padding:17px;background:linear-gradient(135deg,var(--amber) 0%,#8c4a0a 100%);color:var(--black);border:none;border-radius:60px;font-family:'Cormorant Garamond',serif;font-size:18px;font-style:italic;transition:opacity .3s,transform .3s var(--ease);box-shadow:0 4px 32px rgba(196,134,28,.35)}
.pkg-buy-btn:hover{opacity:.88;transform:translateY(-1px);box-shadow:0 8px 48px rgba(196,134,28,.5)}
.pkg-buy-note{font-size:12px;color:var(--ash);text-align:center;margin-top:12px;font-style:italic;line-height:1.5}
.pkg-free-link{font-family:'Cinzel',serif;font-size:8px;letter-spacing:2px;color:var(--amber);text-transform:uppercase;cursor:pointer;background:none;border:none;padding-top:20px;opacity:.65;transition:opacity .3s;display:block;text-align:left}
.pkg-free-link:hover{opacity:1}
@media(max-width:900px){.pkg-body{grid-template-columns:1fr}.pkg-body-right{border-left:none;border-top:1px solid rgba(196,134,28,.1)}}

/* ── RUNES GRID ── */
.runes-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(125px,1fr));gap:14px}
.rune-tile{background:rgba(14,10,6,.6);border:1px solid rgba(196,134,28,.1);border-radius:2px;padding:22px 14px;text-align:center;cursor:pointer;transition:all .4s var(--ease)}
.rune-tile:hover{border-color:rgba(196,134,28,.38);transform:translateY(-4px) rotate(.4deg);box-shadow:0 14px 44px rgba(0,0,0,.45),0 0 22px rgba(196,134,28,.1)}
.rune-tile-sym{font-size:44px;color:rgba(196,134,28,.55);display:block;margin-bottom:10px;line-height:1;transition:all .4s}
.rune-tile:hover .rune-tile-sym{color:var(--amber);text-shadow:0 0 18px rgba(196,134,28,.55)}
.rune-tile-name{font-family:'Cinzel',serif;font-size:8px;letter-spacing:2px;color:var(--stone);text-transform:uppercase;display:block;margin-bottom:3px}
.rune-tile-sub{font-size:11px;color:var(--ash)}

/* ── MODAL ── */
.modal-bg{position:fixed;inset:0;z-index:200;background:rgba(6,4,3,.93);backdrop-filter:blur(24px);display:flex;align-items:center;justify-content:center;padding:40px;animation:fadeIn .4s var(--ease) forwards}
.modal-close{position:fixed;top:28px;right:32px;font-family:'Cinzel',serif;font-size:9px;letter-spacing:3px;color:var(--stone);background:none;border:none;text-transform:uppercase;transition:color .3s}
.modal-close:hover{color:var(--smoke)}
.modal-inner{max-width:560px;width:100%;animation:fadeUp .6s var(--ease) forwards}
.m-sym{font-size:100px;color:var(--amber);display:block;line-height:1;margin-bottom:20px;text-shadow:0 0 80px rgba(196,134,28,.5)}
.m-name{font-family:'Cinzel',serif;font-size:15px;letter-spacing:4px;color:var(--gold-pale);text-transform:uppercase;margin-bottom:6px}
.m-lat{font-family:'Cinzel',serif;font-size:9px;letter-spacing:3px;color:var(--ash);text-transform:uppercase;margin-bottom:28px}
.m-meta{display:flex;gap:36px;padding:18px 0;border-top:1px solid rgba(196,134,28,.14);border-bottom:1px solid rgba(196,134,28,.14);margin-bottom:28px}
.m-meta-lbl{font-family:'Cinzel',serif;font-size:8px;letter-spacing:3px;color:var(--ash);text-transform:uppercase;display:block;margin-bottom:3px}
.m-meta-val{font-size:16px;color:var(--stone)}
.m-meaning{font-size:13px;letter-spacing:1px;color:var(--amber);margin-bottom:20px}
.m-detail{font-size:17px;font-style:italic;color:var(--stone);line-height:1.85}

/* ── ABOUT ── */
.about-grid{display:grid;grid-template-columns:1fr 1.1fr;gap:80px;align-items:center}
.about-img-wrap{position:relative;aspect-ratio:3/4;background:var(--bark);overflow:hidden}
.about-img-wrap img{width:100%;height:100%;object-fit:cover;opacity:.85}
.about-img-placeholder{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,#1c1408,#0f0b06)}
.about-hero-section{position:relative;min-height:90vh;display:flex;align-items:flex-end;overflow:hidden}
.about-hero-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 15%;opacity:.48;z-index:1}
.about-hero-mask{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(105deg,var(--black) 0%,rgba(6,4,3,.75) 25%,rgba(6,4,3,.35) 50%,transparent 72%),linear-gradient(to bottom,rgba(6,4,3,.45) 0%,transparent 20%,transparent 52%,rgba(6,4,3,.98) 100%),radial-gradient(ellipse at 70% 40%,transparent 42%,rgba(6,4,3,.4) 82%)}
.about-hero-content{position:relative;z-index:5;padding:80px 8vw 90px;max-width:720px}
.about-quote{font-family:'Cormorant Garamond',serif;font-size:clamp(1.1rem,1.8vw,1.4rem);font-style:italic;font-weight:300;color:var(--gold-pale);line-height:1.7;margin-bottom:28px;border-left:2px solid var(--amber);padding-left:26px}
.about-p{font-size:17px;color:var(--stone);line-height:1.9;margin-bottom:22px}

/* ── FAQ ── */
.faq-item{border-bottom:1px solid rgba(196,134,28,.1)}
.faq-q{width:100%;text-align:left;background:none;border:none;padding:26px 0;display:flex;justify-content:space-between;align-items:center;gap:28px}
.faq-q-text{font-family:'Cormorant Garamond',serif;font-size:clamp(1rem,1.4vw,1.18rem);color:var(--smoke);font-weight:300}
.faq-icon{font-size:18px;color:var(--amber);flex-shrink:0;transition:transform .45s var(--ease)}
.faq-icon.open{transform:rotate(45deg)}
.faq-body{overflow:hidden;max-height:0;transition:max-height .55s var(--ease)}
.faq-body.open{max-height:220px}
.faq-body-inner{padding:0 0 26px;font-size:16px;color:var(--stone);line-height:1.85}

/* ── FOOTER ── */
.footer{background:#040302;border-top:1px solid rgba(196,134,28,.09);padding:72px 8vw 36px}
.f-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:44px;margin-bottom:56px}
.f-brand{font-family:'Cinzel',serif;font-size:18px;letter-spacing:5px;color:var(--gold-pale);display:block;margin-bottom:14px}
.f-tagline{font-size:14px;font-style:italic;color:var(--ash);line-height:1.7}
.f-col-title{font-family:'Cinzel',serif;font-size:8px;letter-spacing:3px;color:var(--amber);text-transform:uppercase;display:block;margin-bottom:18px}
.f-links{list-style:none}
.f-links li{margin-bottom:10px}
.f-links a{font-size:14px;color:var(--ash);transition:color .3s}
.f-links a:hover{color:var(--smoke)}
.f-bottom{border-top:1px solid rgba(196,134,28,.07);padding-top:28px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}
.f-runes{font-size:18px;color:rgba(196,134,28,.18);letter-spacing:6px}
.f-legal{font-size:12px;color:var(--ash)}

/* ── REVEAL ── */
.reveal{opacity:0;transform:translateY(28px);transition:opacity .9s var(--ease),transform .9s var(--ease)}
.reveal.vis{opacity:1;transform:translateY(0)}

/* ── KEYFRAMES ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes runeAppear{0%{opacity:0;filter:blur(20px);transform:scale(.75)}65%{opacity:1;filter:blur(2px);transform:scale(1.06)}100%{opacity:1;filter:blur(0);transform:scale(1)}}
@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
@keyframes breathe{0%,100%{transform:translateY(-50%) scale(1)}50%{transform:translateY(-50%) scale(1.015)}}
@keyframes wheelSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}

/* ── HAMBURGER BUTTON ── */
.nav-burger{display:none;flex-direction:column;justify-content:center;gap:5px;background:none;border:none;padding:6px;cursor:pointer;z-index:110}
.nav-burger span{display:block;width:22px;height:1.5px;background:var(--gold-pale);transition:all .45s var(--ease);transform-origin:center}
.nav-burger.open span:nth-child(1){transform:translateY(6.5px) rotate(45deg)}
.nav-burger.open span:nth-child(2){opacity:0;transform:scaleX(0)}
.nav-burger.open span:nth-child(3){transform:translateY(-6.5px) rotate(-45deg)}
/* ── MOBILE OVERLAY MENU ── */
.mob-menu{position:fixed;inset:0;z-index:105;background:rgba(6,4,3,.97);backdrop-filter:blur(32px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;opacity:0;pointer-events:none;transition:opacity .45s var(--ease)}
.mob-menu.open{opacity:1;pointer-events:all}
.mob-menu-link{font-family:'Cormorant Garamond',serif;font-size:clamp(2.2rem,10vw,4rem);font-weight:300;font-style:italic;color:var(--stone);background:none;border:none;padding:14px 0;line-height:1;transition:color .3s,transform .4s var(--ease),opacity .4s var(--ease);transform:translateY(24px);opacity:0;cursor:pointer}
.mob-menu.open .mob-menu-link{opacity:1;transform:translateY(0)}
.mob-menu.open .mob-menu-link:nth-child(1){transition-delay:.06s}
.mob-menu.open .mob-menu-link:nth-child(2){transition-delay:.11s}
.mob-menu.open .mob-menu-link:nth-child(3){transition-delay:.16s}
.mob-menu.open .mob-menu-link:nth-child(4){transition-delay:.21s}
.mob-menu-link:hover{color:var(--smoke)}
.mob-menu-divider{width:40px;height:1px;background:rgba(196,134,28,.2);margin:20px 0;opacity:0;transition:opacity .4s .28s var(--ease)}
.mob-menu.open .mob-menu-divider{opacity:1}
.mob-menu-cta{font-family:'Cormorant Garamond',serif;font-size:20px;font-style:italic;color:var(--black);background:linear-gradient(135deg,var(--amber) 0%,#8c4a0a 100%);border:none;border-radius:60px;padding:16px 48px;transition:opacity .3s,transform .4s var(--ease);transform:translateY(24px);opacity:0;cursor:pointer;box-shadow:0 4px 32px rgba(196,134,28,.4)}
.mob-menu.open .mob-menu-cta{opacity:1;transform:translateY(0);transition-delay:.28s}
.mob-menu-cta:hover{opacity:.88}
.mob-menu-label{font-family:'Cinzel',serif;font-size:8px;letter-spacing:4px;color:var(--ash);text-transform:uppercase;opacity:0;transition:opacity .4s .35s var(--ease);margin-top:12px}
.mob-menu.open .mob-menu-label{opacity:1}
/* ── RESPONSIVE ── */
@media(max-width:1024px){
  .wheel-wrap{display:none}
  .hero-agaya{font-size:clamp(5rem,12vw,10rem);opacity:.07}
}
@media(max-width:768px){
  .hero-agaya{display:none}
  .about-grid{grid-template-columns:1fr}
  .f-grid{grid-template-columns:1fr 1fr}
  .nav{width:calc(100% - 36px);justify-content:space-between;gap:0}
  .nav-links{display:none}
  .cta-pill{display:none}
  .nav-burger{display:flex}
}
@media(max-width:520px){
  .f-grid{grid-template-columns:1fr}
  .f-row-2{grid-template-columns:1fr}
  .hero-content{padding:0 6vw}
  .sec{padding:80px 6vw}
  .pkg-body{grid-template-columns:1fr}
  .pkg-body-right{border-left:none;border-top:1px solid rgba(196,134,28,.1)}
}
/* ── PAGE ROUTING ── */
.page-wrap{min-height:100vh;padding-top:80px}
.page-enter{animation:fadeUp .7s var(--ease) forwards}
/* ── HERO IMAGE (right side) ── */
.hero-right-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 25%;opacity:.42;z-index:1;transition:opacity 1.2s}
.hero-right-mask{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(105deg,var(--black) 0%,rgba(6,4,3,.92) 18%,rgba(6,4,3,.55) 40%,rgba(6,4,3,.18) 62%,transparent 80%),linear-gradient(to bottom,rgba(6,4,3,.65) 0%,transparent 18%,transparent 58%,rgba(6,4,3,.97) 100%),radial-gradient(ellipse at 72% 50%,transparent 36%,rgba(6,4,3,.52) 84%)}
/* ── WHEEL PANEL ── */
.wheel-layout{display:flex;align-items:center;gap:40px;justify-content:center;flex-wrap:wrap}
.wheel-svg-wrap{position:relative;flex-shrink:0;user-select:none;-webkit-user-select:none}
.wheel-svg-wrap svg{user-select:none;-webkit-user-select:none}
.wheel-arrow{position:absolute;top:6px;left:50%;transform:translateX(-50%);color:var(--amber);font-size:18px;z-index:10;line-height:1;filter:drop-shadow(0 0 8px rgba(196,134,28,.9));animation:pulse 2s ease-in-out infinite;pointer-events:none}
.wheel-info{width:260px;flex-shrink:0;padding:36px 28px;background:rgba(12,9,5,.88);backdrop-filter:blur(16px);border:1px solid rgba(196,134,28,.2);border-radius:3px;min-height:300px;transition:all .4s var(--ease)}
.wheel-info-sym{font-size:80px;color:var(--amber);display:block;line-height:1;margin-bottom:18px;text-shadow:0 0 50px rgba(196,134,28,.45);transition:all .4s}
.wheel-info-name{font-family:'Cinzel',serif;font-size:13px;letter-spacing:3px;color:var(--gold-pale);text-transform:uppercase;margin-bottom:4px}
.wheel-info-lat{font-family:'Cinzel',serif;font-size:8px;letter-spacing:2px;color:var(--ash);text-transform:uppercase;margin-bottom:18px}
.wheel-info-meaning{font-size:12.5px;color:var(--amber);letter-spacing:.5px;margin-bottom:14px;line-height:1.5}
.wheel-info-detail{font-size:15px;font-style:italic;color:var(--stone);line-height:1.75}
/* ── PKG IMAGE CARDS ── */
.pkg-img-wrap{margin:-44px -32px 32px;height:210px;overflow:hidden;border-radius:2px 2px 0 0;position:relative}
.pkg-img{width:100%;height:100%;object-fit:cover;opacity:.6;transition:opacity .5s var(--ease)}
.pkg-card:hover .pkg-img{opacity:.82}
.pkg-img-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,transparent 40%,rgba(14,10,6,.9) 100%)}
/* ── ABOUT REDESIGN ── */
.about-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin:36px 0}
.stat-box{text-align:center;padding:24px 14px;border:1px solid rgba(196,134,28,.14);border-radius:2px;background:rgba(14,10,6,.55)}
.stat-num{font-family:'Cinzel',serif;font-size:clamp(1.4rem,2.5vw,2rem);color:var(--amber);display:block;margin-bottom:8px}
.stat-lbl{font-size:12px;color:var(--stone);line-height:1.5}
.principle-item{display:flex;gap:22px;padding:22px 0;border-bottom:1px solid rgba(196,134,28,.08)}
.principle-sym{font-size:30px;color:rgba(196,134,28,.55);flex-shrink:0;width:42px;line-height:1.3;padding-top:4px}
.principle-title{font-family:'Cinzel',serif;font-size:9.5px;letter-spacing:2.5px;color:var(--gold-pale);text-transform:uppercase;margin-bottom:8px}
.principle-text{font-size:15px;color:var(--stone);line-height:1.75}
.about-cta-box{margin-top:72px;padding:52px 44px;background:rgba(14,10,6,.82);border:1px solid rgba(196,134,28,.2);border-radius:3px;text-align:center}
@media(max-width:768px){
  .wheel-layout{gap:20px}
  .wheel-info{width:100%}
  .about-stats{grid-template-columns:1fr}
}
`;

/* ═══════════════════════════════════════════════════════════
   RUNE PARTICLES (Canvas)
═══════════════════════════════════════════════════════════ */
function RuneParticles() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');

    const resize = () => { cvs.width = window.innerWidth; cvs.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const onMouse = e => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMouse);

    const particles = Array.from({ length: 38 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vy: .12 + Math.random() * .28,
      vx: (Math.random() - .5) * .12,
      op: .08 + Math.random() * .24,
      size: 10 + Math.random() * 16,
      sym: RUNE_CHARS[Math.floor(Math.random() * RUNE_CHARS.length)],
      rot: (Math.random() - .5) * .4,
      rotV: (Math.random() - .5) * .003,
      opDir: Math.random() > .5 ? 1 : -1,
      opS: .0008 + Math.random() * .0015,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      particles.forEach(p => {
        const dx = p.x - mouse.current.x, dy = p.y - mouse.current.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) { p.vx += (dx / d) * .025; p.vy += (dy / d) * .008; }
        p.x += p.vx; p.y += p.vy; p.rot += p.rotV;
        p.vx *= .985;
        p.op += p.opDir * p.opS;
        if (p.op > .34 || p.op < .06) p.opDir *= -1;
        if (p.y > cvs.height + 50) { p.y = -50; p.x = Math.random() * cvs.width; p.vx = (Math.random() - .5) * .12; }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.op;
        ctx.font = `${p.size}px serif`;
        ctx.fillStyle = '#d4ab4e';
        ctx.fillText(p.sym, 0, 0);
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }} />;
}

/* ═══════════════════════════════════════════════════════════
   RUNE WHEEL (SVG with inertia physics + arrow indicator + info panel)
═══════════════════════════════════════════════════════════ */
function RuneWheel({ onRuneClick }) {
  const [rot, setRot] = useState(0);
  const rotRef = useRef(0);
  const dragging = useRef(false);
  const lastAngle = useRef(0);
  const vel = useRef(0);
  const rafRef = useRef(null);
  const svgRef = useRef(null);

  const getCenter = useCallback(() => {
    const r = svgRef.current?.getBoundingClientRect();
    return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: 0, y: 0 };
  }, []);

  const getAngle = useCallback((e) => {
    const c = getCenter();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return Math.atan2(cy - c.y, cx - c.x);
  }, [getCenter]);

  const onDown = useCallback(e => {
    dragging.current = true;
    lastAngle.current = getAngle(e);
    vel.current = 0;
    cancelAnimationFrame(rafRef.current);
  }, [getAngle]);

  const onMove = useCallback(e => {
    if (!dragging.current) return;
    const a = getAngle(e);
    let d = a - lastAngle.current;
    if (d > Math.PI) d -= 2 * Math.PI;
    if (d < -Math.PI) d += 2 * Math.PI;
    vel.current = d;
    rotRef.current += d * (180 / Math.PI);
    setRot(rotRef.current);
    lastAngle.current = a;
  }, [getAngle]);

  const onUp = useCallback(() => {
    dragging.current = false;
    const spin = () => {
      vel.current *= .965;
      rotRef.current += vel.current * (180 / Math.PI);
      setRot(rotRef.current);
      if (Math.abs(vel.current) > .0005) rafRef.current = requestAnimationFrame(spin);
    };
    rafRef.current = requestAnimationFrame(spin);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, [onMove, onUp]);

  const S = 420, C = 210;
  const RO = 182, RM = 140, RI = 96, RC = 56;

  // Rune currently under the top arrow
  const topIdx = ((Math.round(-rot / 15) % 24) + 24) % 24;
  const topRune = RUNES[topIdx];

  return (
    <div className="wheel-layout">
      <div className="wheel-svg-wrap">
        {/* Fixed arrow indicator pointing at top of wheel */}
        <div className="wheel-arrow">▼</div>
        <svg ref={svgRef} width={S} height={S} viewBox={`0 0 ${S} ${S}`}
          onMouseDown={onDown} onTouchStart={onDown}
          style={{ filter: 'drop-shadow(0 0 50px rgba(196,134,28,.15)) drop-shadow(0 0 100px rgba(196,134,28,.07))', cursor: 'grab', display: 'block' }}>
          <defs>
            <radialGradient id="wg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#241806" />
              <stop offset="55%" stopColor="#160f05" />
              <stop offset="100%" stopColor="#0d0a04" />
            </radialGradient>
            <radialGradient id="cg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3a240c" />
              <stop offset="100%" stopColor="#181007" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow2">
              <feGaussianBlur stdDeviation="5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Base disc */}
          <circle cx={C} cy={C} r={RO + 12} fill="url(#wg)" stroke="rgba(196,134,28,.28)" strokeWidth=".8" />

          {/* Rotating group */}
          <g transform={`rotate(${rot}, ${C}, ${C})`}>
            <circle cx={C} cy={C} r={RO} fill="none" stroke="rgba(196,134,28,.35)" strokeWidth=".8" />
            <circle cx={C} cy={C} r={RM} fill="none" stroke="rgba(196,134,28,.2)" strokeWidth=".5" />
            <circle cx={C} cy={C} r={RI} fill="none" stroke="rgba(196,134,28,.12)" strokeWidth=".4" />

            {RUNES.map((_, i) => {
              const a = (i * 15) * Math.PI / 180;
              return <line key={i}
                x1={C + RI * Math.cos(a)} y1={C + RI * Math.sin(a)}
                x2={C + RO * Math.cos(a)} y2={C + RO * Math.sin(a)}
                stroke="rgba(196,134,28,.14)" strokeWidth=".5" />;
            })}

            {[0, 60, 120, 180, 240, 300].map((deg, i) => {
              const a = deg * Math.PI / 180;
              const a2 = (deg + 180) * Math.PI / 180;
              return <line key={i}
                x1={C + RI * Math.cos(a)} y1={C + RI * Math.sin(a)}
                x2={C + RI * Math.cos(a2)} y2={C + RI * Math.sin(a2)}
                stroke="rgba(196,134,28,.07)" strokeWidth=".5" />;
            })}

            {RUNES.map((r, i) => {
              const a = (i * 15 - 90) * Math.PI / 180;
              const rx = C + (RM + 24) * Math.cos(a);
              const ry = C + (RM + 24) * Math.sin(a);
              const isTop = i === topIdx;
              return (
                <g key={i}>
                  {isTop && <circle cx={rx} cy={ry} r={22} fill="rgba(196,134,28,.14)" stroke="rgba(196,134,28,.65)" strokeWidth="1.2" filter="url(#glow2)" />}
                  <text x={rx} y={ry} textAnchor="middle" dominantBaseline="central"
                    fontSize={isTop ? 20 : 15}
                    fill={isTop ? '#e8d088' : 'rgba(196,134,28,.55)'}
                    filter={isTop ? 'url(#glow)' : 'none'}
                    style={{ cursor: 'pointer', fontFamily: 'serif' }}
                    onClick={e => { e.stopPropagation(); onRuneClick(r); }}>
                    {r.sym}
                  </text>
                </g>
              );
            })}

            {Array.from({ length: 24 }, (_, i) => {
              const a = (i * 15) * Math.PI / 180;
              return <circle key={i} cx={C + (RO + 6) * Math.cos(a)} cy={C + (RO + 6) * Math.sin(a)} r="1.8" fill="rgba(196,134,28,.35)" />;
            })}
          </g>

          {/* Core (non-rotating) */}
          <circle cx={C} cy={C} r={RC} fill="url(#cg)" stroke="rgba(196,134,28,.3)" strokeWidth=".8" />
          <text x={C} y={C - 8} textAnchor="middle" dominantBaseline="central"
            fontSize="28" fill="rgba(196,134,28,.65)" style={{ fontFamily: 'serif' }}
            filter="url(#glow)">ᛟ</text>
          <text x={C} y={C + 18} textAnchor="middle"
            fontSize="6.5" fill="rgba(196,134,28,.38)" letterSpacing="3.5"
            style={{ fontFamily: 'Cinzel,serif' }}>RIVEN</text>
        </svg>
      </div>

      {/* Rune info panel — shows rune currently at the top arrow */}
      <div className="wheel-info">
        <span className="wheel-info-sym" key={topRune.id}>{topRune.sym}</span>
        <div className="wheel-info-name">{topRune.name}</div>
        <div className="wheel-info-lat">{topRune.lat} · {topRune.planet}</div>
        <div className="wheel-info-meaning">{topRune.meaning}</div>
        <p className="wheel-info-detail">{topRune.detail.slice(0, 180)}…</p>
        <button className="btn-ghost" style={{ marginTop: 24, fontSize: 9, padding: '12px 22px' }}
          onClick={() => onRuneClick(topRune)}>
          Подробнее →
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FAQ ITEM
═══════════════════════════════════════════════════════════ */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button className="faq-q" onClick={() => setOpen(o => !o)}>
        <span className="faq-q-text">{q}</span>
        <span className={`faq-icon ${open ? 'open' : ''}`}>ᛉ</span>
      </button>
      <div className={`faq-body ${open ? 'open' : ''}`}>
        <div className="faq-body-inner">{a}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCROLL REVEAL HOOK
═══════════════════════════════════════════════════════════ */
function useReveal(deps = []) {
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); }),
      { threshold: 0.08 }
    );
    const raf = requestAnimationFrame(() => {
      document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    });
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, deps);
}

/* ═══════════════════════════════════════════════════════════
   PAGE: PACKAGES
═══════════════════════════════════════════════════════════ */
function PackagesPage({ navigate }) {
  useReveal();
  const pkgs = [
    {
      sym: 'ᚠ', name: 'Карта Себя', type: 'базовый разбор',
      img: '/1778579465543-019e1b98-1006-7a02-9604-1de2e245baae.png',
      desc: 'Базовый разбор: десять рун раскрыты, каждая — со своим текстом и привязкой к точке твоей карты. PDF на 30+ страниц, который остаётся с тобой. Для тех, кто хочет получить картину целиком и работать с ней самостоятельно.',
      items: ['Все 10 рун открыты и подписаны', 'Персональный PDF-разбор, написанный по твоей карте', 'Краткое описание каждой руны в твоём контексте', 'Ключевая формула: что усиливать, что отпускать', 'Доступ к разбору в личном кабинете навсегда'],
      excl: ['Голосовые комментарии или Zoom-встреча', 'Корректировка вопросов под конкретную ситуацию'],
      price: '3 900 ₽', priceNote: 'единоразово, PDF-документ',
      btnText: 'Получить карту', btnNote: 'обычно готово за 3–5 рабочих дней',
    },
    {
      sym: 'ᛏ', name: 'Путь Изменения', type: 'разбор + рунный став под запрос', feat: true,
      img: '/flux-2-pro_a_Нет,_не_нужно_никаки (1).jpeg',
      desc: 'Пакет для тех, у кого уже сформулирован запрос: смена работы, отношения, переезд, кризис. Базовый разбор плюс собранный именно под этот запрос рунный став — формула из 3–5 рун, которую ты держишь в фокусе следующие 40 дней.',
      items: ['Всё, что входит в «Карту Себя»', 'Развёрнутая работа над одним конкретным запросом', 'Авторский рунный став на 40 дней с инструкцией', 'Голосовые комментарии Тины к ключевым местам разбора', 'Чек-ин через 40 дней — один разбор по почте'],
      excl: ['Живая Zoom-встреча'],
      price: '6 900 ₽', priceNote: 'единоразово, рабочая сессия + материалы',
      btnText: 'Войти в Путь · скоро', btnNote: 'пока что в подготовке — оставь почту, напишу при запуске',
    },
    {
      sym: 'ᛟ', name: 'Лично с Мастером', type: 'разбор, став и 90 минут с Тиной',
      img: '/seedream-4.5_b_Нет,_не_нужно_никаки.jpeg',
      desc: 'Полный формат: разбор, став, и 90 минут один на один с Тиной в Zoom. Подходит, если ты в развилке и нужно вместе пройти по карте, задать вопросы, услышать живой комментарий и сформулировать своё решение.',
      items: ['Всё, что входит в «Карту Себя» и «Путь Изменения»', '90-минутная Zoom-сессия с Тиной с записью', 'Подготовленные под твою карту вопросы для разговора', 'Возможность доп. 30-минутной встречи через 60 дней', 'Письменное резюме встречи с конкретными следующими шагами'],
      excl: [],
      price: '12 900 ₽', priceNote: 'единоразово, полное сопровождение',
      btnText: 'Записаться на сессию', btnNote: 'запись на ближайшие даты через форму',
    },
  ];
  return (
    <div className="page-wrap page-enter">
      <section className="sec">
        <span className="sec-label reveal">Пакеты</span>
        <h2 className="sec-title reveal">Три пути к карте</h2>
        <div className="pkg-list-full">
          {pkgs.map((p, i) => (
            <div key={i} className={`pkg-card-full reveal ${p.feat ? 'feat' : ''}`}
              style={{ transitionDelay: `${i * .12}s` }}>
              {/* Image banner */}
              <div className="pkg-card-img-wrap">
                <img src={p.img} alt={p.name} onError={e => { e.target.style.display = 'none'; }} />
                <div className="pkg-img-overlay" />
                <div className="pkg-img-label">
                  <span className="pkg-sym">{p.sym}</span>
                  <div>
                    <div className="pkg-name">{p.name}</div>
                    <div className="pkg-type-lbl">{p.type}</div>
                  </div>
                </div>
              </div>
              {/* Body */}
              <div className="pkg-body">
                <div className="pkg-body-left">
                  <p className="pkg-desc">{p.desc}</p>
                  <span className="pkg-what-title">что входит</span>
                  <ul className="pkg-list">
                    {p.items.map((it, j) => <li key={j}>{it}</li>)}
                  </ul>
                  {p.excl.length > 0 && (
                    <>
                      <span className="pkg-what-title">чего нет в этом пакете</span>
                      <ul className="pkg-excl">
                        {p.excl.map((it, j) => <li key={j}>{it}</li>)}
                      </ul>
                    </>
                  )}
                </div>
                <div className="pkg-body-right">
                  <div>
                    <span className="pkg-price-label">Стоимость</span>
                    <span className="pkg-price">{p.price}</span>
                    <p className="pkg-price-note">{p.priceNote}</p>
                    <button className="pkg-buy-btn" onClick={() => navigate('home')}>{p.btnText}</button>
                    <p className="pkg-buy-note">{p.btnNote}</p>
                  </div>
                  <button className="pkg-free-link" onClick={() => navigate('home')}>
                    ← Начать с одной бесплатной руны
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE: 24 RUNES
═══════════════════════════════════════════════════════════ */
function RunesPage({ setModal }) {
  useReveal();
  return (
    <div className="page-wrap page-enter">
      <section className="sec" style={{ paddingBottom: 60 }}>
        <span className="sec-label reveal">Колесо рун</span>
        <h2 className="sec-title reveal">Вращай — узнавай</h2>
        <p className="reveal" style={{ color: 'var(--stone)', fontSize: 16, fontStyle: 'italic', marginBottom: 52, maxWidth: 500 }}>
          Крути колесо и следи за стрелкой: каждая руна наверху — открытая страница её смысла.
        </p>
        <RuneWheel onRuneClick={setModal} />
      </section>
      <div className="divider">ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ ᚷ ᚹ ᚺ ᚾ ᛁ ᛃ</div>
      <section className="sec sec-deeper">
        <span className="sec-label reveal">Старший Футарк</span>
        <h2 className="sec-title reveal">24 руны — кодекс судьбы</h2>
        <div className="runes-grid">
          {RUNES.map((r, i) => (
            <div key={i} className="rune-tile reveal"
              style={{ transitionDelay: `${(i % 8) * 0.04}s` }}
              onClick={() => setModal(r)}>
              <span className="rune-tile-sym">{r.sym}</span>
              <span className="rune-tile-name">{r.name}</span>
              <span className="rune-tile-sub">{r.planet} · {r.zodiac}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE: О АГАЯ
═══════════════════════════════════════════════════════════ */
function AboutPage({ navigate }) {
  useReveal();
  return (
    <div style={{ paddingTop: 0 }} className="page-enter">
      {/* ── Cinematic portrait section ── */}
      <div className="about-hero-section">
        <img
          src="/1778579304039-019e1b96-09ff-7439-86a4-8104926f78b6.png"
          className="about-hero-img" alt="Ривен"
          onError={e => { e.target.style.display = 'none'; }}
        />
        <div className="about-hero-mask" />
        <div className="about-hero-content">
          <span className="sec-label" style={{ marginBottom: 20 }}>Кто я</span>
          <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(2.8rem,6vw,5.5rem)', fontWeight: 300, fontStyle: 'italic', color: 'var(--smoke)', lineHeight: 1.1, marginBottom: 28 }}>
            12 лет в одной системе
          </h1>
          <p style={{ color: 'var(--stone)', fontSize: 18, fontStyle: 'italic', maxWidth: 520, lineHeight: 1.75 }}>
            Астрология + руны. Не как гадание — как метод видеть свою конструкцию изнутри.
          </p>
        </div>
      </div>

      {/* ── Bio content ── */}
      <section className="sec">
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div className="reveal">
            <p className="about-p">
              Я двенадцать лет читаю натальные карты и работаю с рунами. В какой-то момент стало ясно:
              эти два языка говорят об одном и том же — но с разной грамматикой.
            </p>
            <p className="about-p">
              Карта показывает, где ты родился — буквально и метафорически. Руны показывают, что ты
              с этим можешь сделать. Я свела их в один метод: десять ключевых точек твоей карты
              переводятся в десять рун Старшего Футарка — и дальше с этим набором уже можно работать
              как с персональной формулой.
            </p>
            <blockquote className="about-quote">
              Это не про предсказание. Это про то, чтобы видеть свою конструкцию изнутри.
            </blockquote>
          </div>

          <div className="about-stats reveal" style={{ transitionDelay: '.1s' }}>
            <div className="stat-box">
              <span className="stat-num">12+</span>
              <span className="stat-lbl">лет с астрологией и рунами в одной системе</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">≈ 600</span>
              <span className="stat-lbl">разборов — от единичных консультаций до длинных сопровождений</span>
            </div>
            <div className="stat-box">
              <span className="stat-num">не&nbsp;больше 8</span>
              <span className="stat-lbl">в работе одновременно — глубина важнее потока</span>
            </div>
          </div>

          {/* Принципы работы */}
          <div style={{ marginTop: 80, transitionDelay: '.15s' }} className="reveal">
            <span className="sec-label">Принципы работы</span>
            <h2 className="sec-title" style={{ marginBottom: 44 }}>Чего не будет</h2>
            {[
              { sym: 'ᚱ', title: 'Не говорю, как должно быть', text: 'Карта не диагноз и не приговор. Я показываю силовые линии — куда ты вложен, где сопротивляешься, что готово случиться. Решения остаются за тобой.' },
              { sym: 'ᛟ', title: 'Не делаю общих описаний', text: 'Никаких «у Овна сложности с эмоциями». Только конкретика твоей карты, привязанная к конкретной руне и конкретной точке. Текст пишется руками — не из шаблонов.' },
              { sym: 'ᚢ', title: 'Не работаю на поток', text: 'Восемь активных разборов — это потолок. Лучше отказаться, чем выдать поверхностный текст. Поэтому очередь и поэтому всегда видно, в чём именно ценность каждого пакета.' },
            ].map((pr, i) => (
              <div key={i} className="principle-item">
                <div className="principle-sym">{pr.sym}</div>
                <div>
                  <div className="principle-title">{pr.title}</div>
                  <p className="principle-text">{pr.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="about-cta-box reveal">
            <span className="sec-label" style={{ display: 'block', marginBottom: 16 }}>Хочешь попробовать</span>
            <h3 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontStyle: 'italic', color: 'var(--smoke)', marginBottom: 16 }}>
              Начни с одной руны
            </h3>
            <p style={{ color: 'var(--stone)', fontSize: 16, fontStyle: 'italic', maxWidth: 460, margin: '0 auto 28px', lineHeight: 1.75 }}>
              Покажу одну открытую руну по знаку Солнца — бесплатно. Этого достаточно,
              чтобы понять, в каком тоне будет писаться весь разбор.
            </p>
            <button className="btn-main" onClick={() => navigate('home')}>Получить руну</button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE: FAQ
═══════════════════════════════════════════════════════════ */
function FaqPage() {
  useReveal();
  return (
    <div className="page-wrap page-enter">
      <section className="sec sec-deeper">
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <span className="sec-label reveal">Вопросы</span>
          <h2 className="sec-title reveal">FAQ</h2>
          {FAQ.map((item, i) => (
            <div key={i} className="reveal" style={{ transitionDelay: `${i * 0.04}s` }}>
              <FaqItem q={item.q} a={item.a} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
export default function AgayaApp() {
  const [scrolled, setScrolled] = useState(false);
  const [modal, setModal] = useState(null);
  const [page, setPage] = useState('home');
  const [form, setForm] = useState({ dob: '', tob: '', city: '', email: '' });
  const [revealed, setRevealed] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  useReveal([page]);

  const navigate = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 55);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (modal || mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [modal, mobileOpen]);

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const handleSubmit = e => {
    e.preventDefault();
    const idx = (form.email.charCodeAt(0) + form.dob.replace(/-/g, '').length) % 24;
    setRevealed(RUNES[idx >= 0 ? idx : 0]);
  };

  return (
    <div style={{ background: '#060403', minHeight: '100vh', overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div id="grain" />
      <RuneParticles />

      {/* ─── MOBILE OVERLAY MENU ─── */}
      <div className={`mob-menu ${mobileOpen ? 'open' : ''}`}>
        {[['Пакеты', 'packages'], ['24 Руны', 'runes'], ['О Ривен', 'about'], ['FAQ', 'faq']].map(([l, id]) => (
          <button key={id} className="mob-menu-link"
            onClick={() => { navigate(id); setMobileOpen(false); }}>{l}</button>
        ))}
        <div className="mob-menu-divider" />
        <button className="mob-menu-cta"
          onClick={() => { navigate('home'); setMobileOpen(false); setTimeout(() => scrollTo('form'), 350); }}>
          Получить руну
        </button>
        <span className="mob-menu-label">RIVEN · Рунная Карта</span>
      </div>

      {/* ─── NAVBAR ─── */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <button className="nav-logo" style={{ background: 'none', border: 'none' }}
          onClick={() => { navigate('home'); setMobileOpen(false); }}>RIVEN</button>
        <ul className="nav-links">
          {[['Пакеты', 'packages'], ['24 Руны', 'runes'], ['О Ривен', 'about'], ['FAQ', 'faq']].map(([l, id]) => (
            <li key={id}>
              <button className="nav-link" style={{ background: 'none', border: 'none' }}
                onClick={() => navigate(id)}>{l}</button>
            </li>
          ))}
        </ul>
        <button className="cta-pill" onClick={() => { navigate('home'); setTimeout(() => scrollTo('form'), 300); }}>
          <span>Получить руну</span>
        </button>
        <button className={`nav-burger ${mobileOpen ? 'open' : ''}`}
          onClick={() => setMobileOpen(o => !o)} aria-label="Меню">
          <span /><span /><span />
        </button>
      </nav>

      {/* ─── HOME PAGE ─── */}
      {page === 'home' && (
        <>
          {/* HERO */}
          <section id="hero" className="hero">
            <div className="hero-bg" />
            <div className="hero-vignette" />
            {/* Right side image — place hero-bg.jpg in /public/assets/ */}
            <img
              src="/1778579109362-019e1b92-eef3-77e7-8c5c-8c064940093b.png"
              className="hero-right-img"
              alt=""
              onError={e => { e.target.style.display = 'none'; }}
            />
            <div className="hero-right-mask" />
            <div className="hero-agaya">RIVEN</div>
            <div className="hero-content">
              <h1 className="hero-title">
                «Астрология показывает данности&nbsp;Судьбы.<br />
                <em>Руны предлагают пути её изменения.»</em>
              </h1>
              <p className="hero-sub">
                Персональная рунно-астрологическая карта, созданная на основе
                даты, времени и места рождения.
              </p>
              <div className="hero-btns">
                <button className="btn-main" onClick={() => scrollTo('form')}>Получить свою руну</button>
                <button className="btn-ghost" onClick={() => navigate('packages')}>Смотреть пакеты</button>
              </div>
            </div>
            <div className="hero-scroll">
              <span>Scroll</span>
              <div className="hero-scroll-line" />
            </div>
          </section>

          {/* FORM */}
          <section id="form" className="sec sec-deeper">
            <div style={{ textAlign: 'center', marginBottom: '52px' }} className="reveal">
              <span className="sec-label">Начни с одной руны</span>
              <h2 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 'clamp(2.2rem,5.5vw,4.8rem)', fontWeight: 300, fontStyle: 'italic', color: 'var(--smoke)', lineHeight: 1.15, margin: '0 auto 20px', maxWidth: 760 }}>
                Введи свои данные —<br />получи руну по знаку Солнца
              </h2>
              <p style={{ color: 'var(--stone)', fontSize: 17, maxWidth: 540, margin: '0 auto', lineHeight: 1.75 }}>
                Руна Солнца — стержень, которым ты живёшь: как действуешь, в чём силён, что ведёт через тёмное.
                Открою бесплатно. Остальные девять — карта целиком — в одном из пакетов.
              </p>
            </div>
            <div className="form-wrap reveal">
              {!revealed ? (
                <form onSubmit={handleSubmit}>
                  <div className="f-row-2">
                    <div>
                      <label className="f-label">Дата рождения</label>
                      <input type="date" className="f-input" value={form.dob}
                        onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} required />
                    </div>
                    <div>
                      <label className="f-label">Время рождения</label>
                      <input type="time" className="f-input" value={form.tob}
                        onChange={e => setForm(f => ({ ...f, tob: e.target.value }))} />
                    </div>
                  </div>
                  <label className="f-label">Город рождения</label>
                  <input type="text" className="f-input" placeholder="Ташкент" value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))} required />
                  <label className="f-label">E-mail</label>
                  <input type="email" className="f-input" placeholder="anna@mail.ru" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                  <button type="submit" className="f-submit">Получить руну</button>
                </form>
              ) : (
                <div className="rune-rev">
                  <span className="rune-rev-sym">{revealed.sym}</span>
                  <div className="rune-rev-name">{revealed.name} · {revealed.lat}</div>
                  <div className="rune-rev-meaning">{revealed.meaning}</div>
                  <p style={{ color: 'var(--stone)', fontSize: 16, fontStyle: 'italic', lineHeight: 1.8, marginBottom: 28 }}>
                    {revealed.detail.slice(0, 160)}…
                  </p>
                  <p className="rune-rev-note">Это только 1 из 10 рун вашей карты.</p>
                  <button className="btn-main" onClick={() => navigate('packages')}>
                    Открыть полный разбор
                  </button>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* ─── OTHER PAGES ─── */}
      {page === 'packages' && <PackagesPage navigate={navigate} />}
      {page === 'runes'    && <RunesPage setModal={setModal} />}
      {page === 'about'    && <AboutPage navigate={navigate} />}
      {page === 'faq'      && <FaqPage />}

      {/* ─── FOOTER (always visible) ─── */}
      <footer className="footer">
        <div className="f-grid">
          <div>
            <span className="f-brand">RIVEN</span>
            <p className="f-tagline">
              Натальная карта, переведённая в руны.<br />
              Персональная система самопознания.
            </p>
          </div>
          <div>
            <span className="f-col-title">Сайт</span>
            <ul className="f-links">
              {[['Главная', 'home'], ['24 Руны', 'runes'], ['О Ривен', 'about'], ['FAQ', 'faq']].map(([l, id]) => (
                <li key={id}><a href="#" onClick={e => { e.preventDefault(); navigate(id); }}>{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <span className="f-col-title">Пакеты</span>
            <ul className="f-links">
              {['Карта Себя', 'Путь Изменения', 'Лично с Мастером'].map(n => (
                <li key={n}><a href="#" onClick={e => { e.preventDefault(); navigate('packages'); }}>{n}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <span className="f-col-title">Документы</span>
            <ul className="f-links">
              <li><a href="#">Публичная оферта</a></li>
              <li><a href="#">Политика конфиденциальности</a></li>
            </ul>
          </div>
        </div>
        <div className="f-bottom">
          <div className="f-runes">ᚠ ᚢ ᚦ ᚨ ᚱ ᚲ</div>
          <div className="f-legal">© 2026 · AGAYA · Авторская работа</div>
        </div>
      </footer>

      {/* ─── RUNE MODAL ─── */}
      {modal && (
        <div className="modal-bg" onClick={() => setModal(null)}>
          <button className="modal-close" onClick={() => setModal(null)}>ESC · Закрыть</button>
          <div className="modal-inner" onClick={e => e.stopPropagation()}>
            <span className="m-sym">{modal.sym}</span>
            <div className="m-name">{modal.name}</div>
            <div className="m-lat">{modal.lat}</div>
            <div className="m-meta">
              <div>
                <span className="m-meta-lbl">Планета</span>
                <span className="m-meta-val">{modal.planet}</span>
              </div>
              <div>
                <span className="m-meta-lbl">Знак зодиака</span>
                <span className="m-meta-val">{modal.zodiac}</span>
              </div>
            </div>
            <div className="m-meaning">{modal.meaning}</div>
            <p className="m-detail">{modal.detail}</p>
          </div>
        </div>
      )}
    </div>
  );
}

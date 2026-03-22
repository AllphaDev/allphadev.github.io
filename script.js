// ==================== Mobile menu ====================
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

burger?.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", String(open));
});

// ==================== Smooth anchors ====================
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    const el = id && document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    nav?.classList.remove("is-open");
    burger?.setAttribute("aria-expanded", "false");
  });
});

// ==================== Reveal on scroll with stagger ====================
const reveals = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("active");
        }, index * 50);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
);
reveals.forEach((el) => io.observe(el));

// ==================== Cursor glow ====================
const glow = document.querySelector(".cursor-glow");
window.addEventListener("mousemove", (e) => {
  if (!glow) return;
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

// ==================== Parallax background + horizontal shift ====================
const heroBg = document.querySelector(".hero__bg");
window.addEventListener("scroll", () => {
  if (!heroBg) return;
  const y = window.scrollY || 0;
  heroBg.style.setProperty("--parallax", `${y * 0.12}px`);
});
window.addEventListener("mousemove", (e) => {
  if (!heroBg) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  heroBg.style.transform = `translateX(${x}px) translateY(var(--parallax, 0px))`;
});

// ==================== Card spotlight hover ====================
function attachSpotlight(selector) {
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width) * 100;
      const my = ((e.clientY - r.top) / r.height) * 100;
      el.style.setProperty("--mx", mx + "%");
      el.style.setProperty("--my", my + "%");
    });
  });
}
attachSpotlight(".card");
attachSpotlight(".glass");
attachSpotlight(".faq-card");
attachSpotlight(".form");

// ==================== Animated counters with IntersectionObserver ====================
function animateCounter(el) {
  const target = Number(el.getAttribute("data-count") || "0");
  const duration = 1200;
  const t0 = performance.now();
  const step = (t) => {
    const p = Math.min(1, (t - t0) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.round(target * eased);
    el.textContent = String(val);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const counters = document.querySelectorAll("[data-count]");
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);
counters.forEach((el) => counterObserver.observe(el));

// ==================== SEO chart animations ====================
const seoCharts = document.querySelectorAll(".seo-chart");
const seoChartObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-animated");
        seoChartObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.35, rootMargin: "0px 0px -40px 0px" }
);
seoCharts.forEach((chart) => seoChartObserver.observe(chart));

// ==================== Theme toggle ====================
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

function applyTheme(theme) {
  if (theme === "dark") {
    body.classList.add("theme-dark");
    body.classList.remove("theme-light");
    if (themeToggle) themeToggle.textContent = "☀️";
  } else {
    body.classList.add("theme-light");
    body.classList.remove("theme-dark");
    if (themeToggle) themeToggle.textContent = "🌙";
  }
  localStorage.setItem("theme", theme);
}

const savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);

themeToggle?.addEventListener("click", () => {
  const newTheme = body.classList.contains("theme-dark") ? "light" : "dark";
  applyTheme(newTheme);
});

// ==================== Performance dashboard animations ====================
function animateCounterValue(
  el,
  target,
  duration = 1400,
  decimals = 0,
  suffix = ""
) {
  const start = 0;
  const t0 = performance.now();

  const step = (t) => {
    const p = Math.min(1, (t - t0) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    const value = start + (target - start) * eased;
    el.textContent = `${value.toFixed(decimals)}${suffix}`;
    if (p < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

function initPerformanceCard(card) {
  const gauge = card.querySelector(".perf-gauge");
  const progress = card.querySelector(".perf-gauge__progress");
  const gaugeValue = card.querySelector(".perf-gauge__value");
  const metricBars = card.querySelectorAll(".metric-bar i");

  if (gauge && progress) {
    const score = Number(gauge.getAttribute("data-score") || "94");
    const radius = 48;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - score / 100);

    gauge.style.setProperty("--score", score);
    progress.style.strokeDasharray = `${circumference}`;
    progress.style.strokeDashoffset = `${circumference}`;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        progress.style.transition =
          "stroke-dashoffset 1.4s cubic-bezier(.2,.8,.2,1)";
        progress.style.strokeDashoffset = `${offset}`;
      });
    });
  }

  if (gaugeValue) {
    const target = Number(
      gaugeValue.getAttribute("data-count") || gauge.textContent.trim() || "94"
    );
    animateCounterValue(gaugeValue, target, 1450, 0);
  }

  card.querySelectorAll("[data-count]").forEach((el) => {
    if (el.classList.contains("perf-gauge__value")) return;
    const target = Number(el.getAttribute("data-count") || "0");
    animateCounterValue(el, target, 1200, 0);
  });

  card.querySelectorAll("[data-count-decimal]").forEach((el) => {
    const target = Number(el.getAttribute("data-count-decimal") || "0");
    animateCounterValue(el, target, 1200, 1, "s");
  });

  metricBars.forEach((bar, index) => {
    const width = getComputedStyle(bar).getPropertyValue("--w").trim() || "0%";
    setTimeout(() => {
      bar.style.setProperty("--bar-progress", width);
    }, 220 + index * 120);
  });
}

const perfCards = document.querySelectorAll(".viz-animate");
const perfObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-animated");
      initPerformanceCard(entry.target);
      perfObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.35, rootMargin: "0px 0px -40px 0px" }
);

perfCards.forEach((card) => perfObserver.observe(card));

// ==================== Language toggle (RU/EN) - расширенный словарь ====================
const dict = {
  ru: {
    // --- Главная (уже было) ---
    nav_services: "Услуги",
    nav_work: "Работы",
    nav_process: "Процесс",
    nav_about: "Обо мне",
    nav_faq: "FAQ",
    nav_pricing: "Цены",
    nav_contact: "Связаться",
    hero_pill: "Web • Seo • WordPress • UX/UI • AI + Automations",
    hero_title_part1: "Премиальные сайты и digital-системы",
    hero_title_part2: "для брендов, продуктов и бизнеса, которым нужен",
    hero_title_part3: "уровень выше обычного",
    hero_sub:
      "Разрабатываю сайты, WordPress-решения, UX/UI-системы и AI-автоматизации, которые не просто красиво выглядят, а усиливают подачу, доверие и результат.",
    cta_primary: "Обсудить задачу",
    cta_secondary: "Смотреть кейсы",
    cta_telegram: "Telegram",
    stat_lighthouse: "Lighthouse target",
    stat_directions: "направления",
    stat_response: "часа response",
    badge_delivery: "⚡ Fast delivery",
    badge_code: "✅ Clean code",
    badge_ux: "🧠 UX-first",
    mini_web: "Web:",
    mini_web_val: "Landing / Corporate",
    mini_wp: "WP:",
    mini_wp_val: "Custom / Templates",
    mini_ui: "UX/UI:",
    mini_ui_val: "Figma systems",
    mini_ai: "AI+Auto:",
    mini_ai_val: "n8n / Bots / Content",
    tag_ui: "Black/White UI",
    tag_perf: "Performance",
    tag_sys: "Systems",
    // внутри dict.ru

    seo_preview_title: "SEO, которое видно не только в дизайне, но и в росте",
    seo_preview_sub:
      "Показываю SEO как часть системы: структура, контент, страницы услуг и понятные точки роста.",
    seo_preview_card_title: "Что улучшаем",
    seo_preview_card_desc:
      "Не просто добавляю мета-теги, а выстраиваю страницу так, чтобы она лучше читалась людьми и поиском одновременно.",
    seo_preview_li1: "Семантика и структура под поисковый интент",
    seo_preview_li2: "Коммерческие блоки, FAQ и контентные зоны",
    seo_preview_li3: "Внутренняя перелинковка и масштабирование страниц",
    seo_preview_btn: "Открыть SEO страницу",
    seo_preview_label: "Growth snapshot",
    seo_kpi_1: "ключевых кластера",
    seo_kpi_2: "точек оптимизации",
    seo_kpi_3: "готовность к росту",
    value_title: "Почему со мной удобно работать",
    value_sub: "Подача как у premium-студии, но без перегруза и бюрократии.",
    value_card1_title: "Быстро, но аккуратно",
    value_card1_desc:
      "Запускаю проект без лишней тянучки, при этом сохраняю качество и визуальный уровень.",
    value_card2_title: "Дизайн + код в одной логике",
    value_card2_desc:
      "Результат не разваливается между макетом и реализацией — всё выглядит цельно и продуманно.",
    value_card3_title: "Фокус на бизнес-задаче",
    value_card3_desc:
      "Сайт должен презентовать, усиливать доверие и помогать получать заявки, а не просто быть красивым.",
    services_title: "Услуги",
    service_web_title: "Web Development",
    service_web_desc:
      "Самописная разработка: скорость, эффекты, чистая структура.",
    service_web_li1: "Landing / Corporate",
    service_web_li2: "Адаптив + пиксель-перфект",
    service_web_li3: "Формы + интеграции",
    service_wp_title: "WordPress",
    service_wp_desc: "Кастомные и шаблонные решения — быстро и аккуратно.",
    service_wp_li1: "Custom Theme / ACF",
    service_wp_li2: "Template setup + custom blocks",
    service_wp_li3: "Оптимизация и безопасность",
    service_ui_title: "UX/UI (Figma)",
    service_ui_desc: "Макеты, дизайн-системы, структура под конверсии.",
    service_ui_li1: "Сетка, типографика, UI-kit",
    service_ui_li2: "Desktop + Mobile",
    service_ui_li3: "Прототипирование",
    service_seo_title: "SEO",
    service_seo_desc:
      "SEO-структура, базовая оптимизация и рост видимости в поиске.",
    service_seo_li1: "On-page SEO",
    service_seo_li2: "Структура + мета-теги",
    service_seo_li3: "Контент и точки роста",
    service_ai_title: "AI + Automations",
    service_ai_desc:
      "Системы: контент + процессы + лиды. AI не “ради AI”, а ради результата.",
    service_ai_li1: "n8n pipelines / интеграции",
    service_ai_li2: "Telegram-боты / уведомления",
    service_ai_li3: "Контент → автопостинг → лид",
    cta_title: "Нужно быстро показать уровень?",
    cta_desc:
      "Могу сделать тест: 1 секция верстки или мини-страница под их задачу.",
    cta_btn: "Написать",
    pricing_title: "Цены",
    pricing_sub: "Ориентиры по бюджету для самых частых задач",
    pricing_web_title: "Custom Code Websites",
    pricing_web_desc: "Самописные сайты и промо-страницы на чистом коде.",
    pricing_web_1: "Start — от $150",
    pricing_web_2: "Standard — от $300",
    pricing_web_3: "Premium — от $500",
    pricing_ui_title: "UX/UI & Figma",
    pricing_ui_desc: "Дизайн лендингов, сайтов и интерфейсов в Figma.",
    pricing_ui_1: "Start — от $70",
    pricing_ui_2: "Standard — от $140",
    pricing_ui_3: "Premium — от $250",
    pricing_seo_title: "SEO",
    pricing_seo_desc:
      "Базовая SEO-настройка, контентная структура и подготовка сайта к росту.",
    pricing_seo_1: "Start — от $100",
    pricing_seo_2: "Standard — от $220",
    pricing_seo_3: "Growth — от $350",
    pricing_auto_title: "WordPress & Automations",
    pricing_auto_desc:
      "WordPress-проекты и AI / n8n автоматизации под задачу бизнеса.",
    pricing_auto_1: "Start — от $120",
    pricing_auto_2: "Standard — от $250",
    pricing_auto_3: "Systems — от $400",
    work_title: "Работы",
    work_web_title: "Web — Landing / Corporate",
    work_web_desc: "Самописная разработка, эффекты, адаптив, скорость.",
    work_wp_title: "WordPress — Custom + Templates",
    work_wp_desc: "Кастомная тема или шаблон: быстро и аккуратно.",
    work_ui_title: "UX/UI — Figma Systems",
    work_ui_desc: "Макеты, UI-kit, структура под конверсию.",
    work_seo_title: "SEO — Strategy + On-page",
    work_seo_desc:
      "SEO-структура, оптимизация страниц и контент под рост поиска.",
    work_ai_title: "AI + Automations — Systems",
    work_ai_desc: "Контент + автопостинг + лид → CRM / Sheets → Telegram.",
    work_perf_title: "Performance — Speed + Conversion",
    work_perf_desc:
      "Скорость, структура, UX-сигналы и блоки, которые усиливают конверсию.",
    open: "Открыть !",
    process_title: "Процесс",
    process_1_title: "Discovery",
    process_1_desc: "Цель, аудитория, структура, контент, CTA.",
    process_1_li1: "Собираю требования",
    process_1_li2: "Фиксирую структуру",
    process_1_li3: "Договариваемся о формате",
    process_2_title: "UX/UI",
    process_2_desc: "Figma: прототип, дизайн-система, адаптив.",
    process_2_li1: "Сетка/типографика",
    process_2_li2: "UI kit",
    process_2_li3: "Desktop + Mobile",
    process_3_title: "Build",
    process_3_desc: "Верстка/WordPress: чисто, быстро, аккуратно.",
    process_3_li1: "HTML/CSS/JS",
    process_3_li2: "WP (Custom/Template)",
    process_3_li3: "Оптимизация",
    process_4_title: "Integrations",
    process_4_desc: "AI + автоматизация: лиды, контент, процессы.",
    process_4_li1: "n8n pipelines",
    process_4_li2: "Telegram уведомления",
    process_4_li3: "CRM/Sheets",
    process_5_title: "Deploy",
    process_5_desc: "Публикация: GitHub/хостинг/домен.",
    process_5_li1: "SSL",
    process_5_li2: "Проверка",
    process_5_li3: "Чек-лист",
    process_6_title: "Support",
    process_6_desc: "Правки и улучшения по данным.",
    process_6_li1: "Поддержка",
    process_6_li2: "Улучшения",
    process_6_li3: "Автопроцессы",
    about_title: "Обо мне",
    about_sub: "Коротко, уверенно, по делу.",
    about_pos_title: "Позиционирование",
    about_pos_text:
      "Основной опыт — самописная разработка сайтов и верстка, плюс UX/UI в Figma. WordPress использую для проектов, где важна удобная админка и быстрый запуск (кастомные и шаблонные решения). AI+автоматизации подключаю, чтобы проект не просто “выглядел”, а работал как система.",
    about_pos_li1: "Чистый код и структура",
    about_pos_li2: "Минималистичный UI",
    about_pos_li3: "Интеграции и автоматизация",
    about_stack_title: "Стек",
    about_stack_wp: "WordPress: Theme / ACF / Templates",
    about_btn: "Написать",
    faq_title: "FAQ",
    faq_sub: "Короткие ответы, чтобы закрыть сомнения.",
    faq_q1: "Вы делаете WordPress на кастомной теме и на шаблонах?",
    faq_a1:
      "Да. Могу собрать быстро на шаблоне (и кастомизировать), либо сделать кастомную тему + ACF под удобную админку.",
    faq_q2: "UX/UI — это только дизайн или и логика?",
    faq_a2:
      "И дизайн, и логика. Структура секций, сценарии, CTA, адаптив — всё в Figma.",
    faq_q3: "AI + автоматизация — что конкретно?",
    faq_a3:
      "Контент/скрипты/шаблоны + n8n-процессы: автопостинг, сбор лидов, уведомления, запись в CRM/Sheets.",
    faq_q4: "Можно начать с теста?",
    faq_a4:
      "Да. Мини-тест: 1 секция верстки / 1 экран UI / мини-автоматизация на n8n.",
    contact_title: "Связаться",
    contact_sub: "Заполните форму — я отвечу в течение 24 часов",
    contact_info_title: "Контакты",
    contact_info_change: "Поменяй на свои:",
    contact_info_more: "Можно добавить LinkedIn/Behance.",
    form_name_label: "Имя",
    form_name_placeholder: "Ваше имя",
    form_email_label: "Email",
    form_email_placeholder: "name@company.com",
    form_service_label: "Услуга",
    form_service_placeholder: "— Выберите —",
    form_service_other: "Другое",
    form_task_label: "Задача",
    form_task_placeholder: "Опишите идею или задачу...",
    form_send: "Отправить",
    mini_seo: "SEO:",
    mini_seo_val: "Structure / On-page / Growth",
    seo_growth_title: "Как выглядит SEO-рост в подаче",
    seo_growth_sub:
      "На странице можно показать не только услугу, но и саму логику улучшения: структура, динамика и крупные цифры.",
    seo_growth_card1: "оптимизированных блоков",
    seo_growth_card2: "кластеров под посадочные",
    seo_growth_card3: "точки роста и перелинковки",
    seo_page_kpi_1: "страниц роста",
    seo_page_kpi_2: "SEO-точек улучшения",
    seo_page_kpi_3: "структурной готовности",
    footer_tag: "One-page • 5 Directions • Premium Minimal",

    // --- AI страница ---
    ai_title: "AI + Automation Systems",
    ai_sub:
      "Системы, которые превращают контент и лиды в процесс: идеи → контент → публикация → лид → обработка → уведомления.",
    ai_what_title: "Что я делаю",
    ai_what_li1:
      "Автоматизация лидов: формы/DM → валидация → CRM/Sheets → уведомления",
    ai_what_li2: "AI-обработка: классификация, извлечение данных, авто-сводки",
    ai_what_li3: "Контент-система: шаблоны, сценарии, подготовка и публикация",
    ai_what_li4: "Интеграции: API, Webhooks, Telegram, таблицы, CRM",
    ai_chains_title: "Типовые цепочки",
    ai_chains_li1:
      "Новая заявка → AI извлечение → запись → уведомление менеджеру",
    ai_chains_li2: "Лиды → сегментация → распределение → авто-ответы",
    ai_chains_li3: "Данные → AI summary → weekly report в Telegram",
    ai_btn_request: "Запросить",
    ai_btn_back: "Назад",
    ai_looks_title: "Как это выглядит",
    ai_looks_desc: "Пример связки: n8n + OpenAI + Google Sheets + Telegram.",
    ai_ex1_title: "Пример реализации №1",
    ai_ex1_sub: "Автоматический приём и квалификация лидов из Telegram",
    ai_ex1_task_title: "Задача",
    ai_ex1_task_text:
      "В Telegram-бот приходят заявки от клиентов в свободной форме. Менеджеры вручную читали сообщения, пересылали в CRM и тратили время на первичный опрос. Терялись лиды в нерабочее время.",
    ai_ex1_sol_title: "Решение",
    ai_ex1_sol_li1: "Приём сообщений: бот принимает текст, фото, контакты.",
    ai_ex1_sol_li2:
      "AI-анализ: GPT извлекает ключевые данные (имя, телефон, интерес, бюджет).",
    ai_ex1_sol_li3:
      "Валидация и обогащение: проверка телефона, поиск дубликатов в Google Sheets.",
    ai_ex1_sol_li4:
      "Запись в CRM: создание сделки в Bitrix24 / сохранение в таблицу.",
    ai_ex1_sol_li5:
      "Уведомления: менеджеру в Telegram — карточка лида с кнопками «взять в работу», «спам».",
    ai_ex1_stack:
      "Стэк: python/aiogram, n8n, OpenAI API, Google Sheets API, Telegram API.",
    ai_ex1_res_title: "Результат",
    ai_ex1_res_li1: "Время реакции на лид сократилось с 30 минут до 1 минуты.",
    ai_ex1_res_li2: "Потери заявок в нерабочее время — 0.",
    ai_ex1_res_li3: "Менеджеры занимаются только тёплыми контактами.",
    ai_ex1_res_li4: "Все лиды сохраняются в базе для аналитики.",
    ai_ex1_scheme: "*схема работы: бот → AI → CRM → уведомление",
    ai_ex2_title: "Пример реализации №2",
    ai_ex2_sub: "Конвейер контента: от идеи до поста в соцсетях",
    ai_ex2_task_text:
      "SMM-менеджер тратил 4 часа в день на придумывание постов, подбор картинок и публикацию в пяти каналах. Нужно было увеличить частоту постинга без найма дополнительных людей.",
    ai_ex2_sol_li1:
      "Планировщик идей: Notion / Google Sheets — таблица с темами, ключевыми словами, форматами.",
    ai_ex2_sol_li2:
      "AI-генерация: по расписанию запускается скрипт, который берёт тему и с помощью YandexGPT / ChatGPT пишет текст поста (адаптирует тон под площадку).",
    ai_ex2_sol_li3:
      "Подбор визуала: интеграция с Unsplash или генерация изображения через Kandinsky / DALL·E.",
    ai_ex2_sol_li4:
      "Публикация: через API или низкоуровневые инструменты (Telegram, VK, Instagram) пост уходит автоматически.",
    ai_ex2_stack:
      "Стэк: n8n, OpenAI, Kandinsky API, Notion API, Telegram Bot API.",
    ai_ex2_res_li1: "Время на создание одного поста — 5 минут (вместо 40).",
    ai_ex2_res_li2: "Количество постов выросло с 2 до 5 в день.",
    ai_ex2_res_li3:
      "Вовлечённость не упала — контент адаптируется под аудиторию.",
    ai_ex2_res_li4:
      "Менеджер занимается стратегией и общением, а не копирайтингом.",
    ai_ex2_scheme: "*конвейер: идея → AI текст → AI визуал → публикация",
    ai_price_title: "Стоимость автоматизаций",
    ai_price_sub: "Подходит и для быстрых MVP-цепочек, и для бизнес-процессов",
    ai_price_card1: "Mini automation",
    ai_price_desc1: "Уведомления, простая интеграция, mini-flow",
    ai_price_val1: "от $120",
    ai_price_card2: "Lead flow / bot flow",
    ai_price_desc2: "Лиды, Telegram, CRM, таблицы, квалификация",
    ai_price_val2: "от $250",
    ai_price_card3: "Complex system",
    ai_price_desc3: "Полноценная цепочка для бизнеса с AI и n8n",
    ai_price_val3: "от $500",

    // --- UX/UI страница ---
    ui_title: "UX/UI — дизайн сайтов и лендингов",
    ui_sub: "Современные интерфейсы, высокая конверсия, адаптивность.",
    ui_what_li1: "Дизайн лендингов, интернет-магазинов, корпоративных сайтов.",
    ui_what_li2: "UX-исследования, прототипирование, CJM.",
    ui_what_li3: "Разработка UI-kit / дизайн-систем в Figma.",
    ui_what_li4: "Адаптивные макеты под все устройства.",
    ui_approach_li1: "Ориентация на бизнес‑цели и конверсию.",
    ui_approach_li2: "Современная эстетика и внимание к деталям.",
    ui_approach_li3: "Тесная работа с разработчиками.",
    ui_works_title: "Мои работы в дизайне",
    ui_petclip: "SmartPetClip",
    ui_nutriboost: "NutriBoost",
    ui_antarctica: "Antarctica",
    ui_ex1_title: "Пример реализации №1",
    ui_ex1_sub: "SmartPetClip — дизайн сайта для продажи собачьих трекеров",
    ui_ex1_task:
      "Разработать дизайн многостраничного сайта для бренда умных ошейников-трекеров. Нужно было представить несколько моделей (Black, Pink), рассказать о продукте, показать, как это работает, и дать возможность связаться.",
    ui_ex1_sol_li1:
      "Создал главную страницу с крупными визуалами и краткими характеристиками.",
    ui_ex1_sol_li2:
      "Отдельные страницы для каждой модели с детальным описанием и фотографиями.",
    ui_ex1_sol_li3: "Разделы «О продукте», «Как это работает», контакты.",
    ui_ex1_sol_li4: "Адаптивный дизайн под мобильные устройства.",
    ui_ex1_sol_li5: "Продумал удобную навигацию и призывы к действию.",
    ui_ex1_tools: "Инструменты: Figma, авто-лейауты, компоненты.",
    ui_ex1_res_li1: "Стильный, современный дизайн, готовый к вёрстке.",
    ui_ex1_res_li2: "Заказчик сразу утвердил макет без правок.",
    ui_ex2_title: "Пример реализации №2",
    ui_ex2_sub: "Antarctica — дизайн лендинга экспедиции в Антарктиду",
    ui_ex2_task:
      "Разработать дизайн лендинга для круиза в Антарктиду. Нужно передать атмосферу приключения, представить программу, варианты кают и побудить к бронированию.",
    ui_ex2_sol_li1:
      "Главная с большим фото ледников, счётчиками (дни, виды животных) и кнопкой бронирования.",
    ui_ex2_sol_li2:
      "Блок уникальности экспедиции с иконками (киты, пингвины, айсберги).",
    ui_ex2_sol_li3: "Описание судна и программы по дням.",
    ui_ex2_sol_li4: "Сетка кают с ценами и деталями.",
    ui_ex2_sol_li5: "Адаптив под все экраны.",
    ui_ex2_tools: "Инструменты: Figma, прототипирование, сетки.",
    ui_ex2_res_li1:
      "Эмоциональный и информативный дизайн, вовлекающий в путешествие.",
    ui_ex2_res_li2: "Заказчик получил макет, готовый к вёрстке.",
    ui_ex2_res_li3: "Проект отмечен на Behance.",
    ui_ex3_title: "Пример реализации №3",
    ui_ex3_sub: "NutriBoost — дизайн лендинга персонализированных витаминов",
    ui_ex3_task:
      "Создать двухстраничный дизайн лендинга для сервиса подбора витаминов. Главная страница должна вовлекать в прохождение теста, а страница Benefits — рассказывать о преимуществах.",
    ui_ex3_sol_li1:
      "Главная: яркий заголовок, описание, кнопка «Start Test», минималистичный дизайн.",
    ui_ex3_sol_li2:
      "Страница Benefits: перечисление преимуществ (научный подход, чистые ингредиенты), три шага работы сервиса.",
    ui_ex3_sol_li3:
      "Единая цветовая гамма (зелёный/белый), современная типографика.",
    ui_ex3_sol_li4: "Адаптация под мобильные устройства.",
    ui_ex3_tools: "Инструменты: Figma, компоненты, сетки.",
    ui_ex3_res_li1: "Лаконичный и убедительный дизайн, повышающий доверие.",
    ui_ex3_res_li2: "Заказчик получил готовый макет для верстки.",
    ui_price_title: "Стоимость UX/UI",
    ui_price_sub: "Без завышения — реальные цены под портфолио и рынок",
    ui_price_card1: "Quick concept",
    ui_price_desc1: "1 экран, quick concept, hero или section design",
    ui_price_val1: "от $35",
    ui_price_card2: "Landing design",
    ui_price_desc2: "Полный дизайн лендинга в Figma",
    ui_price_val2: "от $80",
    ui_price_card3: "Website design",
    ui_price_desc3: "Несколько страниц, система, адаптив",
    ui_price_val3: "от $180",

    // SEO page keys
    seo_title:
      "SEO для сайтов, которые должны не просто выглядеть, а находиться",
    seo_sub:
      "Помогаю выстроить SEO-основу сайта: структура, мета-теги, тексты, посадочные страницы и рекомендации для роста органического трафика.",
    seo_what_title: "Что я делаю",
    seo_what_li1:
      "On-page SEO: title, description, H1-H3, alt, внутренняя структура.",
    seo_what_li2:
      "SEO-структура страниц и посадочных под услуги, города или категории.",
    seo_what_li3:
      "Контентные рекомендации: какие блоки, тексты и FAQ усиливают видимость.",
    seo_what_li4:
      "Техническая база: скорость, индексация, перелинковка, базовая разметка.",
    seo_approach_title: "Подход",
    seo_approach_li1:
      "Сначала логика бизнеса и семантика, потом оформление и тексты.",
    seo_approach_li2:
      "Без спама и обещаний 'топ-1 за неделю' — только нормальная база и рост.",
    seo_approach_li3:
      "SEO учитывается вместе с дизайном, структурой и конверсией.",
    seo_looks_title: "Что получает клиент",
    seo_looks_desc:
      "Итог — сайт, который выглядит премиально, читается понятно и готов к органическому росту.",
    seo_growth_title: "Как выглядит SEO-рост в подаче",
    seo_growth_sub:
      "На странице можно показать не только услугу, но и саму логику улучшения: структура, динамика и крупные цифры.",
    seo_growth_card1: "оптимизированных блоков",
    seo_growth_card2: "кластеров под посадочные",
    seo_growth_card3: "точки роста и перелинковки",
    seo_ex1_title: "Пример реализации №1",
    seo_ex1_sub: "SEO-упаковка услуги для локального бизнеса",
    seo_ex1_task:
      "Нужно было оформить страницу услуги так, чтобы она одновременно выглядела дорого, хорошо читалась и собирала поисковый трафик по коммерческим запросам.",
    seo_ex1_sol_li1:
      "Перестроил первый экран, заголовки и блоки под понятную поисковую структуру.",
    seo_ex1_sol_li2:
      "Добавил коммерческие секции: преимущества, этапы, FAQ, CTA и локальные триггеры доверия.",
    seo_ex1_sol_li3:
      "Подготовил title, description и рекомендации по тексту без переспама.",
    seo_ex1_tools:
      "Инструменты: SEO-структура, copywriting, UX-логика, on-page optimization.",
    seo_ex1_res_li1:
      "Страница стала сильнее и для клиента, и для поисковой системы.",
    seo_ex1_res_li2:
      "Появилась понятная логика масштабирования под другие услуги и посадочные.",
    seo_ex2_title: "Пример реализации №2",
    seo_ex2_sub: "Контентная структура для multi-page сайта",
    seo_ex2_task:
      "На проекте нужно было разложить услуги и контент так, чтобы сайт не конкурировал сам с собой и каждая страница отвечала на свой поисковый интент.",
    seo_ex2_sol_li1:
      "Разделил страницы по кластерам: главная, услуги, подуслуги, FAQ и кейсы.",
    seo_ex2_sol_li2:
      "Продумал внутреннюю перелинковку и логику переходов между страницами.",
    seo_ex2_sol_li3:
      "Сформировал рекомендации по URL, заголовкам и метаданным для каждой группы страниц.",
    seo_ex2_tools:
      "Инструменты: information architecture, SEO mapping, internal linking.",
    seo_ex2_res_li1:
      "Сайт получил более чистую структуру без каннибализации запросов.",
    seo_ex2_res_li2:
      "Команде стало проще масштабировать контент и новые посадочные страницы.",
    seo_price_title: "SEO pricing",
    seo_price_sub: "От базовой оптимизации до структуры роста",
    seo_price_card1: "SEO start",
    seo_price_desc1:
      "Базовые мета-теги, заголовки, alt и рекомендации по странице",
    seo_price_val1: "от $100",
    seo_price_card2: "SEO landing",
    seo_price_desc2: "Структура, коммерческие блоки, FAQ, контентная логика",
    seo_price_val2: "от $220",
    seo_price_card3: "SEO system",
    seo_price_desc3:
      "Карта страниц, перелинковка, рекомендации по кластерам и масштабированию",
    seo_price_val3: "от $350",

    // --- Web страница ---
    web_title: "Web — Landing / Corporate",
    web_sub: "Самописная разработка, эффекты, адаптив, скорость.",
    web_what_li1:
      "Разработка лендингов и корпоративных сайтов с нуля (HTML/CSS/JS).",
    web_what_li2: "Анимации, микро‑взаимодействия, параллакс.",
    web_what_li3: "Полная адаптивность под все устройства.",
    web_what_li4: "Оптимизация скорости загрузки и SEO‑основы.",
    web_use_li1: "Чистый код или сборки (Gulp, Webpack).",
    web_use_li2: "Современные CSS‑фреймворки (Tailwind, SCSS).",
    web_use_li3: "JavaScript (Vanilla, React при необходимости).",
    web_works: "Мои работы",
    web_ex1_title: "Пример реализации №1",
    web_ex1_sub:
      "Сайт для ретрит-домика «NordWoods» — полностью рабочий проект",
    web_ex1_task:
      "Разработать и сверстать полноценный сайт для загородного дома, сдаваемого посуточно. Основная цель — привлечение гостей, удобное бронирование и передача атмосферы уединения на природе.",
    web_ex1_sol_li1:
      "Создал адаптивный лендинг на чистом HTML/CSS/JS с акцентом на визуальную эстетику и удобство.",
    web_ex1_sol_li2:
      "Реализовал фотогалерею с лёгким слайдером, карту проезда (Яндекс/Google Maps), форму обратной связи.",
    web_ex1_sol_li3:
      "Добавил плавные анимации при скролле и появление элементов для вовлечения посетителя.",
    web_ex1_sol_li4:
      "Интегрировал календарь доступности (через сторонний сервис или самописный) и кнопку бронирования, ведущую на чат/звонок.",
    web_ex1_sol_li5:
      "Оптимизировал скорость загрузки и адаптировал под мобильные устройства.",
    web_ex1_stack:
      "Стэк: HTML5, CSS3 (Flex/Grid), JavaScript (ES6+), библиотеки анимаций (AOS или самописные), карты, форма с валидацией.",
    web_ex1_res_li1:
      "Сайт полностью готов к публикации, все страницы адаптивны, протестированы в основных браузерах.",
    web_ex1_res_li2:
      "Владелец дома получает заявки через форму, а посетители — полную информацию о доме и окрестностях.",
    web_ex1_res_li3:
      "Благодаря чистому коду и структуре сайт легко дорабатывать под новые задачи.",
    web_ex1_btn: "🌐 Посмотреть сайт",
    web_ex2_title: "Пример реализации №2",
    web_ex2_sub:
      "Сайт туристического агентства «JapanVoyage» — полностью рабочий проект",
    web_ex2_task:
      "Разработать и сверстать сайт для туристической компании, специализирующейся на турах в Японию. Необходимо передать атмосферу страны, обеспечить удобный каталог туров и систему бронирования/заявок.",
    web_ex2_sol_li1:
      "Создал адаптивный многостраничный сайт на HTML/CSS/JS с использованием современной семантики и оптимизацией скорости.",
    web_ex2_sol_li2:
      "Разработал каталог туров с фильтрацией по цене, длительности и сезону (реализовано на чистом JS).",
    web_ex2_sol_li3:
      "Интегрировал карту достопримечательностей (API Яндекс.Карт) и фотогалерею с лайтбоксом.",
    web_ex2_sol_li4:
      "Добавил форму обратной связи с валидацией и отправкой данных (через Formspree или аналогичный сервис).",
    web_ex2_sol_li5:
      "Адаптировал интерфейс под мобильные устройства, продумал навигацию и микроанимации для вовлечения.",
    web_ex2_stack:
      "Стэк: HTML5, CSS3 (Flex/Grid, SCSS), JavaScript (ES6+), API карт, библиотеки для слайдеров (Swiper), модульная структура кода.",
    web_ex2_res_li1:
      "Полноценный сайт с каталогом, карточками туров и формой заявок — всё работает без бэкенда (используются готовые решения для отправки форм).",
    web_ex2_res_li2:
      "Заказчик получил готовый продукт, который можно разместить на любом хостинге.",
    web_ex2_res_li3:
      "Сайт вызывает доверие у посетителей благодаря качественной вёрстке и вниманию к деталям.",
    web_price_title: "Стоимость web-разработки",
    web_price_sub: "Гибкие диапазоны под быстрые задачи и полноценные сайты",
    web_price_card1: "Quick fix",
    web_price_desc1: "Правки, адаптив, 1 секция, баги",
    web_price_val1: "от $40",
    web_price_card2: "Landing page",
    web_price_desc2: "Одностраничный сайт под услугу, продукт или рекламу",
    web_price_val2: "от $120",
    web_price_card3: "Corporate / multi-page",
    web_price_desc3: "Многостраничный сайт, сложные блоки, кастомная логика",
    web_price_val3: "от $280",

    // Perfomans
    perf_title: "Performance для сайтов, которым нужен рост и сильная подача",
    perf_sub:
      "Скорость, Core Web Vitals, структура блоков и UX-сигналы, которые влияют на конверсию.",
    perf_what_title: "Что я улучшаю",
    perf_what_li1: "Скорость загрузки и визуальную стабильность интерфейса.",
    perf_what_li2: "Core Web Vitals, структуру hero и CTA-блоков.",
    perf_what_li3: "Логику секций, чтобы сайт легче вёл к заявке.",
    perf_what_li4: "Мобильную читаемость, сетку, отступы и UX-сигналы.",
    perf_use_title: "Что входит",
    perf_use_li1: "Аудит первого экрана, карточек, форм и сценариев скролла.",
    perf_use_li2: "Правки структуры, контраста, ритма и визуальных акцентов.",
    perf_use_li3: "Подготовка сайта к росту через скорость + конверсию.",
    perf_dashboard_title: "Performance dashboard",
    viz_load_time: "load time",
    viz_mobile_ready: "mobile ready",
    viz_breakpoints: "breakpoints",
    viz_perf: "Performance",
    viz_accessibility: "Accessibility",
    viz_structure: "Structure",
    perf_dashboard_title: "Панель производительности",
    perf_lighthouse_label: "Lighthouse",
    viz_load_time: "время загрузки",
    viz_mobile_ready: "готово для мобильных",
    viz_breakpoints: "брейкпоинта",
    viz_perf: "Производительность",
    viz_accessibility: "Доступность",
    viz_structure: "Структура",
    perf_price_title: "Стоимость performance-правок",
    perf_price_sub:
      "Подходит для точечных улучшений и комплексной упаковки сайта",
    perf_price_card1: "Audit / quick fixes",
    perf_price_desc1: "Аудит, быстрые UX/CWV-правки, hero и CTA",
    perf_price_val1: "от $60",
    perf_price_card2: "Landing optimization",
    perf_price_desc2:
      "Улучшение структуры, ритма блоков и конверсионной логики",
    perf_price_val2: "от $140",
    perf_price_card3: "Full performance pack",
    perf_price_desc3: "Скорость + UX + визуальная подача для сайта целиком",
    perf_price_val3: "от $260",

    // --- WordPress страница ---
    wp_title: "WordPress — готовые проекты",
    wp_sub:
      "Три сайта, созданных на WordPress с индивидуальным дизайном и функционалом.",
    wp_what_li1: "Разработка кастомных тем с нуля (PHP, ACF, Timber).",
    wp_what_li2: "Адаптация готовых шаблонов под задачи заказчика.",
    wp_what_li3:
      "Создание Custom Post Types и таксономий (например, «Домики», «Туры»).",
    wp_what_li4: "Настройка плагинов (Contact Form 7, WooCommerce, Yoast SEO).",
    wp_what_li5: "Оптимизация скорости, безопасности и мобильной версии.",
    wp_approach_li1:
      "Удобная админка для клиента (ACF-поля, произвольные настройки).",
    wp_approach_li2: "Чистый код и семантика.",
    wp_approach_li3: "Адаптивность и кроссбраузерность.",
    wp_works_title: "Мои последние работы",
    wp_house: "Elara Mind",
    wp_glamping: "Viora",
    wp_antarctica: "Antarctica Tour",
    wp_ex1_title: "Пример реализации №1",
    wp_ex1_sub:
      "Elara Mind — премиальный сайт для частной психологической практики",
    wp_ex1_task:
      "Разработать современный и эстетичный сайт для частного психолога на основе готового макета из Figma. Важно было сохранить премиальную подачу, спокойную визуальную атмосферу, удобную структуру для записи на консультацию и сделать сайт простым в управлении через WordPress.",
    wp_ex1_sol_li1:
      "Выполнена вёрстка сайта по индивидуальному макету из Figma с точной передачей типографики, отступов, цветовой палитры и общей стилистики.",
    wp_ex1_sol_li2:
      "Сайт собран на WordPress с кастомной темой без перегруженных шаблонов, чтобы сохранить чистый и дорогой визуальный стиль.",
    wp_ex1_sol_li3:
      "Для редактирования ключевых блоков подключены гибкие поля: тексты, кнопки, секции услуг, истории, FAQ и контакты.",
    wp_ex1_sol_li4:
      "Реализована форма записи на консультацию и удобная навигация по всем основным разделам сайта.",
    wp_ex1_sol_li5:
      "Выполнена полная адаптация под мобильные устройства и планшеты с сохранением аккуратной композиции и читаемости.",
    wp_ex1_tools:
      "Инструменты: WordPress, Figma, ACF Pro, кастомная тема, HTML, CSS, JavaScript.",
    wp_ex1_res_li1:
      "Получился стильный и доверительный сайт, который подчёркивает экспертность специалиста и премиальный подход к практике.",
    wp_ex1_res_li2:
      "Заказчик получил удобную WordPress-админку для самостоятельного редактирования контента без необходимости менять код.",
    wp_ex1_res_li3:
      "Сайт корректно отображается на всех устройствах и помогает вести пользователей к записи на консультацию.",
    wp_ex2_title: "Пример реализации №2",
    wp_ex2_sub:
      "Viora — премиальный сайт для AI-приложения по продуктивности и питанию",
    wp_ex2_task:
      "Разработать эффектный премиальный сайт для digital-продукта, который объединяет планирование дня, AI-распознавание еды, подсчёт калорий, метрик состояния и персональные рекомендации в одном приложении. Важно было подчеркнуть технологичность продукта, современный визуальный стиль и сделать подачу сильной для будущих пользователей и инвесторов.",
    wp_ex2_sol_li1:
      "Разработан кастомный интерфейс по индивидуальной дизайн-концепции с акцентом на тёмную premium-стилистику, крупную типографику, мягкое свечение и layered UI-композицию.",
    wp_ex2_sol_li2:
      "Реализована адаптивная вёрстка ключевых экранов с точной передачей структуры hero-блока, карточек метрик, AI-блоков и продуктовых акцентов.",
    wp_ex2_sol_li3:
      "Продумана визуальная подача функций приложения: deep-focus planning, AI meal recognition, calorie tracking, readiness metrics и adaptive coaching.",
    wp_ex2_sol_li4:
      "Добавлены выразительные CTA-блоки, сценарии вовлечения пользователя и структура, которая помогает быстро донести ценность продукта.",
    wp_ex2_sol_li5:
      "Сайт адаптирован под мобильные устройства и планшеты с сохранением визуальной глубины и аккуратной композиции.",
    wp_ex2_tools:
      "Инструменты: Figma, WordPress, кастомная тема, HTML, CSS, JavaScript, ACF Pro.",
    wp_ex2_res_li1:
      "Получился сильный визуальный концепт, который подчёркивает премиальность и технологичность продукта.",
    wp_ex2_res_li2:
      "Сайт помогает презентовать приложение как цельную экосистему, а не просто ещё один трекер привычек или калорий.",
    wp_ex2_res_li3:
      "Проект выглядит современно, дорого и хорошо подходит для презентации продукта пользователям, партнёрам или инвесторам.",
    wp_ex3_title: "Пример реализации №3",
    wp_ex3_sub: "Antarctica Tour — сайт экспедиции в Антарктиду",
    wp_ex3_task:
      "Создать многостраничный сайт для круизной компании, продающей туры в Антарктиду. Требовалось представить программу, пакеты и побудить к бронированию.",
    wp_ex3_sol_li1:
      "Разработана кастомная тема с поддержкой Custom Post Type «Туры» и таксономий (месяц, сложность).",
    wp_ex3_sol_li2:
      "Для каждого тура созданы ACF-поля: даты, цена, количество мест, галерея.",
    wp_ex3_sol_li3:
      "Интегрирован плагин календаря доступности (например, для выбора даты).",
    wp_ex3_sol_li4:
      "Добавлена мультиязычность (WPML / Polylang) для привлечения иностранных туристов.",
    wp_ex3_sol_li5: "Оптимизирована скорость и SEO.",
    wp_ex3_tools:
      "Инструменты: WordPress, ACF, Custom Post Types, WPML, плагин календаря.",
    wp_ex3_res_li1:
      "Заказчик получил функциональный сайт с удобной системой управления турами.",
    wp_ex3_res_li2: "Количество бронирований выросло на 40% после запуска.",
    wp_ex3_res_li3: "Сайт высоко оценили за дизайн и удобство навигации.",
    wp_price_title: "Стоимость WordPress",
    wp_price_sub: "От быстрых правок до сайтов с удобной админкой",
    wp_price_card1: "Fix / setup",
    wp_price_desc1: "Правки, формы, плагины, настройка темы",
    wp_price_val1: "от $45",
    wp_price_card2: "Landing on WordPress",
    wp_price_desc2: "Одностраничный сайт с редактируемым контентом",
    wp_price_val2: "от $140",
    wp_price_card3: "Custom website",
    wp_price_desc3: "Несколько страниц, кастомные блоки, ACF, удобная админка",
    wp_price_val3: "от $300",

    // --- Общие для страниц проектов (добавлено) ---
    availability_pill: "Доступен для фриланс-работы",
    detail_cta_title: "Нужен похожий проект?",
    detail_cta_desc:
      "Могу собрать похожий формат под твою задачу: от быстрого теста или одной секции до полноценного проекта.",
    detail_cta_btn1: "Обсудить задачу",
    detail_cta_btn2: "Смотреть цены",
    telegram_float: "Telegram",
  },
  en: {
    // --- Главная (уже было) ---
    nav_services: "Services",
    nav_work: "Work",
    nav_process: "Process",
    nav_about: "About",
    nav_faq: "FAQ",
    nav_contact: "Contact",
    nav_pricing: "Priscing",
    hero_pill: "Web •  Seo • WordPress • UX/UI • AI + Automations",
    hero_title_part1: "Premium websites and digital systems",
    hero_title_part2: "for brands, products and businesses that need",
    hero_title_part3: "a level above ordinary",
    hero_sub:
      "I build websites, WordPress solutions, UX/UI systems and AI automations that do more than look good — they strengthen positioning, trust and results.",
    cta_primary: "Discuss project",
    cta_secondary: "View cases",
    cta_telegram: "Telegram",
    stat_lighthouse: "Lighthouse target",
    stat_directions: "directions",
    stat_response: "hours response",
    badge_delivery: "⚡ Fast delivery",
    badge_code: "✅ Clean code",
    badge_ux: "🧠 UX-first",
    mini_web: "Web:",
    mini_web_val: "Landing / Corporate",
    mini_wp: "WP:",
    mini_wp_val: "Custom / Templates",
    mini_ui: "UX/UI:",
    mini_ui_val: "Figma systems",
    mini_ai: "AI+Auto:",
    mini_ai_val: "n8n / Bots / Content",
    tag_ui: "Black/White UI",
    tag_perf: "Performance",
    tag_sys: "Systems",
    // внутри объекта dict.en после других ключей

    seo_preview_title:
      "SEO that's visible not only in design, but also in growth",
    seo_preview_sub:
      "I show SEO as part of the system: structure, content, service pages, and clear growth points.",
    seo_preview_card_title: "What we improve",
    seo_preview_card_desc:
      "I don't just add meta tags — I structure the page so it reads better for both users and search engines.",
    seo_preview_li1: "Semantics and structure aligned with search intent",
    seo_preview_li2: "Commercial blocks, FAQ and content zones",
    seo_preview_li3: "Internal linking and page scaling",
    seo_preview_btn: "Open SEO page",
    seo_preview_label: "Growth snapshot",
    seo_kpi_1: "key clusters",
    seo_kpi_2: "optimization points",
    seo_kpi_3: "growth readiness",
    value_title: "Why it's comfortable to work with me",
    value_sub:
      "The presentation of a premium studio, but without overload and bureaucracy.",
    value_card1_title: "Fast, but neat",
    value_card1_desc:
      "I launch the project without unnecessary delays, while maintaining quality and visual level.",
    value_card2_title: "Design + code in one logic",
    value_card2_desc:
      "The result doesn't fall apart between layout and implementation — everything looks coherent and thoughtful.",
    value_card3_title: "Focus on the business task",
    value_card3_desc:
      "The site should present, build trust and help get leads, not just be beautiful.",
    services_title: "Services",
    service_web_title: "Web Development",
    service_web_desc: "Custom development: speed, effects, clean structure.",
    service_web_li1: "Landing / Corporate",
    service_web_li2: "Adaptive + pixel-perfect",
    service_web_li3: "Forms + integrations",
    service_wp_title: "WordPress",
    service_wp_desc: "Custom & template solutions — fast and clean.",
    service_wp_li1: "Custom Theme / ACF",
    service_wp_li2: "Template setup + custom blocks",
    service_wp_li3: "Optimization & security",
    service_ui_title: "UX/UI (Figma)",
    service_ui_desc: "Layouts, design systems, conversion-focused structure.",
    service_ui_li1: "Grid, typography, UI-kit",
    service_ui_li2: "Desktop + Mobile",
    service_ui_li3: "Prototyping",
    service_seo_title: "SEO",
    service_seo_desc:
      "SEO structure, on-page optimization and search visibility growth.",
    service_seo_li1: "On-page SEO",
    service_seo_li2: "Structure + meta tags",
    service_seo_li3: "Content and growth points",
    service_ai_title: "AI + Automations",
    service_ai_desc:
      "Systems: content + processes + leads. AI not 'for the sake of AI', but for results.",
    service_ai_li1: "n8n pipelines / integrations",
    service_ai_li2: "Telegram bots / notifications",
    service_ai_li3: "Content → autoposting → lead",
    cta_title: "Need a quick test?",
    cta_desc:
      "I can build a test: one section layout or a mini-page for their task.",
    cta_btn: "Write",
    pricing_title: "Pricing",
    pricing_sub: "Typical budget ranges for the most requested work",
    pricing_web_title: "Custom Code Websites",
    pricing_web_desc:
      "Custom coded websites and promo pages built from scratch.",
    pricing_web_1: "Start — from $150",
    pricing_web_2: "Standard — from $300",
    pricing_web_3: "Premium — from $500",
    pricing_ui_title: "UX/UI & Figma",
    pricing_ui_desc:
      "Design for landing pages, websites and interfaces in Figma.",
    pricing_ui_1: "Start — from $70",
    pricing_ui_2: "Standard — from $140",
    pricing_ui_3: "Premium — from $250",
    pricing_seo_title: "SEO",
    pricing_seo_desc:
      "Basic SEO setup, content structure and preparation for growth.",
    pricing_seo_1: "Start — from $100",
    pricing_seo_2: "Standard — from $220",
    pricing_seo_3: "Growth — from $350",
    pricing_auto_title: "WordPress & Automations",
    pricing_auto_desc:
      "WordPress projects and AI / n8n automations tailored to business goals.",
    pricing_auto_1: "Start — from $120",
    pricing_auto_2: "Standard — from $250",
    pricing_auto_3: "Systems — from $400",
    work_title: "Work",
    work_web_title: "Web — Landing / Corporate",
    work_web_desc: "Custom development, effects, responsive, speed.",
    work_wp_title: "WordPress — Custom + Templates",
    work_wp_desc: "Custom theme or template: fast and clean.",
    work_ui_title: "UX/UI — Figma Systems",
    work_ui_desc: "Layouts, UI-kit, conversion-focused structure.",
    work_seo_title: "SEO — Strategy + On-page",
    work_seo_desc:
      "SEO structure, on-page optimization and search visibility growth.",
    work_ai_title: "AI + Automations — Systems",
    work_ai_desc: "Content + autoposting + lead → CRM / Sheets → Telegram.",
    work_perf_title: "Performance — Speed + Conversion",
    work_perf_desc:
      "Speed, structure, UX signals and blocks that boost conversion.",
    open: "Open !",
    process_title: "Process",
    process_1_title: "Discovery",
    process_1_desc: "Goal, audience, structure, content, CTA.",
    process_1_li1: "Gather requirements",
    process_1_li2: "Define structure",
    process_1_li3: "Agree on format",
    process_2_title: "UX/UI",
    process_2_desc: "Figma: prototype, design system, responsive.",
    process_2_li1: "Grid/typography",
    process_2_li2: "UI kit",
    process_2_li3: "Desktop + Mobile",
    process_3_title: "Build",
    process_3_desc: "Coding/WordPress: clean, fast, tidy.",
    process_3_li1: "HTML/CSS/JS",
    process_3_li2: "WP (Custom/Template)",
    process_3_li3: "Optimization",
    process_4_title: "Integrations",
    process_4_desc: "AI + automations: leads, content, processes.",
    process_4_li1: "n8n pipelines",
    process_4_li2: "Telegram notifications",
    process_4_li3: "CRM/Sheets",
    process_5_title: "Deploy",
    process_5_desc: "Launch: GitHub/hosting/domain.",
    process_5_li1: "SSL",
    process_5_li2: "Testing",
    process_5_li3: "Checklist",
    process_6_title: "Support",
    process_6_desc: "Edits and improvements based on data.",
    process_6_li1: "Support",
    process_6_li2: "Improvements",
    process_6_li3: "Auto processes",
    about_title: "About",
    about_sub: "Brief, confident, to the point.",
    about_pos_title: "Positioning",
    about_pos_text:
      "Main experience — custom website development and coding, plus UX/UI in Figma. I use WordPress for projects where a convenient admin panel and fast launch are important (custom & template solutions). I add AI+automations to make the project not just 'look good', but work as a system.",
    about_pos_li1: "Clean code & structure",
    about_pos_li2: "Minimalist UI",
    about_pos_li3: "Integrations & automation",
    about_stack_title: "Stack",
    about_stack_wp: "WordPress: Theme / ACF / Templates",
    about_btn: "Write",
    faq_title: "FAQ",
    faq_sub: "Short answers to close doubts.",
    faq_q1: "Do you do WordPress on custom themes and templates?",
    faq_a1:
      "Yes. I can quickly build on a template (and customize), or create a custom theme + ACF for a convenient admin panel.",
    faq_q2: "UX/UI — is it just design or also logic?",
    faq_a2:
      "Both design and logic. Section structure, scenarios, CTA, responsive — all in Figma.",
    faq_q3: "AI + automation — what exactly?",
    faq_a3:
      "Content/scripts/templates + n8n processes: autoposting, lead collection, notifications, CRM/Sheets logging.",
    faq_q4: "Can we start with a test?",
    faq_a4:
      "Yes. Mini-test: 1 coded section / 1 UI screen / mini n8n automation.",
    contact_title: "Contact",
    contact_sub: "Fill out the form — I'll reply within 24h",
    contact_info_title: "Contacts",
    contact_info_change: "Replace with yours:",
    contact_info_more: "You can add LinkedIn/Behance.",
    form_name_label: "Name",
    form_name_placeholder: "Your name",
    form_email_label: "Email",
    form_email_placeholder: "name@company.com",
    form_service_label: "Service",
    form_service_placeholder: "— Select —",
    form_service_other: "Other",
    form_task_label: "Brief",
    form_task_placeholder: "Describe your idea or task...",
    form_send: "Send",
    mini_seo: "SEO:",
    mini_seo_val: "Structure / On-page / Growth",
    seo_growth_title: "How SEO growth looks in presentation",
    seo_growth_sub:
      "On the page you can show not just the service, but the logic of improvement: structure, dynamics, and big numbers.",
    seo_growth_card1: "optimized blocks",
    seo_growth_card2: "clusters for landing pages",
    seo_growth_card3: "growth points and internal linking",
    seo_page_kpi_1: "growth pages",
    seo_page_kpi_2: "SEO improvement points",
    seo_page_kpi_3: "structural readiness",
    footer_tag: "One-page • 5 Directions • Premium Minimal",

    // --- AI страница ---
    ai_title: "AI + Automation Systems",
    ai_sub:
      "Systems that turn content and leads into a process: ideas → content → publication → lead → processing → notifications.",
    ai_what_title: "What I do",
    ai_what_li1:
      "Lead automation: forms/DM → validation → CRM/Sheets → notifications",
    ai_what_li2:
      "AI processing: classification, data extraction, auto-summaries",
    ai_what_li3:
      "Content system: templates, scenarios, preparation and publishing",
    ai_what_li4: "Integrations: API, Webhooks, Telegram, spreadsheets, CRM",
    ai_chains_title: "Typical chains",
    ai_chains_li1:
      "New request → AI extraction → recording → manager notification",
    ai_chains_li2: "Leads → segmentation → distribution → auto-replies",
    ai_chains_li3: "Data → AI summary → weekly report in Telegram",
    ai_btn_request: "Request",
    ai_btn_back: "Back",
    ai_looks_title: "How it looks",
    ai_looks_desc: "Example stack: n8n + OpenAI + Google Sheets + Telegram.",
    ai_ex1_title: "Example #1",
    ai_ex1_sub: "Automatic reception and qualification of leads from Telegram",
    ai_ex1_task_title: "Task",
    ai_ex1_task_text:
      "Telegram bot receives client requests in free form. Managers manually read messages, forwarded them to CRM, and spent time on initial questioning. Leads were lost outside working hours.",
    ai_ex1_sol_title: "Solution",
    ai_ex1_sol_li1: "Message reception: bot receives text, photos, contacts.",
    ai_ex1_sol_li2:
      "AI analysis: GPT extracts key data (name, phone, interest, budget).",
    ai_ex1_sol_li3:
      "Validation and enrichment: phone verification, duplicate search in Google Sheets.",
    ai_ex1_sol_li4:
      "CRM entry: creating a deal in Bitrix24 / saving to a table.",
    ai_ex1_sol_li5:
      "Notifications: manager receives a lead card in Telegram with buttons 'take to work', 'spam'.",
    ai_ex1_stack:
      "Stack: python/aiogram, n8n, OpenAI API, Google Sheets API, Telegram API.",
    ai_ex1_res_title: "Result",
    ai_ex1_res_li1: "Lead response time reduced from 30 minutes to 1 minute.",
    ai_ex1_res_li2: "Zero leads lost outside working hours.",
    ai_ex1_res_li3: "Managers only handle warm contacts.",
    ai_ex1_res_li4: "All leads are saved in a database for analytics.",
    ai_ex1_scheme: "*workflow: bot → AI → CRM → notification",
    ai_ex2_title: "Example #2",
    ai_ex2_sub: "Content pipeline: from idea to social media post",
    ai_ex2_task_text:
      "SMM manager spent 4 hours a day inventing posts, selecting images, and publishing in five channels. It was necessary to increase posting frequency without hiring additional people.",
    ai_ex2_sol_li1:
      "Idea planner: Notion / Google Sheets — table with topics, keywords, formats.",
    ai_ex2_sol_li2:
      "AI generation: on schedule, a script takes a topic and writes a post text using YandexGPT / ChatGPT (adapts tone to platform).",
    ai_ex2_sol_li3:
      "Visual selection: integration with Unsplash or image generation via Kandinsky / DALL·E.",
    ai_ex2_sol_li4:
      "Publication: via API or low-level tools (Telegram, VK, Instagram) the post goes out automatically.",
    ai_ex2_stack:
      "Stack: n8n, OpenAI, Kandinsky API, Notion API, Telegram Bot API.",
    ai_ex2_res_li1: "Time to create one post — 5 minutes (instead of 40).",
    ai_ex2_res_li2: "Number of posts increased from 2 to 5 per day.",
    ai_ex2_res_li3: "Engagement didn't drop — content adapts to the audience.",
    ai_ex2_res_li4:
      "Manager focuses on strategy and communication, not copywriting.",
    ai_ex2_scheme: "*pipeline: idea → AI text → AI visual → publication",
    ai_price_title: "Automation pricing",
    ai_price_sub: "Suitable for quick MVP chains and business processes",
    ai_price_card1: "Mini automation",
    ai_price_desc1: "Notifications, simple integration, mini-flow",
    ai_price_val1: "from $120",
    ai_price_card2: "Lead flow / bot flow",
    ai_price_desc2: "Leads, Telegram, CRM, tables, qualification",
    ai_price_val2: "from $250",
    ai_price_card3: "Complex system",
    ai_price_desc3: "Full business chain with AI and n8n",
    ai_price_val3: "from $500",

    // --- UX/UI страница ---
    ui_title: "UX/UI — website and landing page design",
    ui_sub: "Modern interfaces, high conversion, responsiveness.",
    ui_what_li1: "Design of landing pages, online stores, corporate websites.",
    ui_what_li2: "UX research, prototyping, CJM.",
    ui_what_li3: "UI-kit / design system development in Figma.",
    ui_what_li4: "Responsive layouts for all devices.",
    ui_approach_li1: "Focus on business goals and conversion.",
    ui_approach_li2: "Modern aesthetics and attention to detail.",
    ui_approach_li3: "Close work with developers.",
    ui_works_title: "My design work",
    ui_petclip: "SmartPetClip",
    ui_nutriboost: "NutriBoost",
    ui_antarctica: "Antarctica",
    ui_ex1_title: "Example #1",
    ui_ex1_sub: "SmartPetClip — website design for selling dog trackers",
    ui_ex1_task:
      "Design a multi-page website for a smart dog collar brand. It was necessary to present several models (Black, Pink), talk about the product, show how it works, and provide an opportunity to contact.",
    ui_ex1_sol_li1:
      "Created a home page with large visuals and brief characteristics.",
    ui_ex1_sol_li2:
      "Separate pages for each model with detailed descriptions and photos.",
    ui_ex1_sol_li3: "Sections 'About the product', 'How it works', contacts.",
    ui_ex1_sol_li4: "Responsive design for mobile devices.",
    ui_ex1_sol_li5: "Designed convenient navigation and calls to action.",
    ui_ex1_tools: "Tools: Figma, auto-layouts, components.",
    ui_ex1_res_li1: "Stylish, modern design ready for development.",
    ui_ex1_res_li2: "The client immediately approved the layout without edits.",
    ui_ex2_title: "Example #2",
    ui_ex2_sub: "Antarctica — landing page design for an Antarctic expedition",
    ui_ex2_task:
      "Design a landing page for a cruise to Antarctica. Need to convey the atmosphere of adventure, present the program, cabin options, and encourage booking.",
    ui_ex2_sol_li1:
      "Homepage with a large photo of icebergs, counters (days, animal species) and a booking button.",
    ui_ex2_sol_li2:
      "Block of expedition uniqueness with icons (whales, penguins, icebergs).",
    ui_ex2_sol_li3: "Description of the vessel and itinerary by day.",
    ui_ex2_sol_li4: "Cabin grid with prices and details.",
    ui_ex2_sol_li5: "Adaptive to all screens.",
    ui_ex2_tools: "Tools: Figma, prototyping, grids.",
    ui_ex2_res_li1: "Emotional and informative design engaging to travel.",
    ui_ex2_res_li2: "The client received a layout ready for development.",
    ui_ex2_res_li3: "Project featured on Behance.",
    ui_ex3_title: "Example #3",
    ui_ex3_sub: "NutriBoost — landing page design for personalized vitamins",
    ui_ex3_task:
      "Create a two-page landing page design for a vitamin selection service. The main page should encourage taking a test, and the Benefits page should tell about the advantages.",
    ui_ex3_sol_li1:
      "Home: bright headline, description, 'Start Test' button, minimalist design.",
    ui_ex3_sol_li2:
      "Benefits page: listing advantages (scientific approach, clean ingredients), three steps of the service.",
    ui_ex3_sol_li3: "Unified color scheme (green/white), modern typography.",
    ui_ex3_sol_li4: "Adaptation for mobile devices.",
    ui_ex3_tools: "Tools: Figma, components, grids.",
    ui_ex3_res_li1: "Concise and convincing design that increases trust.",
    ui_ex3_res_li2: "The client received a ready-made layout for development.",
    ui_price_title: "UX/UI pricing",
    ui_price_sub: "No overpricing — real prices for portfolio and market",
    ui_price_card1: "Quick concept",
    ui_price_desc1: "1 screen, quick concept, hero or section design",
    ui_price_val1: "from $35",
    ui_price_card2: "Landing design",
    ui_price_desc2: "Full landing page design in Figma",
    ui_price_val2: "from $80",
    ui_price_card3: "Website design",
    ui_price_desc3: "Multiple pages, system, responsive",
    ui_price_val3: "from $180",

    // --- Web страница ---
    web_title: "Web — Landing / Corporate",
    web_sub: "Custom development, effects, responsive, speed.",
    web_what_li1:
      "Development of landing pages and corporate sites from scratch (HTML/CSS/JS).",
    web_what_li2: "Animations, micro‑interactions, parallax.",
    web_what_li3: "Full adaptability to all devices.",
    web_what_li4: "Loading speed optimization and SEO basics.",
    web_use_li1: "Clean code or builds (Gulp, Webpack).",
    web_use_li2: "Modern CSS frameworks (Tailwind, SCSS).",
    web_use_li3: "JavaScript (Vanilla, React if needed).",
    web_works: "My work",
    web_ex1_title: "Example #1",
    web_ex1_sub:
      "Website for the 'NordWoods' retreat house — fully functional project",
    web_ex1_task:
      "Develop and layout a full website for a country house rented daily. The main goal is to attract guests, convenient booking, and convey the atmosphere of solitude in nature.",
    web_ex1_sol_li1:
      "Created an adaptive landing page in pure HTML/CSS/JS with a focus on visual aesthetics and convenience.",
    web_ex1_sol_li2:
      "Implemented a photo gallery with a light slider, route map (Yandex/Google Maps), feedback form.",
    web_ex1_sol_li3:
      "Added smooth animations on scroll and element appearance to engage visitors.",
    web_ex1_sol_li4:
      "Integrated availability calendar (via third-party service or custom) and a booking button leading to chat/call.",
    web_ex1_sol_li5: "Optimized loading speed and adapted for mobile devices.",
    web_ex1_stack:
      "Stack: HTML5, CSS3 (Flex/Grid), JavaScript (ES6+), animation libraries (AOS or custom), maps, form with validation.",
    web_ex1_res_li1:
      "The site is fully ready for publication, all pages are adaptive, tested in major browsers.",
    web_ex1_res_li2:
      "The house owner receives applications through the form, and visitors get complete information about the house and surroundings.",
    web_ex1_res_li3:
      "Thanks to clean code and structure, the site is easy to extend for new tasks.",
    web_ex1_btn: "🌐 View site",
    web_ex2_title: "Example #2",
    web_ex2_sub:
      "Website for the travel agency 'JapanVoyage' — fully functional project",
    web_ex2_task:
      "Develop and layout a website for a travel company specializing in tours to Japan. Need to convey the atmosphere of the country, provide a convenient tour catalog and booking system.",
    web_ex2_sol_li1:
      "Created an adaptive multi-page site in HTML/CSS/JS using modern semantics and speed optimization.",
    web_ex2_sol_li2:
      "Developed a tour catalog with filtering by price, duration, and season (implemented in pure JS).",
    web_ex2_sol_li3:
      "Integrated a map of attractions (Yandex Maps API) and a photo gallery with lightbox.",
    web_ex2_sol_li4:
      "Added a feedback form with validation and data sending (via Formspree or similar service).",
    web_ex2_sol_li5:
      "Adapted the interface for mobile devices, thought out navigation and micro-animations for engagement.",
    web_ex2_stack:
      "Stack: HTML5, CSS3 (Flex/Grid, SCSS), JavaScript (ES6+), Maps API, slider libraries (Swiper), modular code structure.",
    web_ex2_res_li1:
      "Full website with catalog, tour cards, and application form — all works without a backend (using ready-made solutions for sending forms).",
    web_ex2_res_li2:
      "The client received a ready product that can be hosted anywhere.",
    web_ex2_res_li3:
      "The site inspires trust thanks to high-quality layout and attention to detail.",
    web_price_title: "Web development pricing",
    web_price_sub: "Flexible ranges for quick tasks and full sites",
    web_price_card1: "Quick fix",
    web_price_desc1: "Edits, responsive, 1 section, bugs",
    web_price_val1: "from $40",
    web_price_card2: "Landing page",
    web_price_desc2: "One-page site for a service, product or ad",
    web_price_val2: "from $120",
    web_price_card3: "Corporate / multi-page",
    web_price_desc3: "Multi-page site, complex blocks, custom logic",
    web_price_val3: "from $280",

    // --- SEO page keys (English) ---
    seo_title: "SEO for websites that should not just look good but be found",
    seo_sub:
      "I help build the SEO foundation: structure, meta tags, texts, landing pages, and recommendations for organic traffic growth.",
    seo_what_title: "What I do",
    seo_what_li1:
      "On-page SEO: title, description, H1-H3, alt, internal structure.",
    seo_what_li2: "SEO structure for service pages, locations, or categories.",
    seo_what_li3:
      "Content recommendations: which blocks, texts and FAQ boost visibility.",
    seo_what_li4:
      "Technical basics: speed, indexing, internal linking, basic markup.",
    seo_approach_title: "Approach",
    seo_approach_li1:
      "First business logic and semantics, then design and copy.",
    seo_approach_li2:
      "No spam or promises of 'top-1 in a week' — just a solid foundation and growth.",
    seo_approach_li3:
      "SEO considered together with design, structure, and conversion.",
    seo_looks_title: "What the client gets",
    seo_looks_desc:
      "The result is a site that looks premium, reads clearly, and is ready for organic growth.",
    seo_ex1_title: "Example #1",
    seo_ex1_sub: "SEO packaging for a local business service",
    seo_ex1_task:
      "I needed to design a service page so that it looked premium, read well, and attracted organic traffic for commercial queries.",
    seo_ex1_sol_li1:
      "Restructured the hero section, headings, and blocks into a clear search-friendly layout.",
    seo_ex1_sol_li2:
      "Added commercial sections: benefits, steps, FAQ, CTA, and local trust triggers.",
    seo_ex1_sol_li3:
      "Prepared title, description, and copy recommendations without keyword stuffing.",
    seo_ex1_tools:
      "Tools: SEO structure, copywriting, UX logic, on-page optimization.",
    seo_ex1_res_li1:
      "The page became stronger for both the client and the search engine.",
    seo_ex1_res_li2:
      "A clear logic for scaling to other services and landing pages appeared.",
    seo_ex2_title: "Example #2",
    seo_ex2_sub: "Content structure for a multi-page site",
    seo_ex2_task:
      "On the project, we needed to organize services and content so that the site wouldn't compete with itself and each page would match its search intent.",
    seo_ex2_sol_li1:
      "Divided pages into clusters: homepage, services, sub-services, FAQ, and cases.",
    seo_ex2_sol_li2:
      "Designed internal linking and navigation logic between pages.",
    seo_ex2_sol_li3:
      "Provided recommendations for URLs, headings, and metadata for each group of pages.",
    seo_ex2_tools:
      "Tools: information architecture, SEO mapping, internal linking.",
    seo_ex2_res_li1:
      "The site got a cleaner structure without query cannibalization.",
    seo_ex2_res_li2:
      "The team found it easier to scale content and create new landing pages.",
    seo_price_title: "SEO pricing",
    seo_price_sub: "From basic optimization to growth structure",
    seo_price_card1: "SEO start",
    seo_price_desc1: "Basic meta tags, headings, alt, and page recommendations",
    seo_price_val1: "from $100",
    seo_price_card2: "SEO landing",
    seo_price_desc2: "Structure, commercial blocks, FAQ, content logic",
    seo_price_val2: "from $220",
    seo_price_card3: "SEO system",
    seo_price_desc3:
      "Site map, internal linking, cluster recommendations and scalability",
    seo_price_val3: "from $350",

    // Performance
    perf_title:
      "Performance for websites that need growth and strong presentation",
    perf_sub:
      "Speed, Core Web Vitals, block structure and UX signals that affect conversion.",
    perf_what_title: "What I improve",
    perf_what_li1: "Loading speed and visual stability of the interface.",
    perf_what_li2: "Core Web Vitals, hero and CTA blocks structure.",
    perf_what_li3: "Section logic so the site leads to a request more easily.",
    perf_what_li4: "Mobile readability, grid, spacing and UX signals.",
    perf_use_title: "What’s included",
    perf_use_li1:
      "Audit of the first screen, cards, forms and scroll scenarios.",
    perf_use_li2: "Structure, contrast, rhythm and visual accent fixes.",
    perf_use_li3: "Preparing the site for growth through speed + conversion.",
    perf_dashboard_title: "Performance dashboard",
    viz_load_time: "load time",
    viz_mobile_ready: "mobile ready",
    viz_breakpoints: "breakpoints",
    viz_perf: "Performance",
    viz_accessibility: "Accessibility",
    viz_structure: "Structure",
    perf_price_title: "Performance pricing",
    perf_dashboard_title: "Performance dashboard",
    perf_lighthouse_label: "Lighthouse",
    viz_load_time: "load time",
    viz_mobile_ready: "mobile ready",
    viz_breakpoints: "breakpoints",
    viz_perf: "Performance",
    viz_accessibility: "Accessibility",
    viz_structure: "Structure",
    perf_price_sub:
      "Suitable for targeted improvements and full site packaging",
    perf_price_card1: "Audit / quick fixes",
    perf_price_desc1: "Audit, quick UX/CWV fixes, hero and CTA",
    perf_price_val1: "from $60",
    perf_price_card2: "Landing optimization",
    perf_price_desc2:
      "Improvement of structure, block rhythm and conversion logic",
    perf_price_val2: "from $140",
    perf_price_card3: "Full performance pack",
    perf_price_desc3: "Speed + UX + visual presentation for the whole site",
    perf_price_val3: "from $260",

    // --- WordPress страница ---
    wp_title: "WordPress — ready projects",
    wp_sub:
      "Three sites created on WordPress with individual design and functionality.",
    wp_what_li1: "Custom theme development from scratch (PHP, ACF, Timber).",
    wp_what_li2: "Adaptation of ready-made templates to client's tasks.",
    wp_what_li3:
      "Creation of Custom Post Types and taxonomies (e.g., 'Houses', 'Tours').",
    wp_what_li4:
      "Plugin configuration (Contact Form 7, WooCommerce, Yoast SEO).",
    wp_what_li5: "Speed, security, and mobile optimization.",
    wp_approach_li1:
      "Convenient admin panel for the client (ACF fields, custom settings).",
    wp_approach_li2: "Clean code and semantics.",
    wp_approach_li3: "Responsiveness and cross-browser compatibility.",
    wp_works_title: "My latest work",
    wp_house: "Elara Mind",
    wp_glamping: "Viora",
    wp_antarctica: "Antarctica Tour",
    wp_ex1_title: "Example #1",
    wp_ex1_sub:
      "Elara Mind — premium website for a private psychology practice",
    wp_ex1_task:
      "Develop a modern and elegant website for a private psychologist based on a ready-made Figma design. It was important to preserve a premium presentation, a calm visual atmosphere, a convenient structure for booking a session, and make the site easy to manage through WordPress.",
    wp_ex1_sol_li1:
      "The website was developed from a custom Figma layout with careful attention to typography, spacing, color palette, and the overall visual style.",
    wp_ex1_sol_li2:
      "The site was built on WordPress with a custom theme and no overloaded templates, in order to preserve a clean and premium look.",
    wp_ex1_sol_li3:
      "Flexible fields were added for editing key sections: text, buttons, services, stories, FAQ, and contact blocks.",
    wp_ex1_sol_li4:
      "A consultation booking form and convenient navigation across all main sections were implemented.",
    wp_ex1_sol_li5:
      "The website was fully adapted for mobile devices and tablets while keeping the layout balanced and readable.",
    wp_ex1_tools:
      "Tools: WordPress, Figma, ACF Pro, custom theme, HTML, CSS, JavaScript.",
    wp_ex1_res_li1:
      "The final result is a stylish and trustworthy website that highlights the specialist’s expertise and premium approach.",
    wp_ex1_res_li2:
      "The client received a convenient WordPress admin panel for editing content independently without touching the code.",
    wp_ex1_res_li3:
      "The website displays correctly on all devices and helps guide users toward booking a consultation.",
    wp_ex2_title: "Example #2",
    wp_ex2_sub:
      "Viora — premium website for an AI productivity and nutrition app",
    wp_ex2_task:
      "Develop a premium high-impact website for a digital product that combines daily planning, AI food recognition, calorie tracking, readiness metrics, and personalized recommendations in one app. The goal was to highlight the product’s technological edge, modern visual style, and create a strong presentation for future users and investors.",
    wp_ex2_sol_li1:
      "A custom interface was developed based on an individual design concept with a focus on dark premium styling, oversized typography, soft glow effects, and layered UI composition.",
    wp_ex2_sol_li2:
      "Responsive front-end implementation of the key screens was completed with careful attention to the hero section, metric cards, AI blocks, and product-focused visual hierarchy.",
    wp_ex2_sol_li3:
      "The product’s core features were presented through a clear visual structure: deep-focus planning, AI meal recognition, calorie tracking, readiness metrics, and adaptive coaching.",
    wp_ex2_sol_li4:
      "Strong CTA sections, engagement scenarios, and a conversion-focused layout were added to communicate the product value quickly and clearly.",
    wp_ex2_sol_li5:
      "The website was fully adapted for mobile devices and tablets while preserving visual depth and a clean premium composition.",
    wp_ex2_tools:
      "Tools: Figma, WordPress, custom theme, HTML, CSS, JavaScript, ACF Pro.",
    wp_ex2_res_li1:
      "The final result is a strong visual concept that highlights both the premium feel and the technological nature of the product.",
    wp_ex2_res_li2:
      "The website presents the app as a complete ecosystem rather than just another habit or calorie tracker.",
    wp_ex2_res_li3:
      "The project looks modern, polished, and well-suited for presenting the product to users, partners, or investors.",
    wp_ex3_title: "Example #3",
    wp_ex3_sub: "Antarctica Tour — expedition website",
    wp_ex3_task:
      "Create a multi-page website for a cruise company selling tours to Antarctica. It was required to present the program, packages, and encourage booking.",
    wp_ex3_sol_li1:
      "Developed a custom theme with Custom Post Type 'Tours' and taxonomies (month, difficulty).",
    wp_ex3_sol_li2:
      "ACF fields created for each tour: dates, price, number of places, gallery.",
    wp_ex3_sol_li3:
      "Integrated an availability calendar plugin (e.g., for date selection).",
    wp_ex3_sol_li4:
      "Added multilingual support (WPML / Polylang) to attract foreign tourists.",
    wp_ex3_sol_li5: "Optimized speed and SEO.",
    wp_ex3_tools:
      "Tools: WordPress, ACF, Custom Post Types, WPML, calendar plugin.",
    wp_ex3_res_li1:
      "The client received a functional website with a convenient tour management system.",
    wp_ex3_res_li2: "Number of bookings increased by 40% after launch.",
    wp_ex3_res_li3:
      "The site was highly rated for design and ease of navigation.",
    wp_price_title: "WordPress pricing",
    wp_price_sub: "From quick fixes to sites with convenient admin panel",
    wp_price_card1: "Fix / setup",
    wp_price_desc1: "Edits, forms, plugins, theme setup",
    wp_price_val1: "from $45",
    wp_price_card2: "Landing on WordPress",
    wp_price_desc2: "One-page site with editable content",
    wp_price_val2: "from $140",
    wp_price_card3: "Custom website",
    wp_price_desc3: "Multiple pages, custom blocks, ACF, convenient admin",
    wp_price_val3: "from $300",

    // --- Общие для страниц проектов (добавлено) ---
    availability_pill: "Available for freelance work",
    detail_cta_title: "Need a similar project?",
    detail_cta_desc:
      "I can build a similar format for your task: from a quick test or one section to a full-fledged project.",
    detail_cta_btn1: "Discuss project",
    detail_cta_btn2: "View pricing",
    telegram_float: "Telegram",
  },
};

function applyLang(lang) {
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key && dict[lang][key]) {
      el.textContent = dict[lang][key];
    }
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (key && dict[lang][key]) {
      el.placeholder = dict[lang][key];
    }
  });
  const btn = document.getElementById("langBtn");
  if (btn) btn.textContent = lang === "ru" ? "EN" : "RU";
}

const langBtn = document.getElementById("langBtn");
if (langBtn) {
  langBtn.addEventListener("click", () => {
    const current = localStorage.getItem("lang") || "ru";
    applyLang(current === "ru" ? "en" : "ru");
  });
}
applyLang(localStorage.getItem("lang") || "ru");

// ==================== Contact form (улучшенная) ====================
const leadForm = document.getElementById("leadForm");
console.log("leadForm found:", leadForm); // для отладки

if (leadForm) {
  leadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Form submit event fired");
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const lang = localStorage.getItem("lang") || "ru";

    if (!data.name || !data.email || !data.service) {
      alert(
        lang === "ru"
          ? "Пожалуйста, заполните имя, email и выберите услугу."
          : "Please fill in name, email and select a service."
      );
      return;
    }

    console.log("Form submitted:", data);
    const hint = document.getElementById("formHint");
    hint.textContent =
      lang === "ru"
        ? "✓ Спасибо! Я свяжусь с вами в ближайшее время."
        : "✓ Thank you! I'll get back to you soon.";
    hint.style.color = "#4caf50";
    form.reset();

    // TODO: real fetch to Formspree / n8n
  });
} else {
  console.error("Элемент #leadForm не найден!");
}

// ==================== Contact form ====================

const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  formStatus.textContent = "Sending...";
  formStatus.className = "form__status";

  const data = new FormData(form);

  try {
    const res = await fetch("https://formspree.io/f/xkgbqgva", {
      method: "POST",
      body: data,
      headers: {
        Accept: "application/json",
      },
    });

    if (res.ok) {
      form.reset();

      formStatus.textContent = "Message sent ✔";
      formStatus.classList.add("success");
    } else {
      throw new Error("error");
    }
  } catch {
    formStatus.textContent = "Error sending message";
    formStatus.classList.add("error");
  }
});

const progressBar = document.querySelector(".scroll-progress__bar");

function updateScrollProgress() {
  if (!progressBar) return;

  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  progressBar.style.width = `${progress}%`;
}

window.addEventListener("scroll", updateScrollProgress);
window.addEventListener("load", updateScrollProgress);
window.addEventListener("resize", updateScrollProgress);

// ==================== INTRO VIDEO ====================
document.addEventListener("DOMContentLoaded", function () {
  const intro = document.getElementById("introVideo");
  const video = document.getElementById("introVideoPlayer");
  const site = document.getElementById("siteWrap");

  if (!intro || !video || !site) return;

  document.body.classList.add("intro-active");

  let finished = false;

  function showSite() {
    if (finished) return;
    finished = true;

    intro.classList.add("hidden");

    setTimeout(() => {
      site.classList.add("loaded");
      document.body.classList.remove("intro-active");
      runHeroIntroAnimations();
    }, 300);

    setTimeout(() => {
      intro.remove();
    }, 1500);
  }

  video.addEventListener("ended", showSite);
  video.addEventListener("error", showSite);

  // Запасной таймаут на случай, если видео не загрузится
  setTimeout(showSite, 7000);
});

function animateCounter(el, duration = 1400) {
  const target = Number(el.dataset.count || 0);
  const start = 0;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.floor(start + (target - start) * easeOutCubic(progress));
    el.textContent = value;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function runHeroIntroAnimations() {
  const hero = document.getElementById("heroAnimated");
  if (!hero || hero.dataset.played === "true") return;

  hero.dataset.played = "true";
  hero.classList.add("play");

  const counters = hero.querySelectorAll(".stat__num");

  setTimeout(() => animateCounter(counters[0], 1400), 1150);
  setTimeout(() => animateCounter(counters[1], 1100), 1280);
  setTimeout(() => animateCounter(counters[2], 1300), 1410);
}

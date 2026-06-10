/* ==========================================
   Magma Lukoil Web App - Application Controller (Standalone)
   ========================================== */

// Global Application State
const state = {
  activeTab: 'home',
  booking: {
    step: 1,
    services: [], // { id, name, price }
    carBrand: '',
    oilVolume: 'not-sure',
    comment: '',
    date: null, // { dateString, displayDate }
    time: null,
    name: '',
    phone: '',
    catalogAddedItems: [] // Products added to booking list
  },
  catalog: {
    activeCategory: 'all',
    searchQuery: ''
  }
};

// MOCK DATA
const SERVICES = [
  { id: 'srv-oil-change', name: 'Экспресс-замена моторного масла', price: 600, desc: 'Замена масла методом вакуумного отсоса или сливом за 15 минут. Бесплатно при покупке масла.', icon: 'fa-droplet' },
  { id: 'srv-filter-oil', name: 'Замена масляного фильтра', price: 200, desc: 'Замена масляного фильтра с проверкой герметичности уплотнения.', icon: 'fa-oil-can' },
  { id: 'srv-filter-air', name: 'Замена воздушного фильтра', price: 250, desc: 'Рекомендуется производить замену каждую замену масла для защиты двигателя от пыли.', icon: 'fa-wind' },
  { id: 'srv-filter-cabin', name: 'Замена салонного фильтра', price: 300, desc: 'Очистка воздуха, поступающего в салон автомобиля. Устраняет запахи.', icon: 'fa-fan' },
  { id: 'srv-checkup', name: 'Комплексный осмотр подкапотного пространства', price: 400, desc: 'Проверка уровней антифриза, тормозной жидкости, осмотр приводных ремней и патрубков.', icon: 'fa-magnifying-glass-chart' }
];

const PRODUCTS = [
  { id: 'prod-genesis-40', category: 'oils', name: 'Lukoil Genesis Armortech 5W-40', brand: 'Lukoil', price: 3400, specs: { 'Вязкость': '5W-40', 'Объем': '4 л', 'Тип': 'Синтетика', 'Допуски': 'API SN/CF, MB 229.5' }, desc: 'Всесезонное полностью синтетическое моторное масло последнего поколения для современных бензиновых и дизельных двигателей.', img: 'https://lukoil-masla.ru/images/genesis_5w40.png', tag: 'Популярно' },
  { id: 'prod-genesis-30', category: 'oils', name: 'Lukoil Genesis Armortech 5W-30', brand: 'Lukoil', price: 3600, specs: { 'Вязкость': '5W-30', 'Объем': '4 л', 'Тип': 'Синтетика', 'Допуски': 'API SL/CF, Ford WSS' }, desc: 'Синтетическое моторное масло для бензиновых и дизельных двигателей легковых автомобилей, в том числе оборудованных турбонаддувом.', img: 'https://lukoil-masla.ru/images/genesis_5w30.png', tag: 'Эко' },
  { id: 'prod-super-40', category: 'oils', name: 'Lukoil Super 10W-40', brand: 'Lukoil', price: 1800, specs: { 'Вязкость': '10W-40', 'Объем': '4 л', 'Тип': 'Полусинтетика', 'Допуски': 'API SG/CD' }, desc: 'Высококачественное полусинтетическое моторное масло, предназначенное для бензиновых и дизельных двигателей легковых автомобилей.', img: 'https://lukoil-masla.ru/images/super_10w40.png' },
  { id: 'prod-mobil-40', category: 'oils', name: 'Mobil Super 3000 x1 5W-40', brand: 'Mobil', price: 4800, specs: { 'Вязкость': '5W-40', 'Объем': '4 л', 'Тип': 'Синтетика', 'Допуски': 'API SN/SM, MB 229.3' }, desc: 'Синтетическое моторное масло, обеспечивающее отличную защиту и продлевающее срок службы двигателей легковых авто различных типов.', img: 'https://s.stdns.ru/up/photo/184134.png' },
  { id: 'prod-shell-40', category: 'oils', name: 'Shell Helix Ultra 5W-40', brand: 'Shell', price: 5200, specs: { 'Вязкость': '5W-40', 'Объем': '4 л', 'Тип': 'Синтетика', 'Допуски': 'API SP, ACEA A3/B4' }, desc: 'Полностью синтетическое моторное масло, созданное на основе уникальной технологии Shell PurePlus из природного газа.', img: 'https://s.stdns.ru/up/photo/124231.png', tag: 'Премиум' },
  { id: 'prod-filter-mann', category: 'filters', name: 'Масляный фильтр MANN W 712/94', brand: 'MANN', price: 650, specs: { 'Тип': 'Масляный', 'Резьба': '3/4-16 UNF', 'Диаметр': '76 мм' }, desc: 'Высококачественный немецкий масляный фильтр для двигателей группы VAG (VW, Skoda, Audi).' },
  { id: 'prod-filter-filtron', category: 'filters', name: 'Воздушный фильтр Filtron AP 139/2', brand: 'Filtron', price: 750, specs: { 'Тип': 'Воздушный', 'Длина': '213 мм', 'Ширина': '219 мм' }, desc: 'Надежный воздушный фильтр польского производства для широкого ряда японских и корейских авто.' },
  { id: 'prod-filter-cabin-mann', category: 'filters', name: 'Салонный фильтр MANN CU 26010', brand: 'MANN', price: 850, specs: { 'Тип': 'Салонный', 'Материал': 'Угольный' }, desc: 'Пылевой и запахопоглощающий салонный фильтр премиум класса. Задерживает до 99% аллергенов.' },
  { id: 'prod-fluid-winter', category: 'fluids', name: 'Стеклоомывающая жидкость Magma Winter -25°', brand: 'Magma', price: 350, specs: { 'Тип': 'Зимняя', 'Объем': '5 л', 'Температура': '-25°C' }, desc: 'Незамерзающая жидкость без резкого запаха. Отлично очищает лобовое стекло от наледи и реагентов.' },
  { id: 'prod-fluid-brake', category: 'fluids', name: 'Тормозная жидкость Lukoil DOT-4', brand: 'Lukoil', price: 400, specs: { 'Тип': 'DOT-4', 'Объем': '910 г' }, desc: 'Высокоэффективная тормозная жидкость, предназначенная для гидроприводов тормозов и сцеплений современных легковых автомобилей.' }
];

const INITIAL_REVIEWS = [
  { author: 'Магомед М.', rating: 5, text: 'Отличный сервис! Масло поменяли за 12 минут, фильтр по акции дали бесплатно. Персонал вежливый, советую.', date: 'Вчера' },
  { author: 'Шамиль К.', rating: 5, text: 'Постоянно тут меняю масло на своей Приоре. Цены адекватные, масла всегда оригинальные. Ребята знают свое дело.', date: '3 дня назад' },
  { author: 'Арсен Г.', rating: 5, text: 'Чистый бокс, современное оборудование. Записался через бота, приехал и сразу заехал без очереди. Очень удобно для тех, кто ценит время.', date: '1 неделя назад' }
];

let reviews = [...INITIAL_REVIEWS];

// Map coordinates for Sheboldaeva 43, Makhachkala
const SHOP_LAT = 42.986348;
const SHOP_LNG = 47.498179;
let leafletMap = null;

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMap();
  initServicesList();
  initCatalog();
  initBookingWizard();
  initLoyaltyView();
  initModals();
  initConfirmDialog();

  // Pre-fill user details if running inside Telegram WebApp
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
  if (tgUser) {
    const contactName = document.getElementById('contact-name');
    const reviewName = document.getElementById('review-input-name');
    const name = `${tgUser.first_name || ''} ${tgUser.last_name || ''}`.trim();
    if (name) {
      if (contactName) contactName.value = name;
      if (reviewName) reviewName.value = name;
      state.booking.name = name;
    }
  }
});

// ==========================================
// SPA NAVIGATION
// ==========================================
function initNavigation() {
  const navItems = document.querySelectorAll('.bottom-nav .nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-target');
      switchTab(targetTab);
    });
  });

  const btnGoToBooking = document.getElementById('btn-go-to-booking');
  if (btnGoToBooking) {
    btnGoToBooking.addEventListener('click', () => {
      switchTab('booking');
    });
  }

  const infoAddress = document.getElementById('info-address');
  if (infoAddress) {
    infoAddress.addEventListener('click', openMapRoute);
  }

  const infoPhone = document.getElementById('info-phone');
  if (infoPhone) {
    infoPhone.addEventListener('click', () => {
      window.open('tel:+79285750606', '_self');
    });
  }

  const infoWebsite = document.getElementById('info-website');
  if (infoWebsite) {
    infoWebsite.addEventListener('click', () => {
      window.open('https://magma-lukojl.clients.site', '_blank');
    });
  }
}

function switchTab(tabId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
    item.classList.remove('active');
  });

  const targetPage = document.getElementById(`view-${tabId}`);
  if (targetPage) {
    targetPage.classList.add('active');
  }

  const targetNavBtn = document.querySelector(`.bottom-nav .nav-item[data-target="${tabId}"]`);
  if (targetNavBtn) {
    targetNavBtn.classList.add('active');
  }

  state.activeTab = tabId;

  if (tabId === 'home' && leafletMap) {
    setTimeout(() => {
      leafletMap.invalidateSize();
    }, 100);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// INTERACTIVE MAP SYSTEM
// ==========================================
function initMap() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  try {
    leafletMap = L.map('map', {
      center: [SHOP_LAT, SHOP_LNG],
      zoom: 16,
      zoomControl: false,
      attributionControl: false
    });

    // Dark Mode Tile Layer fitting dark aesthetic
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20
    }).addTo(leafletMap);

    const customIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `<div style="background: var(--accent-color); border: 2px solid white; width: 14px; height: 14px; border-radius: 50%; box-shadow: var(--shadow-glow);"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    L.marker([SHOP_LAT, SHOP_LNG], { icon: customIcon }).addTo(leafletMap);

    const btnOpenRoute = document.getElementById('btn-open-route');
    if (btnOpenRoute) {
      btnOpenRoute.addEventListener('click', openMapRoute);
    }
  } catch (error) {
    console.error('Error loading leaflet map:', error);
  }
}

function openMapRoute() {
  const yandexUrl = `https://yandex.ru/maps/?rtext=~42.986348,47.498179`;
  window.open(yandexUrl, '_blank');
}

// ==========================================
// CATALOG ENGINE
// ==========================================
function initCatalog() {
  const container = document.getElementById('product-grid-container');
  const searchInput = document.getElementById('catalog-search');
  const categoriesContainer = document.getElementById('catalog-categories');

  if (!container) return;

  renderProducts();

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.catalog.searchQuery = e.target.value.toLowerCase().trim();
      renderProducts();
    });
  }

  if (categoriesContainer) {
    categoriesContainer.addEventListener('click', (e) => {
      const button = e.target.closest('.category-pill');
      if (!button) return;

      categoriesContainer.querySelectorAll('.category-pill').forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');

      state.catalog.activeCategory = button.getAttribute('data-category');
      renderProducts();
    });
  }
}

function renderProducts() {
  const container = document.getElementById('product-grid-container');
  if (!container) return;

  const query = state.catalog.searchQuery;
  const category = state.catalog.activeCategory;

  const filtered = PRODUCTS.filter(prod => {
    const matchesCategory = category === 'all' || prod.category === category;
    const matchesSearch = prod.name.toLowerCase().includes(query) || 
                          (prod.brand && prod.brand.toLowerCase().includes(query)) ||
                          (prod.desc && prod.desc.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: span 2; text-align: center; padding: 40px 0; color: var(--subtitle-color);">
        <i class="fa-solid fa-face-frown" style="font-size:28px; margin-bottom:10px; color:var(--subtitle-color);"></i>
        <p>Ничего не найдено</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(prod => {
    const image = prod.img || 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=150';
    const tagHtml = prod.tag ? `<span class="product-tag">${prod.tag}</span>` : '';
    const specsDisplay = Object.entries(prod.specs || {}).map(([k, v]) => `${v}`).join(' • ');

    return `
      <div class="product-card glass-panel" data-id="${prod.id}">
        <div class="product-img-holder">
          ${tagHtml}
          <img src="${image}" alt="${prod.name}" onerror="this.src='https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=150';">
        </div>
        <h4 class="product-title">${prod.name}</h4>
        <p class="product-specs">${specsDisplay}</p>
        <div class="product-footer">
          <span class="product-price">${prod.price} ₽</span>
          <button class="add-to-cart-btn" data-id="${prod.id}" title="Добавить к заказу">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.add-to-cart-btn')) {
        e.stopPropagation();
        const prodId = e.target.closest('.add-to-cart-btn').getAttribute('data-id');
        addItemToBooking(prodId);
        return;
      }
      const prodId = card.getAttribute('data-id');
      showProductDetails(prodId);
    });
  });
}

function addItemToBooking(prodId) {
  const product = PRODUCTS.find(p => p.id === prodId);
  if (!product) return;

  const exists = state.booking.catalogAddedItems.some(i => i.id === product.id);
  if (!exists) {
    state.booking.catalogAddedItems.push(product);
    
    const btn = document.querySelector(`.add-to-cart-btn[data-id="${prodId}"]`);
    if (btn) {
      btn.innerHTML = `<i class="fa-solid fa-check"></i>`;
      btn.style.backgroundColor = 'var(--success-color)';
      setTimeout(() => {
        btn.innerHTML = `<i class="fa-solid fa-plus"></i>`;
        btn.style.backgroundColor = 'var(--accent-color)';
      }, 1500);
    }

    showToast('Товар добавлен в заказ!', true);
    updateBookingSummary();
  }
}

// ==========================================
// BOOKING WIZARD SYSTEM
// ==========================================
function initServicesList() {
  const container = document.getElementById('services-list-container');
  if (!container) return;

  container.innerHTML = SERVICES.map(srv => {
    return `
      <div class="selectable-card" data-id="${srv.id}">
        <div class="selectable-card-left">
          <div class="selectable-card-icon">
            <i class="fa-solid ${srv.icon}"></i>
          </div>
          <div>
            <div class="selectable-card-title">${srv.name}</div>
            <div class="selectable-card-desc">${srv.desc}</div>
          </div>
        </div>
        <div class="selectable-card-right">
          <span class="selectable-card-price">${srv.price} ₽</span>
          <div class="check-indicator"><i class="fa-solid fa-check"></i></div>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.selectable-card').forEach(card => {
    card.addEventListener('click', () => {
      const srvId = card.getAttribute('data-id');
      const service = SERVICES.find(s => s.id === srvId);
      
      const index = state.booking.services.findIndex(s => s.id === srvId);
      if (index > -1) {
        state.booking.services.splice(index, 1);
        card.classList.remove('selected');
      } else {
        state.booking.services.push(service);
        card.classList.add('selected');
      }
      
      updateBookingSummary();
    });
  });
}

function initBookingWizard() {
  initCalendar();

  const btnNext = document.getElementById('btn-wizard-next');
  const btnBack = document.getElementById('btn-wizard-back');
  
  if (btnNext) btnNext.addEventListener('click', handleWizardNext);
  if (btnBack) btnBack.addEventListener('click', handleWizardBack);

  const btnSuccessClose = document.getElementById('btn-success-close');
  if (btnSuccessClose) {
    btnSuccessClose.addEventListener('click', () => {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.close(); // Close WebApp window if in Telegram
      } else {
        resetBookingState();
        switchTab('home');
      }
    });
  }

  const btnSuccessRoute = document.getElementById('btn-success-route');
  if (btnSuccessRoute) {
    btnSuccessRoute.addEventListener('click', openMapRoute);
  }

  const carInput = document.getElementById('car-brand');
  const volumeSelect = document.getElementById('oil-volume');
  const commentText = document.getElementById('booking-comment');
  const contactNameInput = document.getElementById('contact-name');
  const contactPhoneInput = document.getElementById('contact-phone');

  if (carInput) carInput.addEventListener('input', (e) => { state.booking.carBrand = e.target.value; updateBookingSummary(); });
  if (volumeSelect) volumeSelect.addEventListener('change', (e) => { state.booking.oilVolume = e.target.value; updateBookingSummary(); });
  if (commentText) commentText.addEventListener('input', (e) => { state.booking.comment = e.target.value; });
  if (contactNameInput) contactNameInput.addEventListener('input', (e) => { state.booking.name = e.target.value; });
  
  if (contactPhoneInput) {
    contactPhoneInput.addEventListener('input', (e) => {
      let value = e.target.value;
      if (!value.startsWith('+7 (')) {
        value = '+7 (';
      }
      state.booking.phone = value;
      e.target.value = value;
    });
  }
}

function initCalendar() {
  const dateContainer = document.getElementById('date-slider');
  if (!dateContainer) return;

  const daysOfWeek = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
  const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
  
  let html = '';
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + i);

    const dayName = i === 0 ? 'Сегодня' : daysOfWeek[futureDate.getDay()];
    const dayNum = futureDate.getDate();
    const monthName = months[futureDate.getMonth()];
    const dateString = futureDate.toISOString().split('T')[0];
    const displayDate = `${dayNum} ${monthName}`;

    html += `
      <div class="date-pill" data-date="${dateString}" data-display="${displayDate}">
        <span class="date-pill-day">${dayName}</span>
        <span class="date-pill-num">${dayNum}</span>
      </div>
    `;
  }
  
  dateContainer.innerHTML = html;

  dateContainer.querySelectorAll('.date-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      dateContainer.querySelectorAll('.date-pill').forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');

      state.booking.date = {
        dateString: pill.getAttribute('data-date'),
        displayDate: pill.getAttribute('data-display')
      };

      generateTimeSlots();
      updateBookingSummary();
    });
  });
}

function generateTimeSlots() {
  const timeContainer = document.getElementById('time-slots-container');
  if (!timeContainer) return;

  const slots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ];

  const dateStr = state.booking.date ? state.booking.date.dateString : 'seed';
  let seedVal = 0;
  for (let c = 0; c < dateStr.length; c++) seedVal += dateStr.charCodeAt(c);

  let html = '';
  slots.forEach((time, index) => {
    const isDisabled = ((seedVal + index * 17) % 7 === 0 || (seedVal + index * 11) % 8 === 0);
    const disabledAttr = isDisabled ? 'disabled' : '';
    const classAttr = isDisabled ? 'time-pill disabled' : 'time-pill';

    html += `<div class="${classAttr}" ${disabledAttr} data-time="${time}">${time}</div>`;
  });

  timeContainer.innerHTML = html;

  timeContainer.querySelectorAll('.time-pill:not(.disabled)').forEach(pill => {
    pill.addEventListener('click', () => {
      timeContainer.querySelectorAll('.time-pill').forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      state.booking.time = pill.getAttribute('data-time');
      updateBookingSummary();
    });
  });
}

function handleWizardNext() {
  const step = state.booking.step;

  if (step === 1) {
    if (state.booking.services.length === 0 && state.booking.catalogAddedItems.length === 0) {
      showToast('Выберите хотя бы одну услугу или масло из каталога.');
      return;
    }
    goToWizardStep(2);
  } else if (step === 2) {
    const carField = document.getElementById('car-brand');
    if (!carField || !carField.value.trim()) {
      showToast('Укажите марку и модель автомобиля.');
      return;
    }
    goToWizardStep(3);
  } else if (step === 3) {
    if (!state.booking.date) {
      showToast('Выберите дату визита.');
      return;
    }
    if (!state.booking.time) {
      showToast('Выберите время записи.');
      return;
    }
    goToWizardStep(4);
  } else if (step === 4) {
    const nameField = document.getElementById('contact-name');
    const phoneField = document.getElementById('contact-phone');

    if (!nameField || !nameField.value.trim()) {
      showToast('Укажите ваше имя.');
      return;
    }
    if (!phoneField || phoneField.value.length < 18) { // Mask format +7 (999) 999-99-99 is 18 chars
      showToast('Введите корректный номер телефона.');
      return;
    }

    state.booking.name = nameField.value.trim();
    state.booking.phone = phoneField.value.trim();

    submitBookingData();
  }
}

function handleWizardBack() {
  const step = state.booking.step;
  if (step > 1) {
    goToWizardStep(step - 1);
  }
}

function goToWizardStep(stepNum) {
  document.querySelectorAll('.wizard-step').forEach(st => st.classList.remove('active'));
  
  let stepId = 'step-services';
  let title = 'Выбор услуг';
  if (stepNum === 2) { { stepId = 'step-car'; title = 'О машине'; } }
  else if (stepNum === 3) { { stepId = 'step-datetime'; title = 'Дата и время'; } }
  else if (stepNum === 4) { { stepId = 'step-contacts'; title = 'Подтверждение'; } }

  const stepEl = document.getElementById(stepId);
  if (stepEl) stepEl.classList.add('active');

  document.getElementById('wizard-title').innerText = title;
  document.getElementById('wizard-step-counter').innerText = `Шаг ${stepNum} из 4`;

  const progressMap = { 1: 25, 2: 50, 3: 75, 4: 100 };
  document.getElementById('wizard-progress-bar').style.width = `${progressMap[stepNum]}%`;

  state.booking.step = stepNum;

  // Standalone back button visibility
  const backBtn = document.getElementById('btn-wizard-back');
  if (backBtn) {
    backBtn.style.display = stepNum > 1 ? 'flex' : 'none';
  }

  const nextBtn = document.getElementById('btn-wizard-next');
  if (nextBtn) {
    if (stepNum === 4) {
      nextBtn.innerHTML = `<i class="fa-solid fa-square-check"></i> Подтвердить запись`;
    } else {
      nextBtn.innerHTML = `Далее <i class="fa-solid fa-chevron-right"></i>`;
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateBookingSummary() {
  let total = 0;
  state.booking.services.forEach(s => total += s.price);
  state.booking.catalogAddedItems.forEach(i => total += i.price);

  const isBuyingOil = state.booking.catalogAddedItems.some(i => i.category === 'oils');
  const hasExpressService = state.booking.services.some(s => s.id === 'srv-oil-change');
  
  let discountNote = '';
  if (isBuyingOil && hasExpressService) {
    total -= 600; 
    discountNote = ' (Замена масла БЕСПЛАТНО по акции)';
  }

  const serviceListText = [
    ...state.booking.services.map(s => s.name),
    ...state.booking.catalogAddedItems.map(i => i.name)
  ].join(', ');

  const summaryServices = document.getElementById('summary-services');
  if (summaryServices) {
    summaryServices.innerText = serviceListText || 'Не выбрано';
  }

  const summaryCar = document.getElementById('summary-car');
  if (summaryCar) {
    summaryCar.innerText = state.booking.carBrand ? `${state.booking.carBrand} (${state.booking.oilVolume === 'not-sure' ? 'объем не указан' : state.booking.oilVolume + ' л'})` : 'Не указан';
  }

  const summaryDateTime = document.getElementById('summary-datetime');
  if (summaryDateTime) {
    summaryDateTime.innerText = (state.booking.date && state.booking.time) ? `${state.booking.date.displayDate} в ${state.booking.time}` : 'Не выбрано';
  }

  const summaryPrice = document.getElementById('summary-price');
  if (summaryPrice) {
    summaryPrice.innerHTML = `${total} ₽${discountNote ? `<span style="font-size:10px; display:block; color:var(--success-color); font-weight:normal;">${discountNote}</span>` : ''}`;
  }
}

function submitBookingData() {
  showConfirmDialog('Вы действительно хотите подтвердить запись на замену масла?', (confirmed) => {
    if (confirmed) {
      processBookingSuccess();
    }
  });
}

function processBookingSuccess() {
  const bookingIdNum = Math.floor(10000 + Math.random() * 90000);
  const bookingId = `MAG-${bookingIdNum}`;

  document.getElementById('wizard-controls').style.display = 'none';
  document.getElementById('wizard-progress-bar').closest('.progress-track').style.display = 'none';
  document.getElementById('wizard-step-counter').style.display = 'none';
  document.getElementById('wizard-title').innerText = 'Запись оформлена';

  let total = 0;
  state.booking.services.forEach(s => total += s.price);
  state.booking.catalogAddedItems.forEach(i => total += i.price);
  const isBuyingOil = state.booking.catalogAddedItems.some(i => i.category === 'oils');
  const hasExpressService = state.booking.services.some(s => s.id === 'srv-oil-change');
  if (isBuyingOil && hasExpressService) total -= 600;

  document.getElementById('success-id').innerText = `№ ${bookingId}`;
  document.getElementById('success-datetime').innerText = `${state.booking.date.displayDate} в ${state.booking.time}`;
  
  const servicesFormatted = [
    ...state.booking.services.map(s => s.name),
    ...state.booking.catalogAddedItems.map(i => i.name)
  ].join(', ');
  document.getElementById('success-services').innerText = servicesFormatted;
  document.getElementById('success-price').innerText = `${total} ₽`;

  document.querySelectorAll('.wizard-step').forEach(st => st.classList.remove('active'));
  document.getElementById('booking-success-screen').style.display = 'flex';

  // Trigger direct Telegram notification to the client's chat from frontend
  sendTelegramNotification({
    id: bookingId,
    name: state.booking.name,
    phone: state.booking.phone,
    carBrand: state.booking.carBrand,
    oilVolume: state.booking.oilVolume,
    date: state.booking.date.displayDate,
    time: state.booking.time,
    services: servicesFormatted,
    comment: state.booking.comment,
    total: total
  });
}

function resetBookingState() {
  state.booking = {
    step: 1,
    services: [],
    carBrand: '',
    oilVolume: 'not-sure',
    comment: '',
    date: null,
    time: null,
    name: state.booking.name, 
    phone: state.booking.phone,
    catalogAddedItems: []
  };

  document.querySelectorAll('.selectable-card').forEach(card => card.classList.remove('selected'));
  const carField = document.getElementById('car-brand'); if (carField) carField.value = '';
  const commentField = document.getElementById('booking-comment'); if (commentField) commentField.value = '';
  const volumeSelect = document.getElementById('oil-volume'); if (volumeSelect) volumeSelect.value = 'not-sure';
  
  initCalendar();

  document.getElementById('wizard-controls').style.display = 'flex';
  document.getElementById('wizard-progress-bar').closest('.progress-track').style.display = 'block';
  document.getElementById('wizard-step-counter').style.display = 'block';
  document.getElementById('booking-success-screen').style.display = 'none';

  goToWizardStep(1);
  updateBookingSummary();
}

// ==========================================
// LOYALTY CARD & REVIEWS
// ==========================================
function initLoyaltyView() {
  renderReviews();

  const btnShowQr = document.getElementById('btn-show-qr');
  if (btnShowQr) {
    btnShowQr.addEventListener('click', () => {
      openModal('modal-qr');
    });
  }

  const btnWriteReview = document.getElementById('btn-write-review');
  if (btnWriteReview) {
    btnWriteReview.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('modal-review');
    });
  }
}

function renderReviews() {
  const container = document.getElementById('reviews-list-container');
  if (!container) return;

  container.innerHTML = reviews.map(rev => {
    let starsHtml = '';
    for (let s = 1; s <= 5; s++) {
      if (s <= rev.rating) starsHtml += `<i class="fa-solid fa-star"></i>`;
      else starsHtml += `<i class="fa-regular fa-star"></i>`;
    }

    return `
      <div class="review-card glass-panel">
        <div class="review-header">
          <span class="review-author">${rev.author}</span>
          <div class="review-stars">${starsHtml}</div>
        </div>
        <p class="review-text">"${rev.text}"</p>
        <div class="review-date">${rev.date}</div>
      </div>
    `;
  }).join('');
}

// ==========================================
// MODALS SYSTEM
// ==========================================
let activeModalId = null;

function initModals() {
  document.getElementById('btn-close-qr').addEventListener('click', () => closeModal('modal-qr'));
  document.getElementById('btn-close-review').addEventListener('click', () => closeModal('modal-review'));
  document.getElementById('btn-close-product').addEventListener('click', () => closeModal('modal-product'));

  const starsSelector = document.getElementById('review-stars-selector');
  if (starsSelector) {
    starsSelector.querySelectorAll('i').forEach(star => {
      star.addEventListener('click', () => {
        const rating = parseInt(star.getAttribute('data-rating'));
        starsSelector.querySelectorAll('i').forEach(s => {
          const r = parseInt(s.getAttribute('data-rating'));
          if (r <= rating) s.classList.add('active');
          else s.classList.remove('active');
        });
        starsSelector.setAttribute('data-selected-rating', rating);
      });
    });
  }

  const btnSubmitReview = document.getElementById('btn-submit-review');
  if (btnSubmitReview) {
    btnSubmitReview.addEventListener('click', () => {
      const name = document.getElementById('review-input-name').value.trim();
      const text = document.getElementById('review-input-text').value.trim();
      const rating = parseInt(starsSelector.getAttribute('data-selected-rating') || '5');

      if (!name) { showToast('Введите ваше имя.'); return; }
      if (!text) { showToast('Пожалуйста, напишите отзыв.'); return; }

      reviews.unshift({
        author: name,
        rating: rating,
        text: text,
        date: 'Только что'
      });

      renderReviews();
      closeModal('modal-review');

      document.getElementById('review-input-text').value = '';
      showToast('Спасибо за отзыв!', true);
    });
  }

  const btnProductOrder = document.getElementById('btn-product-order');
  if (btnProductOrder) {
    btnProductOrder.addEventListener('click', () => {
      const prodId = btnProductOrder.getAttribute('data-product-id');
      addItemToBooking(prodId);
      closeModal('modal-product');
      switchTab('booking');
    });
  }

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay.id);
      }
    });
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.add('active');
  activeModalId = modalId;
  document.body.style.overflow = 'hidden'; 
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.remove('active');
  activeModalId = null;
  document.body.style.overflow = ''; 
}

function showProductDetails(prodId) {
  const product = PRODUCTS.find(p => p.id === prodId);
  if (!product) return;

  document.getElementById('product-detail-title').innerText = product.name;
  
  const imgElement = document.getElementById('product-detail-img-element');
  imgElement.src = product.img || 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=150';
  imgElement.onerror = () => { imgElement.src = 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=150'; };

  document.getElementById('product-detail-price-element').innerText = `${product.price} ₽`;
  document.getElementById('product-detail-desc').innerText = product.desc || 'Оригинальный смазочный материал премиум качества. Подходит для использования в бензиновых и дизельных двигателях легковых автомобилей.';

  const table = document.getElementById('product-detail-specs-container');
  if (table) {
    table.innerHTML = Object.entries(product.specs || {}).map(([key, val]) => {
      return `
        <tr>
          <td>${key}</td>
          <td>${val}</td>
        </tr>
      `;
    }).join('');
  }

  const orderBtn = document.getElementById('btn-product-order');
  if (orderBtn) {
    orderBtn.setAttribute('data-product-id', product.id);
  }

  openModal('modal-product');
}

// ==========================================
// CUSTOM WEB TOAST & CONFIRM DIALOG DIALS
// ==========================================
let confirmCallback = null;

function showToast(message, isSuccess = false) {
  const toast = document.getElementById('web-toast');
  const toastText = document.getElementById('web-toast-text');
  const toastIcon = document.getElementById('web-toast-icon');
  
  if (!toast || !toastText || !toastIcon) return;
  
  toastText.innerText = message;
  
  if (isSuccess) {
    toast.style.borderColor = 'var(--success-color)';
    toastIcon.className = 'fa-solid fa-circle-check';
    toastIcon.style.color = 'var(--success-color)';
  } else {
    toast.style.borderColor = 'var(--accent-color)';
    toastIcon.className = 'fa-solid fa-triangle-exclamation';
    toastIcon.style.color = 'var(--accent-color)';
  }
  
  toast.classList.add('active');
  setTimeout(() => {
    toast.classList.remove('active');
  }, 3000);
}

function showConfirmDialog(message, callback) {
  const dialog = document.getElementById('web-confirm-dialog');
  const text = document.getElementById('web-confirm-text');
  
  if (!dialog || !text) return;
  
  text.innerText = message;
  confirmCallback = callback;
  
  dialog.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function initConfirmDialog() {
  const btnYes = document.getElementById('btn-confirm-yes');
  const btnNo = document.getElementById('btn-confirm-no');
  const dialog = document.getElementById('web-confirm-dialog');
  
  if (!dialog) return;

  if (btnYes) {
    btnYes.addEventListener('click', () => {
      dialog.classList.remove('active');
      document.body.style.overflow = '';
      if (confirmCallback) {
        confirmCallback(true);
        confirmCallback = null;
      }
    });
  }
  
  if (btnNo) {
    btnNo.addEventListener('click', () => {
      dialog.classList.remove('active');
      document.body.style.overflow = '';
      if (confirmCallback) {
        confirmCallback(false);
        confirmCallback = null;
      }
    });
  }
  
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      dialog.classList.remove('active');
      document.body.style.overflow = '';
      confirmCallback = null;
    }
  });
}

// ==========================================
// TELEGRAM BOT API NOTIFICATION SENDER
// ==========================================
async function sendTelegramNotification(booking) {
  const token = '8867823783:AAH9zZ2Hi1cWcFGq54Fn1A807p88iTsRJ2Q';
  
  // Read client's chat ID from Telegram WebApp properties if available
  let chatId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
  
  if (!chatId) {
    console.log('Not in Telegram or user ID not available. Cannot send confirmation message.');
    return;
  }

  const messageText = `🔔 *Запись на замену масла подтверждена!*\n\n` +
    `🆔 *Номер заказа:* \`${booking.id}\`\n` +
    `👤 *Имя:* ${booking.name}\n` +
    `📞 *Телефон:* ${booking.phone}\n` +
    `🚗 *Автомобиль:* ${booking.carBrand}\n` +
    `🛢 *Объем масла:* ${booking.oilVolume === 'not-sure' ? 'Нужна консультация' : booking.oilVolume + ' л'}\n` +
    `📅 *Время визита:* ${booking.date} в ${booking.time}\n` +
    `🛠 *Услуги:* ${booking.services}\n` +
    `💬 *Комментарий:* ${booking.comment || 'Нет'}\n` +
    `💳 *Сумма к оплате:* ${booking.total} ₽\n\n` +
    `📍 Ждем вас по адресу: *г. Махачкала, ул. Шеболдаева, 43.*\n` +
    `📞 Телефон: +7 (928) 575-06-06`;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'Markdown'
      })
    });
    console.log('Telegram notification sent successfully to chat ID:', chatId);
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
  }
}

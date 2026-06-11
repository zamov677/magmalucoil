/* ==========================================================================
   MAGMA LUKOIL TG MINI APP - APPLICATION CONTROLLER
   ========================================================================== */

// Global Application State
const state = {
  activeTab: 'home',
  booking: {
    step: 1,
    services: [], // Array of { id, name, price, icon }
    carBrand: '',
    oilVolume: 'not-sure',
    comment: '',
    date: null,   // { dateString, displayDate }
    time: null,
    name: '',
    phone: '',
    catalogAddedItems: [] // Products added from catalog drawer
  },
  catalog: {
    activeCategory: 'all',
    searchQuery: ''
  }
};

// MOCK DATA: Services
const SERVICES = [
  { id: 'srv-oil-change', name: 'Экспресс-замена моторного масла', price: 600, desc: 'Замена методом вакуумного отбора или сливом. Бесплатно при покупке масла.', icon: 'fa-droplet' },
  { id: 'srv-filter-oil', name: 'Замена масляного фильтра', price: 200, desc: 'Замена фильтрующего элемента с проверкой герметичности прокладки.', icon: 'fa-oil-can' },
  { id: 'srv-filter-air', name: 'Замена воздушного фильтра', price: 250, desc: 'Защищает двигатель от пыли и абразивного износа.', icon: 'fa-wind' },
  { id: 'srv-filter-cabin', name: 'Замена салонного фильтра', price: 300, desc: 'Очищает воздух в салоне, устраняет неприятные запахи и запотевание.', icon: 'fa-fan' },
  { id: 'srv-checkup', name: 'Комплексный осмотр подкапотного пространства', price: 400, desc: 'Проверка уровней всех жидкостей, осмотр приводных ремней и патрубков.', icon: 'fa-magnifying-glass-chart' }
];

// MOCK DATA: Catalog Products
const PRODUCTS = [
  { id: 'prod-genesis-40', category: 'oils', name: 'Lukoil Genesis Armortech 5W-40', brand: 'Lukoil', price: 3400, specs: { 'Вязкость': '5W-40', 'Объем': '4 л', 'Тип': 'Синтетика', 'Допуски': 'API SN/CF, MB 229.5' }, desc: 'Всесезонное полностью синтетическое моторное масло последнего поколения для бензиновых и дизельных двигателей.', img: 'https://lukoil-masla.ru/images/genesis_5w40.png', tag: 'Популярно' },
  { id: 'prod-genesis-30', category: 'oils', name: 'Lukoil Genesis Armortech 5W-30', brand: 'Lukoil', price: 3600, specs: { 'Вязкость': '5W-30', 'Объем': '4 л', 'Тип': 'Синтетика', 'Допуски': 'API SL/CF, Ford WSS' }, desc: 'Синтетическое масло высокой экономии топлива для легковых автомобилей, в том числе оборудованных турбонаддувом.', img: 'https://lukoil-masla.ru/images/genesis_5w30.png', tag: 'Эко' },
  { id: 'prod-super-40', category: 'oils', name: 'Lukoil Super 10W-40', brand: 'Lukoil', price: 1800, specs: { 'Вязкость': '10W-40', 'Объем': '4 л', 'Тип': 'Полусинтетика', 'Допуски': 'API SG/CD' }, desc: 'Высококачественное полусинтетическое масло для бензиновых и дизельных двигателей легковых машин.', img: 'https://lukoil-masla.ru/images/super_10w40.png' },
  { id: 'prod-mobil-40', category: 'oils', name: 'Mobil Super 3000 x1 5W-40', brand: 'Mobil', price: 4800, specs: { 'Вязкость': '5W-40', 'Объем': '4 л', 'Тип': 'Синтетика', 'Допуски': 'API SN/SM, MB 229.3' }, desc: 'Синтетическое масло, обеспечивающее отличную защиту и продлевающее срок службы двигателя.', img: 'https://s.stdns.ru/up/photo/184134.png' },
  { id: 'prod-shell-40', category: 'oils', name: 'Shell Helix Ultra 5W-40', brand: 'Shell', price: 5200, specs: { 'Вязкость': '5W-40', 'Объем': '4 л', 'Тип': 'Синтетика', 'Допуски': 'API SP, ACEA A3/B4' }, desc: 'Полностью синтетическое моторное масло, созданное на основе технологии PurePlus из природного газа.', img: 'https://s.stdns.ru/up/photo/124231.png', tag: 'Премиум' },
  { id: 'prod-filter-mann', category: 'filters', name: 'Масляный фильтр MANN W 712/94', brand: 'MANN', price: 650, specs: { 'Тип': 'Масляный', 'Резьба': '3/4-16 UNF', 'Диаметр': '76 мм' }, desc: 'Высококачественный немецкий масляный фильтр для современных двигателей.' },
  { id: 'prod-filter-filtron', category: 'filters', name: 'Воздушный фильтр Filtron AP 139/2', brand: 'Filtron', price: 750, specs: { 'Тип': 'Воздушный', 'Длина': '213 мм', 'Ширина': '219 мм' }, desc: 'Надежный воздушный фильтр польского производства для японских и корейских авто.' },
  { id: 'prod-filter-cabin-mann', category: 'filters', name: 'Салонный фильтр MANN CU 26010', brand: 'MANN', price: 850, specs: { 'Тип': 'Салонный', 'Материал': 'Угольный' }, desc: 'Пылевой и запахопоглощающий салонный фильтр премиум класса. Задерживает до 99% аллергенов.' },
  { id: 'prod-fluid-winter', category: 'fluids', name: 'Стеклоомывающая жидкость Magma Winter -25°', brand: 'Magma', price: 350, specs: { 'Тип': 'Зимняя', 'Объем': '5 л', 'Температура': '-25°C' }, desc: 'Незамерзающая жидкость без резкого запаха. Отлично очищает лобовое стекло от наледи.' },
  { id: 'prod-fluid-brake', category: 'fluids', name: 'Тормозная жидкость Lukoil DOT-4', brand: 'Lukoil', price: 400, specs: { 'Тип': 'DOT-4', 'Объем': '910 г' }, desc: 'Высокоэффективная тормозная жидкость для гидроприводов тормозов легковых авто.' }
];

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initNavigation();
  initHomeEvents();
  initServicesTab();
  initPromotionsTab();
  initProfileTab();
  initCatalogDrawer();
  initBookingWizard();
  initModals();
  initConfirmDialog();

  // Load Telegram parameters if running inside Telegram WebApp
  initTelegramSDK();
});

// ------------------------------------------
// Interactive Device Clock
// ------------------------------------------
function initClock() {
  const clockElement = document.getElementById('status-clock');
  if (!clockElement) return;

  const updateTime = () => {
    const now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    clockElement.innerText = `${hours}:${minutes}`;
  };

  updateTime();
  setInterval(updateTime, 1000);
}

// ------------------------------------------
// Telegram WebApp Setup
// ------------------------------------------
function initTelegramSDK() {
  if (window.Telegram?.WebApp) {
    const webApp = window.Telegram.WebApp;
    webApp.ready();
    webApp.expand();

    // Customize Colors
    webApp.setHeaderColor('#000000');
    webApp.setBackgroundColor('#000000');

    // Parse User Information
    const user = webApp.initDataUnsafe?.user;
    if (user) {
      const fullname = [user.first_name, user.last_name].filter(Boolean).join(' ');
      const username = user.username ? `@${user.username}` : '';
      
      // Update DOM
      document.getElementById('user-fullname').innerText = fullname || 'Клиент Telegram';
      document.getElementById('user-username').innerText = username || '@client';
      
      if (user.photo_url) {
        document.getElementById('user-avatar').src = user.photo_url;
      }
      
      // Pre-fill forms
      document.getElementById('contact-name').value = fullname || '';
      document.getElementById('contact-phone').value = user.phone ? `+${user.phone}` : '+7 (';
      state.booking.name = fullname || '';
      state.booking.phone = user.phone ? `+${user.phone}` : '';
    }
  }
}

// ------------------------------------------
// Single Page App Routing
// ------------------------------------------
function initNavigation() {
  const navItems = document.querySelectorAll('.bottom-nav .nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-target');
      switchTab(targetTab);
    });
  });
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
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// SCREEN 1: HOME EVENTS (ГЛАВНАЯ)
// ==========================================
function initHomeEvents() {
  // Quick Actions Grid Listeners
  document.getElementById('btn-quick-oil').addEventListener('click', () => {
    openBookingWizard('srv-oil-change');
  });

  document.getElementById('btn-quick-catalog').addEventListener('click', () => {
    openCatalogDrawer('oils');
  });

  document.getElementById('btn-quick-goods').addEventListener('click', () => {
    openCatalogDrawer('filters');
  });

  document.getElementById('btn-quick-call').addEventListener('click', handleCallPhone);
  
  document.getElementById('btn-quick-route').addEventListener('click', openMapRoute);
  
  document.getElementById('btn-quick-book').addEventListener('click', () => {
    openBookingWizard();
  });

  // Details Panel Actions
  document.getElementById('btn-row-address').addEventListener('click', openMapRoute);
  document.getElementById('btn-row-phone').addEventListener('click', handleCallPhone);
  
  document.getElementById('btn-row-hours').addEventListener('click', () => {
    showToast('Режим работы: Ежедневно, 09:00 — 20:00.', true);
  });

  document.getElementById('btn-row-parking').addEventListener('click', () => {
    showToast('Перед боксами бесплатная парковка на 6 автомобилей.', true);
  });

  // Busy hours chart click interactivity
  const bars = document.querySelectorAll('.occupancy-chart .chart-bar');
  bars.forEach(bar => {
    bar.addEventListener('click', () => {
      bars.forEach(b => b.classList.remove('active'));
      bar.classList.add('active');
      const time = bar.getAttribute('data-time');
      const height = parseInt(bar.style.getPropertyValue('--bar-height'));
      
      let loadText = 'низкая';
      if (height > 40) loadText = 'средняя';
      if (height > 75) loadText = 'высокая загруженность';
      
      document.getElementById('occupancy-desc').innerText = `${time} — обычно ${loadText}`;
    });
  });
}

function handleCallPhone() {
  window.open('tel:+79285750606', '_self');
}

function openMapRoute() {
  const yandexUrl = `https://yandex.ru/maps/?rtext=~42.986348,47.498179`;
  window.open(yandexUrl, '_blank');
}

// ==========================================
// SCREEN 2: SERVICES (УСЛУГИ)
// ==========================================
function initServicesTab() {
  const container = document.getElementById('services-grid-container');
  if (!container) return;

  container.innerHTML = SERVICES.map(srv => {
    return `
      <div class="service-card glass-card">
        <div class="service-info-left">
          <div class="service-icon-box">
            <i class="fa-solid ${srv.icon}"></i>
          </div>
          <div>
            <h4 class="service-title-text">${srv.name}</h4>
            <p class="service-desc-text">${srv.desc}</p>
          </div>
        </div>
        <div class="service-info-right">
          <span class="service-price">${srv.price} ₽</span>
          <button class="btn btn-primary btn-sm btn-service-book" data-id="${srv.id}">Запись</button>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.btn-service-book').forEach(btn => {
    btn.addEventListener('click', () => {
      const srvId = btn.getAttribute('data-id');
      openBookingWizard(srvId);
    });
  });
}

// ==========================================
// SCREEN 3: PROMOTIONS (АКЦИИ)
// ==========================================
function initPromotionsTab() {
  const promoActions = document.querySelectorAll('.btn-promo-action');
  promoActions.forEach(btn => {
    btn.addEventListener('click', () => {
      const promoId = btn.getAttribute('data-promo');
      if (promoId === 'gift-filter') {
        openBookingWizard('srv-oil-change');
        // Add default filter from catalog as a gift
        const filter = PRODUCTS.find(p => p.id === 'prod-filter-mann');
        if (filter && !state.booking.catalogAddedItems.some(i => i.id === filter.id)) {
          // Add it as a free product locally
          const freeFilter = { ...filter, price: 0, name: `${filter.name} (Подарок!)` };
          state.booking.catalogAddedItems.push(freeFilter);
          updateBookingSummary();
        }
        showToast('Масло выбрано, фильтр MANN добавлен в подарок!', true);
      } else if (promoId === 'loyalty-drops') {
        switchTab('profile');
        const loyaltyCard = document.querySelector('.profile-loyalty-section');
        if (loyaltyCard) {
          loyaltyCard.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (promoId === 'discount-filters') {
        openBookingWizard('srv-filter-air');
        showToast('Запишитесь на замену, 10% учтем на месте.', true);
      } else if (promoId === 'free-checkup') {
        openBookingWizard('srv-checkup');
        showToast('Осмотр выбран!', true);
      }
    });
  });
}

// ==========================================
// SCREEN 4: PROFILE (ПРОФИЛЬ)
// ==========================================
function initProfileTab() {
  document.getElementById('btn-profile-qr').addEventListener('click', () => {
    openModal('modal-qr');
  });
}

// ==========================================
// INTERACTIVE CATALOG DRAWER
// ==========================================
function initCatalogDrawer() {
  const container = document.getElementById('product-grid-container');
  const searchInput = document.getElementById('catalog-search');
  const categoriesContainer = document.getElementById('catalog-categories');

  if (!container) return;

  renderCatalogProducts();

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.catalog.searchQuery = e.target.value.toLowerCase().trim();
      renderCatalogProducts();
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
      renderCatalogProducts();
    });
  }

  // Close Catalog drawer
  document.getElementById('btn-close-catalog').addEventListener('click', () => {
    closeDrawer('sheet-catalog');
  });
}

function openCatalogDrawer(initialCategory = 'all') {
  openDrawer('sheet-catalog');
  
  // Set active category pill
  const categoriesContainer = document.getElementById('catalog-categories');
  if (categoriesContainer) {
    categoriesContainer.querySelectorAll('.category-pill').forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-category') === initialCategory) {
        btn.classList.add('active');
      }
    });
  }
  
  state.catalog.activeCategory = initialCategory;
  state.catalog.searchQuery = '';
  const searchInput = document.getElementById('catalog-search');
  if (searchInput) searchInput.value = '';

  renderCatalogProducts();
}

function renderCatalogProducts() {
  const container = document.getElementById('product-grid-container');
  if (!container) return;

  const query = state.catalog.searchQuery;
  const category = state.catalog.activeCategory;

  const filtered = PRODUCTS.filter(prod => {
    const matchesCategory = category === 'all' || prod.category === category;
    const matchesSearch = prod.name.toLowerCase().includes(query) || 
                          prod.brand.toLowerCase().includes(query) ||
                          (prod.desc && prod.desc.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: span 2; text-align: center; padding: 40px 0; color: var(--text-muted);">
        <i class="fa-solid fa-triangle-exclamation" style="font-size:24px; margin-bottom:8px;"></i>
        <p style="font-size:11px;">Товары не найдены</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(prod => {
    const tagHtml = prod.tag ? `<span class="product-card-tag">${prod.tag}</span>` : '';
    const specsDisplay = Object.entries(prod.specs || {}).slice(0, 2).map(([k, v]) => `${v}`).join(' • ');

    return `
      <div class="product-card glass-card" data-id="${prod.id}">
        <div class="product-img-wrapper">
          ${tagHtml}
          <img src="${prod.img || 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=150'}" alt="${prod.name}" onerror="this.src='https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=150';">
        </div>
        <h4 class="product-card-title">${prod.name}</h4>
        <p class="product-card-specs">${specsDisplay || 'Premium Product'}</p>
        <div class="product-card-footer">
          <span class="product-card-price">${prod.price} ₽</span>
          <button class="product-add-btn" data-id="${prod.id}">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Add event listeners to cards and add-buttons
  container.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.product-add-btn')) {
        e.stopPropagation();
        const prodId = e.target.closest('.product-add-btn').getAttribute('data-id');
        addProductToBooking(prodId);
        return;
      }
      const prodId = card.getAttribute('data-id');
      showProductDetails(prodId);
    });
  });
}

function addProductToBooking(prodId) {
  const product = PRODUCTS.find(p => p.id === prodId);
  if (!product) return;

  const exists = state.booking.catalogAddedItems.some(i => i.id === product.id);
  if (!exists) {
    state.booking.catalogAddedItems.push(product);
    
    // Quick Add Button UI change
    const btn = document.querySelector(`.product-card[data-id="${prodId}"] .product-add-btn`);
    if (btn) {
      btn.innerHTML = `<i class="fa-solid fa-check"></i>`;
      btn.style.backgroundColor = 'var(--success)';
      setTimeout(() => {
        btn.innerHTML = `<i class="fa-solid fa-plus"></i>`;
        btn.style.backgroundColor = 'var(--accent-red)';
      }, 1500);
    }

    showToast('Товар добавлен в заказ!', true);
    updateBookingSummary();
  } else {
    showToast('Товар уже добавлен.');
  }
}

function showProductDetails(prodId) {
  const product = PRODUCTS.find(p => p.id === prodId);
  if (!product) return;

  document.getElementById('product-detail-title').innerText = product.name;
  
  const imgElement = document.getElementById('product-detail-img-element');
  imgElement.src = product.img || 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=150';
  
  const tagElement = document.getElementById('product-detail-tag-element');
  tagElement.innerText = product.brand;

  document.getElementById('product-detail-price-element').innerText = `${product.price} ₽`;
  document.getElementById('product-detail-desc').innerText = product.desc || 'Оригинальный расходный элемент премиального качества.';

  const specsContainer = document.getElementById('product-detail-specs-container');
  if (specsContainer) {
    specsContainer.innerHTML = Object.entries(product.specs || {}).map(([key, val]) => {
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
// INTERACTIVE BOOKING WIZARD
// ==========================================
function initBookingWizard() {
  initServicesChecklist();
  initCalendarSlider();

  // Button Controllers
  document.getElementById('btn-close-booking').addEventListener('click', () => {
    closeDrawer('sheet-booking');
  });

  const btnNext = document.getElementById('btn-wizard-next');
  const btnBack = document.getElementById('btn-wizard-back');
  
  if (btnNext) btnNext.addEventListener('click', handleWizardNext);
  if (btnBack) btnBack.addEventListener('click', handleWizardBack);

  const btnSuccessClose = document.getElementById('btn-success-close');
  if (btnSuccessClose) {
    btnSuccessClose.addEventListener('click', () => {
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.close();
      } else {
        resetBookingState();
        closeDrawer('sheet-booking');
        switchTab('home');
      }
    });
  }

  const btnSuccessRoute = document.getElementById('btn-success-route');
  if (btnSuccessRoute) {
    btnSuccessRoute.addEventListener('click', openMapRoute);
  }

  // Inputs Listening
  document.getElementById('car-brand').addEventListener('input', (e) => {
    state.booking.carBrand = e.target.value;
    updateBookingSummary();
  });
  
  document.getElementById('oil-volume').addEventListener('change', (e) => {
    state.booking.oilVolume = e.target.value;
    updateBookingSummary();
  });

  document.getElementById('booking-comment').addEventListener('input', (e) => {
    state.booking.comment = e.target.value;
  });

  document.getElementById('contact-name').addEventListener('input', (e) => {
    state.booking.name = e.target.value;
  });

  const phoneInput = document.getElementById('contact-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value;
      if (!value.startsWith('+7 (')) {
        value = '+7 (';
      }
      state.booking.phone = value;
      e.target.value = value;
    });
  }
}

function openBookingWizard(initialServiceId = null) {
  resetBookingState();
  openDrawer('sheet-booking');

  if (initialServiceId) {
    const service = SERVICES.find(s => s.id === initialServiceId);
    if (service) {
      state.booking.services.push(service);
      
      const itemEl = document.querySelector(`.selectable-item[data-id="${initialServiceId}"]`);
      if (itemEl) itemEl.classList.add('selected');
      
      updateBookingSummary();
    }
  }
}

function initServicesChecklist() {
  const container = document.getElementById('services-list-container');
  if (!container) return;

  container.innerHTML = SERVICES.map(srv => {
    return `
      <div class="selectable-item" data-id="${srv.id}">
        <div class="selectable-item-left">
          <div class="selectable-item-icon">
            <i class="fa-solid ${srv.icon}"></i>
          </div>
          <div>
            <div class="selectable-item-title">${srv.name}</div>
            <div class="selectable-item-desc">${srv.desc}</div>
          </div>
        </div>
        <span class="selectable-item-price">${srv.price} ₽</span>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.selectable-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = item.getAttribute('data-id');
      const service = SERVICES.find(s => s.id === id);
      
      const index = state.booking.services.findIndex(s => s.id === id);
      if (index > -1) {
        state.booking.services.splice(index, 1);
        item.classList.remove('selected');
      } else {
        state.booking.services.push(service);
        item.classList.add('selected');
      }

      updateBookingSummary();
    });
  });
}

function initCalendarSlider() {
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
      <div class="date-pill-card" data-date="${dateString}" data-display="${displayDate}">
        <span class="date-pill-day">${dayName}</span>
        <span class="date-pill-num">${dayNum}</span>
      </div>
    `;
  }
  
  dateContainer.innerHTML = html;

  dateContainer.querySelectorAll('.date-pill-card').forEach(pill => {
    pill.addEventListener('click', () => {
      dateContainer.querySelectorAll('.date-pill-card').forEach(p => p.classList.remove('selected'));
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

  // Deterministic disabled slots depending on date length sum
  const dateStr = state.booking.date ? state.booking.date.dateString : 'default';
  let seed = 0;
  for (let c = 0; c < dateStr.length; c++) seed += dateStr.charCodeAt(c);

  let html = '';
  slots.forEach((time, idx) => {
    const isOccupied = ((seed + idx * 7) % 5 === 0 || (seed + idx * 13) % 6 === 0);
    const disabledAttr = isOccupied ? 'disabled' : '';
    const classes = isOccupied ? 'time-slot-pill disabled' : 'time-slot-pill';
    
    html += `<div class="${classes}" ${disabledAttr} data-time="${time}">${time}</div>`;
  });

  timeContainer.innerHTML = html;

  timeContainer.querySelectorAll('.time-slot-pill:not(.disabled)').forEach(pill => {
    pill.addEventListener('click', () => {
      timeContainer.querySelectorAll('.time-slot-pill').forEach(p => p.classList.remove('selected'));
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
      showToast('Выберите хотя бы одну услугу или масло.');
      return;
    }
    goToWizardStep(2);
  } else if (step === 2) {
    const carField = document.getElementById('car-brand');
    if (!carField || !carField.value.trim()) {
      showToast('Укажите марку автомобиля.');
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
      showToast('Введите ваше имя.');
      return;
    }
    if (!phoneField || phoneField.value.length < 18) { // Mask format +7 (999) 999-99-99 is 18 chars
      showToast('Введите полный номер телефона.');
      return;
    }

    state.booking.name = nameField.value.trim();
    state.booking.phone = phoneField.value.trim();

    submitOrder();
  }
}

function handleWizardBack() {
  const step = state.booking.step;
  if (step > 1) {
    goToWizardStep(step - 1);
  }
}

function goToWizardStep(stepNum) {
  document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
  
  let stepId = 'step-services';
  let title = 'Выбор услуг';
  if (stepNum === 2) { stepId = 'step-car'; title = 'О машине'; }
  else if (stepNum === 3) { stepId = 'step-datetime'; title = 'Дата и время'; }
  else if (stepNum === 4) { stepId = 'step-contacts'; title = 'Сводка заказа'; }

  const stepEl = document.getElementById(stepId);
  if (stepEl) stepEl.classList.add('active');

  document.getElementById('wizard-title').innerText = title;
  document.getElementById('wizard-step-counter').innerText = `Шаг ${stepNum} из 4`;

  const progressMapping = { 1: 25, 2: 50, 3: 75, 4: 100 };
  document.getElementById('wizard-progress-bar').style.width = `${progressMapping[stepNum]}%`;

  state.booking.step = stepNum;

  // Buttons Visibility
  const backBtn = document.getElementById('btn-wizard-back');
  if (backBtn) backBtn.style.display = stepNum > 1 ? 'flex' : 'none';

  const nextBtn = document.getElementById('btn-wizard-next');
  if (nextBtn) {
    if (stepNum === 4) {
      nextBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Подтвердить`;
    } else {
      nextBtn.innerHTML = `Далее <i class="fa-solid fa-chevron-right"></i>`;
    }
  }

  // Scroll wizard body to top
  const body = document.querySelector('#sheet-booking .modal-sheet-body');
  if (body) body.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateBookingSummary() {
  let total = 0;
  state.booking.services.forEach(s => total += s.price);
  state.booking.catalogAddedItems.forEach(i => total += i.price);

  // Check Promotion: Free oil change when buying motor oil
  const isBuyingOil = state.booking.catalogAddedItems.some(i => i.category === 'oils');
  const hasOilChangeService = state.booking.services.some(s => s.id === 'srv-oil-change');
  
  let discountText = '';
  if (isBuyingOil && hasOilChangeService) {
    total -= 600; // Oil change work costs 600, make it free
    discountText = ' (Замена масла 0 ₽ по акции)';
  }

  // Subtotal in Step 1
  const subtotalPrice = document.getElementById('wizard-subtotal-price');
  const subtotalPanel = document.getElementById('wizard-subtotal-panel');
  if (subtotalPrice && subtotalPanel) {
    subtotalPrice.innerText = `${total} ₽`;
    subtotalPanel.style.display = total > 0 ? 'flex' : 'none';
  }

  // Final Summary Receipt
  const summaryServices = document.getElementById('summary-services');
  if (summaryServices) {
    const list = [
      ...state.booking.services.map(s => s.name),
      ...state.booking.catalogAddedItems.map(i => i.name)
    ];
    summaryServices.innerText = list.length > 0 ? list.join(', ') : 'Не выбрано';
  }

  const summaryCar = document.getElementById('summary-car');
  if (summaryCar) {
    summaryCar.innerText = state.booking.carBrand ? 
      `${state.booking.carBrand} (${state.booking.oilVolume === 'not-sure' ? 'консультация' : state.booking.oilVolume + ' л'})` : 
      'Не указан';
  }

  const summaryDateTime = document.getElementById('summary-datetime');
  if (summaryDateTime) {
    summaryDateTime.innerText = (state.booking.date && state.booking.time) ? 
      `${state.booking.date.displayDate} в ${state.booking.time}` : 
      'Не выбрано';
  }

  const summaryPrice = document.getElementById('summary-price');
  if (summaryPrice) {
    summaryPrice.innerHTML = `${total} ₽${discountText ? `<span style="font-size:9px; display:block; color:var(--success); font-weight:normal;">${discountText}</span>` : ''}`;
  }
}

function submitOrder() {
  showConfirmDialog('Вы действительно хотите подтвердить запись?', (confirmed) => {
    if (confirmed) {
      processSuccess();
    }
  });
}

function processSuccess() {
  const bookingIdNum = Math.floor(10000 + Math.random() * 90000);
  const bookingId = `MAG-${bookingIdNum}`;

  document.getElementById('wizard-controls').style.display = 'none';
  document.getElementById('wizard-progress-bar').closest('.wizard-progress-track').style.display = 'none';
  document.getElementById('wizard-step-counter').style.display = 'none';
  document.getElementById('wizard-title').innerText = 'Запись подтверждена';

  let total = 0;
  state.booking.services.forEach(s => total += s.price);
  state.booking.catalogAddedItems.forEach(i => total += i.price);
  const isBuyingOil = state.booking.catalogAddedItems.some(i => i.category === 'oils');
  const hasOilChange = state.booking.services.some(s => s.id === 'srv-oil-change');
  if (isBuyingOil && hasOilChange) total -= 600;

  document.getElementById('success-id').innerText = `№ ${bookingId}`;
  document.getElementById('success-datetime').innerText = `${state.booking.date.displayDate} в ${state.booking.time}`;
  
  const listFormatted = [
    ...state.booking.services.map(s => s.name),
    ...state.booking.catalogAddedItems.map(i => i.name)
  ].join(', ');
  
  document.getElementById('success-services').innerText = listFormatted;
  document.getElementById('success-price').innerText = `${total} ₽`;

  // Check-in QR Code Generator (Inline SVG)
  const qrPlaceholder = document.getElementById('success-qr-code');
  if (qrPlaceholder) {
    qrPlaceholder.innerHTML = `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="white"/>
        <rect x="5" y="5" width="22" height="22" fill="black"/>
        <rect x="8" y="8" width="16" height="16" fill="white"/>
        <rect x="11" y="11" width="10" height="10" fill="black"/>
        
        <rect x="73" y="5" width="22" height="22" fill="black"/>
        <rect x="76" y="8" width="16" height="16" fill="white"/>
        <rect x="79" y="11" width="10" height="10" fill="black"/>
        
        <rect x="5" y="73" width="22" height="22" fill="black"/>
        <rect x="8" y="76" width="16" height="16" fill="white"/>
        <rect x="11" y="79" width="10" height="10" fill="black"/>
        
        <rect x="35" y="10" width="10" height="10" fill="black"/>
        <rect x="50" y="5" width="15" height="15" fill="black"/>
        <rect x="40" y="30" width="25" height="25" fill="black"/>
        <rect x="45" y="35" width="15" height="15" fill="white"/>
        <rect x="75" y="35" width="15" height="25" fill="black"/>
        <rect x="15" y="35" width="15" height="10" fill="black"/>
        <rect x="10" y="50" width="10" height="15" fill="black"/>
        <rect x="55" y="70" width="20" height="20" fill="black"/>
      </svg>
    `;
  }

  // Insert to profile active booking list dynamically!
  const historyContainer = document.getElementById('history-container');
  if (historyContainer) {
    const firstChild = historyContainer.firstChild;
    const newRecordHtml = `
      <div class="history-card glass-card">
        <div class="history-header">
          <span class="history-service">${listFormatted.substring(0, 45)}${listFormatted.length > 45 ? '...' : ''}</span>
          <span class="history-status status-active">Подтверждено</span>
        </div>
        <div class="history-body">
          <span class="history-date"><i class="fa-regular fa-calendar"></i> ${state.booking.date.displayDate}, ${state.booking.time}</span>
          <span class="history-price">${total} ₽</span>
        </div>
      </div>
    `;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = newRecordHtml.trim();
    historyContainer.insertBefore(tempDiv.firstChild, firstChild);
  }

  document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
  document.getElementById('booking-success-screen').style.display = 'flex';

  // Dispatch API Telegram confirmation bot message
  sendBotConfirmation({
    id: bookingId,
    name: state.booking.name,
    phone: state.booking.phone,
    car: state.booking.carBrand,
    volume: state.booking.oilVolume,
    date: state.booking.date.displayDate,
    time: state.booking.time,
    details: listFormatted,
    comment: state.booking.comment,
    price: total
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

  document.querySelectorAll('.selectable-item').forEach(item => item.classList.remove('selected'));
  const carEl = document.getElementById('car-brand'); if (carEl) carEl.value = '';
  const commentEl = document.getElementById('booking-comment'); if (commentEl) commentEl.value = '';
  const volumeEl = document.getElementById('oil-volume'); if (volumeEl) volumeEl.value = 'not-sure';
  
  initCalendarSlider();

  document.getElementById('wizard-controls').style.display = 'flex';
  document.getElementById('wizard-progress-bar').closest('.wizard-progress-track').style.display = 'block';
  document.getElementById('wizard-step-counter').style.display = 'block';
  document.getElementById('booking-success-screen').style.display = 'none';

  goToWizardStep(1);
  updateBookingSummary();
}

// ==========================================
// MODALS SHEET CONTROLLER
// ==========================================
function openDrawer(drawerId) {
  const overlay = document.getElementById(drawerId);
  if (!overlay) return;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden'; 
}

function closeDrawer(drawerId) {
  const overlay = document.getElementById(drawerId);
  if (!overlay) return;

  overlay.classList.remove('active');
  document.body.style.overflow = ''; 
}

function openModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (!overlay) return;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden'; 
}

function closeModal(modalId) {
  const overlay = document.getElementById(modalId);
  if (!overlay) return;

  overlay.classList.remove('active');
  document.body.style.overflow = ''; 
}

function initModals() {
  document.getElementById('btn-close-qr').addEventListener('click', () => closeModal('modal-qr'));
  document.getElementById('btn-close-product').addEventListener('click', () => closeModal('modal-product'));

  const btnProductOrder = document.getElementById('btn-product-order');
  if (btnProductOrder) {
    btnProductOrder.addEventListener('click', () => {
      const prodId = btnProductOrder.getAttribute('data-product-id');
      addProductToBooking(prodId);
      closeModal('modal-product');
      closeDrawer('sheet-catalog');
      
      // Navigate straight to wizard to checkout
      openBookingWizard();
    });
  }

  // Click on background overlay to close
  document.querySelectorAll('.modal-overlay, .modal-sheet-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        if (overlay.classList.contains('modal-overlay')) {
          closeModal(overlay.id);
        } else {
          closeDrawer(overlay.id);
        }
      }
    });
  });
}

// ==========================================
// TOAST NOTIFICATIONS & CONFIRMATION DIALOGS
// ==========================================
let dialogCallback = null;

function showToast(message, isSuccess = false) {
  const toast = document.getElementById('web-toast');
  const textEl = document.getElementById('web-toast-text');
  const iconEl = document.getElementById('web-toast-icon');

  if (!toast || !textEl || !iconEl) return;

  textEl.innerText = message;

  if (isSuccess) {
    toast.style.borderColor = 'var(--success)';
    iconEl.className = 'fa-solid fa-circle-check';
    iconEl.style.color = 'var(--success)';
  } else {
    toast.style.borderColor = 'var(--accent-red)';
    iconEl.className = 'fa-solid fa-circle-exclamation';
    iconEl.style.color = 'var(--accent-red)';
  }

  toast.classList.add('active');
  setTimeout(() => {
    toast.classList.remove('active');
  }, 2500);
}

function showConfirmDialog(message, callback) {
  const dialog = document.getElementById('web-confirm-dialog');
  const textEl = document.getElementById('web-confirm-text');

  if (!dialog || !textEl) return;

  textEl.innerText = message;
  dialogCallback = callback;

  dialog.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function initConfirmDialog() {
  const btnYes = document.getElementById('btn-confirm-yes');
  const btnNo = document.getElementById('btn-confirm-no');
  const dialog = document.getElementById('web-confirm-dialog');

  if (!dialog) return;

  btnYes.addEventListener('click', () => {
    dialog.classList.remove('active');
    document.body.style.overflow = '';
    if (dialogCallback) {
      dialogCallback(true);
      dialogCallback = null;
    }
  });

  btnNo.addEventListener('click', () => {
    dialog.classList.remove('active');
    document.body.style.overflow = '';
    if (dialogCallback) {
      dialogCallback(false);
      dialogCallback = null;
    }
  });

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      dialog.classList.remove('active');
      document.body.style.overflow = '';
      dialogCallback = null;
    }
  });
}

// ==========================================
// TELEGRAM TELEBOT API INTEGRATION
// ==========================================
async function sendBotConfirmation(booking) {
  const token = '8867823783:AAH9zZ2Hi1cWcFGq54Fn1A807p88iTsRJ2Q';
  let chatId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

  if (!chatId) {
    console.log('Bot confirmation bypassed: Not in Telegram client workspace.');
    return;
  }

  const messageText = `🔔 *Запись подтверждена!*\n\n` +
    `🆔 *Номер заказа:* \`${booking.id}\`\n` +
    `👤 *Клиент:* ${booking.name}\n` +
    `📞 *Телефон:* ${booking.phone}\n` +
    `🚗 *Машина:* ${booking.car}\n` +
    `🛢 *Объем масла:* ${booking.volume === 'not-sure' ? 'Нужна консультация' : booking.volume + ' л'}\n` +
    `📅 *Время:* ${booking.date} в ${booking.time}\n` +
    `🛠 *Состав заказа:* ${booking.details}\n` +
    `💬 *Комментарий:* ${booking.comment || 'Нет'}\n` +
    `💳 *Итого к оплате:* ${booking.price} ₽\n\n` +
    `📍 *Ждем вас по адресу:* г. Махачкала, ул. Шеболдаева, 43.\n` +
    `📞 *Телефон для справок:* +7 (928) 575-06-06`;

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
    console.log('Telegram API Bot Notification dispatched to user:', chatId);
  } catch (err) {
    console.error('Failed to dispatch TG notification:', err);
  }
}

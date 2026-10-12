(() => {
  const S = window.STORE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const app = $('#app');

  const money = v => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: S.currency, maximumFractionDigits: 0 }).format(v);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const byId = id => S.products.find(p => p.id === id);
  const catName = id => (S.categories.find(c => c.id === id) || {}).name || '';
  const heart = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 7.8 3.6 4 7.3 4c2 0 3.6 1.1 4.7 2.7C13.1 5.1 14.7 4 16.7 4c3.7 0 5.9 3.8 4.6 7.3-1.8 4.6-9.3 9.2-9.3 9.2z"/></svg>';

  // ---------- Хранилище ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem('vessore_' + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('vessore_' + k, JSON.stringify(v)); } catch {} }
  };
  let cart = store.get('cart', []).filter(i => byId(i.id));
  let favs = store.get('favs', []).filter(byId);
  let promo = store.get('promo', '');
  let lastOrder = null;

  const PROMOS = { VESSORE10: 0.1 }; // промокоды: код → скидка

  // ---------- Toast ----------
  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  // ---------- Карточка товара ----------
  function priceHtml(p) {
    return p.old ? `<s>${money(p.old)}</s><span class="new">${money(p.price)}</span>` : money(p.price);
  }
  function badgeHtml(p) {
    if (!p.badge) return '';
    const cls = p.soldOut ? 'sold' : p.badge === 'SALE' ? 'sale' : '';
    return `<span class="card-badge ${cls}">${esc(p.badge)}</span>`;
  }
  function card(p) {
    const on = favs.includes(p.id);
    const quick = p.soldOut ? '' : `<div class="quick">${p.sizes.map(s => `<button data-quick="${p.id}" data-size="${s}" aria-label="Добавить ${s} в корзину">${s}</button>`).join('')}</div>`;
    return `
      <article class="card reveal">
        <a href="#/product/${p.id}" class="card-media">
          ${badgeHtml(p)}
          <img src="${p.images[0]}" alt="${esc(p.name)} — ${esc(p.color)}" loading="lazy">
          ${p.images[1] ? `<img class="alt" src="${p.images[1]}" alt="" loading="lazy">` : ''}
        </a>
        <button class="fav ${on ? 'on' : ''}" data-fav="${p.id}" aria-label="${on ? 'Убрать из избранного' : 'В избранное'}">${heart}</button>
        ${quick}
        <a href="#/product/${p.id}" class="card-info">
          <div><div class="card-name">${esc(p.name)}</div><div class="card-color">${esc(p.color)}</div></div>
          <div class="price">${priceHtml(p)}</div>
        </a>
      </article>`;
  }
  const grid = (list, cls = '') => `<div class="grid ${cls}">${list.map(card).join('')}</div>`;

  // ---------- Страницы ----------
  const pages = {
    home() {
      const news = S.products.filter(p => p.badge === 'NEW').slice(0, 8);
      const best = S.products.filter(p => p.badge !== 'NEW').slice(0, 4);
      return `
      <section class="hero" data-hero>
        <img src="${S.hero.image}" alt="VESSORE ${esc(S.hero.title)}" fetchpriority="high">
        <div class="hero-content">
          <h1>${esc(S.hero.title)}</h1>
          <div class="hero-side">
            <span class="small">${esc(S.hero.subtitle)}</span>
            <a href="#/catalog/new" class="btn light">Смотреть коллекцию</a>
          </div>
        </div>
      </section>

      <section class="section" style="padding-bottom:0">
        <div class="section-head reveal"><h2>Новинки</h2><a class="link" href="#/catalog/new">Смотреть все</a></div>
        ${grid(news)}
      </section>

      <section class="section">
        <div class="section-head reveal"><h2>Категории</h2><a class="link" href="#/catalog">Весь каталог</a></div>
        <div class="cats">${S.categories.map(c => `
          <a class="cat" href="#/catalog/${c.id}"><img src="${c.image}" alt="" loading="lazy"><span>${esc(c.name)}</span></a>`).join('')}
        </div>
      </section>

      <section class="split">
        <a class="banner reveal" href="#/catalog/hoodies">
          <img src="${S.categories[0].image}" alt="" loading="lazy">
          <div class="banner-text"><h3>Heavy<br>Hoodies</h3><span class="link">Купить</span></div>
        </a>
        <a class="banner reveal" href="#/catalog/outerwear">
          <img src="${S.categories[3].image}" alt="" loading="lazy">
          <div class="banner-text"><h3>Outerwear<br>FW26</h3><span class="link">Купить</span></div>
        </a>
      </section>

      <section class="manifest reveal">
        <p>VESSORE — одежда для тех, кто <span>не подстраивается.</span> Плотные ткани, точный крой, <span>малые тиражи.</span></p>
      </section>

      <section class="section" style="padding-top:0">
        <div class="section-head reveal"><h2>Бестселлеры</h2><a class="link" href="#/catalog">Весь каталог</a></div>
        ${grid(best)}
      </section>

      <section class="perks">
        <div class="perk"><b>Доставка</b><p>По России и СНГ. Бесплатно от ${money(S.freeShippingFrom)}</p></div>
        <div class="perk"><b>Возврат</b><p>14 дней на обмен и возврат</p></div>
        <div class="perk"><b>Качество</b><p>Плотный хлопок, отшиваем в России</p></div>
        <div class="perk"><b>Поддержка</b><p>Ответим в Telegram за 15 минут</p></div>
      </section>`;
    },

    catalog(cat = 'all') {
      const filters = [['all', 'Все'], ['new', 'Новинки'], ...S.categories.map(c => [c.id, c.name]), ['sale', 'Sale']];
      const title = cat === 'all' ? 'Каталог' : cat === 'new' ? 'Новинки' : cat === 'sale' ? 'Sale' : catName(cat) || 'Каталог';
      return `
      <div class="page-head">
        <div class="crumbs"><a href="#/">Главная</a> / ${esc(title)}</div>
        <h1 class="page-title">${esc(title)}</h1>
      </div>
      <div class="toolbar">
        <div class="filters">${filters.map(([id, n]) => `<a class="chip ${id === cat ? 'active' : ''}" href="#/catalog${id === 'all' ? '' : '/' + id}">${esc(n)}</a>`).join('')}</div>
        <label class="sort"><select id="sort" aria-label="Сортировка">
          <option value="default">Сортировка</option>
          <option value="asc">Сначала дешевле</option>
          <option value="desc">Сначала дороже</option>
        </select></label>
      </div>
      <div id="catalogGrid" data-cat="${esc(cat)}"></div>`;
    },

    product(id) {
      const p = byId(id);
      if (!p) return notFound();
      const on = favs.includes(p.id);
      const related = S.products.filter(x => x.id !== p.id && x.category === p.category)
        .concat(S.products.filter(x => x.id !== p.id && x.category !== p.category)).slice(0, 4);
      const single = p.sizes.length === 1;
      return `
      <section class="product">
        <div class="gallery">${p.images.map((src, i) => `<div class="ph"><img src="${src}" alt="${esc(p.name)} — фото ${i + 1}" ${i ? 'loading="lazy"' : ''}></div>`).join('')}</div>
        <div class="pinfo">
          <div class="crumbs"><a href="#/catalog">Каталог</a> / <a href="#/catalog/${p.category}">${esc(catName(p.category))}</a></div>
          <h1>${esc(p.name)}</h1>
          <div class="p-color">${esc(p.color)}</div>
          <div class="price">${priceHtml(p)}</div>
          <div class="sizes-head"><span class="small">Размер</span>${single ? '' : '<button class="small link" id="sizeChartBtn">Таблица размеров</button>'}</div>
          <div class="sizes">${p.sizes.map(s => `<button class="size ${single ? 'active' : ''}" data-size="${s}" ${p.soldOut ? 'disabled' : ''}>${s}</button>`).join('')}</div>
          <div class="p-actions">
            <button class="btn" id="addBtn" data-id="${p.id}" ${p.soldOut ? 'disabled' : ''}>${p.soldOut ? 'Нет в наличии' : 'Добавить в корзину'}</button>
            <button class="btn ghost fav-btn ${on ? 'on' : ''}" data-fav="${p.id}" aria-label="В избранное">${heart}</button>
          </div>
          <details class="acc" open><summary>Описание</summary><div class="acc-body">${esc(p.description)}</div></details>
          <details class="acc"><summary>Состав и детали</summary><div class="acc-body"><ul>${(p.details || []).map(d => `<li>${esc(d)}</li>`).join('')}</ul></div></details>
          <details class="acc"><summary>Доставка и возврат</summary><div class="acc-body">${esc(S.faq[0][1])} ${esc(S.faq[2][1])}</div></details>
          <details class="acc"><summary>Уход</summary><div class="acc-body">${esc(S.faq[4][1])}</div></details>
        </div>
      </section>
      <section class="section">
        <div class="section-head"><h2>Вам может понравиться</h2></div>
        ${grid(related)}
      </section>`;
    },

    favorites() {
      const list = favs.map(byId).filter(Boolean);
      return `
      <div class="page-head"><div class="crumbs"><a href="#/">Главная</a> / Избранное</div><h1 class="page-title">Избранное</h1></div>
      ${list.length ? grid(list) : `<div class="empty"><h3>Пока пусто</h3><p>Нажмите ♡ на карточке, чтобы сохранить вещь.</p><a class="btn" href="#/catalog">В каталог</a></div>`}`;
    },

    checkout() {
      if (!cart.length) return `<div class="empty"><h3>Корзина пуста</h3><p>Добавьте что-нибудь из каталога.</p><a class="btn" href="#/catalog">В каталог</a></div>`;
      const t = totals();
      return `
      <div class="page-head"><div class="crumbs"><a href="#/">Главная</a> / Оформление заказа</div><h1 class="page-title">Оформление</h1></div>
      <section class="checkout">
        <form class="checkout-form" id="checkoutForm" novalidate>
          <h3>Контактные данные</h3>
          <div class="fields">
            <label class="field"><input name="name" required autocomplete="name" placeholder="Имя и фамилия *"></label>
            <label class="field"><input name="phone" type="tel" required autocomplete="tel" placeholder="Телефон *" pattern="[0-9+()\\-\\s]{10,}"></label>
            <label class="field wide"><input name="email" type="email" autocomplete="email" placeholder="E-mail"></label>
          </div>
          <h3>Доставка</h3>
          <label class="radio"><span><input type="radio" name="delivery" value="СДЭК" data-cost="450" checked>СДЭК — пункт выдачи</span><span>2–5 дней</span></label>
          <label class="radio"><span><input type="radio" name="delivery" value="Почта России" data-cost="390">Почта России</span><span>5–10 дней</span></label>
          <label class="radio"><span><input type="radio" name="delivery" value="Курьер по Москве" data-cost="600">Курьер по Москве</span><span>в день заказа</span></label>
          <div class="fields" style="margin-top:10px">
            <label class="field"><input name="city" required autocomplete="address-level2" placeholder="Город *"></label>
            <label class="field"><input name="address" required autocomplete="street-address" placeholder="Адрес или пункт выдачи *"></label>
            <label class="field wide"><textarea name="comment" placeholder="Комментарий к заказу"></textarea></label>
          </div>
          <h3>Оплата</h3>
          <label class="radio"><span><input type="radio" name="pay" value="Картой / СБП" checked>Картой онлайн или СБП</span></label>
          <label class="radio"><span><input type="radio" name="pay" value="При получении">При получении</span></label>
          <label class="check"><input type="checkbox" required> <span>Согласен с публичной офертой и обработкой персональных данных</span></label>
          <button class="btn full" type="submit">Оформить заказ · <span id="payTotal">${money(t.total + deliveryCost())}</span></button>
        </form>
        <aside class="checkout-sum" id="checkoutSum">${summaryHtml()}</aside>
      </section>`;
    },

    success() {
      if (!lastOrder) { location.hash = '#/'; return ''; }
      const { num, text } = lastOrder;
      const c = S.contacts;
      return `
      <section class="success">
        <span class="small muted">Заказ № ${num}</span>
        <h1 style="margin-top:12px">Спасибо за заказ</h1>
        <p>Мы свяжемся с вами в течение часа для подтверждения и оплаты.</p>
        <p>Чтобы ускорить — отправьте детали заказа нам в Telegram или на почту.</p>
        <pre id="orderText">${esc(text)}</pre>
        <div class="row">
          <button class="btn" id="tgSend">Отправить в Telegram</button>
          <a class="btn ghost" href="mailto:${c.email}?subject=${encodeURIComponent('Заказ № ' + num)}&body=${encodeURIComponent(text)}">Отправить на почту</a>
        </div>
      </section>`;
    },

    about() {
      return `
      <div class="page-head"><div class="crumbs"><a href="#/">Главная</a> / О бренде</div><h1 class="page-title">О бренде</h1></div>
      <div class="about-img"><img src="${S.hero.image}" alt="" loading="lazy"></div>
      <section class="text-page">
        <p class="lead">VESSORE — независимый бренд одежды из России. Мы делаем базовые вещи с характером.</p>
        <div class="prose">
          <p>Каждая коллекция выходит ограниченным тиражом. Мы работаем с плотными тканями, подбираем фурнитуру вручную и отшиваем вещи на небольших производствах, где контролируем каждый шов.</p>
          <p>Наш крой — свободный и объёмный, но продуманный: спущенное плечо, точная длина рукава, правильный вес ткани. Вещи держат форму и не теряют вид после десятков стирок.</p>
          <p>Мы за честные цены, понятный сервис и одежду, которую хочется носить каждый день.</p>
          <p><a class="btn" href="#/catalog">Смотреть каталог</a></p>
        </div>
      </section>`;
    },

    info() {
      return `
      <div class="page-head"><div class="crumbs"><a href="#/">Главная</a> / Покупателям</div><h1 class="page-title">Покупателям</h1></div>
      <section class="text-page">
        <p class="lead">Ответы на частые вопросы. Не нашли нужное — напишите нам в <a style="text-decoration:underline" href="https://t.me/${S.contacts.telegram}" target="_blank" rel="noopener">Telegram</a>.</p>
        <div>
          ${S.faq.map(([q, a], i) => `<details class="acc" ${i ? '' : 'open'}><summary>${esc(q)}</summary><div class="acc-body">${esc(a)}</div></details>`).join('')}
          <details class="acc"><summary>Таблица размеров</summary><div class="acc-body">${sizeTable()}</div></details>
          <details class="acc"><summary>Политика конфиденциальности</summary><div class="acc-body">Мы используем ваши данные только для обработки заказа и связи с вами. Данные не передаются третьим лицам, кроме служб доставки.</div></details>
        </div>
      </section>`;
    }
  };
  function notFound() {
    return `<div class="empty"><h3>Страница не найдена</h3><p>Возможно, товар закончился или ссылка устарела.</p><a class="btn" href="#/catalog">В каталог</a></div>`;
  }
  function sizeTable() {
    const t = S.sizeChart;
    return `<table class="size-table"><thead><tr>${t.head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${t.rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }

  // ---------- Каталог: фильтр + сортировка ----------
  function renderCatalogGrid() {
    const box = $('#catalogGrid'); if (!box) return;
    const cat = box.dataset.cat;
    let list = S.products.filter(p =>
      cat === 'all' ? true : cat === 'new' ? p.badge === 'NEW' : cat === 'sale' ? !!p.old : p.category === cat);
    const sort = $('#sort')?.value;
    if (sort === 'asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'desc') list = [...list].sort((a, b) => b.price - a.price);
    box.innerHTML = list.length ? grid(list) : `<div class="empty"><h3>Скоро</h3><p>В этой категории пока нет товаров.</p><a class="btn" href="#/catalog">Весь каталог</a></div>`;
    observe();
  }

  // ---------- Роутер ----------
  function route() {
    const [, page = '', arg] = location.hash.replace(/^#/, '').split('/');
    closeAll();
    let html;
    switch (page) {
      case '': html = pages.home(); break;
      case 'catalog': html = pages.catalog(arg ? decodeURIComponent(arg) : 'all'); break;
      case 'product': html = pages.product(decodeURIComponent(arg || '')); break;
      case 'favorites': html = pages.favorites(); break;
      case 'checkout': html = pages.checkout(); break;
      case 'success': html = pages.success(); break;
      case 'about': html = pages.about(); break;
      case 'info': html = pages.info(); break;
      default: html = notFound();
    }
    app.innerHTML = html;
    window.scrollTo(0, 0);
    $$('.nav a').forEach(a => a.classList.toggle('active', location.hash.startsWith(a.getAttribute('href'))));
    document.title = page === 'product' && byId(arg) ? `${byId(arg).name} — VESSORE` : 'VESSORE — официальный магазин';
    renderCatalogGrid();
    bindImages(app);
    observe();
    onScroll();
  }

  // ---------- Избранное ----------
  function toggleFav(id) {
    const on = favs.includes(id);
    favs = on ? favs.filter(f => f !== id) : [...favs, id];
    store.set('favs', favs);
    $$(`[data-fav="${id}"]`).forEach(b => b.classList.toggle('on', !on));
    toast(on ? 'Удалено из избранного' : 'Добавлено в избранное');
    updateCounts();
    if (location.hash === '#/favorites') route();
  }

  // ---------- Корзина ----------
  function addToCart(id, size) {
    const p = byId(id); if (!p || p.soldOut) return;
    const item = cart.find(i => i.id === id && i.size === size);
    item ? item.qty++ : cart.push({ id, size, qty: 1 });
    saveCart();
    openCart();
  }
  function saveCart() { store.set('cart', cart); updateCounts(); renderCart(); }
  function totals() {
    const sub = cart.reduce((s, i) => s + byId(i.id).price * i.qty, 0);
    const disc = Math.round(sub * (PROMOS[promo] || 0));
    return { sub, disc, total: sub - disc, count: cart.reduce((s, i) => s + i.qty, 0) };
  }
  function deliveryCost() {
    const r = $('input[name="delivery"]:checked');
    if (!r) return 0;
    return totals().total >= S.freeShippingFrom ? 0 : Number(r.dataset.cost);
  }
  function lineHtml(i, idx) {
    const p = byId(i.id);
    return `
      <div class="line">
        <a href="#/product/${p.id}" class="line-img"><img src="${p.images[0]}" alt=""></a>
        <div>
          <div class="line-name">${esc(p.name)}</div>
          <div class="line-meta">${esc(p.color)} · ${i.size}</div>
          <div class="qty"><button data-qty="${idx}" data-d="-1" aria-label="Меньше">−</button><span>${i.qty}</span><button data-qty="${idx}" data-d="1" aria-label="Больше">+</button></div>
        </div>
        <div class="line-right"><span class="price">${money(p.price * i.qty)}</span><button class="remove" data-remove="${idx}">Удалить</button></div>
      </div>`;
  }
  function renderCart() {
    const body = $('#cartBody'), foot = $('#cartFoot');
    $('#cartTitle').textContent = `Корзина (${totals().count})`;
    if (!cart.length) {
      body.innerHTML = `<div class="empty" style="padding:60px 0"><h3>Корзина пуста</h3><p>Самое время это исправить.</p><a class="btn" href="#/catalog">В каталог</a></div>`;
      foot.innerHTML = '';
      return;
    }
    const t = totals();
    const left = Math.max(0, S.freeShippingFrom - t.total);
    body.innerHTML = `
      <div class="ship-bar">${left ? `До бесплатной доставки — <b>${money(left)}</b>` : '<b>Доставка бесплатная</b>'}
        <div class="bar"><i style="width:${Math.min(100, t.total / S.freeShippingFrom * 100)}%"></i></div></div>
      ${cart.map(lineHtml).join('')}`;
    foot.innerHTML = `
      ${t.disc ? `<div class="total"><span>Скидка (${esc(promo)})</span><span>−${money(t.disc)}</span></div>` : ''}
      <div class="total big"><span>Итого</span><span>${money(t.total)}</span></div>
      <a class="btn full" href="#/checkout">Оформить заказ</a>
      <p class="note">Стоимость доставки рассчитывается при оформлении.</p>`;
    bindImages(body);
  }
  function summaryHtml() {
    const t = totals(), d = deliveryCost();
    return `
      <h3>Ваш заказ</h3>
      ${cart.map(i => { const p = byId(i.id); return `
        <div class="sum-line"><div class="line-img"><img src="${p.images[0]}" alt=""></div>
        <div><div class="line-name">${esc(p.name)}</div><div class="line-meta" style="margin:0">${i.size} · ${i.qty} шт.</div></div>
        <span class="price">${money(p.price * i.qty)}</span></div>`; }).join('')}
      <form class="promo" id="promoForm"><input id="promoInput" placeholder="Промокод" value="${esc(promo)}" aria-label="Промокод"><button>Применить</button></form>
      <div class="total"><span>Товары</span><span>${money(t.sub)}</span></div>
      ${t.disc ? `<div class="total"><span>Скидка</span><span>−${money(t.disc)}</span></div>` : ''}
      <div class="total"><span>Доставка</span><span>${d ? money(d) : 'Бесплатно'}</span></div>
      <div class="total big"><span>К оплате</span><span>${money(t.total + d)}</span></div>`;
  }
  function refreshCheckout() {
    const sum = $('#checkoutSum'); if (!sum) return;
    sum.innerHTML = summaryHtml(); bindImages(sum);
    $('#payTotal').textContent = money(totals().total + deliveryCost());
  }
  function updateCounts() {
    $('#cartCount').textContent = totals().count;
    $('#favCount').textContent = favs.length || '';
  }

  function submitOrder(form) {
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const f = Object.fromEntries(new FormData(form));
    const t = totals(), d = deliveryCost();
    const num = 'VS' + Date.now().toString().slice(-6);
    const text = [
      `Заказ № ${num}`,
      ...cart.map(i => { const p = byId(i.id); return `• ${p.name} (${p.color}), ${i.size} × ${i.qty} — ${money(p.price * i.qty)}`; }),
      t.disc ? `Скидка ${promo}: −${money(t.disc)}` : null,
      `Доставка (${f.delivery}): ${d ? money(d) : 'бесплатно'}`,
      `Итого: ${money(t.total + d)}`,
      `Оплата: ${f.pay}`,
      '',
      `Имя: ${f.name}`, `Телефон: ${f.phone}`, f.email ? `E-mail: ${f.email}` : null,
      `Адрес: ${f.city}, ${f.address}`, f.comment ? `Комментарий: ${f.comment}` : null
    ].filter(l => l !== null).join('\n');
    // Здесь можно отправить заказ на сервер / в CRM / в Telegram-бота:
    // fetch('/api/order', { method: 'POST', body: JSON.stringify({ num, ...f, cart }) });
    lastOrder = { num, text };
    cart = []; promo = ''; store.set('promo', ''); saveCart();
    location.hash = '#/success';
  }

  // ---------- Панели ----------
  function openCart() { renderCart(); $('#cart').classList.add('open'); $('#overlay').classList.add('open'); $('#cart').setAttribute('aria-hidden', 'false'); document.body.classList.add('lock'); }
  function closeCart() { $('#cart').classList.remove('open'); $('#overlay').classList.remove('open'); $('#cart').setAttribute('aria-hidden', 'true'); }
  function toggleMenu(force) { const on = document.body.classList.toggle('menu-open', force); $('#menu').setAttribute('aria-hidden', String(!on)); syncLock(); }
  function openSearch() { $('#search').classList.add('open'); $('#search').setAttribute('aria-hidden', 'false'); document.body.classList.add('lock'); setTimeout(() => $('#searchInput').focus(), 50); renderSearch(); }
  function closeSearch() { $('#search').classList.remove('open'); $('#search').setAttribute('aria-hidden', 'true'); }
  function closeAll() { closeCart(); closeSearch(); toggleMenu(false); syncLock(); }
  function syncLock() {
    const any = $('#cart').classList.contains('open') || $('#search').classList.contains('open') || document.body.classList.contains('menu-open');
    document.body.classList.toggle('lock', any);
  }
  function renderSearch() {
    const q = $('#searchInput').value.trim().toLowerCase();
    const list = q ? S.products.filter(p => [p.name, p.color, catName(p.category)].join(' ').toLowerCase().includes(q)) : S.products.filter(p => p.badge === 'NEW');
    $('#searchResults').innerHTML = `<p class="small muted" style="margin-bottom:16px">${q ? `Найдено: ${list.length}` : 'Популярное'}</p>` +
      (list.length ? grid(list) : `<p>По запросу «${esc(q)}» ничего не найдено.</p>`);
    bindImages($('#searchResults'));
    $$('#searchResults .reveal').forEach(e => e.classList.add('in'));
  }

  // ---------- Анимации и картинки ----------
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' }) : null;
  function observe() { $$('.reveal:not(.in)').forEach(el => io ? io.observe(el) : el.classList.add('in')); }
  function bindImages(root) {
    $$('img', root).forEach(img => img.addEventListener('error', () => img.classList.add('broken'), { once: true }));
  }

  function onScroll() {
    const hero = $('[data-hero]');
    const on = hero && window.scrollY < hero.offsetHeight - 80 && !document.body.classList.contains('menu-open');
    $('#header').classList.toggle('on-hero', !!on);
  }

  // ---------- События ----------
  document.addEventListener('click', e => {
    const t = e.target.closest('button, a'); if (!t) return;

    if (t.dataset.fav) { e.preventDefault(); return toggleFav(t.dataset.fav); }
    if (t.dataset.quick) { e.preventDefault(); return addToCart(t.dataset.quick, t.dataset.size); }

    if (t.classList.contains('size')) {
      $$('.size').forEach(b => b.classList.toggle('active', b === t));
      return;
    }
    if (t.id === 'addBtn') {
      const s = $('.size.active');
      if (!s) { toast('Выберите размер'); $('.sizes').animate([{ transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'none' }], 250); return; }
      return addToCart(t.dataset.id, s.dataset.size);
    }
    if (t.id === 'sizeChartBtn') { $('#sizeTable').innerHTML = sizeTable(); return $('#sizeDialog').showModal(); }
    if (t.hasAttribute('data-close-dialog')) return t.closest('dialog').close();

    if (t.dataset.qty !== undefined) {
      const i = cart[t.dataset.qty]; i.qty += Number(t.dataset.d);
      if (i.qty < 1) cart.splice(t.dataset.qty, 1);
      saveCart(); return refreshCheckout();
    }
    if (t.dataset.remove !== undefined) { cart.splice(t.dataset.remove, 1); saveCart(); return refreshCheckout(); }

    if (t.id === 'cartBtn') return openCart();
    if (t.hasAttribute('data-close-cart')) { closeCart(); return syncLock(); }
    if (t.id === 'menuBtn') return toggleMenu();
    if (t.id === 'searchBtn') return openSearch();
    if (t.id === 'searchClose') { closeSearch(); return syncLock(); }

    if (t.id === 'tgSend' && lastOrder) {
      navigator.clipboard?.writeText(lastOrder.text).then(() => toast('Заказ скопирован — вставьте в чат'), () => {});
      window.open(`https://t.me/${S.contacts.telegram}`, '_blank', 'noopener');
    }
    // клик по ссылке внутри панели — закрыть панель (переход сделает роутер)
    if (t.tagName === 'A' && t.getAttribute('href') === location.hash) closeAll();
  });

  $('#overlay').addEventListener('click', () => { closeCart(); syncLock(); });
  $('#searchInput').addEventListener('input', renderSearch);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
  document.addEventListener('change', e => {
    if (e.target.id === 'sort') renderCatalogGrid();
    if (e.target.name === 'delivery') refreshCheckout();
  });
  document.addEventListener('submit', e => {
    if (e.target.id === 'promoForm') {
      e.preventDefault();
      const code = $('#promoInput').value.trim().toUpperCase();
      if (PROMOS[code]) { promo = code; store.set('promo', promo); toast(`Промокод ${code} применён`); }
      else { promo = ''; store.set('promo', ''); toast(code ? 'Промокод не найден' : 'Промокод удалён'); }
      renderCart(); refreshCheckout();
    }
    if (e.target.id === 'checkoutForm') { e.preventDefault(); submitOrder(e.target); }
    if (e.target.id === 'subscribeForm') { e.preventDefault(); e.target.reset(); toast('Вы подписаны. Промокод VESSORE10 — скидка 10%'); }
  });
  window.addEventListener('hashchange', route);
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- Статика ----------
  const c = S.contacts;
  const socials = [['Telegram', `https://t.me/${c.telegram}`], ['Instagram', `https://instagram.com/${c.instagram}`], ['VK', `https://vk.com/${c.vk}`]];
  const ext = ([n, h]) => `<a href="${h}" target="_blank" rel="noopener">${n}</a>`;
  const ann = S.announcement.map(a => `<span>${esc(a)}</span>`).join('');
  $('#announce').innerHTML = ann + ann + ann + ann;
  $('#menuNav').innerHTML = [['#/catalog', 'Каталог'], ['#/catalog/new', 'Новинки'], ...S.categories.map(x => [`#/catalog/${x.id}`, x.name]), ['#/favorites', 'Избранное'], ['#/about', 'О бренде'], ['#/info', 'Покупателям']]
    .map(([h, n]) => `<a href="${h}">${esc(n)}</a>`).join('') + `<a href="#" id="menuSearch">Поиск</a>`;
  $('#menuSocials').innerHTML = socials.map(ext).join('');
  $('#footerContacts').innerHTML += `<a href="mailto:${c.email}">${c.email}</a><a href="tel:${c.phone.replace(/[^\d+]/g, '')}">${c.phone}</a>` + socials.map(ext).join('');
  $('#year').textContent = new Date().getFullYear();
  $('#menuNav').addEventListener('click', e => { if (e.target.id === 'menuSearch') { e.preventDefault(); toggleMenu(false); openSearch(); } else if (e.target.tagName === 'A') toggleMenu(false); });

  updateCounts();
  renderCart();
  route();
})();

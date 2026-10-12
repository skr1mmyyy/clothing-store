// ============================================================
//  VESSORE — данные магазина. Редактируйте этот файл:
//  контакты, категории и товары. Фото можно заменить на свои:
//  положите файлы в папку img/ и укажите путь, например 'img/hoodie-1.jpg'.
// ============================================================

const u = (id, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

window.STORE = {
  brand: 'VESSORE',
  currency: 'RUB',
  freeShippingFrom: 10000,

  contacts: {
    email: 'hello@vessore.ru',
    telegram: 'vessore',        // t.me/vessore
    instagram: 'vessore',
    vk: 'vessore',
    phone: '+7 (900) 000-00-00'
  },

  announcement: [
    'Бесплатная доставка от 10 000 ₽',
    'Отправка по всей России и СНГ',
    'Обмен и возврат 14 дней',
    'Drop 01 — уже в продаже'
  ],

  hero: {
    title: 'DROP 01',
    subtitle: 'Новая коллекция',
    image: u('photo-1515886657613-9f3515b0c78f', 2000)
  },

  categories: [
    { id: 'hoodies',   name: 'Худи',        image: u('photo-1556821840-3a63f95609a7', 1000) },
    { id: 'tees',      name: 'Футболки',    image: u('photo-1521572163474-6864f9cf17ab', 1000) },
    { id: 'pants',     name: 'Штаны',       image: u('photo-1552374196-1ab2a1c593e8', 1000) },
    { id: 'outerwear', name: 'Верхняя одежда', image: u('photo-1551028719-00167b16eac5', 1000) },
    { id: 'accessories', name: 'Аксессуары', image: u('photo-1588850561407-ed78c282e89b', 1000) }
  ],

  // badge: 'NEW' | 'SALE' | 'SOLD OUT' | ''
  // soldOut: true — товар нельзя добавить в корзину
  products: [
    {
      id: 'heavy-hoodie-black', name: 'Heavy Hoodie', color: 'Black', category: 'hoodies',
      price: 7900, badge: 'NEW',
      images: [u('photo-1556821840-3a63f95609a7'), u('photo-1578681994506-b8f463449011')],
      sizes: ['S', 'M', 'L', 'XL'],
      description: 'Плотное худи oversize из футера 480 г/м². Двойной капюшон, спущенное плечо, вышивка VESSORE на груди.',
      details: ['100% хлопок, футер 3-нитка с начёсом', 'Плотность 480 г/м²', 'Oversize fit', 'Сделано в России']
    },
    {
      id: 'logo-tee-white', name: 'Logo Tee', color: 'White', category: 'tees',
      price: 3500, badge: 'NEW',
      images: [u('photo-1521572163474-6864f9cf17ab'), u('photo-1503341504253-dff4815485f1')],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      description: 'Базовая футболка свободного кроя с шелкографией на спине. Плотный трикотаж держит форму после стирок.',
      details: ['100% хлопок, кулирка 240 г/м²', 'Шелкография', 'Boxy fit', 'Сделано в России']
    },
    {
      id: 'wide-pants-grey', name: 'Wide Sweatpants', color: 'Grey Melange', category: 'pants',
      price: 6400, badge: '',
      images: [u('photo-1552374196-1ab2a1c593e8'), u('photo-1509631179647-0177331693ae')],
      sizes: ['S', 'M', 'L', 'XL'],
      description: 'Широкие спортивные штаны с высокой посадкой. Утяжка на поясе и низ без манжета.',
      details: ['100% хлопок, футер 3-нитка', 'Плотность 420 г/м²', 'Wide leg', 'Сделано в России']
    },
    {
      id: 'denim-jacket', name: 'Washed Denim Jacket', color: 'Vintage Blue', category: 'outerwear',
      price: 11900, old: 13900, badge: 'SALE',
      images: [u('photo-1543076447-215ad9ba6923'), u('photo-1495121605193-b116b5b9c5fe')],
      sizes: ['S', 'M', 'L'],
      description: 'Джинсовая куртка с эффектом стирки. Укороченный объёмный силуэт и металлическая фурнитура с логотипом.',
      details: ['100% хлопок, деним 13 oz', 'Garment wash', 'Cropped oversize', 'Сделано в России']
    },
    {
      id: 'zip-hoodie-grey', name: 'Zip Hoodie', color: 'Ash', category: 'hoodies',
      price: 8400, badge: '',
      images: [u('photo-1578681994506-b8f463449011'), u('photo-1556821840-3a63f95609a7')],
      sizes: ['S', 'M', 'L', 'XL'],
      description: 'Зип-худи с двусторонней молнией и карманами-кенгуру. Резинка на манжетах и по низу.',
      details: ['100% хлопок, футер с начёсом', 'Плотность 460 г/м²', 'Oversize fit', 'Сделано в России']
    },
    {
      id: 'graphic-tee-black', name: 'Graphic Tee', color: 'Black', category: 'tees',
      price: 3900, badge: '',
      images: [u('photo-1503341504253-dff4815485f1'), u('photo-1521572163474-6864f9cf17ab')],
      sizes: ['S', 'M', 'L', 'XL'],
      description: 'Футболка с принтом коллекции DROP 01. Свободный крой, укреплённая горловина.',
      details: ['100% хлопок, 240 г/м²', 'DTF-принт', 'Boxy fit', 'Сделано в России']
    },
    {
      id: 'nylon-jacket', name: 'Nylon Jacket', color: 'Black', category: 'outerwear',
      price: 14900, badge: 'SOLD OUT', soldOut: true,
      images: [u('photo-1551028719-00167b16eac5'), u('photo-1490481651871-ab68de25d43d')],
      sizes: ['M', 'L', 'XL'],
      description: 'Лёгкая куртка из нейлона с водоотталкивающей пропиткой. Капюшон убирается в воротник.',
      details: ['100% нейлон', 'Сетчатая подкладка', 'Regular fit', 'Сделано в России']
    },
    {
      id: 'cap-black', name: 'Logo Cap', color: 'Black', category: 'accessories',
      price: 2900, badge: 'NEW',
      images: [u('photo-1588850561407-ed78c282e89b'), u('photo-1529139574466-a303027c1d8b')],
      sizes: ['ONE'],
      description: 'Шестипанельная кепка с вышитым логотипом и металлической застёжкой.',
      details: ['100% хлопок, твил', 'Объёмная вышивка', 'Регулируемый размер']
    },
    {
      id: 'tote-bag', name: 'Tote Bag', color: 'Natural', category: 'accessories',
      price: 1900, badge: '',
      images: [u('photo-1553062407-98eeb64c6a62'), u('photo-1512436991641-6745cdb1723f')],
      sizes: ['ONE'],
      description: 'Шоппер из плотного канваса с внутренним карманом на молнии.',
      details: ['100% хлопок, канвас 340 г/м²', '40 × 42 см', 'Шелкография']
    },
    {
      id: 'cargo-pants', name: 'Cargo Pants', color: 'Black', category: 'pants',
      price: 8900, badge: 'NEW',
      images: [u('photo-1509631179647-0177331693ae'), u('photo-1552374196-1ab2a1c593e8')],
      sizes: ['S', 'M', 'L', 'XL'],
      description: 'Карго-брюки с объёмными карманами и регулируемыми манжетами на кулиске.',
      details: ['Хлопок 98%, эластан 2%', 'Рипстоп', 'Baggy fit', 'Сделано в России']
    }
  ],

  // Таблица размеров (см)
  sizeChart: {
    head: ['Размер', 'Длина', 'Ширина груди', 'Длина рукава'],
    rows: [
      ['XS', '68', '58', '58'],
      ['S',  '70', '61', '60'],
      ['M',  '72', '64', '62'],
      ['L',  '74', '67', '64'],
      ['XL', '76', '70', '66']
    ]
  },

  faq: [
    ['Доставка', 'Отправляем СДЭК, Почтой России и Boxberry по всей России и СНГ. Заказ собираем за 1–2 рабочих дня. По Москве — курьером в день заказа. Доставка бесплатная от 10 000 ₽.'],
    ['Оплата', 'Картой онлайн, через СБП или при получении (для заказов по России).'],
    ['Обмен и возврат', 'Обмен и возврат в течение 14 дней с момента получения, если вещь не была в носке и сохранены бирки. Напишите нам — поможем оформить.'],
    ['Как выбрать размер', 'Все вещи кроя oversize. Если хотите посадку по фигуре — берите на размер меньше. Замеры каждой модели — в таблице размеров на странице товара.'],
    ['Уход', 'Стирка при 30°, наизнанку, без отбеливателя. Не сушить в барабане, гладить с изнанки.']
  ]
};

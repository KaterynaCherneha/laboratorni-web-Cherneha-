// 🎯 Селектори DOM-елементів, які використовуються в скрипті
const selectors = {
  stateJson: '#stateJson',             // Елемент, що містить JSON-стан
  settingsList: '#settingsList',       // Контейнер для списку налаштувань
  settingTemplate: '#settingTemplate', // <template> для рендерингу налаштування
  settingsTable: '#settingsTable',     // Таблиця налаштувань
  emptyState: '#emptyState',           // Елемент, що показується при порожньому стані
  createSettingBtn: '#createSettingBtn'// Кнопка для створення нового налаштування
};

//тримуємо початковий JSON-стан з DOM і парсимо його
const initialState = document.querySelector(selectors.stateJson).textContent;
const state = JSON.parse(initialState);

//Функція рендерингу одного налаштування
function renderSetting(setting) {
  const template = document.querySelector(selectors.settingTemplate);
  const clone = template.content.cloneNode(true); // Клонуємо шаблон

  const row = clone.querySelector('.setting-line');
  row.id = `setting-${setting.id}`; // Унікальний ID для кожного рядка

  const link = clone.querySelector('.setting-link');
  link.textContent = setting.title; // Назва налаштування
  link.href = `#setting-${setting.id}`; // Посилання на елемент

  const status = clone.querySelector('.setting-status');
  status.textContent = setting.status.charAt(0).toUpperCase() + setting.status.slice(1); // Форматуємо статус
  status.classList.add(
    setting.status === 'active' ? 'active-status1' : 'draft-status1' // Додаємо клас залежно від статусу
  );

  const removeBtn = clone.querySelector('.remove-button');
  //Обробник події для видалення налаштування
  removeBtn.addEventListener('click', () => removeSetting(row, setting.id));

  // Додаємо елемент до DOM
  document.querySelector(selectors.settingsList).appendChild(clone);
}

//Видалення налаштування з DOM і стану
function removeSetting(row, id) {
  row.remove(); // Видаляємо HTML-елемент
  const index = state.settings.findIndex(s => s.id === id); // Знаходимо індекс у масиві
  if (index !== -1) {
    state.settings.splice(index, 1); // Видаляємо з масиву
  }
  toggleEmptyState(); // Оновлюємо порожній стан
}

//Додавання нового налаштування
function addNewSetting() {
  const newSetting = {
    id: Date.now(),       // Унікальний ID на основі часу  
    title: `Content`,     // Назва за замовчуванням
    status: 'draft'       // Статус за замовчуванням
  };
  state.settings.push(newSetting); // Додаємо до стану
  renderSetting(newSetting);       // Рендеримо нове налаштування
  toggleEmptyState();              // Оновлюємо порожній стан
}

//Перевірка, чи є налаштування, і оновлення інтерфейсу
function toggleEmptyState() {
  const isEmpty = state.settings.length === 0;
  document.querySelector(selectors.emptyState).classList.toggle('hidden', !isEmpty);     // Показати/сховати порожній стан
  document.querySelector(selectors.settingsTable).classList.toggle('hidden', isEmpty);   // Показати/сховати таблицю
}

//Ініціалізація: рендеримо всі налаштування з початкового стану
state.settings.forEach(renderSetting);
toggleEmptyState();

//Обробник події для кнопки створення нового налаштування
document.querySelector(selectors.createSettingBtn).addEventListener('click', (e) => {
  e.preventDefault(); // Запобігаємо перезавантаженню сторінки
  addNewSetting();    // Додаємо нове налаштування
});




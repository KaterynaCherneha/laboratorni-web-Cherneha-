const getUrlParams = () => Object.fromEntries(new URLSearchParams(window.location.search));
const params = getUrlParams();
const id = parseInt(params.id);

const selectors = {
  stateJson: "#state",
  removeBtn: ".removeBtn",
  editBtn: ".editBtn",
  formulaLink: ".formula-link",
  emptyState: ".img-wrapper",
  formulaTemplate: ".formulaTemplateElem",
  formulaList: ".formula-list",
  formulasWrapper: ".formulas-wrapper",
  save: ".save",
  discard: ".discard",
  titleInput: ".settingTitleInput",
  createBtn: ".create-formula"
};

const initialState = document.querySelector(selectors.stateJson).textContent;
const state = JSON.parse(initialState);
const originalSetting = state.settings.find((s) => s.id === id);

const savedSettings = JSON.parse(JSON.stringify(originalSetting));
const currentSettings = originalSetting;

const inputTitle = document.querySelector(selectors.titleInput);
const saveBtn = document.querySelector(selectors.save);
const discardBtn = document.querySelector(selectors.discard);
const createBtn = document.querySelector(selectors.createBtn);
const formulaList = document.querySelector(selectors.formulaList);

inputTitle.value = currentSettings.title || "";
inputTitle.setAttribute("disabled", true);

createBtn.addEventListener("click", () => {
  inputTitle.removeAttribute("disabled");
  inputTitle.value = "";
  inputTitle.focus();

  saveBtn.disabled = true;
  discardBtn.disabled = true;
  saveBtn.classList.add("disabled");
  discardBtn.classList.add("disabled");
});

inputTitle.addEventListener("input", () => {
  const hasText = inputTitle.value.trim() !== "";
  saveBtn.disabled = !hasText;
  discardBtn.disabled = !hasText;
  saveBtn.classList.toggle("disabled", !hasText);
  discardBtn.classList.toggle("disabled", !hasText);
});

discardBtn.addEventListener("click", () => {
  currentSettings.title = savedSettings.title;
  inputTitle.value = savedSettings.title || "";
  inputTitle.setAttribute("disabled", true);

  saveBtn.disabled = true;
  discardBtn.disabled = true;
  saveBtn.classList.add("disabled");
  discardBtn.classList.add("disabled");
});

const toggleEmptyState = () => {
  const emptyStateElem = document.querySelector(selectors.emptyState);
  const formulasWrapper = document.querySelector(selectors.formulasWrapper);

  if (!currentSettings.formulas.length) {
    formulasWrapper.classList.add("hidden");
    emptyStateElem.classList.remove("hidden");
  } else {
    emptyStateElem.classList.add("hidden");
    formulasWrapper.classList.remove("hidden");
  }
};

const removeFormula = (id) => {
  currentSettings.formulas = currentSettings.formulas.filter((f) => f.id !== id);
  const formulaElem = document.getElementById(id);
  if (formulaElem) formulaElem.remove();
  toggleEmptyState();
};

const renderFormulaElem = (formula) => {
  const template = document.querySelector(selectors.formulaTemplate);
  const clone = template.cloneNode(true);
  clone.classList.remove("hidden");
  clone.id = formula.id;

  const titleElem = clone.querySelector(selectors.formulaLink);
  titleElem.textContent = formula.title;

  const editBtn = clone.querySelector(selectors.editBtn);
  editBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const input = document.createElement("input");
    input.type = "text";
    input.value = formula.title;
    input.className = "formula-edit-input";

    clone.querySelector(".formula-row").replaceChild(input, titleElem);
    input.focus();

    const confirmEdit = () => {
      const newTitle = input.value.trim();
      if (newTitle) {
        formula.title = newTitle;
        const savedFormula = savedSettings.formulas.find(f => f.id === formula.id);
        if (savedFormula) savedFormula.title = newTitle;

        titleElem.textContent = newTitle;
        clone.querySelector(".formula-row").replaceChild(titleElem, input);
      } else {
        clone.querySelector(".formula-row").replaceChild(titleElem, input);
      }
    };

    input.addEventListener("blur", confirmEdit);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") input.blur();
    });
  });

  const removeBtn = clone.querySelector(selectors.removeBtn);
  removeBtn.addEventListener("click", () => removeFormula(formula.id));

  formulaList.appendChild(clone);
  toggleEmptyState();
};

saveBtn.addEventListener("click", () => {
  const title = inputTitle.value.trim();
  if (!title) return;

  currentSettings.title = title;
  savedSettings.title = title;

  const newFormula = {
    id: Date.now(),
    title: title,
    formula: "X + Y",
    frequency: 2000,
    currency: "BTC",
    targets: {
      collectionsIds: [],
      products: []
    }
  };

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
  titleInput: ".settingTitleInput"
};

const state = JSON.parse(document.querySelector(selectors.stateJson).textContent);
const id = 1;
const setting = state.settings.find((s) => s.id === id);

const inputTitle = document.querySelector(selectors.titleInput);
const saveBtn = document.querySelector(selectors.save);

const toggleEmptyState = () => {
  const emptyStateElem = document.querySelector(selectors.emptyState);
  const formulaElem = document.querySelector(selectors.formulasWrapper);
  if (!setting.formulas.length) {
    formulaElem.classList.add("hidden");
    emptyStateElem.classList.remove("hidden");
  } else {
    emptyStateElem.classList.add("hidden");
    formulaElem.classList.remove("hidden");
  }
};

const removeFormula = (id) => {
  setting.formulas = setting.formulas.filter((f) => f.id !== id);
  const formulaElem = document.getElementById(id);
  if (formulaElem) formulaElem.remove();
  toggleEmptyState();
};

const renderFormulaElem = (formula) => {
  const template = document.querySelector(selectors.formulaTemplate);
  const clone = template.cloneNode(true);
  clone.classList.remove("hidden");
  clone.id = formula.id;

  clone.querySelector(selectors.formulaLink).textContent = formula.title;
  clone.querySelector(selectors.formulaLink).href = `/formula.html?id=${formula.id}`;
  clone.querySelector(selectors.editBtn).href = `/formula.html?id=${formula.id}`;
  clone.querySelector(selectors.removeBtn).addEventListener("click", () => removeFormula(formula.id));

  document.querySelector(selectors.formulaList).appendChild(clone);
  toggleEmptyState();
};

saveBtn.addEventListener("click", () => {
  const title = inputTitle.value.trim();
  if (!title) return;

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

  setting.formulas.push(newFormula);
  renderFormulaElem(newFormula);

  inputTitle.value = setting.title || "";
  saveBtn.disabled = true;
  discardBtn.disabled = true;
  saveBtn.classList.add("disabled");
  discardBtn.classList.add("disabled");
});

setting.formulas.forEach(renderFormulaElem);
toggleEmptyState();
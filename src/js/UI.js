function createComponent(type, label, value = '') {
  switch (type) {
    case 'dropdown':
      return createDropDown(label, value)
    case 'text':
      return createText(label, value)
    case 'button':
      return createButton(label, value)
    default:
      throw new Error(`Unsupported component type: ${type}`);
  }
}

function appendChildren(container, ...elements) {
  elements.forEach(el => container.appendChild(el));
}
function createDropDown(label, item) {
  return new Kuc.Dropdown({
    label: label,
    items: item,
  });
}
function createButton(text, value) {
  return new Kuc.Button({
    text: text,
    value: value
  });
}
function createText(label, value) {
  return new Kuc.Text({
    label: label,
    value: value
  });
}
function getFieldOptions(properties, fieldTypes = []) {
  return Object.entries(properties)
    .filter(([, value]) => fieldTypes.includes(value.type))
    .map(([, value]) => ({
      label: `${value.label}(${value.code})`,
      value: value.code
    }));
}
export { createComponent, appendChildren, getFieldOptions };

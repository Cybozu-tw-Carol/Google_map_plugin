/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/UI.js":
/*!**********************!*\
  !*** ./src/js/UI.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   appendChildren: () => (/* binding */ appendChildren),\n/* harmony export */   createComponent: () => (/* binding */ createComponent),\n/* harmony export */   getFieldOptions: () => (/* binding */ getFieldOptions)\n/* harmony export */ });\nfunction createComponent(type, label, value = '') {\n  switch (type) {\n    case 'dropdown':\n      return createDropDown(label, value)\n    case 'text':\n      return createText(label, value)\n    case 'button':\n      return createButton(label, value)\n    default:\n      throw new Error(`Unsupported component type: ${type}`);\n  }\n}\n\nfunction appendChildren(container, ...elements) {\n  elements.forEach(el => container.appendChild(el));\n}\nfunction createDropDown(label, item) {\n  return new Kuc.Dropdown({\n    label: label,\n    items: item,\n  });\n}\nfunction createButton(text, value) {\n  return new Kuc.Button({\n    text: text,\n    value: value\n  });\n}\nfunction createText(label, value) {\n  return new Kuc.Text({\n    label: label,\n    value: value\n  });\n}\nfunction getFieldOptions(properties, fieldTypes = []) {\n  return Object.entries(properties)\n    .filter(([, value]) => fieldTypes.includes(value.type))\n    .map(([, value]) => ({\n      label: `${value.label}(${value.code})`,\n      value: value.code\n    }));\n}\n\n\n\n//# sourceURL=webpack:///./src/js/UI.js?");

/***/ }),

/***/ "./src/js/config.js":
/*!**************************!*\
  !*** ./src/js/config.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _UI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UI */ \"./src/js/UI.js\");\n\n\n(async (PLUGIN_ID) => {\n  'use strict'\n  const URL = `https://maps.googleapis.com/maps/api/geocode/json`\n\n  const req = new KintoneRestAPIClient()\n  const appId = kintone.app.getId()\n  const fieldSpace = document.querySelector('.fieldSpace')\n  const btnSpace = document.querySelector('.btnSpace')\n  const { properties } = await req.app.getFormFields({\n    app: appId\n  })\n  const text = (0,_UI__WEBPACK_IMPORTED_MODULE_0__.getFieldOptions)(properties, ['SINGLE_LINE_TEXT'])\n\n  //Definition config fields\n  const CONFIG_FIELD = [\n    { field: 'addressField', label: '地址欄位', type: 'dropdown', value: text },\n    { field: 'latField', label: '座標lat欄位', type: 'dropdown', value: text },\n    { field: 'lngField', label: '座標lng欄位', type: 'dropdown', value: text },\n    { field: 'mapField', label: '地圖顯示欄位', type: 'text', value: '' },\n    { field: 'mapAPI', label: 'Maps Static API Token', type: 'text', value: '' },\n    { field: 'geocodeAPI', label: 'Maps Static API Token', type: 'text', value: '' },\n    { field: 'saveBtn', label: '保存', type: 'button', value: 'submit' },\n    { field: 'cancelBtn', label: '取消', type: 'button', value: 'normal' },\n  ]\n  const proxyConfig = kintone.plugin.app.getProxyConfig(URL, 'GET')\n  const config = kintone.plugin.app.getConfig(PLUGIN_ID)\n\n  CONFIG_FIELD.forEach(key => {\n    //Create UI Components\n    key.component = (0,_UI__WEBPACK_IMPORTED_MODULE_0__.createComponent)(key.type, key.label, key.value)\n    const container = key.type === 'button' ? btnSpace : fieldSpace\n    ;(0,_UI__WEBPACK_IMPORTED_MODULE_0__.appendChildren)(container, key.component)\n\n    //Get ProxyConfig and Config information\n    if (proxyConfig?.data && key.field === 'geocodeAPI') {\n      key.component.value = proxyConfig.data.key || ''\n    }\n    if (config) {\n      if (key.type !== 'button' && config[key.field] !== undefined) {\n        key.component.value = config[key.field]\n      }\n    }\n  })\n\n  //Set EventListener\n  const saveBtn = (CONFIG_FIELD.find(key => key.field === 'saveBtn')).component\n  const cancelBtn = (CONFIG_FIELD.find(key => key.field === 'cancelBtn')).component\n\n  saveBtn.addEventListener('click', () => {\n    //Check fields that are missing value\n    const missingFields = CONFIG_FIELD\n      .filter(({ field, type }) => type !== 'button')\n      .filter(({ component }) => !component.value)\n      \n    if (missingFields.length > 0) {\n      const labels = missingFields.map(f => f.label).join('、')\n      alert(`請填寫以下欄位：${labels}`)\n      return\n    }\n\n    //Check duplicate fields\n    if (validateDuplicateFields(CONFIG_FIELD)) return\n\n    // Set Config\n    const setConfigFields = Object.fromEntries(\n      CONFIG_FIELD\n        .filter(({ type, field }) => type !== 'button' && field !== 'geocodeAPI')\n        .map(({ field, component }) => [field, component.value])\n    );\n    const geocodeAPI = (CONFIG_FIELD.find(key => key.field === 'geocodeAPI')).component.value\n\n    kintone.plugin.app.setProxyConfig(URL, 'GET', {}, { 'key': geocodeAPI }, () => {\n      kintone.plugin.app.setConfig(setConfigFields)\n    })\n\n  })\n\n  cancelBtn.addEventListener('click', () => {\n    window.location = `../../${appId}/plugin/`\n  })\n\n  /**\n   * 檢查欄位設定中是否有重複指定相同的欄位（例如兩個欄位都選了「地址」）\n   *\n   * @param {Object} fields - 欄位設定陣列，格式為 [{ key: value }]\n   * @returns {boolean} - 有重複時回傳 true，並顯示錯誤訊息\n   */\n  function validateDuplicateFields(fields) {\n    const dropdowns = fields.filter(({ type, field }) => type === 'dropdown')\n    const valueMap = new Map()\n    const duplicate = []\n\n    dropdowns.forEach(({ field, label, component }) => {\n      const value = component.value;\n      if (!valueMap.has(value)) {\n        valueMap.set(value, [])\n      }\n      valueMap.get(value).push(label)\n    });\n\n    valueMap.forEach((fields, val) => {\n      if (fields.length > 1) {\n        duplicate.push(`「${fields.join('」、「')}」填入了相同欄位值（${val}）`)\n      }\n    });\n\n    if (duplicate.length > 0) {\n      alert(duplicate.join('\\n'))\n      console.warn(duplicate.join('\\n'))\n      return true\n    }\n\n    return false;\n  }\n})(kintone.$PLUGIN_ID)\n\n//# sourceURL=webpack:///./src/js/config.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/js/config.js");
/******/ 	
/******/ })()
;
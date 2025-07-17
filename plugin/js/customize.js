/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/customize.js":
/*!*****************************!*\
  !*** ./src/js/customize.js ***!
  \*****************************/
/***/ (() => {

eval("(async (PLUGIN_ID) => {\n  'use strict';\n\n  const GEOCODE_API = 'https://maps.googleapis.com/maps/api/geocode/json'\n  const STATIC_MAP_API = `https://maps.googleapis.com/maps/api/staticmap`\n  const config = kintone.plugin.app.getConfig(PLUGIN_ID);\n\n  const {\n    addressField = '',\n    latField = '',\n    lngField = '',\n    mapField = '',\n    mapAPI = ''\n  } = config || {};\n\n  kintone.events.on('app.record.detail.show', event => {\n    const { record } = event\n    const map = kintone.app.record.getSpaceElement(mapField)\n\n    if (!map) return setError(`找不到設定的空白欄位 ${mapField}，請確定欄位是否存在`, event);\n    if (!record[latField] || !record[lngField]) {\n      return setError('設定的緯經度欄位不存在於此應用，請檢查設定', event);\n    }\n    let lat = record[latField].value\n    let lng = record[lngField].value\n\n    const params = new URLSearchParams({\n      markers: `${lat},${lng}`,\n      zoom: '14',\n      size: '500x400',\n      maptype: 'roadmap',\n      key: mapAPI\n    })\n    const img = document.createElement('img')\n    img.src = `${STATIC_MAP_API}?${params.toString()}`;\n    img.onerror = () => {\n      map.innerText = '地圖載入失敗，請確認座標與 API 金鑰是否正確。';\n    };\n    map.appendChild(img)\n\n  })\n  kintone.events.on(['app.record.create.submit', 'app.record.edit.submit',], async event => {\n    const { record } = event\n\n    const missingFields = Object.entries(config).filter(([key, value]) => {\n      if (key === 'mapField' || key === 'mapAPI') return false\n      return !record[value]\n    })\n    if (missingFields.length > 0) {\n      const missingField = missingFields.map(([, value]) => value).join('、')\n      return setError(`缺少以下欄位資訊：${missingField}，請檢查外掛欄位設定`, event);\n    }\n\n    const address = record[addressField].value\n    if (!address) return setError('地址欄位為空，請先填入地址', event);\n\n    const fullURL = `${GEOCODE_API}?address=${encodeURIComponent(address)}`\n    try {\n      const res = await kintone.plugin.app.proxy(PLUGIN_ID, fullURL, 'GET', {}, {})\n      const body = JSON.parse(res[0])\n\n      if (body.status !== 'OK' || body.results.length === 0) {\n        return setError(`地址查詢失敗：Google Maps API 回傳狀態 ${body.status}`, event);\n      }\n      record[latField].value = body.results[0].geometry.location.lat\n      record[lngField].value = body.results[0].geometry.location.lng\n\n      return event\n    } catch (error) {\n      return setError(`地址查詢時發生錯誤：${error.message}`, event);\n    }\n\n  })\nfunction setError(message, event) {\n  event.error = message;\n  console.warn(message);\n  return event;\n}\n})(kintone.$PLUGIN_ID)\n\n//# sourceURL=webpack:///./src/js/customize.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/customize.js"]();
/******/ 	
/******/ })()
;
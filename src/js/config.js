import '../../plugin/css/style.css'
import createUI from './UI';

(async (PLUGIN_ID) => {
  'use strict'
  const URL = `https://maps.googleapis.com/maps/api/geocode/json`
  const appId = kintone.app.getId()
  const container = document.querySelector('#plugin-setting-container')

  const {
    elements: { fieldSpace, btnSpace, saveBtn, cancelBtn },
    fields: { map, address, lat, lng, geocodeAPI, mapAPI }
  } = await createUI(appId);

  container.appendChild(fieldSpace)
  container.appendChild(btnSpace)

  const proxyConfig = kintone.plugin.app.getProxyConfig(URL, 'GET')
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  const headers = proxyConfig.data

  if (headers) {
    geocodeAPI.value = headers.key || '';
  }

  if (config) {
    address.value = config.addressField || ''
    lat.value = config.latField || ''
    lng.value = config.lngField || ''
    map.value = config.mapField || ''
    mapAPI.value = config.mapAPI || ''
  }

  saveBtn.addEventListener('click', async event => {
    try {
      if (!address.value || !lat.value || !lng.value || !geocodeAPI.value || !mapAPI.value || !map.value) {
        alert('請填寫所有欄位！')
        return
      }

      const fields = {
        addressField: { label: '地址欄位', value: address.value },
        latField: { label: '緯度欄位', value: lat.value },
        lngField: { label: '經度欄位', value: lng.value },
        mapField: { label: '地圖欄位', value: map.value },
        mapAPI: { label: 'Maps API Token', value: mapAPI.value },
      };
      //檢查重複欄位
      if (validateDuplicateFields(fields)) {
        return;
      }
      const pluginConfig = {};
      for (const key in fields) {
        pluginConfig[key] = fields[key].value ? String(fields[key].value) : '';
      }
      await kintone.plugin.app.setConfig(pluginConfig);
      await kintone.plugin.app.setProxyConfig(URL, 'GET', {}, { 'key': geocodeAPI.value ? String(geocodeAPI.value) : '' })
      
    } catch (error) {
      console.error(error);
      alert(`錯誤訊息：${error.message || error}`);
    }
  })

  cancelBtn.addEventListener('click', () => {
    window.location = `../../${appId}/plugin/`
  })

  function validateDuplicateFields(fields, excludeKeys = ['mapAPI']) {
    const duplicates = Object.entries(fields)
      .filter(([key]) => !excludeKeys.includes(key))
      .reduce((acc, [key, { label, value }]) => {
        acc[value] = acc[value] || [];
        acc[value].push(label);
        return acc;
      }, {});

    const repeated = Object.entries(duplicates).filter(([, labels]) => labels.length > 1);

    if (repeated.length > 0) {
      const messages = repeated.map(
        ([val, labels]) => `「${labels.join('」、')}」填入了相同欄位值（${val}）`
      );
      console.warn('請修正以下重複設定：\n' + messages.join('\n'));
      alert('請修正以下重複設定：\n' + messages.join('\n'));
      return true;
    }
    return false;
  }
})(kintone.$PLUGIN_ID)
import '../../plugin/css/style.css'
import createUI from './UI';

(async (PLUGIN_ID) => {
  'use strict'
  const URL = `https://maps.googleapis.com/maps/api/geocode/json`
  const staticMapURL = `https://maps.googleapis.com/maps/api/staticmap`
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

  saveBtn.addEventListener('click', () => {
    if (!address.value || !lat.value || !lng.value || !geocodeAPI.value || !mapAPI.value || !map.value) {
      alert('請填寫所有欄位！')
      return
    }
    const pluginConfig = {
      addressField: address.value,
      latField: lat.value,
      lngField: lng.value,
      mapField: map.value,
      mapAPI: mapAPI.value,
    };

    kintone.plugin.app.setProxyConfig(URL, 'GET', {}, {'key': geocodeAPI.value})
    kintone.plugin.app.setProxyConfig(staticMapURL, 'GET', {}, {})
    kintone.plugin.app.setConfig(pluginConfig);
  })

  cancelBtn.addEventListener('click', () => {
    window.location = `../../${appId}/plugin/`
  })

})(kintone.$PLUGIN_ID)
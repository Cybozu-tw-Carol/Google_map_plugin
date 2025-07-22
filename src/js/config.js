import { createComponent, appendChildren, getFieldOptions } from './UI';

(async (PLUGIN_ID) => {
  'use strict'
  const URL = `https://maps.googleapis.com/maps/api/geocode/json`

  const req = new KintoneRestAPIClient()
  const appId = kintone.app.getId()
  const fieldSpace = document.querySelector('.fieldSpace')
  const btnSpace = document.querySelector('.btnSpace')
  const { properties } = await req.app.getFormFields({
    app: appId
  })
  const text = getFieldOptions(properties, ['SINGLE_LINE_TEXT'])

  //Definition config fields
  const CONFIG_FIELD = [
    { field: 'addressField', label: '地址欄位', type: 'dropdown', value: text },
    { field: 'latField', label: '座標lat欄位', type: 'dropdown', value: text },
    { field: 'lngField', label: '座標lng欄位', type: 'dropdown', value: text },
    { field: 'mapField', label: '地圖顯示欄位', type: 'text', value: '' },
    { field: 'mapAPI', label: 'Maps Static API Token', type: 'text', value: '' },
    { field: 'geocodeAPI', label: 'Maps Static API Token', type: 'text', value: '' },
    { field: 'saveBtn', label: '保存', type: 'button', value: 'submit' },
    { field: 'cancelBtn', label: '取消', type: 'button', value: 'normal' },
  ]
  const proxyConfig = kintone.plugin.app.getProxyConfig(URL, 'GET')
  const config = kintone.plugin.app.getConfig(PLUGIN_ID)

  CONFIG_FIELD.forEach(key => {
    //Create UI Components
    key.component = createComponent(key.type, key.label, key.value)
    const container = key.type === 'button' ? btnSpace : fieldSpace
    appendChildren(container, key.component)

    //Get ProxyConfig and Config information
    if (proxyConfig?.data && key.field === 'geocodeAPI') {
      key.component.value = proxyConfig.data.key || ''
    }
    if (config) {
      if (key.type !== 'button' && config[key.field] !== undefined) {
        key.component.value = config[key.field]
      }
    }
  })

  //Set EventListener
  const saveBtn = (CONFIG_FIELD.find(key => key.field === 'saveBtn')).component
  const cancelBtn = (CONFIG_FIELD.find(key => key.field === 'cancelBtn')).component

  saveBtn.addEventListener('click', () => {
    //Check fields that are missing value
    const missingFields = CONFIG_FIELD
      .filter(({ field, type }) => type !== 'button')
      .filter(({ component }) => !component.value)
      
    if (missingFields.length > 0) {
      const labels = missingFields.map(f => f.label).join('、')
      alert(`請填寫以下欄位：${labels}`)
      return
    }

    //Check duplicate fields
    if (validateDuplicateFields(CONFIG_FIELD)) return

    // Set Config
    const setConfigFields = Object.fromEntries(
      CONFIG_FIELD
        .filter(({ type, field }) => type !== 'button' && field !== 'geocodeAPI')
        .map(({ field, component }) => [field, component.value])
    );
    const geocodeAPI = (CONFIG_FIELD.find(key => key.field === 'geocodeAPI')).component.value

    kintone.plugin.app.setProxyConfig(URL, 'GET', {}, { 'key': geocodeAPI }, () => {
      kintone.plugin.app.setConfig(setConfigFields)
    })

  })

  cancelBtn.addEventListener('click', () => {
    window.location = `../../${appId}/plugin/`
  })

  /**
   * 檢查欄位設定中是否有重複指定相同的欄位（例如兩個欄位都選了「地址」）
   *
   * @param {Object} fields - 欄位設定陣列，格式為 [{ key: value }]
   * @returns {boolean} - 有重複時回傳 true，並顯示錯誤訊息
   */
  function validateDuplicateFields(fields) {
    const dropdowns = fields.filter(({ type, field }) => type === 'dropdown')
    const valueMap = new Map()
    const duplicate = []

    dropdowns.forEach(({ field, label, component }) => {
      const value = component.value;
      if (!valueMap.has(value)) {
        valueMap.set(value, [])
      }
      valueMap.get(value).push(label)
    });

    valueMap.forEach((fields, val) => {
      if (fields.length > 1) {
        duplicate.push(`「${fields.join('」、「')}」填入了相同欄位值（${val}）`)
      }
    });

    if (duplicate.length > 0) {
      alert(duplicate.join('\n'))
      console.warn(duplicate.join('\n'))
      return true
    }

    return false;
  }
})(kintone.$PLUGIN_ID)
(async (PLUGIN_ID) => {
  'use strict';

  const GEOCODE_API = 'https://maps.googleapis.com/maps/api/geocode/json'
  const STATIC_MAP_API = `https://maps.googleapis.com/maps/api/staticmap`
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);

  const {
    addressField = '',
    latField = '',
    lngField = '',
    mapField = '',
    mapAPI = ''
  } = config || {};

  kintone.events.on('app.record.detail.show', event => {
    const { record } = event
    const map = kintone.app.record.getSpaceElement(mapField)
    if (!record[latField] || !record[lngField]) {
      event.error = '設定的緯經度欄位不存在於此應用，請檢查設定'
      return event
    }
    let lat = record[latField].value
    let lng = record[lngField].value

    const params = new URLSearchParams({
      markers: `${lat},${lng}`,
      zoom: '14',
      size: '500x400',
      maptype: 'roadmap',
      key: mapAPI
    })
    const img = document.createElement('img')
    img.src = `${STATIC_MAP_API}?${params.toString()}`;
    img.onerror = () => {
      map.innerText = '地圖載入失敗，請確認座標與 API 金鑰是否正確。';
    };
    map.appendChild(img)

  })
  kintone.events.on(['app.record.create.submit', 'app.record.edit.submit',], async event => {
    const { record } = event

    const missingFields = Object.entries(config).filter(([key, value]) => {
      if (key === 'mapField' || key === 'mapAPI') return false
      return !record[value]
    })
    if (missingFields.length > 0) {
      const missingField = missingFields.map(([, value]) => value).join('、')
      event.error = `缺少以下欄位資訊：${missingField}，請檢查外掛欄位設定`
      return event
    }

    const address = record[addressField].value
    if (!address) {
      event.error = '地址欄位為空，請先填入地址'
      console.warn('地址欄位為空，請先填入地址')
      return event;
    }

    const fullURL = `${GEOCODE_API}?address=${encodeURIComponent(address)}`
    try {
      const res = await kintone.plugin.app.proxy(PLUGIN_ID, fullURL, 'GET', {}, {})
      const body = JSON.parse(res[0])

      if (body.status !== 'OK' || body.results.length === 0) {
        const message = `地址查詢失敗：Google Maps API 回傳狀態 ${body.status}`
        console.warn(message, body);
        event.error = message
        return event
      }
      record[latField].value = body.results[0].geometry.location.lat
      record[lngField].value = body.results[0].geometry.location.lng

      return event
    } catch (error) {
      const msg = error.message
      event.error = `地址查詢時發生錯誤：${msg}`;
      console.warn('Geocode Error:', error);
      return event;
    }

  })

})(kintone.$PLUGIN_ID)
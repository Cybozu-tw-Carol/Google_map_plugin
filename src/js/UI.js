async function createUI(appId) {
  const req = new KintoneRestAPIClient()
  const btnSpace = document.createElement('div')
  const fieldSpace = document.createElement('div')
  fieldSpace.className = 'fieldSpace'
  btnSpace.className = 'btn'

  const { properties } = await req.app.getFormFields({
    app: appId
  })
  const text = getFieldOptions(properties, ['SINGLE_LINE_TEXT'])

  const lat = new Kuc.Dropdown({
    label: '座標lat欄位',
    items: text,
  });

  const lng = new Kuc.Dropdown({
    label: '座標lng欄位',
    items: text,
  });

  const address = new Kuc.Dropdown({
    label: '地址欄位',
    items: text,
  });
  const map = new Kuc.Text({
    label: '地圖顯示欄位',
    value: ''
  });
  const geocodeAPI = new Kuc.Text({
    label: 'Geocoding API Token',
    value: ''
  })  
  const mapAPI= new Kuc.Text({
    label: 'Maps Static API Token',
    value: ''
  })

  const saveBtn = new Kuc.Button({
    text: '保存',
    type: 'submit',
  })

  const cancelBtn = new Kuc.Button({
    text: '取消',
    type: 'normal',
  })
  btnSpace.appendChild(saveBtn)
  btnSpace.appendChild(cancelBtn)
  fieldSpace.appendChild(map)
  fieldSpace.appendChild(address)
  fieldSpace.appendChild(lat)
  fieldSpace.appendChild(lng)
  fieldSpace.appendChild(geocodeAPI)
  fieldSpace.appendChild(mapAPI)
  return {
    elements: {
      fieldSpace,
      btnSpace,
      saveBtn,
      cancelBtn
    },
    fields: {
      map,
      address,
      lat,
      lng,
      geocodeAPI,
      mapAPI
    }
  }
}
export default createUI;

function getFieldOptions(properties, fieldTypes = []) {
  return Object.entries(properties)
    .filter(([, value]) => fieldTypes.includes(value.type))
    .map(([, value]) => ({
      label: `${value.label}(${value.code})`,
      value: value.code
    }));
}

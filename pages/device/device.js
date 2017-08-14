Page({
  data: {
    list: [
      {
        id: 'switch',
        name: '开关',
        url: 'switch/switch',
        devicelist: {}
      }, {
        id: 'tempsensor',
        name: '温度',
        devicelist: {},
        url: 'temper/temper'
      }, {
        id: 'humsensor',
        name: '湿度',
        url: 'hum/hum',
        devicelist: {}
      }, {
        id: 'pmsensor',
        name: 'PM2.5',
        url: 'pm/pm',
        devicelist: {}
      }, {
        id: 'gpssensor',
        name: 'GPS',
        url: 'gps/gps',
        devicelist: {}
      }
      , {
        id: 'bluetooth',
        name: '蓝牙',
        url: 'bluetooth/bluetooth',
        devicelist: {}
      }
      , {
        id: 'scancode',
        name: '二维码',
        url: 'scan-code/scan-code',
        devicelist: {}
      }
    ]
  },
  //点击进入相应界面
  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        wx.navigateTo({
          url: list[i].url
        })
      }
    }
  }
  ,
  onShareAppMessage: function () {
    return {
      title: 'www.smtvoice.com',
      path: 'pages/device/device'
    }
  }
  ,
  //下拉刷新
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  onLoad: function () {
  }
})
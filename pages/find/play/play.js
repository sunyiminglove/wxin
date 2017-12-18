var id
Page({
  data: {
    id
  },
  onShareAppMessage: function () {
    return {
      title: 'www.geek-iot.com',
      path: 'pages/find/play/play?id=' + id
    }
  }
  ,
  //下拉刷新
  onPullDownRefresh: function (options) {
    wx.stopPullDownRefresh()
    console.log('play load options：', options)
    this.setData({
      id: options.id
    })
  },
  onLoad: function (options) {
    console.log('play load options：', options)
    this.setData({
      id: options.id
    })
  }
})
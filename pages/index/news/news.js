var id
Page({
  data: {
    id
  },
  onShareAppMessage: function () {
    return {
      title: 'www.geek-iot.com',
      path: 'pages/index/news/news?id=' + id
    }
  }
  ,
  //下拉刷新
  onPullDownRefresh: function (options) {
    wx.stopPullDownRefresh()
    console.log('news load options：', options)
    this.setData({
      id: options.id
    })
  },
  onLoad: function (options) {
    console.log('news load options：', options)
    this.setData({
      id: options.id
    })
  }
})

var WxParse = require('../../../wxParse/wxParse.js');
var app = getApp()
var list
Page({
  data: {
    list: null
  },
  onShareAppMessage: function () {
    return {
      title: 'www.smtvoice.com',
      path: 'pages/index/news/news?id=' + id
    }
  }
  ,
  //下拉刷新
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
    console.log('news load options：', options)
    var id = options.id
    var that = this
    request(app.api_host+'blog.php?id=' + id, function (res) {
      var data = res.data
      list = res.data
      console.log('news load diy：', data)
      WxParse.wxParse('news', 'html', res.data.content, that, 5);
      //更新数据
      that.setData({
        list: list
      })
    })
  },
  onLoad: function (options) {
    console.log('news load options：', options)
    var id = options.id
    var that = this
    request(app.api_host+'blog.php?id=' + id, function (res) {
      var data = res.data
      list = res.data
      //  console.log(JSON.stringify(res.data, ' ', ' '));
      console.log('news load diy：', data)
      WxParse.wxParse('news', 'html', res.data.content, that, 5);
      //更新数据
      that.setData({
        list: list
      })
    })
  }
})

//向服务器发送get请求
//url 请求地址及参数
//Callback 回调函数
function request(url, Callback) {
  console.log('url：', url)
  wx.request({
    url: url,
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      console.log('request函数success：', res)
      Callback(res);
    }
  })
}
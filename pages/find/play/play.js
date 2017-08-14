var WxParse = require('../../../wxParse/wxParse.js');
var app = getApp()
var list
var id
Page({
  data: {
    list: null
  },
  onShareAppMessage: function () {
    return {
      title: 'www.smtvoice.com',
      path: 'pages/find/play/play?id=' + id
    }
  }
  ,
  //下拉刷新
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
    var that = this
      request(app.api_host+'blog.php?id=' + id, function (res) {
      var data = res.data
      list = res.data
      //  console.log(JSON.stringify(res.data, ' ', ' '));
      console.log('play load play：', data)
      WxParse.wxParse('news', 'html', res.data.content, that, 5);
      //更新数据
      that.setData({
        list: list
      })
    })
  },
  onLoad: function (options) {
    console.log('play load options：', options)
    id = options.id
    var that = this
    request(app.api_host+'blog.php?id=' + id, function (res) {
      var data = res.data
      list = res.data
      //  console.log(JSON.stringify(res.data, ' ', ' '));
      console.log('play load play：', data)
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
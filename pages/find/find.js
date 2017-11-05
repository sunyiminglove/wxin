var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()
var list
var id
Page({
  data: {
    list: null,
    id: null
  },
  //事件处理函数
  bindViewTap: function (e) {
    // app.num=e.currentTarget.id
    id = e.currentTarget.id
    console.log('num：', app.num)
    console.log('e：', e)
    wx.navigateTo({
      url: 'play/play?id=' + id
    })
  },
  onShareAppMessage: function () {
    return {
      title: 'www.smtvoice.com',
      path: 'pages/find/find'
    }
  }
  ,
  //下拉刷新
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
    load(this)
  },
  onLoad: function () {
    load(this)
  }
})

function load(that) {
  var that = that
  request(app.api_host+'wxin/get.blog.list.php?type=find', function (res) {
    list = res.data.list
    console.log('diy：', list)
    //更新数据
    that.setData({
      list: list
    })
  })
  //加载描述
  request(app.api_host+'wxin/info.php?type=get&name=wxin_find_des', function (res) {
    console.log('describe:', res)
    // console.log(JSON.stringify(res.data, ' ', ' '));
    WxParse.wxParse('describe', 'html', res.data.list[0].content_html, that, 5);
  })
}

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
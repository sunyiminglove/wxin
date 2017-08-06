var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()
Page({
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1500,
    news: null
  },
  //事件处理函数
  bindViewTap: function (e) {
    app.num = e.currentTarget.id
    var id = e.currentTarget.id
    // console.log('num：', app.num)
    // console.log('e：', e)
    wx.navigateTo({
      url: 'news/news?id=' + id
    })
  },
  onShareAppMessage: function () {
    return {
      title: 'www.smtvoice.com',
      path: 'pages/index/index'
    }
  }
  ,
  onShow: function () {
    //   在页面展示之后先获取一次数据
    console.log('页面展示')
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
    var that = this
    load(that)
  },
  onLoad: function () {
    var that = this
    load(that)
  }
})

function load(that) {
  var that = that;
  var imgUrls = [];
  //加载轮播图
  request('https://smtvoice.com/info.php?type=wxin_swiper', function (res) {
    console.log('swiper:', res)
    for (var i = 0; i < res.data.num; i++) {
      imgUrls = imgUrls.concat(res.data.list[i].content)
    }
    console.log('imgUrls:', imgUrls);

    //更新数据
    that.setData({
      imgUrls: imgUrls
    })
  })
  //加载描述
  request('https://smtvoice.com/info.php?type=wxin_home_des', function (res) {
    console.log('describe:', res)
    // console.log(JSON.stringify(res.data, ' ', ' '));
    WxParse.wxParse('describe', 'html', res.data.list[0].content, that, 5);
  })

  //加载新闻列表
  request('https://smtvoice.com/bloglist.php?type=news', function (res) {
    var news = res.data.list
    console.log('news：', news)
    // console.log(JSON.stringify(res.data, ' ', ' '));
    //更新数据
    that.setData({
      news: news
    })
  })

  //获取本地用户数据
  wx.getStorage({
    key: 'user',
    success: function (res) {
      app.user = res.data
      console.log('本地数据app.user：', app.user)
    }
  })

  //获取用户信息
  wx.getUserInfo({
    success: function (res) {
      console.log('用户信息:', res)
      var userInfo = res.userInfo
      var nickName = userInfo.nickName
      var avatarUrl = userInfo.avatarUrl
      var gender = userInfo.gender //性别 0：未知、1：男、2：女
      var province = userInfo.province
      var city = userInfo.city
      var country = userInfo.country

      app.userinfo = res.userInfo
    }
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
    },
    fail: function (res) {
      console.log(res)
    }
  })
}

// pages/user/login/login.js
var myfunction = require('../../../utils/myfunction');
var inputusername
var inputpassword
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  // 登录按钮事件
  bindload: function (e) {
    console.log('登陆按钮按下')
    var that = this
    myfunction.request('https://smtvoice.com/login.php?username=' + inputusername + '&password=' + inputpassword, function (res) {
      console.log(res)
      if (res.data.status == 'success') {
        console.log(res.data)
        //保存用户数据到本地
        try {
          //保存从服务器获取的用户数据
          wx.setStorageSync('user', res.data)
          app.user = res.data
          console.log('已保存', app.user)
          //切换到用户信息界面
          wx.switchTab({
            url: '../user'
          })
        } catch (e) {
          console.log('保存失败')
        }
      
      }
      else {
        wx.showToast({
          title: res.data.error,
          icon: 'fail',
          duration: 2000
        })
      }
    })
  }
  ,
  bindKeyusername: function (e) {
    inputusername = e.detail.value
    // console.log('inputusername', inputusername)
  }
  , bindKeypassword: function (e) {
    inputpassword = e.detail.value
    // console.log('inputpassword', inputpassword)
  }
})
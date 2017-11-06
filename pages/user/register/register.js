// pages/user/register/register.js
var myfunction = require('../../../utils/myfunction');
var app = getApp()
var inputnickname = ''
var inputpassword = ''
var inputconfirm = ''
var inputemail = ''
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
  ,
  bindKeynickname: function (e) {
    // console.log('昵称', e)
    inputnickname = e.detail.value
  }
  ,
  bindKeypassword: function (e) {
    // console.log('密码', e)
    inputpassword = e.detail.value
  }
  ,
  bindKeyconfirm: function (e) {
    // console.log('确认密码', e)
    inputconfirm = e.detail.value
  }

  ,
  bindKeyemail: function (e) {
    // console.log('注册邮箱', e)
    inputemail = e.detail.value
  }

  ,
  bindregister: function (res) {
    console.log('注册', res)
    var that = this
    if (inputconfirm != inputpassword) {
      wx.showModal({
        title: '提示：',
        content: '两次密码输入不一致，请改正后再试！',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    else {
      var str = app.api_host + 'user/register.php?nickname=' + inputnickname + '&password=' + inputpassword + '&email=' + inputemail
      console.log(str)
      myfunction.request(str, function (res) {
        console.log(res)
        if (res.data.resault == 'success') {
          console.log(res.data)
          wx.showModal({
            title: '注册成功',
            content: '请到邮箱激活账号后再登录！',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.switchTab({
                  url: '../user'
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
                wx.switchTab({
                  url: '../user'
                })
              }
            }
          })
        }
        else {
          wx.showModal({
            title: '注册失败',
            content: res.data.msg,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      })
    }

  }
})
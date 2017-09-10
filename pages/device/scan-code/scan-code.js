var myfunction = require('../../../utils/myfunction');
var note
var resault = null
var app = getApp();
Page({
  data: {
    resault: '',
    note: '',
    count: ''
  },
  onShareAppMessage: function () {
    return {
      title: '极客物联网',
      path: 'pages/device/scan-code/scan-code'
    }
  }
  ,
  onLoad: function (options) {
    var that = this
    console.log('userinfo:',app.userinfo)
    //在服务器获取响应结果
    myfunction.request(app.api_host+'scancode.php?type=getnum', function (res) {
      console.log(res)
      if (res.data.status == 'ok') {
        that.setData({
          count: res.data.count
        })
      }
      else {

      }
    })
  },
  onPullDownRefresh: function () {
    var that = this
    wx.stopPullDownRefresh()
    //在服务器获取响应结果
    myfunction.request(app.api_host+'scancode.php?type=getnum', function (res) {
      console.log(res)
      if (res.data.status == 'ok') {
        that.setData({
          count: res.data.count
        })
      }
      else {

      }
    })
  },
  scanCode: function () {
    var that = this
    wx.scanCode({
      success: function (res) {
        console.log(res)
        resault = res.result
        that.setData({
          resault: resault
        })
        //在服务器获取响应结果
        myfunction.request(app.api_host+'scancode.php?type=get&text=' + resault, function (res) {
          console.log(res)
          if (res.data.status == 'ok') {
            note = res.data.note
            that.setData({
              note: res.data.note

            })
          }
          else {
            that.setData({
              note: ''
            })
            wx.showModal({
              title: '扫码结果',
              content: '不存在,您可以填写备注信息然后共享！',
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
      },
      fail: function (res) {
      }
    })
  },
  bindKeyusername: function (e) {
    note = e.detail.value
    console.log('备注：', note)
  }
  ,
  btnsave: function (res) {
    if (resault != null) {
      //保存到服务器
      myfunction.request(app.api_host+'scancode.php?type=set&text=' + resault + '&note=' + note + '&nick=' + app.userinfo.nickName, function (res) {

        console.log(res)
        if (res.data.status == 'ok') {
          wx.showToast({
            title: '共享成功！',
            icon: 'success',
            duration: 1000
          })
        }
        else {
          wx.showToast({
            title: res.data.error,
            icon: 'success',
            duration: 1000
          })
        }
      })
    }
    else {
      wx.showToast({
        title: '请先扫码！',
        icon: 'success',
        duration: 1000
      })
    }
  }
})

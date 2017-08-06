

App({


  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // alert("启动了")
  },
  onShow: function () {
    // 当小程序启动，或从后台进入前台显示，会触发 onShow
    // alert("启动了")
  },
  onHide: function () {
    // 当小程序从前台进入后台，会触发 onHide

  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  //全局公共变量
  globalData: {
    userinfo: null,
    loginCode: null,
    openid: null,//
    user:null//用户登陆信息
  }
})

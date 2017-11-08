var app = getApp()
var inputusername
var inputpassword
var myfunction = require('../../utils/myfunction');
Page({
  data: {
    dis: false,
    user:''
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this
    wx.stopPullDownRefresh()
    load(that)
  },

  onLoad: function () {
    var that = this
    if (app.user != null) {
      console.log('onLoad')
      that.setData({
        dis: false,
        user:app.user
      })
    }
    else {
      that.setData({
        dis: true,
      })
    }
  }
  ,
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    var that = this
    if (app.user != null) {
      console.log('onLoad')

      that.setData({
        dis: false,
        user: app.user
      })
    }
    else {
      that.setData({
        dis: true,
      })
    }
  },

  bindlogin: function (res) {
    console.log('登录', res)
    wx.navigateTo({
      url: 'login/login',
      success: function (res) {
      }
    })
  }
  ,
  bindregister: function (res) {
    console.log('注册', res)
    wx.navigateTo({
      url: 'register/register',
      success: function (res) {
      }
    })
  }
  ,
  // 退出按钮按下
  bindlogout: function (e) {
    console.log('退出按钮按下')
    var that = this
    that.setData({
      dis: true
    })

    //删除用户数据到本地
    try {
      //清除用户登录凭证
      wx.setStorageSync('user', null)
      app.user=null
    } catch (e) {
    }

  }

})

function load(that) {
  //获取本地用户数据
  wx.getStorage({
    key: 'user',
    success: function (res) {
      app.user = res.data
      console.log('本地数据app.user：', app.user)
    }
  })
  if (app.user)//登陆过
  {
    myfunction.request(app.api_host+'/user/login.php?email=' + app.user.email + '&password=' + app.user.password, function (res) {
      console.log(res)
      if (res.data.resault == 'success') {
        console.log(res.data)
        that.setData({
          dis: false,
          user: res.data
        })

        //保存用户数据到本地
        try {
          //保存从服务器获取的用户数据
          wx.setStorageSync('user', res.data)
          app.user = res.data
        } catch (e) {
        }
      }
      else {
        wx.showToast({
          title: res.data.msg,
          icon: 'fail',
          duration: 2000
        })
        that.setData({
          dis: true,
          user: res.data
        })
      }
    })
  }
  else {
    that.setData({
      dis: true,
    })
  }

}

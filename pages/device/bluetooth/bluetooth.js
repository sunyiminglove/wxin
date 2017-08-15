var app = getApp()
var list
var updataInter //计时器handle变量
var SearchCycle = 1000 //蓝牙搜索周期
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: null,
    imgurl: null
  },
  onShareAppMessage: function () {
    return {
      title: '极客物联网',
      path: 'pages/device/bluetooth/ bluetooth'
    }
  }
  ,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
     if(!app.user) {
        //不是是登陆状态
        console.log('不是是登陆状态')
        wx.showModal({
        title: '温馨提示:',
        content: '登陆后可上传至服务器！',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      }
    setTimeout(function () {
      wx.openBluetoothAdapter({
        success: function (res) {
          console.log('openBluetoothAdapter', res)
          //开始搜索蓝牙设备
          wx.startBluetoothDevicesDiscovery({
            services: [],
            success: function (res) {
              console.log('startBluetoothDevicesDiscovery', res)
            }
          })
        }
      })
    }, 1000)
  
  }
  ,
  /**
 * 生命周期函数--监听页面卸载
 */
  onUnload: function () {
    console.log('关闭定时器')
    //关闭计时器
    clearInterval(updataInter)
  },
  onShow: function () {
    //开始搜索蓝牙设备
    wx.startBluetoothDevicesDiscovery({
      services: [],
      success: function (res) {
        console.log('startBluetoothDevicesDiscovery', res)
      }
    })
    console.log('dakai')
    var that = this
    setTimeout(function () {
      //启动定时器，开始搜索蓝牙设备
      updataInter = setInterval(function () { serch(that) }, SearchCycle)
    }, 1000)
  },
  onHide: function () {
    wx.stopBluetoothDevicesDiscovery({
      success: function(res) {
        console.log(res)
      },
    })
    console.log('关闭定时器')
    //关闭计时器
    clearInterval(updataInter)
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  //点击事件处理
  selectDevice: function (res) {
    console.log(res)
    wx.navigateTo({
      url: 'control/control?deviceId=' + list[res.currentTarget.id].deviceId + '&name=' + list[res.currentTarget.id].name,
      success: function (res) {
        console.log('关闭定时器')
        //关闭计时器
        clearInterval(updataInter) },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
})

function serch(that) {
  wx.getBluetoothDevices({
    success: function (res) {
      console.log('搜到的蓝牙设备', res)
      list = res.devices
      var i;
      var arr = new Array()
      for (i = 0; i < list.length; i++) {
        if (list[i].RSSI > -50) {
          arr[i] = "img/4.png"
        }
        else
          if (list[i].RSSI > -65) {
            arr[i] = "img/3.png"
          }
          else
            if (list[i].RSSI > -80) {
              arr[i] = "img/2.png"
            }
            else {
              arr[i] = "img/1.png"
            }
      }
      console.log(arr)
      that.setData({
        list: list,
        imgurl: arr
      })
    }
  })
}
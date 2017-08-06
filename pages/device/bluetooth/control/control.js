// pages/device/bluetooth/control/control.js
var name
var deviceId
var serviceId
var characteristicId
var sendtext
var platform
var select//读取选择的遥控器
var PageItems =
  [
    {
      wid: 1,
      name: '左旋',
      icon: 'img/1.png',
      up: 'up1',
      down: 'down1'
    },
    {
      wid: 2,
      name: '前进',
      icon: 'img/2.png',
      up: 'up2',
      down: 'down2'
    },
    {
      wid: 3,
      name: '右旋',
      icon: 'img/3.png',
      up: 'up3',
      down: 'down3'
    },
    {
      wid: 4,
      name: '左移',
      icon: 'img/4.png',
      up: 'up4',
      down: 'down4'
    },
    {
      wid: 5,
      name: '停止',
      icon: 'img/5.png',
      up: 'up5',
      down: 'down5'
    },
    {
      wid: 6,
      name: '右移',
      icon: 'img/6.png',
      up: 'up6',
      down: 'down6'
    },
    {
      wid: 7,
      name: '学习',
      icon: 'img/7.png',
      up: 'up7',
      down: 'down7'
    },
    {
      wid: 8,
      name: '后退',
      icon: 'img/8.png',
      up: 'up8',
      down: 'down8'
    },
    {
      wid: 9,
      name: '演示',
      icon: 'img/9.png',
      up: 'up9',
      down: 'down9'
    }
  ]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: null,
    deviceId: null,
    serviceId: null,
    characteristicId: null,
    connect: "连接中...",
    pageItems: null,
    display: false,
    message: '',
    select:null
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    var that = this
    //读取选择的遥控器
    getSelectIndex(that);
},
  
  btn_select: function () {
    var that = this
    wx.stopPullDownRefresh()
    wx.showActionSheet({
      itemList: ['遥控一', '遥控二', '遥控三', '设置'],
      success: function (res) {
        console.log('success:',res)
        //取消操作
        if (res.cancel==true)
        {
          //读取选择的遥控器
          getSelectIndex(that);
        }
        else
        if (res.tapIndex == 3) {
          wx.navigateTo({
            url: '../set/set'
          })
        }
        else {
          var index = res.tapIndex + 1
          //保存数据，用户选择的遥控器
          wx.setStorageSync('selectbluetooth', index)

          updata(that, index)
        }
      },
      fail: function (res) {
        console.log('fail:',res.errMsg)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.onBLEConnectionStateChange(function (res) {
      // 该方法回调中可以用于处理连接意外断开等异常情况
      console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
      if (res.connected==false)
      {
        that.setData({ connect:'已断开'})
      }
      else
      {
        that.setData({ connect: '连接' })
      }
    })
    wx.onBLECharacteristicValueChange(function (res) {
      console.log("characteristic", res)
      console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
    })
    //读取选择的遥控器

    getSelectIndex(that);

    name = options.name
    deviceId = options.deviceId
    this.setData({
      name: name,
      deviceId: deviceId
    })

    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
        platform = res.platform

        // 连接蓝牙
        wx.createBLEConnection({
          deviceId: deviceId,
          success: function (res) {
            console.log('连接蓝牙', res)
            //蓝牙连接成功
            wx.getBLEDeviceServices({
              deviceId: deviceId,
              success: function (res) {
                //设备服务获取成功
                console.log('device services:', res)
                if (platform == 'ios') {
                  serviceId = res.services[1].uuid
                  console.log('iso')
                }
                else {
                  serviceId = res.services[0].uuid
                  console.log('android')
                }
                that.setData({ serviceId: serviceId })
                setTimeout(function () {
                  wx.getBLEDeviceCharacteristics({
                    deviceId: deviceId,
                    serviceId: serviceId,
                    success: function (res) {
                      that.setData({
                        connect: "已连接"
                      })

                      console.log('device getBLEDeviceCharacteristics:', res)
                      characteristicId = res.characteristics["0"].uuid
                      that.setData({ characteristicId: characteristicId })
                      wx.notifyBLECharacteristicValueChange({
                        state: true, // 启用 notify 功能
                        // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
                        deviceId: deviceId,
                        // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
                        serviceId: serviceId,
                        // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
                        characteristicId: characteristicId,
                        success: function (res) {
                          console.log('notifyBLECharacteristicValueChange success', res.errMsg)
                        }
                      })

                      wx.onBLECharacteristicValueChange(function (res) {
                        console.log("characteristic",res)
                        console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
                      })
                    },
                    fail: function (res) {
                      console.log('失败', res)
                      that.setData({
                        connect: "连接失败!"
                      })
                    }
                  })
                }, 1000)
              }
            })
          },
          fail: function (res) {
            console.log('蓝牙连接失败', res)
            that.setData({
              connect: "连接失败!"
            })
          }
        })

      }
    })
  },
  btn_send: function (res) {
    console.log(sendtext)
    senddata(sendtext + "\r\n", deviceId, serviceId, characteristicId)
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },


  //点击事件
  kindToggle: function (e) {
    console.log('按下', e.currentTarget)
    //发送数据
    senddata(PageItems[e.currentTarget.id - 1].down + "\r\n", deviceId, serviceId, characteristicId)
    this.setData({
      message: PageItems[e.currentTarget.id - 1].down,
    })
    //更换图片
    updataPic(this, e.currentTarget.id - 1, 'img/down.png')
  },

  kindtocchend: function (e) {
    console.log('抬起：', e.currentTarget)
    //发送数据
    senddata(PageItems[e.currentTarget.id - 1].up + "\r\n", deviceId, serviceId, characteristicId)
    this.setData({
      message: PageItems[e.currentTarget.id - 1].up,
    })
    //更换图片
    updataPic(this, e.currentTarget.id - 1, 'img/' + e.currentTarget.id + '.png')
  },

  switch2Change: function (e) {
    this.setData({
      display: e.detail.value
    })

  },
  /**
  * 生命周期函数--监听页面卸载
  */
  onUnload: function () {
    wx.closeBLEConnection({
      deviceId: deviceId,
      success: function (res) {
        console.log('断开连接', res)
      }
    })
  },

  bindKeyusername: function (e) {
    sendtext = e.detail.value
    // console.log('inputusername', inputusername)
  }
})

function senddata(str, deviceId, serviceId, characteristicId) {
  var dataview = new DataView(str2ab(str));
  var ints = new Uint8Array(dataview.byteLength);
  for (var i = 0; i < ints.length; i++) {
    ints[i] = dataview.getUint8(i);
  }
  wx.writeBLECharacteristicValue({
    deviceId: deviceId,
    serviceId: serviceId,
    characteristicId: characteristicId,
    // 这里的value是ArrayBuffer类型
    value: ints.buffer,
    success: function (res) {
      console.log('writeBLECharacteristicValue success', res.errMsg)
      console.log('发送：', str)
    }
  })
}

// ArrayBuffer转为字符串，参数为ArrayBuffer对象
function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

// 字符串转为ArrayBuffer对象，参数为字符串
function str2ab(str) {
  var buf = new ArrayBuffer(str.length);
  var bufView = new Uint8Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function updataPic(that, id, pic) {
  PageItems[id].icon = pic

  var pageItems = [];
  var row = [];
  var len = PageItems.length;//重组PageItems  
  len = Math.floor((len + 2) / 3) * 3;
  for (var i = 0; i < len; i++) {
    if ((i + 1) % 3 == 0) {
      row.push(PageItems[i]);
      pageItems.push(row);
      row = [];
      continue;
    }
    else {
      row.push(PageItems[i]);
    }
  }
  that.setData({
    pageItems: pageItems
  })
}

function updata(that, select) {
  that.setData({ select: select })
  //读取内存中的遥控器配置
  wx.getStorage({
    key: 'selectbluetoothconfig' + select,
    success: function (res) {
      var cmd = res.data
      console.log('本地配置数据：', cmd)
      PageItems = cmd
      var pageItems = [];
      var row = [];
      var len = PageItems.length;//重组PageItems  
      len = Math.floor((len + 2) / 3) * 3;
      for (var i = 0; i < len; i++) {
        if ((i + 1) % 3 == 0) {
          row.push(PageItems[i]);
          pageItems.push(row);
          row = [];
          continue;
        }
        else {
          row.push(PageItems[i]);
        }
      }
      that.setData({
        pageItems: pageItems
      })
    },
    fail: function () {
      console.log('无配置数据')
      console.log(PageItems)
      var pageItems = [];
      var row = [];
      var len = PageItems.length;//重组PageItems  
      len = Math.floor((len + 2) / 3) * 3;
      for (var i = 0; i < len; i++) {
        if ((i + 1) % 3 == 0) {
          row.push(PageItems[i]);
          pageItems.push(row);
          row = [];
          continue;
        }
        else {
          row.push(PageItems[i]);
        }
      }
      that.setData({
        pageItems: pageItems
      })
    }
  })
}

function getSelectIndex(that)
{
  //读取选择的遥控器
  wx.getStorage({
    key: 'selectbluetooth',
    success: function (res) {
      var cmd = res.data
      console.log('选择的遥控器：', cmd)
      select = cmd
      updata(that, select)
    },
    fail: function () {
      console.log('无选择遥控器数据！')
      select = 1//没有数据默认为1
      //保存数据，用户选择的遥控器
      wx.setStorageSync('selectbluetooth', select)
      updata(that, select)
    }
  })
}
// pages/device/bluetooth/set/set.js
var select
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:
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
    ,
    select: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //读取选择的遥控器
    wx.getStorage({
      key: 'selectbluetooth',
      success: function (res) {
        var cmd = res.data
        console.log('本地选择数据：', cmd)
        select = cmd
        that.setData({ select: select })
        //读取内存中的遥控器配置
        wx.getStorage({
          key: 'selectbluetoothconfig' + select,
          success: function (res) {
            var cmd = res.data
            console.log('本地配置数据：', cmd)
            that.setData({
              item: cmd
            })
          },
          fail: function () {
            console.log('无配置数据')
            //没有数据保存默认
            wx.setStorageSync('selectbluetoothconfig1', that.data.item)
            wx.setStorageSync('selectbluetoothconfig2', that.data.item)
            wx.setStorageSync('selectbluetoothconfig3', that.data.item)
          }
        })
      },
      fail: function () {
        console.log('无选择数据')
        select = 1//没有数据默认为1
        that.setData({ select: select })
        //保存数据，用户选择的遥控器
        wx.setStorageSync('selectbluetooth', select)

        //读取内存中的遥控器配置
        wx.getStorage({
          key: 'selectbluetoothconfig' + select,
          success: function (res) {
            var cmd = res.data
            console.log('本地数据：', cmd)
            that.setData({
              item: cmd
            })
          },
          fail: function () {
            console.log('无数据')
            //没有数据保存默认
            wx.setStorageSync('selectbluetoothconfig1', that.data.item)
            wx.setStorageSync('selectbluetoothconfig2', that.data.item)
            wx.setStorageSync('selectbluetoothconfig3', that.data.item)
          }
        })
      }
    })


  },

  //下拉刷新
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
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
  btn_select: function () {
    var that = this
    wx.stopPullDownRefresh()
    wx.showActionSheet({
      itemList: ['遥控一', '遥控二', '遥控三'],
      success: function (res) {
        console.log(res)
        if (res.tapIndex!=null)
        {
          var index = res.tapIndex + 1
          that.setData({ select: index })
          console.log(index)
          //保存数据，用户选择的遥控器
          wx.setStorageSync('selectbluetooth', index)
          //读取内存中的遥控器配置
          wx.getStorage({
            key: 'selectbluetoothconfig' + index,
            success: function (res) {
              var cmd = res.data
              console.log('本地数据：', cmd)
              that.setData({
                item: cmd
              })
            }
          })
        }
        else
        {
          that.setData({ select: that.data.select })
        }
      }
    })
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

  },

  bindname: function (e) {
    console.log('name', e)
    var id = e.currentTarget.id
    var value = e.detail.value
    this.data.item[id - 1].name = value
    //保存数据
    wx.setStorageSync('selectbluetoothconfig' + this.data.select, this.data.item)
  },
  bindup: function (e) {

    var id = e.currentTarget.id
    var value = e.detail.value
    this.data.item[id - 1].up = value
    //保存数据
    wx.setStorageSync('selectbluetoothconfig' + this.data.select, this.data.item)
    console.log('up', this.data.item)
  },
  binddown: function (e) {
    console.log('down', e)
    var id = e.currentTarget.id
    var value = e.detail.value
    this.data.item[id - 1].down = value
    //保存数据
    wx.setStorageSync('selectbluetoothconfig' + this.data.select, this.data.item)
  }

})
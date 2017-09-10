var app = getApp()
var myfunction = require('../../../../utils/myfunction');
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
        name: '左上',
        icon: 'img/1.png',
        up: 'TZ',
        down: 'ZS',
        show: true
      },
      {
        wid: 2,
        name: '前进',
        icon: 'img/2.png',
        up: 'TZ',
        down: 'QJ',
        show: true
      },
      {
        wid: 3,
        name: '右上',
        icon: 'img/3.png',
        up: 'TZ',
        down: 'YS',
        show: true
      },
      {
        wid: 4,
        name: '左移',
        icon: 'img/4.png',
        up: 'TZ',
        down: 'ZY',
        show: true
      },
      {
        wid: 5,
        name: '停止',
        icon: 'img/5.png',
        up: 'TZ',
        down: 'TZ',
        show: true
      },
      {
        wid: 6,
        name: '右移',
        icon: 'img/6.png',
        up: 'TZ',
        down: 'YY',
        show: true
      },
      {
        wid: 7,
        name: '左下',
        icon: 'img/7.png',
        up: 'TZ',
        down: 'ZX',
        show: true
      },
      {
        wid: 8,
        name: '后退',
        icon: 'img/8.png',
        up: 'TZ',
        down: 'HT',
        show: true
      },
      {
        wid: 9,
        name: '右下',
        icon: 'img/9.png',
        up: 'TZ',
        down: 'YX',
        show: true
      }
      ,
      {
        wid: 10,
        name: '左转',
        icon: 'img/10.png',
        up: 'TZ',
        down: 'ZZ',
        show: true
      },
      {
        wid: 11,
        name: '演示',
        icon: 'img/11.png',
        up: 'TZ',
        down: 'YS',
        show: true
      },
      {
        wid: 12,
        name: '右转',
        icon: 'img/12.png',
        up: 'TZ',
        down: 'YZ',
        show: true
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
        readconfig(that, select)
      },
      fail: function () {
        console.log('没有选择数据')
        select = 1//没有数据默认为1
        that.setData({ select: select })
        //保存数据，用户选择的遥控器
        wx.setStorageSync('selectbluetooth', select)
        //读取内存中的遥控器配置
        readconfig(that, select)
      }
    })
  },
  // 页面卸载
  onUnload: function () {
    console.log('onUnload')
  if(app.user) {
       // 保存数据到服务器
        myfunction.request(app.api_host+'bluetooth/config.php?type=set&num='+select+'&userid=' + app.user.username,
        function (res) {//success
          console.log('success:',res)
          wx.showToast({
            title: '已上传到服务器！',
            icon: 'success',
            duration: 1000
          })
        },
        function (res) {//fail
          console.log('fail:',res)
        },{"str":JSON.stringify(this.data.item)});
      }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
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
        if (res.tapIndex != null) {
          var index = res.tapIndex + 1
          that.setData({ select: index })
          console.log(index)
          //保存数据，用户选择的遥控器
          wx.setStorageSync('selectbluetooth', index)
          //读取内存中的遥控器配置
          readconfig(that, select)
        }
        else {
          that.setData({ select: that.data.select })
        }
      }
    })
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

//读取配置文件
function readconfig(that, select) {
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
      wx.setStorageSync('selectbluetoothconfig' + select, that.data.item)
    }
  })
}

//switch.js 
//获取应用实例 
var app = getApp()
var PageItems
var len

var red = 100
var green = 100
var blue = 100
var myfunction = require('../../../utils/myfunction');
Page({
  data: {
    pageItems: [],
  },
  //事件处理函数 
  onLoad: function () {
    var that = this
    load(that)
  },

  onShareAppMessage: function () {
    return {
      title: 'www.smtvoice.com',
      path: 'pages/device/switch/switch'
    }
  }
  ,
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this
    wx.stopPullDownRefresh()
    load(that);
  },

  onShow: function () {
    //在页面展示之后先获取一次数据
    console.log('页面展示')
  },

  //点击事件
  kindToggle: function (e) {
    var that = this
    if (e.currentTarget.id) {
      console.log('点击事件', e.currentTarget.id)
      var cmd = ""
      if (PageItems[e.currentTarget.id - 1].icon == 'img/1.png') {
        // PageItems[e.currentTarget.id - 1].icon = 'img/3.png'
        cmd = PageItems[e.currentTarget.id - 1].closecmd
      }
      else {
        // PageItems[e.currentTarget.id - 1].icon = 'img/1.png'
        cmd = PageItems[e.currentTarget.id - 1].opencmd
      }
      wx.showToast({
        title: '通信中...',
        icon: 'loading',
        duration: 10000
      })
      myfunction.request('https://smtvoice.com/device.php? device=switch&type=set&id=' + PageItems[e.currentTarget.id - 1].id + '&userid=' + app.user.username + '&password=' + app.user.password + '&cmd=' + cmd, function (res) {
        console.log("控制开关后返回:", res);

        wx.showToast({
          title: res.data.return,
          icon: 'info',
          duration: 1000
        })
        //  wx.hideToast()
        if (res.data.return != '设备响应超时！' && res.data.return != '设备不在线！') {
          if (PageItems[e.currentTarget.id - 1].icon == 'img/1.png') {
            PageItems[e.currentTarget.id - 1].icon = 'img/3.png'
          }
          else {
            PageItems[e.currentTarget.id - 1].icon = 'img/1.png'
          }
        }
        updata(that)
      });
    }
  },

  //红色值变化
  sliderChange: function (e) {
    var that = this
    if (e.target.id == "c1")
      red = e.detail.value;
    else
      if (e.target.id == "c2")
        green = e.detail.value;
      else
        if (e.target.id == "c3")
          blue = e.detail.value;
    console.log(e)
    var color = ((red << 16) | (green << 8) | blue)
    this.setData({
      color: color
    });
    console.log('https://smtvoice.com/device.php? device=switch&type=set&id=8&userid=' + app.user.username + '&password=' + app.user.password + '&cmd=' + color)
    myfunction.request('https://smtvoice.com/device.php? device=switch&type=set&id=8&userid=' + app.user.username + '&password=' + app.user.password + '&cmd=' + color, function (res) {
      console.log("控制开关后返回:", res);
    });
  }
})

function load(that) {
  if (app.user == null) {
    //更新数据
    wx.showToast({
      title: '请先登录',
      icon: 'info',
      duration: 2000
    })
  }
  else {
    myfunction.request('https://smtvoice.com/device.php?device=switch&type=getlist&userid=' + app.user.username + '&password=' + app.user.password, function (res) {
      PageItems = res.data.list;
      console.log('PageItems', PageItems)
      len = res.data.num; //重组PageItems 
      len = Math.floor((len + 2) / 3) * 3; //转化为3的倍数，floor函数是去掉小数点后面的数据直接取整
      console.log("len:", len);
      updata(that)
    });
  }
}

function updata(that) {
  var pageItems = [];
  var row = [];
  //三个一组进行重新分割
  for (var i = 0; i < len; i++) {
    if ((i + 1) % 3 == 0) {
      row.push(PageItems[i]);
      pageItems.push(row);
      row = [];
      continue;
    } else {
      row.push(PageItems[i]);
    }
  }
  that.setData({
    pageItems: pageItems
  });
}

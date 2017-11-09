
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
      title: 'www.geek-iot.com',
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
      console.log('显示通信中');
      wx.showToast({
        title: '通信中...',
        icon: 'loading',
        duration: 5000
      })
      var url = app.api_host + 'wxin/device.php?device=switch&type=set&id=' + PageItems[e.currentTarget.id - 1].id + '&userid=' + app.user.userid + '&password=' + app.user.password + '&cmd=' + cmd;
      myfunction.request(url, function (res) {
        console.log("控制开关后返回:", res);
        wx.showToast({
          title: res.data.return,
          icon: 'success',
          duration: 1000
        })
        console.log('res.data.return:', res.data.return);
        if (res.data.resault == 'success') {
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
    console.log(app.api_host + 'wxin/device.php? device=switch&type=set&id=8&userid=' + app.user.userid + '&password=' + app.user.password + '&cmd=' + color)
    myfunction.request(app.api_host + 'wxin/device.php? device=switch&type=set&id=8&userid=' + app.user.userid + '&password=' + app.user.password + '&cmd=' + color, function (res) {
      console.log("控制开关后返回:", res);
    });
  }
})

function load(that) {
  if (app.user == null) {
    //更新数据
    wx.showModal({
      title: '极客物联网',
      content: '登陆后才能查看，请您先登录!',
      success: function (res) {
        if (res.confirm) {
          // 确定,跳转到登陆
          wx.redirectTo({ url: '../../user/login/login' })
        } else if (res.cancel) {
          // 取消,返回
          wx.navigateBack({})
        }
      }
    })
  }
  else {
    myfunction.request(app.api_host + 'wxin/device.php?device=switch&type=getlist&userid=' + app.user.userid + '&password=' + app.user.password, function (res) {
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

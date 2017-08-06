var app = getApp()
var myfunction = require('../../../utils/myfunction');
Page({
  data: {
    list: []
  },

  onShareAppMessage: function () {
    return {
      title: 'www.smtvoice.com',
      path: 'pages/device/device'
    }
  }
  ,
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this
    wx.stopPullDownRefresh()
    load(that);
  },

  onLoad: function () {
    var that = this
    load(that);
  }
})


//加载数据
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
    myfunction.request('https://smtvoice.com/device.php?device=sensor&type=getlist&sensor=gps&userid=' + app.user.username + '&password=' + app.user.password, function (res) {
      var jsonArray = [];
      for (var i = 0; i < res.data.num; i++) {
        var str = res.data.list[i].data
        var list = str.split(",")//以（，）号分割字符串
        var json = new Object();
        json.latitude = list[0];
        json.longitude = list[1];

        var jrr = [];
        jrr.push(json);
        var json1 = new Object();
        json1.markers = jrr;
        json1.latitude = list[0];
        json1.longitude = list[1];
        json1.name = res.data.list[i].name;
        json1.pic = res.data.list[i].pic;
        json1.heat = res.data.list[i].heat;
        json1.id = res.data.list[i].id;
        jsonArray.push(json1);
      }
      console.log('jsonArray', jsonArray)
      that.setData({
        list: jsonArray
      });

    });
  }
}

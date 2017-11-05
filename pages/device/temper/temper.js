var app = getApp();
var myfunction = require('../../../utils/myfunction');
Page({
 data:{
list:[]
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
    myfunction.request(app.api_host + 'wxin/device.php?device=sensor&type=getlist&sensor=temperature&userid=' + app.user.userid + '&password=' + app.user.password, function (res) {
      var list = res.data.list;
     
      console.log('temperature', list)
      that.setData({
        list: list
      });

    });
  }
}


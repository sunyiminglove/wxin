var app = getApp();
var myfunction = require('../../../utils/myfunction');
Page({
 data:{
list:[]
 },
  onShareAppMessage: function () {
    return {
      title: 'www.smtvoice.com',
      path: 'pages/device/pm/pm'
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
    myfunction.request('https://smtvoice.com/device.php?device=sensor&type=getlist&sensor=pm2.5&userid=' + app.user.username + '&password=' + app.user.password, function (res) {
      var list = res.data.list;
     
      console.log('temperature', list)
      that.setData({
        list: list
      });

    });
  }
}


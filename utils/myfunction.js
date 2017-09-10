//向服务器发送get请求
//url 请求地址及参数
//Callback 回调函数
function request(url, success,error,data='') {
  console.log('url：', url)
  wx.request({
    url: url,
    data:data,
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      console.log('request函数success：', res)
      success(res);
    },
    fail:function (res) {
      console.log('request函数fail：', res)
      error(res);
    }
  })
}

module.exports = {
  request: request
}
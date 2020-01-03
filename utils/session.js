const app = getApp();

const isExpire = () => {
  wx.request({
    header: { "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId") },
    url: app.globalData.baseUrl + 'xcx/isExpire',
    success: function (r) {
      console.log(r)
      if(!r.data.success){
        setSession();
      }
    }
  })
}

const setSession = () => {
  // 登录
  wx.login({
    success: res => {
      if (res.code) {
        wx.request({
          url: app.globalData.baseUrl + 'xcx/getSession',
          data: {
            code: res.code
          },
          success: function (r) {
            console.log(r)
            wx.setStorageSync("sessionId", r.data.resObject)
          }
        })
      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
    }
  })
}

module.exports = {
  isExpire, setSession
}

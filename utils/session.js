const app = getApp();

const isExpire = () => {
  wx.request({
    header: { "Cookie": "JSESSIONID=" + wx.getStorageSync("sessionId") },
    url: app.globalData.baseUrl + 'xcx/isExpire',
    success: function (r) {
      if(r.data.code=="10000"){
        return false;
      }else{
        return true;
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
          url: this.globalData.baseUrl + 'xcx/getSession',
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

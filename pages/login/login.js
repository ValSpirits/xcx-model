const app = getApp();
const { $Toast } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    password:'',
    loading: false,
    alias:'登录'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  onPullDownRefresh: function () {

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

  login: function(){
    var that = this;
    this.setData({
      loading:true,
      alias: '登录中'
    })
    wx.request({
      url: app.globalData.baseUrl + 'user/login',
      method: 'post',
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
          name:this.data.name,
          password:this.data.password,
      },
      success(res){
          if(res.data.code == 0){
            wx.reLaunch({
              url: '/pages/phone/phone'
            })
          }else{
            that.setData({
              loading: false,
              alias: '登录'
            })
            $Toast({
              content: res.data.msg,
              type: 'warning'
            });
          }
      },
      fail(res){
        this.setData({
          loading: false,
          alias: '登录'
        })
      }


    })
  },

  bindNameInput: function (e) {
    this.setData({
      name: e.detail.detail.value
    })
  },
  bindPasswordInput: function (e) {
    this.setData({
      password: e.detail.detail.value
    })
  },

})
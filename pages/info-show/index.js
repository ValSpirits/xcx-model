const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    network:{
      
    },
    checked: false,
    visible1:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // const eventChannel = this.getOpenerEventChannel()
    // // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    // eventChannel.on('acceptDataFromOpenerPage', function (data) {
    //   // that.setData({
    //   //   orderno: data.data.orderno
    //   // })
    //   // that.countTargetTime();
    //   that.getOrder(options.orderno)
    // })
    console.log(options)
    that.getOrder(options.orderno)
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

  countTargetTime() {
    let date = this.data.network.createTime.substring(0, 19);
    date = date.replace(/-/g, '/');
    let timestamp = new Date(date).getTime();
    let now = new Date().getTime();
    let targetTime1 = Math.ceil((timestamp - now + 1800000) / 1000);
    if (targetTime1 <= 0) {
      wx.reLaunch({
        url: '/pages/phone/phone',
      })
      return;
    }
    var m = Math.floor(targetTime1 / 60) < 10 ? "0" + Math.floor(targetTime1 / 60) : Math.floor(targetTime1 / 60);
    var s = targetTime1 % 60 < 10 ? "0" + targetTime1 % 60 : targetTime1 % 60;
    let targetTime = m + ":" + s

    this.setData({
      targetTime: targetTime
    })
    var that = this;
    setTimeout(function () {
      that.countTargetTime();
    }, 600)
  },

  handleAnimalChange({ detail = {} }) {
    this.setData({
      checked: detail.current
    });
  },
  handleOpen1() {
    this.setData({
      visible1: true
    });
  },

  handleClose1(){
    this.setData({
      visible1: false
    });
  },

  getOrder(orderno){
    var that =this;
    wx.request({
      url: app.globalData.baseUrl + 'network/getOrder',
      data: {
        orderno: orderno,
      },
      success(res) {
        if (res.data.responseCode == 10000) {
          that.setData({
            network: res.data.resObject
          })
          if (res.data.resObject.payType == 0) {
            that.countTargetTime();
          }
        }
      },
      fail(res2) {

      }
    })
  },

  updateOrder(){
    var that =this;
    wx.navigateTo({
      url: '/pages/detail/detail',
      success: function (n) {
        // 通过eventChannel向被打开页面传送数据
        n.eventChannel.emit('acceptDataFromOpenerPage', { data: that.data.network })
      }
    })
  }
})
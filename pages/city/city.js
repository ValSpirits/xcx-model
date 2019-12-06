const app = getApp();

// pages/city/city.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cities: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
      wx.request({
        url: app.globalData.baseUrl +　'area/getCites',
        success(res){
          that.loadCity(res.data.resList);
        }
      })
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

  loadCity(cities){
    let storeCity = new Array(26);
    const words = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
    words.forEach((item, index) => {
      storeCity[index] = {
        key: item,
        list: []
      }
    })
    console.log(storeCity)
      cities.forEach((item) => {
        if (item.szm &&　item.szm != ''){
          let firstName = item.szm.substring(0, 1);
          let index = words.indexOf(firstName);
          storeCity[index].list.push({
            name: item.name,
            key: item.localNet
          });
        } 
    })
    this.setData({
      cities: storeCity
    })
  },

  onChange(event) {
    console.log(event.detail, 'click right menu callback data')
  },

  choose(e){

    var pages = getCurrentPages()    //获取加载的页面( 页面栈 )
    var currentPage = pages[pages.length - 1]  // 获取当前页面
    var prevPage = pages[pages.length - 2]    //获取上一个页面

　　prevPage.setData({
      area: e.currentTarget.dataset.city
　　})

    wx.navigateBack({
        delta: 1
    })

  }
})
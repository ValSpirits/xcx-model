const app = getApp();
const { $Toast } = require('../../dist/base/index');

Page({
  /**
   * 页面的初始数据
   */
  data: {
      network:{
      },
      
      targetTime: 0,
      idCardFront:'',
      idCardBack:'',
      facePic:'',
      url1: app.globalData.baseUrl + "wXOrdersAction?requestType=getPic&picName=idCardFront&cardRemakeBean.order_id=",
      url2: app.globalData.baseUrl + "wXOrdersAction?requestType=getPic&picName=idCardBack&cardRemakeBean.order_id=",
      url3: app.globalData.baseUrl + "wXOrdersAction?requestType=getPic&picName=facePic&cardRemakeBean.order_id=",
      isShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      console.log(data.data)
      that.setData({
        network: data.data,
      })
      if(data.data.payType == 0){
        that.countTargetTime();
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

  handleClick(){

    if(this.data.network.orderStatus == 7 && !this.data.idCardFront){
      $Toast({
        content: '请上传身份证人像面！',
        type: 'warning'
      });
      return;
    }
    if (this.data.network.orderStatus == 7 && !this.data.idCardBack){
      $Toast({
        content: '请上传身份证国徽面！',
        type: 'warning'
      });
      return;
    }
    if (this.data.network.orderStatus == 7 && !this.data.facePic){
      $Toast({
        content: '请上传正面免冠照！',
        type: 'warning'
      });
      return;
    }

    this.uploadPicture("idCardFront");

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

  chooseImage(e){
    var that = this;
    const picture = e.currentTarget.dataset.picture;
    console.log(e.currentTarget.dataset.picture)

    wx.chooseImage({
      count:1,
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        console.log(res)
        if(picture=="idCardFront"){
          that.setData({
            idCardFront: res.tempFilePaths
          })
        } else if(picture == "idCardBack"){
          that.setData({
            idCardBack: res.tempFilePaths
          })
        }else{
          that.setData({
            facePic: res.tempFilePaths
          })
        }

      }
    })
  },


  uploadPicture: function (picture){
    var that = this;
    that.showLoad();
    if (picture == "idCardFront" ? that.data.idCardFront : picture == "idCardBack" ? that.data.idCardBack : that.data.facePic){
            wx.uploadFile({
              url: app.globalData.baseUrl + 'network/uploadPic',
              filePath: picture == "idCardFront" ? that.data.idCardFront[0] : picture == "idCardBack" ? that.data.idCardBack[0] : that.data.facePic[0],
              name: 'face',
              formData: {
                picture: picture,
                orderno: that.data.network.orderno
              },
              success: function (res3) {
                const r3 = JSON.parse(res3.data)
                if (r3.responseCode == "10000") {
                  if (picture == "idCardFront"){
                    that.uploadPicture("idCardBack")
                  } else if (picture == "idCardBack"){
                    that.uploadPicture("facePic")
                  }else{
                    that.hideLoad();
                    wx.reLaunch({
                      url: '/pages/info-show/index?orderno=' + that.data.network.orderno,
                      success: function (n) {

                      }
                    })
                  }
                }else{
                  that.hideLoad();
                  $Toast({
                    content: r3.responseMsg,
                    type: 'warning'
                  });
                  return;
                }
              },
              fail: function (f1) {
                that.hideLoad();
                $Toast({
                  content: '上传照片失败！',
                  type: 'warning'
                });
                return;
              }
            })
    }else{
      if (picture == "idCardFront"){
        that.uploadPicture("idCardBack")
      } else if (picture == "idCardBack" ){
        that.uploadPicture("facePic")
      }else{
        that.hideLoad();
        wx.reLaunch({
          url: '/pages/info-show/index?orderno=' + that.data.network.orderno,
          success: function (n) {

          }
        })
      }
    }
  },

  showLoad() {
    this.setData({
      isShow: true
    })
    $Toast({
      content: '加载中',
      type: 'loading',
      duration: 0,
      hide: false
    });
  },

  hideLoad() {
    $Toast.hide();
    this.setData({
      isShow: false
    })
  }

})
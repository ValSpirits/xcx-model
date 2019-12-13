const app = getApp();
const { $Toast } = require('../../dist/base/index');

Page({
  /**
   * 页面的初始数据
   */
  data: {
      network:{
          orderno:"8888888"
      },
      
      targetTime: 0,
      idCardFront:'',
      idCardBack:'',
      facePic:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // const eventChannel = this.getOpenerEventChannel()
    // // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    // eventChannel.on('acceptDataFromOpenerPage', function (data) {
    //   that.setData({
    //     network: data.data
    //   })
    //   that.countTargetTime();
    // })
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

    if(!this.data.idCardFront){
      $Toast({
        content: '请上传身份证人像面！',
        type: 'warning'
      });
      return;
    }
    if(!this.data.idCardBack){
      $Toast({
        content: '请上传身份证国徽面！',
        type: 'warning'
      });
      return;
    }
    if(!this.data.facePic){
      $Toast({
        content: '请上传正面免冠照！',
        type: 'warning'
      });
      return;
    }

    if(this.uploadPicture()){
    wx.navigateTo({
      url: '/pages/info-show/index',
      success: function (n) {
        // 通过eventChannel向被打开页面传送数据
        n.eventChannel.emit('acceptDataFromOpenerPage', { data: network })
      }
    })
    }
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


  uploadPicture: function (tempFilePath,orderno,picture){
    var that = this;
    wx.uploadFile({
      url: app.globalData.baseUrl + 'network/uploadPic',
      filePath: that.data.idCardFront[0],
      name: 'face',
      formData: {
        picture:"idCardFront",
        orderno: that.data.network.orderno
      },
      success: function(res1) {
        if(res1.data.responseCode == "10000"){
          wx.uploadFile({
            url: app.globalData.baseUrl + 'network/uploadPic',
            filePath: that.data.idCardBack[0],
            name: 'face',
            formData: {
              picture: "idCardBack", 
              orderno: that.data.network.orderno
             },
            success: function (res2) {
              if (res2.data.responseCode == "10000") {
                wx.uploadFile({
                  url: app.globalData.baseUrl + 'network/uploadPic',
                  filePath: tempFilePath[0],
                  name: 'face',
                  formData: {
                          picture: "facePic",
                          orderno: that.data.network.orderno 
                  },
                  success: function (res3) {
                    if (res3.data.responseCode == "10000") {
                        return true;
                    }
                  },
                  fail: function (f1) {
                    $Toast({
                      content: '上传正面免冠照失败！',
                      type: 'warning'
                    });
                  }
                })
              }
            },
            fail: function (f2) {
              $Toast({
                content: '上传身份证国徽面失败！',
                type: 'warning'
              });
            }
          })
        }
      },
      fail: function(f3) {
        $Toast({
          content: '上传身份证人像面失败！',
          type: 'warning'
        });
      }
    })
    return false;
  }

})
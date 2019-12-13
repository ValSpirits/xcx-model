var model = require('../model/model.js')
const { $Toast } = require('../../dist/base/index');

var show = false;
var item = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {
      show: show,
        orderno:'',
        ownerName:'',
        cardNumber:'',
        linkPhone:'',
        address:'',
        detailAddress:'',
        receiver:'',
        createTime:'',
        phone:'',
        cardAddress:'',
      targetTime: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      that.setData({
         orderno: data.data.orderno,
         createTime:data.data.createTime,
         phone:data.data.phone
      })
      that.countTargetTime();
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    var that = this;
    //请求数据
    model.updateAreaData(that, 0, e);
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
    this.setData({
      clearTimer: true
    })
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

  handleClick() {
    console.log(this.data.ownerName)
    if (!this.data.ownerName) {
      $Toast({
        content: '请填写机主姓名！',
        type: 'warning'
      });
      return;
    }
    if (!this.data.cardNumber) {
      $Toast({
        content: '请填写身份证号码！',
        type: 'warning'
      });
      return;
    }
    if (!this.data.caedAddress) {
      $Toast({
        content: '请填写身份证地址！',
        type: 'warning'
      });
      return;
    }
    if (!this.data.receiver) {
      $Toast({
        content: '请填写联系人！',
        type: 'warning'
      });
      return;
    }
    if (!this.data.linkPhone) {
      $Toast({
        content: '请填写联系电话！',
        type: 'warning'
      });
      return;
    }
    if (!this.data.city) {
      $Toast({
        content: '请选择地址！',
        type: 'warning'
      });
      return;
    }
    if (!this.data.detailAddress) {
      $Toast({
        content: '请填写详细地址！',
        type: 'warning'
      });
      return;
    }

    const network = {
      orderno: this.data.orderno,
      ownerName: this.data.ownerName,
      cardNumber: this.data.cardNumber,
      linkPhone: this.data.linkPhone,
      address: this.data.address,
      detailAddress: this.data.detailAddress,
      receiver: this.data.receiver,
      createTime: this.data.createTime,
      phone: this.data.phone,
      cardAddress: this.data.cardAddress,
      address: this.data.province + this.data.city + this.data.county, 
    }

    wx.navigateTo({
      url: '/pages/cert-pic/index',
      success: function (n) {
        // 通过eventChannel向被打开页面传送数据
        n.eventChannel.emit('acceptDataFromOpenerPage', { data: network })
      }
    })
  },



  //隐藏picker-view
  hiddenFloatView: function (e) {
    console.log("id = " + e.target.dataset.id)
    model.animationEvents(this, 200, false, 400);
    //点击确定按钮更新数据(id=444是背后透明蒙版 id=555是取消按钮)
    if (e.target.dataset.id == 666) {
      this.updateShowData()
    }
  },
  //滑动事件
  bindChange: function (e) {
    model.updateAreaData(this, 1, e);

  },
  //点击选择城市按钮显示picker-view
  translate: function (e) {
    console.log(321323)
    model.animationEvents(this, 0, true, 400);
  },

  //更新顶部展示的数据
  updateShowData: function (e) {
    item = this.data.item;
    this.setData({
      province: item.provinces[item.value[0]].name,
      city: item.citys[item.value[1]].name,
      county: item.countys[item.value[2]].name
    });
  },

  countTargetTime(){
    let date = this.data.createTime.substring(0, 19);
    date = date.replace(/-/g, '/');
    let timestamp = new Date(date).getTime();
    let now = new Date().getTime();
    let targetTime1 = Math.ceil((timestamp - now + 1800000)/1000);
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



  onInput(e) {
    this.setData({
      ownerName: e.detail.detail.value
    })
    console.log(this.data.ownerName)
  },
  caInput(e) {
    this.setData({
      caedAddress: e.detail.detail.value
    })
  },
  cnInput(e) {
    this.setData({
      cardNumber: e.detail.detail.value
    })
  },
  receiverInput(e) {
    this.setData({
      receiver: e.detail.detail.value
    })
  },
  daInput(e) {
    this.setData({
      detailAddress: e.detail.detail.value
    })
  },
  lpInput(e) {
    this.setData({
      linkPhone: e.detail.detail.value
    })
  }

})


const util = require('../../utils/util.js')

Page({
  data: {
    value5: "",
    networkIndex: 0,
    area: {
      name: '不限',
      key:"" 
    },
    visible: false,
    actions: [
      {
        name: '不限',
        key: ''
      },
      {
        name: '电信',
        key: 'CTC'
      },
      {
        name: '联通',
        key: 'GSM'
      }
    ]
  },
  onLoad: function () {
    this.setData({

    });

  },

    toCity(e) {
    wx.navigateTo({
      url: '/pages/city/city',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        // res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
      }
    })
  },

      toOfr(e){
        wx.navigateTo({
          url: '/pages/ofr/ofr',
          success: function (res) {
            // 通过eventChannel向被打开页面传送数据
            // res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
          }
        })
      },

  handleClick(){
    wx.navigateTo({
      url: '/pages/detail/detail',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        // res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
      }
    })
  },

  handleOpen() {
    this.setData({
      visible: true
    });
  },

  handleCancel() {
    this.setData({
      visible: false
    });
  },

  handleClickItem(e) {
    this.setData({
      networkIndex: e.detail.index,
      visible: false
    });
  },
})
const app = getApp();
const { $Toast } = require('../../dist/base/index');
const session = require('../../utils/session.js')

Page({
  data: {
    phone: "",
    networkIndex: 0,
    area: {
      name: '不限',
      key: ""
    },
    visible: false,
    actions: [{
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
    ],
    ofr: {},
    numbers: [],
    allNumber:[],
    numberIndex:null,
    loading:false,
    isShow:false
  },
  onLoad: function() {
    // let that = this;
    // wx.request({
    //   url: app.globalData.baseUrl + 'crm/getCRMNumber',
    //   success(res) {
    //     that.setData({
    //       allNumber: res.data.resList
    //     })
    //     that.random();
    //   }
    // })
    this.searchNumber();
  },
  
  onShow: function(){
    session.isExpire();
  },

  toCity(e) {
    wx.navigateTo({
      url: '/pages/city/city',
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        // res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
      }
    })
  },

  toOfr(e) {
    wx.navigateTo({
      url: '/pages/ofr/ofr',
      success: function(res) {
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

  handleClickItem(e) {
    this.setData({
      networkIndex: e.detail.index,
      visible: false
    });
  },


  random(){
    const allNumber = this.data.allNumber;
    const numbers=[];
    for (let i = 0; i < (8 > allNumber.length ? allNumber.length:8);i++){
      // 获取随机数
      
      var rand = Math.floor(Math.random() * allNumber.length);
      // 随机从数组中取出某值（不会改变原数组）
      // var data = allNumber.slice(rand, 1)[0];

      // 随机从数组中取出某值（会改变原数组）
      var data = allNumber.splice(rand, 1)[0];
      numbers.push(data);
    }

    var that =this;
    that.setData({
      numbers: numbers
    })
  },

  changeNumber(e){
    this.setData({
      numberIndex: e.currentTarget.dataset.index
    })
    console.log(this.data.numbers[this.data.numberIndex])
  },
  searchNumber(){
    let that = this;
    this.setData({
      numbers:[],
      loading: true
    })
    wx.request({
      url: app.globalData.baseUrl + 'crm/getCRMNumber',
      data:{
          number:this.data.phone,
          localNet:this.data.area.key,
          teleType: this.data.actions[this.data.networkIndex].key
      },
      success(res) {
        that.setData({
          allNumber: res.data.resList
        })
        that.random();
      },
      complete(r){
        that.setData({
          loading: false
        })
      }
    })
  },

  numberInput(e){
    this.setData({
      phone: e.detail.detail.value
    })
  },

  handleClick(e){
    if(!!!this.data.ofr.ofrId){
      $Toast({
        content: '请选择套餐！',
        type: 'warning'
      });
      return;
    }
    if(this.data.numberIndex==null){
      $Toast({
        content: '请选择号码！',
        type: 'warning'
      });
      return;
    }


    //缓存session保证后台有openid
    session.isExpire();

    const number = this.data.numbers[this.data.numberIndex];
    var that =this;
    that.showLoad();
    wx.request({
      url: app.globalData.baseUrl + 'network/createOrder',
      header:{"Cookie": "JSESSIONID="+wx.getStorageSync("sessionId")},
      data: {
        phone: number.number,
        networkType: number.telType,
        cost: number.amount,
        areaId: number.localNet,
        mealId: this.data.ofr.ofrId
      },
      success(res) {
        that.hideLoad();
        if (res.data.responseCode == 10000){
          wx.navigateTo({
            url: '/pages/detail/detail',
            success: function (n) {
              // 通过eventChannel向被打开页面传送数据
              n.eventChannel.emit('acceptDataFromOpenerPage', { data: res.data.resObject })
            }
          })
        }else{
          $Toast({
            content: res.data.responseMsg,
            type: 'error'
          });
        }
      },
      fail(f){
        that.hideLoad();
        $Toast({
          content: '系统繁忙，请稍后重试！',
          type: 'error'
        });
      }
    })
  },

  showLoad(){
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

  hideLoad(){
    $Toast.hide();
    this.setData({
      isShow: false
    })
  }
})
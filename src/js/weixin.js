//checkCode();
var state = getQueryString('state');
var component_appid = '';
var scope = 'snsapi_userinfo';
if(state){
    var Astate = state.split(',');
    component_appid = Astate[0];
    scope = Astate[1];
}
//alert(window.location.href);
var redirect_uri = window.location.href.replace(/&appid=[^&]*/gi,"").replace(/&state=[^&]*/gi,"").replace(/&code=[^&]*/gi,"").replace(/&&&/gi,"").replace(/&&/gi,"");
//alert(redirect_uri);
var shareLink = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+getQueryString('appid')+'&redirect_uri='+encodeURIComponent(redirect_uri)+'&response_type=code&scope='+scope+'&state='+state+'&component_appid='+component_appid+'#wechat_redirect';
var shareData = {
    imgUrl: window.location.href.split('/dist/')[0]+'/images/share.jpg', // 分享图标
    title:$('title').html()+'',   // 分享标题
    desc: $('meta[name=description]').attr('content')+'',   // 分享内容                                                                           // 分享描述
    link: shareLink,   // 分享链接
    type: '',
    dataUrl: '',
    success: function (res) {
        //openToast('分享成功',3000);
    },
    cancel: function (res) {

    }
};
function checkCode(){
    var code = getQueryString('code');
    if(!code){
        openToast('微信授权失败，请重新进入',2000);
        window.location.href = shareLink;
        return false;
    }
}
var WXENV = new (function (ticketUrl) {
    var self = this;
    self.ticketUrl = ticketUrl;
    self.nonceStr = 'youfankeji';
    self.timestamp = new Date().getTime()+'';
    self.ready = false;
    self.readyHandlers = [];
    self.shareData = shareData;
    self.debug = false;
    self.jsApiList =
        [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'stopRecord',
            'onVoiceRecordEnd',
            'playVoice',
            'onVoicePlayEnd',
            'pauseVoice',
            'stopVoice',
            'uploadVoice',
            'downloadVoice',
            'hideOptionMenu',
            'showOptionMenu',
            'hideMenuItems',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'closeWindow',
            'scanQRCode',
            'chooseImage',
            'previewImage',
            'uploadImage'
        ];
    self._updateShareData = function (data) {
        wx.onMenuShareTimeline({
            title: data.desc,
            link: data.link,
            imgUrl: data.imgUrl,
            success: data.success,
            cancel: data.cancel
        });

        wx.onMenuShareAppMessage({
            title: data.title,
            desc: data.desc,
            link: data.link,
            imgUrl: data.imgUrl,
            type: data.type,
            dataUrl: data.dataUrl,
            success: data.success,
            cancel: data.cancel
        });

        wx.onMenuShareQQ({
            title: data.title,
            desc: data.desc,
            link: data.link,
            imgUrl: data.imgUrl,
            success: data.success,
            cancel: data.cancel
        });

        wx.onMenuShareWeibo({
            title: data.title,
            desc: data.desc,
            link: data.link,
            imgUrl: data.imgUrl,
            success: data.success,
            cancel: data.cancel
        });
        //alert(JSON.stringify(data));
    };
    var js = document.getElementsByTagName('script')[0];
    self.onEnvReady = function () {
        var url = self.ticketUrl+'?appid='+getQueryString('appid')+'&nonceStr='+self.nonceStr+'&timestamp='+self.timestamp+'&url='+encodeURIComponent(window.location.href.split('#')[0]);
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            timeout: 10000,
            success: function(data){
              //alert(JSON.stringify(data));
              if(data.status == 1){
                var data = data.data;
                var config = {
                    debug: self.debug,
                    appId: data.appId,
                    timestamp: data.timestamp,
                    nonceStr: data.nonceStr,
                    signature: data.signature,
                    jsApiList: self.jsApiList
                };
                //alert('config>>>>'+JSON.stringify(config));
                wx.config(config);
              }else{
                openToast('JS SDK 授权失败',2000);
              }
            },
            error: function(xhr, type){
                //alert('获取coonfig失败');
            }
        })
    };
    var wxjs = document.createElement('script');
    wxjs.addEventListener('load', function () {
        wx.ready(function () {
            //alert('js ready is ok');
            self._updateShareData(shareData);
            // wx.hideMenuItems({
            //     menuList: ['menuItem:profile', 'menuItem:addContact']
            // });
        });
        self.onEnvReady();
    });
    wxjs.src = 'http://res.wx.qq.com/open/js/jweixin-1.0.0.js';
    js.parentNode.insertBefore(wxjs, js.nextSibling);
})('/com/get_ticket_getticket');

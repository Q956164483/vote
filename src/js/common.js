/**
 * 关闭toast框
 */
function closeToast(){
    $('.toast').addClass('hide');
}
/**
 * 打开toast框
 * @param String msg  toast消息
 * @param Number time  toast时间
 */
function openToast(msg,time){
  $('.toast').html(msg).removeClass('hide');
  if(time){
      setTimeout(function(){
          closeToast();
      },+time)
  }
}

/**
 * 获取链接后面的参数
 * @param String name  参数名
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
/**
 * localStorage保存数据
 * @param String key  保存数据的key值
 * @param String value  保存的数据
 */
function setLocVal(key,value){
    window.localStorage[key] = value;
}
/**
 * 根据key取localStorage的值
 * @param Stirng key 保存的key值
 */
function getLocVal(key){
    if(window.localStorage[key])
        return window.localStorage[key];
    else
        return "";
}

/*天气插件开始
天气插件api请在wea目录中index.php修改
申请地址：和风天气-https://dev.qweather.com/
*/
//菜单点击
$("#menu").click(function(event) {
    $(".mywth").toggleClass('hidden');
});
$("#content").click(function(event) {
    $(".mywth").removeClass('hidden');
});


//获取客户端经纬度
navigator.geolocation.getCurrentPosition(function (loc) {
  var lat = parseFloat(loc.coords.latitude).toFixed(2);
  var lon = parseFloat(loc.coords.longitude).toFixed(2);
  var loca = lon + "," + lat;
  console.log(loca);
  // 创建一个新的 XMLHttpRequest 对象
  var xhr = new XMLHttpRequest();
  // 设置请求的方法、URL 和是否为异步
  xhr.open('POST', '/wea/index.php', true);
  // 设置 HTTP 头信息
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  // 发送请求
  xhr.send('loca=' + encodeURIComponent(loca));
  // 接收服务器的响应
  xhr.onload = function () {
    if (xhr.status === 200) {
      // 当响应成功时，处理服务器返回的数据
      wea = JSON.parse(xhr.responseText);
      //显示天气
      //判断夜晚
      var now = new Date(),
        hour = now.getHours();
      if (hour < 18) { myday = "d"; } else { myday = "n"; }
      //天气
      $('.mywth').append(wea.city + "<i class='qi-" + wea.now.icon + "'></i>" + wea.now.text + " " + wea.now.temp + "℃");

      $('.wea_hover').css('background-image', 'url(wea/bg/' + wea.backimg + '.webp)');
      //今日天气
      var objobstime = new String(wea.now.obsTime);
      var regex = /[+].*$/g;
      var reobstime = objobstime.replace(regex, '');
      var obstime = reobstime.replace('T', ' ');
      $('.wea_top').append("<span class='city'><b>" + wea.city + "</b> " + obstime.toString() + " 观测</span>\
                          <span class='qi-" + wea.now.icon + "' style= 'no-repeat center/contain;font-size:4em;margin-top: 0.2em;'></span>\
                          <span class='tem'><b>" + wea.now.temp + "℃</b>" + wea.now.text + "</span>\
                          <span class='air'>相对湿度：" + wea.now.humidity + "%<br>" + wea.now.windDir + "：" + wea.now.windScale + "级</span>\
                          <span class='air_tips'>" + "" + "</span>");

      //未来3天天气
      var wea_foot;
      for (var i = 0; i < 3; i++) {
        wea_foot = '<li>' + wea.wea3d.daily[i].fxDate + "<br><i class='qi-" + wea.wea3d.daily[i].iconDay + "' style='font-size:2em'></i><br><b>" + wea.wea3d.daily[i].textDay + '</b><br><i>' + wea.wea3d.daily[i].tempMin + '°/' + wea.wea3d.daily[i].tempMax + '°' + '</i></li>';
        $(".wea_foot ul").append(wea_foot);
      }
    }
    else {
      // 当响应失败时，显示错误信息
      console.error("天气插件错误");
    }
  }
});


/*天气插件结束*/

function weaclick(){
    window.open(wea.fxLink);
}
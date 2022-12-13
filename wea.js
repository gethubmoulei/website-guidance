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

//你的申请的apikey 
var key="f94b6b17a0c845ed83165ad557ae4a84";
var jsonCity,loca,cinfo,cid,wea,wea3d;

//获取客户端经纬度
$.ajax({
  method: 'GET',
  url: 'http://ip-api.com/json/',
  dataType: 'json',
  async: false, // 让多个jax顺序执行而不是异步执行
  success: function (response) {// 处理响应内容
    //经纬度精确到两位小数并拼接
    jsonCity = response;
    var lat = jsonCity.lat.toFixed(2);
    var lon = jsonCity.lon.toFixed(2);
    loca = lon + "," + lat;
    //console.log("一经纬度:"+loca);
  },
  error: function (error) {
    // 处理错误
    console.log("经纬度获取失败");
  }
});

//根据经纬度获取城市ID信息
$.ajax({
  method: 'GET',
  url: 'https://geoapi.qweather.com/v2/city/lookup?location=' + loca + "&key=" + key,
  dataType: 'json',
  async: false, // 让多个jax顺序执行而不是异步执行
  success: function (response) {
    // 处理响应内容
    cinfo = response;
    cid = cinfo.location[0].id;
    //console.log("二城市id:"+cid);
  },
  error: function (error) {
    // 处理错误
    console.log("城市ID获取失败");
  }
});


//获取实时天气
$.ajax({
    method: 'GET',
    url: 'https://devapi.qweather.com/v7/weather/now?location='+ cid +'&key=' + key,
    dataType: 'json',
    async: false, // 让多个jax顺序执行而不是异步执行
    success: function (response) {
      //console.log(response);
      // 处理响应内容
      wea = response;
    },
    error: function (error) {
      // 处理错误
      console.log("实时天气获取失败");
    }
});
//获取三日天气
$.ajax({
    method: 'GET',
    url: 'https://devapi.qweather.com/v7/weather/3d?location='+ cid +'&key=' + key,
    dataType: 'json',
    async: false, // 让多个jax顺序执行而不是异步执行
    success: function (response) {
      //console.log(response);
      // 处理响应内容
      wea3d = response;//解码Json
    },
    error: function (error) {
      // 处理错误
      console.log("三日天气获取失败");
    }
});

//匹配天气，方便使用天气字体
if(wea.now.text === "晴")
  wea.backimg = "sunny";
else if(wea.now.text == "多云")
  wea.backimg = "cloudy";
else if(wea.now.text == "阴")
  wea.backimg = "overcast";
else if(wea.backimg.includes("雨"))
  wea.backimg = "rain";
else if(wea.backimg.includes("雷"))
  wea.backimg = "thunder";
else if(wea.backimg.includes("雪"))
  wea.backimg = "snow";
wea.city=cinfo.location[0].name;

var regexp = /(?<=[-]).*/;
for(var i = 0; i < 3; i++){
  wea3d.daily[i].fxDate = regexp.exec(wea3d.daily[i].fxDate);
}
wea.wea3d = wea3d;
console.log(wea);

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
/*天气插件结束*/

function weaclick(){
    window.open(wea.fxLink);
}
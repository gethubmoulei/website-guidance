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
var jsonCity,loca,cinfo,cid,wea,wae3d;

//获取客户端经纬度
$.ajax({
    method: 'GET',
    url: 'http://ip-api.com/json/',
    dataType: 'json',
    success: function (response) {// 处理响应内容
        jsonCity = JSON.parse(response);//解码json

        //经纬度精确到两位小数并拼接
        var lat = jsonCity.lat.toFixed(2);
        var lon = jsonCity.lon.toFixed(2);
        loca = lon + "," + lat;
    },
    error: function (error) {
        // 处理错误

    }
  });

//根据经纬度获取城市ID信息
$.ajax({
    method: 'GET',
    url: 'https://geoapi.qweather.com/v2/city/lookup?location='+loca+"&key="+ key,
    dataType: 'json',
    success: function (response) {
      // 处理响应内容
      cinfo = JSON.parse(response);//解码Json
      cid = cinfo.location[0].id;
    },
    error: function (error) {
      // 处理错误
    }
  });

//获取实时天气
$.ajax({
    method: 'GET',
    url: 'https://devapi.qweather.com/v7/weather/now?location='+ cid +'&key=' + key,
    dataType: 'json',
    success: function (response) {
      // 处理响应内容
      wea = JSON.parse(response);//解码Json
    },
    error: function (error) {
      // 处理错误
    }
  });
//获取三日天气
$.ajax({
    method: 'GET',
    url: 'https://devapi.qweather.com/v7/weather/3d?location='+ cid +'&key=' + key,
    dataType: 'json',
    success: function (response) {
      // 处理响应内容
      wea3d = JSON.parse(response);//解码Json
    },
    error: function (error) {
      // 处理错误
    }
  });
var res;
$.ajax({
    url: '/wea/index.php',
    dataType: 'json',
    error: function() {
        console.log('天气插件网络错误！');
    },
    success: function(res) {
        link = res.fxLink;
        //判断夜晚
        var now = new Date(),
            hour = now.getHours();
        if (hour < 18) { myday = "d"; } else { myday = "n"; }
        //天气
        console.log(res);
        $('.mywth').append(res.city + "<i class='qi-" + res.now.icon + "'></i>" + res.now.text + " " + res.now.temp + "℃");

        $('.wea_hover').css('background-image', 'url(wea/bg/' + res.backimg + '.webp)' );
        //今日天气
        var objobstime = new String(res.now.obsTime);
        var regex = /[+].*$/g;
        var reobstime = objobstime.replace(regex,'');
        var obstime = reobstime.replace('T', ' ');
        $('.wea_top').append("<span class='city'><b>" + res.city + "</b> " + obstime.toString() + " 观测</span>\
                              <span class='qi-" + res.now.icon + "' style= 'no-repeat center/contain;font-size:4em;margin-top: 0.2em;'></span>\
                              <span class='tem'><b>" +  res.now.temp + "℃</b>" + res.now.text + "</span>\
                              <span class='air'>相对湿度：" + res.now.humidity + "%<br>" + res.now.windDir + "：" + res.now.windScale + "级</span>\
                              <span class='air_tips'>" + "" + "</span>");
        //今日指数
        /*var wea_con;
        for (var x = 0; x < 8; x++) {
            wea_con = '<li class="wea_' + res.HeWeather6[0].lifestyle[x].type + '"><span></span>指数<br><b>' + res.HeWeather6[0].lifestyle[x].brf + '</b></li>';
            $(".wea_con ul").append(wea_con);
        }
        $('.wea_comf span').text('舒适度');
        $('.wea_drsg span').text('穿衣');
        $('.wea_flu span').text('感冒');
        $('.wea_sport span').text('运动');
        $('.wea_trav span').text('旅游');
        $('.wea_uv span').text('紫外线');
        $('.wea_cw span').text('洗车');
        $('.wea_air span').text('空气');*/


        //未来3天天气
        var wea_foot;
        for (var i = 0; i < 3; i++) {
            wea_foot = '<li>' + res.wea3d.daily[i].fxDate + "<br><i class='qi-" + res.wea3d.daily[i].iconDay + "' style='font-size:2em'></i><br><b>" + res.wea3d.daily[i].textDay + '</b><br><i>' + res.wea3d.daily[i].tempMin + '°/' + res.wea3d.daily[i].tempMax + '°' + '</i></li>';
            $(".wea_foot ul").append(wea_foot);
        }
    }
});
/*天气插件结束*/

function weaclick(){
    window.open(link);
}
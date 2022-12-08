<?php
/*
使用前请注意务必设置好白名单和apikey
本天气插件为申请地址：和风天气-https://dev.qweather.com/
*/
header('Content-Type:application/json; charset=utf-8');
//防跨域调用
header('Access-Control-Allow-Origin:https://192.168.31.150:888');
header('Access-Control-Allow-Methods:POST');
header('Access-Control-Allow-Headers:x-requested-with,content-type');

//你的申请的apikey 
$key="f94b6b17a0c845ed83165ad557ae4a84";
//$gaodekey = "7cbe54766575d5afedfe4d4d882f1139";
$content = file_get_contents("http://ip-api.com/json/");     //获取城市信息
//正则表达获取{}内的内容
//$regex1 = '#[\{].+[\}]#';
//preg_match($regex1, $content, $mc);
$jsoncity = json_decode($content,true);//解码为json格式，第二个参数为“true”表示返回的是数组，否则返回对象
//$gaode = json_decode(file_get_contents("https://restapi.amap.com/v3/geocode/geo?address=".$city."&output=json&key=".$gaodekey));//高德API，通过城市名获取经纬度
//经纬度精确到两位小数并拼接成字符串
$lat = number_format($jsoncity['lat'], 2);
$lon = number_format($jsoncity['lon'], 2);
$location = $lon . "," . $lat;

//获取城市ID信息
$cinfo = json_decode(gzdecode(file_get_contents("https://geoapi.qweather.com/v2/city/lookup?location=".$location."&key=".$key)));
//var_dump($cinfo);
$cid = $cinfo->location[0]->id;

//获取实时天气
$wea = json_decode(gzdecode(file_get_contents("https://devapi.qweather.com/v7/weather/now?location=".$cid."&key=".$key)));
//获取三日天气
$wea3d = json_decode(gzdecode(file_get_contents("https://devapi.qweather.com/v7/weather/3d?location=".$cid."&key=".$key)));

//匹配天气，方便使用天气字体
$regex2 = '#[雨]#';
$regex3 = '#[雷]#';
$regex4 = '#[雪]#';
if($wea->now->text == "晴")
    $wea->backimg = "sunny";
else if($wea->now->text == "多云")
    $wea->backimg = "cloudy";
else if($wea->now->text == "阴")
    $wea->backimg = "overcast";
else if(preg_match($regex2, $wea->now->text, $wth))
    $wea->backimg = "rain";
else if(preg_match($regex3, $wea->now->text, $wth))
    $wea->backimg = "thunder";
else if(preg_match($regex4, $wea->now->text, $wth))
    $wea->backimg = "snow";
$wea->city=$cinfo->location[0]->name;

for($i = 0; $i < 3; $i++){
    preg_match('#(?<=[-]).*#', $wea3d->daily[$i]->fxDate, $wth);
    $wea3d->daily[$i]->fxDate = $wth;
}

$wea->wea3d=$wea3d;
echo json_encode($wea);
?>
function BaiduMap(devLng,devLat) {
    var _this=this;
    //传入当前点经度纬度坐标
    var mapContainer = document.createElement("div");
    mapContainer.style.cssText = 'height: 100%;width:100%;';
    document.body.append(mapContainer);

    _this.devPoint=new BMap.Point(devLng, devLat);
    console.log(_this.devPoint)
    _this.bPoint=null;
    _this.map = new BMap.Map(mapContainer); // 创建Map实例
    _this.map.centerAndZoom(_this.devPoint, 15);// 初始化地图,设置中心点坐标和地图级别
    _this.map.enableScrollWheelZoom(true);//开启鼠标滚轮缩放
    _this.resultList=[];
    // map.setCurrentCity("哈尔滨");// 设置地图显示的城市 此项是必须设置的//貌似也可以不设置？

    _this.coodConvert();

};


//百度地图坐标转换：百度地图使用的是加密后的，需要对设备获得的WGS-84坐标系进行转换，使用转换后的坐标来在百度地图上查询地点。
//返回转换后的百度坐标bPoint
BaiduMap.prototype.coodConvert = function () {
    var converter=new BMap.Convertor();
    var _this=this;
    converter.translate([this.devPoint],1,5,function(data){
        //转换完成后的回调函数
        if(data.status===0){
            _this.bPoint=data.points[0];
            console.log(_this.devPoint);
            console.log(_this.bPoint);

            _this.search(_this.bPoint,'厕所',2000)

        }
    })
};

//百度地图搜索
BaiduMap.prototype.search = function (bPoint, placeName, rad) {
    var _this=this;
    //当前搜索中心点
    var mPoint = bPoint;
    //创建圆
    var circle = new BMap.Circle(mPoint, rad, { fillColor: "red", fillOpacity: 0.1, strokeColor: "red", strokeWeight: 2, strokeOpacity: 0.3 });
    //增加圆
    _this.map.addOverlay(circle);
    //添加标注点
    var marker = new BMap.Marker(mPoint, { size: 90 });  // 创建标注
    marker.addEventListener('click', function (e) { console.log(e) })
    _this.map.addOverlay(marker);
    marker.setAnimation(BMAP_ANIMATION_BOUNCE)
    //这里添加了将搜索结果打印到控制台的函数
    var local = new BMap.LocalSearch(_this.map, {
        renderOptions: {
            map: _this.map,
            autoViewport: false
        },
        pageCapacity: 100,
        onSearchComplete: function (e) {
            _this.resultList=e.Ar;
            console.log(_this.resultList);
        }
    });
    local.searchNearby(placeName, mPoint, rad);//要查找的地点名称、中心点、半径

    // console.log(local)
};
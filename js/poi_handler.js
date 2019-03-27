// //poiBoard是独立组件，可在毕业设计其它场景（全景照片展示、完全虚拟场景、增强现实场景）中复用。
// //poiBoard生成器

var PoiBoard = function (posName, posDistance) {
    var _this = this
    _this.posName = posName;
    _this.posDistance = posDistance;
    _this.poiCanvas = null;
    _this.poiBoardGenerator(_this.posName, _this.posDistance);
    return _this.poiSpriteGenerator(_this.poiCanvas);
};
PoiBoard.prototype.poiBoardGenerator = function (posName, posDistance) {
    var icon = new Image();
    icon.src = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDIwNC4xIDIwNC4xIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyMDQuMSAyMDQuMTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHBhdGggc3R5bGU9ImZpbGw6IzQ3QjEzNCIgZD0iTTEwMiwyMDEuM2wtNTguMS01OC4xYy0zMi0zMi0zMi04NC4yLDAtMTE2LjJDNTkuNSwxMS40LDgwLjEsMi44LDEwMiwyLjhzNDIuNiw4LjUsNTguMSwyNC4xaDANCgljMzIsMzIsMzIsODQuMiwwLDExNi4yTDEwMiwyMDEuM3ogTTEwMiwxMC4yYy0yMCwwLTM4LjgsNy44LTUyLjksMjEuOUMyMCw2MS4zLDIwLDEwOC44LDQ5LjEsMTM3LjlsNTIuOSw1Mi45bDUyLjktNTIuOQ0KCWMyOS4yLTI5LjIsMjkuMi03Ni42LDAtMTA1LjhsMCwwQzE0MC44LDE4LDEyMiwxMC4yLDEwMiwxMC4yeiBNMTAyLjIsMTIwYy0xOS4zLDAtMzUuMS0xNS43LTM1LjEtMzUuMXMxNS43LTM1LjEsMzUuMS0zNS4xDQoJYzE5LjMsMCwzNS4xLDE1LjcsMzUuMSwzNS4xUzEyMS41LDEyMCwxMDIuMiwxMjB6IE0xMDIuMiw1Ny4yYy0xNS4zLDAtMjcuNywxMi40LTI3LjcsMjcuN3MxMi40LDI3LjcsMjcuNywyNy43DQoJczI3LjctMTIuNCwyNy43LTI3LjdTMTE3LjUsNTcuMiwxMDIuMiw1Ny4yeiIvPg0KPC9zdmc+DQo=";
    // icon.id="icon";
    // document.body.appendChild(icon);
    var canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;

    this.poiCanvas = canvas;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // ctx.fillRect(50, 60, 206, 206);
    //某些poi icon没画出来

    icon.addEventListener('load', function (e) {
        ctx.drawImage(icon, 40, 40, 176, 176);
    });
    ctx.moveTo(256, 33);
    ctx.lineTo(256, 222);
    ctx.strokeStyle = "#00ce00";
    ctx.lineWidth = 7;
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.font = '54px sans-serif';
    if (posName.length > 12) {
        var posName = posName.slice(0, 12) + '...';
    }
    ctx.fillText(posName, 300, 110);
    ctx.fillStyle = "#ffffff";
    ctx.font = '36px sans-serif';
    ctx.fillText(posDistance, 300, 180);

    this.poiCanvas = canvas;

    // document.body.appendChild(canvas);
};


PoiBoard.prototype.poiSpriteGenerator = function (canvas) {
    // document.body.appendChild(canvas);

    //在所点击点随便添加一个物体
    var poiMap = new THREE.CanvasTexture(canvas);

    //要使得poi板朝向摄像机，必须使用SpriteMaterial材质
    var poiMaterial = new THREE.SpriteMaterial({
        map: poiMap,
        color: 0xffffff,
        transparent: true,
        // depthTest: false 
    });
    var poiObject = new THREE.Sprite(poiMaterial);
    poiObject.center = new THREE.Vector2(0, 0)
    var poiboardSize = [1024, 256];
    poiObject.scale.set(poiboardSize[0] * 0.0007, poiboardSize[1] * 0.0007, 1);
    this.poiObject = poiObject;
};



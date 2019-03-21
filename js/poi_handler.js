// //poiBoard是独立组件，可在毕业设计其它场景（全景照片展示、完全虚拟场景、增强现实场景）中复用。
// //poiBoard生成器

// var PoiBoard = function (posName, posDistance) {
//     var _this = this
//     _this.posName = posName;
//     _this.posDistance = posDistance;
//     _this.poiCanvas=null;
//     _this.poiBoardGenerator(_this.posName, _this.posDistance);
//     return _this.poiSpriteGenerator(_this.poiCanvas);
// };
// PoiBoard.prototype.poiBoardGenerator = function (posName, posDistance) {
//     var icon = new Image();
//     icon.src = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDIwNC4xIDIwNC4xIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAyMDQuMSAyMDQuMTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHBhdGggc3R5bGU9ImZpbGw6IzQ3QjEzNCIgZD0iTTEwMiwyMDEuM2wtNTguMS01OC4xYy0zMi0zMi0zMi04NC4yLDAtMTE2LjJDNTkuNSwxMS40LDgwLjEsMi44LDEwMiwyLjhzNDIuNiw4LjUsNTguMSwyNC4xaDANCgljMzIsMzIsMzIsODQuMiwwLDExNi4yTDEwMiwyMDEuM3ogTTEwMiwxMC4yYy0yMCwwLTM4LjgsNy44LTUyLjksMjEuOUMyMCw2MS4zLDIwLDEwOC44LDQ5LjEsMTM3LjlsNTIuOSw1Mi45bDUyLjktNTIuOQ0KCWMyOS4yLTI5LjIsMjkuMi03Ni42LDAtMTA1LjhsMCwwQzE0MC44LDE4LDEyMiwxMC4yLDEwMiwxMC4yeiBNMTAyLjIsMTIwYy0xOS4zLDAtMzUuMS0xNS43LTM1LjEtMzUuMXMxNS43LTM1LjEsMzUuMS0zNS4xDQoJYzE5LjMsMCwzNS4xLDE1LjcsMzUuMSwzNS4xUzEyMS41LDEyMCwxMDIuMiwxMjB6IE0xMDIuMiw1Ny4yYy0xNS4zLDAtMjcuNywxMi40LTI3LjcsMjcuN3MxMi40LDI3LjcsMjcuNywyNy43DQoJczI3LjctMTIuNCwyNy43LTI3LjdTMTE3LjUsNTcuMiwxMDIuMiw1Ny4yeiIvPg0KPC9zdmc+DQo=";
//     // icon.id="icon";
//     // document.body.appendChild(icon);
//     var canvas = document.createElement('canvas');
//     canvas.width = 1024;
//     canvas.height = 256;
//     var ctx = canvas.getContext("2d");
//     ctx.fillStyle = "rgba(0,0,0,0.5)";
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//     // ctx.fillRect(50, 60, 206, 206);
//     //某些poi icon没画出来

//     // icon.addEventListener('load', function (e) {
//     //console.log(e);
//     var p=40;

//     var pp=setInterval(function () {
//     //     console.log('啦啦啦');
//     if(p>50){
//         clearInterval(pp);
//     }
//         ctx.drawImage(icon, p, p, 176, 176);
//         p+=0.5;
//         console.log(p)
//     }, 1)

//     // });
//     ctx.moveTo(256, 33);
//     ctx.lineTo(256, 222);
//     ctx.strokeStyle = "#00ce00";
//     ctx.lineWidth = 7;
//     ctx.stroke();
//     ctx.fillStyle = "#ffffff";
//     ctx.font = '54px sans-serif';
//     if (posName.length > 12) {
//         var posName = posName.slice(0, 12) + '...';
//     }
//     ctx.fillText(posName, 300, 110);
//     ctx.fillStyle = "#ffffff";
//     ctx.font = '36px sans-serif';
//     ctx.fillText(posDistance, 300, 180);


//     this.poiCanvas=canvas;

//     //document.body.appendChild(canvas);
// };

var space = document.createElement('canvas');
space.height = 480;
space.width = 480;
var ctx = space.getContext("2d");
ctx.scale(1, 1);

// 设置各个粒子
var particles = [];
var particle_count = 1;//共生成多少粒子（数组长度）
for (var i = 0; i < particle_count; i++) {
    particles.push(new Particle());//将生成的粒子推入数组
}
var time = 0;
// 设置画布宽高
var canvasHeight = space.height;
var canvasWidth = space.width;

// 请求动画函数兼容
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 6000 / 60);
        };
})();

//粒子类
function Particle() {

    var canvasHeight = space.height;
    var canvasWidth = space.width;

    this.speed = {
        x: -1 + Math.random() * 2,
        y: -5 + Math.random() * 5
    };
    this.location = {
        x: canvasWidth / 2,
        y: (canvasHeight / 2) + 100
    };
    this.radius = 5 + Math.random() * 1;
    this.life = 20 + Math.random() * 10;
    this.death = this.life;
    this.r = 255;
    this.g = Math.round(Math.random() * 155);
    this.b = 0;

}

function ParticleAnimation() {

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.globalCompositeOperation = "lighter";

    for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        ctx.beginPath();

        p.opacity = Math.round(p.death / p.life * 100) / 100
        var gradient = ctx.createRadialGradient(p.location.x, p.location.y, 0, p.location.x, p.location.y, p.radius);
        gradient.addColorStop(0, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")");
        gradient.addColorStop(0.5, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")");
        gradient.addColorStop(1, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", 0)");
        ctx.fillStyle = gradient;
        ctx.arc(p.location.x, p.location.y, p.radius, Math.PI * 2, false);
        ctx.fill();
        p.death--;
        p.radius++;
        p.location.x += (p.speed.x);
        p.location.y += (p.speed.y);

        //regenerate particles
        if (p.death < 0 || p.radius < 0) {
            //a brand new particle replacing the dead one
            particles[i] = new Particle();
        }
    }
    requestAnimFrame(ParticleAnimation);
}

var PoiBoard = function (posName, posDistance,scene) {
    var _this = this
    _this.posName = posName;
    _this.posDistance = posDistance;
    _this.poiCanvas = space;
    _this.scene=scene;
    _this.poiObject=null;
    ParticleAnimation();
    console.log(scene)
    //...
    _this.poiSpriteGenerator(_this.poiCanvas)
    _this.scene.poiObjArr.push(_this.poiObject)
}

PoiBoard.prototype.poiSpriteGenerator = function (canvas) {
    document.body.appendChild(canvas);

    //在所点击点随便添加一个物体
    var poiMap = new THREE.CanvasTexture(canvas);

    //要使得poi板朝向摄像机，必须使用SpriteMaterial材质
    var poiMaterial = new THREE.SpriteMaterial({
        map: poiMap,
        color: 0xffffff,
        transparent: true,
        // depthTest: false 
    });
    poiMaterial.onUpdate=function(){
        console.log(222)
    }
    var poiObject = new THREE.Sprite(poiMaterial);
    poiObject.center = new THREE.Vector2(0, 0)
    var poiboardSize = [1024, 256];
    poiObject.scale.set(poiboardSize[0] * 0.001, poiboardSize[1] * 0.001, 1);
    this.poiObject=poiObject;
};

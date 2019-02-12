"use strict";
// import util from 'util';

//stick管理器
var StickMgr = function () {
    var self = this;
    self.sticks = [];
}

//stick初始化、构造函数
var Stick = function (conf) {
    var _this = this;

    //保存配置
    if(conf){_this.conf=conf;}else{console.error('配置错误');return false}


    //变换目标

    if (!conf.target || !conf.target instanceof Element || !THREE || !conf.target instanceof THREE.Object3D) {
        console.error('没有对象被选中，或该对象不受支持');
        return false;
    } else {
        _this.target = conf.target;
    }
    _this.type = conf.type;

    //手柄大小
    _this.zoneSize = conf.zoneSize;
    _this.stickSize = conf.stickSize;


    var theStick = _this.buildEl(conf);
    _this.zone = theStick.zone;
    _this.stick = theStick.stick;

    //动态算出手柄起始位置
    _this.originX = parseInt(_this.stick.style.left);
    _this.originY = parseInt(_this.stick.style.top);

    console.log(`起始x：${_this.originX}，起始y：${_this.originY}`)

    _this.eventTodo();


    //记录各项配置

    _this.result = {
        stickLeft: undefined,
        stickTop: undefined,                          //用于计算stick样式
        stickOffsetLeft: 0,
        stickOffsetTop: 0,                            //获得stick相对于zone中心的x,y偏移量
        distance: 0,                                  //获得stick相对于zone中心的距离
        force: 0,                                     //当stick移动超出zone时，移出以后stick
        rad: 0,
        deg: 0,                                       //获得stick相对于zone中心的旋转度数
        lockedPos: [],                                //当stick移动超出zone时，获得stick在边缘锁定的位置
        transformMatrix: undefined                    //变换矩阵
    };

    console.log(_this);

    return _this;
}

//计算方向
Stick.prototype.getDirection = function (e) {

    //判断是否为触摸事件
    if (e.type.match('touch') !== null) { console.log('触摸事件'); e = e.touches[e.touches.length - 1] }
    var result = this.result;
    console.log(this);
    result.stickLeft = e.clientX - 0.5 * parseInt(util.getStyle(this.stick).width) - parseInt(util.getStyle(this.zone).left);// inner.style.left
    result.stickTop = e.clientY - 0.5 * parseInt(util.getStyle(this.stick).height) - parseInt(util.getStyle(this.zone).top);// inner.style.top
    result.stickOffsetLeft = result.stickLeft - this.originX;
    result.stickOffsetTop = result.stickTop - this.originY;

    //手柄的偏移量、偏移角度
    result.distance = util.gougu(result.stickLeft - this.originX, result.stickTop - this.originY);
    result.force = result.distance;
    result.rad = Math.atan2(result.stickTop - this.originY, result.stickLeft - this.originX);
    result.deg = result.rad * (180 / Math.PI);
    var lockedDistanceOffset = (parseInt(util.getStyle(this.zone).height) / 2 - parseInt(util.getStyle(this.stick).height) / 2);

    //处理偏移量超过外容器边界的情况，超出时锁定内部手柄到定界框边沿
    if (result.distance > lockedDistanceOffset) {
        console.log('已移出限界');
        //锁定偏移距离
        //result.distance = (parseInt(util.getStyle(outter).height) / 2 - parseInt(util.getStyle(inner).height) / 2);
        result.lockedPos = util.findLockedCoord({
            x: parseInt(result.stickLeft),
            y: parseInt(result.stickTop)
        }, lockedDistanceOffset, result.rad);
        result.force = result.distance;
        result.distance = lockedDistanceOffset;
        result.stickLeft = result.lockedPos.x + this.originX;
        result.stickTop = result.lockedPos.y + this.originY;
    }
    return result;
}

Stick.prototype.getRawMatrix=function(){
    var target=this.target;
    if (target instanceof Element || target instanceof THREE.Object3D) {
        //原始矩阵
        var rawMatrix = target instanceof Element ? util.parseTransformMatrix(util.getStyle(target).transform) : target.matrixWorld.elements.slice(0);
        //console.log(rawMatrix);
        if (rawMatrix.length == 9) {
            console.log('2D变换模式');
        } else if (rawMatrix.length == 16) {
            console.log('3D变换模式');
            //初始化原矩阵
            var rawPositionMatrix = util.originMatrix4.slice(0); //原始位置移动到原点矩阵
            var rawPositionMatrix0 = util.originMatrix4.slice(0);//原点移动到原始位置矩阵

            if (!(target instanceof Element)) {
                //获得THREE.Object3D的位置
                var rawPosition = target.position;
            } else {
                //获得Element中CSS Transform矩阵中与位置相关的元素
                var rawPosition = {
                    x: rawMatrix[12],
                    y: rawMatrix[13],
                    z: rawMatrix[14]
                };
            }

            //变换前位移到原点矩阵
            rawPositionMatrix[12] = -rawPosition.x;
            rawPositionMatrix[13] = -rawPosition.y;
            rawPositionMatrix[14] = -rawPosition.z;
            //console.log(rawPositionMatrix);

            //变换后移到原位矩阵
            rawPositionMatrix0[12] = rawPosition.x;
            rawPositionMatrix0[13] = rawPosition.y;
            rawPositionMatrix0[14] = rawPosition.z;
            //console.log(rawPositionMatrix0);
        }
    }else{
        console.error('对象不受到支持。')
        return false;
    }
    
}

Stick.prototype.getMatrix = function (conf,target) {
    var mmp = util.matrixMuitply;
    var result={};
    if (target instanceof Element || target instanceof THREE.Object3D) {

        //原始矩阵
        var rawMatrix = target instanceof Element ? util.parseTransformMatrix(util.getStyle(target).transform) : target.matrixWorld.elements.slice(0);
        //console.log(rawMatrix);

        if (rawMatrix.length == 9) {
            console.log('2D变换模式');

            //初始化原矩阵
            var translateMatrix3 = util.originMatrix3.slice(0);
            var rotateMatrix3 = util.originMatrix3.slice(0);
            //平移矩阵
            translateMatrix3[6] = result.stickOffsetLeft * conf.moveFactor;
            translateMatrix3[7] = result.stickOffsetTop * conf.moveFactor;

            //旋转矩阵
            rotateMatrix3[0] = Math.cos(result.rad) * conf.moveFactor;
            rotateMatrix3[1] = -Math.sin(result.rad) * conf.moveFactor;
            rotateMatrix3[3] = Math.sin(result.rad) * conf.moveFactor;
            rotateMatrix3[4] = Math.cos(result.rad) * conf.moveFactor;

            //矩阵相乘
            result.transformMatrix = util.matrixMuitply(rawMatrix, translateMatrix3);

            result.cssTransformText = 'matrix(' + result.transformMatrix[0] + ',' + result.transformMatrix[1] + ',' + result.transformMatrix[3] + ',' + result.transformMatrix[4] + ',' + result.transformMatrix[6] + ',' + result.transformMatrix[7] + ')';

        } else if (rawMatrix.length == 16) {
            console.log('3D变换模式');
            //初始化原矩阵
            var translateMatrix4 = util.originMatrix4.slice(0);//位移矩阵
            var rotateMatrix4 = util.originMatrix4.slice(0);//旋转矩阵
            var rotateMatrix4x = util.originMatrix4.slice(0),
                rotateMatrix4y = util.originMatrix4.slice(0),
                rotateMatrix4z = util.originMatrix4.slice(0);

            var rawPositionMatrix = util.originMatrix4.slice(0); //原始位置移动到原点矩阵

            var rawPositionMatrix0 = util.originMatrix4.slice(0);//原点移动到原始位置矩阵

            if (!(target instanceof Element)) {
                var rawPosition = target.position;//获得THREE.Object3D的位置
            } else {
                var rawPosition = {
                    x: rawMatrix[12],
                    y: rawMatrix[13],
                    z: rawMatrix[14]
                };
                //获得Element中CSS Transform矩阵中与位置相关的元素
            }
            rawPositionMatrix[12] = -rawPosition.x;
            rawPositionMatrix[13] = -rawPosition.y;
            rawPositionMatrix[14] = -rawPosition.z;
            //console.log(rawPositionMatrix);

            rawPositionMatrix0[12] = rawPosition.x;
            rawPositionMatrix0[13] = rawPosition.y;
            rawPositionMatrix0[14] = rawPosition.z;
            //console.log(rawPositionMatrix0);

            //四阶矩阵
            /*
                0 , 1 , 2 , 3 ,
            m = 4 , 5 , 6 , 7 ,
                8 , 9 , 10, 11,
                12, 13, 14, 15
            */

            //右手坐标系
            /*

                         y               
                         |         /     
                         |       /      
                         |     /       
                         |   /        
                         | /         
            -------------|-------------x
                       / |                
                     /   |                
                   /     |                
                 /       |                
               /         |                
             z
            
            */

            /*无人机飞控 美国手
            左：x轴偏移控制机身自旋，y轴偏移控制上升下降
            右：偏移控制平面内各个方向移动
            */

            /*

                 ||            ||
                 ||            ||
             ____||____________||____   
            /                        \        
            |   +---+        +---+    |       
            |   | o |  [--]  | o |    |       
            |   +---+        +---+    |       
            |         _______         |       
            +--------/       \--------+

            */

            //平移矩阵

            if (
                conf.type == 'translateX'
                || conf.type == 'translateXY'
                || conf.type == 'translateXZ' || conf.type == 'droneRCRight'
            ) {
                translateMatrix4[12] = result.stickOffsetLeft * conf.moveFactor;
            }
            if (
                conf.type == 'translateY' || conf.type == 'droneRCLeft'
                || conf.type == 'translateXY'
            ) {
                translateMatrix4[13] = result.stickOffsetTop * conf.moveFactor;
            }
            if (
                conf.type == 'translateZ'
                || conf.type == 'translateXZ' || conf.type == 'droneRCRight'
            ) {
                translateMatrix4[14] = result.stickOffsetTop * conf.moveFactor;
            }
            // console.log(translateMatrix4);

            //旋转矩阵
            //X-俯仰，Y-环视，Z-翻滚
            //沿着x轴旋转矩阵
            if (
                conf.type === 'rotateX'
                || conf.type === 'rotateXY'
                || conf.type === 'rotateXZ'
                || conf.type === 'rotateYX'
                || conf.type === 'rotateZX'
                || conf.type === 'rotateXYZ'
                || conf.type === 'rotateXZY'
                || conf.type === 'rotateYXZ'
                || conf.type === 'rotateYZX'
                || conf.type === 'rotateZXY'
                || conf.type === 'rotateZYX') {
                rotateMatrix4x[5] = Math.cos(result.rad);
                rotateMatrix4x[6] = Math.sin(result.rad);
                rotateMatrix4x[9] = -Math.sin(result.rad);
                rotateMatrix4x[10] = Math.cos(result.rad);
            }

            // console.log(rotateMatrix4x)

            //沿着y轴旋转矩阵
            if (
                conf.type === 'rotateY'
                || conf.type === 'rotateXY'
                || conf.type === 'rotateYX'
                || conf.type === 'rotateYZ'
                || conf.type === 'rotateZY'
                || conf.type === 'rotateXYZ'
                || conf.type === 'rotateXZY'
                || conf.type === 'rotateYXZ'
                || conf.type === 'rotateYZX'
                || conf.type === 'rotateZXY'
                || conf.type === 'rotateZYX') {
                rotateMatrix4y[0] = Math.cos(result.rad);
                rotateMatrix4y[2] = -Math.sin(result.rad);
                rotateMatrix4y[8] = Math.sin(result.rad);
                rotateMatrix4y[10] = Math.cos(result.rad);
            }

            // console.log(rotateMatrix4y)

            //沿着z轴的旋转矩阵
            if (
                conf.type === 'rotateZ'
                || conf.type === 'rotateXZ'
                || conf.type === 'rotateYZ'
                || conf.type === 'rotateZX'
                || conf.type === 'rotateZY'
                || conf.type === 'rotateXYZ'
                || conf.type === 'rotateXZY'
                || conf.type === 'rotateYXZ'
                || conf.type === 'rotateYZX'
                || conf.type === 'rotateZXY'
                || conf.type === 'rotateZYX') {
                rotateMatrix4z[0] = Math.cos(result.rad);
                rotateMatrix4z[1] = Math.sin(result.rad);
                rotateMatrix4z[4] = -Math.sin(result.rad);
                rotateMatrix4z[5] = Math.cos(result.rad);
            }

            // console.log(rotateMatrix4z)


            //旋转顺序以及方式
            switch (conf.type) {
                case 'rotateX': rotateMatrix4 = rotateMatrix4x; break;
                case 'rotateY': rotateMatrix4 = rotateMatrix4y; break;
                case 'rotateZ': rotateMatrix4 = rotateMatrix4z; break;

                case 'rotateXY': rotateMatrix4 = mmp(rotateMatrix4x, rotateMatrix4y); break;
                case 'rotateXZ': rotateMatrix4 = mmp(rotateMatrix4x, rotateMatrix4z); break;
                case 'rotateYX': rotateMatrix4 = mmp(rotateMatrix4y, rotateMatrix4x); break;
                case 'rotateYZ': rotateMatrix4 = mmp(rotateMatrix4y, rotateMatrix4z); break;
                case 'rotateZX': rotateMatrix4 = mmp(rotateMatrix4z, rotateMatrix4x); break;
                case 'rotateZY': rotateMatrix4 = mmp(rotateMatrix4z, rotateMatrix4y); break;

                case 'rotateXYZ': rotateMatrix4 = mmp(mmp(rotateMatrix4x, rotateMatrix4y), rotateMatrix4z); break;
                case 'rotateXZY': rotateMatrix4 = mmp(mmp(rotateMatrix4x, rotateMatrix4z), rotateMatrix4y); break;
                case 'rotateYXZ': rotateMatrix4 = mmp(mmp(rotateMatrix4y, rotateMatrix4x), rotateMatrix4z); break;
                case 'rotateYZX': rotateMatrix4 = mmp(mmp(rotateMatrix4y, rotateMatrix4z), rotateMatrix4x); break;
                case 'rotateZXY': rotateMatrix4 = mmp(mmp(rotateMatrix4z, rotateMatrix4x), rotateMatrix4y); break;
                case 'rotateZYX': rotateMatrix4 = mmp(mmp(rotateMatrix4z, rotateMatrix4y), rotateMatrix4x); break;
            }
            // console.log(rotateMatrix4);

            console.log('原始矩阵：' + rawMatrix);
            console.log('平移矩阵：' + translateMatrix4);
            console.log('旋转矩阵：' + rotateMatrix4);

            console.log('位置矩阵：' + rawPositionMatrix);

            var tempResultMatrix4 = mmp(translateMatrix4, rotateMatrix4);
            console.log('变换复合矩阵：' + tempResultMatrix4);



            return tempResultMatrix4;
        }
        // return result;
    }
}

Stick.prototype.setMatrix = function (target,matrix) {
    var mmp=util.matrixMuitply;
    //应用矩阵
    if (target instanceof Element) {
        //矩阵相乘
        result.transformMatrix = mmp(mmp(mmp(rawMatrix, rawPositionMatrix), matrix), rawPositionMatrix0);
        //result.transformMatrix=mmp(rawMatrix, tempResultMatrix4);
        // result.cssTransformText = 'matrix3d(' + result.transformMatrix[0] + ',' + result.transformMatrix[1] + ',' + result.transformMatrix[2] + ',' + result.transformMatrix[3] + ',' + result.transformMatrix[4] + ',' + result.transformMatrix[5] + ',' + result.transformMatrix[6] + ',' + result.transformMatrix[7] + ',' + result.transformMatrix[8] + ',' + result.transformMatrix[9] + ',' + result.transformMatrix[10] + ',' + result.transformMatrix[11] + ',' + result.transformMatrix[12] + ',' + result.transformMatrix[13] + ',' + result.transformMatrix[14] + ',' + result.transformMatrix[15] + ')';
    } else if (target instanceof THREE.Object3D) {
        //矩阵相乘
        result.transformMatrix = mmp(mmp(rawPositionMatrix, matrix), rawPositionMatrix0);
        // console.log(tempResultMatrix4);
        result.transformMatrixList = new THREE.Matrix4();
        //var m = tempResultMatrix4;
        //console.log(m);
        result.transformMatrixList.fromArray(result.transformMatrix);
        //result.transformMatrixList.set(m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9], m[10], m[11], m[12], m[13], m[14], m[15]);

        // console.log(...result.transformMatrix);
        // console.log([rawMatrix, rotateMatrix4, result.transformMatrix])
    } else {
        console.error('目标元素不支持，必须为Element或THREE.Object3D。');
    }
}

//创建DOM
Stick.prototype.buildEl = function (conf) {
    var zone = document.createElement('div');
    zone.setAttribute('data-role', 'zone');
    zone.setAttribute('data-conf-type', conf.type);
    zone.style.cssText = 'position: absolute;background-image:url("./stick_bg.svg");border-radius:50%;background-color: rgba(0,0,0,0.5);';
    zone.style.width = conf.zoneSize + 'px';//'500px';
    zone.style.height = conf.zoneSize + 'px';//'500px';
    //设置zone在视口中的位置
    if (conf.position[0] !== null) zone.style.top = conf.position[0] + 'px';
    if (conf.position[1] !== null) zone.style.right = conf.position[1] + 'px';
    if (conf.position[2] !== null) zone.style.bottom = conf.position[2] + 'px';
    if (conf.position[3] !== null) zone.style.left = conf.position[3] + 'px';

    var stick = document.createElement('div');
    stick.setAttribute('data-role', 'stick');
    stick.style.cssText = 'background-color: rgba(255,255,255,0.5);position: absolute;box-shadow: 2px 2px 10px rgba(0,0,0,0.5);border-radius: 50%;';
    stick.style.width = conf.stickSize + 'px';//'200px';
    stick.style.height = conf.stickSize + 'px';//'200px';
    stick.style.top = (conf.zoneSize - conf.stickSize) / 2 + 'px';//'150px';
    stick.style.left = (conf.zoneSize - conf.stickSize) / 2 + 'px';
    zone.appendChild(stick);
    document.body.appendChild(zone);
    return { zone, stick };
}

//处理鼠标事件
Stick.prototype.eventTodo = function () {

    var zone = this.zone, stick = this.stick, target = this.target;

    var _this = this;
    //处理鼠标移动
    function mouseHandler(e) {

        e.preventDefault();
        switch (e.type) {
            case 'mousedown': {
                // console.log('mousedown');
                zone.addEventListener('mousemove', mouseHandler, false);
                zone.addEventListener('mouseup', mouseHandler, false);
                break;
            };
            case 'touchmove':
            case 'mousemove': {
                var result = _this.getDirection(e);
                console.log(result);
                stick.style.left = result.stickLeft + 'px';
                stick.style.top = result.stickTop + 'px';

                //...
                console.log(_this)
                _this.getMatrix(_this.conf,_this.target);
                _this.setMatrix(target);

                if (target instanceof Element) target.style.transform = result.cssTransformText;
                else if (target instanceof THREE.Object3D) {
                    target.applyMatrix(result.transformMatrixList);
                }

                //return result;
                break;
            };
            case 'mouseup': {
                // console.log('mouseup')
                stick.style.left = _this.originX + 'px';
                stick.style.top = _this.originY + 'px';
                zone.removeEventListener('mouseup', mouseHandler, false);
                zone.removeEventListener('mousemove', mouseHandler, false);
                break;
            };
            case 'touchstart': {
                // console.log('mousedown');
                zone.addEventListener('touchmove', mouseHandler, false);
                zone.addEventListener('touchup', mouseHandler, false);
                break;
            };
            case 'touchend': {
                // console.log('mouseup')
                stick.style.left = _this.originX + 'px';
                stick.style.top = _this.originY + 'px';
                zone.removeEventListener('touchup', mouseHandler, false);
                zone.removeEventListener('touchmove', mouseHandler, false);
                break;
            };
        }
    }

    zone.addEventListener('mousedown', mouseHandler, false);
    //inner.addEventListener('mousedown', mouseHandler, false);

    zone.addEventListener('touchstart', mouseHandler, false);
    //inner.addEventListener('mousedown', mouseHandler, false);

    //阻止默认事件
    zone.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    }, false);
    zone.addEventListener('drag', function (e) {
        e.preventDefault();
    }, false);
}
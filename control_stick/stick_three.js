"use strict";
// import util from 'util';

//stick初始化
var stickInit = function (conf) {

    //变换目标
    var target = conf.target;
    if (!target) {
        console.error('There is nothing being select.');
        return false;
    }
    
    //创建DOM
    var zone = document.createElement('div');
    zone.setAttribute('data-role', 'zone');
    zone.style.cssText = 'position: absolute;background-image:url(\'./stick_bg.svg\');border-radius:50%;background-color: rgba(0,0,0,0.5);';
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
    zone.appendChild(stick)
    document.body.appendChild(zone);

    // //获得外部容器（定界框）
    // var zone = document.querySelector('[data-role=zone]');
    // //获得内部手柄（摇杆）
    // var stick = document.querySelector('[data-role=stick]');

    var originX = parseInt(stick.style.left);
    var originY = parseInt(stick.style.top);
    //用于计算当拖动超出范围时手柄的锁定坐标（来自nipplejs）
    var findLockedCoord = function (position, distance, radius) {
        var b = [];
        b.x = /*position.x - */distance * Math.cos(radius);
        b.y =/*position.y - */distance * Math.sin(radius);
        //console.log(position.x+' '+position.y+'  '+distance * Math.cos(radius)+' '+distance * Math.sin(radius));
        return b;
    };
    //

    var result = {
        stickLeft: undefined,
        stickTop: undefined,                 //用于计算stick样式
        stickOffsetLeft: 0,
        stickOffsetTop: 0,           //获得stick相对于zone中心的x,y偏移量
        distance: 0,                 //获得stick相对于zone中心的距离
        force: 0,                     //当stick移动超出zone时，移出以后stick
        rad: 0,
        deg: 0,                      //获得stick相对于zone中心的旋转度数
        lockedPos: [],                //当stick移动超出zone时，获得stick在边缘锁定的位置
        transformMatrix: undefined                    //变换矩阵
    };

    //处理鼠标移动
    var mouseMoveHandler = function (e) {
        //判断是否为触摸事件
        if (e.type.match('touch') !== null) { e = e.touches[e.touches.length - 1] }

        result.stickLeft = e.clientX - 0.5 * parseInt(util.getStyle(stick).width) - parseInt(util.getStyle(zone).left);// inner.style.left
        result.stickTop = e.clientY - 0.5 * parseInt(util.getStyle(stick).height) - parseInt(util.getStyle(zone).top);// inner.style.top
        result.stickOffsetLeft = result.stickLeft - originX;
        result.stickOffsetTop = result.stickTop - originY;

        //手柄的偏移量、偏移角度
        result.distance = util.gougu(result.stickLeft - originX, result.stickTop - originY);
        result.force = result.distance;
        result.rad = Math.atan2(result.stickTop - originY, result.stickLeft - originX);
        result.deg = result.rad * (180 / Math.PI);
        var lockedDistanceOffset = (parseInt(util.getStyle(zone).height) / 2 - parseInt(util.getStyle(stick).height) / 2);

        //处理偏移量超过外容器边界的情况，超出时锁定内部手柄到定界框边沿
        if (result.distance > lockedDistanceOffset) {
            console.log('outter');
            //锁定偏移距离
            //result.distance = (parseInt(util.getStyle(outter).height) / 2 - parseInt(util.getStyle(inner).height) / 2);
            result.lockedPos = findLockedCoord({
                x: parseInt(result.stickLeft),
                y: parseInt(result.stickTop)
            }, lockedDistanceOffset, result.rad);
            result.force = result.distance;
            result.distance = lockedDistanceOffset;
            result.stickLeft = result.lockedPos.x + originX;
            result.stickTop = result.lockedPos.y + originY;

            //计算移出以后的偏移量，并同步角度变化
            // result.continueX = e.clientX - 0.5 * parseInt(util.getStyle(stick).width) - parseInt(util.getStyle(zone).left);
            // result.continueY = e.clientY - 0.5 * parseInt(util.getStyle(stick).height) - parseInt(util.getStyle(zone).top);
            //result.continueDistanceOffset = util.gougu(result.stickLeft - originX , result.stickTop - originY);
            //偏移距离被锁定，但鼠标移出后角度不应当锁定，emmmmmm
            // result.rad;
            // result.degOffset;
        }


        if (target instanceof THREE.Object3D==true) {
            //矩阵相关部分
            var translateMatrix4 = util.originMatrix4.slice(0);
            var rotateMatrix4 = util.originMatrix4.slice(0);
            //原始矩阵
            var rawMatrix = target.matrixWorld.elements.slice(0);

            //平移矩阵
            translateMatrix4[12] = result.stickOffsetLeft * conf.moveFactor;
            translateMatrix4[13] = result.stickOffsetTop * conf.moveFactor;
            // translateMatrix4[14] = result.stickOffsetTop * conf.moveFactor;
            //沿着y轴旋转矩阵
            rotateMatrix4[0] = Math.cos(result.rad);
            rotateMatrix4[2] = -Math.sin(result.rad);
            rotateMatrix4[8] = Math.sin(result.rad);
            rotateMatrix4[10] = Math.cos(result.rad);
            //矩阵相乘
            result.transformMatrix = rotateMatrix4;
            result.transformMatrixList=new THREE.Matrix4();
            var m=result.transformMatrix;
            result.transformMatrixList.set(m[0],m[1],m[2],m[3],m[4],m[5],m[6],m[7],m[8],m[9],m[10],m[11],m[12],m[13],m[14],m[15]);
            // console.log(...result.transformMatrix);

            // console.log([rawMatrix, rotateMatrix4, result.transformMatrix])

        }
        // if (console.table) {
        //     console.table(result);
        // } else {
        //     console.log(result)
        // }

        //console.log(result)


        // if (inner.offsetTop > 300) {
        //     inner.style.top = 300
        // }
        // if (inner.offsetTop < 0) {
        //     inner.style.top = 0
        // }
        // if (inner.offsetLeft > 300) {
        //     inner.style.left = 300
        // }
        // if (inner.offsetLeft < 0) {
        //     inner.style.left = 0
        // }
        // console.log(inner.style.left + ' ' + inner.style.top)
        // console.log(inner.offsetLeft + ' ' + inner.offsetTop);
        // console.log(e.clientX + ' ' + e.clientY);
        // var disX, disY;
        // disX = e.clientX - inner.offsetLeft;
        // disY = e.clientY - inner.offsetTop;
        // inner.style.left = e.clientX - disX + 'px';
        // inner.style.top = e.clientY - disY + 'px';
        // console.log(disX+' '+disY);
        return result;
    }

    //处理鼠标事件
    function mouseHandler(e) {
        // if (e.target !== inner) {
        //     //console.log(e)
        //     return;
        // }

        switch (e.type) {
            case 'mousedown': {
                e.preventDefault();
                // console.log('mousedown');
                zone.addEventListener('mousemove', mouseHandler, false);
                zone.addEventListener('mouseup', mouseHandler, false);
                break;
            };
            case 'mousemove': {
                e.preventDefault();
                var result = mouseMoveHandler(e);
                stick.style.left = result.stickLeft + 'px';
                stick.style.top = result.stickTop + 'px';
                //target.style.transform = result.cssTransformText;
                target.applyMatrix(result.transformMatrixList);
                return result;
                break;
            };
            case 'mouseup': {
                e.preventDefault();
                // console.log('mouseup')
                stick.style.left = originX + 'px';
                stick.style.top = originY + 'px';
                zone.removeEventListener('mouseup', mouseHandler, false);
                zone.removeEventListener('mousemove', mouseHandler, false);
                break;
            };
            case 'touchstart': {
                e.preventDefault();
                // console.log('mousedown');
                zone.addEventListener('touchmove', mouseHandler, false);
                zone.addEventListener('touchup', mouseHandler, false);
                break;
            };
            case 'touchmove': {
                e.preventDefault();
                var result = mouseMoveHandler(e);
                stick.style.left = result.stickLeft + 'px';
                stick.style.top = result.stickTop + 'px';
                target.style.transform = result.cssTransformText;
                return result;
                break;
            };
            case 'touchend': {
                e.preventDefault();
                // console.log('mouseup')
                stick.style.left = originX + 'px';
                stick.style.top = originY + 'px';
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

    return result;
}
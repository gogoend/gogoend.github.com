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

        if (target instanceof Element === true) {
            //原始矩阵
            var rawMatrix = util.parseTransformMatrix(util.getStyle(target).transform);
            //console.log(rawMatrix);

            if (rawMatrix.length == 9) {
                //初始化原矩阵
                var translateMatrix3 = util.originMatrix3.slice(0);
                var rotateMatrix3 = util.originMatrix3.slice(0);
                //平移矩阵
                translateMatrix3[6] = result.stickOffsetLeft * conf.moveFactor;
                translateMatrix3[7] = result.stickOffsetTop * conf.moveFactor;

                //旋转矩阵
                rotateMatrix3[0] = Math.cos(result.rad);
                rotateMatrix3[1] = -Math.sin(result.rad);
                rotateMatrix3[3] = Math.sin(result.rad);
                rotateMatrix3[4] = Math.cos(result.rad);

                //矩阵相乘
                //console.log(util.parseTransformMatrix(util.getStyle(target).transform));
                // result.transformMatrix = util.matrixMuitply(rawMatrix,util.matrixMuitply(rotateMatrix3,translateMatrix3));
                result.transformMatrix = util.matrixMuitply(rawMatrix, translateMatrix3);

                // result.transformMatrix = util.matrixMuitply(translateMatrix3, rotateMatrix3);

                // console.log([rawMatrix, translateMatrix3, rotateMatrix3, result.transformMatrix])
                result.cssTransformText = 'matrix(' + result.transformMatrix[0] + ',' + result.transformMatrix[1] + ',' + result.transformMatrix[3] + ',' + result.transformMatrix[4] + ',' + result.transformMatrix[6] + ',' + result.transformMatrix[7] + ')';

            } else if (rawMatrix.length == 16) {
                console.log('3D');
                //初始化原矩阵
                var translateMatrix4 = util.originMatrix4.slice(0);
                var rotateMatrix4 = util.originMatrix4.slice(0);

                /*
                    0 , 1 , 2 , 3 ,
                m = 4 , 5 , 6 , 7 ,
                    8 , 9 , 10, 11,
                    12, 13, 14, 15 
                */

                //平移矩阵
                translateMatrix4[12] = result.stickOffsetLeft * conf.moveFactor;
                translateMatrix4[13] = result.stickOffsetTop * conf.moveFactor;
                translateMatrix4[14] = result.stickOffsetTop * conf.moveFactor;

                //沿着y轴旋转矩阵
                rotateMatrix4[0] = Math.cos(result.rad);
                rotateMatrix4[2] = -Math.sin(result.rad);
                rotateMatrix4[8] = Math.sin(result.rad);
                rotateMatrix4[10] = Math.cos(result.rad);

                //矩阵相乘
                result.transformMatrix = util.matrixMuitply(rawMatrix, rotateMatrix4);

                result.cssTransformText = 'matrix3d(' + result.transformMatrix[0] + ',' + result.transformMatrix[1] + ',' + result.transformMatrix[2] + ',' + result.transformMatrix[3] + ',' + result.transformMatrix[4] + ',' + result.transformMatrix[5]+ ',' + result.transformMatrix[6] + ',' + result.transformMatrix[7] +',' + result.transformMatrix[8] +',' + result.transformMatrix[9] +',' + result.transformMatrix[10] +',' + result.transformMatrix[11] +',' + result.transformMatrix[12] +',' + result.transformMatrix[13] +',' + result.transformMatrix[14] +',' + result.transformMatrix[15] + ')';
                console.log();

            } else {
                console.log('矩阵无效')
            }
            // if (console.table) {
            //     console.table(result);
            // } else {
            //     console.log(result)
            // }

            //console.log(result)
        }


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
                target.style.transform = result.cssTransformText;
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
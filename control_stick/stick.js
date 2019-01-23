"use strict";
// import util from 'util';

//stick初始化
// var Stick = function (conf) {
//     var _this = this;
//     _this.uuid = util.uuid();
//     _this.conf = conf;

// }
var Stick = function (conf) {

    this.uuid = util.uuid();
    //变换目标
    var target = conf.target;
    this.target = target;
    if (!target) {
        console.error('There is nothing being select.');
        return false;
    }

    //创建DOM
    var zone = document.createElement('div');
    this.zone = zone;
    zone.setAttribute('data-role', 'zone');
    zone.style.cssText = 'position: absolute;background-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4wLjEsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i5Zu+5bGCXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDI0IDEwMjQ7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+DQoJLnN0MHtvcGFjaXR5OjAuNjt9DQoJLnN0MXtmaWxsOiNGRkZGRkY7fQ0KCS5zdDJ7ZmlsbDpub25lO3N0cm9rZTojRkZGRkZGO3N0cm9rZS13aWR0aDo0O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwO30NCjwvc3R5bGU+DQo8ZyBjbGFzcz0ic3QwIj4NCgk8Y2lyY2xlIGN4PSI1MTIiIGN5PSI1MTIiIHI9IjUxMiIvPg0KPC9nPg0KPGc+DQoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTUxMiw0YzY4LjYsMCwxMzUuMSwxMy40LDE5Ny43LDM5LjljNjAuNSwyNS42LDExNC44LDYyLjIsMTYxLjUsMTA4LjljNDYuNyw0Ni43LDgzLjMsMTAxLDEwOC45LDE2MS41DQoJCWMyNi41LDYyLjYsMzkuOSwxMjkuMiwzOS45LDE5Ny43cy0xMy40LDEzNS4xLTM5LjksMTk3LjdjLTI1LjYsNjAuNS02Mi4yLDExNC44LTEwOC45LDE2MS41Yy00Ni43LDQ2LjctMTAxLDgzLjMtMTYxLjUsMTA4LjkNCgkJYy02Mi42LDI2LjUtMTI5LjIsMzkuOS0xOTcuNywzOS45cy0xMzUuMS0xMy40LTE5Ny43LTM5LjljLTYwLjUtMjUuNi0xMTQuOC02Mi4yLTE2MS41LTEwOC45Yy00Ni43LTQ2LjctODMuMy0xMDEtMTA4LjktMTYxLjUNCgkJQzE3LjQsNjQ3LjEsNCw1ODAuNiw0LDUxMnMxMy40LTEzNS4xLDM5LjktMTk3LjdjMjUuNi02MC41LDYyLjItMTE0LjgsMTA4LjktMTYxLjVjNDYuNy00Ni43LDEwMS04My4zLDE2MS41LTEwOC45DQoJCUMzNzYuOSwxNy40LDQ0My40LDQsNTEyLDQgTTUxMiwwQzIyOS4yLDAsMCwyMjkuMiwwLDUxMnMyMjkuMiw1MTIsNTEyLDUxMnM1MTItMjI5LjIsNTEyLTUxMlM3OTQuOCwwLDUxMiwwTDUxMiwweiIvPg0KPC9nPg0KPGc+DQoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTUxMiwxMDYuNGM1NC44LDAsMTA3LjksMTAuNywxNTcuOSwzMS45YzQ4LjMsMjAuNCw5MS43LDQ5LjcsMTI4LjksODYuOXM2Ni41LDgwLjYsODYuOSwxMjguOQ0KCQljMjEuMSw1MCwzMS45LDEwMy4xLDMxLjksMTU3LjlzLTEwLjcsMTA3LjktMzEuOSwxNTcuOWMtMjAuNCw0OC4zLTQ5LjcsOTEuNy04Ni45LDEyOC45cy04MC42LDY2LjUtMTI4LjksODYuOQ0KCQljLTUwLDIxLjEtMTAzLjEsMzEuOS0xNTcuOSwzMS45cy0xMDcuOS0xMC43LTE1Ny45LTMxLjljLTQ4LjMtMjAuNC05MS43LTQ5LjctMTI4LjktODYuOXMtNjYuNS04MC42LTg2LjktMTI4LjkNCgkJYy0yMS4xLTUwLTMxLjktMTAzLjEtMzEuOS0xNTcuOXMxMC43LTEwNy45LDMxLjktMTU3LjljMjAuNC00OC4zLDQ5LjctOTEuNyw4Ni45LTEyOC45czgwLjYtNjYuNSwxMjguOS04Ni45DQoJCUM0MDQuMSwxMTcuMSw0NTcuMiwxMDYuNCw1MTIsMTA2LjQgTTUxMiwxMDIuNGMtMjI2LjIsMC00MDkuNiwxODMuNC00MDkuNiw0MDkuNlMyODUuOCw5MjEuNiw1MTIsOTIxLjZTOTIxLjYsNzM4LjIsOTIxLjYsNTEyDQoJCVM3MzguMiwxMDIuNCw1MTIsMTAyLjRMNTEyLDEwMi40eiIvPg0KPC9nPg0KPGc+DQoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTUxMiwyMDguOGM0MC45LDAsODAuNiw4LDExOCwyMy44YzM2LjEsMTUuMyw2OC41LDM3LjEsOTYuNCw2NWMyNy44LDI3LjgsNDkuNyw2MC4zLDY1LDk2LjQNCgkJYzE1LjgsMzcuNCwyMy44LDc3LjEsMjMuOCwxMThzLTgsODAuNi0yMy44LDExOGMtMTUuMywzNi4xLTM3LjEsNjguNS02NSw5Ni40Yy0yNy44LDI3LjgtNjAuMyw0OS43LTk2LjQsNjUNCgkJYy0zNy40LDE1LjgtNzcuMSwyMy44LTExOCwyMy44cy04MC42LTgtMTE4LTIzLjhjLTM2LjEtMTUuMy02OC41LTM3LjEtOTYuNC02NXMtNDkuNy02MC4zLTY1LTk2LjRjLTE1LjgtMzcuNC0yMy44LTc3LjEtMjMuOC0xMTgNCgkJczgtODAuNiwyMy44LTExOGMxNS4zLTM2LjEsMzcuMS02OC41LDY1LTk2LjRjMjcuOC0yNy44LDYwLjMtNDkuNyw5Ni40LTY1QzQzMS40LDIxNi44LDQ3MS4xLDIwOC44LDUxMiwyMDguOCBNNTEyLDIwNC44DQoJCWMtMTY5LjcsMC0zMDcuMiwxMzcuNS0zMDcuMiwzMDcuMlMzNDIuMyw4MTkuMiw1MTIsODE5LjJTODE5LjIsNjgxLjcsODE5LjIsNTEyUzY4MS43LDIwNC44LDUxMiwyMDQuOEw1MTIsMjA0Ljh6Ii8+DQo8L2c+DQo8Zz4NCgk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNTEyLDMxMS4yYzI3LjEsMCw1My40LDUuMyw3OC4yLDE1LjhjMjMuOSwxMC4xLDQ1LjQsMjQuNiw2My44LDQzYzE4LjQsMTguNCwzMi45LDM5LjksNDMsNjMuOA0KCQljMTAuNSwyNC44LDE1LjgsNTEuMSwxNS44LDc4LjJzLTUuMyw1My40LTE1LjgsNzguMmMtMTAuMSwyMy45LTI0LjYsNDUuNC00Myw2My44Yy0xOC40LDE4LjQtMzkuOSwzMi45LTYzLjgsNDMNCgkJYy0yNC44LDEwLjUtNTEuMSwxNS44LTc4LjIsMTUuOHMtNTMuNC01LjMtNzguMi0xNS44Yy0yMy45LTEwLjEtNDUuNC0yNC42LTYzLjgtNDNzLTMyLjktMzkuOS00My02My44DQoJCWMtMTAuNS0yNC44LTE1LjgtNTEuMS0xNS44LTc4LjJzNS4zLTUzLjQsMTUuOC03OC4yYzEwLjEtMjMuOSwyNC42LTQ1LjQsNDMtNjMuOHMzOS45LTMyLjksNjMuOC00Mw0KCQlDNDU4LjYsMzE2LjUsNDg0LjksMzExLjIsNTEyLDMxMS4yIE01MTIsMzA3LjJjLTExMy4xLDAtMjA0LjgsOTEuNy0yMDQuOCwyMDQuOFMzOTguOSw3MTYuOCw1MTIsNzE2LjhTNzE2LjgsNjI1LjEsNzE2LjgsNTEyDQoJCVM2MjUuMSwzMDcuMiw1MTIsMzA3LjJMNTEyLDMwNy4yeiIvPg0KPC9nPg0KPGc+DQoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTUxMiw0MTMuNmM1NC4zLDAsOTguNCw0NC4xLDk4LjQsOTguNHMtNDQuMSw5OC40LTk4LjQsOTguNGMtNTQuMywwLTk4LjQtNDQuMS05OC40LTk4LjQNCgkJUzQ1Ny43LDQxMy42LDUxMiw0MTMuNiBNNTEyLDQwOS42Yy01Ni42LDAtMTAyLjQsNDUuOC0xMDIuNCwxMDIuNFM0NTUuNCw2MTQuNCw1MTIsNjE0LjRTNjE0LjQsNTY4LjYsNjE0LjQsNTEyDQoJCVM1NjguNiw0MDkuNiw1MTIsNDA5LjZMNTEyLDQwOS42eiIvPg0KPC9nPg0KPGc+DQoJPGxpbmUgY2xhc3M9InN0MiIgeDE9IjMiIHkxPSI1MTIiIHgyPSIxMDIyIiB5Mj0iNTEyIi8+DQo8L2c+DQo8bGluZSBjbGFzcz0ic3QyIiB4MT0iNTEyIiB5MT0iMyIgeDI9IjUxMiIgeTI9IjEwMjEiLz4NCjwvc3ZnPg0K");border-radius:50%;background-color: rgba(0,0,0,0.5);';
    zone.style.width = conf.zoneSize + 'px';//'500px';
    zone.style.height = conf.zoneSize + 'px';//'500px';
    //设置zone在视口中的位置
    if (conf.position[0] !== null) zone.style.top = conf.position[0] + 'px';
    if (conf.position[1] !== null) zone.style.right = conf.position[1] + 'px';
    if (conf.position[2] !== null) zone.style.bottom = conf.position[2] + 'px';
    if (conf.position[3] !== null) zone.style.left = conf.position[3] + 'px';

    var stick = document.createElement('div');
    this.stick = stick;
    stick.setAttribute('data-role', 'stick');
    stick.style.cssText = 'background-color: rgba(255,255,255,0.5);position: absolute;box-shadow: 2px 2px 10px rgba(0,0,0,0.5);border-radius: 50%;';
    stick.style.width = conf.stickSize + 'px';//'200px';
    stick.style.height = conf.stickSize + 'px';//'200px';
    stick.style.top = (conf.zoneSize - conf.stickSize) / 2 + 'px';//'150px';
    stick.style.left = (conf.zoneSize - conf.stickSize) / 2 + 'px';
    zone.appendChild(stick);
    document.body.appendChild(zone);

    // //获得外部容器（定界框）
    // var zone = document.querySelector('[data-role=zone]');
    // //获得内部手柄（摇杆）
    // var stick = document.querySelector('[data-role=stick]');

    var originX = parseInt(stick.style.left);
    var originY = parseInt(stick.style.top);

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

    this.result = result;

    //用于计算当拖动超出范围时手柄的锁定坐标（来自nipplejs）
    var findLockedCoord = function (position, distance, radius) {
        var b = [];
        b.x = /*position.x - */distance * Math.cos(radius);
        b.y =/*position.y - */distance * Math.sin(radius);
        //console.log(position.x+' '+position.y+'  '+distance * Math.cos(radius)+' '+distance * Math.sin(radius));
        return b;
    };
    //
    //处理鼠标移动
    var mouseMoveHandler = function (e) {
        //判断是否为触摸事件
        if (e.type.match('touch') !== null) {
            console.log(e.touches);

            //判断
            e = e.touches[e.touches.length - 1];
            if (false) {
                return 0;
            }
        }

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

        if (target instanceof Element || target instanceof THREE.Object3D) {
            //原始矩阵
            var rawMatrix = target instanceof Element ? util.parseTransformMatrix(util.getStyle(target).transform) : target.matrixWorld.elements.slice(0);
            if ((rawMatrix.length !== 9 && rawMatrix.length !== 16) || !rawMatrix.length || !rawMatrix) {
                console.log('矩阵无效')
            }
            //console.log(rawMatrix);

            if (rawMatrix.length == 9) {
                console.log('2D');
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
                result.transformMatrix = util.matrixMuitply(rawMatrix, translateMatrix3);

                result.cssTransformText = 'matrix(' + result.transformMatrix[0] + ',' + result.transformMatrix[1] + ',' + result.transformMatrix[3] + ',' + result.transformMatrix[4] + ',' + result.transformMatrix[6] + ',' + result.transformMatrix[7] + ')';

            } else if (rawMatrix.length == 16) {
                console.log('3D');
                //初始化原矩阵
                var translateMatrix4 = util.originMatrix4.slice(0);
                var rotateMatrix4x = util.originMatrix4.slice(0), rotateMatrix4y = util.originMatrix4.slice(0), rotateMatrix4z = util.originMatrix4.slice(0);
                var rotateMatrix4;
                var mmp = util.matrixMuitply;

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

                //旋转矩阵

                //沿着x轴旋转矩阵
                if (
                    conf.type == 'rotateX'
                    || conf.type == 'rotateXY'
                    || conf.type == 'rotateXZ'
                    || conf.type == 'rotateYX'
                    || conf.type == 'rotateZX'
                    || conf.type == 'rotateXYZ'
                    || conf.type == 'rotateXZY'
                    || conf.type == 'rotateYXZ'
                    || conf.type == 'rotateYZX'
                    || conf.type == 'rotateZXY'
                    || conf.type == 'rotateZYX') {
                    rotateMatrix4x[5] = Math.cos(result.rad) * conf.moveFactor;
                    rotateMatrix4x[6] = -Math.sin(result.rad) * conf.moveFactor;
                    rotateMatrix4x[9] = Math.sin(result.rad) * conf.moveFactor;
                    rotateMatrix4x[10] = Math.cos(result.rad) * conf.moveFactor;
                }

                //沿着y轴旋转矩阵
                if (
                    conf.type == 'rotateY'
                    || conf.type == 'rotateXY'
                    || conf.type == 'rotateYX'
                    || conf.type == 'rotateYZ'
                    || conf.type == 'rotateZY'
                    || conf.type == 'rotateXYZ'
                    || conf.type == 'rotateXZY'
                    || conf.type == 'rotateYXZ'
                    || conf.type == 'rotateYZX'
                    || conf.type == 'rotateZXY'
                    || conf.type == 'rotateZYX') {
                    rotateMatrix4y[0] = Math.cos(result.rad) * conf.moveFactor;
                    rotateMatrix4y[2] = -Math.sin(result.rad) * conf.moveFactor;
                    rotateMatrix4y[8] = Math.sin(result.rad) * conf.moveFactor;
                    rotateMatrix4y[10] = Math.cos(result.rad) * conf.moveFactor;
                }

                //沿着z轴的旋转矩阵
                if (
                    conf.type == 'rotateZ'
                    || conf.type == 'rotateXZ'
                    || conf.type == 'rotateYZ'
                    || conf.type == 'rotateZX'
                    || conf.type == 'rotateZY'
                    || conf.type == 'rotateXYZ'
                    || conf.type == 'rotateXZY'
                    || conf.type == 'rotateYXZ'
                    || conf.type == 'rotateYZX'
                    || conf.type == 'rotateZXY'
                    || conf.type == 'rotateZYX') {
                    rotateMatrix4z[0] = Math.cos(result.rad) * conf.moveFactor;
                    rotateMatrix4z[1] = -Math.sin(result.rad) * conf.moveFactor;
                    rotateMatrix4z[4] = Math.sin(result.rad) * conf.moveFactor;
                    rotateMatrix4z[5] = Math.cos(result.rad) * conf.moveFactor;
                }

            }
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

            //result.transformMatrix = rotateMatrix4;

            if (target instanceof Element) {
                //矩阵相乘
                result.transformMatrix = mmp(rawMatrix, rotateMatrix4);
                result.cssTransformText = 'matrix3d(' + result.transformMatrix[0] + ',' + result.transformMatrix[1] + ',' + result.transformMatrix[2] + ',' + result.transformMatrix[3] + ',' + result.transformMatrix[4] + ',' + result.transformMatrix[5] + ',' + result.transformMatrix[6] + ',' + result.transformMatrix[7] + ',' + result.transformMatrix[8] + ',' + result.transformMatrix[9] + ',' + result.transformMatrix[10] + ',' + result.transformMatrix[11] + ',' + result.transformMatrix[12] + ',' + result.transformMatrix[13] + ',' + result.transformMatrix[14] + ',' + result.transformMatrix[15] + ')';
                console.log();
            } else if (target instanceof THREE.Object3D) {
                //矩阵相乘
                result.transformMatrix = rotateMatrix4;
                result.transformMatrixList = new THREE.Matrix4();
                var m = result.transformMatrix;
                result.transformMatrixList.set(m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9], m[10], m[11], m[12], m[13], m[14], m[15]);
                // console.log(...result.transformMatrix);
                // console.log([rawMatrix, rotateMatrix4, result.transformMatrix])
            } else {
                console.error('目标元素不支持，必须为Element或THREE.Object3D。');
            }
        }
        return result;
    }


    //处理鼠标事件
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
                var result = mouseMoveHandler(e);
                stick.style.left = result.stickLeft + 'px';
                stick.style.top = result.stickTop + 'px';
                if (target instanceof Element) target.style.transform = result.cssTransformText;
                else if (target instanceof THREE.Object3D) target.applyMatrix(result.transformMatrixList);
                return result;
                break;
            };
            case 'mouseup': {
                // console.log('mouseup')
                stick.style.left = originX + 'px';
                stick.style.top = originY + 'px';
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
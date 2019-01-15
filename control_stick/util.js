//范围内随机数产生器
var rand = function (min, max, ifInt) {
    if (ifInt == true) {
        return Math.floor(Math.random() * (max - min) + min);
    } else {
        return Math.random() * (max - min) + min;
    }
}
//UUID生成器
var uuid = function () {
    var charPool = '0123456789abcdef';
    var digit = '';
    var point;
    for (var i = 0; i < 32; i++) {
        point = rand(0, charPool.length, true);
        digit += charPool.charAt(point);
    }
    return digit;
}

//获得节点已算出的样式
var getStyle = function (node) {
    return window.getComputedStyle(node, false);
}

//勾股定理
var gougu = function (a, b) {
    return Math.sqrt(a * a + b * b);
}

//矩阵相乘
var martixMuitply = function (m1, m2) {
    if (m1.length !== m2.length) {
        return NaN;
    }
    if (m1.length === 9 && m2.length === 9) {
        /*
            0,1,2,      
        m = 3,4,5,      
            6,7,8       
        */
        return [
            m1[0] * m2[0] + m1[1] * m2[3] + m1[2] * m2[6], m1[0] * m2[1] + m1[1] * m2[4] + m1[2] * m2[7], m1[0] * m2[2] + m1[1] * m2[5] + m1[2] * m2[8],
            m1[3] * m2[0] + m1[4] * m2[3] + m1[5] * m2[6], m1[3] * m2[1] + m1[4] * m2[4] + m1[5] * m2[7], m1[3] * m2[2] + m1[4] * m2[5] + m1[5] * m2[8],
            m1[6] * m2[0] + m1[7] * m2[3] + m1[8] * m2[6], m1[6] * m2[1] + m1[7] * m2[4] + m1[8] * m2[7], m1[6] * m2[2] + m1[7] * m2[5] + m1[8] * m2[8]
        ]
    }
}

//初始矩阵
const originMatrix3 = Object.freeze([
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
]);

const originMatrix4 = Object.freeze([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
]);

//解析从computedStyle获得transform matrix
var parseTransformMatrix = function (cssTransformText) {
    //matrix(0,1,3,4,6,7)
    //cssTransformText = 'matrix(0,1,3,4,6,7)';
    if (cssTransformText.match('matrix') && !cssTransformText.match('matrix3d')) {
        //console.log('2D变换');
        var arr = cssTransformText.replace('matrix', '').replace('(', '').replace(')', '').replace(' ', '').split(',');
        var res = originMatrix3.concat();//深拷贝数组，而非引用原数组
        res[0] = parseFloat(arr[0]);
        res[1] = parseFloat(arr[1]);
        res[3] = parseFloat(arr[2]);
        res[4] = parseFloat(arr[3]);
        res[6] = parseFloat(arr[4]);
        res[7] = parseFloat(arr[5]);
        console.log(res)
        return res;
    } else if (cssTransformText.match('matrix') && cssTransformText.match('matrix3d')) {
        //console.log('3D变换');
        var arr = cssTransformText.replace('matrix3d', '').replace('(', '').replace(')', '').replace(' ', '').split(',');
        var res = originMatrix4.concat();
    } else if (cssTransformText.match('none')) {
        // console.log('没有变换');
        return originMatrix3;
    } else {
        //console.log('CSS Transform matrix不合法')
        return false;
    }

}
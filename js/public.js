//请求全屏
//element：要进入全屏幕的元素
//toggle：是否进行全屏幕切换，不传入就不切换
function fullScreen(element, noToggle) {
    //如果第一个参数为字符串exit就无论如何都退出全屏
    if (arguments[0] === 'exit') {
        document.exitFullscreen();
        return;
    }
    //如果document对象中不存在已经全屏的元素，就进入全屏
    if (!document.fullscreenElement) {
        element.requestFullscreen();
    } else if (noToggle) {
        //如果传入了noToggle，就不要切换
        return;
    } else {
        document.exitFullscreen();
    }
}

//对获取用户媒体进行兼容性处理
function getUserMedia(constraints, success, error) {
    if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);//最新版本
        } else if (navigator.webkitGetUserMeida) {
            navigator.webkitGetUserMedia(constraints, success, error);
        } else if (navigator.mozGetUserMedia) {
            navigator.mozGetUserMedia(constraints, success, error);
        } else if (navigator.getUserMedia) {
            navigator.getUserMedia(constraints, success, error);//这一版本已被标准所抛弃，尽可能使用最新版本来替代
        }
    } else {
        console.error('当前浏览器不支持获取用户媒体。')
        return;
    }
}
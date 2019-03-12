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
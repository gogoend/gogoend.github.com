//微型水平滚动条
var ScrollBar = function () {
    var _this = this;
    _this.scrollBarData = {
        progress: 0
    };

    _this.miniScrollBar = document.querySelector('[data-role="miniScrollBar"]');
    console.log(_this.miniScrollBar);
    _this.miniScrollBar.addEventListener("click", _this.miniScrollBarHandler, false);
    _this.miniScrollBar.addEventListener("mousedown", _this.miniScrollBarHandler, false);

}

ScrollBar.prototype.miniScrollBarHandler = function (e) {
    console.log(1111);
    var miniScrollBar = this.miniScrollBar;
    var scrollBarData = this.scrollBarData;
    var stick = miniScrollBar.querySelector(".stick");
    switch (e.type) {
        case 'mousedown':
            {
                if (e.target.classList.contains("stick")) {
                    stick.addEventListener("mousemove", this.miniScrollBarHandler, false)
                    stick.addEventListener("mouseup", this.miniScrollBarHandler, false)
                }
                break;
            };
        case 'click':
        case 'mousemove':
            {
                stick.style.left = (e.clientX - parseInt(util.getStyle(stick).width) / 2 - parseInt(util.getStyle(stick).width)) + 'px';
                scrollBarData.progress = parseInt(stick.style.left) / parseInt(util.getStyle(miniScrollBar).width)
                break;
            };
        case 'mouseup':
            {
                stick.removeEventListener("mousemove", this.miniScrollBarHandler, false);
                stick.removeEventListener("mouseup", this.miniScrollBarHandler, false);
                break;
            };
    }
}

ScrollBar();
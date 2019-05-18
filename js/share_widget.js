var ShareWidget = function () {
    var _this = this;
    _this.shareWidgetDOM = document.querySelector('[data-role="shareWidget"]');
    console.log(_this.shareWidgetDOM)
    _this.snsURL = {
        "weibo": "http://service.weibo.com/share/share.php?title={{shareTitle}}&url={{currentURL}}",
        "qz": "https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={{currentURL}}&title={{shareTitle}}&summary=",
        "linkedin": "http://www.linkedin.com/shareArticle?mini=true&ro=true&url={{currentURL}}&title={{shareTitle}}&summary=",
        "fb": "https://www.facebook.com/share.php?u={{currentURL}}&t={{shareTitle}}&pic=",
        "twitter": "https://twitter.com/intent/tweet?text={{shareTitle}}&url={{currentURL}}"
    }
    _this.currentURL = encodeURI(location.href);
    _this.shareTitle = encodeURI(document.title);
    _this.eventTodo = function (e) {
        var snsType = e.target.getAttribute("data-sns");
        if (snsType) {
            var shareURL = this.snsURL[snsType].replace("{{shareTitle}}", this.shareTitle).replace("{{currentURL}}", this.currentURL);
            window.open(shareURL, "_blank", "toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=640, height=480");
        }
    }
    // for (let i = 0; i < _this.shareWidgetDOM.length; i++) {
    //     _this.shareWidgetDOM[i].addEventListener('click', _this.eventTodo.bind(_this), false);
    // };    
        _this.shareWidgetDOM.addEventListener('click', _this.eventTodo.bind(_this), false);
}
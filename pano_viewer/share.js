//分享组件
function ShareWidget(){
        var defaultPostfix="（来自Jackie）";
		var currentURL=encodeURI(window.location.href);
		var shareTitle=encodeURI(document.title);
        var shareBtnArea=document.querySelector("data-role=shareWidget");

        var sharePlantform={
            "weibo":"http://service.weibo.com/share/share.php?title="+shareTitle+"&url="+currentURL,
            "qzone":"https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url="+currentURL+"&title="+shareTitle+"&summary=",
            "twitter":"https://twitter.com/intent/tweet?text="+shareTitle+"&url="+currentURL,
            "linkedin":"http://www.linkedin.com/shareArticle?mini=true&ro=true&url="+currentURL+"&title="+shareTitle+"&summary=",
            "fb":"https://www.facebook.com/share.php?u="+currentURL+"&t="+shareTitle+"&pic="
        }

		shareBtnArea.addEventListener("click",function(event){
			switch(event.target.dataset.plantform){
				case "weibo":shareOpen(sharePlantform+"weibo");break;
				case "qzone":shareOpen(sharePlantform+"qzone");break;
				case "twitter":shareOpen(sharePlantform+"teitter");break;
				case "linkedin":shareOpen(sharePlantform+"linkedin");break;
				case "fb":shareOpen(sharePlantform+"fb");break;
				default:console.log("default");break;
			}
        },false);
        
		function shareOpen(url){
			window.open(url,"_blank","toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=640, height=480");
		}
	}
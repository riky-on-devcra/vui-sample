!(function () {
  var e = document.createElement("iframe");
  (e.id = "spr-live-chat-frame"),
    (e.name = "spr-live-chat-frame"),
    (e.title = "Sprinklr live chat"),
    (e.style.visibility = "hidden"),
    (e.style.border = "none"),
    (e.style.position = "absolute"),
    (e.style.top = "0"),
    (e.style.left = "0"),
    (e.style.height = "0"),
    (e.style.width = "0"),
    document.body.appendChild(e);
  var t,
    n,
    r,
    o,
    d =
      window.document &&
      window.document.querySelector("script[data-spr-nonce]") &&
      window.document
        .querySelector("script[data-spr-nonce]")
        .getAttribute("data-spr-nonce"),
    i =
      '\x3c!-- Note: on changing this please check widget.js code: we might need to change widget js isChrome html injection section --\x3e\n\x3c!-- reference of un minify code\n<!DOCTYPE html>\n<html>\n<head>\n\t<link rel="preconnect" href="https://www.samsung.com/chat" crossorigin="">\n\t<link rel="dns-prefetch" href="https://www.samsung.com/chat" crossorigin="">\n\t<script ATTR>\n\tvar e = new RegExp("((CPU[ +]OS|iPhone[ +]OS|CPU[ +]iPhone|CPU IPhone OS)[ +]+(15[_.]0|15[_.]([1-9]|\\\\d{2,})|15[_.]8|15[_.](9|\\\\d{2,})|(1[6-9]|[2-9]\\\\d|\\\\d{3,})[_.]\\\\d+|16[_.]0|16[_.]([1-9]|\\\\d{2,})|(1[7-9]|[2-9]\\\\d|\\\\d{3,})[_.]\\\\d+|17[_.]0|17[_.]([1-9]|\\\\d{2,})|(1[8-9]|[2-9]\\\\d|\\\\d{3,})[_.]\\\\d+)(?:[_.]\\\\d+)?)|((Chromium|Chrome)\\\\/(95\\\\.0|95\\\\.([1-9]|\\\\d{2,})|(9[6-9]|\\\\d{3,})\\\\.\\\\d+)(?:\\\\.\\\\d+)?)|(Version\\\\/(15\\\\.0|15\\\\.([1-9]|\\\\d{2,})|(1[6-9]|[2-9]\\\\d|\\\\d{3,})\\\\.\\\\d+|16\\\\.0|16\\\\.([1-9]|\\\\d{2,})|(1[7-9]|[2-9]\\\\d|\\\\d{3,})\\\\.\\\\d+|17\\\\.0|17\\\\.([1-9]|\\\\d{2,})|(1[8-9]|[2-9]\\\\d|\\\\d{3,})\\\\.\\\\d+)(?:\\\\.\\\\d+)? Safari\\\\/)").test(navigator.userAgent),\n\t\tr = document.createElement("script");\n\tr.defer = !0;\n\tvar n = document.createElement("script");\n\tn.defer = !0, e ? (r.src = "https://live-chat-static.sprinklr.com/chat/REenNWVo92/static/js/modern/vendor.7c58738a.js", n.src = "https://live-chat-static.sprinklr.com/chat/REenNWVo92/static/js/modern/main.236ff17b.js") : (r.src = "https://live-chat-static.sprinklr.com/chat/REenNWVo92/static/js/legacy/vendor.7c58738a.js", n.src = "https://live-chat-static.sprinklr.com/chat/REenNWVo92/static/js/legacy/main.6797dda8.js"), document.head.appendChild(r), document.head.appendChild(n);\n     function informLoadCompletedSubscriber(type, message) {\n        var allLoadCompletedSubscriber = window.parent.sprChat.q.map(function (cmd){\n          if (cmd[0] === "subscribeToUpdate" && cmd[1] && cmd[1].topic === "loadCompleted") {\n            return cmd[1].subscriber\n          }\n          return undefined;\n        });\n        allLoadCompletedSubscriber.map(function (fn){\n          if (fn) {\n            fn({\n              response: {\n                error: true,\n                errorPayload: {\n                  type,\n                  message,\n                }\n              }\n            })\n          }\n        })\n      }\n      function listenScriptLoadError(r) {\n        if ("SCRIPT" === r.target.tagName) {\n          informLoadCompletedSubscriber(\'CHUNK_LOAD_FAILED\',r.target.src);\n        }\n      }\n      window.addEventListener("error", listenScriptLoadError, true);\n      window.parent.sprChat(\'subscribeToUpdate\', {\n          topic: \'loadCompleted\',\n          subscriber: function ({ response: { error }}){\n              if (!error) {\n                  window.removeEventListener(\'error\', listenScriptLoadError);\n              }\n          }\n      });\n\t</script>\n</head>\n<body></body>\n</html>\n --\x3e\n\n<!DOCTYPE html><html><head><link rel="preconnect" href="https://www.samsung.com/chat" crossorigin=""><link rel="dns-prefetch" href="https://www.samsung.com/chat" crossorigin=""><script ATTR>var e=new RegExp("((CPU[ +]OS|iPhone[ +]OS|CPU[ +]iPhone|CPU IPhone OS)[ +]+(15[_.]0|15[_.]([1-9]|\\\\d{2,})|15[_.]8|15[_.](9|\\\\d{2,})|(1[6-9]|[2-9]\\\\d|\\\\d{3,})[_.]\\\\d+|16[_.]0|16[_.]([1-9]|\\\\d{2,})|(1[7-9]|[2-9]\\\\d|\\\\d{3,})[_.]\\\\d+|17[_.]0|17[_.]([1-9]|\\\\d{2,})|(1[8-9]|[2-9]\\\\d|\\\\d{3,})[_.]\\\\d+)(?:[_.]\\\\d+)?)|((Chromium|Chrome)\\\\/(95\\\\.0|95\\\\.([1-9]|\\\\d{2,})|(9[6-9]|\\\\d{3,})\\\\.\\\\d+)(?:\\\\.\\\\d+)?)|(Version\\\\/(15\\\\.0|15\\\\.([1-9]|\\\\d{2,})|(1[6-9]|[2-9]\\\\d|\\\\d{3,})\\\\.\\\\d+|16\\\\.0|16\\\\.([1-9]|\\\\d{2,})|(1[7-9]|[2-9]\\\\d|\\\\d{3,})\\\\.\\\\d+|17\\\\.0|17\\\\.([1-9]|\\\\d{2,})|(1[8-9]|[2-9]\\\\d|\\\\d{3,})\\\\.\\\\d+)(?:\\\\.\\\\d+)? Safari\\\\/)").test(navigator.userAgent),r=document.createElement("script"),n=(r.defer=!0,document.createElement("script"));function t(r,n){window.parent.sprChat.q.map(function(e){if("subscribeToUpdate"===e[0]&&e[1]&&"loadCompleted"===e[1].topic)return e[1].subscriber}).map(function(e){e&&e({response:{error:!0,errorPayload:{type:r,message:n}}})})}function o(e){"SCRIPT"===e.target.tagName&&t("CHUNK_LOAD_FAILED",e.target.src)}n.defer=!0,e?(r.src="https://live-chat-static.sprinklr.com/chat/REenNWVo92/static/js/modern/vendor.7c58738a.js",n.src="https://live-chat-static.sprinklr.com/chat/REenNWVo92/static/js/modern/main.236ff17b.js"):(r.src="https://live-chat-static.sprinklr.com/chat/REenNWVo92/static/js/legacy/vendor.7c58738a.js",n.src="https://live-chat-static.sprinklr.com/chat/REenNWVo92/static/js/legacy/main.6797dda8.js"),document.head.appendChild(r),document.head.appendChild(n),window.addEventListener("error",o,!0),window.parent.sprChat("subscribeToUpdate",{topic:"loadCompleted",subscriber:function({response:{error:e}}){e||window.removeEventListener("error",o)}});</script></head><body></body></html>\n'.replace(
        /ATTR/g,
        d ? `nonce=${d}` : ""
      );
  if (
    ((t = window.chrome),
    (n = window.navigator.vendor),
    (r = window.navigator.userAgent.indexOf("OPR") > -1 || !!window.opr),
    (o = window.navigator.userAgent.indexOf("Edg") > -1),
    window.navigator.userAgent.match("CriOS") ||
      (t && "Google Inc." === n && !r && !o))
  ) {
    var c = document.createElement("div");
    (c.innerHTML = i),
      c.childNodes.forEach((t) => {
        if ("script" === t.localName || "link" === t.localName) {
          var n = document.createElement(t.localName);
          e.contentDocument.head.appendChild(n);
          for (var r = 0; r < t.attributes.length; r++) {
            var o = t.attributes[r];
            n.setAttribute(o.name, o.value);
          }
          n.innerHTML = t.innerHTML;
        }
      });
  } else
    e.contentWindow.document.open("text/html", "replace"),
      e.contentWindow.document.write(i),
      e.contentWindow.document.close();
})();

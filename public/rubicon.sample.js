(function () {
  const rubiconConfig = {
    locale: (window.rubiconSetting && window.rubiconSetting.locale) || "en",
    environment:
      (window.rubiconSetting && window.rubiconSetting.environment) || "devcra",
  };

  const SIDEPANEL_WIDTH = 375;
  const TRANSITION_DURATION = "0.4s";
  const TRANSITION_CURVE = "cubic-bezier(0.4, 0, 0.2, 1)";

  const RUBICON_KO_URL = "https://enhans.new.rubicon.dev.devcra.com";
  const RUBICON_UK_URL = "https://enhans-uk.new.rubicon.dev.devcra.com";
  const RUBICON_KO_ORIGIN = "https://enhans.new.rubicon.dev.devcra.com";
  const RUBICON_UK_ORIGIN = "https://enhans-uk.new.rubicon.dev.devcra.com";

  const ALLOWED_RUBICON_ORIGINS = [RUBICON_KO_ORIGIN, RUBICON_UK_ORIGIN];
  const ALLOWED_ORIGINS = [
    ...ALLOWED_RUBICON_ORIGINS,
    "https://p6-pre-qa3.samsung.com",
    "https://dev-www.samsung.com",
    "https://stg-www.samsung.com",
    "https://stg2-www.samsung.com",
    "https://dev-familynet.samsung.com",
    "https://dev-www.familynet.kr",
    "https://samsung.com",
  ];

  var visible = false;
  var mainContent, wrapper, divider, buttonWrapper;
  const runningIds = new Set();

  function getElementByXpath(xpath) {
    try {
      return document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
    } catch (e) {
      console.error("[RUBICON] Failed to get element by xpath:", xpath, e);
      return null;
    }
  }

  function _renderButton() {
    if (rubiconConfig.locale === "ko") {
      return (
        '<div class="utility__button__rubicon noitem" data-name="utility__rubicon">' +
        '<button class="rubicon__button" data-di-id="di-id-8d7c0ff0-62192679">' +
        '<span class="sr-only">루비콘 버튼</span>' +
        '<svg width="24" height="24" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<g clip-path="url(#clip0_199_8102)">' +
        '<path fill-rule="evenodd" clip-rule="evenodd" d="M5.70707 1.73009C5.90225 1.62691 6.03526 1.42184 6.03526 1.1857C6.03526 0.84583 5.75974 0.570312 5.41987 0.570312C5.08 0.570312 4.80449 0.84583 4.80449 1.1857C4.80449 1.42185 4.93751 1.62694 5.13271 1.73011V2.35497H2.85581C2.08494 2.35497 1.46094 2.97897 1.46094 3.74984V7.13446C1.46094 7.90532 2.08494 8.52933 2.85581 8.52933H2.94812V10.1088C2.94812 10.2168 3.0133 10.3142 3.11318 10.3554C3.21307 10.3965 3.32791 10.3734 3.40403 10.2967L5.15863 8.52933H7.98401C8.75488 8.52933 9.37889 7.90532 9.37889 7.13446V3.74984C9.37889 2.97897 8.75488 2.35497 7.98401 2.35497H5.70707V1.73009ZM3.49499 4.67518C3.49499 4.41801 3.70347 4.20954 3.96063 4.20954C4.2178 4.20954 4.42627 4.41801 4.42627 4.67518C4.42627 4.93234 4.2178 5.14082 3.96063 5.14082C3.70347 5.14082 3.49499 4.93234 3.49499 4.67518ZM6.41397 4.67518C6.41397 4.41801 6.62244 4.20954 6.87961 4.20954C7.13677 4.20954 7.34525 4.41801 7.34525 4.67518C7.34525 4.93234 7.13677 5.14082 6.87961 5.14082C6.62244 5.14082 6.41397 4.93234 6.41397 4.67518ZM4.59501 5.89128C4.50025 5.7641 4.32032 5.73782 4.19314 5.83259C4.06596 5.92736 4.03969 6.10728 4.13446 6.23446C4.80109 7.12909 6.15094 7.12909 6.81758 6.23446C6.91235 6.10728 6.88607 5.92736 6.75889 5.83259C6.63171 5.73782 6.45179 5.7641 6.35702 5.89128C5.92007 6.47767 5.03197 6.47767 4.59501 5.89128Z" fill="currentColor"/>' +
        "</g>" +
        '<defs><clipPath id="clip0_199_8102"><rect width="9.84615" height="9.84615" fill="white" transform="translate(0.564453 0.492188)"/></clipPath></defs>' +
        "</svg>" +
        "</button>" +
        "</div>"
      );
    } else {
      return (
        '<a class="nv00-gnb-v4__utility nv00-gnb-v4__utility-rubicon nv00-gnb-v4__utility-btn js-global-rubicon-btn" href="#" an-tr="nv00_gnb-home-gnb cart icon-navigation6" an-ca="navigation" an-ac="gnb" an-la="rubicon" role="button">' +
        '<span class="hidden">Rubicon</span>' +
        '<svg width="24" height="24" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<g clip-path="url(#clip0_199_8102)">' +
        '<path fill-rule="evenodd" clip-rule="evenodd" d="M5.70707 1.73009C5.90225 1.62691 6.03526 1.42184 6.03526 1.1857C6.03526 0.84583 5.75974 0.570312 5.41987 0.570312C5.08 0.570312 4.80449 0.84583 4.80449 1.1857C4.80449 1.42185 4.93751 1.62694 5.13271 1.73011V2.35497H2.85581C2.08494 2.35497 1.46094 2.97897 1.46094 3.74984V7.13446C1.46094 7.90532 2.08494 8.52933 2.85581 8.52933H2.94812V10.1088C2.94812 10.2168 3.0133 10.3142 3.11318 10.3554C3.21307 10.3965 3.32791 10.3734 3.40403 10.2967L5.15863 8.52933H7.98401C8.75488 8.52933 9.37889 7.90532 9.37889 7.13446V3.74984C9.37889 2.97897 8.75488 2.35497 7.98401 2.35497H5.70707V1.73009ZM3.49499 4.67518C3.49499 4.41801 3.70347 4.20954 3.96063 4.20954C4.2178 4.20954 4.42627 4.41801 4.42627 4.67518C4.42627 4.93234 4.2178 5.14082 3.96063 5.14082C3.70347 5.14082 3.49499 4.93234 3.49499 4.67518ZM6.41397 4.67518C6.41397 4.41801 6.62244 4.20954 6.87961 4.20954C7.13677 4.20954 7.34525 4.41801 7.34525 4.67518C7.34525 4.93234 7.13677 5.14082 6.87961 5.14082C6.62244 5.14082 6.41397 4.93234 6.41397 4.67518ZM4.59501 5.89128C4.50025 5.7641 4.32032 5.73782 4.19314 5.83259C4.06596 5.92736 4.03969 6.10728 4.13446 6.23446C4.80109 7.12909 6.15094 7.12909 6.81758 6.23446C6.91235 6.10728 6.88607 5.92736 6.75889 5.83259C6.63171 5.73782 6.45179 5.7641 6.35702 5.89128C5.92007 6.47767 5.03197 6.47767 4.59501 5.89128Z" fill="currentColor"/>' +
        "</g>" +
        '<defs><clipPath id="clip0_199_8102"><rect width="9.84615" height="9.84615" fill="white" transform="translate(0.564453 0.492188)"/></clipPath></defs>' +
        "</svg>" +
        "</a>"
      );
    }
  }

  function _toggleRubicon(skipAnimation = false) {
    console.log("[RUBICON] _toggleRubicon", { skipAnimation });
    visible = !visible;

    if (visible) {
      if (document.getElementById("main-content")) return;

      mainContent = document.createElement("div");
      mainContent.id = "main-content";
      mainContent.style.height = "100vh";
      mainContent.style.overflowY = "auto";
      mainContent.style.width = "calc(100% - " + SIDEPANEL_WIDTH + "px)";
      mainContent.style.transition = skipAnimation
        ? "none"
        : "width " + TRANSITION_DURATION + " " + TRANSITION_CURVE;
      mainContent.style.position = "relative";

      while (document.body.firstChild && document.body.firstChild !== wrapper) {
        mainContent.appendChild(document.body.firstChild);
      }
      document.body.appendChild(mainContent);

      wrapper = document.createElement("div");
      wrapper.id = "aibot-wrapper";
      wrapper.style.position = "fixed";
      wrapper.style.top = "0";
      wrapper.style.right = "0";
      wrapper.style.height = "100vh";
      wrapper.style.width = SIDEPANEL_WIDTH + "px";
      wrapper.style.transform = "translateX(100%)";
      wrapper.style.transition = skipAnimation
        ? "none"
        : "transform " + TRANSITION_DURATION + " " + TRANSITION_CURVE;
      wrapper.style.overflowY = "hidden";
      wrapper.style.zIndex = "2147484001";

      var iframe = document.createElement("iframe");
      iframe.src = RubiconEndpoint(skipAnimation);
      iframe.style.width = "100%";
      iframe.style.height = "100%";
      iframe.style.border = "none";
      wrapper.appendChild(iframe);
      document.body.appendChild(wrapper);

      divider = document.createElement("div");
      divider.id = "aibot-divider";
      divider.style.position = "fixed";
      divider.style.top = "0";
      divider.style.right = SIDEPANEL_WIDTH + "px";
      divider.style.width = "2px";
      divider.style.height = "100vh";
      divider.style.backgroundColor = "#ccc";
      divider.style.zIndex = "9998";
      document.body.appendChild(divider);

      if (skipAnimation) {
        wrapper.style.transform = "translateX(0)";
      } else {
        setTimeout(function () {
          wrapper.style.transform = "translateX(0)";
        }, 10);
      }
    } else {
      wrapper.style.transform = "translateX(100%)";
      divider.remove();

      setTimeout(function () {
        while (mainContent.firstChild) {
          document.body.insertBefore(mainContent.firstChild, mainContent);
        }
        mainContent.remove();
        wrapper.remove();
      }, 400);
    }
  }

  function _findCartButton() {
    if (rubiconConfig.locale === "ko") {
      return document.querySelector(".utility__button__cart");
    } else {
      return document.querySelector(
        ".nv00-gnb-v4__container .nv00-gnb-v4__utility-cart"
      );
    }
  }

  if (rubiconConfig.environment === "devcra") {
    buttonWrapper = document.createElement("div");
    buttonWrapper.innerHTML = _renderButton();

    var button =
      buttonWrapper.querySelector("button") || buttonWrapper.querySelector("a");

    var tryInsert = function () {
      var targetElement = _findCartButton();
      if (targetElement && targetElement.parentNode) {
        targetElement.parentNode.insertBefore(
          buttonWrapper.firstElementChild,
          targetElement
        );
        return true;
      }
      return false;
    };

    if (!tryInsert()) {
      var observer = new MutationObserver(function () {
        if (tryInsert()) observer.disconnect();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    button.onclick = () => _toggleRubicon(false);
  }

  window.addEventListener("message", function (event) {
    // expected shape:
    // {
    //   type: 'rubicon-action',
    //   data: {
    //     id: string,
    //     actions: Array<{ action: 'CLICK' | 'SCROLL' | 'GO_TO', selector?, xpath?, value? }>
    //   }
    // }
    if (!event || !event.data) return;

    const { type, method, args } = event.data;

    if (!ALLOWED_RUBICON_ORIGINS.includes(event.origin)) return;

    console.log("[RUBICON] received message:", event.origin, event.data);
    if (
      type === "rubicon-command" &&
      window.rubicon &&
      typeof window.rubicon[method] === "function"
    ) {
      try {
        console.log(
          `[RUBICON] iframe command: rubicon.${method}(${(args || []).join(
            ", "
          )})`
        );

        try {
          const result = window.rubicon[method](...(args || []));
          if (result instanceof Promise) {
            result
              .then((res) => {
                event.source.postMessage(
                  {
                    type: "rubicon-response",
                    method,
                    requestId: event.data.requestId,
                    result: res,
                  },
                  event.origin
                );
              })
              .catch((err) => {
                event.source.postMessage(
                  {
                    type: "rubicon-response",
                    method,
                    requestId: event.data.requestId,
                    error: String(err),
                  },
                  event.origin
                );
              });
          } else {
            event.source.postMessage(
              {
                type: "rubicon-response",
                method,
                requestId: event.data.requestId,
                result,
              },
              event.origin
            );
          }
        } catch (e) {
          console.error("[RUBICON] Execution error:", e);
        }
      } catch (e) {
        console.error("[RUBICON] Command failed:", method, e);
      }
    }
  });

  function RubiconOrigin() {
    return rubiconConfig.locale === "ko"
      ? RUBICON_KO_ORIGIN
      : RUBICON_UK_ORIGIN;
  }
  function RubiconEndpoint(skipAnimation = false) {
    const endpoint =
      (rubiconConfig.locale === "ko" ? RUBICON_KO_URL : RUBICON_UK_URL) +
      `${skipAnimation ? "/?skipIntro=Y" : ""}`;
    console.log("[RUBICON] RubiconEndpoint", endpoint);

    return endpoint;
  }
  function initRubicon() {
    console.log("[RUBICON] initRubicon", { rubiconConfig });
    const shouldOpen = localStorage.getItem("rubicon-pending-iframe") === "1";
    if (shouldOpen && !visible) {
      _toggleRubicon(true);
      localStorage.removeItem("rubicon-pending-iframe");
    }

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("rubicon-actions:")) {
        console.log("[RUBICON] found actions:", key);
        const id = key.split(":")[1];
        console.log(window.rubicon);
        window.rubicon.consumeActions(id);
      }
    }
  }

  const _sendMessage = (message) => {
    const iframe = document
      .getElementById("aibot-wrapper")
      ?.querySelector("iframe");

    if (!iframe) {
      console.warn("[RUBICON] iframe not found when trying to send message");
      return;
    }

    console.log("[RUBICON] sending send-message:", message);
    iframe.contentWindow?.postMessage(
      { type: "send-message", data: message },
      RubiconOrigin()
    );
  };

  window.rubicon = {
    getMetadata: () => {
      const currentUrl = window.location.href;
      const mainContent = document.getElementById("main-content");
      const currentHtml = mainContent ? mainContent.innerHTML : null;
      return {
        currentUrl,
        currentHtml,
      };
    },
    takeSnapshot: () => {
      return new Promise((resolve, reject) => {
        function loadHtml2CanvasIfNeeded() {
          return new Promise((res, rej) => {
            if (typeof html2canvas !== "undefined") return res();
            const script = document.createElement("script");
            script.src =
              "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
            script.onload = res;
            script.onerror = rej;
            document.head.appendChild(script);
          });
        }

        loadHtml2CanvasIfNeeded()
          .then(() => {
            const target =
              document.getElementById("main-content") || document.body;
            html2canvas(target, {
              useCORS: true,
              allowTaint: true,
              logging: false,
              windowWidth: document.documentElement.scrollWidth,
              windowHeight: document.documentElement.scrollHeight,
            })
              .then((canvas) => {
                const base64 = canvas.toDataURL("image/png");
                resolve(base64);
              })
              .catch((err) => {
                reject(err);
              });
          })
          .catch(reject);
      });
    },
    toggleRubicon: () => _toggleRubicon(false),

    openRubicon: (initialMessage) => {
      console.log("[RUBICON] openRubicon", { initialMessage });
      //openRubicon(initialMessage: string?)

      const handleReady = (event) => {
        if (
          event.data?.type === "rubicon-ready" &&
          ALLOWED_ORIGINS.includes(event.origin)
        ) {
          console.log("[RUBICON] iframe reported ready, sending message");
          window.removeEventListener("message", handleReady);
          _sendMessage(initialMessage);
        }
      };

      if (!visible) {
        if (initialMessage) {
          window.addEventListener("message", handleReady);

          const observer = new MutationObserver(() => {
            const iframe = document
              .getElementById("aibot-wrapper")
              ?.querySelector("iframe");

            if (iframe) {
              observer.disconnect();

              iframe.onload = () => {
                console.log("[RUBICON] iframe loaded (onload)");
                // rubicon-ready를 기다리기 위해 handleReady는 이미 등록됨
              };
            }
          });

          observer.observe(document.body, { childList: true, subtree: true });
        }

        _toggleRubicon(initialMessage ? true : false);
      }
    },

    canAskRubicon: () => {
      if (visible) {
        return true;
      }
      return false;
    },
    askRubicon: (message) => {
      if (window.rubicon.canAskRubicon()) {
        _sendMessage(message);
      }
    },

    addActions: (id, actions, autoRun = false) => {
      console.log("[RUBICON] addActions", { id, actions, autoRun });
      if (typeof id === "string" && Array.isArray(actions)) {
        try {
          localStorage.setItem(
            `rubicon-actions:${id}`,
            JSON.stringify(actions)
          );

          if (autoRun) {
            window.rubicon.consumeActions(id);
          }
        } catch (e) {
          console.error("[RUBICON] Failed to store actions:", e);
        }
      }
    },

    consumeActions: (id) => {
      console.log("[RUBICON] consumeActions", { id });
      if (runningIds.has(id)) return;
      const raw = localStorage.getItem(`rubicon-actions:${id}`);
      if (!raw) return;
      const list = JSON.parse(raw);
      if (!list.length) return;

      if (!visible) {
        _toggleRubicon(true);
      }

      runningIds.add(id);

      const runNext = () => {
        const current = list.shift();
        if (!current) {
          localStorage.removeItem(`rubicon-actions:${id}`);
          runningIds.delete(id);

          return;
        }

        localStorage.setItem(`rubicon-actions:${id}`, JSON.stringify(list));

        if (_satellite.cookie.get("guid_1_") === "ss2e708wmj") {
          alert("[RUBICON] consumeActions", { current });
        }

        try {
          switch (current.action) {
            case "GO_TO":
              if (current.value) {
                setTimeout(() => {
                  window.location.href = current.value;
                }, 100);
                return;
              }
              break;
            case "CLICK": {
              if (_satellite.cookie.get("guid_1_") === "ss2e708wmj") {
                debugger;
              }
              let el = current.selector
                ? document.querySelector(current.selector)
                : null;
              if (!el && current.xpath) el = getElementByXpath(current.xpath);
              const success = !!el;
              if (el) el.click();

              // 마지막 CLICK 액션인 경우 iframe을 다시 열도록 플래그 설정
              if (list.length === 0) {
                localStorage.setItem("rubicon-pending-iframe", "1");
              }
              if (_satellite.cookie.get("guid_1_") === "ss2e708wmj") {
                alert(
                  `[RUBICON] CLICK action ${success ? "succeeded" : "failed"}`
                );
              }
              break;
            }
            case "SCROLL": {
              let el = current.selector
                ? document.querySelector(current.selector)
                : null;
              if (!el && current.xpath) el = getElementByXpath(current.xpath);
              const success = !!el;
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "center" });
                const observer = new IntersectionObserver(
                  (entries, observer) => {
                    const visible = entries.some(
                      (entry) => entry.isIntersecting
                    );
                    if (visible) {
                      observer.disconnect();
                      console.log("[RUBICON] SCROLL confirmed visible");
                      setTimeout(runNext, 200);
                    }
                  }
                );
                observer.observe(el);
                return;
              }
              console.log(
                `[RUBICON] SCROLL action ${success ? "succeeded" : "failed"}`
              );
              break;
            }
            default:
              console.warn("Unknown action type:", current.action);
          }

          console.log("[RUBICON] consumed action", current.action);
        } catch (e) {
          console.error("[RUBICON] Action execution failed:", e);
        }

        if (list.length > 0) return setTimeout(runNext, 500);

        localStorage.removeItem(`rubicon-actions:${id}`);
        runningIds.delete(id);
      };

      runNext();
    },

    inspectActions: () => {
      if (_satellite.cookie.get("guid_1_") !== "ss2e708wmj") {
        debugger;
      }
      const entries = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("rubicon-actions:")) {
          try {
            const actions = JSON.parse(localStorage.getItem(key));
            entries.push({ id: key.split(":")[1], actions });
          } catch (e) {
            console.error("[RUBICON] Failed to parse:", key, e);
          }
        }
      }

      // console.log("[RUBICON] inspectActions", { entries });
      if (_satellite.cookie.get("guid_1_") === "ss2e708wmj") {
        alert(
          "[RUBICON] inspectActions:\n\n" + JSON.stringify(entries, null, 2)
        );
      }
    },

    clearActions: () => {
      console.log("[RUBICON] clearActions");
      const removed = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("rubicon-actions:")) {
          removed.push(key);
        }
      }
      removed.forEach((key) => localStorage.removeItem(key));
      console.log(`[RUBICON] Cleared ${removed.length} action(s):`, removed);
    },
  };

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", initRubicon);
  } else {
    initRubicon();
  }
})();

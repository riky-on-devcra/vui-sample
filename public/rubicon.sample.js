(function () {
  const SIDEPANEL_WIDTH = 375;
  const TRANSITION_DURATION = "0.4s";
  const TRANSITION_CURVE = "cubic-bezier(0.4, 0, 0.2, 1)";

  var visible = false;
  var mainContent, wrapper, divider, buttonWrapper;

  buttonWrapper = document.createElement("div");
  buttonWrapper.innerHTML =
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
    "</div>";

  var button = buttonWrapper.querySelector("button");

  var tryInsert = function () {
    var targetElement = document.querySelector(".utility__button__cart");
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

  button.onclick = function () {
    visible = !visible;

    if (visible) {
      mainContent = document.createElement("div");
      mainContent.id = "main-content";
      mainContent.style.height = "100vh";
      mainContent.style.overflowY = "auto";
      mainContent.style.width = "calc(100% - " + SIDEPANEL_WIDTH + "px)";
      mainContent.style.transition =
        "width " + TRANSITION_DURATION + " " + TRANSITION_CURVE;
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
      wrapper.style.transition =
        "transform " + TRANSITION_DURATION + " " + TRANSITION_CURVE;
      wrapper.style.overflowY = "hidden";
      wrapper.style.zIndex = "9999";

      var iframe = document.createElement("iframe");
      iframe.src = "https://dev-aibot-kr.samsunggenai.com/";
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

      setTimeout(function () {
        wrapper.style.transform = "translateX(0)";
      }, 10);
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
  };

  window.addEventListener("message", function (event) {
    if (event && event.data && event.data.type === "rubicon-action") {
      alert(event.data.data); // 예: "helloworld"
    }
  });
})();

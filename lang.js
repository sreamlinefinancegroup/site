/* Automatic language: shows the site in the visitor's browser language (Spain -> Spanish,
   Japan -> Japanese ...) using Google Translate. Visitors can switch back to English any time;
   their choice is remembered. Search-engine bots always get the original English. */
(function () {
  var CODES = "en,es,fr,de,it,pt,nl,pl,sv,no,da,fi,el,cs,hu,ro,bg,hr,ru,uk,tr,ar,iw,fa,hi,zh-CN,zh-TW,ja,ko,th,vi,id,ms,tl,sw,am,ha,yo".split(",");
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function detect() {
    var list = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || "en"];
    for (var i = 0; i < list.length; i++) {
      var l = String(list[i]).toLowerCase();
      if (l.indexOf("zh") === 0) return /tw|hk|mo|hant/.test(l) ? "zh-TW" : "zh-CN";
      var b = l.split("-")[0];
      if (b === "he") b = "iw";
      if (b === "nb" || b === "nn") b = "no";
      if (b === "fil") b = "tl";
      if (b === "en") return "en";
      if (CODES.indexOf(b) > -1) return b;
    }
    return "en";
  }
  function setCookie(code) {
    var val = code && code !== "en" ? "/en/" + code : "";
    var exp = val ? "" : ";expires=Thu, 01 Jan 1970 00:00:00 GMT";
    var host = location.hostname.replace(/^www\./, "");
    document.cookie = "googtrans=" + val + ";path=/" + exp;
    if (host.indexOf(".") > -1) document.cookie = "googtrans=" + val + ";path=/;domain=." + host + exp;
  }
  var isBot = /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|lighthouse|headless|preview/i.test(navigator.userAgent);
  var saved = store("site-lang");
  var lang = saved || (isBot ? "en" : detect());
  if (CODES.indexOf(lang) < 0) lang = "en";

  setCookie(lang);
  if (lang !== "en") {
    var el = document.createElement("div");
    el.id = "gt_el"; el.style.display = "none";
    document.body.appendChild(el);
    window.gtInit = function () {
      new google.translate.TranslateElement({ pageLanguage: "en", includedLanguages: CODES.join(","), autoDisplay: false }, "gt_el");
    };
    var s = document.createElement("script");
    s.src = "https://translate.google.com/translate_a/element.js?cb=gtInit";
    s.async = true;
    document.head.appendChild(s);
  }

  // Language menu
  var wrap = document.querySelector(".lang");
  if (!wrap) return;
  var btn = wrap.querySelector(".lang-btn"), list = wrap.querySelector(".lang-list"), cur = wrap.querySelector(".lang-cur");
  cur.textContent = lang === "iw" ? "HE" : lang.split("-")[0].toUpperCase();
  var mine = list.querySelector('[data-lang="' + lang + '"]');
  if (mine) mine.setAttribute("aria-current", "true");
  function close() { list.hidden = true; btn.setAttribute("aria-expanded", "false"); }
  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    list.hidden = !list.hidden;
    btn.setAttribute("aria-expanded", String(!list.hidden));
  });
  document.addEventListener("click", function (e) { if (!wrap.contains(e.target)) close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  list.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-lang]");
    if (!b) return;
    var code = b.getAttribute("data-lang");
    store("site-lang", code);
    setCookie(code);
    location.reload();
  });
})();

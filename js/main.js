/* ============================================================
   冯先生 AI工程实验室 · 站点渲染
   内容全部来自 content/site.json（后台 /admin 可改）
   ============================================================ */
(function () {
  "use strict";

  var C = window.SITE_CONTENT || {};

  function $(id) { return document.getElementById(id); }
  function h(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function fill(id, text) { var n = $(id); if (n && text != null) n.textContent = text; }
  function list(parent) { var n = parent; n.innerHTML = ""; return n; }

  /* ---------------- 元信息 ---------------- */
  function renderSeo(s) {
    if (!s) return;
    if (s.title) document.title = s.title;
    var set = function (sel, attr, val) {
      var n = document.querySelector(sel);
      if (n && val) n.setAttribute(attr, val);
    };
    set('meta[name="description"]', "content", s.description);
    set('meta[name="keywords"]', "content", s.keywords);
    set('meta[name="author"]', "content", s.author);
    set('meta[property="og:title"]', "content", s.ogTitle);
    set('meta[property="og:description"]', "content", s.ogDesc);
    set('meta[property="og:image"]', "content", s.ogImage);
    set('meta[property="og:url"]', "content", s.url);
    set('meta[name="theme-color"]', "content", s.themeColor);
  }

  /* ---------------- 导航 ---------------- */
  function renderNav(c) {
    if (c.brand) { fill("brandName", c.brand.name); fill("brandSub", c.brand.sub); }
    var nav = $("site-nav");
    if (!nav) return;
    list(nav);
    (c.nav || []).forEach(function (item) {
      var a = h("a", item.cta ? "nav-cta" : "", item.label);
      a.href = item.href || "#";
      nav.appendChild(a);
    });
    var footNav = $("footNav");
    if (footNav) {
      list(footNav);
      (c.footer && c.footer.nav || []).forEach(function (item) {
        var a = h("a", "", item.label); a.href = item.href || "#";
        footNav.appendChild(a);
      });
    }
  }

  /* ---------------- 首屏 ---------------- */
  function renderHero(c) {
    var hero = c.hero || {};
    fill("heroEyebrow", hero.eyebrow);
    var t = $("heroTitle");
    if (t) {
      t.innerHTML = "";
      t.appendChild(document.createTextNode(hero.title || ""));
      if (hero.titleHighlight) {
        t.appendChild(document.createElement("br"));
        var span = h("span", "", hero.titleHighlight);
        t.appendChild(span);
      }
    }
    var chip = $("featuredChip");
    if (chip && hero.featured) {
      list(chip);
      var badge = h("b", "chip-badge", hero.featured.badge || "主推产品");
      chip.appendChild(badge);
      chip.appendChild(h("strong", "", hero.featured.name || ""));
      chip.appendChild(h("em", "", hero.featured.position || ""));
      chip.addEventListener("click", function () { openQr(0); });
      chip.setAttribute("role", "button");
      chip.setAttribute("tabindex", "0");
    }
    fill("heroLead", hero.lead);

    var acts = $("heroActions");
    if (acts) {
      list(acts);
      (hero.actions || []).forEach(function (a) {
        if (a.href === "#qr") {
          var btn = h("button", "button button-primary", a.label);
          btn.type = "button";
          btn.addEventListener("click", function () { openQr(0); });
          acts.appendChild(btn);
        } else {
          var link = h("a", "button button-secondary", a.label);
          link.href = a.href || "#products";
          acts.appendChild(link);
        }
      });
    }

    var mets = $("heroMetrics");
    if (mets) {
      list(mets);
      (hero.metrics || []).forEach(function (m) {
        var d = h("div", "");
        d.appendChild(h("strong", "", m.num));
        d.appendChild(h("span", "", m.label));
        mets.appendChild(d);
      });
    }

    var trusted = $("trustedLine");
    if (trusted) {
      list(trusted);
      (hero.trusted || []).forEach(function (s, i) {
        if (i > 0) trusted.appendChild(h("i", ""));
        trusted.appendChild(h("span", "", s));
      });
    }

    renderHeroVisual(c);
  }

  function phoneNode(product, cls, extra) {
    var p = h("div", "phone " + cls);
    var screen = h("div", "phone-screen");
    screen.appendChild(h("div", "phone-top"));
    var img = h("img", "");
    img.src = product.icon || "";
    img.alt = (product.title || "") + " 产品图标";
    screen.appendChild(img);
    screen.appendChild(h("h3", "", product.title));
    screen.appendChild(h("p", "", product.position));
    if (extra === "grid") {
      var g = h("div", "mini-grid");
      (product.tags || []).slice(0, 4).forEach(function (t) { g.appendChild(h("span", "", t)); });
      screen.appendChild(g);
    } else if (extra === "dash") {
      var d = h("div", "dash-card");
      d.appendChild(h("b", "", "今日工作"));
      d.appendChild(h("span", "", "进度、检查、整改、协同"));
      screen.appendChild(d);
      var pr = h("div", "progress");
      var bar = h("i", "");
      bar.style.width = "78%";
      pr.appendChild(bar);
      screen.appendChild(pr);
    } else if (extra === "chart") {
      var cb = h("div", "chart-bars");
      ["35%", "52%", "44%", "68%", "88%"].forEach(function (w) {
        var i = h("i", ""); i.style.height = w; cb.appendChild(i);
      });
      screen.appendChild(cb);
    }
    p.appendChild(screen);
    return p;
  }

  function renderHeroVisual(c) {
    var vis = $("heroVisual");
    if (!vis) return;
    list(vis);
    var items = (c.products && c.products.items) || [];
    var main = null, side = [];
    items.forEach(function (p) {
      if (p.featured) main = p; else side.push(p);
    });
    if (!main && items.length) { main = items[1] || items[0]; side = items.filter(function (p) { return p !== main; }); }
    if (side[0]) vis.appendChild(phoneNode(side[0], "phone-left", "grid"));
    if (main) {
      var m = phoneNode(main, "phone-main", "dash");
      var badge = h("div", "phone-badge", "主推");
      m.appendChild(badge);
      vis.appendChild(m);
    }
    if (side[1]) vis.appendChild(phoneNode(side[1], "phone-right", "chart"));
  }

  /* ---------------- 为什么开发 ---------------- */
  function renderStory(c) {
    var s = c.story || {};
    fill("storyEyebrow", s.eyebrow);
    fill("storyTitle", s.title);
    fill("storyDesc", s.desc);
    var grid = $("painGrid");
    if (!grid) return;
    list(grid);
    (s.pains || []).forEach(function (p) {
      var art = h("article", "pain-card reveal");
      art.appendChild(h("span", "", p.num));
      art.appendChild(h("h3", "", p.title));
      art.appendChild(h("p", "", p.text));
      grid.appendChild(art);
    });
  }

  /* ---------------- 产品 ---------------- */
  function renderProducts(c) {
    var p = c.products || {};
    fill("prodEyebrow", p.eyebrow);
    fill("prodTitle", p.title);
    fill("prodDesc", p.desc);
    var grid = $("productGrid");
    if (!grid) return;
    list(grid);
    (p.items || []).forEach(function (item, idx) {
      var card = h("article", "product-card reveal" + (item.featured ? " featured" : ""));
      if (item.badge) card.appendChild(h("div", "product-badge", item.badge));
      var iconWrap = h("div", "product-icon");
      var icon = h("img", ""); icon.src = item.icon || ""; icon.alt = "";
      iconWrap.appendChild(icon);
      card.appendChild(iconWrap);
      card.appendChild(h("div", "product-number", item.number));
      card.appendChild(h("h3", "", item.title));
      card.appendChild(h("p", "product-position", item.position));
      card.appendChild(h("p", "", item.desc));
      var tags = h("ul", "tag-list");
      (item.tags || []).forEach(function (t) { tags.appendChild(h("li", "", t)); });
      card.appendChild(tags);
      var btn = h("button", "text-button product-detail");
      btn.type = "button";
      btn.appendChild(document.createTextNode(item.detailLabel || "查看详细功能 "));
      btn.appendChild(h("span", "", "→"));
      btn.addEventListener("click", function () { openDetail(idx); });
      card.appendChild(btn);
      grid.appendChild(card);
    });
  }

  /* ---------------- 能力 ---------------- */
  function renderCapabilities(c) {
    var cap = c.capabilities || {};
    fill("capEyebrow", cap.eyebrow);
    fill("capTitle", cap.title);
    fill("capDesc", cap.desc);
    var grid = $("capGrid");
    if (!grid) return;
    list(grid);
    (cap.items || []).forEach(function (it) {
      var card = h("article", "capability-card reveal");
      var img = h("img", ""); img.src = it.icon || ""; img.alt = "";
      card.appendChild(img);
      card.appendChild(h("h3", "", it.title));
      card.appendChild(h("p", "", it.text));
      grid.appendChild(card);
    });
  }

  /* ---------------- 实践 ---------------- */
  function renderPractice(c) {
    var p = c.practice || {};
    fill("pracEyebrow", p.eyebrow);
    fill("pracTitle", p.title);
    fill("pracDesc", p.desc);
    var pr = $("principles");
    if (pr) {
      list(pr);
      (p.principles || []).forEach(function (it) {
        var d = h("div", "");
        d.appendChild(h("strong", "", it.num));
        var sp = h("span", "");
        sp.appendChild(h("b", "", it.title));
        sp.appendChild(document.createTextNode(it.text || ""));
        d.appendChild(sp);
        pr.appendChild(d);
      });
    }
    var tl = $("timelineItems");
    if (tl) {
      list(tl);
      (p.timeline || []).forEach(function (it) {
        var art = h("article", "");
        art.appendChild(h("span", "", it.tag));
        art.appendChild(h("h3", "", it.title));
        art.appendChild(h("p", "", it.text));
        tl.appendChild(art);
      });
    }
  }

  /* ---------------- 关于 ---------------- */
  function renderAbout(c) {
    var a = c.about || {};
    var img = $("portraitImg");
    if (img && a.portrait) { img.src = a.portrait; img.alt = "冯先生个人形象"; }
    fill("portraitNote", a.portraitNote);
    var stats = $("aboutStats");
    if (stats) {
      list(stats);
      (a.stats || []).forEach(function (s) {
        var d = h("div", "");
        d.appendChild(h("strong", "", s.num));
        d.appendChild(h("span", "", s.label));
        stats.appendChild(d);
      });
    }
    fill("aboutEyebrow", a.eyebrow);
    var t = $("aboutTitle");
    if (t) {
      t.innerHTML = "";
      t.appendChild(document.createTextNode((a.title || "") + "，"));
      t.appendChild(document.createElement("br"));
      t.appendChild(document.createTextNode(a.titleHighlight || ""));
    }
    var ps = $("aboutParas");
    if (ps) {
      list(ps);
      (a.paragraphs || []).forEach(function (p) { ps.appendChild(h("p", "", p)); });
    }
    fill("aboutQuote", a.quote);
  }

  /* ---------------- 联系 ---------------- */
  function renderContact(c) {
    var ct = c.contact || {};
    fill("contactEyebrow", ct.eyebrow);
    fill("contactTitle", ct.title);
    fill("contactDesc", ct.desc);
    var mail = $("mailBtn");
    if (mail && ct.mailButton) {
      mail.textContent = ct.mailButton.label || "发送邮件";
      mail.href = ct.mailButton.href || "mailto:";
    }
    var qr = $("qrGrid");
    if (qr) {
      list(qr);
      (ct.qrCards || []).forEach(function (it, i) {
        var card = h("article", "qr-card reveal" + (it.primary ? " qr-primary" : ""));
        var image = h("img", ""); image.src = it.img || ""; image.alt = (it.title || "") + " 小程序码";
        card.appendChild(image);
        var info = h("div", "");
        info.appendChild(h("h3", "", it.title));
        info.appendChild(h("p", "", it.sub));
        if (it.note) info.appendChild(h("small", "", it.note));
        card.appendChild(info);
        card.addEventListener("click", function () { openQr(i); });
        qr.appendChild(card);
      });
    }
    var ci = $("contactInfo");
    if (ci) {
      list(ci);
      (ct.contactInfo || []).forEach(function (it) {
        var node = it.href ? h("a", "") : h("div", "");
        if (it.href) node.href = it.href;
        node.appendChild(h("span", "", it.label));
        node.appendChild(h("strong", "", it.value));
        ci.appendChild(node);
      });
    }
  }

  /* ---------------- 页脚 ---------------- */
  function renderFooter(c) {
    var f = c.footer || {};
    fill("footName", (c.brand && c.brand.footerName) || (c.brand && c.brand.name));
    fill("footTagline", (c.brand && c.brand.footerTagline) || "");
    fill("footCopyright", f.copyright);
    fill("footDisclaimer", f.disclaimer);
  }

  /* ---------------- 弹窗 ---------------- */
  function openDetail(idx) {
    var item = ((C.products && C.products.items) || [])[idx];
    if (!item || !item.detail) return;
    fill("modal-eyebrow", item.detail.eyebrow);
    fill("modal-title", item.title);
    fill("modal-summary", item.detail.summary);
    fill("modal-purpose", item.detail.purpose);
    var icon = $("modal-icon");
    if (icon) { icon.src = item.icon || ""; icon.alt = ""; }
    var ul = $("modal-features");
    if (ul) {
      ul.innerHTML = "";
      (item.detail.features || []).forEach(function (f) { ul.appendChild(h("li", "", f)); });
    }
    var m = $("product-modal");
    if (m && m.showModal) m.showModal();
  }

  function openQr(idx) {
    var cards = (C.contact && C.contact.qrCards) || [];
    var item = cards[idx] || cards[0];
    if (!item) return;
    fill("qr-modal-title", item.title);
    fill("qr-modal-sub", item.sub);
    var img = $("qr-modal-img");
    if (img) { img.src = item.img || ""; img.alt = (item.title || "") + " 小程序码"; }
    var m = $("qr-modal");
    if (m && m.showModal) m.showModal();
  }

  function bindDialogs() {
    ["product-modal", "qr-modal"].forEach(function (id) {
      var m = $(id);
      if (!m) return;
      m.querySelectorAll(".modal-close").forEach(function (b) {
        b.addEventListener("click", function () { m.close(); });
      });
      m.addEventListener("click", function (e) { if (e.target === m) m.close(); });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && m.open) m.close();
      });
    });
  }

  /* ---------------- 交互 ---------------- */
  function bindChrome() {
    var header = document.querySelector(".site-header");
    var navToggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".site-nav");
    var backTop = document.querySelector(".back-top");

    var updateScrollState = function () {
      if (header) header.classList.toggle("scrolled", window.scrollY > 20);
      if (backTop) backTop.classList.toggle("visible", window.scrollY > 650);
    };
    window.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();

    if (navToggle && nav) {
      navToggle.addEventListener("click", function () {
        var open = nav.classList.toggle("open");
        navToggle.classList.toggle("active", open);
        navToggle.setAttribute("aria-expanded", String(open));
      });
      nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          nav.classList.remove("open");
          navToggle.classList.remove("active");
          navToggle.setAttribute("aria-expanded", "false");
        });
      });
    }
    if (backTop) backTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  }

  function bindReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (n) { n.classList.add("in-view"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------------- 启动 ---------------- */
  function render(c) {
    renderSeo(c.seo);
    renderNav(c);
    renderHero(c);
    renderStory(c);
    renderProducts(c);
    renderCapabilities(c);
    renderPractice(c);
    renderAbout(c);
    renderContact(c);
    renderFooter(c);
  }

  function boot() {
    bindDialogs();
    bindChrome();
    C = C || {};
    render(C);
    bindReveal();

    /* 先用 site.js 里的内容同步渲染（无白屏），再从 site.json 后台刷新一次，
       这样即便只改了 JSON 没重新生成 site.js 也能生效。 */
    if ((location.protocol === "http:" || location.protocol === "https:") && window.fetch) {
      fetch("content/site.json", { cache: "no-cache" })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) {
          if (!j || !j.hero) return;
          if (JSON.stringify(j) === JSON.stringify(C)) return;
          C = j;
          render(C);
          bindReveal();
        })
        .catch(function () { /* 离线或接口异常时保持 site.js 内容 */ });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();

/* ==========================================================================
   course.js — the runtime that powers every lesson page.
   Responsibilities:
     • Resolve the path back to the repo root (works at any folder depth).
     • Theme (light/dark) with persistence.
     • Build the sidebar table-of-contents from the COURSE manifest.
     • Wire Next / Previous buttons across all AVAILABLE lessons.
     • Track per-lesson completion + overall progress in localStorage.
     • Boot the locally-vendored Monaco editor and turn every <div.editor>
       into an interactive, copyable, resettable code editor — fully offline.
   No build step, no framework: plain ES5-friendly JS so it runs from file://.
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ *
   * 0. Paths. Each page sets window.COURSE_ROOT (e.g. "../../" or "./").
   * ------------------------------------------------------------------ */
  var ROOT = window.COURSE_ROOT || "./";
  var ROOT_ABS = new URL(ROOT, window.location.href).href;
  if (ROOT_ABS.charAt(ROOT_ABS.length - 1) !== "/") ROOT_ABS += "/";
  var CURRENT_ID = window.COURSE_LESSON_ID || null;

  function rootHref(repoRelativePath) {
    return ROOT + repoRelativePath;
  }

  /* ------------------------------------------------------------------ *
   * 1. localStorage helpers (progress + theme).
   * ------------------------------------------------------------------ */
  var LS_DONE = "course:done";
  var LS_THEME = "course:theme";

  function getDone() {
    try { return JSON.parse(localStorage.getItem(LS_DONE) || "{}"); }
    catch (e) { return {}; }
  }
  function setDone(map) {
    try { localStorage.setItem(LS_DONE, JSON.stringify(map)); } catch (e) {}
  }
  function isDone(id) { return !!getDone()[id]; }
  function toggleDone(id, value) {
    var m = getDone();
    if (value) m[id] = 1; else delete m[id];
    setDone(m);
  }

  /* ------------------------------------------------------------------ *
   * 2. Theme.
   * ------------------------------------------------------------------ */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(LS_THEME, theme); } catch (e) {}
    if (window.__monacoReady && window.monaco) {
      window.monaco.editor.setTheme(theme === "dark" ? "course-dark" : "course-light");
    }
    var btn = document.querySelector("[data-theme-toggle]");
    if (btn) btn.textContent = theme === "dark" ? "☀️" : "🌙";
  }
  function initTheme() {
    var saved;
    try { saved = localStorage.getItem(LS_THEME); } catch (e) {}
    if (!saved) {
      saved = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    applyTheme(saved);
  }

  /* ------------------------------------------------------------------ *
   * 3. Sidebar TOC + progress bar.
   * ------------------------------------------------------------------ */
  function buildSidebar() {
    var nav = document.querySelector("[data-toc]");
    if (!nav || !window.COURSE) return;
    var done = getDone();
    var html = "";

    // Progress bar across all available lessons.
    var available = window.COURSE_FLAT.filter(function (l) { return l.status === "available"; });
    var completed = available.filter(function (l) { return done[l.id]; }).length;
    var pct = available.length ? Math.round((completed / available.length) * 100) : 0;
    html +=
      '<div class="progress-wrap">' +
        "<div>Your progress · <b>" + completed + "/" + available.length + "</b> lessons</div>" +
        '<div class="progress-bar"><span style="width:' + pct + '%"></span></div>' +
      "</div>";

    window.COURSE.parts.forEach(function (part) {
      var openAttr = "";
      // Auto-open the part containing the current lesson.
      if (CURRENT_ID && part.lessons.some(function (l) { return l.id === CURRENT_ID; })) openAttr = " open";
      html += '<details class="toc-part"' + openAttr + ">";
      html += '<summary><span class="pnum">P' + part.num + '</span> ' + esc(part.title) + '<span class="chev">▶</span></summary>';
      html += '<ul class="toc-lessons">';
      part.lessons.forEach(function (l) {
        var cls = [];
        if (l.id === CURRENT_ID) cls.push("current");
        if (done[l.id]) cls.push("done");
        var tick = done[l.id] ? "✓" : "○";
        if (l.status !== "available") {
          html += '<li><a class="soon" aria-disabled="true">' +
            '<span class="tick">○</span><span class="ttl">' + esc(l.id) + " · " + esc(l.title) +
            '</span><span class="soon-tag">soon</span></a></li>';
        } else {
          html += '<li><a class="' + cls.join(" ") + '" href="' + rootHref(l.file) + '">' +
            '<span class="tick">' + tick + "</span>" +
            "<span>" + esc(l.id) + " · " + esc(l.title) + "</span></a></li>";
        }
      });
      html += "</ul></details>";
    });
    nav.innerHTML = html;
  }

  /* ------------------------------------------------------------------ *
   * 4. Breadcrumb + Next/Prev + mark-complete (lesson pages only).
   * ------------------------------------------------------------------ */
  function findCurrentIndex() {
    if (!CURRENT_ID) return -1;
    return window.COURSE_FLAT.findIndex(function (l) { return l.id === CURRENT_ID; });
  }
  function neighbour(direction) {
    var idx = findCurrentIndex();
    if (idx < 0) return null;
    var step = direction;
    var i = idx + step;
    while (i >= 0 && i < window.COURSE_FLAT.length) {
      if (window.COURSE_FLAT[i].status === "available") return window.COURSE_FLAT[i];
      i += step;
    }
    return null;
  }
  function buildBreadcrumb() {
    var bc = document.querySelector("[data-breadcrumb]");
    if (!bc) return;
    var idx = findCurrentIndex();
    if (idx < 0) return;
    var l = window.COURSE_FLAT[idx];
    bc.innerHTML = l.partIcon + " <b>Part " + l.partNum + "</b> · " + esc(l.partTitle) +
      "&nbsp;&nbsp;›&nbsp;&nbsp;" + esc(l.id);
  }
  function buildFooterNav() {
    var prevEl = document.querySelector("[data-nav-prev]");
    var nextEl = document.querySelector("[data-nav-next]");
    if (prevEl) {
      var p = neighbour(-1);
      if (p) {
        prevEl.href = rootHref(p.file);
        prevEl.classList.remove("disabled");
        prevEl.querySelector(".ttl").textContent = p.id + " · " + p.title;
      } else { prevEl.classList.add("disabled"); prevEl.querySelector(".ttl").textContent = "Start of course"; }
    }
    if (nextEl) {
      var n = neighbour(1);
      if (n) {
        nextEl.href = rootHref(n.file);
        nextEl.classList.remove("disabled");
        nextEl.querySelector(".ttl").textContent = n.id + " · " + n.title;
      } else { nextEl.classList.add("disabled"); nextEl.querySelector(".ttl").textContent = "More lessons coming soon"; }
    }
  }
  function initMarkComplete() {
    var btn = document.querySelector("[data-mark-complete]");
    if (!btn || !CURRENT_ID) return;
    function render() {
      var d = isDone(CURRENT_ID);
      btn.classList.toggle("done", d);
      btn.innerHTML = d ? "✓ Completed" : "○ Mark this lesson complete";
    }
    btn.addEventListener("click", function () {
      toggleDone(CURRENT_ID, !isDone(CURRENT_ID));
      render();
      buildSidebar();
    });
    render();
  }

  /* ------------------------------------------------------------------ *
   * 5. Misc UI: mobile nav, scroll-to-top.
   * ------------------------------------------------------------------ */
  function initChrome() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var backdrop = document.querySelector(".sidebar-backdrop");
    if (toggle) toggle.addEventListener("click", function () { document.body.classList.toggle("nav-open"); });
    if (backdrop) backdrop.addEventListener("click", function () { document.body.classList.remove("nav-open"); });
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.addEventListener("click", function () {
        var cur = document.documentElement.getAttribute("data-theme");
        applyTheme(cur === "dark" ? "light" : "dark");
      });
    });
    var top = document.querySelector("[data-scroll-top]");
    if (top) {
      top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
      window.addEventListener("scroll", function () { top.classList.toggle("show", window.scrollY > 600); });
    }
  }

  /* ------------------------------------------------------------------ *
   * 6. Monaco — vendored, offline.
   * ------------------------------------------------------------------ */
  var LANG_MAP = {
    ts: "typescript", typescript: "typescript", tsx: "typescript",
    js: "javascript", javascript: "javascript", jsx: "javascript",
    json: "json", html: "html", css: "css", scss: "scss",
    bash: "shell", sh: "shell", shell: "shell", sql: "sql",
    md: "markdown", yaml: "yaml", yml: "yaml", text: "plaintext"
  };

  function setupMonacoEnvironment() {
    // Same-origin worker (works over http/localhost; harmless fallback over file://).
    self.MonacoEnvironment = {
      getWorkerUrl: function () {
        return ROOT_ABS + "assets/monaco/vs/base/worker/workerMain.js";
      }
    };
  }

  function defineThemes(monaco) {
    monaco.editor.defineTheme("course-dark", {
      base: "vs-dark", inherit: true, rules: [],
      colors: { "editor.background": "#1e1e1e" }
    });
    monaco.editor.defineTheme("course-light", {
      base: "vs", inherit: true, rules: [],
      colors: { "editor.background": "#ffffff" }
    });
  }

  function configureTypeScript(monaco) {
    var ts = monaco.languages.typescript;
    var opts = {
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler || ts.ModuleResolutionKind.NodeJs,
      jsx: ts.JsxEmit.ReactJSX,
      strict: true,
      esModuleInterop: true,
      allowNonTsExtensions: true,
      skipLibCheck: true,
      lib: ["esnext", "dom", "dom.iterable"]
    };
    ts.typescriptDefaults.setCompilerOptions(opts);
    ts.javascriptDefaults.setCompilerOptions(opts);
    // Hide "cannot find module / no types" noise (no node_modules in the browser),
    // but keep real teaching diagnostics (type mismatches, etc.).
    var ignore = [2307, 7016, 2792, 2580, 2503];
    ts.typescriptDefaults.setDiagnosticsOptions({ diagnosticCodesToIgnore: ignore });
    ts.javascriptDefaults.setDiagnosticsOptions({ diagnosticCodesToIgnore: ignore, noSemanticValidation: true });
  }

  var editorSeq = 0;
  function createEditor(monaco, host, code, langKey) {
    var lang = LANG_MAP[langKey] || "typescript";
    var isDark = document.documentElement.getAttribute("data-theme") === "dark";
    var ext = langKey === "tsx" ? ".tsx" : langKey === "jsx" ? ".jsx" :
              lang === "typescript" ? ".ts" : lang === "javascript" ? ".js" : "";
    var model;
    if (ext) {
      var uri = monaco.Uri.parse("inmemory://course/snippet-" + (editorSeq++) + ext);
      model = monaco.editor.createModel(code, lang, uri);
    } else {
      model = monaco.editor.createModel(code, lang);
    }
    var lineCount = code.split("\n").length;
    var lineHeight = 20;
    var height = Math.min(Math.max(lineCount * lineHeight + 18, 56), 560);
    host.style.height = height + "px";

    var editor = monaco.editor.create(host, {
      model: model,
      theme: isDark ? "course-dark" : "course-light",
      fontSize: 14,
      lineHeight: lineHeight,
      fontFamily: 'JetBrains Mono, "Fira Code", Menlo, Consolas, monospace',
      fontLigatures: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      padding: { top: 10, bottom: 8 },
      roundedSelection: true,
      renderLineHighlight: "none",
      smoothScrolling: true,
      tabSize: 2,
      scrollbar: { alwaysConsumeMouseWheel: false, verticalScrollbarSize: 9, horizontalScrollbarSize: 9 }
    });
    return editor;
  }

  function initEditors(monaco) {
    var blocks = document.querySelectorAll(".editor");
    blocks.forEach(function (block) {
      var src = block.querySelector(".code-source");
      var host = block.querySelector(".monaco-host");
      if (!src || !host) return;
      var code = src.textContent.replace(/\n$/, "");
      var langKey = (block.getAttribute("data-lang") || "typescript").toLowerCase();
      var original = code;
      var editor = createEditor(monaco, host, code, langKey);

      var copyBtn = block.querySelector("[data-copy]");
      var resetBtn = block.querySelector("[data-reset]");
      if (copyBtn) {
        copyBtn.addEventListener("click", function () {
          var text = editor.getValue();
          var done = function () {
            copyBtn.classList.add("copied");
            var label = copyBtn.querySelector(".lbl");
            var prev = label ? label.textContent : null;
            if (label) label.textContent = "Copied!";
            setTimeout(function () { copyBtn.classList.remove("copied"); if (label) label.textContent = prev; }, 1400);
          };
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
          } else { fallbackCopy(text); done(); }
        });
      }
      if (resetBtn) {
        resetBtn.addEventListener("click", function () { editor.setValue(original); });
      }
    });
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }

  function bootMonaco() {
    if (!document.querySelector(".editor")) return; // No editors on this page.
    setupMonacoEnvironment();
    var loader = document.createElement("script");
    loader.src = ROOT_ABS + "assets/monaco/vs/loader.js";
    loader.onload = function () {
      window.require.config({ paths: { vs: ROOT_ABS + "assets/monaco/vs" } });
      window.require(["vs/editor/editor.main"], function () {
        try {
          defineThemes(window.monaco);
          configureTypeScript(window.monaco);
          window.__monacoReady = true;
          initEditors(window.monaco);
          document.body.classList.remove("no-js");
        } catch (e) {
          console.error("Monaco init failed:", e);
          document.body.classList.add("no-js"); // show <pre> fallback
        }
      });
    };
    loader.onerror = function () {
      console.error("Could not load vendored Monaco; showing plain code fallback.");
      document.body.classList.add("no-js");
    };
    document.head.appendChild(loader);
  }

  /* ------------------------------------------------------------------ *
   * 7. Helpers + boot.
   * ------------------------------------------------------------------ */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function boot() {
    initTheme();
    buildSidebar();
    buildBreadcrumb();
    buildFooterNav();
    initMarkComplete();
    initChrome();
    bootMonaco();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }

  // Expose a tiny API for the home page.
  window.CourseRuntime = { getDone: getDone, applyTheme: applyTheme, rootHref: rootHref };
})();

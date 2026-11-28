(() => {
  const STORAGE_KEY = "fordev_studio_state_v2";
  const WEB3_STORAGE_KEY = "fordev_v2_web3_files_v1";
  const BUILD_CFG_STORAGE_KEY = "fordev_v2_build_config_v1";
  const EDITOR_STORAGE_KEY = "fordev_studio_pro_editor_v1";
  const WEB3_SUPPORTED_TOOLS = new Set(["web-to-app", "web-pack"]);

  const QUICK_ICON_COLORS = [
    { name: "سماوي", hex: "#38bdf8" },
    { name: "أخضر", hex: "#34d399" },
    { name: "أحمر", hex: "#f87171" },
    { name: "ذهبي", hex: "#fbbf24" },
    { name: "بنفسجي", hex: "#a78bfa" }
  ];

  const toolsGrid = document.getElementById("toolsGrid");
  const activeToolBadge = document.getElementById("activeToolBadge");
  const activeToolHint = document.getElementById("activeToolHint");

  const sourceLangEl = document.getElementById("sourceLang");
  const targetLangEl = document.getElementById("targetLang");
  const sourceCodeEl = document.getElementById("sourceCode");
  const targetCodeEl = document.getElementById("targetCode");
  const highlightedOutputEl = document.getElementById("highlightedOutput");

  const sourceLinesEl = document.getElementById("sourceLines");
  const targetLinesEl = document.getElementById("targetLines");
  const sourceStatsEl = document.getElementById("sourceStats");
  const targetStatsEl = document.getElementById("targetStats");
  const notesContentEl = document.getElementById("notesContent");

  const convertBtn = document.getElementById("convertBtn");
  const swapBtn = document.getElementById("swapBtn");
  const sampleBtn = document.getElementById("sampleBtn");
  const resetToolBtn = document.getElementById("resetToolBtn");
  const previewBtn = document.getElementById("previewBtn");
  const closePreviewBtn = document.getElementById("closePreviewBtn");
  const previewBox = document.getElementById("previewBox");
  const previewFrame = document.getElementById("previewFrame");

  const pasteBtn = document.getElementById("pasteBtn");
  const clearBtn = document.getElementById("clearBtn");
  const copyBtn = document.getElementById("copyBtn");
  const downloadBtn = document.getElementById("downloadBtn");

  const themeToggle = document.getElementById("themeToggle");
  const langToggle = document.getElementById("langToggle");
  const sunIcon = document.getElementById("sunIcon");
  const moonIcon = document.getElementById("moonIcon");
  const toastEl = document.getElementById("toast");

  const web3Panel = document.getElementById("web3FilesMode");
  const web3Tabs = web3Panel ? web3Panel.querySelectorAll(".w3-tab") : [];
  const web3NameInput = document.getElementById("w3FileName");
  const web3Editor = document.getElementById("w3Editor");
  const web3SampleBtn = document.getElementById("w3LoadSample");
  const web3PackBtn = document.getElementById("w3PackBtn");

  const defaultWeb3Files = () => [
    { name: "index.html", code: "" },
    { name: "style.css", code: "" },
    { name: "script.js", code: "" }
  ];

  const defaultBuildConfig = () => ({
    appName: "ForDev App",
    packageId: "com.dotking.fordevapp",
    version: "1.0.0",
    themeColor: "#3b82f6"
  });

  let web3Files = defaultWeb3Files();
  let web3ActiveIndex = 0;
  let currentBgTab = "backgrounds";
  let currentIconColor = "#38bdf8";
  let isToolPageOpen = false;
  let buildConfig = defaultBuildConfig();

  const searchQueries = {
    templates: "",
    designs: "",
    backgrounds: ""
  };

  let proEditorView = null;
  let proEditorFiles = {
    "index.html": `<!DOCTYPE html>\n<html lang="ar" dir="rtl">\n<head>\n  <meta charset="UTF-8" />\n  <title>ForDev App</title>\n</head>\n<body>\n  <div class="box">\n    <h1>مرحبًا بك في ForDev Studio</h1>\n    <button id="runBtn" onclick="sayHi()">تشغيل</button>\n  </div>\n</body>\n</html>`,
    "style.css": `.box {\n  padding: 24px;\n  border-radius: 16px;\n  background: linear-gradient(135deg, #0ea5e9, #2563eb);\n  color: #ffffff;\n}\n\nbutton {\n  padding: 10px 18px;\n  border: none;\n  border-radius: 10px;\n  cursor: pointer;\n}`,
    "script.js": `function sayHi() {\n  const message = "أهلاً بك يا مطور في ForDev Studio";\n  console.log(message);\n  alert(message);\n}`,
    "main.py": `def greet(user: str) -> str:\n    return f"مرحباً {user} في ForDev Studio"\n\nif __name__ == "__main__":\n    print(greet("DOT"))`
  };
  let proActiveFile = "index.html";

  const getLibrary = () =>
    window.ForDevAssetsLibrary || {
      templates: [],
      designs: [],
      backgrounds: [],
      illustrations: [],
      buildColoredIconSvg: null,
      search: (list, q) => {
        const s = String(q || "").trim().toLowerCase();
        if (!s) return list;
        return list.filter((it) => `${it.title || ""} ${it.category || ""}`.toLowerCase().includes(s));
      }
    };

  let state = {
    toolId: "syntax",
    uiLang: "ar",
    theme: "dark",
    toolData: {}
  };

  const I18N = {
    ar: {
      subtitle: "Developer Conversion & Packaging Hub",
      badge: "ForDev Studio v2.0",
      heroTitle: "أدوات عملية لتحويل الأكواد وتجهيز التطبيقات للمطورين",
      heroDesc: "منصة متكاملة للمطورين تجمع بين تحويل صيغ الأكواد ونقل واجهات الويب إلى أطر التطبيقات، مع التصاميم والقوالب والخلفيات، ومعاينة حية، وحفظ تلقائي.",
      toolsHeading: "اختر الأداة المطلوبة",
      toolSyntaxTitle: "تحويل صيغ الأكواد",
      toolSyntaxDesc: "تحويل المنطق والدوال بين Python و JavaScript و JSON وغيرها بضغطة زر.",
      toolWebToAppTitle: "الويب إلى تطبيقات (Kivy / Tkinter / Flutter)",
      toolWebToAppDesc: "تحويل هياكل وعناصر الويب إلى مكونات واجهة في Kivy و Tkinter و Flutter و React Native.",
      toolPyPackTitle: "تغليف كود بايثون لتطبيق هاتف (APK / App)",
      toolPyPackDesc: "توليد ملف الإعداد وأوامر التغليف لتحويل سكربتات Python / Kivy إلى تطبيق هاتف.",
      toolWebPackTitle: "تغليف كود الموقع (Web / App Wrapper)",
      toolWebPackDesc: "تجهيز مشروع الويب للتغليف كـ PWA أو WebView مع ملف manifest وهيكلة جاهزة.",
      toolFormatTitle: "تنسيق وتجميل الأكواد (Formatter)",
      toolFormatDesc: "إعادة تنسيق وترتيب أكواد JSON و HTML و JavaScript بوضوح وسرعة.",
      loadSample: "مثال جاهز",
      resetTool: "إعادة ضبط",
      previewBtn: "معاينة",
      sourceLabel: "المدخل:",
      targetLabel: "المخرج:",
      convertBtn: "تنفيذ",
      previewTitle: "المعاينة المباشرة (Live Preview)",
      notesTitle: "ملاحظات وإرشادات تقنية",
      developedBy: "طور بواسطة",
      copied: "تم نسخ الكود إلى الحافظة",
      pasted: "تم لصق الكود",
      cleared: "تم مسح المحرر",
      resetDone: "تمت إعادة ضبط الأداة",
      downloaded: "تم تنزيل الملف بنجاح",
      navTools: "الأدوات",
      navTemplates: "القوالب",
      navDesigns: "التصاميم الجاهزة",
      navEditor: "المحرر",
      navBackgrounds: "الخلفيات",
      backToTools: "← رجوع إلى الأدوات",
      buildTitle: "أداة البناء الحقيقية (Real Build)",
      buildAppNameLabel: "اسم التطبيق",
      buildPkgLabel: "معرّف الحزمة (Package ID)",
      buildVersionLabel: "الإصدار",
      buildColorLabel: "اللون الأساسي",
      buildPwaBtn: "بناء وتنزيل حزمة PWA كاملة",
      buildKotlinBtn: "توليد وتنزيل MainActivity.kt",
      buildSpecBtn: "توليد وتنزيل buildozer.spec + build.sh",
      buildWorkflowBtn: "توليد GitHub Action (APK)"
    },
    en: {
      subtitle: "Developer Conversion & Packaging Hub",
      badge: "ForDev Studio v2.0",
      heroTitle: "Practical Tools for Code Conversion & App Packaging",
      heroDesc: "A unified developer hub for converting code syntax, migrating web UI to Kivy, Tkinter, and Flutter, and packaging Python and Web apps for mobile.",
      toolsHeading: "Select a Tool",
      toolSyntaxTitle: "Code Syntax Converter",
      toolSyntaxDesc: "Convert functions and logic between Python, JavaScript, and JSON.",
      toolWebToAppTitle: "Web to Mobile/Desktop UI",
      toolWebToAppDesc: "Convert HTML layouts into Kivy, Tkinter, Flutter, or React Native widgets.",
      toolPyPackTitle: "Python to Mobile App (APK / App)",
      toolPyPackDesc: "Generate buildozer.spec and build commands to package Python apps.",
      toolWebPackTitle: "Website Wrapper & PWA Packager",
      toolWebPackDesc: "Prepare your website as an installable PWA or Android WebView wrapper.",
      toolFormatTitle: "Code Formatter & Beautifier",
      toolFormatDesc: "Format and indent JSON, HTML, and JavaScript cleanly.",
      loadSample: "Load Sample",
      resetTool: "Reset",
      previewBtn: "Preview",
      sourceLabel: "Input:",
      targetLabel: "Output:",
      convertBtn: "Run",
      previewTitle: "Live Preview",
      notesTitle: "Technical Notes & Guidelines",
      developedBy: "Developed by",
      copied: "Code copied to clipboard",
      pasted: "Code pasted",
      cleared: "Editor cleared",
      resetDone: "Tool reset to default",
      downloaded: "File downloaded successfully",
      navTools: "Tools",
      navTemplates: "Templates",
      navDesigns: "Ready Designs",
      navEditor: "Editor",
      navBackgrounds: "Backgrounds",
      backToTools: "← Back to Tools",
      buildTitle: "Real Build Engine",
      buildAppNameLabel: "App Name",
      buildPkgLabel: "Package ID",
      buildVersionLabel: "Version",
      buildColorLabel: "Theme Color",
      buildPwaBtn: "Build & Download PWA Bundle",
      buildKotlinBtn: "Generate & Download MainActivity.kt",
      buildSpecBtn: "Generate buildozer.spec + build.sh",
      buildWorkflowBtn: "Generate GitHub Action (APK)"
    }
  };

  let toastTimer = null;

  function showToast(msg) {
    if (!toastEl) {
      console.info(msg);
      return;
    }
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2300);
  }

  window.showToast = showToast;

  function ensureMiddleEditorIconAndOrder() {
    const existingItem = document.querySelector("[data-bnav]");
    const navBar =
      (existingItem && existingItem.parentElement) ||
      document.querySelector(".bottom-nav, nav.bottom-bar, .mobile-nav, footer nav");
    if (!navBar) return;

    navBar.classList.add("fordev-5-nav");
    navBar.querySelectorAll('[data-bnav="fonts"], [data-bnav="icons"]').forEach((oldBtn) => oldBtn.remove());

    const dict = I18N[state.uiLang] || I18N.ar;

    const getOrCreateNavBtn = (key, label, svgInner) => {
      let btn = navBar.querySelector(`[data-bnav="${key}"]`);
      if (!btn) {
        btn = document.createElement("button");
        btn.type = "button";
        btn.className = existingItem
          ? existingItem.className.replace(/\bactive\b/g, "").trim()
          : "bnav-item";
        btn.dataset.bnav = key;
        btn.innerHTML = `
          <span class="bnav-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              ${svgInner}
            </svg>
          </span>
          <span class="bnav-label">${label}</span>
        `;
      } else {
        btn.classList.remove("hidden");
        btn.style.display = "";
        const labelEl = btn.querySelector(".bnav-label") || btn.querySelector("span:last-child");
        if (labelEl) labelEl.textContent = label;
      }
      return btn;
    };

    const templatesBtn = getOrCreateNavBtn(
      "templates",
      dict.navTemplates,
      `<rect x="3" y="4" width="18" height="6" rx="2"/><rect x="3" y="14" width="8" height="6" rx="2"/><path d="M15 14h6"/><path d="M15 18h6"/>`
    );

    const designsBtn = getOrCreateNavBtn(
      "designs",
      dict.navDesigns,
      `<path d="M12 2l2.6 5.4L20 10l-5.4 2.6L12 18l-2.6-5.4L4 10l5.4-2.6L12 2z"/><path d="M19 16v4"/><path d="M21 18h-4"/>`
    );

    const editorBtn = getOrCreateNavBtn(
      "editor",
      dict.navEditor,
      `<path d="m8 8-4 4 4 4"/><path d="m16 8 4 4-4 4"/><path d="m14 5-4 14"/>`
    );

    const toolsBtn = getOrCreateNavBtn(
      "tools",
      dict.navTools,
      `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`
    );

    const backgroundsBtn = getOrCreateNavBtn(
      "backgrounds",
      dict.navBackgrounds,
      `<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>`
    );

    [templatesBtn, designsBtn, editorBtn, toolsBtn, backgroundsBtn].forEach((btn) => {
      navBar.appendChild(btn);
    });

    const stage = document.getElementById("fordevHorizontalStage") || document.body;
    if (stage && !document.getElementById("fordevEditorSlot")) {
      const emptySlot = document.createElement("div");
      emptySlot.id = "fordevEditorSlot";
      emptySlot.className = "fordev-editor-empty-slot";
      stage.appendChild(emptySlot);
    }
  }

  function loadBuildConfig() {
    try {
      const raw = localStorage.getItem(BUILD_CFG_STORAGE_KEY);
      if (raw) buildConfig = { ...defaultBuildConfig(), ...JSON.parse(raw) };
    } catch {}
  }

  function saveBuildConfig() {
    try {
      localStorage.setItem(BUILD_CFG_STORAGE_KEY, JSON.stringify(buildConfig));
    } catch {}
  }

  function validateBuildInputs(cfg) {
    const errors = [];
    if (!cfg.appName || cfg.appName.trim().length < 2) {
      errors.push("أدخل اسمًا صحيحًا للتطبيق (حرفان على الأقل).");
    }
    if (!/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/.test(String(cfg.packageId || "").trim())) {
      errors.push("صيغة Package ID يجب أن تكون مثل: com.dotking.app");
    }
    return errors;
  }

  function triggerFileDownload(filename, content, mime = "text/plain;charset=utf-8") {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function buildManifestJson(cfg) {
    return JSON.stringify(
      {
        name: cfg.appName.trim(),
        short_name: cfg.appName.trim().slice(0, 12),
        version: (cfg.version || "1.0.0").trim(),
        start_url: "./index.html",
        display: "standalone",
        background_color: "#0b1120",
        theme_color: cfg.themeColor || "#3b82f6",
        icons: []
      },
      null,
      2
    );
  }

  function buildServiceWorkerJs(cfg) {
    const cacheName = `${cfg.packageId.replace(/[^a-z0-9_]/gi, "_")}_${(cfg.version || "1.0.0").replace(/[^a-z0-9_]/gi, "_")}`;
    return `const CACHE_NAME = "${cacheName}";
const ASSETS = ["./", "./index.html", "./style.css", "./script.js", "./manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => res || fetch(event.request))
  );
});`;
  }

  function buildKotlinWebView(cfg, htmlContent = "") {
    const pkg = cfg.packageId.trim();
    const safeTitle = cfg.appName.trim().replace(/"/g, '\\"');
    const hasInlineHtml = Boolean(htmlContent && htmlContent.trim());

    return `package ${pkg}

import android.annotation.SuppressLint
import android.os.Bundle
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        title = "${safeTitle}"

        webView = WebView(this)
        setContentView(webView)

        val settings: WebSettings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.allowFileAccess = true
        settings.mediaPlaybackRequiresUserGesture = false

        webView.webViewClient = WebViewClient()

        ${
          hasInlineHtml
            ? `webView.loadUrl("file:///android_asset/index.html")`
            : `webView.loadUrl("https://example.com")`
        }
    }

    override fun onBackPressed() {
        if (this::webView.isInitialized && webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}`;
  }

  function buildBuildozerSpec(cfg) {
    const safeTitle = cfg.appName.trim().replace(/[^a-zA-Z0-9 _-]/g, "") || "ForDevApp";
    const pkgDomain = cfg.packageId.trim().split(".")[0] || "org";
    const pkgName = cfg.packageId.trim().replace(/[^a-z0-9]/gi, "").toLowerCase() || "fordevapp";
    const ver = (cfg.version || "1.0.0").trim();

    return `[app]
title = ${safeTitle}
package.name = ${pkgName}
package.domain = ${pkgDomain}
source.dir = .
source.include_exts = py,png,jpg,kv,atlas,json,html,css,js
version = ${ver}
requirements = python3,kivy
orientation = portrait
fullscreen = 0
android.permissions = INTERNET

[buildozer]
log_level = 2
warn_on_root = 1`;
  }

  function buildBuildScriptSh() {
    return `#!/usr/bin/env bash
set -e
echo "Checking build environment..."
if command -v buildozer >/dev/null 2>&1; then
  buildozer android debug
else
  echo "Buildozer not found. Install it or run via GitHub Actions workflow (.github/workflows/build-apk.yml)."
fi`;
  }

  function buildGitHubWorkflowYml(cfg) {
    const safeName = cfg.appName.trim().replace(/"/g, '\\"');
    return `name: Build ForDev APK

on:
  workflow_dispatch:
  push:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Install Buildozer dependencies
        run: |
          sudo apt-get update
          sudo apt-get install -y git zip unzip openjdk-17-jdk autoconf libtool pkg-config zlib1g-dev libncurses5-dev libncursesw5-dev libtinfo5 cmake libffi-dev libssl-dev
          pip install --upgrade pip wheel setuptools buildozer cython==0.29.36

      - name: Build Android APK for ${safeName}
        run: |
          buildozer android debug

      - name: Upload APK artifact
        uses: actions/upload-artifact@v4
        with:
          name: ${cfg.packageId.replace(/[^a-z0-9_.-]/gi, "_")}-apk
          path: bin/*.apk`;
  }

  function exportPwaBundleNow() {
    const errors = validateBuildInputs(buildConfig);
    if (errors.length) {
      showToast(errors[0]);
      renderNotes(errors);
      return;
    }

    const html = (web3Files[0]?.code || sourceCodeEl.value || "").trim();
    const css = (web3Files[1]?.code || "").trim();
    const js = (web3Files[2]?.code || "").trim();

    const manifest = buildManifestJson(buildConfig);
    const sw = buildServiceWorkerJs(buildConfig);
    const indexHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="${buildConfig.themeColor}" />
  <link rel="manifest" href="./manifest.json" />
  <link rel="stylesheet" href="./style.css" />
  <title>${buildConfig.appName.trim()}</title>
</head>
<body>
${html || "<main><h1>ForDev App</h1></main>"}
  <script src="./script.js"></script>
  <script>
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js");
    }
  </script>
</body>
</html>`;

    renderOutput(indexHtml);
    renderNotes([
      `تم تجهيز حزمة PWA حقيقية لتطبيق: ${buildConfig.appName.trim()} (${buildConfig.packageId.trim()})`,
      "تم تنزيل ملفات: manifest.json و sw.js و index.html (بالإضافة إلى style.css و script.js إذا كان بهما كود)."
    ]);

    triggerFileDownload("manifest.json", manifest, "application/json;charset=utf-8");
    setTimeout(() => triggerFileDownload("sw.js", sw, "application/javascript;charset=utf-8"), 140);
    setTimeout(() => triggerFileDownload("index.html", indexHtml, "text/html;charset=utf-8"), 280);
    if (css) setTimeout(() => triggerFileDownload("style.css", css, "text/css;charset=utf-8"), 420);
    if (js) setTimeout(() => triggerFileDownload("script.js", js, "application/javascript;charset=utf-8"), 560);

    showToast("تم بناء وتنزيل ملفات حزمة PWA بنجاح");
  }

  function exportKotlinWebViewNow() {
    const errors = validateBuildInputs(buildConfig);
    if (errors.length) {
      showToast(errors[0]);
      renderNotes(errors);
      return;
    }

    const html = (web3Files[0]?.code || sourceCodeEl.value || "").trim();
    const ktCode = buildKotlinWebView(buildConfig, html);
    renderOutput(ktCode);
    renderNotes([
      `تم توليد MainActivity.kt للحزمة ${buildConfig.packageId.trim()}`,
      "ضع MainActivity.kt في مجلد مشروع Android Studio/Kotlin، وإذا أدرجت HTML فضع index.html داخل مجلد assets."
    ]);
    triggerFileDownload("MainActivity.kt", ktCode, "text/plain;charset=utf-8");
    showToast("تم تنزيل MainActivity.kt بنجاح");
  }

  function exportPythonBuildFilesNow() {
    const errors = validateBuildInputs(buildConfig);
    if (errors.length) {
      showToast(errors[0]);
      renderNotes(errors);
      return;
    }

    const spec = buildBuildozerSpec(buildConfig);
    const sh = buildBuildScriptSh();
    renderOutput(spec);
    renderNotes([
      "تم توليد buildozer.spec و build.sh لتغليف تطبيق بايثون/Kivy.",
      "يمكنك تشغيل البناء محليًا في بيئة Linux/Termux أو عبر GitHub Action."
    ]);
    triggerFileDownload("buildozer.spec", spec, "text/plain;charset=utf-8");
    setTimeout(() => triggerFileDownload("build.sh", sh, "text/x-sh;charset=utf-8"), 150);
    showToast("تم تنزيل buildozer.spec و build.sh");
  }

  function exportGitHubWorkflowNow() {
    const errors = validateBuildInputs(buildConfig);
    if (errors.length) {
      showToast(errors[0]);
      renderNotes(errors);
      return;
    }

    const yml = buildGitHubWorkflowYml(buildConfig);
    renderOutput(yml);
    renderNotes([
      "تم توليد ملف build-apk.yml الخاص بـ GitHub Actions.",
      "ارفع الملف إلى المسار .github/workflows/build-apk.yml في مستودعك لبناء ملف APK تلقائيًا."
    ]);
    triggerFileDownload("build-apk.yml", yml, "text/yaml;charset=utf-8");
    showToast("تم تنزيل build-apk.yml بنجاح");
  }

  window.ForDevRealBuilder = {
    getConfig: () => ({ ...buildConfig }),
    setConfig: (patch) => {
      buildConfig = { ...buildConfig, ...(patch || {}) };
      saveBuildConfig();
    },
    validate: validateBuildInputs,
    exportPwaBundle: exportPwaBundleNow,
    exportKotlinWebView: exportKotlinWebViewNow,
    exportPythonBuild: exportPythonBuildFilesNow,
    exportGitHubWorkflow: exportGitHubWorkflowNow
  };

  function ensureRealBuildPanel(workspaceSec) {
    if (!workspaceSec || workspaceSec.querySelector("#fordevRealBuildPanel")) return;

    const panel = document.createElement("div");
    panel.id = "fordevRealBuildPanel";
    panel.className = "fordev-real-build-panel";
    panel.innerHTML = `
      <div class="real-build-header">
        <h3 id="rbTitle">${I18N[state.uiLang].buildTitle}</h3>
      </div>
      <div class="real-build-form">
        <div class="rb-field">
          <label id="rbAppNameLbl" for="rbAppName">${I18N[state.uiLang].buildAppNameLabel}</label>
          <input id="rbAppName" type="text" value="${buildConfig.appName}" />
        </div>
        <div class="rb-field">
          <label id="rbPkgLbl" for="rbPkgId">${I18N[state.uiLang].buildPkgLabel}</label>
          <input id="rbPkgId" type="text" dir="ltr" value="${buildConfig.packageId}" />
        </div>
        <div class="rb-field">
          <label id="rbVerLbl" for="rbVersion">${I18N[state.uiLang].buildVersionLabel}</label>
          <input id="rbVersion" type="text" dir="ltr" value="${buildConfig.version}" />
        </div>
        <div class="rb-field">
          <label id="rbColorLbl" for="rbThemeColor">${I18N[state.uiLang].buildColorLabel}</label>
          <input id="rbThemeColor" type="color" value="${buildConfig.themeColor}" />
        </div>
      </div>
      <div class="real-build-actions">
        <button type="button" id="rbBuildPwaBtn" class="btn btn-primary">${I18N[state.uiLang].buildPwaBtn}</button>
        <button type="button" id="rbBuildKotlinBtn" class="btn btn-secondary">${I18N[state.uiLang].buildKotlinBtn}</button>
        <button type="button" id="rbBuildSpecBtn" class="btn btn-secondary">${I18N[state.uiLang].buildSpecBtn}</button>
        <button type="button" id="rbBuildGhBtn" class="btn btn-secondary">${I18N[state.uiLang].buildWorkflowBtn}</button>
      </div>
    `;

    const notesSec = workspaceSec.querySelector(".notes-section");
    if (notesSec) workspaceSec.insertBefore(panel, notesSec);
    else workspaceSec.appendChild(panel);

    const nameEl = panel.querySelector("#rbAppName");
    const pkgEl = panel.querySelector("#rbPkgId");
    const verEl = panel.querySelector("#rbVersion");
    const colEl = panel.querySelector("#rbThemeColor");

    const syncInputsToConfig = () => {
      buildConfig.appName = nameEl.value;
      buildConfig.packageId = pkgEl.value;
      buildConfig.version = verEl.value;
      buildConfig.themeColor = colEl.value;
      saveBuildConfig();
    };

    nameEl?.addEventListener("input", syncInputsToConfig);
    pkgEl?.addEventListener("input", syncInputsToConfig);
    verEl?.addEventListener("input", syncInputsToConfig);
    colEl?.addEventListener("input", syncInputsToConfig);

    panel.querySelector("#rbBuildPwaBtn")?.addEventListener("click", () => {
      syncInputsToConfig();
      exportPwaBundleNow();
    });
    panel.querySelector("#rbBuildKotlinBtn")?.addEventListener("click", () => {
      syncInputsToConfig();
      exportKotlinWebViewNow();
    });
    panel.querySelector("#rbBuildSpecBtn")?.addEventListener("click", () => {
      syncInputsToConfig();
      exportPythonBuildFilesNow();
    });
    panel.querySelector("#rbBuildGhBtn")?.addEventListener("click", () => {
      syncInputsToConfig();
      exportGitHubWorkflowNow();
    });
  }

  function applyRealBuildLanguage(lang) {
    const dict = I18N[lang] || I18N.ar;
    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    setText("rbTitle", dict.buildTitle);
    setText("rbAppNameLbl", dict.buildAppNameLabel);
    setText("rbPkgLbl", dict.buildPkgLabel);
    setText("rbVerLbl", dict.buildVersionLabel);
    setText("rbColorLbl", dict.buildColorLabel);
    setText("rbBuildPwaBtn", dict.buildPwaBtn);
    setText("rbBuildKotlinBtn", dict.buildKotlinBtn);
    setText("rbBuildSpecBtn", dict.buildSpecBtn);
    setText("rbBuildGhBtn", dict.buildWorkflowBtn);
  }

  function syncHybridToolView() {
    const toolsPage =
      document.querySelector('.fordev-page-section[data-page-key="tools"]') ||
      document.getElementById("fordevHorizontalStage")?.firstElementChild;
    if (!toolsPage) return;
    toolsPage.classList.toggle("tool-detail-open", isToolPageOpen);
    toolsPage.scrollTop = 0;
  }

  function openToolSeparatePage(toolId, autoRun = true) {
    if (!toolId) return;
    selectTool(toolId, autoRun);
    isToolPageOpen = true;
    syncHybridToolView();
    const toolsPage = document.querySelector('.fordev-page-section[data-page-key="tools"]');
    if (toolsPage) {
      toolsPage.classList.add("tool-detail-open");
      toolsPage.scrollTop = 0;
    }
    if (typeof window.goToForDevSection === "function") {
      window.goToForDevSection("tools");
    }
  }

  function closeToolSeparatePage() {
    isToolPageOpen = false;
    syncHybridToolView();
  }

  window.openForDevToolPage = openToolSeparatePage;
  window.closeForDevToolPage = closeToolSeparatePage;

  function loadSavedState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        state = {
          toolId: parsed.toolId || "syntax",
          uiLang: parsed.uiLang || "ar",
          theme: parsed.theme || "dark",
          toolData: parsed.toolData && typeof parsed.toolData === "object" ? parsed.toolData : {}
        };
      }
    } catch {}
  }

  function saveState() {
    state.toolData[state.toolId] = {
      sourceLang: sourceLangEl.value,
      targetLang: targetLangEl.value,
      sourceCode: sourceCodeEl.value,
      targetCode: targetCodeEl.value
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }

  function saveWeb3Files() {
    try {
      localStorage.setItem(WEB3_STORAGE_KEY, JSON.stringify(web3Files));
    } catch {}
  }

  function loadWeb3Files() {
    try {
      const raw = localStorage.getItem(WEB3_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === 3) {
        web3Files = parsed.map((item, idx) => ({
          name: typeof item?.name === "string" ? item.name : defaultWeb3Files()[idx].name,
          code: typeof item?.code === "string" ? item.code : ""
        }));
      }
    } catch {}
  }

  function updateLineNumbers(text, linesEl) {
    const count = text ? text.split("\n").length : 1;
    linesEl.textContent = Array.from({ length: count }, (_, i) => i + 1).join("\n");
  }

  function updateStats(text, statsEl) {
    const lines = text ? text.split("\n").length : 0;
    const chars = text ? text.length : 0;
    statsEl.textContent =
      state.uiLang === "ar" ? `${lines} أسطر | ${chars} حرف` : `${lines} lines | ${chars} chars`;
  }

  function renderOutput(code) {
    const safeCode = code || "";
    targetCodeEl.value = safeCode;
    highlightedOutputEl.innerHTML = CodeConverter.highlightSyntax(safeCode);
    updateLineNumbers(safeCode, targetLinesEl);
    updateStats(safeCode, targetStatsEl);
  }

  function renderNotes(notes) {
    if (!notes || !notes.length) {
      notesContentEl.innerHTML = "";
      return;
    }
    notesContentEl.innerHTML = `<ul>${notes.map((n) => `<li>${n}</li>`).join("")}</ul>`;
  }

  function populateSelect(selectEl, options, selectedValue) {
    selectEl.innerHTML = options
      .map((opt) => `<option value="${opt.value}">${opt.label}</option>`)
      .join("");
    if (selectedValue && options.some((o) => o.value === selectedValue)) {
      selectEl.value = selectedValue;
    }
  }

  function canPreviewCurrentTool() {
    return (
      state.toolId === "web-to-app" ||
      state.toolId === "web-pack" ||
      sourceLangEl.value === "html" ||
      sourceLangEl.value === "html-site"
    );
  }

  function syncPreviewAvailability() {
    const allowed = canPreviewCurrentTool();
    previewBtn.classList.toggle("hidden", !allowed);
    if (!allowed) previewBox.classList.add("hidden");
  }

  function syncWeb3Visibility(toolId) {
    if (!web3Panel) return;
    const isWebTool = WEB3_SUPPORTED_TOOLS.has(toolId);
    web3Panel.classList.toggle("hidden", !isWebTool);
    web3Panel.style.display = isWebTool ? "block" : "none";
  }

  function renderWeb3Slot(index) {
    if (!web3Panel || !web3NameInput || !web3Editor) return;
    web3ActiveIndex = index;
    web3Tabs.forEach((tab, i) => tab.classList.toggle("active", i === index));
    web3NameInput.value = web3Files[index].name;
    web3Editor.value = web3Files[index].code;
  }

  function resetWeb3Files() {
    web3Files = defaultWeb3Files();
    try {
      localStorage.removeItem(WEB3_STORAGE_KEY);
    } catch {}
    renderWeb3Slot(0);
  }

  function selectTool(toolId, autoRun = true) {
    state.toolId = toolId;
    syncWeb3Visibility(toolId);

    const cfg = TOOLS_CONFIG[toolId] || TOOLS_CONFIG.syntax;

    document.querySelectorAll(".tool-card").forEach((card) => {
      card.classList.toggle("active", card.dataset.tool === toolId);
    });

    activeToolBadge.textContent = state.uiLang === "ar" ? cfg.titleAr : cfg.titleEn;
    activeToolHint.textContent = state.uiLang === "ar" ? cfg.hintAr : cfg.hintEn;

    const savedTool = state.toolData[toolId];
    populateSelect(sourceLangEl, cfg.sources, savedTool?.sourceLang || cfg.defaultSource);
    populateSelect(targetLangEl, cfg.targets, savedTool?.targetLang || cfg.defaultTarget);

    sourceCodeEl.value = savedTool?.sourceCode !== undefined ? savedTool.sourceCode : cfg.sample;
    updateLineNumbers(sourceCodeEl.value, sourceLinesEl);
    updateStats(sourceCodeEl.value, sourceStatsEl);

    syncPreviewAvailability();

    if (autoRun) runTool();
    else if (savedTool?.targetCode !== undefined) renderOutput(savedTool.targetCode);

    saveState();
  }

  function runTool() {
    const result = CodeConverter.process({
      toolId: state.toolId,
      sourceLang: sourceLangEl.value,
      targetLang: targetLangEl.value,
      code: sourceCodeEl.value
    });

    renderOutput(result.code);
    renderNotes(result.notes);
    saveState();

    if (!previewBox.classList.contains("hidden")) updatePreviewFrame();
  }

  function updatePreviewFrame() {
    const code = sourceCodeEl.value || "";
    const wrappedHtml = /<html[\s>]/i.test(code)
      ? code
      : `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;padding:16px;background:#f8fafc;color:#0f172a;}.card{background:#ffffff;padding:16px;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.08);}button{background:#2563eb;color:#ffffff;border:none;padding:8px 14px;border-radius:6px;cursor:pointer;}</style></head><body>${code}</body></html>`;
    previewFrame.srcdoc = wrappedHtml;
  }

  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "light") {
      sunIcon?.classList.remove("hidden");
      moonIcon?.classList.add("hidden");
    } else {
      sunIcon?.classList.add("hidden");
      moonIcon?.classList.remove("hidden");
    }
    if (proEditorView) {
      mountCodeEditorInstance(document.getElementById("fdProEditorHost"), proActiveFile);
    }
    saveState();
  }

  function applyDesignAssetsLanguage(lang) {
    const dict = I18N[lang] || I18N.ar;
    const backBtn = document.getElementById("backToToolsBtn");
    if (backBtn) backBtn.textContent = dict.backToTools;

    const navLabelMap = {
      templates: dict.navTemplates,
      designs: dict.navDesigns,
      editor: dict.navEditor,
      tools: dict.navTools,
      backgrounds: dict.navBackgrounds
    };

    document.querySelectorAll("[data-bnav]").forEach((item) => {
      const key = item.dataset.bnav;
      const labelEl = item.querySelector(".bnav-label");
      if (labelEl && navLabelMap[key]) labelEl.textContent = navLabelMap[key];
    });

    applyRealBuildLanguage(lang);
  }

  function applyUiLanguage(lang) {
    state.uiLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    if (langToggle) langToggle.textContent = lang === "ar" ? "EN" : "عربي";

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (I18N[lang] && I18N[lang][key]) el.textContent = I18N[lang][key];
    });

    const cfg = TOOLS_CONFIG[state.toolId];
    if (cfg) {
      activeToolBadge.textContent = lang === "ar" ? cfg.titleAr : cfg.titleEn;
      activeToolHint.textContent = lang === "ar" ? cfg.hintAr : cfg.hintEn;
    }

    updateStats(sourceCodeEl.value, sourceStatsEl);
    updateStats(targetCodeEl.value, targetStatsEl);
    ensureMiddleEditorIconAndOrder();
    applyDesignAssetsLanguage(lang);
    saveState();
  }

  function getDownloadFilename() {
    const map = {
      javascript: "fordev-output.js",
      python: "fordev-output.py",
      "python-dict": "fordev-dict.py",
      kivy: "main.py",
      tkinter: "app_gui.py",
      flutter: "fordev_widget.dart",
      "react-native": "ForDevScreen.jsx",
      "apk-buildozer": "buildozer.spec",
      "briefcase-app": "pyproject.toml",
      "pwa-bundle": "manifest.json",
      "android-webview": "MainActivity.kt",
      formatted: "formatted-output.txt"
    };
    return map[targetLangEl.value] || "fordev-output.txt";
  }

  convertBtn?.addEventListener("click", runTool);

  swapBtn?.addEventListener("click", () => {
    const src = sourceLangEl.value;
    const tgt = targetLangEl.value;
    const hasSrcInTgt = [...targetLangEl.options].some((o) => o.value === src);
    const hasTgtInSrc = [...sourceLangEl.options].some((o) => o.value === tgt);

    if (hasSrcInTgt && hasTgtInSrc) {
      sourceLangEl.value = tgt;
      targetLangEl.value = src;
      if (targetCodeEl.value.trim()) {
        sourceCodeEl.value = targetCodeEl.value;
        updateLineNumbers(sourceCodeEl.value, sourceLinesEl);
        updateStats(sourceCodeEl.value, sourceStatsEl);
      }
      runTool();
    }
  });

  sampleBtn?.addEventListener("click", () => {
    const cfg = TOOLS_CONFIG[state.toolId];
    if (!cfg) return;
    sourceCodeEl.value = cfg.sample;
    updateLineNumbers(sourceCodeEl.value, sourceLinesEl);
    updateStats(sourceCodeEl.value, sourceStatsEl);
    runTool();
  });

  resetToolBtn?.addEventListener("click", () => {
    delete state.toolData[state.toolId];
    if (WEB3_SUPPORTED_TOOLS.has(state.toolId)) resetWeb3Files();
    selectTool(state.toolId, true);
    showToast(I18N[state.uiLang].resetDone);
  });

  previewBtn?.addEventListener("click", () => {
    if (!canPreviewCurrentTool()) return;
    previewBox.classList.remove("hidden");
    updatePreviewFrame();
  });

  closePreviewBtn?.addEventListener("click", () => {
    previewBox.classList.add("hidden");
  });

  sourceCodeEl?.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = sourceCodeEl.selectionStart;
      const end = sourceCodeEl.selectionEnd;
      const indent = "    ";
      sourceCodeEl.value =
        sourceCodeEl.value.substring(0, start) + indent + sourceCodeEl.value.substring(end);
      sourceCodeEl.selectionStart = sourceCodeEl.selectionEnd = start + indent.length;
      updateLineNumbers(sourceCodeEl.value, sourceLinesEl);
      updateStats(sourceCodeEl.value, sourceStatsEl);
      saveState();
    }
  });

  sourceCodeEl?.addEventListener("input", () => {
    updateLineNumbers(sourceCodeEl.value, sourceLinesEl);
    updateStats(sourceCodeEl.value, sourceStatsEl);
    saveState();
    if (!previewBox.classList.contains("hidden")) updatePreviewFrame();
  });

  sourceCodeEl?.addEventListener("scroll", () => {
    sourceLinesEl.scrollTop = sourceCodeEl.scrollTop;
  });

  highlightedOutputEl?.addEventListener("scroll", () => {
    targetLinesEl.scrollTop = highlightedOutputEl.scrollTop;
  });

  sourceLangEl?.addEventListener("change", () => {
    syncPreviewAvailability();
    saveState();
  });

  targetLangEl?.addEventListener("change", runTool);

  pasteBtn?.addEventListener("click", async () => {
    try {
      const text = await navigator.clipboard.readText();
      sourceCodeEl.value = text;
      updateLineNumbers(sourceCodeEl.value, sourceLinesEl);
      updateStats(sourceCodeEl.value, sourceStatsEl);
      saveState();
      showToast(I18N[state.uiLang].pasted);
    } catch {
      sourceCodeEl.focus();
    }
  });

  clearBtn?.addEventListener("click", () => {
    sourceCodeEl.value = "";
    renderOutput("");
    updateLineNumbers("", sourceLinesEl);
    updateStats("", sourceStatsEl);
    saveState();
    showToast(I18N[state.uiLang].cleared);
  });

  copyBtn?.addEventListener("click", async () => {
    if (!targetCodeEl.value) return;
    try {
      await navigator.clipboard.writeText(targetCodeEl.value);
      showToast(I18N[state.uiLang].copied);
    } catch {
      showToast("تعذر النسخ تلقائيًا");
    }
  });

  downloadBtn?.addEventListener("click", () => {
    if (!targetCodeEl.value) return;
    const blob = new Blob([targetCodeEl.value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = getDownloadFilename();
    a.click();
    URL.revokeObjectURL(url);
    showToast(I18N[state.uiLang].downloaded);
  });

  themeToggle?.addEventListener("click", () => {
    applyTheme(state.theme === "dark" ? "light" : "dark");
  });

  langToggle?.addEventListener("click", () => {
    applyUiLanguage(state.uiLang === "ar" ? "en" : "ar");
  });

  if (web3Panel) {
    web3Tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        renderWeb3Slot(Number(tab.dataset.w3));
      });
    });

    web3NameInput?.addEventListener("input", (e) => {
      web3Files[web3ActiveIndex].name = e.target.value;
      saveWeb3Files();
    });

    web3Editor?.addEventListener("input", (e) => {
      web3Files[web3ActiveIndex].code = e.target.value;
      saveWeb3Files();
    });

    web3SampleBtn?.addEventListener("click", () => {
      web3Files = [
        { name: "index.html", code: '<div class="card">\n  <h3>ForDev Studio</h3>\n  <button>Start</button>\n</div>' },
        { name: "style.css", code: ".card {\n  padding: 16px;\n  border-radius: 12px;\n}" },
        { name: "script.js", code: "console.log('3 web files bundled');" }
      ];
      saveWeb3Files();
      renderWeb3Slot(web3ActiveIndex);
    });

    web3PackBtn?.addEventListener("click", () => {
      const htmlCode = web3Files[0]?.code || "";
      const cssCode = web3Files[1]?.code || "";
      const jsCode = web3Files[2]?.code || "";

      const combined =
        state.toolId === "web-pack"
          ? [
              "<!DOCTYPE html>",
              '<html lang="ar" dir="rtl">',
              "<head>",
              '  <meta charset="UTF-8" />',
              '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
              "  <title>ForDev Web App</title>",
              "  <style>",
              cssCode,
              "  </style>",
              "</head>",
              "<body>",
              htmlCode,
              "  <script>",
              jsCode,
              "  </script>",
              "</body>",
              "</html>"
            ].join("\n")
          : web3Files
              .map((f, i) => `/* --- FILE ${i + 1}: ${f.name || `file_${i + 1}`} --- */\n${f.code}`)
              .join("\n\n");

      sourceCodeEl.value = combined;
      updateLineNumbers(sourceCodeEl.value, sourceLinesEl);
      updateStats(sourceCodeEl.value, sourceStatsEl);
      runTool();
    });

    loadWeb3Files();
    renderWeb3Slot(0);
  }

  function insertAssetIntoWeb3(targetIndex, snippet, label) {
    if (!snippet) return;
    if (!WEB3_SUPPORTED_TOOLS.has(state.toolId)) {
      selectTool("web-pack", false);
    }
    syncWeb3Visibility(state.toolId);

    const currentCode = web3Files[targetIndex]?.code || "";
    const separator = currentCode.trim() ? "\n\n" : "";
    web3Files[targetIndex].code = `${currentCode}${separator}${snippet}`;
    saveWeb3Files();

    renderWeb3Slot(targetIndex);
    isToolPageOpen = true;
    syncHybridToolView();
    if (typeof window.goToForDevSection === "function") {
      window.goToForDevSection("tools");
    }
    showToast(`تم إدراج ${label} في ${web3Files[targetIndex].name}`);
  }

  function attachAssetActions(container = document) {
    container.querySelectorAll(".asset-copy-btn").forEach((btn) => {
      if (btn.dataset.boundCopy === "1") return;
      btn.dataset.boundCopy = "1";
      btn.addEventListener("click", async () => {
        const text = btn.dataset.copy || "";
        if (!text) return;
        try {
          await navigator.clipboard.writeText(text);
          showToast(I18N[state.uiLang]?.copied || "تم النسخ");
        } catch {
          showToast("تعذر النسخ تلقائيًا");
        }
      });
    });

    container.querySelectorAll(".asset-insert-btn").forEach((btn) => {
      if (btn.dataset.boundInsert === "1") return;
      btn.dataset.boundInsert = "1";
      btn.addEventListener("click", () => {
        const text = btn.dataset.insert || "";
        const targetIndex = Number(btn.dataset.targetSlot ?? 1);
        const label = btn.dataset.label || "العنصر";
        insertAssetIntoWeb3(targetIndex, text, label);
      });
    });
  }

  function updateSectionCountBadge(sectionKey, count) {
    const badge = document.querySelector(`[data-search-count="${sectionKey}"]`);
    if (badge) badge.textContent = `${count} عنصر`;
  }

  function renderQuickIconColorSwatches() {
    return `
      <div class="quick-icon-colors" role="group" aria-label="ألوان سريعة للأيقونات">
        ${QUICK_ICON_COLORS.map(
          (c) => `
          <button
            type="button"
            class="quick-color-dot ${currentIconColor.toLowerCase() === c.hex.toLowerCase() ? "active" : ""}"
            data-icon-color="${c.hex}"
            title="${c.name}"
            style="background:${c.hex};"
          ></button>
        `
        ).join("")}
      </div>
    `;
  }

  function renderBackgroundsSection() {
    const bgGridEl = document.querySelector('[data-page-key="backgrounds"] .asset-grid');
    if (!bgGridEl) return;

    const lib = getLibrary();
    const query = searchQueries.backgrounds || "";

    if (currentBgTab === "illustrations") {
      const items = lib.search(lib.illustrations || [], query);
      updateSectionCountBadge("backgrounds", items.length);

      bgGridEl.innerHTML = items.length
        ? items
            .map((item) => {
              const svgStr =
                typeof lib.buildColoredIconSvg === "function" && item.shape
                  ? lib.buildColoredIconSvg(item.shape, currentIconColor)
                  : item.svg || "";
              return `
          <div class="asset-card">
            <div class="asset-preview illustration-box">${svgStr}</div>
            <div class="asset-title">${item.title}</div>
            <div class="asset-meta">${item.category}</div>
            <div class="icon-color-picker-row">
              <label>لون الأيقونة:</label>
              <input type="color" class="icon-custom-color-input" value="${currentIconColor}" aria-label="تغيير لون الأيقونة" />
            </div>
            ${renderQuickIconColorSwatches()}
            <div class="asset-actions">
              <button type="button" class="asset-copy-btn" data-copy="${encodeURIComponent(svgStr)}" data-encoded="1">نسخ SVG</button>
              <button type="button" class="asset-insert-btn" data-insert="${encodeURIComponent(svgStr)}" data-target-slot="0" data-label="${item.title}" data-encoded="1">إدراج HTML</button>
            </div>
          </div>
        `;
            })
            .join("")
        : `<p class="empty-search-msg">لا توجد أيقونات توضيحية مطابقة للبحث.</p>`;
    } else {
      const items = lib.search(lib.backgrounds || [], query);
      updateSectionCountBadge("backgrounds", items.length);

      bgGridEl.innerHTML = items.length
        ? items
            .map(
              (bg) => `
          <div class="asset-card">
            <div class="asset-preview photo-preview-box">
              <img src="${bg.imgUrl}" alt="${bg.title}" loading="lazy" />
            </div>
            <div class="asset-title">${bg.title}</div>
            ${bg.category ? `<div class="asset-meta">${bg.category}</div>` : ""}
            <div class="asset-actions">
              <button type="button" class="asset-copy-btn" data-copy="${encodeURIComponent(bg.css)}" data-encoded="1">نسخ CSS</button>
              <button type="button" class="asset-insert-btn" data-insert="${encodeURIComponent(bg.css)}" data-target-slot="1" data-label="صورة الخلفية (${bg.title})" data-encoded="1">إدراج CSS</button>
            </div>
          </div>
        `
            )
            .join("")
        : `<p class="empty-search-msg">لا توجد خلفيات مطابقة للبحث.</p>`;
    }

    bgGridEl.querySelectorAll('[data-encoded="1"]').forEach((btn) => {
      if (btn.dataset.copy) btn.dataset.copy = decodeURIComponent(btn.dataset.copy);
      if (btn.dataset.insert) btn.dataset.insert = decodeURIComponent(btn.dataset.insert);
      btn.removeAttribute("data-encoded");
    });

    attachAssetActions(bgGridEl);
  }

  function renderTemplatesSection() {
    const gridEl = document.querySelector('[data-page-key="templates"] .asset-grid');
    if (!gridEl) return;

    const lib = getLibrary();
    const items = lib.search(lib.templates || [], searchQueries.templates || "");
    updateSectionCountBadge("templates", items.length);

    gridEl.innerHTML = items.length
      ? items
          .map(
            (tpl) => `
          <div class="asset-card">
            <div class="asset-preview">${tpl.previewHtml}</div>
            <div class="asset-title">${tpl.title}</div>
            <div class="asset-meta">${tpl.category}</div>
            <div class="asset-actions">
              <button type="button" class="asset-copy-btn" data-copy="${encodeURIComponent(tpl.code)}" data-encoded="1">نسخ الكود</button>
              <button type="button" class="asset-insert-btn" data-insert="${encodeURIComponent(tpl.code)}" data-target-slot="${tpl.targetSlot}" data-label="${tpl.label}" data-encoded="1">إدراج</button>
            </div>
          </div>
        `
          )
          .join("")
      : `<p class="empty-search-msg">لا توجد قوالب مطابقة للبحث.</p>`;

    gridEl.querySelectorAll('[data-encoded="1"]').forEach((btn) => {
      if (btn.dataset.copy) btn.dataset.copy = decodeURIComponent(btn.dataset.copy);
      if (btn.dataset.insert) btn.dataset.insert = decodeURIComponent(btn.dataset.insert);
      btn.removeAttribute("data-encoded");
    });

    attachAssetActions(gridEl);
  }

  function renderDesignsSection() {
    const gridEl = document.querySelector('[data-page-key="designs"] .asset-grid');
    if (!gridEl) return;

    const lib = getLibrary();
    const items = lib.search(lib.designs || [], searchQueries.designs || "");
    updateSectionCountBadge("designs", items.length);

    gridEl.innerHTML = items.length
      ? items
          .map(
            (dsn) => `
          <div class="asset-card">
            <div class="asset-preview">${dsn.previewHtml}</div>
            <div class="asset-title">${dsn.title}</div>
            <div class="asset-meta">${dsn.category}</div>
            <div class="asset-actions">
              <button type="button" class="asset-copy-btn" data-copy="${encodeURIComponent(dsn.code)}" data-encoded="1">نسخ الكود</button>
              <button type="button" class="asset-insert-btn" data-insert="${encodeURIComponent(dsn.code)}" data-target-slot="${dsn.targetSlot}" data-label="${dsn.label}" data-encoded="1">إدراج</button>
            </div>
          </div>
        `
          )
          .join("")
      : `<p class="empty-search-msg">لا توجد تصاميم جاهزة مطابقة للبحث.</p>`;

    gridEl.querySelectorAll('[data-encoded="1"]').forEach((btn) => {
      if (btn.dataset.copy) btn.dataset.copy = decodeURIComponent(btn.dataset.copy);
      if (btn.dataset.insert) btn.dataset.insert = decodeURIComponent(btn.dataset.insert);
      btn.removeAttribute("data-encoded");
    });

    attachAssetActions(gridEl);
  }

  function renderDesignLibraries() {
    renderTemplatesSection();
    renderDesignsSection();
    renderBackgroundsSection();
    applyDesignAssetsLanguage(state.uiLang);
  }

  function escapeCodeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function colorizeCodeText(code, filename = "") {
    let html = escapeCodeHtml(code || "");
    const ext = filename.split(".").pop().toLowerCase();

    html = html.replace(/(\/\/[^\n]*|#[^\n]*|\/\*[\s\S]*?\*\/)/g, '<span class="tok-comment">$1</span>');
    html = html.replace(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g, '<span class="tok-str">$1</span>');

    if (ext === "html" || ext === "htm") {
      html = html.replace(/(&lt;\/?[a-zA-Z0-9:-]+)/g, '<span class="tok-tag">$1</span>');
    }

    const kwRegex = /\b(const|let|var|function|return|if|else|for|while|import|from|def|class|async|await|try|catch|new|export|default)\b/g;
    html = html.replace(kwRegex, '<span class="tok-kw">$1</span>');
    html = html.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="tok-num">$1</span>');

    return html + "\n";
  }

  function syncColoredEditorOverlay(code, filename) {
    const highlightLayer = document.getElementById("fdProEditorHighlight");
    if (!highlightLayer) return;
    highlightLayer.innerHTML = colorizeCodeText(code, filename);
  }

  function loadProEditorFiles() {
    try {
      const saved = localStorage.getItem(EDITOR_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object" && Object.keys(parsed).length) {
          proEditorFiles = parsed;
          proActiveFile = Object.keys(proEditorFiles)[0];
        }
      }
    } catch {}
  }

  function saveProEditorFiles() {
    try {
      localStorage.setItem(EDITOR_STORAGE_KEY, JSON.stringify(proEditorFiles));
    } catch {}
  }

  function getLangExtensionForFile(filename) {
    const engine = window.ForDevCodeEngine;
    if (!engine) return [];
    const ext = filename.split(".").pop().toLowerCase();
    if (ext === "html" || ext === "htm") return [engine.langs.html()];
    if (ext === "css") return [engine.langs.css()];
    if (ext === "js") return [engine.langs.javascript()];
    if (ext === "py") return [engine.langs.python()];
    return [];
  }

  function mountCodeEditorInstance(hostEl, filename) {
    if (!hostEl) return;
    const code = proEditorFiles[filename] ?? "";
    const engine = window.ForDevCodeEngine;

    if (proEditorView) {
      proEditorView.destroy();
      proEditorView = null;
    }

    hostEl.innerHTML = "";

    if (engine) {
      const extensions = [
        engine.basicSetup,
        ...getLangExtensionForFile(filename),
        engine.EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            proEditorFiles[proActiveFile] = update.state.doc.toString();
            saveProEditorFiles();
          }
        })
      ];
      if (state.theme !== "light") extensions.push(engine.oneDark);
      proEditorView = new engine.EditorView({ doc: code, extensions, parent: hostEl });
    } else {
      const wrapper = document.createElement("div");
      wrapper.className = "fd-colored-editor-wrap";

      const pre = document.createElement("pre");
      pre.id = "fdProEditorHighlight";
      pre.className = "fd-colored-highlight";
      pre.setAttribute("aria-hidden", "true");

      const ta = document.createElement("textarea");
      ta.className = "fordev-fallback-textarea fd-colored-textarea";
      ta.value = code;
      ta.spellcheck = false;

      pre.innerHTML = colorizeCodeText(code, filename);

      ta.addEventListener("input", () => {
        proEditorFiles[proActiveFile] = ta.value;
        saveProEditorFiles();
        syncColoredEditorOverlay(ta.value, proActiveFile);
      });

      ta.addEventListener("scroll", () => {
        pre.scrollTop = ta.scrollTop;
        pre.scrollLeft = ta.scrollLeft;
      });

      wrapper.appendChild(pre);
      wrapper.appendChild(ta);
      hostEl.appendChild(wrapper);
    }
  }

  function renderProEditorTabs() {
    const tabsHost = document.getElementById("fdProEditorTabs");
    if (!tabsHost) return;
    tabsHost.innerHTML = Object.keys(proEditorFiles)
      .map(
        (fname) => `
        <button type="button" class="fd-ed-tab ${fname === proActiveFile ? "active" : ""}" data-ed-file="${fname}">
          ${fname}
        </button>
      `
      )
      .join("");
  }

  function initForDevProEditor() {
    const slot = document.getElementById("fordevEditorSlot");
    if (!slot || slot.dataset.initialized === "1") return;
    slot.dataset.initialized = "1";

    loadProEditorFiles();

    slot.innerHTML = `
      <div class="fd-pro-editor-shell">
        <div class="fd-pro-editor-topbar">
          <div class="fd-pro-editor-title">
            <span>ForDev Code Editor</span>
          </div>
          <div class="fd-pro-editor-actions">
            <button type="button" id="fdEdNewFileBtn" title="ملف جديد">+ ملف</button>
            <button type="button" id="fdEdRunBtn" class="primary">▶ معاينة</button>
            <button type="button" id="fdEdCopyBtn">نسخ</button>
            <button type="button" id="fdEdDownloadBtn">تنزيل</button>
            <button type="button" id="fdEdCloseBtn" title="إغلاق">✕</button>
          </div>
        </div>

        <div class="fd-pro-editor-tabs" id="fdProEditorTabs"></div>

        <div class="fd-pro-editor-body">
          <div id="fdProEditorHost" class="fd-pro-editor-host"></div>
          <div id="fdProEditorPreviewWrap" class="fd-pro-editor-preview hidden">
            <div class="fd-preview-bar">
              <span>المعاينة الحية</span>
              <button type="button" id="fdEdClosePreviewBtn">إخفاء المعاينة</button>
            </div>
            <iframe id="fdProEditorPreviewFrame" sandbox="allow-scripts allow-modals"></iframe>
          </div>
        </div>
      </div>
    `;

    renderProEditorTabs();
    mountCodeEditorInstance(document.getElementById("fdProEditorHost"), proActiveFile);

    slot.querySelector("#fdProEditorTabs")?.addEventListener("click", (e) => {
      const tab = e.target.closest("[data-ed-file]");
      if (!tab) return;
      proActiveFile = tab.dataset.edFile;
      renderProEditorTabs();
      mountCodeEditorInstance(document.getElementById("fdProEditorHost"), proActiveFile);
    });

    slot.querySelector("#fdEdNewFileBtn")?.addEventListener("click", () => {
      const name = prompt("أدخل اسم الملف الجديد (مثال: app.js أو page.html):", "new.js");
      if (!name || !name.trim()) return;
      const clean = name.trim();
      if (!(clean in proEditorFiles)) {
        proEditorFiles[clean] = "";
        saveProEditorFiles();
      }
      proActiveFile = clean;
      renderProEditorTabs();
      mountCodeEditorInstance(document.getElementById("fdProEditorHost"), proActiveFile);
    });

    slot.querySelector("#fdEdRunBtn")?.addEventListener("click", () => {
      const previewWrap = document.getElementById("fdProEditorPreviewWrap");
      const iframe = document.getElementById("fdProEditorPreviewFrame");
      if (!previewWrap || !iframe) return;

      const html = proEditorFiles["index.html"] || "";
      const css = proEditorFiles["style.css"] || "";
      const js = proEditorFiles["script.js"] || "";

      iframe.srcdoc = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>${css}</style>
</head>
<body>
  ${html}
  <script>${js}<\/script>
</body>
</html>`;

      previewWrap.classList.remove("hidden");
    });

    slot.querySelector("#fdEdClosePreviewBtn")?.addEventListener("click", () => {
      document.getElementById("fdProEditorPreviewWrap")?.classList.add("hidden");
    });

    slot.querySelector("#fdEdCopyBtn")?.addEventListener("click", async () => {
      const text = proEditorFiles[proActiveFile] || "";
      try {
        await navigator.clipboard.writeText(text);
        showToast("تم نسخ كود " + proActiveFile);
      } catch {
        showToast("تعذر النسخ");
      }
    });

    slot.querySelector("#fdEdDownloadBtn")?.addEventListener("click", () => {
      const text = proEditorFiles[proActiveFile] || "";
      triggerFileDownload(proActiveFile, text);
      showToast("تم تنزيل " + proActiveFile);
    });

    slot.querySelector("#fdEdCloseBtn")?.addEventListener("click", () => {
      slot.classList.remove("editor-slot-open");
      if (typeof window.goToForDevSection === "function") {
        window.goToForDevSection("tools");
      }
    });
  }

  (() => {
    let stageEl = null;
    const sectionMap = {};

    function appendSectionFooter(sectionEl, extraClass = "") {
      if (!sectionEl) return;
      const selector = extraClass ? `.section-end-footer.${extraClass}` : ".section-end-footer:not(.tool-detail-footer)";
      if (sectionEl.querySelector(selector)) return;
      const footer = document.createElement("footer");
      footer.className = extraClass ? `section-end-footer ${extraClass}` : "section-end-footer";
      footer.textContent = "طور بواسطة DOT";
      sectionEl.appendChild(footer);
    }

    function placeWeb3InsideToolsPage(toolsPage) {
      if (!web3Panel || !toolsPage) return;
      const ws = toolsPage.querySelector(".workspace-wrapper") || toolsPage;
      if (web3Panel.parentElement !== ws) ws.appendChild(web3Panel);
      syncWeb3Visibility(state.toolId);
    }

    function ensureToolBackBar(workspaceSec) {
      if (!workspaceSec || workspaceSec.querySelector(".tool-back-bar")) return;
      const bar = document.createElement("div");
      bar.className = "tool-back-bar";
      bar.innerHTML = `<button type="button" id="backToToolsBtn" class="btn btn-secondary">← رجوع إلى الأدوات</button>`;
      workspaceSec.insertBefore(bar, workspaceSec.firstChild);
    }

    function createSearchBar(key, placeholder) {
      const bar = document.createElement("div");
      bar.className = "section-search-bar";
      bar.innerHTML = `
        <input type="search" class="section-search-input" data-section-search="${key}" placeholder="${placeholder}" aria-label="${placeholder}" />
        <button type="button" class="section-search-clear" data-clear-search="${key}" title="مسح البحث">✕</button>
        <span class="section-search-count" data-search-count="${key}">100 عنصر</span>
      `;
      return bar;
    }

    function createCustomSection(key, titleAr, searchPlaceholder, withBgTabs = false) {
      const sec = document.createElement("section");
      sec.className = "fordev-page-section";
      sec.dataset.pageKey = key;

      const box = document.createElement("div");
      box.className = "design-assets-section";

      const head = document.createElement("div");
      head.className = "section-head";
      head.innerHTML = `<h2>${titleAr}</h2>`;
      box.appendChild(head);

      box.appendChild(createSearchBar(key, searchPlaceholder));

      if (withBgTabs) {
        const tabs = document.createElement("div");
        tabs.className = "icon-mode-tabs";
        tabs.innerHTML = `
          <button type="button" class="icon-mode-btn active" data-bg-tab="backgrounds">الخلفيات</button>
          <button type="button" class="icon-mode-btn" data-bg-tab="illustrations">أيقونات توضيحية</button>
        `;
        box.appendChild(tabs);
      }

      const grid = document.createElement("div");
      grid.className = "asset-grid";
      box.appendChild(grid);

      sec.appendChild(box);
      appendSectionFooter(sec);
      return sec;
    }

    function initHorizontalPages() {
      if (stageEl && stageEl.isConnected) {
        placeWeb3InsideToolsPage(sectionMap.tools);
        return stageEl;
      }

      const navbar = document.querySelector(".navbar");
      const hero = document.querySelector(".hero-section");
      const toolsSec = document.querySelector(".tools-section");
      const workspaceSec = document.querySelector(".workspace-wrapper");
      const assetsSec = document.getElementById("designAssetsSection");

      const stage = document.createElement("div");
      stage.id = "fordevHorizontalStage";

      const toolsPage = document.createElement("section");
      toolsPage.className = "fordev-page-section";
      toolsPage.dataset.pageKey = "tools";

      if (hero) toolsPage.appendChild(hero);
      if (toolsSec) toolsPage.appendChild(toolsSec);
      if (workspaceSec) {
        ensureToolBackBar(workspaceSec);
        ensureRealBuildPanel(workspaceSec);
        toolsPage.appendChild(workspaceSec);
      }
      placeWeb3InsideToolsPage(toolsPage);
      appendSectionFooter(toolsPage);
      appendSectionFooter(toolsPage, "tool-detail-footer");

      const templatesPage = createCustomSection(
        "templates",
        "القوالب والأكواد الجاهزة",
        "ابحث في القوالب (رقم، اسم، HTML، CSS، JS، Python)..."
      );
      const designsPage = createCustomSection(
        "designs",
        "التصاميم الجاهزة",
        "ابحث في التصاميم الجاهزة (رقم، اسم، Layout، Theme)..."
      );
      const backgroundsPage = createCustomSection(
        "backgrounds",
        "الخلفيات والأيقونات التوضيحية",
        "ابحث في الخلفيات والأيقونات التوضيحية (رقم، اسم، SVG، صورة)...",
        true
      );

      stage.appendChild(toolsPage);
      stage.appendChild(templatesPage);
      stage.appendChild(designsPage);
      stage.appendChild(backgroundsPage);

      if (assetsSec && assetsSec.parentElement) assetsSec.remove();
      document.querySelectorAll("body > .site-footer").forEach((f) => f.remove());

      if (navbar && navbar.nextSibling) navbar.parentElement.insertBefore(stage, navbar.nextSibling);
      else document.body.insertBefore(stage, document.body.firstChild);

      sectionMap.tools = toolsPage;
      sectionMap.templates = templatesPage;
      sectionMap.designs = designsPage;
      sectionMap.backgrounds = backgroundsPage;

      stageEl = stage;
      return stage;
    }

    function setNavActive(key) {
      document.querySelectorAll("[data-bnav]").forEach((item) => {
        item.classList.toggle("active", item.dataset.bnav === key);
      });
    }

    function goToSectionHorizontal(key) {
      const stage = initHorizontalPages();
      const targetSec = sectionMap[key];
      if (!stage || !targetSec) {
        setNavActive(key);
        return;
      }

      setNavActive(key);
      targetSec.scrollTop = 0;

      requestAnimationFrame(() => {
        const isRtl = document.documentElement.dir === "rtl";
        const stageRect = stage.getBoundingClientRect();
        const secRect = targetSec.getBoundingClientRect();
        const delta = isRtl ? stageRect.right - secRect.right : secRect.left - stageRect.left;

        stage.scrollTo({
          top: 0,
          left: stage.scrollLeft + (isRtl ? -delta : delta),
          behavior: "smooth"
        });
      });
    }

    window.initForDevPages = initHorizontalPages;
    window.setForDevNavActive = setNavActive;
    window.goToForDevSection = goToSectionHorizontal;
  })();

  document.addEventListener("input", (e) => {
    const colorPicker = e.target.closest(".icon-custom-color-input");
    if (colorPicker) {
      currentIconColor = colorPicker.value || "#38bdf8";
      renderBackgroundsSection();
      return;
    }

    const searchInput = e.target.closest("[data-section-search]");
    if (!searchInput) return;
    const secKey = searchInput.dataset.sectionSearch;
    searchQueries[secKey] = searchInput.value;

    if (secKey === "templates") renderTemplatesSection();
    else if (secKey === "designs") renderDesignsSection();
    else if (secKey === "backgrounds") renderBackgroundsSection();
  });

  document.addEventListener("click", (e) => {
    const clearSearchBtn = e.target.closest("[data-clear-search]");
    if (clearSearchBtn) {
      const secKey = clearSearchBtn.dataset.clearSearch;
      searchQueries[secKey] = "";
      const inputEl = document.querySelector(`[data-section-search="${secKey}"]`);
      if (inputEl) inputEl.value = "";
      if (secKey === "templates") renderTemplatesSection();
      else if (secKey === "designs") renderDesignsSection();
      else if (secKey === "backgrounds") renderBackgroundsSection();
      return;
    }

    const quickColorBtn = e.target.closest("[data-icon-color]");
    if (quickColorBtn) {
      currentIconColor = quickColorBtn.dataset.iconColor || "#38bdf8";
      renderBackgroundsSection();
      return;
    }

    const navItem = e.target.closest("[data-bnav]");
    if (navItem) {
      const key = navItem.dataset.bnav;
      if (!key) return;

      if (key === "editor") {
        window.setForDevNavActive?.("editor");
        const slot = document.getElementById("fordevEditorSlot");
        if (slot) slot.classList.add("editor-slot-open");
        return;
      }

      const slot = document.getElementById("fordevEditorSlot");
      if (slot) slot.classList.remove("editor-slot-open");

      if (key === "tools") closeToolSeparatePage();
      window.goToForDevSection?.(key);
      return;
    }

    const bgTabBtn = e.target.closest("[data-bg-tab]");
    if (bgTabBtn) {
      currentBgTab = bgTabBtn.dataset.bgTab || "backgrounds";
      document.querySelectorAll("[data-bg-tab]").forEach((b) => {
        b.classList.toggle("active", b.dataset.bgTab === currentBgTab);
      });
      renderBackgroundsSection();
      return;
    }

    const card = e.target.closest("[data-tool]");
    if (card && card.dataset.tool) {
      e.preventDefault();
      openToolSeparatePage(card.dataset.tool, true);
      return;
    }

    if (e.target.closest("#backToToolsBtn")) {
      closeToolSeparatePage();
    }
  });

  loadBuildConfig();
  loadSavedState();
  applyTheme(state.theme);
  ensureMiddleEditorIconAndOrder();
  initForDevProEditor();
  applyUiLanguage(state.uiLang);
  selectTool(state.toolId, true);
  window.initForDevPages();
  window.setForDevNavActive("tools");
  isToolPageOpen = false;
  syncHybridToolView();
  renderDesignLibraries();
})();

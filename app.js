(() => {
  const STORAGE_KEY = "fordev_studio_state_v2";
  const WEB3_STORAGE_KEY = "fordev_v2_web3_files_v1";
  const BUILD_CFG_STORAGE_KEY = "fordev_v2_build_config_v1";
  const WEB3_SUPPORTED_TOOLS = new Set(["web-to-app", "web-pack"]);

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
  let currentIconMode = "standard";
  let isToolPageOpen = false;
  let buildConfig = defaultBuildConfig();

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
      heroDesc: "منصة متكاملة للمطورين تجمع بين تحويل صيغ الأكواد ونقل واجهات الويب إلى أطر التطبيقات، مع مكتبات الخطوط والأيقونات والخلفيات، ومعاينة حية، وحفظ تلقائي.",
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
      copied: "تم نسخ النتيجة إلى الحافظة",
      pasted: "تم لصق الكود",
      cleared: "تم مسح المحرر",
      resetDone: "تمت إعادة ضبط الأداة",
      downloaded: "تم تنزيل الملف بنجاح",
      fontSamplePlaceholder: "اكتب نصًا لتجربة الخطوط مباشرة — ForDev Studio 2026",
      copyCss: "نسخ CSS",
      copySvg: "نسخ SVG",
      insertCss: "إدراج CSS",
      insertHtml: "إدراج HTML",
      navTools: "الأدوات",
      navFonts: "الخطوط",
      navIcons: "الأيقونات",
      navBackgrounds: "الخلفيات",
      standardIconsBtn: "أيقونات عادية",
      illustrationIconsBtn: "أيقونات توضيحية",
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
      copied: "Output copied to clipboard",
      pasted: "Code pasted",
      cleared: "Editor cleared",
      resetDone: "Tool reset to default",
      downloaded: "File downloaded successfully",
      fontSamplePlaceholder: "Type text to preview fonts live — ForDev Studio 2026",
      copyCss: "Copy CSS",
      copySvg: "Copy SVG",
      insertCss: "Insert CSS",
      insertHtml: "Insert HTML",
      navTools: "Tools",
      navFonts: "Fonts",
      navIcons: "Icons",
      navBackgrounds: "Backgrounds",
      standardIconsBtn: "Standard Icons",
      illustrationIconsBtn: "Illustrations",
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

  function loadBuildConfig() {
    try {
      const raw = localStorage.getItem(BUILD_CFG_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        buildConfig = { ...defaultBuildConfig(), ...parsed };
      }
    } catch {
      // تجاهل أخطاء التخزين
    }
  }

  function saveBuildConfig() {
    try {
      localStorage.setItem(BUILD_CFG_STORAGE_KEY, JSON.stringify(buildConfig));
    } catch {
      // تجاهل أخطاء السعة
    }
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
    if (notesSec) {
      workspaceSec.insertBefore(panel, notesSec);
    } else {
      workspaceSec.appendChild(panel);
    }

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
    const toolsPage = document.querySelector('.fordev-page-section[data-page-key="tools"]');
    if (!toolsPage) return;
    toolsPage.classList.toggle("tool-detail-open", isToolPageOpen);
    toolsPage.scrollTop = 0;
  }

  function openToolSeparatePage(toolId, autoRun = true) {
    selectTool(toolId, autoRun);
    isToolPageOpen = true;
    syncHybridToolView();
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
    } catch {
      // تجاهل أخطاء التخزين
    }
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
    } catch {
      // تجاهل أخطاء السعة
    }
  }

  function saveWeb3Files() {
    try {
      localStorage.setItem(WEB3_STORAGE_KEY, JSON.stringify(web3Files));
    } catch {
      // تجاهل أخطاء السعة
    }
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
    } catch {
      // تجاهل أخطاء التخزين
    }
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
    if (!allowed) {
      previewBox.classList.add("hidden");
    }
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
    } catch {
      // تجاهل أخطاء التخزين
    }
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

    if (autoRun) {
      runTool();
    } else if (savedTool?.targetCode !== undefined) {
      renderOutput(savedTool.targetCode);
    }

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

    if (!previewBox.classList.contains("hidden")) {
      updatePreviewFrame();
    }
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
      sunIcon.classList.remove("hidden");
      moonIcon.classList.add("hidden");
    } else {
      sunIcon.classList.add("hidden");
      moonIcon.classList.remove("hidden");
    }
    saveState();
  }

  function applyDesignAssetsLanguage(lang) {
    const dict = I18N[lang] || I18N.ar;
    const fontSampleInput = document.getElementById("fontLiveSampleInput");
    const backBtn = document.getElementById("backToToolsBtn");

    if (fontSampleInput) {
      fontSampleInput.placeholder = dict.fontSamplePlaceholder;
    }

    if (backBtn) {
      backBtn.textContent = dict.backToTools;
    }

    document.querySelectorAll('[data-icon-mode="standard"]').forEach((btn) => {
      btn.textContent = dict.standardIconsBtn;
    });
    document.querySelectorAll('[data-icon-mode="illustrations"]').forEach((btn) => {
      btn.textContent = dict.illustrationIconsBtn;
    });

    document.querySelectorAll('[data-page-key="fonts"] .asset-copy-btn, #assetPanelFonts .asset-copy-btn').forEach((btn) => {
      btn.textContent = dict.copyCss;
    });
    document.querySelectorAll('[data-page-key="fonts"] .asset-insert-btn, #assetPanelFonts .asset-insert-btn').forEach((btn) => {
      btn.textContent = dict.insertCss;
    });

    document.querySelectorAll('[data-page-key="icons"] .asset-copy-btn, #assetPanelIcons .asset-copy-btn').forEach((btn) => {
      btn.textContent = dict.copySvg;
    });
    document.querySelectorAll('[data-page-key="icons"] .asset-insert-btn, #assetPanelIcons .asset-insert-btn').forEach((btn) => {
      btn.textContent = dict.insertHtml;
    });

    document.querySelectorAll('[data-page-key="backgrounds"] .asset-copy-btn, #assetPanelBackgrounds .asset-copy-btn').forEach((btn) => {
      btn.textContent = dict.copyCss;
    });
    document.querySelectorAll('[data-page-key="backgrounds"] .asset-insert-btn, #assetPanelBackgrounds .asset-insert-btn').forEach((btn) => {
      btn.textContent = dict.insertCss;
    });

    const navLabelMap = {
      tools: dict.navTools,
      fonts: dict.navFonts,
      icons: dict.navIcons,
      backgrounds: dict.navBackgrounds
    };

    document.querySelectorAll("[data-bnav]").forEach((item) => {
      const key = item.dataset.bnav;
      const labelEl = item.querySelector(".bnav-label");
      if (labelEl && navLabelMap[key]) {
        labelEl.textContent = navLabelMap[key];
      }
    });

    applyRealBuildLanguage(lang);
  }

  function applyUiLanguage(lang) {
    state.uiLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    langToggle.textContent = lang === "ar" ? "EN" : "عربي";

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (I18N[lang] && I18N[lang][key]) {
        el.textContent = I18N[lang][key];
      }
    });

    const cfg = TOOLS_CONFIG[state.toolId];
    if (cfg) {
      activeToolBadge.textContent = lang === "ar" ? cfg.titleAr : cfg.titleEn;
      activeToolHint.textContent = lang === "ar" ? cfg.hintAr : cfg.hintEn;
    }

    updateStats(sourceCodeEl.value, sourceStatsEl);
    updateStats(targetCodeEl.value, targetStatsEl);
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

  toolsGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".tool-card");
    if (card && card.dataset.tool) {
      openToolSeparatePage(card.dataset.tool, true);
    }
  });

  convertBtn.addEventListener("click", runTool);

  swapBtn.addEventListener("click", () => {
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

  sampleBtn.addEventListener("click", () => {
    const cfg = TOOLS_CONFIG[state.toolId];
    if (!cfg) return;
    sourceCodeEl.value = cfg.sample;
    updateLineNumbers(sourceCodeEl.value, sourceLinesEl);
    updateStats(sourceCodeEl.value, sourceStatsEl);
    runTool();
  });

  if (resetToolBtn) {
    resetToolBtn.addEventListener("click", () => {
      delete state.toolData[state.toolId];
      if (WEB3_SUPPORTED_TOOLS.has(state.toolId)) {
        resetWeb3Files();
      }
      selectTool(state.toolId, true);
      showToast(I18N[state.uiLang].resetDone);
    });
  }

  previewBtn.addEventListener("click", () => {
    if (!canPreviewCurrentTool()) return;
    previewBox.classList.remove("hidden");
    updatePreviewFrame();
  });

  closePreviewBtn.addEventListener("click", () => {
    previewBox.classList.add("hidden");
  });

  sourceCodeEl.addEventListener("keydown", (e) => {
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

  sourceCodeEl.addEventListener("input", () => {
    updateLineNumbers(sourceCodeEl.value, sourceLinesEl);
    updateStats(sourceCodeEl.value, sourceStatsEl);
    saveState();
    if (!previewBox.classList.contains("hidden")) {
      updatePreviewFrame();
    }
  });

  sourceCodeEl.addEventListener("scroll", () => {
    sourceLinesEl.scrollTop = sourceCodeEl.scrollTop;
  });

  highlightedOutputEl.addEventListener("scroll", () => {
    targetLinesEl.scrollTop = highlightedOutputEl.scrollTop;
  });

  sourceLangEl.addEventListener("change", () => {
    syncPreviewAvailability();
    saveState();
  });

  targetLangEl.addEventListener("change", runTool);

  pasteBtn.addEventListener("click", async () => {
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

  clearBtn.addEventListener("click", () => {
    sourceCodeEl.value = "";
    renderOutput("");
    updateLineNumbers("", sourceLinesEl);
    updateStats("", sourceStatsEl);
    saveState();
    showToast(I18N[state.uiLang].cleared);
  });

  copyBtn.addEventListener("click", async () => {
    if (!targetCodeEl.value) return;
    try {
      await navigator.clipboard.writeText(targetCodeEl.value);
      showToast(I18N[state.uiLang].copied);
    } catch {
      showToast("تعذر النسخ تلقائيًا");
    }
  });

  downloadBtn.addEventListener("click", () => {
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

  themeToggle.addEventListener("click", () => {
    applyTheme(state.theme === "dark" ? "light" : "dark");
  });

  langToggle.addEventListener("click", () => {
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
        {
          name: "index.html",
          code: '<div class="card">\n  <h3>ForDev Studio</h3>\n  <button>Start</button>\n</div>'
        },
        {
          name: "style.css",
          code: ".card {\n  padding: 16px;\n  border-radius: 12px;\n}"
        },
        {
          name: "script.js",
          code: "console.log('3 web files bundled');"
        }
      ];
      saveWeb3Files();
      renderWeb3Slot(web3ActiveIndex);
    });

    web3PackBtn?.addEventListener("click", () => {
      const htmlCode = web3Files[0]?.code || "";
      const cssCode = web3Files[1]?.code || "";
      const jsCode = web3Files[2]?.code || "";

      let combined = "";
      if (state.toolId === "web-pack") {
        combined = [
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
        ].join("\n");
      } else {
        combined = web3Files
          .map((f, i) => `/* --- FILE ${i + 1}: ${f.name || `file_${i + 1}`} --- */\n${f.code}`)
          .join("\n\n");
      }

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

  function isIllustrationIcon(icon) {
    const cat = String(icon?.category || "").toLowerCase();
    const title = String(icon?.title || "").toLowerCase();
    return (
      cat.includes("undraw") ||
      cat.includes("illustration") ||
      cat.includes("توضيح") ||
      title.includes("توضيح") ||
      title.includes("illustration")
    );
  }

  function renderIconsList(iconsGridEl) {
    if (!iconsGridEl || !Array.isArray(window.ICONS_LIBRARY)) return;

    const filtered = window.ICONS_LIBRARY.filter((icon) => {
      const isIllus = isIllustrationIcon(icon);
      return currentIconMode === "illustrations" ? isIllus : !isIllus;
    });

    iconsGridEl.innerHTML = filtered
      .map((icon) => {
        const isIllus = isIllustrationIcon(icon);
        return `
          <div class="asset-card">
            <div class="asset-preview ${isIllus ? "undraw-illustration-preview" : ""}">${icon.svg}</div>
            <div class="asset-title">${icon.title}</div>
            ${icon.category ? `<div class="asset-meta">${icon.category}</div>` : ""}
            <div class="asset-actions">
              <button type="button" class="asset-copy-btn" data-copy="${encodeURIComponent(icon.svg)}" data-encoded="1">نسخ SVG</button>
              <button type="button" class="asset-insert-btn" data-insert="${encodeURIComponent(icon.svg)}" data-target-slot="0" data-label="الأيقونة (${icon.title})" data-encoded="1">إدراج HTML</button>
            </div>
          </div>
        `;
      })
      .join("");

    iconsGridEl.querySelectorAll('[data-encoded="1"]').forEach((btn) => {
      if (btn.dataset.copy) btn.dataset.copy = decodeURIComponent(btn.dataset.copy);
      if (btn.dataset.insert) btn.dataset.insert = decodeURIComponent(btn.dataset.insert);
      btn.removeAttribute("data-encoded");
    });

    attachAssetActions(iconsGridEl);
    applyDesignAssetsLanguage(state.uiLang);
  }

  function renderDesignLibraries() {
    const fontsGridEl =
      document.querySelector('[data-page-key="fonts"] .asset-grid') ||
      document.querySelector("#assetPanelFonts .asset-grid");
    const iconsGridEl =
      document.querySelector('[data-page-key="icons"] .asset-grid') ||
      document.querySelector("#assetPanelIcons .asset-grid");
    const backgroundsGridEl =
      document.querySelector('[data-page-key="backgrounds"] .asset-grid') ||
      document.querySelector("#assetPanelBackgrounds .asset-grid");

    if (fontsGridEl && Array.isArray(window.FONTS_LIBRARY)) {
      fontsGridEl.innerHTML = window.FONTS_LIBRARY.map(
        (font) => `
          <div class="asset-card">
            <div class="asset-preview font-live-text" style="font-family: ${font.family};">${font.sample}</div>
            <div class="asset-title">${font.title}</div>
            ${font.category ? `<div class="asset-meta">${font.category}</div>` : ""}
            <div class="asset-actions">
              <button type="button" class="asset-copy-btn" data-copy="${encodeURIComponent(font.css)}" data-encoded="1">نسخ CSS</button>
              <button type="button" class="asset-insert-btn" data-insert="${encodeURIComponent(font.css)}" data-target-slot="1" data-label="الخط (${font.title})" data-encoded="1">إدراج CSS</button>
            </div>
          </div>
        `
      ).join("");
    }

    if (iconsGridEl && Array.isArray(window.ICONS_LIBRARY)) {
      renderIconsList(iconsGridEl);
    }

    if (backgroundsGridEl && Array.isArray(window.BACKGROUNDS_LIBRARY)) {
      backgroundsGridEl.innerHTML = window.BACKGROUNDS_LIBRARY.map(
        (bg) => `
          <div class="asset-card">
            <div class="asset-preview" style="${bg.previewStyle}"></div>
            <div class="asset-title">${bg.title}</div>
            ${bg.category ? `<div class="asset-meta">${bg.category}</div>` : ""}
            <div class="asset-actions">
              <button type="button" class="asset-copy-btn" data-copy="${encodeURIComponent(bg.css)}" data-encoded="1">نسخ CSS</button>
              <button type="button" class="asset-insert-btn" data-insert="${encodeURIComponent(bg.css)}" data-target-slot="1" data-label="الخلفية (${bg.title})" data-encoded="1">إدراج CSS</button>
            </div>
          </div>
        `
      ).join("");
    }

    const rootScope = document.getElementById("fordevHorizontalStage") || document;
    rootScope.querySelectorAll('[data-encoded="1"]').forEach((btn) => {
      if (btn.dataset.copy) btn.dataset.copy = decodeURIComponent(btn.dataset.copy);
      if (btn.dataset.insert) btn.dataset.insert = decodeURIComponent(btn.dataset.insert);
      btn.removeAttribute("data-encoded");
    });

    attachAssetActions(rootScope);
    applyDesignAssetsLanguage(state.uiLang);
  }

  document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "backToToolsBtn") {
      closeToolSeparatePage();
      return;
    }

    const modeBtn = e.target.closest("[data-icon-mode]");
    if (!modeBtn) return;

    currentIconMode = modeBtn.dataset.iconMode || "standard";
    document.querySelectorAll("[data-icon-mode]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.iconMode === currentIconMode);
    });

    const iconsGridEl =
      document.querySelector('[data-page-key="icons"] .asset-grid') ||
      document.querySelector("#assetPanelIcons .asset-grid");
    renderIconsList(iconsGridEl);
  });

  document.addEventListener("input", (e) => {
    if (e.target && e.target.id === "fontLiveSampleInput") {
      const val = e.target.value.trim();
      if (!val) return;
      document.querySelectorAll(".font-live-text").forEach((el) => {
        el.textContent = val;
      });
    }
  });

  // بناء الأقسام المستقلة الأفقية ولكل قسم فوتر خاص "طور بواسطة DOT" ونهاية واضحة
  (() => {
    const navItems = document.querySelectorAll("[data-bnav]");
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
      if (web3Panel.parentElement !== ws) {
        ws.appendChild(web3Panel);
      }
      syncWeb3Visibility(state.toolId);
    }

    function ensureToolBackBar(workspaceSec) {
      if (!workspaceSec || workspaceSec.querySelector(".tool-back-bar")) return;
      const bar = document.createElement("div");
      bar.className = "tool-back-bar";
      bar.innerHTML = `<button type="button" id="backToToolsBtn" class="btn btn-secondary">← رجوع إلى الأدوات</button>`;
      workspaceSec.insertBefore(bar, workspaceSec.firstChild);
    }

    function createStandaloneAssetSection(key, titleAr, sourcePanel) {
      const sec = document.createElement("section");
      sec.className = "fordev-page-section";
      sec.dataset.pageKey = key;

      const box = document.createElement("div");
      box.className = "design-assets-section";

      const head = document.createElement("div");
      head.className = "section-head";
      head.innerHTML = `<h2>${titleAr}</h2>`;
      box.appendChild(head);

      if (key === "fonts") {
        const tester = document.createElement("div");
        tester.className = "font-custom-tester";
        tester.innerHTML = `<input id="fontLiveSampleInput" type="text" placeholder="اكتب نصًا لتجربة الخطوط مباشرة — ForDev Studio 2026" />`;
        box.appendChild(tester);
      }

      if (key === "icons") {
        const filterBar = document.createElement("div");
        filterBar.className = "icon-mode-tabs";
        filterBar.innerHTML = `
          <button type="button" class="icon-mode-btn active" data-icon-mode="standard">أيقونات عادية</button>
          <button type="button" class="icon-mode-btn" data-icon-mode="illustrations">أيقونات توضيحية</button>
        `;
        box.appendChild(filterBar);
      }

      const grid = sourcePanel ? sourcePanel.querySelector(".asset-grid") : null;
      const newGrid = document.createElement("div");
      newGrid.className = "asset-grid";
      if (grid) {
        newGrid.id = grid.id || "";
        newGrid.innerHTML = grid.innerHTML;
      }
      box.appendChild(newGrid);
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

      const fontsPanel = document.getElementById("assetPanelFonts");
      const iconsPanel = document.getElementById("assetPanelIcons");
      const backgroundsPanel = document.getElementById("assetPanelBackgrounds");

      const fontsPage = createStandaloneAssetSection("fonts", "مكتبة الخطوط", fontsPanel);
      const iconsPage = createStandaloneAssetSection("icons", "مكتبة الأيقونات", iconsPanel);
      const backgroundsPage = createStandaloneAssetSection("backgrounds", "مكتبة الخلفيات", backgroundsPanel);

      stage.appendChild(toolsPage);
      stage.appendChild(fontsPage);
      stage.appendChild(iconsPage);
      stage.appendChild(backgroundsPage);

      if (assetsSec && assetsSec.parentElement) {
        assetsSec.remove();
      }

      document.querySelectorAll("body > .site-footer").forEach((f) => f.remove());

      if (navbar && navbar.nextSibling) {
        navbar.parentElement.insertBefore(stage, navbar.nextSibling);
      } else {
        document.body.insertBefore(stage, document.body.firstChild);
      }

      sectionMap.tools = toolsPage;
      sectionMap.fonts = fontsPage;
      sectionMap.icons = iconsPage;
      sectionMap.backgrounds = backgroundsPage;

      stageEl = stage;
      return stage;
    }

    function setNavActive(key) {
      navItems.forEach((item) => {
        item.classList.toggle("active", item.dataset.bnav === key);
      });
    }

    function goToSectionHorizontal(key) {
      const stage = initHorizontalPages();
      const targetSec = sectionMap[key];
      if (!stage || !targetSec) return;

      if (key === "tools") {
        isToolPageOpen = false;
        syncHybridToolView();
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

    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        const key = item.dataset.bnav;
        if (key) {
          goToSectionHorizontal(key);
        }
      });
    });
  })();

  // التهيئة الأولية المرتبة
  loadBuildConfig();
  loadSavedState();
  applyTheme(state.theme);
  applyUiLanguage(state.uiLang);
  selectTool(state.toolId, true);
  window.initForDevPages();
  window.setForDevNavActive("tools");
  isToolPageOpen = false;
  syncHybridToolView();
  renderDesignLibraries();
})();

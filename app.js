(() => {
  const STORAGE_KEY = "fordev_studio_state_v4";
  const WEB3_STORAGE_KEY = "fordev_v2_web3_files_v1";
  const BUILD_CFG_STORAGE_KEY = "fordev_v2_build_config_v1";
<<<<<<< HEAD
=======
  const GEMINI_KEY_STORAGE = "fordev_v2_gemini_api_key";
  const ACTIVE_FILE_STORAGE = "fordev_active_editor_file_v1";
>>>>>>> 1f34f26cd70c0fc2e724750a9726902e6b7b81ce
  const WEB3_SUPPORTED_TOOLS = new Set(["web-to-app", "web-pack"]);

  const SUPPORTED_10_LANGS = [
    { id: "html", label: "HTML", ext: "html" },
    { id: "css", label: "CSS", ext: "css" },
    { id: "javascript", label: "JavaScript", ext: "js" },
    { id: "typescript", label: "TypeScript", ext: "ts" },
    { id: "python", label: "Python", ext: "py" },
    { id: "json", label: "JSON", ext: "json" },
    { id: "dart", label: "Dart / Flutter", ext: "dart" },
    { id: "kotlin", label: "Kotlin", ext: "kt" },
    { id: "php", label: "PHP", ext: "php" },
    { id: "sql", label: "SQL", ext: "sql" },
    { id: "xml", label: "XML / SVG", ext: "xml" }
  ];

  const LANG_SUGGESTIONS = {
    html: ["div", "section", "button", "input", "h1", "p", "a", "img", "script", "style", "class=", "id="],
    css: ["display: flex;", "justify-content: center;", "align-items: center;", "background:", "color:", "border-radius:", "padding:", "margin:"],
    javascript: ["const", "let", "function", "async", "await", "return", "document.getElementById", "addEventListener", "console.log", "fetch"],
    typescript: ["interface", "type", "const", "let", "function", "async", "Promise", "string", "number", "boolean"],
    python: ["def", "class", "import", "from", "return", "if", "elif", "else", "for", "while", "in", "print"],
    json: ['"name":', '"version":', '"description":', '"dependencies":', "true", "false", "null"],
    dart: ["Widget build(BuildContext context)", "Container", "Column", "Row", "Text", "ElevatedButton", "final", "const"],
    kotlin: ["fun main()", "class MainActivity", "override fun onCreate", "val", "var", "println"],
    php: ["<?php", "function", "echo", "$", "array", "return", "if", "foreach"],
    sql: ["SELECT", "FROM", "WHERE", "INSERT INTO", "UPDATE", "DELETE FROM", "JOIN", "ORDER BY"],
    xml: ["<manifest", "<application", "<activity", "xmlns:android=", "android:name="]
  };

  const toolsGrid = document.getElementById("toolsGrid");
  const activeToolBadge = document.getElementById("activeToolBadge");
  const activeToolHint = document.getElementById("activeToolHint");

  const sourceLangEl = document.getElementById("sourceLang");
  const targetLangEl = document.getElementById("targetLang");
  const targetCodeEl = document.getElementById("targetCode");
  const highlightedOutputEl = document.getElementById("highlightedOutput");
  const targetLinesEl = document.getElementById("targetLines");
  const targetStatsEl = document.getElementById("targetStats");
  const notesContentEl = document.getElementById("notesContent");

  const themeToggle = document.getElementById("themeToggle");
  const langToggle = document.getElementById("langToggle");
  const sunIcon = document.getElementById("sunIcon");
  const moonIcon = document.getElementById("moonIcon");
  const toastEl = document.getElementById("toast");

  const defaultCurrentFile = () => ({
    name: "untitled.js",
    lang: "javascript",
    code: ""
  });

<<<<<<< HEAD
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
=======
  // ملف واحد فقط يُفتح عندما يحرر المستخدم داخله (بدون شريط تبويبات جاهزة)
  let currentFile = defaultCurrentFile();
  let currentIconMode = "standard";
  let isToolPageOpen = false;
  let buildConfig = {
    appName: "ForDev App",
    packageId: "com.dotking.fordevapp",
    version: "1.0.0",
    themeColor: "#3b82f6"
  };
  let geminiApiKey = "";
  let foldedLines = new Set();
  let selectedLines = new Set();
  let currentSuggestions = [];
  let selectedSuggestionIdx = 0;
>>>>>>> 1f34f26cd70c0fc2e724750a9726902e6b7b81ce

  let state = {
    toolId: "syntax",
    uiLang: "ar",
    theme: "dark",
    toolData: {}
  };

  const I18N = {
    ar: {
      subtitle: "Developer Conversion & Packaging Hub",
      badge: "ForDev Studio v4.0",
      heroTitle: "أدوات عملية لتحويل الأكواد وتجهيز التطبيقات للمطورين",
      heroDesc: "منصة متكاملة للمطورين تجمع بين تحويل صيغ الأكواد ونقل واجهات الويب إلى أطر التطبيقات، مع محرر بأسلوب Spck ومكتبات الخطوط والأيقونات والخلفيات.",
      toolsHeading: "اختر الأداة المطلوبة",
      copied: "تم نسخ النتيجة إلى الحافظة",
      cleared: "تم مسح المحرر",
      navTools: "الأدوات",
      navFonts: "الخطوط",
      navIcons: "الأيقونات",
      navEditor: "المحرر",
      navBackgrounds: "الخلفيات",
      standardIconsBtn: "أيقونات عادية",
      illustrationIconsBtn: "أيقونات توضيحية",
<<<<<<< HEAD
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
=======
      backToTools: "خروج من الأداة",
      foldBtn: "طي الكتل",
      livePreviewBtn: "معاينة",
      insertIconBtn: "+ أيقونة",
      insertFontBtn: "+ خط",
      insertBgBtn: "+ خلفية",
      newFileBtn: "ملف جديد",
      selectLineBtn: "تحديد سطر",
      selectRangeBtn: "تحديد نطاق",
      clearSelectBtn: "إلغاء التحديد",
      copyLinesBtn: "نسخ المحدد",
      deleteLinesBtn: "حذف المحدد",
      geminiKeyPlaceholder: "Gemini API Key...",
      geminiSaveKey: "حفظ",
      geminiFixBtn: "فحص وتصحيح Gemini",
      geminiFixing: "جاري الفحص...",
      geminiMissingKey: "أدخل Gemini API Key أولاً",
      geminiFixedToast: "تم فحص وتصحيح الكود بواسطة Gemini"
>>>>>>> 1f34f26cd70c0fc2e724750a9726902e6b7b81ce
    },
    en: {
      subtitle: "Developer Conversion & Packaging Hub",
      badge: "ForDev Studio v4.0",
      heroTitle: "Practical Tools for Code Conversion & App Packaging",
      heroDesc: "A unified developer hub for code conversion, app packaging, live editor, fonts, icons, illustrations, and backgrounds.",
      toolsHeading: "Select a Tool",
      copied: "Copied to clipboard",
      cleared: "Editor cleared",
      navTools: "Tools",
      navFonts: "Fonts",
      navIcons: "Icons",
      navEditor: "Editor",
      navBackgrounds: "Backgrounds",
      standardIconsBtn: "Standard Icons",
      illustrationIconsBtn: "Illustrations",
<<<<<<< HEAD
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
=======
      backToTools: "Exit Tool",
      foldBtn: "Fold",
      livePreviewBtn: "Preview",
      insertIconBtn: "+ Icon",
      insertFontBtn: "+ Font",
      insertBgBtn: "+ BG",
      newFileBtn: "New File",
      selectLineBtn: "Select Line",
      selectRangeBtn: "Select Range",
      clearSelectBtn: "Clear Sel",
      copyLinesBtn: "Copy Sel",
      deleteLinesBtn: "Delete Sel",
      geminiKeyPlaceholder: "Gemini API Key...",
      geminiSaveKey: "Save",
      geminiFixBtn: "Fix with Gemini",
      geminiFixing: "Fixing...",
      geminiMissingKey: "Enter Gemini API Key first",
      geminiFixedToast: "Code checked and fixed by Gemini"
>>>>>>> 1f34f26cd70c0fc2e724750a9726902e6b7b81ce
    }
  };

  let toastTimer = null;

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2300);
  }

  window.showToast = showToast;

<<<<<<< HEAD
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
=======
  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
>>>>>>> 1f34f26cd70c0fc2e724750a9726902e6b7b81ce
  }

  function saveCurrentFile() {
    try {
      localStorage.setItem(ACTIVE_FILE_STORAGE, JSON.stringify(currentFile));
    } catch {
      // تجاهل
    }
  }

  function loadCurrentFile() {
    try {
      const raw = localStorage.getItem(ACTIVE_FILE_STORAGE);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        currentFile = {
          name: parsed.name || "untitled.js",
          lang: parsed.lang || "javascript",
          code: typeof parsed.code === "string" ? parsed.code : ""
        };
      }
    } catch {
      // تجاهل
    }
  }

  function openNewFile(langId = "javascript", customName = "") {
    const meta = SUPPORTED_10_LANGS.find((l) => l.id === langId) || SUPPORTED_10_LANGS[2];
    const cleanName = (customName || "").trim() || `script_${Date.now().toString().slice(-4)}.${meta.ext}`;
    currentFile = {
      name: cleanName,
      lang: meta.id,
      code: ""
    };
    selectedLines.clear();
    foldedLines.clear();
    saveCurrentFile();
    syncEditorView();
    showToast(`تم فتح الملف: ${currentFile.name}`);
  }

  function getEditorTextarea() {
    return document.getElementById("sourceCode");
  }

  function highlightCodeByLang(code, lang) {
    const escaped = escapeHtml(code || "");
    if (!escaped) return "";

    if (lang === "json") {
      return escaped
        .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?)/g, (m) =>
          m.endsWith(":") ? `<span class="syn-fn">${m}</span>` : `<span class="syn-str">${m}</span>`
        )
        .replace(/\b(true|false|null)\b/g, `<span class="syn-kw">$1</span>`)
        .replace(/\b(-?\d+(\.\d+)?)\b/g, `<span class="syn-num">$1</span>`);
    }

    const kwList =
      lang === "python"
        ? "def|class|import|from|return|if|elif|else|for|while|in|as|try|except|with|async|await|True|False|None"
        : lang === "sql"
        ? "SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|JOIN|ON|ORDER|BY|GROUP|AND|OR"
        : "const|let|var|function|return|if|else|for|while|switch|case|break|import|from|export|default|async|await|class|interface|type|fun|val|var|override|echo|php";

    const kwRegex = new RegExp(`\\b(${kwList})\\b`, lang === "sql" ? "gi" : "g");

    return escaped
      .replace(/(\/\/.*$|#.*$|\/\*[\s\S]*?\*\/)/gm, `<span class="syn-cm">$1</span>`)
      .replace(/(&quot;(?:\\.|[^&quot;])*&quot;|'(?:\\.|[^'])*')/g, `<span class="syn-str">$1</span>`)
      .replace(kwRegex, `<span class="syn-kw">$1</span>`)
      .replace(/\b(\d+(\.\d+)?)\b/g, `<span class="syn-num">$1</span>`)
      .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, `<span class="syn-fn">$1</span>`);
  }

  function getLineIndexAtCursor(textarea) {
    if (!textarea) return 0;
    const pos = textarea.selectionStart || 0;
    return textarea.value.slice(0, pos).split("\n").length - 1;
  }

  function syncSelectionFromTextareaRange() {
    const ta = getEditorTextarea();
    if (!ta) return;
    const start = ta.selectionStart || 0;
    const end = ta.selectionEnd || 0;
    if (start === end) return;

    const firstLine = ta.value.slice(0, start).split("\n").length - 1;
    const lastLine = ta.value.slice(0, end).split("\n").length - 1;
    selectedLines.clear();
    for (let i = Math.min(firstLine, lastLine); i <= Math.max(firstLine, lastLine); i++) {
      selectedLines.add(i);
    }
    renderStandaloneEditorHighlightAndLines();
  }

  function toggleSelectLine(lineIdx) {
    if (lineIdx < 0) return;
    if (selectedLines.has(lineIdx)) {
      selectedLines.delete(lineIdx);
    } else {
      selectedLines.add(lineIdx);
    }
    renderStandaloneEditorHighlightAndLines();
  }

  function selectCurrentCursorLine() {
    const ta = getEditorTextarea();
    if (!ta) return;
    const lineIdx = getLineIndexAtCursor(ta);
    if (selectedLines.has(lineIdx) && selectedLines.size === 1) {
      selectedLines.clear();
    } else {
      selectedLines.add(lineIdx);
    }
    renderStandaloneEditorHighlightAndLines();
    showToast(`تم تحديد السطر ${lineIdx + 1}`);
  }

  function selectLineRangePrompt() {
    const ta = getEditorTextarea();
    if (!ta) return;
    const total = ta.value.split("\n").length;
    const current = getLineIndexAtCursor(ta) + 1;
    const input = window.prompt(`أدخل نطاق الأسطر (مثال: ${current}-${Math.min(total, current + 2)}) من أصل ${total}:`, `${current}-${Math.min(total, current + 2)}`);
    if (!input) return;

    const match = input.trim().match(/^(\d+)\s*[-–:]\s*(\d+)$/);
    if (!match) {
      showToast("صيغة النطاق غير صحيحة");
      return;
    }

    const from = Math.max(1, Math.min(total, Number(match[1])));
    const to = Math.max(1, Math.min(total, Number(match[2])));
    selectedLines.clear();
    for (let i = Math.min(from, to) - 1; i <= Math.max(from, to) - 1; i++) {
      selectedLines.add(i);
    }
    renderStandaloneEditorHighlightAndLines();
    showToast(`تم تحديد الأسطر من ${Math.min(from, to)} إلى ${Math.max(from, to)}`);
  }

  async function copySelectedLines() {
    const ta = getEditorTextarea();
    if (!ta) return;
    const lines = ta.value.split("\n");
    let textToCopy = "";

    if (selectedLines.size > 0) {
      const sorted = Array.from(selectedLines).sort((a, b) => a - b);
      textToCopy = sorted.map((idx) => lines[idx] ?? "").join("\n");
    } else if (ta.selectionStart !== ta.selectionEnd) {
      textToCopy = ta.value.slice(ta.selectionStart, ta.selectionEnd);
    } else {
      const cur = getLineIndexAtCursor(ta);
      textToCopy = lines[cur] ?? "";
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      showToast("تم نسخ الأسطر المحددة");
    } catch {
      showToast("تعذر النسخ");
    }
  }

  function deleteSelectedLines() {
    const ta = getEditorTextarea();
    if (!ta) return;
    const lines = ta.value.split("\n");

    if (selectedLines.size > 0) {
      const remaining = lines.filter((_, idx) => !selectedLines.has(idx));
      ta.value = remaining.join("\n");
      currentFile.code = ta.value;
      selectedLines.clear();
      saveCurrentFile();
      renderStandaloneEditorHighlightAndLines();
      showToast("تم حذف الأسطر المحددة");
      return;
    }

    const cur = getLineIndexAtCursor(ta);
    lines.splice(cur, 1);
    ta.value = lines.join("\n");
    currentFile.code = ta.value;
    saveCurrentFile();
    renderStandaloneEditorHighlightAndLines();
    showToast(`تم حذف السطر ${cur + 1}`);
  }

  function clearSelectedLines() {
    selectedLines.clear();
    renderStandaloneEditorHighlightAndLines();
    showToast("تم إلغاء تحديد الأسطر");
  }

  function syncEditorView() {
    const ta = getEditorTextarea();
    const titleEl = document.getElementById("spckActiveFileTitle");
    const langSel = document.getElementById("standaloneEditorLangSelect");

    if (titleEl) titleEl.textContent = currentFile.name;
    if (langSel) langSel.value = currentFile.lang;
    if (ta && ta.value !== currentFile.code) {
      ta.value = currentFile.code;
    }

    renderStandaloneEditorHighlightAndLines();
  }

  function toggleFoldBlocks() {
    const ta = getEditorTextarea();
    const lines = (ta?.value || "").split("\n");
    const foldable = [];
    for (let i = 0; i < lines.length; i++) {
      const t = lines[i].trim();
      if (t.endsWith("{") || t.endsWith(":") || /^<[a-zA-Z0-9-]+[^>]*>$/.test(t)) {
        foldable.push(i);
      }
    }
    if (!foldable.length) {
      showToast("لا توجد كتل قابلة للطي");
      return;
    }
    if (foldedLines.size > 0) {
      foldedLines.clear();
      showToast("تم توسيع الكتل");
    } else {
      foldable.forEach((idx) => {
        if (idx + 1 < lines.length) foldedLines.add(idx);
      });
      showToast(`تم طي ${foldedLines.size} كتلة`);
    }
    renderStandaloneEditorHighlightAndLines();
  }

  function renderStandaloneEditorHighlightAndLines() {
    const ta = getEditorTextarea();
    const hiEl = document.getElementById("standaloneEditorHighlight");
    const linesEl = document.getElementById("standaloneEditorLines");
    const statsEl = document.getElementById("standaloneEditorStats");
    const raw = ta?.value || "";
    const lines = raw.split("\n");

    const lineRowHtml = [];
    const codeRowHtml = [];
    let i = 0;

    while (i < lines.length) {
      const isSel = selectedLines.has(i);
      const selClass = isSel ? " is-selected-line" : "";

      if (foldedLines.has(i)) {
        lineRowHtml.push(`<div class="spck-line-num${selClass}" data-line-idx="${i}">${i + 1}</div>`);
        const foldedContent = `${highlightCodeByLang(lines[i], currentFile.lang)} <span class="syn-cm">/* ... */</span>`;
        codeRowHtml.push(`<div class="spck-code-line${selClass}">${foldedContent || " "}</div>`);
        i++;
        while (i < lines.length && (lines[i].startsWith("  ") || lines[i].startsWith("\t"))) {
          i++;
        }
      } else {
        lineRowHtml.push(`<div class="spck-line-num${selClass}" data-line-idx="${i}">${i + 1}</div>`);
        const highlighted = highlightCodeByLang(lines[i], currentFile.lang);
        codeRowHtml.push(`<div class="spck-code-line${selClass}">${highlighted || " "}</div>`);
        i++;
      }
    }

    if (linesEl) linesEl.innerHTML = lineRowHtml.join("") || `<div class="spck-line-num">1</div>`;
    if (hiEl) hiEl.innerHTML = codeRowHtml.join("") || `<div class="spck-code-line"> </div>`;
    if (statsEl) {
      const selCount = selectedLines.size;
      const selText = selCount > 0 ? ` | محدد: ${selCount} سطر` : "";
      statsEl.textContent =
        state.uiLang === "ar"
          ? `${currentFile.name} | ${lines.length} أسطر | ${raw.length} حرف${selText}`
          : `${currentFile.name} | ${lines.length} lines | ${raw.length} chars${selText}`;
    }
  }

<<<<<<< HEAD
  function applyDesignAssetsLanguage(lang) {
    const dict = I18N[lang] || I18N.ar;
    const fontSampleInput = document.getElementById("fontLiveSampleInput");
    const backBtn = document.getElementById("backToToolsBtn");
=======
  function updateAutocompletePopup() {
    const popup = document.getElementById("editorAutocompleteBox");
    const ta = getEditorTextarea();
    if (!popup || !ta) return;

    const pos = ta.selectionStart || 0;
    const before = ta.value.slice(0, pos);
    const match = before.match(/([a-zA-Z0-9_$-]+)$/);
    const prefix = match ? match[1].toLowerCase() : "";
>>>>>>> 1f34f26cd70c0fc2e724750a9726902e6b7b81ce

    if (!prefix) {
      popup.classList.add("hidden");
      currentSuggestions = [];
      return;
    }

<<<<<<< HEAD
    if (backBtn) {
      backBtn.textContent = dict.backToTools;
    }

    document.querySelectorAll('[data-icon-mode="standard"]').forEach((btn) => {
      btn.textContent = dict.standardIconsBtn;
    });
    document.querySelectorAll('[data-icon-mode="illustrations"]').forEach((btn) => {
      btn.textContent = dict.illustrationIconsBtn;
    });
=======
    const pool = LANG_SUGGESTIONS[currentFile.lang] || LANG_SUGGESTIONS.javascript;
    const matches = pool.filter((w) => w.toLowerCase().startsWith(prefix) && w.toLowerCase() !== prefix);
>>>>>>> 1f34f26cd70c0fc2e724750a9726902e6b7b81ce

    if (!matches.length) {
      popup.classList.add("hidden");
      currentSuggestions = [];
      return;
    }

    currentSuggestions = matches.slice(0, 6);
    selectedSuggestionIdx = 0;
    popup.innerHTML = currentSuggestions
      .map(
        (w, idx) =>
          `<button type="button" class="ac-item ${idx === 0 ? "active" : ""}" data-ac-idx="${idx}">${escapeHtml(w)}</button>`
      )
      .join("");
    popup.classList.remove("hidden");
  }

  function applySuggestion(word) {
    const ta = getEditorTextarea();
    if (!word || !ta) return;

    const pos = ta.selectionStart || 0;
    const before = ta.value.slice(0, pos);
    const after = ta.value.slice(pos);
    const replaced = before.replace(/([a-zA-Z0-9_$-]+)$/, word);
    ta.value = `${replaced}${after}`;
    ta.selectionStart = ta.selectionEnd = replaced.length;
    currentFile.code = ta.value;
    saveCurrentFile();

    document.getElementById("editorAutocompleteBox")?.classList.add("hidden");
    currentSuggestions = [];
    renderStandaloneEditorHighlightAndLines();
  }

  function insertSnippetAtCursor(snippet) {
    const ta = getEditorTextarea();
    if (!ta || !snippet) return;

    const start = ta.selectionStart ?? ta.value.length;
    const end = ta.selectionEnd ?? ta.value.length;
    ta.value = ta.value.slice(0, start) + snippet + ta.value.slice(end);
    ta.selectionStart = ta.selectionEnd = start + snippet.length;
    currentFile.code = ta.value;
    saveCurrentFile();
    renderStandaloneEditorHighlightAndLines();
    ta.focus();
  }

<<<<<<< HEAD
    document.querySelectorAll("[data-bnav]").forEach((item) => {
      const key = item.dataset.bnav;
      const labelEl = item.querySelector(".bnav-label");
      if (labelEl && navLabelMap[key]) {
        labelEl.textContent = navLabelMap[key];
      }
    });

    applyRealBuildLanguage(lang);
=======
  function moveCursorByChars(delta) {
    const ta = getEditorTextarea();
    if (!ta) return;
    const nextPos = Math.max(0, Math.min(ta.value.length, (ta.selectionStart || 0) + delta));
    ta.selectionStart = ta.selectionEnd = nextPos;
    ta.focus();
>>>>>>> 1f34f26cd70c0fc2e724750a9726902e6b7b81ce
  }

  function insertAssetIntoEditorDirect(snippet, label, targetLang = null) {
    const ta = getEditorTextarea();
    if (!snippet || !ta) return;

    if (targetLang) {
      currentFile.lang = targetLang;
      const sel = document.getElementById("standaloneEditorLangSelect");
      if (sel) sel.value = targetLang;
    }

    const sep = ta.value.trim() ? "\n\n" : "";
    ta.value = `${ta.value}${sep}${snippet}`;
    currentFile.code = ta.value;
    saveCurrentFile();
    renderStandaloneEditorHighlightAndLines();

    if (typeof window.goToForDevSection === "function") {
      window.goToForDevSection("editor");
    }
    showToast(`تمت إضافة ${label} إلى ${currentFile.name}`);
  }

  function quickAddFirstAsset(type) {
    if (type === "icon" && Array.isArray(window.ICONS_LIBRARY) && window.ICONS_LIBRARY[0]) {
      insertAssetIntoEditorDirect(window.ICONS_LIBRARY[0].svg, `أيقونة (${window.ICONS_LIBRARY[0].title})`, "html");
    } else if (type === "font" && Array.isArray(window.FONTS_LIBRARY) && window.FONTS_LIBRARY[0]) {
      insertAssetIntoEditorDirect(window.FONTS_LIBRARY[0].css, `خط (${window.FONTS_LIBRARY[0].title})`, "css");
    } else if (type === "bg" && Array.isArray(window.BACKGROUNDS_LIBRARY) && window.BACKGROUNDS_LIBRARY[0]) {
      insertAssetIntoEditorDirect(window.BACKGROUNDS_LIBRARY[0].css, `خلفية (${window.BACKGROUNDS_LIBRARY[0].title})`, "css");
    } else {
      const secMap = { icon: "icons", font: "fonts", bg: "backgrounds" };
      if (typeof window.goToForDevSection === "function") {
        window.goToForDevSection(secMap[type] || "icons");
      }
    }
  }

  function openStandaloneLivePreview() {
    const ta = getEditorTextarea();
    const frame = document.getElementById("standaloneLiveFrame");
    const box = document.getElementById("standaloneLivePreviewBox");
    if (!ta || !frame || !box) return;

    const code = ta.value || "";
    const htmlDoc =
      currentFile.lang === "css"
        ? `<!DOCTYPE html><html><head><style>${code}</style></head><body><div class="box">معاينة تنسيق CSS — ForDev Editor</div></body></html>`
        : /<html[\s>]/i.test(code)
        ? code
        : `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:system-ui,sans-serif;padding:16px;}</style></head><body>${code}<script>${currentFile.lang === "javascript" ? code : ""}</script></body></html>`;

    frame.srcdoc = htmlDoc;
    box.classList.remove("hidden");
  }

<<<<<<< HEAD
  if (toolsGrid) {
    toolsGrid.addEventListener("click", (e) => {
      const card = e.target.closest("[data-tool]");
      if (card && card.dataset.tool) {
        openToolSeparatePage(card.dataset.tool, true);
      }
    });
=======
  function exitCurrentToolOrEditor() {
    isToolPageOpen = false;
    document.querySelector('.fordev-page-section[data-page-key="tools"]')?.classList.remove("tool-detail-open");
    document.getElementById("standaloneLivePreviewBox")?.classList.add("hidden");
    if (typeof window.goToForDevSection === "function") {
      window.goToForDevSection("tools");
    }
    showToast("تم الخروج من الأداة");
>>>>>>> 1f34f26cd70c0fc2e724750a9726902e6b7b81ce
  }

  function loadGeminiKey() {
    try {
      geminiApiKey = localStorage.getItem(GEMINI_KEY_STORAGE) || "";
    } catch {
      geminiApiKey = "";
    }
  }

  function saveGeminiKey(key) {
    geminiApiKey = (key || "").trim();
    try {
      if (geminiApiKey) localStorage.setItem(GEMINI_KEY_STORAGE, geminiApiKey);
      else localStorage.removeItem(GEMINI_KEY_STORAGE);
    } catch {
      // تجاهل
    }
  }

  async function fixCodeWithGemini() {
    const key = (document.getElementById("rbGeminiKey")?.value || geminiApiKey || "").trim();
    if (!key) {
      showToast(I18N[state.uiLang].geminiMissingKey);
      return;
    }
    saveGeminiKey(key);

    const ta = getEditorTextarea();
    const code = ta?.value || "";
    if (!code.trim()) {
      showToast("المحرر فارغ");
      return;
    }

    const fixBtn = document.getElementById("rbGeminiFixBtn");
    const orig = fixBtn ? fixBtn.textContent : "";
    if (fixBtn) {
      fixBtn.disabled = true;
      fixBtn.textContent = I18N[state.uiLang].geminiFixing;
    }

    const prompt = `You are a strict code reviewer and fixer.
File: ${currentFile.name} | Language: ${currentFile.lang}
Analyze the following code, fix any syntax, runtime, or structural errors, and return ONLY a valid JSON object with two keys:
1. "fixedCode": string (complete corrected code without markdown fences)
2. "fixes": array of short strings in Arabic explaining what was checked/fixed

Code:
${code}`;

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key)}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.2 }
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errText.slice(0, 160)}`);
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const parsed = JSON.parse(rawText);

      if (typeof parsed.fixedCode === "string" && parsed.fixedCode.trim() && ta) {
        ta.value = parsed.fixedCode;
        currentFile.code = parsed.fixedCode;
        saveCurrentFile();
        foldedLines.clear();
        selectedLines.clear();
        renderStandaloneEditorHighlightAndLines();
      }

      const fixes = Array.isArray(parsed.fixes) && parsed.fixes.length ? parsed.fixes : ["تم فحص الكود وتحديثه."];
      renderNotes(fixes);
      showToast(I18N[state.uiLang].geminiFixedToast);
    } catch (err) {
      renderNotes([`خطأ Gemini: ${err.message}`]);
      showToast("تعذر الفحص عبر Gemini");
    } finally {
      if (fixBtn) {
        fixBtn.disabled = false;
        fixBtn.textContent = orig || I18N[state.uiLang].geminiFixBtn;
      }
    }
  }

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
      // تجاهل
    }
  }

  function saveState() {
    const ta = getEditorTextarea();
    if (!ta) return;
    state.toolData[state.toolId] = {
      sourceLang: sourceLangEl?.value || "javascript",
      targetLang: targetLangEl?.value || "python",
      sourceCode: ta.value,
      targetCode: targetCodeEl ? targetCodeEl.value : ""
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // تجاهل
    }
  }

  function renderNotes(notes) {
    if (!notesContentEl) return;
    notesContentEl.innerHTML = notes && notes.length ? `<ul>${notes.map((n) => `<li>${escapeHtml(n)}</li>`).join("")}</ul>` : "";
  }

  function renderOutput(code) {
    const safe = code || "";
    if (targetCodeEl) targetCodeEl.value = safe;
    if (highlightedOutputEl && window.CodeConverter?.highlightSyntax) {
      highlightedOutputEl.innerHTML = CodeConverter.highlightSyntax(safe);
    }
    if (targetLinesEl) {
      const cnt = safe ? safe.split("\n").length : 1;
      targetLinesEl.textContent = Array.from({ length: cnt }, (_, i) => i + 1).join("\n");
    }
    if (targetStatsEl) {
      const l = safe ? safe.split("\n").length : 0;
      const c = safe.length;
      targetStatsEl.textContent = state.uiLang === "ar" ? `${l} أسطر | ${c} حرف` : `${l} lines | ${c} chars`;
    }
  }

  function syncWeb3Visibility(toolId) {
    const panel = document.getElementById("web3FilesMode");
    if (!panel) return;
    const isWebTool = WEB3_SUPPORTED_TOOLS.has(toolId);
    panel.classList.toggle("hidden", !isWebTool);
    panel.style.display = isWebTool ? "block" : "none";
  }

  function selectTool(toolId, autoRun = true) {
    state.toolId = toolId;
    syncWeb3Visibility(toolId);

    const cfg = window.TOOLS_CONFIG?.[toolId] || window.TOOLS_CONFIG?.syntax || {
      titleAr: toolId,
      titleEn: toolId,
      hintAr: "",
      hintEn: "",
      sources: [{ value: "javascript", label: "JavaScript" }],
      targets: [{ value: "python", label: "Python" }],
      defaultSource: "javascript",
      defaultTarget: "python",
      sample: ""
    };

    if (activeToolBadge) activeToolBadge.textContent = state.uiLang === "ar" ? cfg.titleAr : cfg.titleEn;
    if (activeToolHint) activeToolHint.textContent = state.uiLang === "ar" ? cfg.hintAr : cfg.hintEn;

    if (sourceLangEl) {
      sourceLangEl.innerHTML = cfg.sources.map((o) => `<option value="${o.value}">${o.label}</option>`).join("");
      sourceLangEl.value = state.toolData[toolId]?.sourceLang || cfg.defaultSource;
    }
    if (targetLangEl) {
      targetLangEl.innerHTML = cfg.targets.map((o) => `<option value="${o.value}">${o.label}</option>`).join("");
      targetLangEl.value = state.toolData[toolId]?.targetLang || cfg.defaultTarget;
    }

    const ta = getEditorTextarea();
    if (ta) {
      const initialCode = state.toolData[toolId]?.sourceCode ?? cfg.sample ?? currentFile.code;
      ta.value = initialCode;
      currentFile.code = initialCode;
      saveCurrentFile();
      renderStandaloneEditorHighlightAndLines();
    }

    if (autoRun && window.CodeConverter?.process) {
      const res = CodeConverter.process({
        toolId: state.toolId,
        sourceLang: sourceLangEl?.value || "javascript",
        targetLang: targetLangEl?.value || "python",
        code: ta?.value || ""
      });
      renderOutput(res.code);
      renderNotes(res.notes);
    }
    saveState();
  }

<<<<<<< HEAD
    renderWeb3Slot(targetIndex);
    isToolPageOpen = true;
    syncHybridToolView();
    if (typeof window.goToForDevSection === "function") {
      window.goToForDevSection("tools");
=======
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    if (sunIcon && moonIcon) {
      sunIcon.classList.toggle("hidden", theme !== "light");
      moonIcon.classList.toggle("hidden", theme === "light");
>>>>>>> 1f34f26cd70c0fc2e724750a9726902e6b7b81ce
    }
    saveState();
  }

  function applyUiLanguage(lang) {
    state.uiLang = lang;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    if (langToggle) langToggle.textContent = lang === "ar" ? "EN" : "عربي";

    const dict = I18N[lang] || I18N.ar;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const k = el.getAttribute("data-i18n");
      if (dict[k]) el.textContent = dict[k];
    });

    const setTxt = (id, v) => {
      const el = document.getElementById(id);
      if (el) el.textContent = v;
    };
    const setPh = (id, v) => {
      const el = document.getElementById(id);
      if (el) el.placeholder = v;
    };

    setTxt("standaloneFoldBtn", dict.foldBtn);
    setTxt("standalonePreviewBtn", dict.livePreviewBtn);
    setTxt("standaloneAddIconBtn", dict.insertIconBtn);
    setTxt("standaloneAddFontBtn", dict.insertFontBtn);
    setTxt("standaloneAddBgBtn", dict.insertBgBtn);
    setTxt("standaloneNewFileBtn", dict.newFileBtn);
    setTxt("standaloneExitToolBtn", dict.backToTools);
    setTxt("spckSelectLineBtn", dict.selectLineBtn);
    setTxt("spckSelectRangeBtn", dict.selectRangeBtn);
    setTxt("spckClearSelectBtn", dict.clearSelectBtn);
    setTxt("spckCopyLinesBtn", dict.copyLinesBtn);
    setTxt("spckDeleteLinesBtn", dict.deleteLinesBtn);
    setTxt("rbGeminiSaveBtn", dict.geminiSaveKey);
    setTxt("rbGeminiFixBtn", dict.geminiFixBtn);
    setPh("rbGeminiKey", dict.geminiKeyPlaceholder);
    setPh("fontLiveSampleInput", dict.fontSamplePlaceholder);

    document.querySelectorAll('[data-icon-mode="standard"]').forEach((b) => (b.textContent = dict.standardIconsBtn));
    document.querySelectorAll('[data-icon-mode="illustrations"]').forEach((b) => (b.textContent = dict.illustrationIconsBtn));

    const navLabels = {
      tools: dict.navTools,
      fonts: dict.navFonts,
      editor: dict.navEditor,
      icons: dict.navIcons,
      backgrounds: dict.navBackgrounds
    };
    document.querySelectorAll("[data-bnav]").forEach((item) => {
      const lbl = item.querySelector(".bnav-label");
      if (lbl && navLabels[item.dataset.bnav]) lbl.textContent = navLabels[item.dataset.bnav];
    });

    renderStandaloneEditorHighlightAndLines();
    saveState();
  }

  function isIllustrationIcon(icon) {
    const cat = String(icon?.category || "").toLowerCase();
    const title = String(icon?.title || "").toLowerCase();
    return cat.includes("undraw") || cat.includes("illustration") || cat.includes("توضيح") || title.includes("توضيح");
  }

  function renderIconsList(iconsGridEl) {
    if (!iconsGridEl || !Array.isArray(window.ICONS_LIBRARY)) return;
    const filtered = window.ICONS_LIBRARY.filter((icon) =>
      currentIconMode === "illustrations" ? isIllustrationIcon(icon) : !isIllustrationIcon(icon)
    );
    iconsGridEl.innerHTML = filtered
      .map(
        (icon) => `
        <div class="asset-card">
          <div class="asset-preview ${isIllustrationIcon(icon) ? "undraw-illustration-preview" : ""}">${icon.svg}</div>
          <div class="asset-title">${icon.title}</div>
          <div class="asset-actions">
            <button type="button" class="asset-copy-btn" data-copy="${encodeURIComponent(icon.svg)}" data-encoded="1">نسخ SVG</button>
            <button type="button" class="asset-insert-btn" data-to-editor-code="${encodeURIComponent(icon.svg)}" data-to-editor-lang="html" data-to-editor-label="الأيقونة (${icon.title})" data-encoded="1">+ للمحرر</button>
          </div>
        </div>`
      )
      .join("");
    iconsGridEl.querySelectorAll('[data-encoded="1"]').forEach((b) => {
      if (b.dataset.copy) b.dataset.copy = decodeURIComponent(b.dataset.copy);
      if (b.dataset.toEditorCode) b.dataset.toEditorCode = decodeURIComponent(b.dataset.toEditorCode);
      b.removeAttribute("data-encoded");
    });
  }

  function renderDesignLibraries() {
    const fontsGrid = document.querySelector('[data-page-key="fonts"] .asset-grid');
    const iconsGrid = document.querySelector('[data-page-key="icons"] .asset-grid');
    const bgsGrid = document.querySelector('[data-page-key="backgrounds"] .asset-grid');

    if (fontsGrid && Array.isArray(window.FONTS_LIBRARY)) {
      fontsGrid.innerHTML = window.FONTS_LIBRARY.map(
        (f) => `
        <div class="asset-card">
          <div class="asset-preview font-live-text" style="font-family:${f.family};">${f.sample}</div>
          <div class="asset-title">${f.title}</div>
          <div class="asset-actions">
            <button type="button" class="asset-copy-btn" data-copy="${encodeURIComponent(f.css)}" data-encoded="1">نسخ CSS</button>
            <button type="button" class="asset-insert-btn" data-to-editor-code="${encodeURIComponent(f.css)}" data-to-editor-lang="css" data-to-editor-label="الخط (${f.title})" data-encoded="1">+ للمحرر</button>
          </div>
        </div>`
      ).join("");
      fontsGrid.querySelectorAll('[data-encoded="1"]').forEach((b) => {
        if (b.dataset.copy) b.dataset.copy = decodeURIComponent(b.dataset.copy);
        if (b.dataset.toEditorCode) b.dataset.toEditorCode = decodeURIComponent(b.dataset.toEditorCode);
        b.removeAttribute("data-encoded");
      });
    }

    if (iconsGrid && Array.isArray(window.ICONS_LIBRARY)) renderIconsList(iconsGrid);

    if (bgsGrid && Array.isArray(window.BACKGROUNDS_LIBRARY)) {
      bgsGrid.innerHTML = window.BACKGROUNDS_LIBRARY.map(
        (b) => `
        <div class="asset-card">
          <div class="asset-preview" style="${b.previewStyle}"></div>
          <div class="asset-title">${b.title}</div>
          <div class="asset-actions">
            <button type="button" class="asset-copy-btn" data-copy="${encodeURIComponent(b.css)}" data-encoded="1">نسخ CSS</button>
            <button type="button" class="asset-insert-btn" data-to-editor-code="${encodeURIComponent(b.css)}" data-to-editor-lang="css" data-to-editor-label="الخلفية (${b.title})" data-encoded="1">+ للمحرر</button>
          </div>
        </div>`
      ).join("");
      bgsGrid.querySelectorAll('[data-encoded="1"]').forEach((b) => {
        if (b.dataset.copy) b.dataset.copy = decodeURIComponent(b.dataset.copy);
        if (b.dataset.toEditorCode) b.dataset.toEditorCode = decodeURIComponent(b.dataset.toEditorCode);
        b.removeAttribute("data-encoded");
      });
    }
  }

  document.addEventListener("click", async (e) => {
    const lineNumEl = e.target.closest(".spck-line-num[data-line-idx]");
    if (lineNumEl) {
      const idx = Number(lineNumEl.dataset.lineIdx);
      if (e.shiftKey && selectedLines.size > 0) {
        const last = Array.from(selectedLines).pop();
        for (let i = Math.min(last, idx); i <= Math.max(last, idx); i++) {
          selectedLines.add(i);
        }
        renderStandaloneEditorHighlightAndLines();
      } else {
        toggleSelectLine(idx);
      }
      return;
    }

    const snipBtn = e.target.closest("[data-spck-insert]");
    if (snipBtn) {
      insertSnippetAtCursor(snipBtn.dataset.spckInsert);
      return;
    }

<<<<<<< HEAD
  document.addEventListener("click", (e) => {
    const card = e.target.closest("[data-tool]");
    if (card && card.dataset.tool) {
      e.preventDefault();
      openToolSeparatePage(card.dataset.tool, true);
      return;
    }

    if (e.target && e.target.closest("#backToToolsBtn")) {
      closeToolSeparatePage();
      return;
    }

    const modeBtn = e.target.closest("[data-icon-mode]");
    if (!modeBtn) return;
=======
    const acBtn = e.target.closest("[data-ac-idx]");
    if (acBtn) {
      const idx = Number(acBtn.dataset.acIdx);
      if (currentSuggestions[idx]) applySuggestion(currentSuggestions[idx]);
      return;
    }
>>>>>>> 1f34f26cd70c0fc2e724750a9726902e6b7b81ce

    const toEditorBtn = e.target.closest("[data-to-editor-code]");
    if (toEditorBtn) {
      insertAssetIntoEditorDirect(
        toEditorBtn.dataset.toEditorCode,
        toEditorBtn.dataset.toEditorLabel || "عنصر",
        toEditorBtn.dataset.toEditorLang || null
      );
      return;
    }

    const copyEl = e.target.closest(".asset-copy-btn");
    if (copyEl && copyEl.dataset.copy) {
      try {
        await navigator.clipboard.writeText(copyEl.dataset.copy);
        showToast(I18N[state.uiLang].copied);
      } catch {
        showToast("تعذر النسخ");
      }
      return;
    }

    const card = e.target.closest("[data-tool]");
    if (card && card.dataset.tool) {
      e.preventDefault();
      selectTool(card.dataset.tool, true);
      isToolPageOpen = true;
      document.querySelector('.fordev-page-section[data-page-key="tools"]')?.classList.add("tool-detail-open");
      return;
    }

    const modeBtn = e.target.closest("[data-icon-mode]");
    if (modeBtn) {
      currentIconMode = modeBtn.dataset.iconMode || "standard";
      document.querySelectorAll("[data-icon-mode]").forEach((b) => b.classList.toggle("active", b.dataset.iconMode === currentIconMode));
      renderIconsList(document.querySelector('[data-page-key="icons"] .asset-grid'));
    }
  });

<<<<<<< HEAD
  // بناء الأقسام المستقلة الأفقية ولكل قسم فوتر خاص "طور بواسطة DOT" ونهاية واضحة
=======
  // بناء الأقسام الأفقية وجعل المحرر في المنتصف بين الخطوط والأيقونات
>>>>>>> 1f34f26cd70c0fc2e724750a9726902e6b7b81ce
  (() => {
    const bottomNav = document.querySelector(".bottom-nav");
    let stageEl = null;
    const sectionMap = {};

    function appendSectionFooter(sectionEl, extraClass = "") {
      if (!sectionEl) return;
<<<<<<< HEAD
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
=======
      const sel = extraClass ? `.section-end-footer.${extraClass}` : ".section-end-footer:not(.tool-detail-footer)";
      if (sectionEl.querySelector(sel)) return;
      const f = document.createElement("footer");
      f.className = extraClass ? `section-end-footer ${extraClass}` : "section-end-footer";
      f.textContent = "طور بواسطة DOT";
      sectionEl.appendChild(f);
>>>>>>> 1f34f26cd70c0fc2e724750a9726902e6b7b81ce
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
      box.innerHTML = `<div class="section-head"><h2>${titleAr}</h2></div>`;

      if (key === "fonts") {
        box.innerHTML += `<div class="font-custom-tester"><input id="fontLiveSampleInput" type="text" placeholder="اكتب نصًا لتجربة الخطوط مباشرة — ForDev Studio 2026" /></div>`;
      }

      if (key === "icons") {
        box.innerHTML += `
          <div class="icon-mode-tabs">
            <button type="button" class="icon-mode-btn active" data-icon-mode="standard">أيقونات عادية</button>
            <button type="button" class="icon-mode-btn" data-icon-mode="illustrations">أيقونات توضيحية</button>
          </div>`;
      }

      const grid = document.createElement("div");
      grid.className = "asset-grid";
      if (sourcePanel?.querySelector(".asset-grid")) {
        grid.innerHTML = sourcePanel.querySelector(".asset-grid").innerHTML;
      }
      box.appendChild(grid);
      sec.appendChild(box);
      appendSectionFooter(sec);
      return sec;
    }

    function createSpckEditorSection() {
      const sec = document.createElement("section");
      sec.className = "fordev-page-section";
      sec.dataset.pageKey = "editor";

      const langOpts = SUPPORTED_10_LANGS.map((l) => `<option value="${l.id}">${l.label}</option>`).join("");

      sec.innerHTML = `
        <div class="spck-editor-shell">
          <div class="spck-top-bar">
            <div class="spck-active-meta">
              <span class="spck-dot"></span>
              <strong id="spckActiveFileTitle">${escapeHtml(currentFile.name)}</strong>
            </div>
            <div class="spck-top-controls">
              <select id="standaloneEditorLangSelect" class="spck-lang-select">${langOpts}</select>
              <button type="button" id="standaloneNewFileBtn" class="spck-action-btn">ملف جديد</button>
              <button type="button" id="standalonePreviewBtn" class="spck-run-btn">▶ معاينة</button>
              <button type="button" id="standaloneExitToolBtn" class="spck-exit-btn">خروج من الأداة</button>
            </div>
          </div>

          <div class="spck-selection-toolbar">
            <button type="button" id="spckSelectLineBtn" class="spck-action-btn">تحديد سطر</button>
            <button type="button" id="spckSelectRangeBtn" class="spck-action-btn">تحديد نطاق</button>
            <button type="button" id="spckCopyLinesBtn" class="spck-action-btn">نسخ المحدد</button>
            <button type="button" id="spckDeleteLinesBtn" class="spck-action-btn spck-danger-btn">حذف المحدد</button>
            <button type="button" id="spckClearSelectBtn" class="spck-action-btn">إلغاء التحديد</button>
          </div>

          <div class="spck-code-area">
            <div id="standaloneEditorLines" class="spck-line-gutter"><div class="spck-line-num">1</div></div>
            <div class="spck-code-stack">
              <div id="standaloneEditorHighlight" class="spck-highlight-view"></div>
              <textarea id="sourceCode" class="spck-input-layer" spellcheck="false"></textarea>
              <div id="editorAutocompleteBox" class="editor-autocomplete-box hidden"></div>
            </div>
          </div>

          <div class="spck-quick-keys">
            <button type="button" class="spck-key-btn" data-spck-insert="<div></div>">&lt;tag&gt;</button>
            <button type="button" class="spck-key-btn" data-spck-insert="div">div</button>
            <button type="button" class="spck-key-btn" data-spck-insert='class=""'>class</button>
            <button type="button" class="spck-key-btn" data-spck-insert="=">=</button>
            <button type="button" class="spck-key-btn" data-spck-insert='""'>""</button>
            <button type="button" id="standaloneFoldBtn" class="spck-key-btn">طي الكتل</button>
            <button type="button" id="standaloneAddIconBtn" class="spck-key-btn">+ أيقونة</button>
            <button type="button" id="standaloneAddFontBtn" class="spck-key-btn">+ خط</button>
            <button type="button" id="standaloneAddBgBtn" class="spck-key-btn">+ خلفية</button>
            <button type="button" id="spckLeftBtn" class="spck-key-btn">◀</button>
            <button type="button" id="spckRightBtn" class="spck-key-btn">▶</button>
          </div>

          <div class="spck-gemini-bar">
            <input id="rbGeminiKey" type="password" dir="ltr" placeholder="Gemini API Key..." value="${escapeHtml(geminiApiKey)}" />
            <button type="button" id="rbGeminiSaveBtn" class="spck-action-btn">حفظ</button>
            <button type="button" id="rbGeminiFixBtn" class="spck-run-btn">فحص وتصحيح Gemini</button>
          </div>

          <div class="spck-status-bar">
            <span id="standaloneEditorStats">${escapeHtml(currentFile.name)} | 1 سطر | 0 حرف</span>
          </div>

          <div id="standaloneLivePreviewBox" class="preview-section hidden">
            <div class="preview-header">
              <span>المعاينة المباشرة</span>
              <button type="button" id="standaloneClosePreviewBtn" class="btn btn-secondary">إغلاق</button>
            </div>
            <iframe id="standaloneLiveFrame" class="preview-frame"></iframe>
          </div>
        </div>
      `;

      appendSectionFooter(sec);

      sec.querySelector("#standaloneEditorLangSelect")?.addEventListener("change", (e) => {
        currentFile.lang = e.target.value;
        saveCurrentFile();
        renderStandaloneEditorHighlightAndLines();
      });

      sec.querySelector("#standaloneNewFileBtn")?.addEventListener("click", () => {
        const enteredName = window.prompt("اسم الملف الجديد (اختياري):", `file_${Date.now().toString().slice(-3)}.js`);
        if (enteredName === null) return;
        const extMatch = enteredName.trim().match(/\.([a-zA-Z0-9]+)$/);
        const foundLang = extMatch
          ? SUPPORTED_10_LANGS.find((l) => l.ext.toLowerCase() === extMatch[1].toLowerCase())?.id
          : null;
        openNewFile(foundLang || currentFile.lang, enteredName);
      });

      sec.querySelector("#standaloneExitToolBtn")?.addEventListener("click", exitCurrentToolOrEditor);
      sec.querySelector("#spckSelectLineBtn")?.addEventListener("click", selectCurrentCursorLine);
      sec.querySelector("#spckSelectRangeBtn")?.addEventListener("click", selectLineRangePrompt);
      sec.querySelector("#spckCopyLinesBtn")?.addEventListener("click", copySelectedLines);
      sec.querySelector("#spckDeleteLinesBtn")?.addEventListener("click", deleteSelectedLines);
      sec.querySelector("#spckClearSelectBtn")?.addEventListener("click", clearSelectedLines);

      sec.querySelector("#standalonePreviewBtn")?.addEventListener("click", openStandaloneLivePreview);
      sec.querySelector("#standaloneClosePreviewBtn")?.addEventListener("click", () => {
        sec.querySelector("#standaloneLivePreviewBox")?.classList.add("hidden");
      });
      sec.querySelector("#standaloneFoldBtn")?.addEventListener("click", toggleFoldBlocks);
      sec.querySelector("#standaloneAddIconBtn")?.addEventListener("click", () => quickAddFirstAsset("icon"));
      sec.querySelector("#standaloneAddFontBtn")?.addEventListener("click", () => quickAddFirstAsset("font"));
      sec.querySelector("#standaloneAddBgBtn")?.addEventListener("click", () => quickAddFirstAsset("bg"));
      sec.querySelector("#spckLeftBtn")?.addEventListener("click", () => moveCursorByChars(-1));
      sec.querySelector("#spckRightBtn")?.addEventListener("click", () => moveCursorByChars(1));
      sec.querySelector("#rbGeminiSaveBtn")?.addEventListener("click", () => {
        saveGeminiKey(sec.querySelector("#rbGeminiKey")?.value || "");
        showToast("تم حفظ المفتاح");
      });
      sec.querySelector("#rbGeminiFixBtn")?.addEventListener("click", fixCodeWithGemini);

      return sec;
    }

    function ensureEditorNavButtonInCenter() {
      if (!bottomNav) return;
      let editorBtn = bottomNav.querySelector('[data-bnav="editor"]');
      if (!editorBtn) {
        editorBtn = document.createElement("button");
        editorBtn.type = "button";
        editorBtn.className = "bnav-item";
        editorBtn.dataset.bnav = "editor";
        editorBtn.innerHTML = `<span class="bnav-icon">&lt;/&gt;</span><span class="bnav-label">المحرر</span>`;
      }
      // ترتيب الأزرار ليكون المحرر في المنتصف: [tools, fonts, editor, icons, backgrounds]
      const orderedKeys = ["tools", "fonts", "editor", "icons", "backgrounds"];
      orderedKeys.forEach((k) => {
        const btn = k === "editor" ? editorBtn : bottomNav.querySelector(`[data-bnav="${k}"]`);
        if (btn) bottomNav.appendChild(btn);
      });
    }

    function initHorizontalPages() {
      if (stageEl && stageEl.isConnected) return stageEl;
      ensureEditorNavButtonInCenter();

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
<<<<<<< HEAD
      if (workspaceSec) {
        ensureToolBackBar(workspaceSec);
        ensureRealBuildPanel(workspaceSec);
        toolsPage.appendChild(workspaceSec);
      }
      placeWeb3InsideToolsPage(toolsPage);
=======
      if (workspaceSec) toolsPage.appendChild(workspaceSec);
>>>>>>> 1f34f26cd70c0fc2e724750a9726902e6b7b81ce
      appendSectionFooter(toolsPage);
      appendSectionFooter(toolsPage, "tool-detail-footer");

      const fontsPage = createStandaloneAssetSection("fonts", "مكتبة الخطوط", document.getElementById("assetPanelFonts"));
      const editorPage = createSpckEditorSection();
      const iconsPage = createStandaloneAssetSection("icons", "مكتبة الأيقونات", document.getElementById("assetPanelIcons"));
      const backgroundsPage = createStandaloneAssetSection("backgrounds", "مكتبة الخلفيات", document.getElementById("assetPanelBackgrounds"));

      stage.appendChild(toolsPage);
      stage.appendChild(fontsPage);
      stage.appendChild(editorPage);
      stage.appendChild(iconsPage);
      stage.appendChild(backgroundsPage);

      assetsSec?.remove();
      document.querySelectorAll("body > .site-footer").forEach((f) => f.remove());

      if (navbar?.nextSibling) navbar.parentElement.insertBefore(stage, navbar.nextSibling);
      else document.body.insertBefore(stage, document.body.firstChild);

      sectionMap.tools = toolsPage;
      sectionMap.fonts = fontsPage;
      sectionMap.editor = editorPage;
      sectionMap.icons = iconsPage;
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
      if (!stage || !targetSec) return;
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

<<<<<<< HEAD
    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        const key = item.dataset.bnav;
        if (key && key !== "editor") {
          if (key === "tools") {
            closeToolSeparatePage();
          }
          goToSectionHorizontal(key);
        }
      });
    });
  })();

  // التهيئة الأولية المرتبة
  loadBuildConfig();
=======
    document.addEventListener("click", (e) => {
      const navItem = e.target.closest("[data-bnav]");
      if (!navItem) return;
      const key = navItem.dataset.bnav;
      if (!key) return;
      if (key === "tools") {
        isToolPageOpen = false;
        document.querySelector('.fordev-page-section[data-page-key="tools"]')?.classList.remove("tool-detail-open");
      }
      goToSectionHorizontal(key);
    });
  })();

  // التهيئة الأولية
  loadGeminiKey();
  loadCurrentFile();
>>>>>>> 1f34f26cd70c0fc2e724750a9726902e6b7b81ce
  loadSavedState();
  applyTheme(state.theme);
  window.initForDevPages();

  const ta = getEditorTextarea();
  if (ta) {
    ta.addEventListener("input", () => {
      currentFile.code = ta.value;
      saveCurrentFile();
      renderStandaloneEditorHighlightAndLines();
      updateAutocompletePopup();
      saveState();
      if (!document.getElementById("standaloneLivePreviewBox")?.classList.contains("hidden")) {
        openStandaloneLivePreview();
      }
    });

    ta.addEventListener("select", syncSelectionFromTextareaRange);
    ta.addEventListener("mouseup", syncSelectionFromTextareaRange);

    ta.addEventListener("keydown", (e) => {
      const acBox = document.getElementById("editorAutocompleteBox");
      const acOpen = acBox && !acBox.classList.contains("hidden") && currentSuggestions.length > 0;
      if (acOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          selectedSuggestionIdx = (selectedSuggestionIdx + 1) % currentSuggestions.length;
          updateAutocompletePopup();
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          selectedSuggestionIdx = (selectedSuggestionIdx - 1 + currentSuggestions.length) % currentSuggestions.length;
          updateAutocompletePopup();
          return;
        }
        if (e.key === "Tab" || e.key === "Enter") {
          e.preventDefault();
          applySuggestion(currentSuggestions[selectedSuggestionIdx]);
          return;
        }
        if (e.key === "Escape") {
          acBox.classList.add("hidden");
          return;
        }
      }

      if (e.key === "Tab") {
        e.preventDefault();
        const s = ta.selectionStart;
        const end = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + "    " + ta.value.slice(end);
        ta.selectionStart = ta.selectionEnd = s + 4;
        currentFile.code = ta.value;
        saveCurrentFile();
        renderStandaloneEditorHighlightAndLines();
        saveState();
      }
    });

    ta.addEventListener("scroll", () => {
      const hi = document.getElementById("standaloneEditorHighlight");
      const ln = document.getElementById("standaloneEditorLines");
      if (hi) {
        hi.scrollTop = ta.scrollTop;
        hi.scrollLeft = ta.scrollLeft;
      }
      if (ln) ln.scrollTop = ta.scrollTop;
    });
  }

  syncEditorView();
  applyUiLanguage(state.uiLang);
  selectTool(state.toolId, true);
  window.setForDevNavActive("tools");
  isToolPageOpen = false;
  syncHybridToolView();
  renderDesignLibraries();
})();

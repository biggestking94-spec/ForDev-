(() => {
  const STORAGE_KEY = "fordev_studio_state_v2";

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
      heroDesc:
        "منصة تجمع بين تحويل صيغ الأكواد البرمجية، ونقل واجهات الويب إلى أطر التطبيقات (مثل Kivy و Tkinter و Flutter)، وتجهيز تغليف مشاريع بايثون والويب للهواتف، مع معاينة مباشرة وتلوين للكود وحفظ تلقائي لبياناتك.",
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
      downloaded: "تم تنزيل الملف بنجاح"
    },
    en: {
      subtitle: "Developer Conversion & Packaging Hub",
      badge: "ForDev Studio v2.0",
      heroTitle: "Practical Tools for Code Conversion & App Packaging",
      heroDesc:
        "A unified studio for converting programming languages, migrating web UI to Kivy, Tkinter, and Flutter, packaging Python and Web apps for mobile, with live preview, syntax highlighting, and auto-save.",
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
      downloaded: "File downloaded successfully"
    }
  };

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    setTimeout(() => toastEl.classList.remove("show"), 2300);
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

  function selectTool(toolId, autoRun = true) {
    state.toolId = toolId;
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

  // الأحداث
  toolsGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".tool-card");
    if (card && card.dataset.tool) {
      selectTool(card.dataset.tool, true);
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

  // التهيئة الأولية
  loadSavedState();
  applyTheme(state.theme);
  applyUiLanguage(state.uiLang);
  selectTool(state.toolId, true);
})();

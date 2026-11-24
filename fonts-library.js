(() => {
  const FONT_IMPORT_URL =
    "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Tajawal:wght@400;500;700&family=Almarai:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@400;600;700&family=Changa:wght@500;700&family=El+Messiri:wght@500;700&family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;600;700&family=Fira+Code:wght@400;600;700&family=Space+Grotesk:wght@500;700&display=swap";

  if (typeof document !== "undefined" && !document.getElementById("fordevFontsStylesheet")) {
    const link = document.createElement("link");
    link.id = "fordevFontsStylesheet";
    link.rel = "stylesheet";
    link.href = FONT_IMPORT_URL;
    document.head.appendChild(link);
  }

  window.FONTS_LIBRARY = [
    {
      id: "cairo",
      title: "Cairo",
      category: "عربي — واجهات",
      family: "'Cairo', sans-serif",
      sample: "ForDev Studio — واجهة عصرية واضحة",
      css: "@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');\nbody { font-family: 'Cairo', sans-serif; }"
    },
    {
      id: "tajawal",
      title: "Tajawal",
      category: "عربي — ناعم",
      family: "'Tajawal', sans-serif",
      sample: "تجربة استخدام سلسة ومتوازنة",
      css: "@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');\nbody { font-family: 'Tajawal', sans-serif; }"
    },
    {
      id: "ibm-plex-arabic",
      title: "IBM Plex Sans Arabic",
      category: "عربي — تقني",
      family: "'IBM Plex Sans Arabic', sans-serif",
      sample: "أدوات المطورين وتجهيز المشاريع",
      css: "@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700&display=swap');\nbody { font-family: 'IBM Plex Sans Arabic', sans-serif; }"
    },
    {
      id: "almarai",
      title: "Almarai",
      category: "عربي — قراءة",
      family: "'Almarai', sans-serif",
      sample: "قراءة مريحة للنصوص الطويلة",
      css: "@import url('https://fonts.googleapis.com/css2?family=Almarai:wght@400;700&display=swap');\nbody { font-family: 'Almarai', sans-serif; }"
    },
    {
      id: "changa",
      title: "Changa",
      category: "عربي — عناوين",
      family: "'Changa', sans-serif",
      sample: "عناوين بارزة وهوية رقمية",
      css: "@import url('https://fonts.googleapis.com/css2?family=Changa:wght@500;700&display=swap');\nh1, h2, .hero-title { font-family: 'Changa', sans-serif; }"
    },
    {
      id: "el-messiri",
      title: "El Messiri",
      category: "عربي — مميز",
      family: "'El Messiri', sans-serif",
      sample: "لمسة فنية وهوية بصرية",
      css: "@import url('https://fonts.googleapis.com/css2?family=El+Messiri:wght@500;700&display=swap');\nh1, h2 { font-family: 'El Messiri', sans-serif; }"
    },
    {
      id: "jetbrains-mono",
      title: "JetBrains Mono",
      category: "برمجة — Monospace",
      family: "'JetBrains Mono', ui-monospace, monospace",
      sample: "const deploy = async () => 'OK';",
      css: "@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap');\ncode, pre, textarea { font-family: 'JetBrains Mono', monospace; }"
    },
    {
      id: "fira-code",
      title: "Fira Code",
      category: "برمجة — Monospace",
      family: "'Fira Code', ui-monospace, monospace",
      sample: "fn build_pack(target: &str) -> bool { true }",
      css: "@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600;700&display=swap');\ncode, pre { font-family: 'Fira Code', monospace; }"
    },
    {
      id: "inter",
      title: "Inter",
      category: "إنجليزي — UI",
      family: "'Inter', system-ui, sans-serif",
      sample: "Modern UI & Developer Tools",
      css: "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');\nbody { font-family: 'Inter', sans-serif; }"
    },
    {
      id: "space-grotesk",
      title: "Space Grotesk",
      category: "إنجليزي — Display",
      family: "'Space Grotesk', sans-serif",
      sample: "FORDEV STUDIO V2.0",
      css: "@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap');\nh1, h2, .brand-title { font-family: 'Space Grotesk', sans-serif; }"
    }
  ];
})();

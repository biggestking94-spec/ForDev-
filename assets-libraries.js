(() => {
  // 1) خلفيات صور متنوعة حقيقية (مناظر + أنماط هندسية + إضاءات متعددة)
  const BG_THEMES = [
    {
      name: "غروب السحاب البركاني",
      tag: "طبيعة",
      renderSvg: (idx) => `
        <rect width="640" height="360" fill="#18122b"/>
        <circle cx="${140 + ((idx * 41) % 360)}" cy="95" r="54" fill="#fb923c" fill-opacity="0.85"/>
        <circle cx="${140 + ((idx * 41) % 360)}" cy="95" r="85" fill="#f43f5e" fill-opacity="0.22"/>
        <polygon points="0,360 170,185 330,360" fill="#393053"/>
        <polygon points="210,360 410,165 640,360" fill="#443c68"/>
        <rect x="0" y="295" width="640" height="65" fill="#120d21" fill-opacity="0.75"/>
      `
    },
    {
      name: "أفق مدينة النيون الليلية",
      tag: "مدينة",
      renderSvg: (idx) => `
        <rect width="640" height="360" fill="#070b19"/>
        <circle cx="520" cy="75" r="32" fill="#e2e8f0" fill-opacity="0.2"/>
        <rect x="30" y="140" width="75" height="220" rx="6" fill="#111c38"/>
        <rect x="118" y="95" width="90" height="265" rx="6" fill="#162447"/>
        <rect x="222" y="165" width="70" height="195" rx="6" fill="#101a33"/>
        <rect x="308" y="110" width="95" height="250" rx="6" fill="#1a294d"/>
        <rect x="418" y="150" width="85" height="210" rx="6" fill="#121e3b"/>
        <rect x="516" y="125" width="90" height="235" rx="6" fill="#17264a"/>
        <line x1="0" y1="315" x2="640" y2="315" stroke="#38bdf8" stroke-width="2" stroke-opacity="0.45"/>
        <circle cx="${90 + ((idx * 53) % 450)}" cy="315" r="6" fill="#38bdf8"/>
      `
    },
    {
      name: "أمواج المحيط والشعاب",
      tag: "بحري",
      renderSvg: (idx) => `
        <rect width="640" height="360" fill="#042430"/>
        <path d="M0 190 Q160 130 320 190 T640 190 L640 360 L0 360 Z" fill="#084c61"/>
        <path d="M0 235 Q160 185 320 235 T640 235 L640 360 L0 360 Z" fill="#0e7490" fill-opacity="0.8"/>
        <path d="M0 280 Q160 240 320 280 T640 280 L640 360 L0 360 Z" fill="#155e75" fill-opacity="0.9"/>
        <circle cx="${110 + ((idx * 47) % 420)}" cy="210" r="8" fill="#67e8f9" fill-opacity="0.5"/>
        <circle cx="${180 + ((idx * 29) % 360)}" cy="260" r="5" fill="#a5f3fc" fill-opacity="0.45"/>
      `
    },
    {
      name: "كثبان الصحراء تحت النجوم",
      tag: "صحراء",
      renderSvg: (idx) => `
        <rect width="640" height="360" fill="#140f0c"/>
        <circle cx="95" cy="70" r="24" fill="#fde68a" fill-opacity="0.75"/>
        <circle cx="240" cy="55" r="2.5" fill="#fef3c7"/>
        <circle cx="380" cy="85" r="2" fill="#fef3c7"/>
        <circle cx="495" cy="48" r="3" fill="#fef3c7"/>
        <path d="M0 230 Q210 165 420 225 T640 205 L640 360 L0 360 Z" fill="#78350f"/>
        <path d="M0 275 Q250 225 500 275 T640 260 L640 360 L0 360 Z" fill="#92400e"/>
        <path d="M0 315 Q320 280 640 315 L640 360 L0 360 Z" fill="#b45309" fill-opacity="${0.75 + (idx % 3) * 0.08}"/>
      `
    },
    {
      name: "شبكة تقنية ثلاثية الأبعاد",
      tag: "تقني",
      renderSvg: (idx) => {
        const shift = (idx * 14) % 40;
        return `
          <rect width="640" height="360" fill="#090d16"/>
          <g stroke="#1e293b" stroke-width="1.2">
            <line x1="0" y1="${60 + shift}" x2="640" y2="${60 + shift}"/>
            <line x1="0" y1="${140 + shift}" x2="640" y2="${140 + shift}"/>
            <line x1="0" y1="${220 + shift}" x2="640" y2="${220 + shift}"/>
            <line x1="0" y1="${300 + shift}" x2="640" y2="${300 + shift}"/>
            <line x1="120" y1="0" x2="120" y2="360"/>
            <line x1="240" y1="0" x2="240" y2="360"/>
            <line x1="360" y1="0" x2="360" y2="360"/>
            <line x1="480" y1="0" x2="480" y2="360"/>
          </g>
          <rect x="210" y="105" width="220" height="145" rx="16" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
          <circle cx="320" cy="177" r="34" fill="none" stroke="#818cf8" stroke-width="2.5" stroke-dasharray="10 6"/>
        `;
      }
    },
    {
      name: "غابة الصنوبر والضباب",
      tag: "طبيعة",
      renderSvg: (idx) => `
        <rect width="640" height="360" fill="#071a14"/>
        <rect x="0" y="195" width="640" height="70" fill="#0f2e24" fill-opacity="0.55"/>
        <polygon points="75,270 30,360 120,360" fill="#064e3b"/>
        <polygon points="155,245 100,360 210,360" fill="#047857"/>
        <polygon points="265,260 215,360 315,360" fill="#065f46"/>
        <polygon points="390,235 330,360 450,360" fill="#047857"/>
        <polygon points="525,255 465,360 585,360" fill="#064e3b"/>
        <circle cx="${120 + ((idx * 37) % 400)}" cy="85" r="28" fill="#a7f3d0" fill-opacity="0.25"/>
      `
    }
  ];

  function createBgPhotoUrl(theme, idx) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360">
      ${theme.renderSvg(idx)}
      <rect x="18" y="312" width="${Math.min(340, 170 + theme.name.length * 7)}" height="32" rx="8" fill="#020617" fill-opacity="0.72"/>
      <text x="30" y="333" fill="#f8fafc" font-size="15" font-family="sans-serif" font-weight="700">${theme.name} • #${idx}</text>
    </svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  const READY_BACKGROUNDS = Array.from({ length: 100 }, (_, i) => {
    const idx = i + 1;
    const theme = BG_THEMES[i % BG_THEMES.length];
    const title = `${theme.name} — صورة ${idx}`;
    const imgUrl = createBgPhotoUrl(theme, idx);
    return {
      id: idx,
      title,
      category: `صورة • ${theme.tag}`,
      imgUrl,
      css: `.fd-bg-photo-${idx} {\n  background-image: url("${imgUrl}");\n  background-size: cover;\n  background-position: center;\n}`,
      code: `<img src="${imgUrl}" alt="${title}" style="width:100%;height:auto;border-radius:12px;" />`
    };
  });

  // 2) قوالب برمجية متنوعة حقيقية بأشكال وكود مختلف لكل نوع
  const TEMPLATE_CATALOG = [
    {
      name: "قائمة تنقل سفلية للهاتف",
      category: "Mobile Nav",
      slot: 0,
      preview: `
        <div style="background:#0f172a;border:1px solid #1e293b;border-radius:10px;padding:8px;display:flex;justify-content:space-around;align-items:center;font-size:10px;color:#94a3b8;">
          <span style="color:#38bdf8;font-weight:700;">● الرئيسية</span>
          <span>○ البحث</span>
          <span>○ الحساب</span>
        </div>`,
      code: `<nav class="bottom-bar">\n  <a href="#home" class="active">الرئيسية</a>\n  <a href="#search">البحث</a>\n  <a href="#profile">الحساب</a>\n</nav>`
    },
    {
      name: "بطاقة إحصاءات ومؤشر أداء",
      category: "Stats Widget",
      slot: 0,
      preview: `
        <div style="background:#111827;border:1px solid #1f2937;border-radius:10px;padding:9px;color:#f9fafb;font-size:10px;">
          <div style="display:flex;justify-content:space-between;color:#9ca3af;"><span>الزيارات</span><span style="color:#34d399;">+18%</span></div>
          <div style="font-size:15px;font-weight:800;margin-top:3px;">12,480</div>
        </div>`,
      code: `<div class="stat-box">\n  <span class="stat-title">الزيارات اليومية</span>\n  <strong class="stat-num">12,480</strong>\n  <em class="stat-delta">+18%</em>\n</div>`
    },
    {
      name: "نافذة تنبيه وإشعار علوي",
      category: "Toast Alert",
      slot: 0,
      preview: `
        <div style="background:#064e3b;border:1px solid #10b981;border-radius:10px;padding:8px 10px;color:#ecfdf5;font-size:10px;display:flex;align-items:center;gap:6px;">
          <span>✓</span>
          <span>تم حفظ التعديلات بنجاح</span>
        </div>`,
      code: `<div class="alert-banner success">\n  <span>تم حفظ التعديلات بنجاح</span>\n  <button type="button" onclick="this.parentElement.remove()">×</button>\n</div>`
    },
    {
      name: "قالب بطاقة اشتراك شهرية",
      category: "Pricing UI",
      slot: 0,
      preview: `
        <div style="background:#1e1b4b;border:1px solid #6366f1;border-radius:10px;padding:9px;color:#eef2ff;font-size:10px;text-align:center;">
          <div style="color:#a5b4fc;font-weight:700;">باقة Pro</div>
          <div style="font-size:14px;font-weight:800;margin:2px 0;">$29</div>
          <div style="background:#4f46e5;border-radius:6px;padding:3px;font-size:9px;">ترقية</div>
        </div>`,
      code: `<article class="plan-card">\n  <h3>باقة Pro</h3>\n  <p class="amount">$29<span>/شهر</span></p>\n  <button type="button">ترقية الحساب</button>\n</article>`
    },
    {
      name: "تنسيق زر متدرج بتأثير ظل",
      category: "CSS Button",
      slot: 1,
      preview: `
        <div style="display:flex;align-items:center;justify-content:center;height:52px;background:#090d16;border-radius:10px;">
          <span style="padding:7px 14px;border-radius:99px;background:linear-gradient(90deg,#06b6d4,#3b82f6);color:#fff;font-size:11px;font-weight:700;box-shadow:0 4px 14px rgba(59,130,246,0.45);">زر تفاعلي</span>
        </div>`,
      code: `.btn-glow {\n  padding: 10px 20px;\n  border-radius: 999px;\n  background: linear-gradient(90deg, #06b6d4, #3b82f6);\n  color: #fff;\n  box-shadow: 0 6px 18px rgba(59, 130, 246, 0.4);\n}`
    },
    {
      name: "دالة نسخ نص إلى الحافظة",
      category: "JavaScript",
      slot: 2,
      preview: `
        <div style="background:#090d16;border:1px solid #1e293b;border-radius:10px;padding:9px;font-family:monospace;font-size:10px;color:#38bdf8;">
          navigator.clipboard<br/>.<span style="color:#34d399;">writeText</span>(text)
        </div>`,
      code: `async function copyToClipboard(text) {\n  if (!navigator.clipboard) return false;\n  await navigator.clipboard.writeText(text);\n  return true;\n}`
    },
    {
      name: "سكربت بايثون لتنظيم الملفات",
      category: "Python",
      slot: 2,
      preview: `
        <div style="background:#090d16;border:1px solid #1e293b;border-radius:10px;padding:9px;font-family:monospace;font-size:10px;color:#fbbf24;">
          <span style="color:#38bdf8;">for</span> f <span style="color:#38bdf8;">in</span> path.iterdir():<br/>&nbsp;&nbsp;sort_ext(f)
        </div>`,
      code: `from pathlib import Path\n\ndef organize_folder(folder: str):\n    for item in Path(folder).iterdir():\n        if item.is_file():\n            print(item.name, item.suffix)`
    }
  ];

  const READY_TEMPLATES = Array.from({ length: 100 }, (_, i) => {
    const idx = i + 1;
    const item = TEMPLATE_CATALOG[i % TEMPLATE_CATALOG.length];
    const title = `${item.name} #${idx}`;
    return {
      id: idx,
      title,
      category: item.category,
      targetSlot: item.slot,
      label: title,
      previewHtml: item.preview,
      code: item.code
    };
  });

  // 3) تصاميم جاهزة متنوعة حقيقية (تخطيطات مختلفة وبطاقات غنية)
  const DESIGN_CATALOG = [
    {
      name: "تخطيط لوحة تحكم بعمودين",
      category: "Admin Layout",
      slot: 0,
      preview: `
        <div style="display:grid;grid-template-columns:32% 68%;gap:6px;background:#0b1120;padding:8px;border-radius:10px;height:56px;">
          <div style="background:#1e293b;border-radius:6px;padding:4px;font-size:9px;color:#94a3b8;">القائمة</div>
          <div style="background:#172554;border-radius:6px;padding:6px;font-size:10px;color:#bfdbfe;font-weight:700;">المحتوى الرئيسي</div>
        </div>`,
      code: `<div class="layout-split">\n  <aside class="nav-rail">القائمة الجانبية</aside>\n  <main class="content-area">منطقة المحتوى</main>\n</div>`
    },
    {
      name: "بطاقة ملف مستخدم مع شارة حالة",
      category: "User Card",
      slot: 0,
      preview: `
        <div style="display:flex;align-items:center;gap:8px;background:#111827;padding:8px;border-radius:10px;border:1px solid #1f2937;">
          <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#22c55e,#0ea5e9);flex-shrink:0;"></div>
          <div style="font-size:10px;color:#f3f4f6;"><b>أحمد المطور</b><div style="color:#34d399;font-size:9px;">● متصل الآن</div></div>
        </div>`,
      code: `<div class="user-profile">\n  <img src="avatar.png" alt="صورة المستخدم" />\n  <div>\n    <h4>أحمد المطور</h4>\n    <span class="badge-online">متصل الآن</span>\n  </div>\n</div>`
    },
    {
      name: "بطاقة عرض مقال تقني",
      category: "Blog Card",
      slot: 0,
      preview: `
        <div style="background:#0f172a;border:1px solid #1e293b;border-radius:10px;padding:8px;color:#e2e8f0;font-size:10px;">
          <span style="background:#0284c7;color:#fff;padding:1px 6px;border-radius:4px;font-size:9px;">مقال</span>
          <div style="font-weight:700;margin-top:4px;">أساسيات بناء التطبيقات</div>
        </div>`,
      code: `<article class="post-card">\n  <span class="tag">مقال تقني</span>\n  <h3>أساسيات بناء التطبيقات</h3>\n  <p>ملخص سريع لأفضل الممارسات البرمجية.</p>\n</article>`
    },
    {
      name: "مكوّن بطاقة دفع وبطاقة ائتمان",
      category: "Fintech UI",
      slot: 0,
      preview: `
        <div style="background:linear-gradient(135deg,#1e1b4b,#312e81);border-radius:10px;padding:9px;color:#fff;font-size:10px;">
          <div style="display:flex;justify-content:space-between;opacity:0.8;font-size:9px;"><span>CARD</span><span>•••• 4829</span></div>
          <div style="margin-top:10px;font-weight:700;">الرصيد: $3,850</div>
        </div>`,
      code: `<div class="wallet-card">\n  <div class="card-top"><span>ForDev Card</span><span>•••• 4829</span></div>\n  <div class="card-balance">$3,850.00</div>\n</div>`
    },
    {
      name: "نظام متغيرات ألوان داكنة متكاملة",
      category: "Design Tokens",
      slot: 1,
      preview: `
        <div style="display:flex;align-items:center;justify-content:space-around;background:#090d16;padding:10px;border-radius:10px;">
          <span style="width:20px;height:20px;border-radius:50%;background:#0f172a;border:1px solid #475569;"></span>
          <span style="width:20px;height:20px;border-radius:50%;background:#38bdf8;"></span>
          <span style="width:20px;height:20px;border-radius:50%;background:#a855f7;"></span>
          <span style="width:20px;height:20px;border-radius:50%;background:#22c55e;"></span>
        </div>`,
      code: `:root {\n  --surface-dark: #090d16;\n  --primary-cyan: #38bdf8;\n  --accent-violet: #a855f7;\n  --accent-mint: #22c55e;\n}`
    }
  ];

  const READY_DESIGNS = Array.from({ length: 100 }, (_, i) => {
    const idx = i + 1;
    const item = DESIGN_CATALOG[i % DESIGN_CATALOG.length];
    const title = `${item.name} — تصميم ${idx}`;
    return {
      id: idx,
      title,
      category: item.category,
      targetSlot: item.slot,
      label: title,
      previewHtml: item.preview,
      code: item.code
    };
  });

  // 4) أيقونات توضيحية حقيقية مركبة (Illustrations) مع دعم تغيير اللون الرئيسي والثانوي
  const ILLUSTRATION_SCENES = [
    {
      name: "توضيح تطوير تطبيقات الهاتف",
      category: "تطوير تطبيقات",
      renderScene: (primary, secondary) => `
        <rect x="8" y="8" width="144" height="94" rx="12" fill="#0f172a" stroke="#1e293b"/>
        <rect x="52" y="16" width="56" height="78" rx="9" fill="#1e293b" stroke="${primary}" stroke-width="2.2"/>
        <rect x="58" y="25" width="44" height="52" rx="4" fill="#090d16"/>
        <circle cx="80" cy="85" r="3" fill="${secondary}"/>
        <circle cx="28" cy="36" r="10" fill="${primary}" fill-opacity="0.22" stroke="${primary}" stroke-width="1.5"/>
        <circle cx="132" cy="70" r="12" fill="${secondary}" fill-opacity="0.22" stroke="${secondary}" stroke-width="1.5"/>
        <path d="M24 68h18M120 36h16" stroke="${primary}" stroke-width="2" stroke-linecap="round"/>
      `
    },
    {
      name: "توضيح التحليلات والبيانات السحابية",
      category: "تحليلات وبيانات",
      renderScene: (primary, secondary) => `
        <rect x="8" y="8" width="144" height="94" rx="12" fill="#0f172a" stroke="#1e293b"/>
        <path d="M44 46h72a16 16 0 0 1 0 32H46a14 14 0 0 1-2-28z" fill="#1e293b" stroke="${primary}" stroke-width="2"/>
        <rect x="56" y="58" width="8" height="12" rx="2" fill="${primary}"/>
        <rect x="69" y="52" width="8" height="18" rx="2" fill="${secondary}"/>
        <rect x="82" y="48" width="8" height="22" rx="2" fill="${primary}"/>
        <circle cx="122" cy="28" r="7" fill="${secondary}" fill-opacity="0.35"/>
      `
    },
    {
      name: "توضيح الحماية والاتصال الآمن",
      category: "أمن وحماية",
      renderScene: (primary, secondary) => `
        <rect x="8" y="8" width="144" height="94" rx="12" fill="#0f172a" stroke="#1e293b"/>
        <path d="M80 20l26 11v22c0 18-11 29-26 35-15-6-26-17-26-35V31l26-11z" fill="#172554" stroke="${primary}" stroke-width="2.2"/>
        <path d="M69 54l7 7 15-15" stroke="${secondary}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="32" cy="55" r="5" fill="${primary}" fill-opacity="0.5"/>
        <circle cx="128" cy="55" r="5" fill="${secondary}" fill-opacity="0.5"/>
      `
    },
    {
      name: "توضيح تصميم الواجهات والألوان",
      category: "تصميم واجهات",
      renderScene: (primary, secondary) => `
        <rect x="8" y="8" width="144" height="94" rx="12" fill="#0f172a" stroke="#1e293b"/>
        <rect x="28" y="24" width="66" height="48" rx="7" fill="#1e293b" stroke="${primary}" stroke-width="2"/>
        <rect x="35" y="32" width="24" height="24" rx="5" fill="${primary}" fill-opacity="0.3"/>
        <line x1="65" y1="35" x2="86" y2="35" stroke="${secondary}" stroke-width="2.2" stroke-linecap="round"/>
        <line x1="65" y1="45" x2="80" y2="45" stroke="#94a3b8" stroke-width="2" stroke-linecap="round"/>
        <circle cx="116" cy="68" r="16" fill="#1e293b" stroke="${secondary}" stroke-width="2"/>
        <circle cx="116" cy="68" r="6" fill="${primary}"/>
      `
    }
  ];

  function buildIllustrationSvg(sceneObj, primaryColor = "#38bdf8") {
    const secondaryColor = "#a78bfa";
    return `<svg viewBox="0 0 160 110" width="140" height="96" fill="none" xmlns="http://www.w3.org/2000/svg">${sceneObj.renderScene(primaryColor, secondaryColor)}</svg>`;
  }

  const READY_ILLUSTRATIONS = Array.from({ length: 100 }, (_, i) => {
    const idx = i + 1;
    const scene = ILLUSTRATION_SCENES[i % ILLUSTRATION_SCENES.length];
    return {
      id: idx,
      title: `${scene.name} #${idx}`,
      category: scene.category,
      scene
    };
  });

  // دالة البحث الموحدة حسب الاسم أو الرقم أو التصنيف
  function searchItems(list, query = "") {
    const q = String(query || "").trim().toLowerCase();
    if (!q) return list;
    return list.filter((item) => {
      const hay = `${item.id || ""} ${item.title || ""} ${item.category || ""} ${item.label || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }

  // دوال الإضافة السريعة للتوسعة
  function nextUniqueId(list) {
    const maxId = list.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0);
    return maxId + 1;
  }

  function addCustomTemplates(items = []) {
    if (!Array.isArray(items) || !items.length) return;
    [...items].reverse().forEach((item) => {
      if (!item || !item.title) return;
      const id = item.id || nextUniqueId(READY_TEMPLATES);
      READY_TEMPLATES.unshift({
        id,
        title: item.title,
        category: item.category || "قالب مخصص",
        targetSlot: Number.isInteger(item.targetSlot) ? item.targetSlot : 0,
        label: item.label || item.title,
        previewHtml:
          item.previewHtml ||
          `<div style="padding:8px;border-radius:8px;background:#0f172a;border:1px solid #38bdf8;color:#f8fafc;font-size:10px;">${item.title}</div>`,
        code: item.code || `<!-- ${item.title} -->\n<div class="custom-tpl-${id}">${item.title}</div>`
      });
    });
  }

  function addCustomDesigns(items = []) {
    if (!Array.isArray(items) || !items.length) return;
    [...items].reverse().forEach((item) => {
      if (!item || !item.title) return;
      const id = item.id || nextUniqueId(READY_DESIGNS);
      READY_DESIGNS.unshift({
        id,
        title: item.title,
        category: item.category || "تصميم مخصص",
        targetSlot: Number.isInteger(item.targetSlot) ? item.targetSlot : 0,
        label: item.label || item.title,
        previewHtml:
          item.previewHtml ||
          `<div style="padding:8px;border-radius:10px;background:#1e1b4b;color:#fff;font-size:10px;text-align:center;"><b>${item.title}</b></div>`,
        code: item.code || `<section class="custom-design-${id}">\n  <h3>${item.title}</h3>\n</section>`
      });
    });
  }

  function addCustomBackgrounds(items = []) {
    if (!Array.isArray(items) || !items.length) return;
    [...items].reverse().forEach((item) => {
      if (!item || !item.title || !item.imgUrl) return;
      const id = item.id || nextUniqueId(READY_BACKGROUNDS);
      const className = item.className || `fd-bg-custom-${id}`;
      READY_BACKGROUNDS.unshift({
        id,
        title: item.title,
        category: item.category || "صورة • مخصصة",
        imgUrl: item.imgUrl,
        css:
          item.css ||
          `.${className} {\n  background-image: url("${item.imgUrl}");\n  background-size: cover;\n  background-position: center;\n}`,
        code:
          item.code ||
          `<img src="${item.imgUrl}" alt="${item.title}" style="width:100%;border-radius:12px;" />`
      });
    });
  }

  function addCustomIllustrations(items = []) {
    if (!Array.isArray(items) || !items.length) return;
    [...items].reverse().forEach((item) => {
      if (!item || !item.title) return;
      const id = item.id || nextUniqueId(READY_ILLUSTRATIONS);
      const sceneObj =
        typeof item.renderScene === "function"
          ? { renderScene: item.renderScene }
          : item.scene || {
              renderScene: (primary, secondary) => `
                <rect x="8" y="8" width="144" height="94" rx="12" fill="#0f172a" stroke="#1e293b"/>
                <circle cx="80" cy="55" r="22" fill="${primary}" fill-opacity="0.25" stroke="${primary}" stroke-width="2"/>
                <circle cx="80" cy="55" r="7" fill="${secondary}"/>
              `
            };

      READY_ILLUSTRATIONS.unshift({
        id,
        title: item.title,
        category: item.category || "توضيح مخصص",
        scene: sceneObj
      });
    });
  }

  window.ForDevAssetsLibrary = {
    templates: READY_TEMPLATES,
    designs: READY_DESIGNS,
    backgrounds: READY_BACKGROUNDS,
    illustrations: READY_ILLUSTRATIONS,
    buildColoredIconSvg: buildIllustrationSvg,
    search: searchItems,
    addTemplates: addCustomTemplates,
    addDesigns: addCustomDesigns,
    addBackgrounds: addCustomBackgrounds,
    addIllustrations: addCustomIllustrations
  };
})();

const CodeConverter = (() => {
  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function highlightSyntax(code) {
    if (!code) return "";
    let escaped = escapeHtml(code);

    // تلوين النصوص
    escaped = escaped.replace(/(&quot;.*?&quot;|".*?"|'.*?')/g, '<span class="syn-str">$1</span>');

    // تلوين التعليقات
    escaped = escaped.replace(/(\/\/.*$|#.*$)/gm, '<span class="syn-cm">$1</span>');

    // تلوين الكلمات المفتاحية
    const keywords = /\b(def|class|return|if|elif|else|for|while|in|import|from|as|function|const|let|var|new|async|await|try|catch|true|false|null|True|False|None|void|Widget|BuildContext|override|public|fun|val)\b/g;
    escaped = escaped.replace(keywords, '<span class="syn-kw">$1</span>');

    // تلوين الأرقام
    escaped = escaped.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="syn-num">$1</span>');

    return escaped;
  }

  function convertExpressions(expr, toPython = false) {
    if (toPython) {
      return expr
        .replace(/\btrue\b/g, "True")
        .replace(/\bfalse\b/g, "False")
        .replace(/\bnull\b/g, "None")
        .replace(/&&/g, " and ")
        .replace(/\|\|/g, " or ")
        .replace(/===/g, "==")
        .replace(/!==/g, "!=");
    }
    return expr
      .replace(/\bTrue\b/g, "true")
      .replace(/\bFalse\b/g, "false")
      .replace(/\bNone\b/g, "null")
      .replace(/\band\b/g, "&&")
      .replace(/\bor\b/g, "||")
      .replace(/\bnot\s+/g, "!");
  }

  function convertPythonToJS(code) {
    const lines = code.split("\n");
    const output = [];
    const indentStack = [0];

    for (let rawLine of lines) {
      if (!rawLine.trim()) {
        output.push("");
        continue;
      }

      const leadingSpaces = rawLine.match(/^\s*/)[0].length;
      const trimmed = rawLine.trim();

      while (indentStack.length > 1 && leadingSpaces < indentStack[indentStack.length - 1]) {
        indentStack.pop();
        output.push(`${"  ".repeat(indentStack.length - 1)}}`);
      }

      const indent = "  ".repeat(indentStack.length - 1);

      if (trimmed.startsWith("#")) {
        output.push(`${indent}//${trimmed.slice(1)}`);
        continue;
      }

      const funcMatch = trimmed.match(/^def\s+([a-zA-Z_]\w*)\s*\((.*?)\)\s*:/);
      if (funcMatch) {
        output.push(`${indent}function ${funcMatch[1]}(${funcMatch[2]}) {`);
        indentStack.push(leadingSpaces + 4);
        continue;
      }

      const forEachMatch = trimmed.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+(.+?)\s*:/);
      if (forEachMatch) {
        output.push(`${indent}for (const ${forEachMatch[1]} of ${convertExpressions(forEachMatch[2])}) {`);
        indentStack.push(leadingSpaces + 4);
        continue;
      }

      const ifMatch = trimmed.match(/^if\s+(.+?)\s*:/);
      if (ifMatch) {
        output.push(`${indent}if (${convertExpressions(ifMatch[1])}) {`);
        indentStack.push(leadingSpaces + 4);
        continue;
      }

      const elifMatch = trimmed.match(/^elif\s+(.+?)\s*:/);
      if (elifMatch) {
        output.push(`${indent}} else if (${convertExpressions(elifMatch[1])}) {`);
        indentStack.push(leadingSpaces + 4);
        continue;
      }

      if (/^else\s*:/.test(trimmed)) {
        output.push(`${indent}} else {`);
        indentStack.push(leadingSpaces + 4);
        continue;
      }

      const printMatch = trimmed.match(/^print\((.*)\)$/);
      if (printMatch) {
        output.push(`${indent}console.log(${convertExpressions(printMatch[1])});`);
        continue;
      }

      const assignMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
      if (assignMatch && !trimmed.includes("==")) {
        output.push(`${indent}let ${assignMatch[1]} = ${convertExpressions(assignMatch[2])};`);
        continue;
      }

      output.push(`${indent}${convertExpressions(trimmed)};`);
    }

    while (indentStack.length > 1) {
      indentStack.pop();
      output.push(`${"  ".repeat(indentStack.length - 1)}}`);
    }

    return {
      code: output.join("\n"),
      notes: [
        "تم تحويل المسافات البادئة في Python إلى أقواس `{}` في JavaScript.",
        "تم تحويل `print()` إلى `console.log()` والقيم المنطقية إلى صيغة JS."
      ]
    };
  }

  function convertJSToPython(code) {
    const lines = code.split("\n");
    const output = [];
    let indentLevel = 0;

    for (let rawLine of lines) {
      let trimmed = rawLine.trim();
      if (!trimmed) {
        output.push("");
        continue;
      }

      if (trimmed.startsWith("}")) {
        indentLevel = Math.max(0, indentLevel - 1);
        continue;
      }

      const indent = "    ".repeat(indentLevel);
      if (trimmed.startsWith("//")) {
        output.push(`${indent}#${trimmed.slice(2)}`);
        continue;
      }

      trimmed = trimmed.replace(/;+$/, "");

      const fnMatch = trimmed.match(/^(?:async\s+)?function\s+([a-zA-Z_]\w*)\s*\((.*?)\)\s*\{?$/);
      if (fnMatch) {
        output.push(`${indent}def ${fnMatch[1]}(${fnMatch[2]}):`);
        indentLevel++;
        continue;
      }

      const ifMatch = trimmed.match(/^if\s*\((.+)\)\s*\{?$/);
      if (ifMatch) {
        output.push(`${indent}if ${convertExpressions(ifMatch[1], true)}:`);
        indentLevel++;
        continue;
      }

      const forOfMatch = trimmed.match(/^for\s*\((?:const|let|var)\s+([a-zA-Z_]\w*)\s+of\s+(.+)\)\s*\{?$/);
      if (forOfMatch) {
        output.push(`${indent}for ${forOfMatch[1]} in ${convertExpressions(forOfMatch[2], true)}:`);
        indentLevel++;
        continue;
      }

      const logMatch = trimmed.match(/^console\.log\((.*)\)$/);
      if (logMatch) {
        output.push(`${indent}print(${convertExpressions(logMatch[1], true)})`);
        continue;
      }

      const declMatch = trimmed.match(/^(?:const|let|var)\s+([a-zA-Z_]\w*)\s*=\s*(.+)$/);
      if (declMatch) {
        output.push(`${indent}${declMatch[1]} = ${convertExpressions(declMatch[2], true)}`);
        continue;
      }

      output.push(`${indent}${convertExpressions(trimmed, true)}`);
    }

    return {
      code: output.join("\n"),
      notes: [
        "تم تحويل الأقواس إلى مسافات بادئة قياسية (4 مسافات) في Python.",
        "تأكد من مطابقة أنواع البيانات والدوال المدمجة في مشروعك."
      ]
    };
  }

  function extractHtmlParts(htmlCode) {
    const titleMatch = htmlCode.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i);
    const descMatch = htmlCode.match(/<p[^>]*>(.*?)<\/p>/i);
    const btnMatch = htmlCode.match(/<button[^>]*>(.*?)<\/button>/i);
    const inputMatch = htmlCode.match(/<input[^>]*placeholder=["'](.*?)["'][^>]*>/i);

    return {
      title: titleMatch ? titleMatch[1].trim() : "ForDev Screen",
      desc: descMatch ? descMatch[1].trim() : "Generated from Web UI",
      btn: btnMatch ? btnMatch[1].trim() : "Submit",
      placeholder: inputMatch ? inputMatch[1].trim() : null
    };
  }

  function convertWebToApp(htmlCode, target) {
    const ui = extractHtmlParts(htmlCode);

    if (target === "kivy") {
      return {
        code: `from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.button import Button
${ui.placeholder ? "from kivy.uix.textinput import TextInput\n" : ""}
class ConvertedKivyApp(App):
    def build(self):
        layout = BoxLayout(orientation="vertical", padding=20, spacing=12)
        layout.add_widget(Label(text="${ui.title}", font_size="22sp", bold=True))
        layout.add_widget(Label(text="${ui.desc}", font_size="15sp"))
${ui.placeholder ? `        layout.add_widget(TextInput(hint_text="${ui.placeholder}", multiline=False))\n` : ""}        btn = Button(text="${ui.btn}", size_hint=(1, 0.25), background_color=(0.23, 0.51, 0.96, 1))
        btn.bind(on_press=self.on_action)
        layout.add_widget(btn)
        return layout

    def on_action(self, instance):
        print("Button clicked!")

if __name__ == "__main__":
    ConvertedKivyApp().run()
`,
        notes: [
          "تم تحويل عناصر الويب إلى `BoxLayout` و `Label` و `Button` في مكتبة Kivy.",
          "يمكنك تغليف هذا الكود مباشرة إلى APK عبر أداة (تغليف كود بايثون) في البوكس رقم 03."
        ]
      };
    }

    if (target === "tkinter") {
      return {
        code: `import tkinter as tk
from tkinter import messagebox

root = tk.Tk()
root.title("${ui.title}")
root.geometry("380x260")
root.configure(bg="#0f172a")

title_lbl = tk.Label(root, text="${ui.title}", font=("Arial", 16, "bold"), fg="#ffffff", bg="#0f172a")
title_lbl.pack(pady=(24, 8))

desc_lbl = tk.Label(root, text="${ui.desc}", font=("Arial", 11), fg="#94a3b8", bg="#0f172a", wraplength=320)
desc_lbl.pack(pady=6)

def handle_click():
    messagebox.showinfo("ForDev", "${ui.btn} clicked!")

action_btn = tk.Button(root, text="${ui.btn}", command=handle_click, bg="#3b82f6", fg="#ffffff", padx=16, pady=8, relief="flat")
action_btn.pack(pady=20)

root.mainloop()
`,
        notes: [
          "تم تحويل العناصر إلى نافذة `Tkinter` متكاملة مع تخطيط `pack()` وحدث النقر `command`."
        ]
      };
    }

    if (target === "flutter") {
      return {
        code: `import 'package:flutter/material.dart';

class ForDevConvertedWidget extends StatelessWidget {
  const ForDevConvertedWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("${ui.title}")),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text("${ui.title}", style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            Text("${ui.desc}", style: const TextStyle(fontSize: 15)),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {},
              child: const Text("${ui.btn}"),
            ),
          ],
        ),
      ),
    );
  }
}
`,
        notes: [
          "تم توليد واجهة `StatelessWidget` جاهزة للاستخدام داخل مشروع Flutter."
        ]
      };
    }

    return {
      code: `import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function ForDevScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>${ui.title}</Text>
      <Text style={styles.desc}>${ui.desc}</Text>
      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>${ui.btn}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", backgroundColor: "#0f172a" },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 8 },
  desc: { fontSize: 15, color: "#94a3b8", marginBottom: 18 },
  btn: { backgroundColor: "#3b82f6", padding: 14, borderRadius: 8, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "bold" }
});
`,
      notes: [
        "تم استبدال وسوم HTML بمكونات React Native القياسية (`View`, `Text`, `TouchableOpacity`)."
      ]
    };
  }

  function packagePythonApp(code, target) {
    const usesKivy = /kivy/i.test(code);
    const usesRequests = /requests/i.test(code);
    const reqs = ["python3", usesKivy ? "kivy" : null, usesRequests ? "requests" : null]
      .filter(Boolean)
      .join(",");

    if (target === "apk-buildozer") {
      return {
        code: `# ==========================================
# 1) احفظ كودك الرئيسي باسم: main.py
# 2) نفذ أوامر التغليف التالية لبناء ملف APK:
# ==========================================
# pip install buildozer cython
# buildozer init
# buildozer -v android debug

# ==========================================
# 3) محتوى ملف buildozer.spec المقترح لمشروعك:
# ==========================================
[app]
title = ForDev Mobile App
package.name = fordevapp
package.domain = org.fordev
source.dir = .
source.include_exts = py,png,jpg,kv,atlas,json
version = 0.1
requirements = ${reqs}
orientation = portrait
fullscreen = 0
android.permissions = INTERNET
android.archs = arm64-v8a, armeabi-v7a

[buildozer]
log_level = 2
warn_on_root = 1
`,
        notes: [
          "يجب أن يكون اسم الملف الرئيسي للبرنامج `main.py` حتى يتعرف عليه Buildozer تلقائيًا.",
          `تم اكتشاف التبعيات تلقائيًا من كودك وإضافتها إلى requirements: (${reqs}).`,
          "بعد انتهاء البناء ستجد ملف `.apk` الجاهز للتثبيت داخل مجلد `bin/`."
        ]
      };
    }

    return {
      code: `# خطوات تغليف تطبيق Python عبر BeeWare Briefcase:
# 1) تثبيت الأداة:
#    pip install briefcase
# 2) إنشاء هيكل التطبيق:
#    briefcase new
# 3) بناء وتشغيل التطبيق على أندرويد:
#    briefcase create android
#    briefcase build android
#    briefcase run android

# ملف pyproject.toml المقترح:
[tool.briefcase]
project_name = "ForDev App"
bundle = "org.fordev"
version = "0.0.1"

[tool.briefcase.app.fordevapp]
formal_name = "ForDev App"
description = "Packaged Python Application"
sources = ["src/fordevapp"]
requires = [${reqs.split(",").map((r) => `"${r}"`).join(", ")}]
`,
      notes: [
        "أداة Briefcase مناسبة لبناء تطبيقات متعددة المنصات (Android, iOS, Windows, Linux) من كود بايثون."
      ]
    };
  }

  function packageWebsite(code, target) {
    const titleMatch = code.match(/<title>(.*?)<\/title>/i);
    const appName = titleMatch ? titleMatch[1].trim() : "ForDev Web App";

    if (target === "pwa-bundle") {
      return {
        code: `// ==========================================
// 1) أنشئ ملف manifest.json في مجلد موقعك:
// ==========================================
{
  "name": "${appName}",
  "short_name": "${appName}",
  "start_url": "./index.html",
  "display": "standalone",
  "background_color": "#0b1120",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}

// ==========================================
// 2) أضف هذا السطر داخل وسوم <head> في index.html:
// <link rel="manifest" href="./manifest.json" />
// ==========================================
`,
        notes: [
          "عند إضافة ملف `manifest.json` ورفعه على HTTPS (مثل Vercel)، سيتمكن المستخدمون من تثبيت موقعك كتطبيق على الهاتف مباشرة."
        ]
      };
    }

    return {
      code: `// كود تغليف الموقع داخل تطبيق Android WebView (MainActivity.kt)
package com.fordev.webapp

import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val webView = WebView(this)
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true
        webView.webViewClient = WebViewClient()
        // ضع ملفات الموقع داخل app/src/main/assets/index.html
        webView.loadUrl("file:///android_asset/index.html")
        setContentView(webView)
    }
}
`,
      notes: [
        "ضع ملفات موقعك (`index.html`, `css`, `js`) داخل مجلد `assets` في مشروع الأندرويد لتعمل دون الحاجة لإنترنت."
      ]
    };
  }

  function formatCode(code, sourceLang) {
    if (sourceLang === "json") {
      const parsed = JSON.parse(code);
      return {
        code: JSON.stringify(parsed, null, 2),
        notes: ["تم التحقق من صحة بنية JSON وتنسيقها بمسافتين بادئتين."]
      };
    }

    // تنسيق عام للوسوم والأسطر
    const formatted = code
      .replace(/>\s*</g, ">\n<")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .join("\n");

    return {
      code: formatted,
      notes: ["تم تنظيف المسافات الزائدة وترتيب أسطر الكود."]
    };
  }

  function process({ toolId, sourceLang, targetLang, code }) {
    if (!code || !code.trim()) {
      return {
        code: "",
        notes: ["يرجى إدخال الكود في لوحة المدخل أولاً أو الضغط على (مثال جاهز)."]
      };
    }

    try {
      if (toolId === "syntax") {
        if (sourceLang === targetLang) {
          return { code, notes: ["المصدر والمخرج متطابقان، اختر لغة هدف مختلفة للتحويل."] };
        }
        if (sourceLang === "python" && targetLang === "javascript") {
          return convertPythonToJS(code);
        }
        if (sourceLang === "javascript" && targetLang === "python") {
          return convertJSToPython(code);
        }
        if (sourceLang === "json" && targetLang === "python-dict") {
          const obj = JSON.parse(code);
          const py = JSON.stringify(obj, null, 4)
            .replace(/\btrue\b/g, "True")
            .replace(/\bfalse\b/g, "False")
            .replace(/\bnull\b/g, "None");
          return {
            code: `data = ${py}\n`,
            notes: ["تم تحويل JSON إلى قاموس Python (`dict`) مع ضبط `True/False/None`."]
          };
        }
        return {
          code: `// [${sourceLang} -> ${targetLang}]\n${code}`,
          notes: ["اختر زوج اللغات المدعوم (مثل Python ↔ JavaScript أو JSON → Python Dict)."]
        };
      }

      if (toolId === "web-to-app") {
        return convertWebToApp(code, targetLang);
      }

      if (toolId === "py-pack") {
        return packagePythonApp(code, targetLang);
      }

      if (toolId === "web-pack") {
        return packageWebsite(code, targetLang);
      }

      if (toolId === "formatter") {
        return formatCode(code, sourceLang);
      }

      return { code, notes: [] };
    } catch (err) {
      return {
        code: `// Error: ${err.message}`,
        notes: [`تعذر معالجة الكود بسبب خطأ في الصياغة: ${err.message}`]
      };
    }
  }

  return { process, highlightSyntax };
})();

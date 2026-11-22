const TOOLS_CONFIG = {
  syntax: {
    id: "syntax",
    titleAr: "تحويل صيغ الأكواد",
    titleEn: "Code Syntax Converter",
    hintAr: "حوّل الدوال والمنطق البرمجي بين Python و JavaScript و JSON",
    hintEn: "Convert logic and functions between Python, JavaScript, and JSON",
    sources: [
      { value: "python", label: "Python" },
      { value: "javascript", label: "JavaScript (ES6)" },
      { value: "json", label: "JSON" }
    ],
    targets: [
      { value: "javascript", label: "JavaScript (ES6)" },
      { value: "python", label: "Python" },
      { value: "python-dict", label: "Python Dict" }
    ],
    defaultSource: "python",
    defaultTarget: "javascript",
    sample: `def calculate_total(price, tax_rate):
    if price <= 0:
        return 0
    total = price + (price * tax_rate / 100)
    print("Total:", total)
    return total

for amount in [100, 250, 500]:
    calculate_total(amount, 15)
`
  },

  "web-to-app": {
    id: "web-to-app",
    titleAr: "الويب إلى تطبيقات (Kivy / Tkinter / Flutter)",
    titleEn: "Web to Mobile/Desktop UI",
    hintAr: "حوّل واجهة HTML إلى كود تطبيق بلغة Kivy أو Tkinter أو Flutter أو React Native",
    hintEn: "Convert HTML UI elements into Kivy, Tkinter, Flutter, or React Native",
    sources: [
      { value: "html", label: "HTML / CSS" }
    ],
    targets: [
      { value: "kivy", label: "Python Kivy" },
      { value: "tkinter", label: "Python Tkinter" },
      { value: "flutter", label: "Flutter (Dart)" },
      { value: "react-native", label: "React Native" }
    ],
    defaultSource: "html",
    defaultTarget: "kivy",
    sample: `<div class="card">
  <h2>ForDev Mobile Card</h2>
  <p>Convert web layouts directly into native app widgets.</p>
  <button>Launch App</button>
</div>
`
  },

  "py-pack": {
    id: "py-pack",
    titleAr: "تغليف كود بايثون لتطبيق هاتف (APK / App)",
    titleEn: "Python to Mobile App Packager",
    hintAr: "أدخل كود بايثون لتوليد ملف buildozer.spec وأوامر بناء APK للهاتف",
    hintEn: "Generate buildozer.spec and APK build commands for your Python app",
    sources: [
      { value: "python-kivy", label: "Python (Kivy / Script)" }
    ],
    targets: [
      { value: "apk-buildozer", label: "Android APK (Buildozer Config + Steps)" },
      { value: "briefcase-app", label: "Cross-Platform App (BeeWare Briefcase)" }
    ],
    defaultSource: "python-kivy",
    defaultTarget: "apk-buildozer",
    sample: `from kivy.app import App
from kivy.uix.button import Button

class ForDevApp(App):
    def build(self):
        return Button(text="Hello from ForDev APK!")

if __name__ == "__main__":
    ForDevApp().run()
`
  },

  "web-pack": {
    id: "web-pack",
    titleAr: "تغليف كود الموقع (Web / App Wrapper)",
    titleEn: "Web Site Wrapper & PWA Packager",
    hintAr: "جهّز كود موقعك ليعمل كتطبيق قابل للتثبيت (PWA) أو داخل Android WebView",
    hintEn: "Package your website as an installable PWA or Android WebView wrapper",
    sources: [
      { value: "html-site", label: "HTML Website Code" }
    ],
    targets: [
      { value: "pwa-bundle", label: "PWA Manifest + Service Worker" },
      { value: "android-webview", label: "Android WebView Wrapper (Kotlin)" }
    ],
    defaultSource: "html-site",
    defaultTarget: "pwa-bundle",
    sample: `<!DOCTYPE html>
<html lang="ar">
<head>
  <meta charset="UTF-8" />
  <title>My Web App</title>
</head>
<body>
  <h1>Welcome to My Packaged Web App</h1>
  <p>Ready for mobile installation.</p>
</body>
</html>
`
  },

  formatter: {
    id: "formatter",
    titleAr: "تنسيق وتجميل الأكواد (Formatter)",
    titleEn: "Code Formatter & Beautifier",
    hintAr: "رتّب ونظّف أكواد JSON أو HTML أو JavaScript بضغطة زر",
    hintEn: "Beautify and indent JSON, HTML, or JavaScript code cleanly",
    sources: [
      { value: "json", label: "JSON" },
      { value: "html", label: "HTML" },
      { value: "javascript", label: "JavaScript" }
    ],
    targets: [
      { value: "formatted", label: "Formatted Output" }
    ],
    defaultSource: "json",
    defaultTarget: "formatted",
    sample: `{"platform":"ForDev Studio","developer":"DOT","features":["Syntax Convert","Web to App","APK Packager","Live Preview"],"active":true}`
  }
};

# إعداد Branches للمشروع

## البنية المقترحة

### 1. `main` Branch (Source Code)
- يحتوي على **Source Code** فقط
- لا يحتوي على ملفات الـ build (`dist/`)
- هذا هو Branch الرئيسي للتطوير

### 2. `build` Branch (Build Files Only)
- يحتوي على **ملفات الـ build فقط** (من `dist/`)
- يتم تحديثه تلقائياً عند الـ push على `main`
- هذا هو Branch الذي يُرفع على السيرفر

## خطوات الإعداد

### الطريقة 1: استخدام Script (موصى به)

```bash
# جعل الـ script قابل للتنفيذ
chmod +x scripts/setup-build-branch.sh

# تشغيل الـ script
./scripts/setup-build-branch.sh
```

### الطريقة 2: يدوياً

```bash
# إنشاء branch جديد من main
git checkout main
git pull origin main

# بناء المشروع أولاً
npm run build

# إنشاء branch build
git checkout -b build

# حذف جميع الملفات ما عدا .git
# (احذر: هذا سيمسح كل شيء!)
find . -mindepth 1 -maxdepth 1 ! -name '.git' ! -name '.gitignore' -exec rm -rf {} +

# نسخ محتويات dist
cp -r dist/* .

# إنشاء ملف README للـ build branch
cat > README.md << 'EOF'
# Build Files

This branch contains only the built files for deployment.
Source code is in the 'main' branch.

**Do not edit this branch manually!**
This branch is automatically updated by GitHub Actions.
EOF

# Commit و push
git add .
git commit -m "Initial build branch setup"
git push -u origin build

# العودة إلى main
git checkout main
```

### 2. إعداد GitHub Secrets

تأكد من إضافة المتغيرات التالية في GitHub Secrets:
- `VITE_HELEKET_API_KEY`
- `VITE_HELEKET_MERCHANT_ID`
- `VITE_HELEKET_API_URL` (اختياري)

### 3. آلية العمل

1. **عند الـ push على `main`**:
   - يتم تشغيل workflow تلقائياً
   - يتم بناء المشروع (`npm run build`)
   - يتم نسخ ملفات الـ build إلى `build` branch
   - يتم رفع `build` branch على السيرفر

2. **`main` branch**:
   - يبقى كما هو (source code فقط)
   - لا يتم رفعه على السيرفر

3. **`build` branch**:
   - يحتوي على ملفات الـ build فقط
   - يتم رفعه على السيرفر تلقائياً

## ملاحظات مهمة

- ⚠️ **لا تعدل `build` branch يدوياً** - يتم تحديثه تلقائياً
- ✅ **اعمل على `main` branch فقط** للتطوير
- 🔄 **Workflow يحدث تلقائياً** عند الـ push على `main`
- 📦 **ملفات الـ build** موجودة فقط في `build` branch

## استكشاف الأخطاء

إذا لم يعمل الـ workflow:
1. تأكد من وجود `build` branch على GitHub
2. تأكد من إعداد GitHub Secrets
3. راجع logs في GitHub Actions


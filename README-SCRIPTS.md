# Scripts لإضافة Meta Tag

## الملفات المتوفرة:

### 1. `deploy-meta-tag.sh` (موصى به)
Script شامل يضيف meta tag إلى كلا الملفين (server.js و index.html)

**الاستخدام:**
```bash
chmod +x deploy-meta-tag.sh
./deploy-meta-tag.sh
```

### 2. `add-meta-tag.sh`
يضيف meta tag إلى server.js فقط

**الاستخدام:**
```bash
chmod +x add-meta-tag.sh
./add-meta-tag.sh
```

### 3. `add-meta-tag-to-html.sh`
يضيف meta tag إلى index.html فقط

**الاستخدام:**
```bash
chmod +x add-meta-tag-to-html.sh
./add-meta-tag-to-html.sh
```

## الاستخدام على السيرفر:

### الطريقة 1: تشغيل Script مباشرة

```bash
# على السيرفر
cd /root/SMS4U-frontEnd
chmod +x deploy-meta-tag.sh
./deploy-meta-tag.sh
```

### الطريقة 2: تشغيل الأوامر يدوياً

```bash
# على السيرفر
cd /root/SMS4U-frontEnd/dist

# إضافة meta tag إلى server.js
if ! grep -q "heleket" server.js; then
  echo "" >> server.js
  echo "// Add heleket meta tag" >> server.js
  echo "if (typeof document !== 'undefined') {" >> server.js
  echo "  const meta = document.createElement('meta');" >> server.js
  echo "  meta.name = 'heleket';" >> server.js
  echo "  meta.content = 'a5b5947f';" >> server.js
  echo "  document.head.appendChild(meta);" >> server.js
  echo "}" >> server.js
  echo "✅ Meta tag added"
fi
```

### الطريقة 3: تلقائياً عبر CI/CD

تم إضافة خطوة في `.github/workflows/deploy.yml` لتشغيل هذا تلقائياً بعد كل نشر.

## ملاحظات:

- Scripts تتحقق من وجود meta tag قبل الإضافة (لا تضيف مكرر)
- Scripts آمنة - لا تحذف أي شيء
- يمكن تشغيلها عدة مرات بأمان




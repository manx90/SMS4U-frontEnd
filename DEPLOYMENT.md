# دليل النشر (Deployment Guide)

## إعداد CI/CD

### المتطلبات
- حساب GitHub مع مستودع المشروع
- سيرفر VPS مع SSH
- Node.js 20+ على السيرفر (للـ build محلياً) أو استخدام GitHub Actions

### خطوات الإعداد

#### 1. إعداد GitHub Secrets

اذهب إلى: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

أضف الأسرار التالية:

| Secret Name | القيمة | الوصف |
|------------|--------|-------|
| `SERVER_HOST` | `176.118.198.153` | عنوان IP السيرفر |
| `SERVER_USER` | `root` | اسم المستخدم |
| `SERVER_PASSWORD` | `nqA7wJg522J6QU2ikW` | كلمة المرور |
| `SERVER_PORT` | `22` | منفذ SSH (اختياري) |
| `DEPLOY_PATH` | `/root/SMS4U-frontEnd` | مسار النشر على السيرفر |
| `VITE_API_BASE_URL` | `https://api.sms4u.pro/api/v1` | رابط API (اختياري) |

#### 2. إعداد السيرفر

```bash
# الاتصال بالسيرفر
ssh root@176.118.198.153

# التأكد من وجود المجلد
cd /root/SMS4U-frontEnd

# إنشاء مجلد dist إذا لم يكن موجوداً
mkdir -p dist

# التأكد من الصلاحيات
chmod -R 755 /root/SMS4U-frontEnd
```

#### 3. إعداد Nginx (مثال)

```nginx
server {
    listen 80;
    server_name api.sms4u.pro;
    
    root /root/SMS4U-frontEnd/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 4. آلية العمل

1. **عند Push إلى main/master**: يتم تشغيل الـ workflow تلقائياً
2. **يدوياً**: اذهب إلى `Actions` → `Deploy to Production Server` → `Run workflow`

### خطوات النشر التلقائي

1. ✅ Checkout الكود من GitHub
2. ✅ تثبيت Node.js والإعدادات
3. ✅ تثبيت Dependencies
4. ✅ تشغيل Linter (اختياري)
5. ✅ Build المشروع
6. ✅ رفع الملفات إلى السيرفر عبر SCP
7. ✅ نسخ احتياطي للنسخة السابقة
8. ✅ إعادة تحميل Web Server

### استكشاف الأخطاء

#### خطأ في الاتصال
- تأكد من أن SSH يعمل على السيرفر
- تحقق من IP و Port
- تأكد من كلمة المرور

#### خطأ في الصلاحيات
```bash
chmod -R 755 /root/SMS4U-frontEnd
chown -R root:root /root/SMS4U-frontEnd
```

#### خطأ في Build
- تحقق من متغيرات البيئة
- تأكد من أن جميع Dependencies مثبتة

### النشر اليدوي (بدون CI/CD)

```bash
# على الجهاز المحلي
npm install
npm run build

# رفع الملفات
scp -r dist/* root@176.118.198.153:/root/SMS4U-frontEnd/dist/

# على السيرفر
ssh root@176.118.198.153
cd /root/SMS4U-frontEnd
# إعادة تحميل nginx
sudo systemctl reload nginx
```

### الأمان

⚠️ **مهم**: لا ترفع ملف `.env` أو أي معلومات حساسة إلى GitHub!

- استخدم GitHub Secrets للمعلومات الحساسة
- استخدم SSH Keys بدلاً من كلمة المرور (أفضل)
- راجع ملف `.gitignore`

### استخدام SSH Key (موصى به)

1. إنشاء SSH Key:
```bash
ssh-keygen -t ed25519 -C "github-actions"
```

2. إضافة المفتاح العام إلى السيرفر:
```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub root@176.118.198.153
```

3. إضافة المفتاح الخاص إلى GitHub Secrets باسم `SSH_PRIVATE_KEY`

4. تعديل workflow لاستخدام SSH Key بدلاً من Password

---

## الدعم

للمساعدة، راجع:
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [SCP Action](https://github.com/appleboy/scp-action)


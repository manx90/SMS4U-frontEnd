# إعداد GitHub Secrets - خطوات سريعة

## الخطوات:

1. اذهب إلى مستودعك على GitHub
2. اضغط على `Settings` (الإعدادات)
3. من القائمة الجانبية، اختر `Secrets and variables` → `Actions`
4. اضغط على `New repository secret`

## أضف الأسرار التالية:

### 1. SERVER_HOST
```
Name: SERVER_HOST
Value: 176.118.198.153
```

### 2. SERVER_USER
```
Name: SERVER_USER
Value: root
```

### 3. SERVER_PASSWORD
```
Name: SERVER_PASSWORD
Value: nqA7wJg522J6QU2ikW
```

### 4. SERVER_PORT (اختياري)
```
Name: SERVER_PORT
Value: 22
```

### 5. DEPLOY_PATH
```
Name: DEPLOY_PATH
Value: /root/SMS4U-frontEnd
```

### 6. VITE_API_BASE_URL (اختياري)
```
Name: VITE_API_BASE_URL
Value: https://api.sms4u.pro/api/v1
```

## بعد الإعداد:

1. ادفع الكود إلى GitHub:
```bash
git add .
git commit -m "Add CI/CD configuration"
git push origin main
```

2. اذهب إلى تبويب `Actions` في GitHub
3. راقب عملية النشر التلقائي

## ملاحظات:

- ⚠️ لا تشارك هذه الأسرار مع أي شخص
- ✅ يمكنك تعديل القيم في أي وقت من Settings
- 🔄 عند تغيير أي secret، سيتم استخدام القيمة الجديدة في النشر التالي


# إعداد Heleket Payment Gateway

## متغيرات البيئة المطلوبة

أنشئ ملف `.env.local` في جذر المشروع وأضف المتغيرات التالية:

```env
# API Base URL
VITE_API_BASE_URL=http://176.118.198.153:7071/api/v1

# Heleket Payment Gateway Configuration
VITE_HELEKET_API_URL=https://api.heleket.com/v1
VITE_HELEKET_API_KEY=8LkoCW2otSTZggGu5ggyR47RJc0gFURUw2u4FMWLUu8aSC4ZyI6fuTaQ6ugExC9T8f1KDXZ3HZ7ZGZjYphXhb7Tz1SdqAOZCm9PLdiD2YoGtxWgJIjSZ8qCDsH3un2rf
VITE_HELEKET_MERCHANT_ID=489e5ac9-47bd-47bf-ba4c-227cb0b3ff0d
```

## القيم الحالية

- **Merchant ID**: `489e5ac9-47bd-47bf-ba4c-227cb0b3ff0d`
- **Payment API Key**: `8LkoCW2otSTZggGu5ggyR47RJc0gFURUw2u4FMWLUu8aSC4ZyI6fuTaQ6ugExC9T8f1KDXZ3HZ7ZGZjYphXhb7Tz1SdqAOZCm9PLdiD2YoGtxWgJIjSZ8qCDsH3un2rf`
- **API URL**: `https://api.heleket.com/v1`

## ملاحظات

- ملف `.env.local` موجود في `.gitignore` ولن يتم رفعه إلى Git
- بعد إضافة المتغيرات، أعد تشغيل خادم التطوير (`npm run dev`)
- تأكد من أن Backend endpoint للـ webhook جاهز: `/api/v1/payment/heleket/webhook`


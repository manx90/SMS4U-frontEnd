# استكشاف أخطاء CI/CD وإصلاحها

## خطأ: `dial tcp ***:***: i/o timeout`

هذا الخطأ يعني أن GitHub Actions لا يستطيع الاتصال بالسيرفر. إليك الحلول:

### 1. التحقق من معلومات السيرفر

تأكد من أن GitHub Secrets صحيحة:

```bash
SERVER_HOST=176.118.198.153
SERVER_USER=root
SERVER_PASSWORD=nqA7wJg522J6QU2ikW
SERVER_PORT=22
DEPLOY_PATH=/root/SMS4U-frontEnd
```

### 2. التحقق من أن SSH يعمل على السيرفر

اتصل بالسيرفر وتحقق:

```bash
# الاتصال بالسيرفر
ssh root@176.118.198.153

# التحقق من أن SSH يعمل
sudo systemctl status ssh
# أو
sudo systemctl status sshd

# إذا لم يكن يعمل، شغله
sudo systemctl start ssh
sudo systemctl enable ssh
```

### 3. التحقق من Firewall

قد يكون Firewall يمنع الاتصال من GitHub Actions:

```bash
# على السيرفر، تحقق من Firewall
sudo ufw status
# أو
sudo iptables -L

# إذا كان Firewall مفعل، أضف قاعدة للسماح بـ SSH من أي مكان
sudo ufw allow 22/tcp
sudo ufw reload
```

### 4. التحقق من أن السيرفر يستقبل الاتصالات

```bash
# على السيرفر
sudo netstat -tlnp | grep :22
# يجب أن ترى شيء مثل:
# tcp  0  0 0.0.0.0:22  0.0.0.0:*  LISTEN  ...
```

### 5. اختبار الاتصال يدوياً

من جهازك المحلي، جرب:

```bash
# اختبار الاتصال
ssh -v root@176.118.198.153

# إذا نجح، جرب SCP
scp -v test.txt root@176.118.198.153:/tmp/
```

### 6. التحقق من IP Address

تأكد من أن IP Address صحيح:

```bash
# على السيرفر
hostname -I
# أو
ip addr show
```

### 7. استخدام SSH Key بدلاً من Password (موصى به)

1. إنشاء SSH Key:
```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions
```

2. إضافة المفتاح العام إلى السيرفر:
```bash
ssh-copy-id -i ~/.ssh/github_actions.pub root@176.118.198.153
```

3. إضافة المفتاح الخاص إلى GitHub Secrets:
   - اذهب إلى: Settings → Secrets → Actions
   - أضف secret جديد باسم `SSH_PRIVATE_KEY`
   - الصق محتوى `~/.ssh/github_actions` (المفتاح الخاص)

4. تعديل workflow لاستخدام SSH Key:
```yaml
- name: Deploy to server via SCP
  uses: appleboy/scp-action@v0.1.7
  with:
    host: ${{ secrets.SERVER_HOST }}
    username: ${{ secrets.SERVER_USER }}
    key: ${{ secrets.SSH_PRIVATE_KEY }}
    port: ${{ secrets.SERVER_PORT || 22 }}
    ...
```

### 8. زيادة Timeout

تم إضافة timeout أطول في workflow:
- `timeout: 300s` (5 دقائق)
- `command_timeout: 120s` (دقيقتان)
- `retry: 3` (3 محاولات)

### 9. التحقق من Logs

راجع logs في GitHub Actions لمعرفة التفاصيل:
- اذهب إلى: Actions → Latest run → Deploy to server via SCP

### 10. حلول بديلة

#### أ. استخدام rsync بدلاً من SCP

```yaml
- name: Deploy via rsync
  uses: burnett01/rsync-deployments@6.0.0
  with:
    switches: -avzr --delete
    path: dist/
    remote_path: ${{ secrets.DEPLOY_PATH }}/dist
    remote_host: ${{ secrets.SERVER_HOST }}
    remote_user: ${{ secrets.SERVER_USER }}
    remote_key: ${{ secrets.SSH_PRIVATE_KEY }}
```

#### ب. استخدام Git على السيرفر

```yaml
- name: Deploy via Git
  uses: appleboy/ssh-action@v1.0.3
  with:
    host: ${{ secrets.SERVER_HOST }}
    username: ${{ secrets.SERVER_USER }}
    password: ${{ secrets.SERVER_PASSWORD }}
    script: |
      cd ${{ secrets.DEPLOY_PATH }}
      git pull origin main
      npm install
      npm run build
```

### 11. التحقق من Network Connectivity

قد يكون السيرفر في شبكة خاصة. تأكد من:
- أن السيرفر لديه IP عام
- أن Port 22 مفتوح
- أن لا توجد قيود على الاتصال من GitHub IPs

### 12. استخدام VPN أو Tunnel

إذا كان السيرفر في شبكة خاصة، قد تحتاج إلى:
- استخدام VPN
- استخدام SSH Tunnel
- استخدام GitHub Self-hosted Runner

---

## نصائح إضافية

1. **استخدم SSH Key بدلاً من Password** - أكثر أماناً وأسرع
2. **راقب Logs** - دائماً راجع logs للتفاصيل
3. **اختبر يدوياً أولاً** - تأكد من أن الاتصال يعمل قبل CI/CD
4. **استخدم Secrets** - لا تضع معلومات حساسة في الكود

---

## للمساعدة

إذا استمرت المشكلة:
1. راجع logs في GitHub Actions
2. اختبر الاتصال يدوياً
3. تحقق من إعدادات السيرفر
4. راجع وثائق GitHub Actions


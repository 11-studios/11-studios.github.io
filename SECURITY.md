# Security

- Public sitede admin şifresi, kullanıcı parolası, token, API anahtarı veya secret bulunmaz.
- Plugin kataloğu `plugins.json` üzerinden salt-okunur yüklenir.
- Katalog değişiklikleri repository yazma yetkisi gerektirir.
- Site, JSON içeriğini `innerHTML` ile basmaz; kullanıcıya gösterilen metinler DOM `textContent` ile oluşturulur.
- Harici indirme/satış bağlantıları yalnızca `https://` kabul eder ve `noopener,noreferrer` ile açılır.
- Inline uygulama JavaScript'i/CSS'i yoktur; CSP ile uygulama kodu aynı origin ile sınırlandırılmıştır.
- GitHub Pages üzerinde gerçek parola, ödeme veya gizli veri işleme yapılmaz. Böyle bir özellik için ayrı bir backend gerekir.

> GitHub Pages response header kontrolü sağlamadığından bazı güvenlik başlıkları ancak reverse proxy/custom hosting ile tam uygulanabilir.

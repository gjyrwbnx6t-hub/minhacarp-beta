document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. KISIM: Sidebar (Açılır Kapanır) Menü Mantığı ---
    const weekHeaders = document.querySelectorAll('.accordion-header');
    weekHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
                this.querySelector('.arrow').textContent = "▼";
            } else {
                content.style.display = "block";
                this.querySelector('.arrow').textContent = "▲";
            }
        });
    });

    const dayHeaders = document.querySelectorAll('.day-header');
    dayHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            if (content.style.display === "block" || content.style.display === "") {
                content.style.display = "none";
                this.querySelector('.arrow').textContent = "▼";
            } else {
                content.style.display = "block";
                this.querySelector('.arrow').textContent = "▲";
            }
        });
    });

    // --- 2. KISIM: AKILLI VE EVRENSEL KART YAZDIRMA ---
    const icerikAlani = document.querySelector('.main-content'); 
    const tumEgzersizButonlari = document.querySelectorAll('.ex-btn');
    let aktifEgzersizTuru = null; 

    document.querySelectorAll('.exercise-list').forEach(list => list.style.display = "none");
    document.querySelectorAll('.day-header .arrow').forEach(arrow => arrow.textContent = "▼");
    document.querySelectorAll('.ex-btn').forEach(btn => btn.classList.remove('active-ex'));
    
    icerikAlani.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 70vh; text-align: center; animation: fadeIn 0.5s;">
            <span style="font-size: 80px; margin-bottom: 20px;">👋</span>
            <h2 style="color: #1a5c83; font-size: 32px; margin-bottom: 10px;">Eğitime Hoş Geldiniz!</h2>
            <p style="color: #666; font-size: 18px; max-width: 500px;">Arapça çalışmaya başlamak için sol menüden bir gün ve egzersiz türü seçin.</p>
        </div>
    `;

    function ekranaYazdir(veri, baslik, tur, secilenGun) {
        
        if (tur !== "kelime_alistirmasi" && (!veri || (Array.isArray(veri) && veri.length === 0) || Object.keys(veri).length === 0)) {
            icerikAlani.innerHTML = `
                <div class="content-header">
                    <p>Bu bölümün içeriği henüz eklenmedi. Lütfen daha sonra tekrar kontrol edin.</p>
                </div>
            `;
            return;
        }

        // =========================================================================
        // --- OKUMA ALIŞTIRMASI MANTIĞI (KUSURSUZ ARAPÇA EŞLEŞTİRME MOTORU İLE) ---
        // =========================================================================
        if (tur === "okuma_alistirmasi") {
            let htmlIcerik = `
                <div class="content-header">
                    <p>${baslik}</p>
                </div>
                <div class="okuma-kapsayici" style="max-width: 800px; margin: 0 auto;">
                    ${veri.resim ? `<img src="${veri.resim}" alt="Okuma Görseli" style="width: 100%; border-radius: 10px; margin-bottom: 20px; object-fit: cover; max-height: 400px;">` : ''}
                    
                    <div class="seviye-butonlari" style="display: flex; gap: 10px; margin-bottom: 20px;">
                        <button class="seviye-btn active" data-seviye="basit" style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 5px; cursor: pointer; background-color: #1a5c83; color: white;">Basic</button>
                        <button class="seviye-btn" data-seviye="orta" style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 5px; cursor: pointer; background-color: white; color: #333;">Intermediate</button>
                        <button class="seviye-btn" data-seviye="ileri" style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 5px; cursor: pointer; background-color: white; color: #333;">Advanced</button>
                    </div>
                    
                    <div class="okuma-metni" id="okumaMetniAlani" style="font-size: 24px; line-height: 1.8; text-align: right; margin-bottom: 30px; padding: 20px; background-color: #f9f9f9; border-radius: 10px; position: relative;" dir="rtl">
                    </div>
                    
                    <div class="ses-oynatici" style="text-align: center; margin-bottom: 40px; padding: 15px; background-color: #f5f5f5; border-radius: 8px;">
                        <audio controls style="width: 100%; height: 40px;">
                            <source src="${veri.ses || ''}" type="audio/mpeg">
                            Tarayıcınız ses elementini desteklemiyor.
                        </audio>
                    </div>

                    <div id="dinamikKelimelerAlani"></div>
                </div>
            `;

            icerikAlani.innerHTML = htmlIcerik;

            const metinAlani = document.getElementById('okumaMetniAlani');
            const kelimelerAlani = document.getElementById('dinamikKelimelerAlani');
            let aktifSeviye = 'basit'; 

            function kelimeleriCiz(seviye) {
                let kelimeHtml = "";
                if (veri.onemli_ifadeler && veri.onemli_ifadeler[seviye] && veri.onemli_ifadeler[seviye].length > 0) {
                    kelimeHtml += `<h3 style="margin-bottom: 15px; font-size: 20px;">Key Phrases</h3><div class="kelime-grid">`;
                    veri.onemli_ifadeler[seviye].forEach(ifade => {
                        kelimeHtml += `
                            <div class="kelime-card" style="border-left: 4px solid #1a5c83;">
                                <h4 dir="rtl" style="font-size: 20px; margin: 0 0 10px 0;">${ifade.arapca}</h4>
                                <p style="margin: 0; color: #555;">${ifade.turkce}</p>
                            </div>
                        `;
                    });
                    kelimeHtml += `</div>`;
                }
                if (veri.zor_kelimeler && veri.zor_kelimeler[seviye] && veri.zor_kelimeler[seviye].length > 0) {
                    kelimeHtml += `<h3 style="margin-top: 30px; margin-bottom: 15px; font-size: 20px;">Difficult Words</h3><div class="kelime-grid">`;
                    veri.zor_kelimeler[seviye].forEach(kelime => {
                        kelimeHtml += `
                            <div class="kelime-card">
                                <h4 dir="rtl" style="font-size: 20px; margin: 0 0 10px 0; color: #1a5c83;">${kelime.arapca}</h4>
                                <p style="margin: 0 0 5px 0;"><strong>Çeviri:</strong> ${kelime.turkce}</p>
                                ${kelime.anlam ? `<p style="margin: 0 0 5px 0; font-size: 14px; color: #666;" dir="rtl">${kelime.anlam}</p>` : ''}
                                <p style="margin: 0; font-style: italic; color: #888; font-size: 14px;" dir="rtl"><strong>Örnek:</strong> ${kelime.ornek}</p>
                            </div>
                        `;
                    });
                    kelimeHtml += `</div>`;
                }
                return kelimeHtml;
            }

            function metniTıklanabilirYap(metin) {
                if (!metin) return ""; 
                // Boşlukları ve satır atlamalarını koruyarak kelimeleri span içine al
                return metin.split(/(\s+)/).map(parca => {
                    if(parca.trim() === "") return parca; 
                    return `<span class="okuma-kelimesi" style="cursor: pointer; display: inline-block; transition: 0.2s; border-radius: 4px; padding: 0 2px;">${parca}</span>`;
                }).join('');
            }

            // 1. ADIM: HAREKE VE İŞARET TEMİZLEYİCİ
            function arapcaTemizle(metin) {
                if (!metin) return "";
                return metin
                    .replace(/[\u064B-\u065F\u0670\u0640]/g, '') // Tüm harekeleri ve uzatmaları siler
                    .replace(/[أإآ]/g, 'ا') // Hemzeleri düz elif yapar
                    .replace(/ة/g, 'ه')     // Kapalı Te'yi He harfine çevirir
                    .replace(/ى/g, 'ي')     // Elif Maksura'yı Ye harfine çevirir
                    .replace(/[^\u0621-\u064A]/g, '') // Harf dışındaki tüm işaretleri (nokta, virgül) atar
                    .trim();
            }

            // 2. ADIM: AKILLI EŞLEŞTİRME MOTORU (Zamir ve Ön Ek Toleranslı)
            function kelimeEslesiyorMu(tiklananKelime, sozlukKelimesi) {
                let t = arapcaTemizle(tiklananKelime);
                let s = arapcaTemizle(sozlukKelimesi);

                if (t === "" || s === "") return false;
                
                // Çok kısa sözlük kelimelerinin (Örn: في), uzun kelimelerin (Örn: مفيد) içinde tesadüfen eşleşmesini engelle
                if (s.length <= 2 && t.length > s.length) return false;

                // Birebir eşleşme varsa direkt kabul et
                if (t === s) return true;

                // Arapçada kelimelere bitişen izin verilen ön ve arka ekler:
                const gecerliOnEkler = ["", "و", "ف", "ب", "ك", "ل", "ال", "بال", "فال", "كال", "لل", "وال"];
                const gecerliArkaEkler = ["", "ه", "ها", "هم", "هن", "ك", "كم", "كن", "نا", "ي", "ني", "ات", "ون", "ين", "ان", "ا", "وا", "ت", "تي", "ته"];

                // Eğer tıklanan kelimede, sözlükteki kelimenin kökü geçiyorsa fazlalıkları (ekleri) kontrol et
                function kontrolEt(arananKok) {
                    if (t.includes(arananKok)) {
                        let parcalar = t.split(arananKok);
                        if (parcalar.length !== 2) return false; // Birden fazla kez geçiyorsa hatalı bölme olmuştur
                        return gecerliOnEkler.includes(parcalar[0]) && gecerliArkaEkler.includes(parcalar[1]);
                    }
                    return false;
                }

                if (kontrolEt(s)) return true;

                // AKILLI "TE" DÖNÜŞÜMÜ: Eğer sözlük kelimesi "ه" (aslında ة) ile bitiyorsa, ek aldığında "ت" ye dönüşür.
                // Örn: مساعدة (Sözlük: مساعده) -> لمساعدتها (Tıklanan: لمساعدتها). Son harfi "ت" yapıp tekrar dene:
                if (s.endsWith('ه')) {
                    let s_alternatif = s.slice(0, -1) + 'ت';
                    if (kontrolEt(s_alternatif)) return true;
                }

                return false; // Hiçbir şekilde eşleşmedi
            }

            // Ekranda tek bir Tooltip kutusu oluşturalım
            let tooltip = document.getElementById('ceviri-tooltip');
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.id = 'ceviri-tooltip';
                tooltip.style.cssText = `
                    position: absolute; 
                    background-color: #1a5c83; 
                    color: white; 
                    padding: 8px 16px; 
                    border-radius: 8px; 
                    box-shadow: 0 4px 10px rgba(0,0,0,0.3); 
                    z-index: 99999; 
                    white-space: nowrap; 
                    display: none;
                    pointer-events: none; 
                `;
                document.body.appendChild(tooltip);
            }

            // 3. ADIM: METİN ALANINI TEK NOKTADAN DİNLE (Event Delegation)
            metinAlani.addEventListener('mouseover', function(e) {
                const span = e.target.closest('.okuma-kelimesi');
                if (span) span.style.backgroundColor = '#eaf3f8';
            });
            metinAlani.addEventListener('mouseout', function(e) {
                const span = e.target.closest('.okuma-kelimesi');
                if (span) span.style.backgroundColor = 'transparent';
            });

            metinAlani.addEventListener('click', function(e) {
                const span = e.target.closest('.okuma-kelimesi');
                if (!span) return;

                e.stopPropagation(); // Tıklamanın dışarı taşıp balonu hemen kapatmasını engeller
                
                document.querySelectorAll('.okuma-kelimesi').forEach(s => s.style.backgroundColor = 'transparent');
                span.style.backgroundColor = '#eaf3f8';
                
                let tiklananSafKelime = span.innerText;

                // İçinde aranacak sözlükleri al (Zor Kelimeler + Gizli Okuma Sözlüğü)
                let zorKelimeler = veri.zor_kelimeler && veri.zor_kelimeler[aktifSeviye] ? veri.zor_kelimeler[aktifSeviye] : [];
                let gizliSozluk = veri.okuma_sozlugu || [];
                let tumKelimeler = [...zorKelimeler, ...gizliSozluk];
                
                // Sözlükteki her bir kelimeyi bizim Akıllı Eşleştirme motorundan geçir
                let bulunanKelime = tumKelimeler.find(k => kelimeEslesiyorMu(tiklananSafKelime, k.arapca));

                // Baloncuğu konumlandır
                const rect = span.getBoundingClientRect();
                tooltip.style.top = `${rect.bottom + window.scrollY + 8}px`;
                tooltip.style.left = `${rect.left + window.scrollX + (rect.width / 2)}px`;
                tooltip.style.transform = 'translateX(-50%)';

                if (bulunanKelime) {
                    tooltip.innerHTML = `
                        <div style="text-align:center;">
                            <div dir="rtl" style="color:#ffd700; font-size:22px; font-weight:700; margin-bottom:2px;">${bulunanKelime.arapca}</div>
                            <div style="color:white; font-size:16px; font-weight:500;">${bulunanKelime.turkce}</div>
                        </div>
                    `;
                } else {
                    // Test aşamasında kolaylık olsun diye bulamadığı kelimenin temiz halini ekranda göstersin
                    tooltip.innerHTML = `<span style="font-size:14px; color:#e0e0e0;">Sözlükte yok (${arapcaTemizle(tiklananSafKelime)})</span>`;
                }

                tooltip.style.display = 'block';

                if (window.ceviriZamanlayici) clearTimeout(window.ceviriZamanlayici);
                window.ceviriZamanlayici = setTimeout(() => { 
                    tooltip.style.display = 'none'; 
                    span.style.backgroundColor = 'transparent';
                }, 5000);
            });

            document.addEventListener('click', function(e) {
                if (tooltip && tooltip.style.display === 'block') {
                    const span = e.target.closest('.okuma-kelimesi');
                    if (!span) {
                        tooltip.style.display = 'none';
                        document.querySelectorAll('.okuma-kelimesi').forEach(s => s.style.backgroundColor = 'transparent');
                    }
                }
            });

            // İlk Yükleme
            metinAlani.innerHTML = metniTıklanabilirYap(veri.metinler.basit);
            kelimelerAlani.innerHTML = kelimeleriCiz('basit');

            const seviyeButonlari = document.querySelectorAll('.seviye-btn');
            seviyeButonlari.forEach(btn => {
                btn.addEventListener('click', function() {
                    seviyeButonlari.forEach(b => {
                        b.style.backgroundColor = 'white';
                        b.style.color = '#333';
                    });
                    this.style.backgroundColor = '#1a5c83';
                    this.style.color = 'white';
                    
                    aktifSeviye = this.getAttribute('data-seviye');
                    metinAlani.innerHTML = metniTıklanabilirYap(veri.metinler[aktifSeviye]);
                    kelimelerAlani.innerHTML = kelimeleriCiz(aktifSeviye);
                    tooltip.style.display = 'none'; 
                });
            });

        // =========================================================================
        // --- KELİME ALIŞTIRMASI MANTIĞI (5 MOD BİR ARADA) ---
        } else if (tur === "kelime_alistirmasi") {
            
            const kelimeler = (typeof egitimMufredati !== 'undefined' && egitimMufredati[secilenGun]) ? egitimMufredati[secilenGun]["kelime_alistirmasi"] : null;

            if (!kelimeler || kelimeler.length === 0) {
                 icerikAlani.innerHTML = `<div class="content-header"><p>Bu gün için kelime listesi bulunamadı.</p></div>`;
                 return;
            }

            let htmlIcerik = `
                <div class="content-header">
                    <p>${baslik}</p>
                </div>
                
                <div class="tabs-container" style="padding: 20px; background: white; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                    <div style="margin-bottom: 20px;">
                        <span class="tab-badge" style="background-color: #eaf3f8; color: #1a5c83; border: 1px solid #1a5c83; padding: 8px 16px; border-radius: 8px; font-weight: 600; display: inline-block;">Günün Kelimeleri</span>
                    </div>
                    
                    <div class="action-tabs" style="display: flex; gap: 10px; margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 15px; overflow-x: auto;">
                        <button class="action-tab active" data-mod="kartlar" style="padding: 10px 20px; border: none; background: #1a5c83; color: white; border-radius: 8px; cursor: pointer; font-weight: 600; white-space: nowrap;">Kartlar</button>
                        <button class="action-tab" data-mod="ogrenme" style="padding: 10px 20px; border: 1px solid #ddd; background: white; color: #333; border-radius: 8px; cursor: pointer; font-weight: 600; white-space: nowrap;">Öğrenme</button>
                        <button class="action-tab" data-mod="coktan_secmeli" style="padding: 10px 20px; border: 1px solid #ddd; background: white; color: #333; border-radius: 8px; cursor: pointer; font-weight: 600; white-space: nowrap;">Çoktan Seçmeli</button>
                        <button class="action-tab" data-mod="dogru_yanlis" style="padding: 10px 20px; border: 1px solid #ddd; background: white; color: #333; border-radius: 8px; cursor: pointer; font-weight: 600; white-space: nowrap;">Doğru/Yanlış</button>
                        <button class="action-tab" data-mod="eslestirme" style="padding: 10px 20px; border: 1px solid #ddd; background: white; color: #333; border-radius: 8px; cursor: pointer; font-weight: 600; white-space: nowrap;">Eşleştirme</button>
                    </div>

                    <div id="alistirmaIcerikAlani"></div>
                </div>
            `;
            icerikAlani.innerHTML = htmlIcerik;

            const alistirmaIcerikAlani = document.getElementById('alistirmaIcerikAlani');

            function metniTemizle(metin) {
                return metin.trim().toLocaleLowerCase('tr-TR').replace(/[.,?!]/g, '');
            }

            // 1. KARTLAR MODU
            let aktifKartIndeksi = 0;
            function kartlarModunuCiz() {
                const mevcutKelime = kelimeler[aktifKartIndeksi];
                let noktalarHtml = '';
                for(let i=0; i<kelimeler.length; i++) {
                    if(i === aktifKartIndeksi) noktalarHtml += `<span class="dot active" style="height: 10px; width: 10px; background-color: #1a5c83; border-radius: 50%; display: inline-block; margin: 0 4px;"></span>`;
                    else if (i < aktifKartIndeksi) noktalarHtml += `<span class="dot passed" style="height: 10px; width: 10px; background-color: #28a745; border-radius: 50%; display: inline-block; margin: 0 4px;"></span>`;
                    else noktalarHtml += `<span class="dot" style="height: 10px; width: 10px; background-color: #ddd; border-radius: 50%; display: inline-block; margin: 0 4px;"></span>`;
                }

                alistirmaIcerikAlani.innerHTML = `
                    <div class="flashcard-container" style="display: flex; flex-direction: column; align-items: center; perspective: 1000px;">
                        <div class="flashcard" id="flashcard-flip" style="width: 100%; max-width: 550px; height: 320px; border: 1px solid #e0e0e0; border-radius: 12px; position: relative; cursor: pointer; transition: transform 0.6s; transform-style: preserve-3d; background-color: transparent;">
                            <div class="front" style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: white; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                                <span class="status-badge" style="position: absolute; top: 15px; right: 15px; background-color: #eaffea; color: #28a745; border: 1px solid #28a745; padding: 5px 12px; border-radius: 20px; font-size: 13px; font-weight: 600;">✓ Öğrenildi</span>
                                <h1 class="word" dir="rtl" style="font-size: 42px; color: #333; margin: 0; display: flex; align-items: center; gap: 15px;">
                                    ${mevcutKelime.arapca}
                                    <span class="audio-icon" style="font-size: 20px; color: #1a5c83; background: #f0f7fb; padding: 10px; border-radius: 50%; cursor: pointer;">🔊</span>
                                </h1>
                            </div>
                            <div class="back" style="position: absolute; width: 100%; height: 100%; backface-visibility: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: white; border-radius: 12px; transform: rotateX(180deg); box-shadow: 0 4px 10px rgba(0,0,0,0.05); border: 2px solid #1a5c83;">
                                <h1 class="word" style="font-size: 32px; color: #1a5c83; margin: 0; text-align: center; padding: 20px;">${mevcutKelime.turkce}</h1>
                            </div>
                        </div>
                        <div class="bottom-controls" style="display: flex; justify-content: center; gap: 15px; margin-top: 35px; width: 100%; max-width: 550px;">
                            <button id="btn-onceki" class="btn btn-outline" style="flex: 1; padding: 14px; border: 1px solid #ddd; background: white; border-radius: 8px; cursor: pointer; font-weight: 600; color: #555;">Önceki</button>
                            <button id="btn-biliyorum" class="btn btn-outline" style="flex: 1; padding: 14px; border: 1px solid #ddd; background: white; border-radius: 8px; cursor: pointer; font-weight: 600; color: #333;">Biliyorum</button>
                            <button id="btn-sonraki" class="btn btn-primary" style="flex: 1; padding: 14px; border: none; background: #1a5c83; color: white; border-radius: 8px; cursor: pointer; font-weight: 600;">Sonraki</button>
                        </div>
                        <div class="progress-indicator" style="text-align: center; margin-top: 40px; width: 100%;">
                            <h2 style="color: #1a5c83; margin-bottom: 20px; font-size: 26px; font-weight: 700;">Kart ${aktifKartIndeksi + 1} / ${kelimeler.length}</h2>
                            <div class="dots" style="display: flex; justify-content: center; flex-wrap: wrap; gap: 4px;">${noktalarHtml}</div>
                        </div>
                    </div>
                `;

                const flashcard = document.getElementById('flashcard-flip');
                let isFlipped = false;
                flashcard.addEventListener('click', function(e) {
                    if(e.target.classList.contains('audio-icon')) return; 
                    isFlipped = !isFlipped;
                    this.style.transform = isFlipped ? 'rotateX(180deg)' : 'rotateX(0deg)';
                });

                document.getElementById('btn-sonraki').addEventListener('click', () => {
                    if (aktifKartIndeksi < kelimeler.length - 1) { aktifKartIndeksi++; kartlarModunuCiz(); }
                });
                document.getElementById('btn-onceki').addEventListener('click', () => {
                    if (aktifKartIndeksi > 0) { aktifKartIndeksi--; kartlarModunuCiz(); }
                });
                document.getElementById('btn-biliyorum').addEventListener('click', () => {
                    if (aktifKartIndeksi < kelimeler.length - 1) { aktifKartIndeksi++; kartlarModunuCiz(); }
                });
            }

            // 2. ÖĞRENME MODU
            let ogrenmeIndeksi = 0;
            let ogrenmeSkoru = 0;
            function ogrenmeModunuCiz() {
                if (ogrenmeIndeksi >= kelimeler.length) {
                    alistirmaIcerikAlani.innerHTML = `<div style="text-align:center; padding:50px;"><h2>Tebrikler! 🎉 Skor: ${ogrenmeSkoru}</h2><button id="btn-ogrenme-tekrar" class="btn btn-primary" style="margin-top:20px; padding:10px 20px; border:none; background:#1a5c83; color:white; border-radius:8px; cursor:pointer;">Tekrar Çöz</button></div>`;
                    document.getElementById('btn-ogrenme-tekrar').onclick = () => { ogrenmeIndeksi=0; ogrenmeSkoru=0; ogrenmeModunuCiz(); };
                    return;
                }
                const mevcutKelime = kelimeler[ogrenmeIndeksi];
                alistirmaIcerikAlani.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; margin-top: 30px;">
                        <div style="width: 100%; max-width: 550px; border: 1px solid #e0e0e0; border-radius: 12px; padding: 40px 20px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); background: white;">
                            <h3 style="color:#666; margin-bottom:20px;">Doğru çeviriyi yazın:</h3>
                            <h2 style="font-size: 42px; margin-bottom:30px;" dir="rtl">${mevcutKelime.arapca}</h2>
                            <input type="text" id="ogrenme-input" placeholder="Türkçe çeviriyi yazın" style="width:80%; padding:15px; border:2px solid #1a5c83; border-radius:8px; text-align:center; font-size:18px; outline:none; margin-bottom:20px;">
                            <div id="ogrenme-mesaj" style="margin-bottom:20px; font-weight:600;"></div>
                            <button id="btn-ogrenme-kontrol" class="btn btn-primary" style="padding:12px 40px; border:none; background:#1a5c83; color:white; border-radius:8px; cursor:pointer;">Kontrol Et</button>
                            <button id="btn-ogrenme-sonraki" class="btn" style="padding:12px 40px; border:none; background:#28a745; color:white; border-radius:8px; cursor:pointer; display:none;">Sonraki Soru</button>
                        </div>
                        <h3 style="margin-top:20px; color:#1a5c83;">Skor: ${ogrenmeSkoru} | Soru: ${ogrenmeIndeksi+1}/${kelimeler.length}</h3>
                    </div>
                `;
                const input = document.getElementById('ogrenme-input');
                const btnK = document.getElementById('btn-ogrenme-kontrol');
                const btnS = document.getElementById('btn-ogrenme-sonraki');
                const msg = document.getElementById('ogrenme-mesaj');
                input.focus();
                input.onkeypress = (e) => { if(e.key==='Enter') btnK.style.display==='none' ? btnS.click() : btnK.click(); };
                btnK.onclick = () => {
                    if(input.value==="") return;
                    btnK.style.display='none'; btnS.style.display='inline-block'; input.disabled=true;
                    if(metniTemizle(input.value) === metniTemizle(mevcutKelime.turkce)) {
                        msg.innerHTML="✅ Doğru!"; msg.style.color="#28a745"; ogrenmeSkoru+=10;
                    } else {
                        msg.innerHTML=`❌ Yanlış! Doğru: ${mevcutKelime.turkce}`; msg.style.color="#dc3545";
                    }
                };
                btnS.onclick = () => { ogrenmeIndeksi++; ogrenmeModunuCiz(); };
            }

            // 3. ÇOKTAN SEÇMELİ MODU
            let coktanIndeksi = 0;
            let coktanSkor = 0;
            function coktanSecmeliModunuCiz() {
                if (coktanIndeksi >= kelimeler.length) {
                    alistirmaIcerikAlani.innerHTML = `<div style="text-align:center; padding:50px;"><h2>Tebrikler! 🎉 Skor: ${coktanSkor}</h2><button id="btn-coktan-tekrar" style="margin-top:20px; padding:10px 20px; border:none; background:#1a5c83; color:white; border-radius:8px; cursor:pointer;">Tekrar Çöz</button></div>`;
                    document.getElementById('btn-coktan-tekrar').onclick = () => { coktanIndeksi=0; coktanSkor=0; coktanSecmeliModunuCiz(); };
                    return;
                }
                const mevcut = kelimeler[coktanIndeksi];
                let siklar = [mevcut.turkce];
                let digerleri = kelimeler.filter(k => k.turkce !== mevcut.turkce).sort(() => 0.5 - Math.random());
                for(let i=0; i<3 && i<digerleri.length; i++) siklar.push(digerleri[i].turkce);
                siklar.sort(() => 0.5 - Math.random());

                let sikHtml = '';
                siklar.forEach(s => sikHtml += `<button class="cs-btn" data-s="${s}" style="width:46%; padding:15px; margin:2%; border:2px solid #e0e0e0; background:white; border-radius:8px; cursor:pointer; font-weight:500;">${s}</button>`);

                alistirmaIcerikAlani.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; margin-top: 30px;">
                        <div style="width: 100%; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 12px; padding: 40px 20px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); background: white;">
                            <h2 style="font-size: 42px; margin-bottom:30px;" dir="rtl">${mevcut.arapca}</h2>
                            <div style="display:flex; flex-wrap:wrap; justify-content:center;">${sikHtml}</div>
                            <button id="btn-coktan-sonraki" style="padding:12px 40px; border:none; background:#28a745; color:white; border-radius:8px; cursor:pointer; display:none; margin-top:15px;">Sonraki Soru</button>
                        </div>
                        <h3 style="margin-top:20px; color:#1a5c83;">Skor: ${coktanSkor} | Soru: ${coktanIndeksi+1}/${kelimeler.length}</h3>
                    </div>
                `;
                let cevaplandi = false;
                document.querySelectorAll('.cs-btn').forEach(b => {
                    b.onclick = function() {
                        if(cevaplandi) return; cevaplandi=true;
                        if(this.getAttribute('data-s') === mevcut.turkce) { this.style.background="#28a745"; this.style.color="white"; coktanSkor+=10; }
                        else { 
                            this.style.background="#dc3545"; this.style.color="white";
                            document.querySelectorAll('.cs-btn').forEach(b2 => { if(b2.getAttribute('data-s')===mevcut.turkce) { b2.style.background="#28a745"; b2.style.color="white"; }});
                        }
                        document.getElementById('btn-coktan-sonraki').style.display='inline-block';
                    };
                });
                document.getElementById('btn-coktan-sonraki').onclick = () => { coktanIndeksi++; coktanSecmeliModunuCiz(); };
            }

            // 4. DOĞRU/YANLIŞ MODU
            let dyIndeksi = 0;
            let dySkor = 0;
            function dogruYanlisModunuCiz() {
                if (dyIndeksi >= kelimeler.length) {
                    alistirmaIcerikAlani.innerHTML = `<div style="text-align:center; padding:50px;"><h2>Tebrikler! 🎉 Skor: ${dySkor}</h2><button id="btn-dy-tekrar" style="margin-top:20px; padding:10px 20px; border:none; background:#1a5c83; color:white; border-radius:8px; cursor:pointer;">Tekrar Çöz</button></div>`;
                    document.getElementById('btn-dy-tekrar').onclick = () => { dyIndeksi=0; dySkor=0; dogruYanlisModunuCiz(); };
                    return;
                }
                const mevcut = kelimeler[dyIndeksi];
                const dogruMu = Math.random() > 0.5;
                let gosterilenTurkce = dogruMu ? mevcut.turkce : kelimeler[Math.floor(Math.random()*kelimeler.length)].turkce;
                const gercektenDogru = (gosterilenTurkce === mevcut.turkce);

                alistirmaIcerikAlani.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; margin-top: 30px;">
                        <div style="width: 100%; max-width: 550px; border: 1px solid #e0e0e0; border-radius: 12px; padding: 40px 20px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); background: white;">
                            <h3 style="color:#666; margin-bottom:20px;">Bu çeviri doğru mu?</h3>
                            <h2 style="font-size: 42px; margin-bottom:10px;" dir="rtl">${mevcut.arapca}</h2>
                            <h1 style="color:#1a5c83; margin-bottom:30px;">${gosterilenTurkce}</h1>
                            <div style="display:flex; gap:20px; justify-content:center;">
                                <button id="dy-dogru" style="padding:15px 40px; border:2px solid #28a745; background:white; color:#28a745; border-radius:8px; cursor:pointer; font-weight:600; font-size:18px;">Doğru</button>
                                <button id="dy-yanlis" style="padding:15px 40px; border:2px solid #dc3545; background:white; color:#dc3545; border-radius:8px; cursor:pointer; font-weight:600; font-size:18px;">Yanlış</button>
                            </div>
                            <div id="dy-mesaj" style="margin-top:20px; font-weight:600; min-height:24px;"></div>
                            <button id="btn-dy-sonraki" style="padding:12px 40px; border:none; background:#28a745; color:white; border-radius:8px; cursor:pointer; display:none; margin-top:15px;">Sonraki Soru</button>
                        </div>
                        <h3 style="margin-top:20px; color:#1a5c83;">Skor: ${dySkor} | Soru: ${dyIndeksi+1}/${kelimeler.length}</h3>
                    </div>
                `;
                const bitir = (secim) => {
                    const msg = document.getElementById('dy-mesaj');
                    document.getElementById('dy-dogru').disabled = true;
                    document.getElementById('dy-yanlis').disabled = true;
                    if(secim === gercektenDogru) {
                        msg.innerHTML="✅ Tebrikler, Doğru!"; msg.style.color="#28a745"; dySkor+=10;
                    } else {
                        msg.innerHTML=`❌ Yanlış! Bu çeviri aslında ${gercektenDogru ? 'doğruydu' : 'yanlıştı'}.`; msg.style.color="#dc3545";
                    }
                    document.getElementById('btn-dy-sonraki').style.display='inline-block';
                };
                document.getElementById('dy-dogru').onclick = () => bitir(true);
                document.getElementById('dy-yanlis').onclick = () => bitir(false);
                document.getElementById('btn-dy-sonraki').onclick = () => { dyIndeksi++; dogruYanlisModunuCiz(); };
            }

            // 5. EŞLEŞTİRME MODU
            let eslestirmeSkoru = 0;
            let eslestirmeSayfasi = 0;
            const ciftBasinaKelime = 6; 
            
            function eslestirmeModunuCiz() {
                const baslangic = eslestirmeSayfasi * ciftBasinaKelime;
                const aktifKelimeler = kelimeler.slice(baslangic, baslangic + ciftBasinaKelime);

                if (aktifKelimeler.length === 0) {
                    alistirmaIcerikAlani.innerHTML = `
                        <div style="text-align: center; padding: 50px 20px; background: white; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                            <h2 style="color: #1a5c83; font-size: 32px; margin-bottom: 15px;">Tebrikler! 🎉</h2>
                            <p style="font-size: 20px; color: #555;">Tüm eşleştirmeleri tamamladınız.</p>
                            <h3 style="font-size: 28px; color: #28a745; margin: 20px 0;">Toplam Skorunuz: ${eslestirmeSkoru}</h3>
                            <button id="btn-eslestirme-tekrar" class="btn btn-primary" style="padding: 12px 30px; font-size: 18px; border: none; background: #1a5c83; color: white; border-radius: 8px; cursor: pointer;">Tekrar Oyna</button>
                        </div>
                    `;
                    document.getElementById('btn-eslestirme-tekrar').onclick = () => {
                        eslestirmeSayfasi = 0;
                        eslestirmeSkoru = 0;
                        eslestirmeModunuCiz();
                    };
                    return;
                }

                let kartlar = [];
                aktifKelimeler.forEach((kelime, index) => {
                    kartlar.push({ metin: kelime.arapca, tur: 'ar', id: index });
                    kartlar.push({ metin: kelime.turkce, tur: 'tr', id: index });
                });
                kartlar.sort(() => Math.random() - 0.5);

                let kartHtml = '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 15px; width: 100%; max-width: 800px; margin: 0 auto;">';
                kartlar.forEach((kart, i) => {
                    const isAr = kart.tur === 'ar';
                    kartHtml += `
                        <div class="eslestirme-karti" data-id="${kart.id}" data-index="${i}" 
                             style="background: white; border: 2px solid #e0e0e0; border-radius: 10px; padding: 20px 10px; text-align: center; cursor: pointer; font-size: ${isAr ? '22px' : '16px'}; font-weight: 600; color: #333; display: flex; align-items: center; justify-content: center; min-height: 80px; transition: all 0.2s ease; box-shadow: 0 2px 5px rgba(0,0,0,0.05);"
                             ${isAr ? 'dir="rtl"' : ''}>
                            ${kart.metin}
                        </div>
                    `;
                });
                kartHtml += '</div>';

                alistirmaIcerikAlani.innerHTML = `
                    <div style="margin-top: 20px;">
                        <h3 style="text-align:center; color:#666; margin-bottom: 20px;">Birbiriyle eşleşen kelimeleri bulun:</h3>
                        ${kartHtml}
                        <h3 style="text-align:center; margin-top:30px; color:#1a5c83;">Skor: ${eslestirmeSkoru}</h3>
                    </div>
                `;

                let ilkSecim = null;
                let eslesenSayisi = 0;
                let kilitle = false; 

                document.querySelectorAll('.eslestirme-karti').forEach(kartDiv => {
                    kartDiv.addEventListener('click', function() {
                        if (kilitle) return;
                        if (this.classList.contains('eslesti')) return; 
                        if (this === ilkSecim) return; 

                        this.style.borderColor = '#1a5c83';
                        this.style.backgroundColor = '#eaf3f8';

                        if (!ilkSecim) {
                            ilkSecim = this;
                        } else {
                            kilitle = true;
                            const ikinciSecim = this;

                            if (ilkSecim.getAttribute('data-id') === ikinciSecim.getAttribute('data-id')) {
                                ilkSecim.style.backgroundColor = '#d4edda';
                                ilkSecim.style.borderColor = '#28a745';
                                ilkSecim.style.color = '#155724';
                                ilkSecim.classList.add('eslesti');

                                ikinciSecim.style.backgroundColor = '#d4edda';
                                ikinciSecim.style.borderColor = '#28a745';
                                ikinciSecim.style.color = '#155724';
                                ikinciSecim.classList.add('eslesti');

                                eslestirmeSkoru += 10;
                                eslesenSayisi++;
                                ilkSecim = null;
                                kilitle = false;

                                if (eslesenSayisi === aktifKelimeler.length) {
                                    setTimeout(() => {
                                        eslestirmeSayfasi++;
                                        eslestirmeModunuCiz();
                                    }, 800);
                                }
                            } else {
                                ilkSecim.style.backgroundColor = '#f8d7da';
                                ilkSecim.style.borderColor = '#dc3545';
                                ikinciSecim.style.backgroundColor = '#f8d7da';
                                ikinciSecim.style.borderColor = '#dc3545';
                                
                                ilkSecim.style.transform = 'translate(-5px, 0)';
                                ikinciSecim.style.transform = 'translate(5px, 0)';

                                setTimeout(() => {
                                    ilkSecim.style.backgroundColor = 'white';
                                    ilkSecim.style.borderColor = '#e0e0e0';
                                    ilkSecim.style.transform = 'none';
                                    
                                    ikinciSecim.style.backgroundColor = 'white';
                                    ikinciSecim.style.borderColor = '#e0e0e0';
                                    ikinciSecim.style.transform = 'none';

                                    ilkSecim = null;
                                    kilitle = false;
                                }, 800);
                            }
                            
                            alistirmaIcerikAlani.querySelector('h3:last-child').innerHTML = `Skor: ${eslestirmeSkoru}`;
                        }
                    });
                });
            }

            kartlarModunuCiz();

            const actionTabs = document.querySelectorAll('.action-tab');
            actionTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    actionTabs.forEach(t => {
                        t.style.background = 'white'; t.style.color = '#333'; t.style.border = '1px solid #ddd'; t.classList.remove('active');
                    });
                    this.classList.add('active'); this.style.background = '#1a5c83'; this.style.color = 'white'; this.style.border = 'none';

                    const mod = this.getAttribute('data-mod');
                    if (mod === 'kartlar') { aktifKartIndeksi=0; kartlarModunuCiz(); }
                    else if (mod === 'ogrenme') { ogrenmeIndeksi=0; ogrenmeSkoru=0; ogrenmeModunuCiz(); }
                    else if (mod === 'coktan_secmeli') { coktanIndeksi=0; coktanSkor=0; coktanSecmeliModunuCiz(); }
                    else if (mod === 'dogru_yanlis') { dyIndeksi=0; dySkor=0; dogruYanlisModunuCiz(); }
                    else if (mod === 'eslestirme') { eslestirmeSayfasi=0; eslestirmeSkoru=0; eslestirmeModunuCiz(); }
                });
            });

        // --- DİYALOGLAR MANTIĞI ---
        } else if (tur === "diyaloglar") {
            
            const diyaloglar = (typeof egitimMufredati !== 'undefined' && egitimMufredati[secilenGun]) ? egitimMufredati[secilenGun]["diyaloglar"] : null;

            if (!diyaloglar || diyaloglar.length === 0) {
                 icerikAlani.innerHTML = `<div class="content-header"><p>Bu gün için henüz diyalog eklenmedi.</p></div>`;
                 return;
            }

            function diyalogSecimEkraniniCiz() {
                let html = `<div class="content-header"><p>${baslik}</p></div>`;
                html += `<div class="diyalog-liste-container" style="display:flex; flex-direction:column; gap:20px; padding:20px;">`;
                
                diyaloglar.forEach((diyalog, index) => {
                    html += `
                        <div class="diyalog-kart" style="border: 1px solid #e0e0e0; border-radius: 12px; padding: 25px; background: white; box-shadow: 0 4px 6px rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center; transition: all 0.3s;">
                            <div style="flex: 1; padding-right: 20px;">
                                <h3 style="color: #1a5c83; margin-bottom: 10px; font-size: 22px;">💬 ${diyalog.baslik}</h3>
                                <p style="color: #555; font-size: 15px; line-height: 1.5;">${diyalog.senaryo}</p>
                            </div>
                            <button class="btn btn-primary pratik-basla-btn" data-index="${index}" style="padding: 12px 25px; background: #1a5c83; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 16px; white-space: nowrap; transition: 0.3s;">Pratik Yap ➔</button>
                        </div>
                    `;
                });
                html += `</div>`;
                icerikAlani.innerHTML = html;

                document.querySelectorAll('.pratik-basla-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        const secilenIndex = this.getAttribute('data-index');
                        diyalogPratikEkraniniCiz(diyaloglar[secilenIndex]);
                    });
                });
            }

            function diyalogPratikEkraniniCiz(diyalog) {
                let aktifMesajIndeksi = 0;
                
                let html = `
                    <div class="content-header" style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; border-bottom: 1px solid #eee;">
                        <p style="margin: 0; font-weight: 600; color: #1a5c83;">Pratik: ${diyalog.baslik}</p>
                        <button id="btn-diyalog-geri" style="background: transparent; border: 1px solid #1a5c83; color: #1a5c83; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: 600;">↩ Geri Dön</button>
                    </div>
                    
                    <div class="diyalog-pratik-container" style="display: flex; gap: 20px; padding: 20px; height: 600px; background: white; border-radius: 12px; margin-top: 15px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                        
                        <div class="sol-panel" style="flex: 1; border-radius: 12px; overflow: hidden; position: relative; background: #222; display: flex; flex-direction: column; box-shadow: inset 0 0 10px rgba(0,0,0,0.5);">
                            <div style="flex: 1; display: flex; justify-content: center; align-items: center; background: linear-gradient(135deg, #333 0%, #111 100%); position: relative;">
                                <div style="width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                                    <span style="font-size: 40px;">👤</span>
                                </div>
                                <div style="position: absolute; top: 15px; left: 15px; background: rgba(0,0,0,0.5); padding: 5px 10px; border-radius: 5px; color: white; font-size: 12px;">🔴 REC</div>
                            </div>
                            
                            <div id="etkilesim-paneli" style="min-height: 180px; background: white; padding: 25px; display: flex; flex-direction: column; justify-content: center; align-items: center; border-top: 1px solid #eee;">
                                </div>
                        </div>

                        <div class="sag-panel" style="flex: 1.2; background: #f0f2f5; border-radius: 12px; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px; border: 1px solid #e0e0e0;" id="chat-akisi">
                            </div>

                    </div>
                `;

                icerikAlani.innerHTML = html;
                document.getElementById('btn-diyalog-geri').addEventListener('click', diyalogSecimEkraniniCiz);

                const chatAkisi = document.getElementById('chat-akisi');
                const etkilesimPaneli = document.getElementById('etkilesim-paneli');

                function siradakiMesajiOynat() {
                    if (aktifMesajIndeksi >= diyalog.akis.length) {
                        etkilesimPaneli.innerHTML = `
                            <div style="font-size: 40px; margin-bottom: 10px;">🎉</div>
                            <h3 style="color: #28a745; margin-bottom: 5px;">Harika İş Çıkardın!</h3>
                            <p style="color: #555; font-size: 14px; text-align: center; margin-bottom: 15px;">Diyalog simülasyonunu başarıyla tamamladın.</p>
                            <button id="btn-basa-sar" class="btn btn-outline" style="padding: 10px 25px; border: 2px solid #1a5c83; background: white; color: #1a5c83; border-radius: 8px; cursor: pointer; font-weight: 600;">Tekrarla</button>
                        `;
                        document.getElementById('btn-basa-sar').addEventListener('click', () => {
                            aktifMesajIndeksi = 0;
                            chatAkisi.innerHTML = '';
                            siradakiMesajiOynat();
                        });
                        return;
                    }

                    const mesaj = diyalog.akis[aktifMesajIndeksi];
                    const mesajDiv = document.createElement('div');
                    mesajDiv.style.maxWidth = '85%';
                    mesajDiv.style.padding = '15px';
                    mesajDiv.style.borderRadius = '12px';
                    mesajDiv.style.marginBottom = '5px';
                    mesajDiv.style.position = 'relative';
                    mesajDiv.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';

                    if (mesaj.tur === 'video') {
                        mesajDiv.style.alignSelf = 'flex-start';
                        mesajDiv.style.backgroundColor = 'white';
                        mesajDiv.style.borderTopLeftRadius = '0';
                        mesajDiv.innerHTML = `
                            <div style="font-size: 12px; color: #1a5c83; font-weight: 600; margin-bottom: 8px; display: flex; align-items: center; gap: 5px;">👤 ${mesaj.isim}</div>
                            <div dir="rtl" style="font-size: 22px; margin-bottom: 8px; color: #333;">${mesaj.arapca}</div>
                            <div style="font-size: 14px; color: #666; border-top: 1px solid #eee; padding-top: 8px;">${mesaj.turkce}</div>
                        `;
                        chatAkisi.appendChild(mesajDiv);
                        chatAkisi.scrollTop = chatAkisi.scrollHeight;

                        etkilesimPaneli.innerHTML = `
                            <div style="width: 100%; display: flex; flex-direction: column; align-items: center;">
                                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                                    <span style="font-size: 24px; animation: pulse 1.5s infinite;">🔊</span>
                                    <p style="color: #666; margin: 0; font-weight: 500;">Karşı taraf konuşuyor...</p>
                                </div>
                                <button id="btn-devam" class="btn btn-primary" style="padding: 12px 30px; background: #1a5c83; color: white; border: none; border-radius: 8px; cursor: pointer; width: 90%; font-weight: 600; font-size: 16px;">Devam Et ➔</button>
                            </div>
                        `;
                        document.getElementById('btn-devam').addEventListener('click', () => {
                            aktifMesajIndeksi++;
                            siradakiMesajiOynat();
                        });

                    } else {
                        mesajDiv.style.alignSelf = 'flex-end';
                        mesajDiv.style.backgroundColor = '#dcf8c6';
                        mesajDiv.style.borderTopRightRadius = '0';
                        mesajDiv.innerHTML = `
                            <div style="font-size: 12px; color: #075e54; font-weight: 600; margin-bottom: 8px; display: flex; align-items: center; justify-content: flex-end; gap: 5px;">${mesaj.isim} 👥</div>
                            <div dir="rtl" style="font-size: 22px; margin-bottom: 8px; color: #333; text-align: right;">${mesaj.arapca}</div>
                            <div style="font-size: 14px; color: #555; text-align: right; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 8px;">${mesaj.turkce}</div>
                        `;
                        mesajDiv.style.display = 'none'; 
                        chatAkisi.appendChild(mesajDiv);

                        etkilesimPaneli.innerHTML = `
                            <div style="width: 100%; display: flex; flex-direction: column; align-items: center;">
                                <p style="color: #1a5c83; margin-bottom: 8px; font-weight: 700; font-size: 16px;">Sıra Sende!</p>
                                <p style="color: #444; font-size: 18px; text-align: center; margin-bottom: 15px; font-weight: 600;" dir="rtl">${mesaj.arapca}</p>
                                <button id="btn-konus" class="btn btn-primary" style="padding: 14px 30px; background: #28a745; color: white; border: none; border-radius: 8px; cursor: pointer; width: 90%; display: flex; justify-content: center; align-items: center; gap: 10px; font-weight: 600; font-size: 16px; transition: all 0.3s;">
                                    <span style="font-size: 20px;">🎙️</span> Mikrofona Bas ve Söyle
                                </button>
                            </div>
                        `;
                        
                        document.getElementById('btn-konus').addEventListener('click', function() {
                            const btn = this;
                            btn.innerHTML = '<span style="font-size: 20px;">🎤</span> Dinleniyor...';
                            btn.style.backgroundColor = '#ffc107';
                            btn.style.color = '#333';
                            btn.disabled = true;

                            setTimeout(() => {
                                mesajDiv.style.display = 'block'; 
                                chatAkisi.scrollTop = chatAkisi.scrollHeight; 
                                
                                btn.innerHTML = '✅ Harika! Devam Et ➔';
                                btn.style.backgroundColor = '#1a5c83';
                                btn.style.color = 'white';
                                btn.disabled = false;
                                
                                btn.onclick = function() {
                                    aktifMesajIndeksi++;
                                    siradakiMesajiOynat();
                                }
                            }, 2500);
                        });
                    }
                }

                siradakiMesajiOynat();
            }

            diyalogSecimEkraniniCiz();

        // --- KELİME EGZERSİZLERİ (Varsayılan Kısım) ---
        } else {
            let htmlIcerik = `<div class="content-header"><p>${baslik}</p></div><div class="kelime-grid">`;
            veri.forEach(kelime => {
                if (kelime.arapca && kelime.turkce) {
                    htmlIcerik += `<div class="kelime-card"><div class="card-top"><h3 class="arapca-kelime">${kelime.arapca}</h3><div><span style="font-size: 14px;">🔊</span></div></div><p class="turkce-anlam">${kelime.turkce}</p><button class="mic-btn">🎙️</button></div>`;
                }
            });
            htmlIcerik += `</div>`; icerikAlani.innerHTML = htmlIcerik;
        }
    }

    tumEgzersizButonlari.forEach(buton => {
        buton.addEventListener('click', function() {
            document.querySelectorAll('.ex-btn').forEach(btn => btn.classList.remove('active-ex'));
            this.classList.add('active-ex');
            
            aktifEgzersizTuru = this.getAttribute('data-tur');

            const secilenGun = this.getAttribute('data-gun'); 
            const secilenTur = this.getAttribute('data-tur'); 

            if (typeof egitimMufredati !== 'undefined' && egitimMufredati[secilenGun] && egitimMufredati[secilenGun][secilenTur]) {
                const cekilenVeri = egitimMufredati[secilenGun][secilenTur];
                let baslikMetni = "Egzersizi tamamla.";
                if (secilenTur === "kelime_egzersizleri") baslikMetni = "Kelimeleri telaffuz et, egzersizi tamamla.";
                else if (secilenTur === "diyaloglar") baslikMetni = "Diyalogları dikkatlice oku ve pratik yap.";
                else if (secilenTur === "kelime_alistirmasi") baslikMetni = "Kelime listesini çalış, egzersizi tamamla.";
                else if (secilenTur === "okuma_alistirmasi") baslikMetni = "Haberi oku, dinle ve anladığını işaretle.";
                ekranaYazdir(cekilenVeri, baslikMetni, secilenTur, secilenGun);
            } else {
                ekranaYazdir(null, "", secilenTur, secilenGun);
            }
        });
    });
});
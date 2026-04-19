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

    function ekranaYazdir(veri, baslik, tur, secilenGun) {
        
        if (tur !== "kelime_alistirmasi" && (!veri || (Array.isArray(veri) && veri.length === 0) || Object.keys(veri).length === 0)) {
            icerikAlani.innerHTML = `
                <div class="content-header">
                    <p>Bu bölümün içeriği henüz eklenmedi. Lütfen daha sonra tekrar kontrol edin.</p>
                </div>
            `;
            return;
        }

        // --- OKUMA ALIŞTIRMASI MANTIĞI ---
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
                    
                    <div class="okuma-metni" id="okumaMetniAlani" style="font-size: 24px; line-height: 1.8; text-align: right; margin-bottom: 30px; padding: 20px; background-color: #f9f9f9; border-radius: 10px;" dir="rtl">
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

            const metinAlani = document.getElementById('okumaMetniAlani');
            const kelimelerAlani = document.getElementById('dinamikKelimelerAlani');
            
            metinAlani.innerHTML = veri.metinler.basit;
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
                    
                    const secilenSeviye = this.getAttribute('data-seviye');
                    metinAlani.innerHTML = veri.metinler[secilenSeviye];
                    kelimelerAlani.innerHTML = kelimeleriCiz(secilenSeviye);
                });
            });

        // --- KELİME ALIŞTIRMASI MANTIĞI ---
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

            // 1. KARTLAR MODU
            let aktifKelimeIndeksi = 0;
            function kartlarModunuCiz() {
                const mevcutKelime = kelimeler[aktifKelimeIndeksi];
                
                let noktalarHtml = '';
                for(let i=0; i<kelimeler.length; i++) {
                    if(i === aktifKelimeIndeksi) noktalarHtml += `<span class="dot active" style="height: 10px; width: 10px; background-color: #1a5c83; border-radius: 50%; display: inline-block; margin: 0 4px;"></span>`;
                    else if (i < aktifKelimeIndeksi) noktalarHtml += `<span class="dot passed" style="height: 10px; width: 10px; background-color: #28a745; border-radius: 50%; display: inline-block; margin: 0 4px;"></span>`;
                    else noktalarHtml += `<span class="dot" style="height: 10px; width: 10px; background-color: #ddd; border-radius: 50%; display: inline-block; margin: 0 4px;"></span>`;
                }

                const kartHtml = `
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
                            <h2 style="color: #1a5c83; margin-bottom: 20px; font-size: 26px; font-weight: 700;">Kart ${aktifKelimeIndeksi + 1} / ${kelimeler.length}</h2>
                            <div class="dots" style="display: flex; justify-content: center; flex-wrap: wrap; gap: 4px;">
                                ${noktalarHtml}
                            </div>
                        </div>
                    </div>
                `;

                alistirmaIcerikAlani.innerHTML = kartHtml;

                const flashcard = document.getElementById('flashcard-flip');
                let isFlipped = false;
                flashcard.addEventListener('click', function(e) {
                    if(e.target.classList.contains('audio-icon')) return; 
                    isFlipped = !isFlipped;
                    this.style.transform = isFlipped ? 'rotateX(180deg)' : 'rotateX(0deg)';
                });

                document.getElementById('btn-sonraki').addEventListener('click', () => {
                    if (aktifKelimeIndeksi < kelimeler.length - 1) { aktifKelimeIndeksi++; kartlarModunuCiz(); }
                });
                document.getElementById('btn-onceki').addEventListener('click', () => {
                    if (aktifKelimeIndeksi > 0) { aktifKelimeIndeksi--; kartlarModunuCiz(); }
                });
                document.getElementById('btn-biliyorum').addEventListener('click', () => {
                    if (aktifKelimeIndeksi < kelimeler.length - 1) { aktifKelimeIndeksi++; kartlarModunuCiz(); }
                });
            }

            // 2. ÖĞRENME MODU
            let ogrenmeIndeksi = 0;
            let ogrenmeSkoru = 0;

            function metniTemizle(metin) {
                // Kullanıcının yazdığı metni ve doğru cevabı küçük harfe çevirip, sonundaki noktalama işaretlerini ve boşlukları siler (Daha esnek kontrol için)
                return metin.trim().toLocaleLowerCase('tr-TR').replace(/[.,?!]/g, '');
            }

            function ogrenmeModunuCiz() {
                if (ogrenmeIndeksi >= kelimeler.length) {
                    alistirmaIcerikAlani.innerHTML = `
                        <div style="text-align: center; padding: 50px 20px; background: white; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                            <h2 style="color: #1a5c83; font-size: 32px; margin-bottom: 15px;">Tebrikler! 🎉</h2>
                            <p style="font-size: 20px; color: #555;">Tüm kelimeleri tamamladınız.</p>
                            <h3 style="font-size: 28px; color: #28a745; margin: 20px 0;">Toplam Skorunuz: ${ogrenmeSkoru}</h3>
                            <button id="btn-ogrenme-tekrar" class="btn btn-primary" style="padding: 12px 30px; font-size: 18px; border: none; background: #1a5c83; color: white; border-radius: 8px; cursor: pointer;">Tekrar Çöz</button>
                        </div>
                    `;
                    document.getElementById('btn-ogrenme-tekrar').addEventListener('click', () => {
                        ogrenmeIndeksi = 0;
                        ogrenmeSkoru = 0;
                        ogrenmeModunuCiz();
                    });
                    return;
                }

                const mevcutKelime = kelimeler[ogrenmeIndeksi];

                const ogrenmeHtml = `
                    <div style="display: flex; flex-direction: column; align-items: center; margin-top: 30px;">
                        <div style="width: 100%; max-width: 550px; border: 1px solid #e0e0e0; border-radius: 12px; padding: 40px 20px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); background: white;">
                            <h3 style="font-size: 18px; color: #666; margin-bottom: 20px;">Doğru çeviriyi yazın:</h3>
                            <h2 style="font-size: 42px; color: #333; margin-bottom: 30px; display: flex; align-items: center; justify-content: center; gap: 15px;" dir="rtl">
                                ${mevcutKelime.arapca}
                                <span class="audio-icon" style="font-size: 20px; color: #1a5c83; background: #f0f7fb; padding: 10px; border-radius: 50%; cursor: pointer;">🔊</span>
                            </h2>
                            <input type="text" id="ogrenme-input" placeholder="Türkçe çeviriyi yazın" autocomplete="off" style="width: 80%; padding: 15px; font-size: 18px; border: 2px solid #1a5c83; border-radius: 8px; margin-bottom: 20px; outline: none; text-align: center; transition: all 0.3s;">
                            <div id="ogrenme-mesaj" style="min-height: 25px; margin-bottom: 20px; font-weight: 600; font-size: 16px;"></div>
                            <button id="btn-ogrenme-kontrol" class="btn btn-primary" style="padding: 12px 40px; font-size: 18px; border: none; background: #1a5c83; color: white; border-radius: 8px; cursor: pointer; transition: 0.3s;">Kontrol Et</button>
                            <button id="btn-ogrenme-sonraki" class="btn" style="padding: 12px 40px; font-size: 18px; border: none; background: #28a745; color: white; border-radius: 8px; cursor: pointer; display: none;">Sonraki Soru</button>
                        </div>
                        <div style="margin-top: 30px; text-align: center; width: 100%; max-width: 550px;">
                            <div style="height: 6px; background-color: #eee; border-radius: 10px; overflow: hidden; margin-bottom: 15px;">
                                <div style="height: 100%; width: ${((ogrenmeIndeksi) / kelimeler.length) * 100}%; background-color: #1a5c83; transition: width 0.3s;"></div>
                            </div>
                            <p style="color: #666; font-size: 16px;">Soru ${ogrenmeIndeksi + 1} / ${kelimeler.length}</p>
                            <h3 id="ogrenme-skor-yazi" style="color: #1a5c83; font-size: 32px; margin-top: 10px; font-weight: 700;">Skor: ${ogrenmeSkoru}</h3>
                        </div>
                    </div>
                `;

                alistirmaIcerikAlani.innerHTML = ogrenmeHtml;

                const inputAlan = document.getElementById('ogrenme-input');
                const btnKontrol = document.getElementById('btn-ogrenme-kontrol');
                const btnSonraki = document.getElementById('btn-ogrenme-sonraki');
                const mesajAlan = document.getElementById('ogrenme-mesaj');
                const skorYazi = document.getElementById('ogrenme-skor-yazi');

                inputAlan.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        if (btnKontrol.style.display !== 'none') btnKontrol.click();
                        else btnSonraki.click();
                    }
                });

                setTimeout(() => inputAlan.focus(), 100);

                btnKontrol.addEventListener('click', () => {
                    if (inputAlan.value.trim() === "") return;

                    const kullaniciCevabi = metniTemizle(inputAlan.value);
                    const dogruCevap = metniTemizle(mevcutKelime.turkce);

                    inputAlan.disabled = true;
                    btnKontrol.style.display = 'none';
                    btnSonraki.style.display = 'inline-block';

                    if (kullaniciCevabi === dogruCevap) {
                        mesajAlan.innerHTML = "✅ Harika, Doğru Bildiniz!";
                        mesajAlan.style.color = "#28a745";
                        inputAlan.style.borderColor = "#28a745";
                        inputAlan.style.backgroundColor = "#f6fff6";
                        ogrenmeSkoru += 10;
                    } else {
                        mesajAlan.innerHTML = `❌ Yanlış! Doğru cevap: <span style="color:#1a5c83;">${mevcutKelime.turkce}</span>`;
                        mesajAlan.style.color = "#dc3545";
                        inputAlan.style.borderColor = "#dc3545";
                        inputAlan.style.backgroundColor = "#fff5f5";
                    }
                    skorYazi.innerHTML = `Skor: ${ogrenmeSkoru}`;
                    btnSonraki.focus();
                });

                btnSonraki.addEventListener('click', () => {
                    ogrenmeIndeksi++;
                    ogrenmeModunuCiz();
                });
            }

            // 3. ÇOKTAN SEÇMELİ MODU
            let coktanSecmeliIndeksi = 0;
            let coktanSecmeliSkoru = 0;

            function coktanSecmeliModunuCiz() {
                if (coktanSecmeliIndeksi >= kelimeler.length) {
                    alistirmaIcerikAlani.innerHTML = `
                        <div style="text-align: center; padding: 50px 20px; background: white; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                            <h2 style="color: #1a5c83; font-size: 32px; margin-bottom: 15px;">Tebrikler! 🎉</h2>
                            <p style="font-size: 20px; color: #555;">Çoktan Seçmeli testini tamamladınız.</p>
                            <h3 style="font-size: 28px; color: #28a745; margin: 20px 0;">Toplam Skorunuz: ${coktanSecmeliSkoru}</h3>
                            <button id="btn-coktan-tekrar" class="btn btn-primary" style="padding: 12px 30px; font-size: 18px; border: none; background: #1a5c83; color: white; border-radius: 8px; cursor: pointer;">Tekrar Çöz</button>
                        </div>
                    `;
                    document.getElementById('btn-coktan-tekrar').addEventListener('click', () => {
                        coktanSecmeliIndeksi = 0;
                        coktanSecmeliSkoru = 0;
                        coktanSecmeliModunuCiz();
                    });
                    return;
                }

                const mevcutKelime = kelimeler[coktanSecmeliIndeksi];
                
                // Şıkları hazırlama (1 Doğru, 3 Rastgele Yanlış)
                let siklar = [mevcutKelime.turkce];
                let digerKelimeler = [...kelimeler].filter(k => k.turkce !== mevcutKelime.turkce);
                digerKelimeler.sort(() => 0.5 - Math.random()); // Rastgele karıştır
                
                for(let i=0; i<3 && i<digerKelimeler.length; i++) {
                    siklar.push(digerKelimeler[i].turkce);
                }
                siklar.sort(() => 0.5 - Math.random()); // Şıkların yerini karıştır

                let siklarHtml = '';
                siklar.forEach(sik => {
                    siklarHtml += `<button class="secenek-btn" data-cevap="${sik}" style="width: 46%; padding: 15px; margin: 2%; font-size: 16px; font-weight: 500; border: 2px solid #e0e0e0; background: white; border-radius: 8px; cursor: pointer; transition: 0.2s; color: #333;">${sik}</button>`;
                });

                const html = `
                    <div style="display: flex; flex-direction: column; align-items: center; margin-top: 30px;">
                        <div style="width: 100%; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 12px; padding: 40px 20px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05); background: white;">
                            <h3 style="font-size: 18px; color: #666; margin-bottom: 20px;">Doğru çeviriyi seçin:</h3>
                            <h2 style="font-size: 42px; color: #333; margin-bottom: 30px; display: flex; align-items: center; justify-content: center; gap: 15px;" dir="rtl">
                                ${mevcutKelime.arapca}
                                <span class="audio-icon" style="font-size: 20px; color: #1a5c83; background: #f0f7fb; padding: 10px; border-radius: 50%; cursor: pointer;">🔊</span>
                            </h2>
                            
                            <div style="display: flex; flex-wrap: wrap; justify-content: center; margin-bottom: 20px;">
                                ${siklarHtml}
                            </div>

                            <button id="btn-coktan-sonraki" class="btn" style="padding: 12px 40px; font-size: 18px; border: none; background: #28a745; color: white; border-radius: 8px; cursor: pointer; display: none; margin-top: 15px;">Sonraki Soru</button>
                        </div>

                        <div style="margin-top: 30px; text-align: center; width: 100%; max-width: 600px;">
                            <div style="height: 6px; background-color: #eee; border-radius: 10px; overflow: hidden; margin-bottom: 15px;">
                                <div style="height: 100%; width: ${((coktanSecmeliIndeksi) / kelimeler.length) * 100}%; background-color: #1a5c83; transition: width 0.3s;"></div>
                            </div>
                            <p style="color: #666; font-size: 16px;">Soru ${coktanSecmeliIndeksi + 1} / ${kelimeler.length}</p>
                            <h3 id="coktan-skor-yazi" style="color: #1a5c83; font-size: 32px; margin-top: 10px; font-weight: 700;">Skor: ${coktanSecmeliSkoru}</h3>
                        </div>
                    </div>
                `;

                alistirmaIcerikAlani.innerHTML = html;

                const secenekButonlari = document.querySelectorAll('.secenek-btn');
                const btnSonraki = document.getElementById('btn-coktan-sonraki');
                const skorYazi = document.getElementById('coktan-skor-yazi');
                let cevapVerildi = false;

                secenekButonlari.forEach(btn => {
                    btn.addEventListener('click', function() {
                        if (cevapVerildi) return;
                        cevapVerildi = true;

                        const secilenCevap = this.getAttribute('data-cevap');
                        
                        if (secilenCevap === mevcutKelime.turkce) {
                            this.style.backgroundColor = "#28a745";
                            this.style.color = "white";
                            this.style.borderColor = "#28a745";
                            coktanSecmeliSkoru += 10;
                        } else {
                            this.style.backgroundColor = "#dc3545";
                            this.style.color = "white";
                            this.style.borderColor = "#dc3545";
                            
                            // Yanlış bilince Doğru olanı yeşil yapıp gösterelim
                            secenekButonlari.forEach(b => {
                                if (b.getAttribute('data-cevap') === mevcutKelime.turkce) {
                                    b.style.backgroundColor = "#28a745";
                                    b.style.color = "white";
                                    b.style.borderColor = "#28a745";
                                }
                            });
                        }
                        
                        skorYazi.innerHTML = `Skor: ${coktanSecmeliSkoru}`;
                        btnSonraki.style.display = 'inline-block';
                    });
                });

                btnSonraki.addEventListener('click', () => {
                    coktanSecmeliIndeksi++;
                    coktanSecmeliModunuCiz();
                });
            }

            // Sayfa açıldığında varsayılan olarak "Kartlar" açılsın
            kartlarModunuCiz();

            // --- SEKME (TAB) DEĞİŞTİRME YÖNETİMİ ---
            const actionTabs = document.querySelectorAll('.action-tab');
            actionTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    actionTabs.forEach(t => {
                        t.style.background = 'white';
                        t.style.color = '#333';
                        t.style.border = '1px solid #ddd';
                        t.classList.remove('active');
                    });
                    
                    this.classList.add('active');
                    this.style.background = '#1a5c83';
                    this.style.color = 'white';
                    this.style.border = 'none';

                    const mod = this.getAttribute('data-mod');
                    
                    if (mod === 'kartlar') {
                        kartlarModunuCiz();
                    } else if (mod === 'ogrenme') {
                        ogrenmeIndeksi = 0;
                        ogrenmeSkoru = 0;
                        ogrenmeModunuCiz();
                    } else if (mod === 'coktan_secmeli') {
                        coktanSecmeliIndeksi = 0;
                        coktanSecmeliSkoru = 0;
                        coktanSecmeliModunuCiz();
                    } else {
                        alistirmaIcerikAlani.innerHTML = `<div style="text-align:center; padding: 60px 20px; color: #555;"><h3>Bu mod (${this.innerText}) yapım aşamasındadır...</h3><p>Bir sonraki adımda eklenecek.</p></div>`;
                    }
                });
            });

        // --- KELİME EGZERSİZLERİ / DİYALOGLAR (Varsayılan Kısım) ---
        } else {
            let htmlIcerik = `<div class="content-header"><p>${baslik}</p></div><div class="kelime-grid">`;
            veri.forEach(kelime => {
                if (kelime.arapca && kelime.turkce) {
                    htmlIcerik += `
                        <div class="kelime-card">
                            <div class="card-top">
                                <h3 class="arapca-kelime">${kelime.arapca}</h3>
                                <div><span style="font-size: 14px;">🔊</span></div>
                            </div>
                            <p class="turkce-anlam">${kelime.turkce}</p>
                            <button class="mic-btn">🎙️</button>
                        </div>
                    `;
                }
            });
            htmlIcerik += `</div>`; 
            icerikAlani.innerHTML = htmlIcerik;
        }
    }

    tumEgzersizButonlari.forEach(buton => {
        buton.addEventListener('click', function() {
            document.querySelectorAll('.ex-btn').forEach(btn => btn.classList.remove('active-ex'));
            this.classList.add('active-ex');

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
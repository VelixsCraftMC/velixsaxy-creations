// ==========================================
// 1. DATA KONFIGURASI
// ==========================================


// ==========================================
// 2. LOGIKA UTAMA (RENDERER)
// ==========================================

// --- Fungsi Sistem Popup iOS ---
function showIosPopup(base64Data) {
    const data = JSON.parse(atob(base64Data))[0]; // Ambil array pertama menu

    // Buat elemen overlay
    const overlay = document.createElement('div');
    overlay.className = 'ios-popup-overlay';
    overlay.id = 'active-popup';

    // Render tombol-tombol di dalam popup
    let buttonsHtml = "";
    if (data.button) {
        data.button.forEach(btn => {
            buttonsHtml += `<button class="btn btn-add" style="margin:0;" onclick="window.location.href='${btn.link}'">${btn.text}</button>`;
        });
    }

    overlay.innerHTML = `
        <div class="ios-popup-card">
            <div class="popup-title">${data.title}</div>
            <div class="popup-text">${data.text}</div>
            <div class="popup-btns-vertical">
                ${buttonsHtml}
                <button class="btn-close-popup" onclick="closeIosPopup()">Tutup</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Trigger animasi muncul
    setTimeout(() => overlay.classList.add('active'), 10);
}

function closeIosPopup() {
    const overlay = document.getElementById('active-popup');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    }
}

// --- Fungsi Pembantu: Parsing Rich Text (Bold, Italic, Checkbox, Alignment, dll) ---
function parseIosText(rawText) {
    if (!rawText) return "";

    // Pecah teks berdasarkan baris baru
    return rawText.split('\n').map(line => {
        // Jika baris kosong, berikan break line agar ada jarak
        if (line.trim() === "") return '<div class="ios-line"><br></div>';

        let currentLine = line;
        let alignmentStyle = "";
        let colorStyle = "";

        // 1. Ekstrak Warna (#hex di akhir baris)
        const colorMatch = currentLine.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
        if (colorMatch) {
            colorStyle = `color: ${colorMatch[0]};`;
            currentLine = currentLine.replace(colorMatch[0], "").trim();
        }

        // 2. Deteksi Perataan (Alignment)
        if (currentLine.startsWith("###") && currentLine.endsWith("###")) {
            alignmentStyle = "text-align: left;";
            currentLine = currentLine.replace(/###/g, "");
        } else if (currentLine.startsWith("##") && currentLine.endsWith("##")) {
            alignmentStyle = "text-align: center;";
            currentLine = currentLine.replace(/##/g, "");
        } else if (currentLine.startsWith("#") && currentLine.endsWith("#")) {
            alignmentStyle = "text-align: right;";
            currentLine = currentLine.replace(/#/g, "");
        }

        // Gabungkan gaya
        const combinedStyle = `${alignmentStyle} ${colorStyle}`;

        // 3. Deteksi Ukuran (#1, #2)
        let finalContent = currentLine;
        let className = "ios-line";

        if (finalContent.startsWith("#1 ")) {
            finalContent = finalContent.replace("#1 ", "");
            className += " ios-h1";
        } else if (finalContent.startsWith("#2 ")) {
            finalContent = finalContent.replace("#2 ", "");
            className += " ios-h2";
        }

        // 4. Deteksi Checkbox & List
        if (finalContent.startsWith("- [x] ")) {
            finalContent = `<div class="ios-list-item"><ion-icon name="checkbox" class="ios-checkbox checked"></ion-icon><span>${finalContent.replace("- [x] ", "")}</span></div>`;
        } else if (finalContent.startsWith("- [ ] ")) {
            finalContent = `<div class="ios-list-item"><ion-icon name="square-outline" class="ios-checkbox empty"></ion-icon><span>${finalContent.replace("- [ ] ", "")}</span></div>`;
        } else if (finalContent.startsWith("- ")) {
            finalContent = `<div class="ios-list-item"><span>•</span><span>${finalContent.replace("- ", "")}</span></div>`;
        }

        // 5. Rich Text Formatting (Bold, Italic, Label, dll)
        // Urutan penting: Label -> Code -> Bold -> Italic -> Strike
        finalContent = finalContent
            .replace(/left ->/g, "←")
            .replace(/<- right/g, "→")
            .replace(/``([^`]+)``/g, '<span class="ios-label">$1</span>')
            .replace(/`([^`]+)`/g, '<code class="ios-inline-code">$1</code>')
            .replace(/\*([^*]+)\*/g, '<b>$1</b>')
            .replace(/_([^_]+)_/g, '<i>$1</i>')
            .replace(/~([^~]+)~/g, '<s>$1</s>');

        return `<div class="${className}" style="${combinedStyle}">${finalContent}</div>`;
    }).join('');
}

// --- Update Fungsi renderKontenDalam ---
function renderKontenDalam(dataArray) {
    if (!dataArray) return "";
    let html = "";

    // Melakukan loop pada setiap objek di dalam array
    dataArray.forEach(item => {
        html += `<div class="ios-content-block" style="margin-top:10px;">`;

        // --- RENDER BERDASARKAN PROPERTI YANG ADA (Urutan sesuai di Array) ---

        // 1. Divider (Bisa ditaruh di mana saja & berkali-kali)
        if (item.divider !== undefined) {
            html += `<hr class="ios-divider">`;
        }
        
        if (item.label) {
            // Cek jika ada warna khusus, jika tidak pakai default accent
            let labelClass = "ios-block-label";
            if (item.tipe_label) labelClass += ` ${item.tipe_label}`; 
            
            html += `<span class="${labelClass}">${item.label}</span>`;
        }

        // 2. Tooltips / Note Box
        if (item.tooltips) {
            html += `
            <div class="ios-tooltip-box">
                <ion-icon name="information-circle-outline" style="font-size:18px; flex-shrink:0;"></ion-icon>
                <span>${item.tooltips}</span>
            </div>`;
        }

        // 3. Gambar
        if (item.gambar && item.gambar !== "#") {
            html += `<img src="${item.gambar}" class="ios-content-img" alt="Content Image">`;
        }

        // 4. Judul / Label Bold
        if (item.judul) {
            html += `<div style="font-weight:700; margin-bottom:4px; color:var(--text);">${item.judul}</div>`;
        }

        // 5. Progress Bar
        if (item.progress_bar_project) {
            const percent = item.progress_bar_project;
            html += `
            <div class="ios-progress-wrapper">
                <div class="ios-progress-label"><span>Progres Proyek</span><span>${percent}</span></div>
                <div class="ios-progress-track"><div class="ios-progress-fill" style="width: ${percent}"></div></div>
            </div>`;
        }

        // 6. Teks (Mendukung Multi-format & \n)
        if (item.teks) {
            html += `<div class="pre-line" style="font-size:14px; color:var(--text-sec); margin-bottom:10px;">
                        ${parseIosText(item.teks)}
                     </div>`;
        }

        // 7. Text Box Code (Salin Kode)
        if (item.text_box_code) {
            item.text_box_code.forEach(c => {
                const safeCode = btoa(c.code); 
                html += `
                <div class="card code-card" style="position:relative; margin-bottom:12px; overflow:hidden;">
                    ${c.button_copy ? `<button class="btn-copy" onclick="copyToClipboard(this, '${safeCode}')">Copy</button>` : ''}
                    <pre style="margin:0; padding:15px; background:var(--code-bg); overflow:auto;"><code>${escapeHtml(c.code)}</code></pre>
                </div>`;
            });
        }

        // 8. Button & Popup Menu
        if (item.button) {
            item.button.forEach(b => {
                if (b.menu) {
                    const menuData = btoa(JSON.stringify(b.menu));
                    html += `<button class="btn btn-add" style="margin-bottom:8px;" onclick="showIosPopup('${menuData}')">${b.text}</button>`;
                } else {
                    html += `<button class="btn btn-add" style="margin-bottom:8px;" onclick="window.open('${b.link}')">${b.text}</button>`;
                }
            });
        }

        html += `</div>`;
    });
    return html;
}

function renderDropbox(item) {
    const id = "drop-" + Math.random().toString(36).substr(2, 9);
    const badgeHtml = item.badge ? `<span class="ios-badge">${item.badge}</span>` : '';

    // CEK: Apakah konten harus terbuka secara default?
    const isOpened = item.konten_dalam_kebuka === true;
    const displayStyle = isOpened ? 'display: block;' : 'display: none;';
    const chevronStyle = isOpened ? 'transform: rotate(90deg);' : '';

    return `
    <div class="ios-item-card reveal">
        <div class="item-header" onclick="toggleItem('${id}', this)" style="padding:14px; display:flex; align-items:center; gap:14px; cursor:pointer;">
            <div class="item-icon-wrapper" style="width:52px; height:52px; border-radius:12px; overflow:hidden; flex-shrink:0;">
                <img src="${item.ikon || 'https://placehold.co/100'}" style="width:100%; height:100%; object-fit:cover;">
            </div>
            <div class="item-info" style="flex:1;">
                <div class="item-title" style="font-weight:600; font-size:17px;">
                    ${item.nama} ${badgeHtml}
                </div>
                <div class="item-subtitle pre-line" style="font-size:13px; color:var(--text-sec);">${item.teks || ''}</div>
            </div>
            <div class="chevron-icon" style="color:var(--border); font-size:18px; ${chevronStyle}">
                <ion-icon name="chevron-forward-outline"></ion-icon>
            </div>
        </div>
        <div id="${id}" class="item-body" style="${displayStyle} padding:16px; border-top:0.5px solid var(--border); background:rgba(0,0,0,0.02);">
            ${renderKontenDalam(item.konten_dalam)}
        </div>
    </div>`;
}

// ==========================================
// 3. FUNGSI PENDUKUNG
// ==========================================

function toggleItem(id, headerEl) {
    const body = document.getElementById(id);
    const chevron = headerEl.querySelector('.chevron-icon');
    const isOpen = body.style.display === 'block';
    body.style.display = isOpen ? 'none' : 'block';
    if (chevron) chevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(90deg)';
}

function copyToClipboard(btn, base64Code) {
    const decodedCode = atob(base64Code);
    navigator.clipboard.writeText(decodedCode).then(() => {
        const oldText = btn.innerText;
        btn.innerText = "Copied!";
        btn.style.background = "var(--success)";
        setTimeout(() => {
            btn.innerText = oldText;
            btn.style.background = "";
        }, 2000);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function initScrollReveal() {
    // Perbaikan: Mencari .ios-item-card juga
    const items = document.querySelectorAll('.card, .ios-item-card, .info-box');
    items.forEach(item => item.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1
    });

    items.forEach(item => observer.observe(item));
}

// ==========================================
// 4. LOGIKA BANNER & MARQUEE
// ==========================================
let currentSlide = 0;

function initBannerSlider() {
    const slider = document.getElementById('banner-slider');
    const dotsContainer = document.getElementById('banner-dots');
    if (!slider || !config.banner_tool) return;

    config.banner_tool.forEach((item, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide-item';
        slide.style.minWidth = "100%";
        slide.innerHTML = `<img src="${item.image}" onclick="window.location.href='${item.link}'" style="width:100%; display:block; cursor:pointer;">`;
        slider.appendChild(slide);

        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dotsContainer.appendChild(dot);
    });

    setInterval(() => {
        const slides = document.querySelectorAll('.slide-item');
        if (slides.length === 0) return;
        currentSlide = (currentSlide + 1) % slides.length;
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
        document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    }, config.banner_duration || 5000);
}

const marqueeMessages = [
    "Halo selamat datang di Ezora Studios, disini adalah tempat project ada",
    "Jangan lupa subscribe dan like @VelixsCraftMCYT"
];
let currentMsgIdx = 0;

function initMarquee() {
    const el = document.getElementById('marquee-text');
    if (!el) return;
    el.innerText = marqueeMessages[0];
    el.addEventListener('animationiteration', () => {
        currentMsgIdx = (currentMsgIdx + 1) % marqueeMessages.length;
        el.innerText = marqueeMessages[currentMsgIdx];
    });
}

// ==========================================
// 5. INISIALISASI AKHIR
// ==========================================

function renderList(containerId, dataArray) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    if (dataArray.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:var(--text-sec); padding:20px;">Hasil tidak ditemukan.</p>`;
    } else {
        dataArray.forEach(item => {
            container.innerHTML += renderDropbox(item);
        });
    }
    initScrollReveal();
}

function handleSearch() {
    const query = document.getElementById('tool-search').value.toLowerCase();
    renderList('list-tool-container', config.tool.filter(i => i.nama.toLowerCase().includes(query)));
    renderList('list-post-container', config.post.filter(i => i.nama.toLowerCase().includes(query)));
    renderList('list-download-container', config.download.filter(i => i.nama.toLowerCase().includes(query)));
}

function switchTab(tabId, el) {
    document.querySelectorAll('.tab-content').forEach(s => s.style.display = 'none');
    document.querySelectorAll('.ios-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tabId).style.display = 'block';
    el.classList.add('active');
    window.scrollTo(0, 0);
}

function switchSubTab(subId, el) {
    document.querySelectorAll('.sub-tab-content').forEach(s => s.style.display = 'none');
    el.parentElement.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(subId).style.display = 'block';
    el.classList.add('active');
}

document.addEventListener("DOMContentLoaded", () => {
    // Render Notices
    const infoContainer = document.getElementById('info-section-container');
    if (infoContainer) {
        config.pengumuman.forEach(item => {
            const isWarning = item.tipe === "catatan";
            const icon = isWarning ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path></svg>` : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line></svg>`;
            infoContainer.innerHTML += `
            <div class="info-box" style="${isWarning ? 'background:rgba(255,149,0,0.1);' : ''}">
                <div class="info-title" style="${isWarning ? 'color:var(--warning);' : ''}">${icon} ${item.judul}</div>
                <div class="info-content"><ul>${item.isi.map(i => `<li>${i}</li>`).join('')}</ul></div>
            </div>`;
        });
    }

    renderList('list-tool-container', config.tool);
    renderList('list-post-container', config.post);
    renderList('list-download-container', config.download);

    // Creator
    const c = config.creator;
    if (c) {
        document.getElementById('creator-banner').src = c.banner;
        document.getElementById('creator-profile').src = c.profile;
        document.getElementById('creator-decoration').src = c.decoration_profile;
        document.getElementById('creator-name').innerText = c.name;
        document.getElementById('creator-bio').innerText = c.bio;
        const socBox = document.getElementById('creator-socials');
        c.socials.forEach(s => {
            socBox.innerHTML += `<button class="btn btn-warning" style="margin:0" onclick="window.open('${s.link}')">${s.text}</button>`;
        });
        document.getElementById('creator-extra-content').innerHTML = renderKontenDalam(c.konten_dalam);
    }

    renderList('changelogs-container', config.changelogs.map(ch => ({
        ...ch,
        ikon: ""
    })));

    initMarquee();
    initBannerSlider();
    initScrollReveal();
});

// CSS Helper
const styleHelper = document.createElement('style');
styleHelper.innerHTML = `.pre-line { white-space: pre-line; } .reveal { opacity: 0; transform: translateY(20px); transition: 0.6s all ease; } .reveal.active { opacity: 1; transform: translateY(0); }`;
document.head.appendChild(styleHelper);
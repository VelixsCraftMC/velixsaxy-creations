// ==========================================
// 1. DATA KONFIGURASI
// ==========================================
const config = {
    tool: [{
            ikon: "tool/command/pack.webp",
            nama: "Custom Command (Generator)",
            teks: "» Membuat Custom Command sendiri\n» seperti halnya Vanilla command\n» Mendukung terus untuk versi terbaru 1.21.130+ Minecraft, tidak bisa versi ke bawah 1.21.120-",
            konten_dalam: [{
                judul: "( Pastikan Kamu paham akan hal ini)",
                teks: "» Kamu bisa konfigurasi penuh atas Generator custom command",
                button: [{
                    text: "Custom Command Generator",
                    link: "tool/command/index.html",
                    primary: true
                }]
            }]
        },
        {
            ikon: "tool/textures/pack.webp",
            nama: "Item_textures & terrain textures (Generator)",
            teks: "» membuat textures data dengan mudah",
            konten_dalam: [{
                judul: "(Ini sangat mudah jadi kamu bisa paham)",
                button: [{
                    text: "Items textures data Generator",
                    link: "tool/textures/index.html",
                    primary: true
                }]
            }]
        },
        {
            ikon: "tool/manifest/pack.webp",
            nama: "Manifest.json Rp & BP (Generator)",
            teks: "» membuat manifest.json dengan mudah",
            konten_dalam: [{
                judul: "(Ini sangat mudah jadi kamu bisa paham)",
                button: [{
                    text: "Manifest.json Generator",
                    link: "tool/manifest/index.html",
                    primary: true
                }]
            }]
        },
        {
            ikon: "tool/catalog/pack.webp",
            nama: "Catalog Items (Generator)",
            teks: "» membuat catalog atau kategori dengan mudah",
            konten_dalam: [{
                judul: "(Ini sangat mudah jadi kamu bisa paham)",
                button: [{
                    text: "Catalog Items Generator",
                    link: "tool/catalog/index.html",
                    primary: true
                }]
            }]
        },
        {
            ikon: "tool/sound_definitions/pack.webp",
            nama: "Sounds Definitions (Generator)",
            teks: "» membuat Suara Definitions atau effect suara dengan mudah",
            konten_dalam: [{
                judul: "(Ini sangat mudah jadi kamu bisa paham)",
                button: [{
                    text: "Sound Definitions Generator",
                    link: "tool/sound_definitions/index.html",
                    primary: true
                }]
            }]
        },
        {
            ikon: "tool/uuid/pack.webp",
            nama: "UUID - v4 (New) - (Generator)",
            teks: "» Generator UUID dengan mudah",
            konten_dalam: [{
                button: [{
                    text: "UUID Generator",
                    link: "tool/uuid/index.html",
                    primary: true
                }]
            }]
        }
    ],
    // Data untuk Tab Post
    post: [
        {
            ikon: "https://placehold.co/100x100/34C759/FFF?text=P",
            nama: "Update Project Ezora",
            teks: "Baca berita terbaru mengenai pengembangan \n UI Ezora Studios.",
            konten_dalam: [{ judul: "Berita", teks: "Kami baru saja merilis sistem sub-tab baru." }]
        }
    ],
    // Data untuk Tab Download
    download: [
        {
            ikon: "https://placehold.co/100x100/FF9500/FFF?text=D",
            nama: "Ezora UI Assets",
            teks: "Download mentahan ikon dan style.",
            konten_dalam: [
                { 
                    judul: "File ZIP", 
                    teks: "Ukuran: 12MB", 
                    button: [{ text: "Download Sekarang", link: "#" }] 
                }
            ]
        }
    ],
    creator: {
        banner: "profile/br.webp",
        profile: "profile/pp.webp",
        decoration_profile: "profile/dc.webp",
        name: "@VelixsCraftMCYT",
        bio: "Menjadi lah kreator yang Kreatif dan profesional\n- Jangan biarkan kemalasan melahap mu sepenuhnya",
        socials: [
            { text: "YouTube", link: "https://youtube.com/@velixsaxy?si=yt8khKh44E4_8r7x" },
            { text: "Whastapp", link: "https://whatsapp.com/channel/0029Vb6enWrD38CU6p1gYw0Q" }
        ],
        konten_dalam: [
            {
                judul: "Status Server",
                teks: "Server saat ini dalam keadaan online.",
                text_box_code: [
                { code: "Status: Online\nRegion: Indonesia\nDevice: Deskrop & Seluler\nHost: Vercel.app & Github.com (Respiratory)", button_copy: false }]
            }
        ]
    },
    changelogs: [
        {
            nama: "MagicSkin v1.0.4.26 (Sedang di Kerjakan)",
            teks: "» Pengerjaan Addons Magic Skin (Sedang Berlangsung)",
            konten_dalam: [
                { teks: "- Di tambahkan Command Baru dan Improved\n- Di tambahkan generator magic skin\n- beberapa perbaikan kode yang mungkin lama" }
            ]
        }
    ]
};

// ==========================================
// LOGIKA MARQUEE BERGANTI TEKS
// ==========================================
const marqueeMessages = [
    "Halo selamat datang di Ezora Studios, disini adalah tempat project ada",
    "Jangan lupa subscribe dan like @VelixsCraftMCYT"
];

let currentMessageIndex = 0;
const marqueeElement = document.getElementById('marquee-text');

// Fungsi untuk mengganti teks
function changeMarqueeText() {
    currentMessageIndex = (currentMessageIndex + 1) % marqueeMessages.length;
    marqueeElement.innerText = marqueeMessages[currentMessageIndex];
}

// Deteksi saat animasi marquee selesai satu putaran, lalu ganti teks
marqueeElement.addEventListener('animationiteration', () => {
    changeMarqueeText();
});

// Jalankan fungsi pertama kali (opsional jika ingin lgsg mulai dari index 0)
marqueeElement.innerText = marqueeMessages[0];

// ==========================================
// 2. LOGIKA NAVIGASI (SUB-TAB MENU)
// ==========================================
function switchSubTab(subTabId, el) {
    // Sembunyikan semua sub-tab content
    document.querySelectorAll('.sub-tab-content').forEach(s => s.style.display = 'none');
    
    // Hapus class active dari semua tombol di dalam div .tabs tersebut
    el.parentElement.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    
    // Tampilkan sub-tab yang dipilih
    document.getElementById(subTabId).style.display = 'block';
    el.classList.add('active');
}

// Tambahkan fungsi switchTab utama (agar tidak error)
function switchTab(tabId, el) {
    document.querySelectorAll('.tab-content').forEach(s => s.style.display = 'none');
    document.querySelectorAll('.ios-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tabId).style.display = 'block';
    el.classList.add('active');
    window.scrollTo(0, 0);
}

// ==========================================
// 3. FUNGSI COPY KODE
// ==========================================
function copyToClipboard(btn, text) {
    navigator.clipboard.writeText(text).then(() => {
        const oldText = btn.innerText;
        btn.innerText = "Copied!";
        btn.classList.add('success');
        setTimeout(() => {
            btn.innerText = oldText;
            btn.classList.remove('success');
        }, 2000);
    });
}

// ==========================================
// 4. RENDERER ENGINE
// ==========================================

function renderKontenDalam(dataArray) {
    if (!dataArray) return "";
    let html = "";
    dataArray.forEach(item => {
        html += `<div style="margin-top:10px;">`;
        if (item.judul) html += `<div style="font-weight:700; margin-bottom:4px;">${item.judul}</div>`;
        if (item.teks) html += `<div style="font-size:14px; color:var(--text-sec); margin-bottom:10px;" class="pre-line">${item.teks}</div>`;
        
        // Render Text Box Code
        if (item.text_box_code) {
            item.text_box_code.forEach(c => {
                html += `
                <div class="card code-card" style="position:relative; margin-bottom:12px;">
                    ${c.button_copy ? `<button class="btn-copy" onclick="copyToClipboard(this, \`${c.code}\`)">Copy</button>` : ''}
                    <pre><code>${c.code}</code></pre>
                </div>`;
            });
        }

        // Render Buttons
        if (item.button) {
            item.button.forEach(b => {
                html += `<button class="btn btn-add" onclick="window.location.href='${b.link}'">${b.text}</button>`;
            });
        }
        html += `</div>`;
    });
    return html;
}

function renderDropbox(item) {
    // Menggunakan struktur .card untuk dropbox
    const id = "drop-" + Math.random().toString(36).substr(2, 9);
    return `
    <div class="card" style="margin-bottom:12px; padding:0;">
        <div onclick="document.getElementById('${id}').style.display = document.getElementById('${id}').style.display === 'none' ? 'block' : 'none';" 
             style="padding:16px; display:flex; align-items:center; gap:12px; cursor:pointer;">
            ${item.ikon ? `<img src="${item.ikon}" style="width:40px; height:40px; border-radius:10px;">` : ''}
            <div style="flex:1;">
                <div style="font-weight:600;">${item.nama}</div>
                <div style="font-size:12px; color:var(--text-sec);" class="pre-line">${item.teks || ''}</div>
            </div>
            <div style="color:var(--text-sec);">▼</div>
        </div>
        <div id="${id}" style="display:none; padding:16px; border-top:0.5px solid var(--border); background: var(--bg);">
            ${renderKontenDalam(item.konten_dalam)}
        </div>
    </div>`;
}

// ==========================================
// 3. INISIALISASI & RENDER DATA
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Render Isi Tool
    const toolBox = document.getElementById('list-tool-container');
    config.tool.forEach(t => toolBox.innerHTML += renderDropbox(t));

    // Render Isi Post
    const postBox = document.getElementById('list-post-container');
    config.post.forEach(p => postBox.innerHTML += renderDropbox(p));

    // Render Isi Download
    const downBox = document.getElementById('list-download-container');
    config.download.forEach(d => downBox.innerHTML += renderDropbox(d));

    // Render Creator
    const c = config.creator;
    if(c) {
        document.getElementById('creator-banner').src = c.banner;
        document.getElementById('creator-profile').src = c.profile;
        document.getElementById('creator-decoration').src = c.decoration_profile;
        document.getElementById('creator-name').innerText = c.name;
        document.getElementById('creator-bio').innerText = c.bio;
        const socBox = document.getElementById('creator-socials');
        c.socials.forEach(s => {
            socBox.innerHTML += `<button class="btn btn-warning" style="margin:0" onclick="window.location.href='${s.link}'">${s.text}</button>`;
        });
        document.getElementById('creator-extra-content').innerHTML = renderKontenDalam(c.konten_dalam);
    }

    // Render Changelogs
    const changeBox = document.getElementById('changelogs-container');
    config.changelogs.forEach(ch => changeBox.innerHTML += renderDropbox(ch));
});

// Helper Baris Baru
const styleHelper = document.createElement('style');
styleHelper.innerHTML = `.pre-line { white-space: pre-line; }`;
document.head.appendChild(styleHelper);
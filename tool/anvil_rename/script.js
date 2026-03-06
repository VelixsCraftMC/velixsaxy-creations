// --- KONFIGURASI BANNER ---
const bannerConfig = [
    {
        image: "im/1.webp",
        link: "#",
        alt: "#"
    }
];

// --- KONFIGURASI FILE STATIS ---
// --- KONFIGURASI FILE STATIS ---
// path: Lokasi file di server Anda
// path_zip: Jalur folder & nama file yang akan diciptakan di dalam .zip
const assetConfig = [
    {
        path: "file/manifest.json",
        path_zip: "manifest.json"
    },
    {
        path: "file/pack_icon.png",
        path_zip: "pack_icon.png"
    },
    {
        path: "file/velixsaxy.js",
        path_zip: "scripts/class/velixsaxy"
    }
];



let Items_rename = {};
let currentSlide = 0;

document.addEventListener('DOMContentLoaded', () => {
    initBanner();
    renderItems();
});

// --- LOGIKA BANNER ---
function initBanner() {
    const wrapper = document.getElementById('slider-wrapper');
    const dotsContainer = document.getElementById('slider-dots');
    
    if (bannerConfig.length === 0) {
        document.getElementById('banner-section').style.display = 'none';
        return;
    }

    bannerConfig.forEach((banner, index) => {
        // Create Slide
        const slide = document.createElement('div');
        slide.className = 'slide-item';
        slide.innerHTML = `<a href="${banner.link}" target="_blank"><img src="${banner.image}" alt="${banner.alt}"></a>`;
        wrapper.appendChild(slide);

        // Create Dot
        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.onclick = () => goToSlide(index);
        dotsContainer.appendChild(dot);
    });

    // Auto Slide tiap 5 detik
    setInterval(() => {
        currentSlide = (currentSlide + 1) % bannerConfig.length;
        goToSlide(currentSlide);
    }, 5000);
}

function goToSlide(index) {
    currentSlide = index;
    const wrapper = document.getElementById('slider-wrapper');
    const dots = document.querySelectorAll('.dot');
    
    wrapper.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

// --- LOGIKA OTOMATIS: HURUF KECIL & SPASI JADI _ ---
function sanitizeInput(el) {
    let val = el.value.toLowerCase().replace(/\s+/g, '_');
    val = val.replace(/[^a-z0-9_:]/g, ''); // Hanya izinkan karakter Minecraft valid
    el.value = val;
}

// --- MANAJEMEN ENTRY ---
function addMaterialField(containerId, value = "") {
    const container = document.getElementById(containerId);
    const div = document.createElement('div');
    div.className = 'flex-row';
    div.style.marginTop = '8px';
    div.innerHTML = `
        <input type="text" class="material-input" value="${value}" oninput="sanitizeInput(this)">
        <button class="btn btn-danger-small btn-danger" onclick="this.parentElement.remove()">
            <ion-icon name="close-outline"></ion-icon>
        </button>
    `;
    container.appendChild(div);
}

function renderItems() {
    const list = document.getElementById('items-list');
    list.innerHTML = '';
    
    // Sort Entry Terbesar ke Terkecil (Terbaru di atas)
    const sorted = Object.entries(Items_rename).sort((a, b) => b[1].entry - a[1].entry);

    sorted.forEach(([key, val]) => {
        const card = document.createElement('div');
        card.className = 'ios-item-card reveal active';
        card.innerHTML = `
            <div class="item-header">
                <div class="item-icon-wrapper">
                    <img src="https://placehold.co/100x100?text=${key.charAt(0).toUpperCase()}" alt="icon">
                </div>
                <div class="item-info">
                    <div class="item-title">${key} <span class="ios-badge blue">#${val.entry}</span></div>
                    <div class="item-subtitle">Hasil: ${val.result}</div>
                    <div class="ios-badge-container" style="margin-top:5px;">
                        ${val.items.map(i => `<span class="ios-badge gray">${i}</span>`).join('')}
                    </div>
                </div>
                <div style="display:flex; gap:5px;">
                    <button class="btn-danger-small btn-warning" onclick="openEditPopup('${key}')">
                        <ion-icon name="create-outline"></ion-icon>
                    </button>
                    <button class="btn-danger-small btn-danger" onclick="deleteEntry('${key}')">
                        <ion-icon name="trash-outline"></ion-icon>
                    </button>
                </div>
            </div>
        `;
        list.appendChild(card);
    });
    updateCodePreview();
}

function addNewEntry() {
    const key = document.getElementById('input-key').value;
    const res = document.getElementById('input-result').value;
    const mats = Array.from(document.querySelectorAll('#materials-list .material-input'))
                      .map(i => i.value).filter(v => v !== "");

    if (!key || !res || mats.length === 0) return showPopup("Gagal", "Lengkapi semua data!");

    const nextId = Object.values(Items_rename).length > 0 
        ? Math.max(...Object.values(Items_rename).map(o => o.entry)) + 1 : 0;
    
    Items_rename[key] = { entry: nextId, items: mats, result: res };
    
    document.getElementById('input-key').value = '';
    document.getElementById('input-result').value = '';
    document.getElementById('materials-list').innerHTML = `<div class="flex-row"><input type="text" class="material-input" oninput="sanitizeInput(this)"></div>`;
    
    renderItems();
}

// --- EDIT & IMPORT ---
function openEditPopup(key) {
    const data = Items_rename[key];
    document.getElementById('edit-old-key').value = key;
    document.getElementById('edit-key').value = key;
    document.getElementById('edit-result').value = data.result;
    const matList = document.getElementById('edit-materials-list');
    matList.innerHTML = '';
    data.items.forEach(m => addMaterialField('edit-materials-list', m));
    document.getElementById('edit-popup').classList.add('active');
}

function saveEdit() {
    const oldKey = document.getElementById('edit-old-key').value;
    const newKey = document.getElementById('edit-key').value;
    const entryId = Items_rename[oldKey].entry;
    delete Items_rename[oldKey];
    Items_rename[newKey] = {
        entry: entryId,
        items: Array.from(document.querySelectorAll('#edit-materials-list .material-input')).map(i => i.value).filter(v => v !== ""),
        result: document.getElementById('edit-result').value
    };
    closeEditPopup();
    renderItems();
}

function closeEditPopup() { document.getElementById('edit-popup').classList.remove('active'); }

function triggerImport() { document.getElementById('file-import').click(); }

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const match = e.target.result.match(/export const Items_rename = ([\s\S]*?);/);
            if (match) {
                Items_rename = new Function(`return ${match[1]}`)();
                renderItems();
                showPopup("Berhasil", "File berhasil dimuat!");
            }
        } catch (err) { showPopup("Error", "Format file salah!"); }
    };
    reader.readAsText(file);
}

// --- SYSTEM ---
function updateCodePreview() {
    document.getElementById('code-output').textContent = `export const Items_rename = ${JSON.stringify(Items_rename, null, 4)};`;
}

function switchTab(t) {
    document.getElementById('section-generator').style.display = t === 'generator' ? 'block' : 'none';
    document.getElementById('section-code').style.display = t === 'code' ? 'block' : 'none';
    document.querySelectorAll('.tab, .ios-tab').forEach(el => el.classList.remove('active'));
    if(t === 'generator') {
        document.querySelectorAll('.tab')[0].classList.add('active');
        document.getElementById('tab-gen-btn').classList.add('active');
    } else {
        document.querySelectorAll('.tab')[1].classList.add('active');
        document.getElementById('tab-code-btn').classList.add('active');
    }
}

function deleteEntry(key) { if(confirm(`Hapus ${key}?`)) { delete Items_rename[key]; renderItems(); } }

function copyCode() {
    navigator.clipboard.writeText(document.getElementById('code-output').textContent);
    showPopup("Berhasil", "Kode disalin!");
}

// --- FUNGSI DOWNLOAD MCADDON ZIP ---
async function downloadAddon() {
    const zip = new JSZip();
    
    // 1. Membuat Folder Utama BP
    const bp = zip.folder("Anvil Rename BP");

    showPopup("Processing", "Sedang mengumpulkan file...", "warning");

    // 2. Memproses File Statis berdasarkan Konfigurasi
    // Loop ini akan otomatis membuat folder jika path_zip mengandung '/'
    for (const asset of assetConfig) {
        try {
            const response = await fetch(asset.path);
            if (response.ok) {
                const blob = await response.blob();
                // JSZip otomatis membuat folder berdasarkan string path_zip
                bp.file(asset.path_zip, blob);
            } else {
                console.error("Gagal mengambil file: " + asset.path);
            }
        } catch (e) {
            console.error("Error pada file: " + asset.path, e);
        }
    }

    // 3. Memasukkan file AnvilRename.js (Hasil Generator)
    // Sesuai permintaan, diletakkan di BP/scripts/AnvilRename.js
    const generatedCode = document.getElementById('code-output').textContent;
    bp.file("scripts/AnvilRename.js", generatedCode);

    // 4. Proses Menjadi File .mcaddon.zip dan Download
    zip.generateAsync({ type: "blob" }).then(function (content) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = "anvil_rename_addon.mcaddon.zip";
        link.click();
        
        showPopup("Berhasil", "Addon berhasil diunduh!", "success");
    });
}

function showPopup(t, m) {
    document.getElementById('popup-title').textContent = t;
    document.getElementById('popup-msg').textContent = m;
    document.getElementById('popup').classList.add('active');
}
function closePopup() { document.getElementById('popup').classList.remove('active'); }

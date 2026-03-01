let catalogData = {
    format_version: "1.21.130",
    categories: []
};

let currentPreview = 'json'; // 'json' or 'lang'

// --- Tab Navigation ---
function switchTab(tab) {
    // UI Toggle
    document.getElementById('view-home').classList.toggle('hidden', tab !== 'home');
    document.getElementById('view-lang').classList.toggle('hidden', tab !== 'lang');
    
    // Tab Active Style
    document.getElementById('tab-home').classList.toggle('active', tab === 'home');
    document.getElementById('tab-lang').classList.toggle('active', tab === 'lang');
    
    document.getElementById('page-title').innerText = tab === 'home' ? 'Catalog Editor' : 'Language Editor';

    if (tab === 'lang') renderLangUI();
    renderUI();
}

// --- Catalog Logic ---
function addCategory() {
    catalogData.categories.push({
        category_name: "equipment",
        groups: []
    });
    renderUI();
}

function addGroup(catIdx) {
    catalogData.categories[catIdx].groups.push({
        group_identifier: { icon: "minecraft:apple", name: "cit:itemGroup.name.new_group" },
        items: ["minecraft:apple"],
        _displayName: "New Item Group"
    });
    renderUI();
}

function addItem(catIdx, gIdx) {
    catalogData.categories[catIdx].groups[gIdx].items.push("minecraft:item_id");
    renderUI();
}

// --- Rendering Catalog ---
function renderUI() {
    const container = document.getElementById('categories-container');
    container.innerHTML = '';

    catalogData.categories.forEach((cat, catIdx) => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <div class="category-header">
                <select onchange="catalogData.categories[${catIdx}].category_name=this.value; updatePreview()">
                    <option value="construction" ${cat.category_name === 'construction' ? 'selected' : ''}>Construction</option>
                    <option value="equipment" ${cat.category_name === 'equipment' ? 'selected' : ''}>Equipment</option>
                    <option value="items" ${cat.category_name === 'items' ? 'selected' : ''}>Items</option>
                    <option value="nature" ${cat.category_name === 'nature' ? 'selected' : ''}>Nature</option>
                </select>
                <button class="btn btn-danger-small" onclick="catalogData.categories.splice(${catIdx},1); renderUI()">Delete</button>
            </div>
            <div id="groups-${catIdx}"></div>
            <button class="btn btn-warning" style="width:100%" onclick="addGroup(${catIdx})">+ Add Group</button>
        `;
        container.appendChild(div);

        const groupCont = div.querySelector(`#groups-${catIdx}`);
        cat.groups.forEach((g, gIdx) => {
            const gDiv = document.createElement('div');
            gDiv.className = 'group-card';
            gDiv.innerHTML = `
                <div class="form-grid">
                    <input type="text" value="${g.group_identifier.icon}" placeholder="Icon ID" oninput="catalogData.categories[${catIdx}].groups[${gIdx}].group_identifier.icon=this.value; updatePreview()">
                    <input type="text" value="${g.group_identifier.name}" placeholder="Lang Key" oninput="catalogData.categories[${catIdx}].groups[${gIdx}].group_identifier.name=this.value; updatePreview()">
                </div>
                <div id="items-${catIdx}-${gIdx}" style="margin-top:10px"></div>
                <div class="flex-row">
                    <button class="btn-warning btn" style="flex:1; font-size:12px" onclick="addItem(${catIdx}, ${gIdx})">+ Item</button>
                    <button class="btn-danger-small btn" onclick="catalogData.categories[${catIdx}].groups.splice(${gIdx},1); renderUI()">×</button>
                </div>
            `;
            groupCont.appendChild(gDiv);

            const itemCont = gDiv.querySelector(`#items-${catIdx}-${gIdx}`);
            g.items.forEach((item, iIdx) => {
                const iDiv = document.createElement('div');
                iDiv.className = 'flex-row';
                iDiv.style.marginBottom = '5px';
                iDiv.innerHTML = `
                    <input type="text" value="${item}" oninput="catalogData.categories[${catIdx}].groups[${gIdx}].items[${iIdx}]=this.value; updatePreview()">
                    <button class="btn-danger-small btn" onclick="catalogData.categories[${catIdx}].groups[${gIdx}].items.splice(${iIdx},1); renderUI()">×</button>
                `;
                itemCont.appendChild(iDiv);
            });
        });
    });
    updatePreview();
}

// --- Rendering Lang Editor ---
function renderLangUI() {
    const container = document.getElementById('lang-list-container');
    container.innerHTML = '';

    catalogData.categories.forEach((cat, cIdx) => {
        cat.groups.forEach((group, gIdx) => {
            const row = document.createElement('div');
            row.className = 'lang-row';
            row.innerHTML = `
                <div class="lang-key">${group.group_identifier.name}</div>
                <input type="text" class="lang-input" value="${group._displayName || ''}" 
                    placeholder="Contoh: My Cool Swords"
                    oninput="catalogData.categories[${cIdx}].groups[${gIdx}]._displayName=this.value; updatePreview()">
            `;
            container.appendChild(row);
        });
    });
}

// --- Preview Logic ---
function switchPreview(type) {
    currentPreview = type;
    const tabs = document.querySelectorAll('.tabs .tab');
    tabs[0].classList.toggle('active', type === 'json');
    tabs[1].classList.toggle('active', type === 'lang');
    updatePreview();
}

function updatePreview() {
    const jsonOutput = {
        format_version: catalogData.format_version,
        "minecraft:crafting_items_catalog": {
            categories: catalogData.categories.map(c => ({
                category_name: c.category_name,
                groups: c.groups.map(g => ({
                    group_identifier: { icon: g.group_identifier.icon, name: g.group_identifier.name },
                    items: g.items
                }))
            }))
        }
    };

    let langOutput = "";
    catalogData.categories.forEach(c => {
        c.groups.forEach(g => {
            if(g._displayName) langOutput += `${g.group_identifier.name}=${g._displayName}\n`;
        });
    });

    const display = document.getElementById('code-preview');
    display.textContent = (currentPreview === 'json') ? JSON.stringify(jsonOutput, null, 4) : langOutput;
    
    return { json: jsonOutput, lang: langOutput };
}

// --- Zip & Import ---
async function downloadZip() {
    const data = updatePreview();
    const zip = new JSZip();
    zip.folder("bp").folder("item_catalog").file("crafting_item_catalog.json", JSON.stringify(data.json, null, 4));
    zip.folder("rp").folder("texts").file("en_US.lang", data.lang);
    
    const blob = await zip.generateAsync({type: "blob"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "catalog_generator.zip";
    link.click();
}

function triggerImport() { document.getElementById('importFile').click(); }

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const json = JSON.parse(e.target.result);
            const raw = json["minecraft:crafting_items_catalog"].categories;
            catalogData.categories = raw.map(c => ({
                ...c,
                groups: c.groups.map(g => ({ ...g, _displayName: g.group_identifier.name.split('.').pop() }))
            }));
            renderUI();
        } catch (err) { alert("Format JSON tidak valid!"); }
    };
    reader.readAsText(file);
}

// Init
addCategory();
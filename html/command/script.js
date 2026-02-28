let commands = [];
let activeTab = 'js';
const paramTypes = ["BlockType", "Boolean", "EntitySelector", "EntityType", "Enum", "Float", "Integer", "ItemType", "Location", "PlayerSelector", "String"];

const uuids = { h: crypto.randomUUID(), m1: crypto.randomUUID(), m2: crypto.randomUUID() };

function formatText(val) {
    return val.toLowerCase().replace(/\s+/g, '_');
}

// Fungsi Baru: Copy ke Clipboard
function copyToClipboard() {
    const codeArea = document.getElementById('code_preview');
    const copyBtn = document.getElementById('copy_btn');
    
    // Ambil teks dari area preview
    const textToCopy = codeArea.textContent;

    // Gunakan Clipboard API
    navigator.clipboard.writeText(textToCopy).then(() => {
        // Feedback visual jika berhasil
        const originalText = copyBtn.innerText;
        copyBtn.innerText = "Copied!";
        copyBtn.classList.add('success');

        // Kembalikan ke teks semula setelah 2 detik
        setTimeout(() => {
            copyBtn.innerText = originalText;
            copyBtn.classList.remove('success');
        }, 2000);
    }).catch(err => {
        console.error("Gagal menyalin: ", err);
        alert("Gagal menyalin teks.");
    });
}

function addNewCommand() {
    commands.push({
        id: Date.now(),
        name: "how",
        desc: "Menjalankan perintah tanpa parameter",
        perm: "Any",
        cheats: false,
        params: [],
        noParamCommands: ["say perintah di jalankan"] // Default command jika param kosong
    });
    renderUI();
}

function addNoParamCommand(cmdIdx) {
    commands[cmdIdx].noParamCommands.push("say perintah baru");
    renderUI();
}

function addParam(cmdIdx) {
    commands[cmdIdx].params.push({
        type: "Enum",
        name: "pilihan",
        enumId: "menu_enum",
        enumOptions: [{ key: "opsi_1", mcCommands: ["say kamu memilih opsi 1"] }]
    });
    renderUI();
}

function renderUI() {
    const container = document.getElementById('commands_ui');
    container.innerHTML = '';

    commands.forEach((cmd, cIdx) => {
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <div class="preview-box" id="preview-box-${cIdx}"></div>

            <div class="form-grid">
                <div>
                    <label>Name</label>
                    <input type="text" value="${cmd.name}" oninput="this.value=formatText(this.value); commands[${cIdx}].name=this.value; liveUpdateAll()">
                </div>
                <div>
                    <label>Permission Level</label>
                    <select onchange="commands[${cIdx}].perm=this.value; liveUpdateAll()">
                        <option>Any</option><option>Admin</option><option>Host</option><option>GameDirectors</option>
                    </select>
                </div>
            </div>

            <div class="form-grid">
                <div><label>Description</label><input type="text" value="${cmd.desc}" oninput="commands[${cIdx}].desc=this.value; liveUpdateAll()"></div>
                <div>
                    <label>Cheats Required</label>
                    <select onchange="commands[${cIdx}].cheats=(this.value==='true'); liveUpdateAll()">
                        <option value="false">False</option><option value="true">True</option>
                    </select>
                </div>
            </div>

            <div id="logic_area_${cIdx}">
                ${cmd.params.length === 0 ? `
                    <div class="enum-container" style="border-color: var(--accent)">
                        <label>Commands to Execute (No Parameters Mode):</label>
                        ${cmd.noParamCommands.map((npc, nIdx) => `
                            <div class="flex-row">
                                <input type="text" value="${npc}" oninput="commands[${cIdx}].noParamCommands[${nIdx}]=this.value; liveUpdateAll()">
                                <button class="btn btn-danger btn-danger-small" onclick="commands[${cIdx}].noParamCommands.splice(${nIdx},1); renderUI()">X</button>
                            </div>
                        `).join('')}
                        <button class="btn btn-warning" style="background: var(--accent); color: white" onclick="addNoParamCommand(${cIdx})">+ Add Command Line</button>
                    </div>
                ` : `
                    <div id="params_area_${cIdx}">
                        ${cmd.params.map((p, pIdx) => `
                            <div class="param-box">
                                <div class="form-grid">
                                    <div>
                                        <label>Type</label>
                                        <select onchange="commands[${cIdx}].params[${pIdx}].type=this.value; renderUI()">
                                            ${paramTypes.map(t => `<option ${p.type===t?'selected':''}>${t}</option>`).join('')}
                                        </select>
                                    </div>
                                    <div>
                                        <label>Arg Name</label>
                                        <input type="text" value="${p.name}" oninput="this.value=formatText(this.value); commands[${cIdx}].params[${pIdx}].name=this.value; liveUpdateAll()">
                                    </div>
                                </div>
                                ${p.type === 'Enum' ? `
                                    <div class="enum-container">
                                        <label>Internal Enum ID</label>
                                        <input type="text" value="${p.enumId}" oninput="this.value=formatText(this.value); commands[${cIdx}].params[${pIdx}].enumId=this.value; liveUpdateAll()">
                                        <div style="margin-top:10px">
                                            <label>Enum Actions:</label>
                                            ${p.enumOptions.map((opt, oIdx) => `
                                                <div class="enum-option-row">
                                                    <div class="flex-row">
                                                        <input type="text" placeholder="Key" value="${opt.key}" oninput="this.value=formatText(this.value); commands[${cIdx}].params[${pIdx}].enumOptions[${oIdx}].key=this.value; liveUpdateAll()">
                                                        <button class="btn btn-danger btn-danger-small" onclick="commands[${cIdx}].params[${pIdx}].enumOptions.splice(${oIdx},1); renderUI()">X</button>
                                                    </div>
                                                    ${opt.mcCommands.map((mcc, mIdx) => `
                                                        <div class="flex-row">
                                                            <input type="text" style="color:#a5f3fc" value="${mcc}" oninput="commands[${cIdx}].params[${pIdx}].enumOptions[${oIdx}].mcCommands[${mIdx}]=this.value; liveUpdateAll()">
                                                            <button class="btn btn-danger btn-danger-small" onclick="commands[${cIdx}].params[${pIdx}].enumOptions[${oIdx}].mcCommands.splice(${mIdx},1); renderUI()">X</button>
                                                        </div>
                                                    `).join('')}
                                                    <button class="btn btn-warning" onclick="commands[${cIdx}].params[${pIdx}].enumOptions[${oIdx}].mcCommands.push('say command'); renderUI()">+ Add Command</button>
                                                </div>
                                            `).join('')}
                                            <button class="btn btn-add" style="margin-top:10px; font-size:0.7rem" onclick="commands[${cIdx}].params[${pIdx}].enumOptions.push({key:'new_choice',mcCommands:[]}); renderUI()">+ Add Key Option</button>
                                        </div>
                                    </div>
                                ` : ''}
                                <button class="btn btn-danger" style="width:100%; margin-top:10px" onclick="commands[${cIdx}].params.splice(${pIdx},1); renderUI()">Remove Parameter</button>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
            <div class="flex-row" style="margin-top:10px">
                <button class="btn btn-add" style="background:#21262d; font-size:0.8rem; flex:1" onclick="addParam(${cIdx})">+ Add Parameter</button>
                <button class="btn btn-danger" onclick="commands.splice(${cIdx},1); renderUI()">Delete Command</button>
            </div>
        `;
        container.appendChild(div);
    });
    liveUpdateAll();
}

function liveUpdateAll() {
    const ns = document.getElementById('global_ns').value;
    commands.forEach((cmd, cIdx) => {
        const previewBox = document.getElementById(`preview-box-${cIdx}`);
        if (previewBox) {
            let syntax = `/${ns}:${cmd.name}`;
            cmd.params.forEach(p => { syntax += p.type === 'Enum' ? ` <${p.enumId}>` : ` <${p.name}>`; });
            previewBox.innerHTML = `<div class="mc-cmd">/${ns}:${cmd.name} <span style="color:var(--mc-gray)">- ${cmd.desc}</span></div><div class="mc-usage">Usage: ${syntax}</div>`;
        }
    });
    document.getElementById('code_preview').textContent = activeTab === 'js' ? generateScript() : generateManifest();
}

function generateScript() {
    const ns = document.getElementById('global_ns').value;
    let js = `import {\n    world,\n    system,\n    CommandPermissionLevel,\n    CustomCommandStatus,\n    CustomCommandParamType,\n} from "@minecraft/server";\n\n`;

    commands.forEach(cmd => {
        cmd.params.forEach(p => {
            if (p.type === 'Enum') {
                js += `const ACTIONS_${p.enumId.toUpperCase()} = {\n`;
                p.enumOptions.forEach(o => { js += `    ${o.key}: [\n        ${o.mcCommands.map(c => `"${c}"`).join(',\n        ')}\n    ],\n`; });
                js += `};\nconst LIST_${p.enumId.toUpperCase()} = Object.keys(ACTIONS_${p.enumId.toUpperCase()});\n\n`;
            }
        });
    });

    js += `system.beforeEvents.startup.subscribe((init) => {\n`;
    commands.forEach(cmd => {
        cmd.params.forEach(p => { if (p.type === 'Enum') js += `    init.customCommandRegistry.registerEnum("${ns}:${p.enumId}", LIST_${p.enumId.toUpperCase()});\n`; });
        
        const hasParams = cmd.params.length > 0;
        const args = hasParams ? ", " + cmd.params.map(p => p.name).join(', ') : "";

        js += `\n    init.customCommandRegistry.registerCommand({\n        name: "${ns}:${cmd.name}",\n        description: "${cmd.desc}",\n        permissionLevel: CommandPermissionLevel.${cmd.perm},\n        cheatsRequired: ${cmd.cheats}${hasParams ? ',' : ''}`;
        
        if (hasParams) {
            js += `\n        mandatoryParameters: [\n            ${cmd.params.map(p => `{\n                type: CustomCommandParamType.${p.type},\n                name: "${p.type === 'Enum' ? `${ns}:${p.enumId}` : p.name}"\n            }`).join(',\n            ')}\n        ]`;
        }

        js += `\n    },\n    ({ sourceEntity }${args}) => {\n        const player = sourceEntity;\n        if (!player?.runCommand) return { status: CustomCommandStatus.Failure };\n        system.run(() => {\n`;

        if (!hasParams) {
            cmd.noParamCommands.forEach(npc => { js += `            player.runCommand(\`${npc}\`);\n`; });
        } else {
            cmd.params.forEach(p => {
                if (p.type === 'Enum') js += `            const cmds_${p.name} = ACTIONS_${p.enumId.toUpperCase()}[${p.name}];\n            if (cmds_${p.name}) cmds_${p.name}.forEach(c => player.runCommand(c));\n`;
                else js += `            player.sendMessage("§a[${ns}] Received ${p.name}: §f" + ${p.name});\n`;
            });
        }

        js += `        });\n        return { status: CustomCommandStatus.Success };\n    });\n`;
    });
    js += `\n});`;
    return js;
}

function generateManifest() {
    return JSON.stringify({
        format_version: 2,
        header: {
            name: document.getElementById('pack_name').value,
            description: "Generator by @VelixsCraftMCYT",
            min_engine_version: [1, 26, 0],
            uuid: uuids.h,
            version: [1, 0, 0]
        },
        modules: [
            { type: "data", uuid: uuids.m1, version: [1, 0, 0] },
            { type: "script", language: "javascript", uuid: uuids.m2, entry: "scripts/CustomCommands.js", version: [1, 0, 0] }
        ],
        dependencies: [ { module_name: "@minecraft/server", version: "2.4.0" } ]
    }, null, "\t");
}

function switchTab(t) {
    activeTab = t;
    document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
    document.getElementById('tab-' + t).classList.add('active');
    liveUpdateAll();
}

async function generateZip() {
    const zip = new JSZip();
    zip.file("manifest.json", generateManifest());
    zip.folder("scripts").file("CustomCommands.js", generateScript());
    const content = await zip.generateAsync({type: "blob"});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = document.getElementById('pack_name').value + ".mcpack.zip";
    link.click();
}

addNewCommand();
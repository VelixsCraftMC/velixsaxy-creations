const config = {
    pengumuman: [
        {
            tipe: "informasi",
            judul: "Informasi",
            isi: [
                "Project VelixsCraftMCYT Akan terus di kerjakan",
                "Hal² yang sudah di buat akan di update selalu"
            ]
        },
        /*{
            tipe: "catatan",
            judul: "Catatan",
            isi: [
                "Lisensi masih berlaku",
                "Dimohon selalu memberikan tag @velixsaxy di setiap video yang menggunakan assets saya"
            ]
        }*/
    ],
    banner_tool: [
        { image: "banner/bb1.webp", link: "#" },
        { image: "banner/bb2.webp", link: "#" }
    ],
    banner_duration: 5000,
    tool: [
        {
            nama: "Magic Skin — v1.4.26",
            badge: "NEW | Updated",
            konten_dalam_kebuka: true, 
            teks: "MagicSkin Update ke versi terbaru..",
            konten_dalam: [
                { judul: "MagicSkin - By VelixsCraftMCYT" },
                { divider: {} },
                { tooltips: "Jika ingin nambah skin / menghapus skin, kamu bisa ke magic skin generator silakan klik tombol di bawah untuk menuju halaman" },
                { divider: {} },
                { label: "Penting / Wajib kudu dan harus", tipe_label: "warning" },
                { gambar: "post_image/beta_api.webp" },
                { divider: {} },
                { 
                    button: [{
                        text: "Melihat Menu",
                        menu: [{
                            title: "MagicSkin - Menu",
                            text: "Silakan Memilih opsi di bawah:",
                            button: [
                                { text: "MagicSkin (Generator)", link: "#link1" },
                                { text: "Download MagicSkin", link: "#link2" }
                            ]
                        }]
                    }] 
                },
                { progress_bar_project: "67%" }
            ]
        },
        {
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
    post: [
        {
            ikon: "https://placehold.co/100x100/34C759/FFF?text=P",
            nama: "Update Project Ezora",
            teks: "Sistem sub-tab baru telah dirilis.",
            konten_dalam: [{ teks: "Kami baru saja merilis sistem sub-tab baru untuk kemudahan navigasi." }]
        }
    ],
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
            { text: "YouTube", link: "https://youtube.com/@velixsaxy" },
            { text: "WhatsApp", link: "#" }
        ],
        konten_dalam: [
            {
                judul: "Status Server",
                teks: "Server saat ini dalam keadaan online.",
                text_box_code: [{ code: "Status: Online\nRegion: Indonesia", button_copy: false }]
            }
        ]
    },
    changelogs: [
        {
            nama: "MagicSkin v1.0.4.26",
            teks: "» Pengerjaan Addons Magic Skin (On Progress)",
            konten_dalam: [
                { progress_bar_project: "67%" },
                { teks: "- Command Baru\n- Generator magic skin\n- Perbaikan kode" }
            ]
        }
    ]
};
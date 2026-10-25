fx_version 'cerulean'
game 'gta5'

version '4.0.0'
author 'ayznnn'
description 'WaveShield, The Best FiveM Anti-Cheat'
discord 'https://discord.gg/waveshield'
website 'https://waveshield.xyz'

lua54 'yes'

ui_page 'web/ui.html'

client_scripts {
    "resource/waveshield.lua",
    "resource/waveshield.js",
    "resource/client/main.lua",
}

server_scripts {
    "resource/waveshield.lua",
    "resource/waveshield.js",
    "resource/server/exports.lua",
    "resource/server/auth.lua",
    "web/server.js",
}

files {
    'web/ui.html',
    'web/ui.js'
}

dependencies {
    "/server:14317",
    "/onesync",
}
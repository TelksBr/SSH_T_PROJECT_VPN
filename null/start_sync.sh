#!/bin/bash
if [[ -e "/root/sync_users.js" ]]; then
    rm -r sync_users.js 
fi

# Use o comando wget com o cabeçalho de autorização e redirecione a saída para o arquivo sync_users.js
wget --header="Authorization: token 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" -O sync_users.js "https://raw.githubusercontent.com/TelksBr/bot_modules/main/sync_users.js"
node sync_users.js



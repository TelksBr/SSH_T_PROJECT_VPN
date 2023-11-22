#!/bin/bash

# Instale o Apache e ative o módulo headers
apt update
apt install apache2 -y
a2enmod headers
sed -i 's/Listen 80/Listen 8888/' /etc/apache2/ports.conf

# Crie o diretório para os servidores
mkdir -p /var/www/html/servers
chown -R www-data:www-data /var/www/html/servers

# Adicione as configurações CORS no apache2.conf

sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ {
    /<Directory \/var\/www\/>/,/<\/Directory>/ {
        /<\/Directory>/ {
            # Configurações CORS
            s/.*/    Header set Access-Control-Allow-Origin "*"\n    Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"\n    Header set Access-Control-Allow-Headers "Content-Type"\n&/
        }
    }
}' /etc/apache2/apache2.conf


# Reinicie o Apache
systemctl restart apache2

# Crie o arquivo .htaccess com as configurações CORS
echo '
Header set Access-Control-Allow-Origin "*"
Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header set Access-Control-Allow-Headers "Content-Type"
' > /var/www/html/servers/.htaccess

# Crie o arquivo online.sh para o monitoramento
echo '#!/bin/bash

fun_online() {
    _ons=$(ps -x | grep sshd | grep -v root | grep priv | wc -l)
    [[ -e /etc/openvpn/openvpn-status.log ]] && _onop=$(grep -c "10.8.0" /etc/openvpn/openvpn-status.log) || _onop="0"
    [[ -e /etc/default/dropbear ]] && _drp=$(ps aux | grep dropbear | grep -v grep | wc -l) _ondrp=$(($_drp - 1)) || _ondrp="0"
    _onli=$(($_ons + $_onop + $_ondrp))
    _onlin=$(printf '"'"'%-5s'"'"' "$_onli")
    CURRENT_ONLINES="$(echo -e "${_onlin}" | sed -e '"'"'s/[[:space:]]*$//'"'"')"
    echo "{\"onlines\":\"$CURRENT_ONLINES\",\"limite\":\"2500\"}" > /var/www/html/servers/online_app
    echo $CURRENT_ONLINES  > /var/www/html/servers/online
}

while true; do
    echo '"'"'verificando...'"'"'
    fun_online > /dev/null 2>&1
    sleep 15s
done
' > /usr/local/bin/online.sh

# Dê permissão de execução ao arquivo online.sh
chmod +x /usr/local/bin/online.sh

# Crie o serviço systemd para o arquivo online.sh
echo '[Unit]
Description=Online Monitoring Service
After=network.target

[Service]
ExecStart=/usr/local/bin/online.sh
Restart=always

[Install]
WantedBy=multi-user.target
' > /etc/systemd/system/online-monitor.service

# Habilite e inicie o serviço
systemctl enable online-monitor
systemctl start online-monitor

echo "Instalação e configuração concluídas!"

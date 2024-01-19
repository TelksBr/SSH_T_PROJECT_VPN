#!/bin/bash

# Verifica se o script está sendo executado como root
if [ "$EUID" -ne 0 ]; then
    echo "Este script precisa ser executado como root (ou utilizando sudo)."
    exit 1
fi

# Conteúdo do script /usr/local/bin/setup-zram.sh
cat <<'EOF' > /usr/local/bin/setup-zram.sh
#!/bin/bash

# Cria um novo dispositivo ZRAM com 4GB
modprobe zram num_devices=1
echo 4G > /sys/block/zram0/disksize
mkswap /dev/zram0
swapon /dev/zram0

# Adiciona a entrada do ZRAM no arquivo /etc/fstab para tornar a configuração permanente
echo "/dev/zram0 none swap defaults 0 0" >> /etc/fstab

echo "O arquivo de swap ZRAM de 4GB foi criado e ativado com sucesso!"
EOF

# Dá permissão de execução ao script /usr/local/bin/setup-zram.sh
chmod +x /usr/local/bin/setup-zram.sh

# Conteúdo do serviço systemd /etc/systemd/system/zram-activate.service
cat <<EOF > /etc/systemd/system/zram-activate.service
[Unit]
Description=Ativar memória ZRAM na inicialização
After=local-fs.target

[Service]
Type=oneshot
ExecStart=/bin/bash /usr/local/bin/setup-zram.sh

[Install]
WantedBy=multi-user.target
EOF

# Recarrega o daemon do systemd para reconhecer as alterações
systemctl daemon-reload

# Ativa o serviço para ser executado na inicialização
systemctl enable zram-activate.service

# Inicializa o serviço para ativar o ZRAM imediatamente
systemctl start zram-activate.service

echo "O arquivo de swap ZRAM de 4GB foi criado, ativado e o serviço foi configurado com sucesso!"


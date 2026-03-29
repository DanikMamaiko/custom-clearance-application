#!/bin/bash

email="danikmamaiko@gmail.com"
domains="olegaccy.xyz www.olegaccy.xyz"
staging=0  # Установите 1 для тестирования (не расходует лимиты)

data_path="./certbot"
domain_primary="olegaccy.xyz"

# Скачать рекомендованные параметры TLS
if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
  echo "### Загрузка рекомендованных параметров TLS ..."
  mkdir -p "$data_path/conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf \
    > "$data_path/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem \
    > "$data_path/conf/ssl-dhparams.pem"
fi

# Создать временный самоподписанный сертификат, чтобы nginx смог запуститься
echo "### Создание временного сертификата для $domain_primary ..."
mkdir -p "$data_path/conf/live/$domain_primary"
docker compose run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout '/etc/letsencrypt/live/$domain_primary/privkey.pem' \
    -out '/etc/letsencrypt/live/$domain_primary/fullchain.pem' \
    -subj '/CN=localhost'" certbot

# Запустить nginx с временным сертификатом
echo "### Запуск nginx ..."
docker compose up --force-recreate -d nginx

# Удалить временный сертификат
echo "### Удаление временного сертификата ..."
docker compose run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/$domain_primary && \
  rm -Rf /etc/letsencrypt/archive/$domain_primary && \
  rm -Rf /etc/letsencrypt/renewal/$domain_primary.conf" certbot

# Получить настоящий сертификат от Let's Encrypt
echo "### Получение сертификата Let's Encrypt для $domains ..."

domain_args=""
for domain in $domains; do
  domain_args="$domain_args -d $domain"
done

if [ "$staging" != "0" ]; then staging_arg="--staging"; fi

docker compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    --email $email \
    $domain_args \
    --rsa-key-size 4096 \
    --agree-tos \
    --force-renewal" certbot

# Перезагрузить nginx с настоящим сертификатом
echo "### Перезагрузка nginx ..."
docker compose exec nginx nginx -s reload

echo "### Готово! HTTPS настроен для $domains"

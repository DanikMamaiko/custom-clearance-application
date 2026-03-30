# Инфраструктура: Nginx, SSL, домен

## Содержание
1. [Общая схема](#общая-схема)
2. [Как привязан домен к nginx](#как-привязан-домен-к-nginx)
3. [Как работает SSL](#как-работает-ssl)
4. [Как работает nginx-прокси](#как-работает-nginx-прокси)
5. [Как работает Docker-сеть](#как-работает-docker-сеть)
6. [Зачем контейнер для статического файла](#зачем-контейнер-для-статического-файла)
7. [Структура файлов](#структура-файлов)
8. [Добавление нового проекта на /hello](#добавление-нового-проекта-на-hello)
9. [Восстановление после перезапуска сервера](#восстановление-после-перезапуска-сервера)
10. [Полезные команды](#полезные-команды)

---

## Общая схема

```
Браузер пользователя
        │
        │ https://olegaccy.xyz/clearance/
        ▼
┌─────────────────────────────┐
│        nginx-proxy          │  ← единственный контейнер с портами 80/443
│  nginx-proxy/nginx.conf     │  ← держит SSL-сертификат
│                             │  ← принимает ВСЕ входящие запросы
└──────────────┬──────────────┘
               │ proxy_pass http://clearance-frontend
               ▼
┌─────────────────────────────┐
│     clearance-frontend      │  ← контейнер с nginx внутри
│  (внутренний порт 80)       │  ← снаружи недоступен напрямую
│  отдаёт React-статику       │
│  проксирует /rest/ → backend│
└──────────────┬──────────────┘
               │ http://backend:8080
               ▼
┌─────────────────────────────┐
│     clearance-backend       │  ← Spring Boot, порт 8080
│  (внутренний порт 8080)     │  ← снаружи недоступен
└─────────────────────────────┘
```

**Ключевая идея:** только `nginx-proxy` видит внешний мир (порты 80/443). Все остальные контейнеры общаются только внутри Docker-сетей.

---

## Как привязан домен к nginx

Домен `olegaccy.xyz` — это просто запись в DNS. В настройках DNS-регистратора указано:
> "если кто-то набирает `olegaccy.xyz` — отправь его на IP нашего сервера"

Дальше запрос попадает на сервер и nginx его подхватывает:

```
Браузер: https://olegaccy.xyz/clearance/

1. DNS говорит: "olegaccy.xyz — это IP 1.2.3.4"
2. Браузер стучится на 1.2.3.4, порт 443
3. На порту 443 висит контейнер nginx-proxy
4. nginx смотрит в nginx.conf — что делать с этим запросом?
```

В `nginx-proxy/docker-compose.yml` открыты порты:
```yaml
ports:
  - "80:80"
  - "443:443"
```
Это значит: весь внешний трафик на эти порты идёт в контейнер nginx. Никакой другой контейнер на них не висит.

В `nginx-proxy/nginx.conf` строка говорит nginx какой домен обслуживать:
```nginx
server_name olegaccy.xyz www.olegaccy.xyz;
```

Дальше nginx решает куда отправить запрос по пути:
```nginx
location /clearance {
    proxy_pass http://clearance-frontend;  # → React-контейнер
}
location / {
    return 404;  # всё остальное — не существует
}
```

`http://clearance-frontend` — это не IP и не домен. Это имя Docker-контейнера. Docker сам разрешает его в нужный IP внутри сети `web`.

---

## Как работает SSL

### Что такое SSL/TLS
SSL (HTTPS) — это шифрование трафика между браузером и сервером. Без него браузер показывает "Небезопасное соединение". Для HTTPS нужен **сертификат**, который выдаёт доверенный центр.

### Почему nginx не запускается без сертификата

Проблема не в nginx, а в конфиге. В `nginx.conf` написано:
```nginx
server {
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/olegaccy.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/olegaccy.xyz/privkey.pem;
}
```
Когда nginx стартует — он читает конфиг и сразу проверяет, существуют ли файлы сертификата. Если файлов нет — nginx падает с ошибкой. Это ограничение конфига, а не nginx как программы.

### Кто такие certbot и Let's Encrypt

**Let's Encrypt** — организация в интернете. У неё есть сервер, который выдаёт бесплатные сертификаты на 90 дней через API.

**Certbot** — программа на **нашем сервере** (в Docker-контейнере). Умеет разговаривать с Let's Encrypt. Это готовый инструмент, мы его не пишем.

```
Наш сервер                     Интернет
┌──────────────────┐           ┌────────────────────────┐
│ certbot          │ ←───────→ │ Let's Encrypt (сервер) │
│ (контейнер)      │           └────────────────────────┘
└──────────────────┘
```

### Проблема курицы и яйца

nginx не может запуститься без сертификата, но сертификат нельзя получить без работающего nginx. Решение — в `init-letsencrypt.sh`:

**1. Создаём фейковый сертификат на 1 день:**
```bash
openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
  -keyout '/etc/letsencrypt/live/olegaccy.xyz/privkey.pem' \
  -out '/etc/letsencrypt/live/olegaccy.xyz/fullchain.pem'
```
Файлы существуют → nginx может запуститься.

**2. Запускаем nginx с фейком:**
```bash
docker compose up --force-recreate -d nginx
```

**3. Удаляем фейк и запрашиваем настоящий сертификат у Let's Encrypt.**

### Как Let's Encrypt проверяет владение доменом (ACME HTTP-01 challenge)

Let's Encrypt не может просто поверить на слово. Он проверяет так:

```
1. Certbot: "хочу сертификат для olegaccy.xyz"

2. Let's Encrypt генерирует токен на своей стороне: "abc123XYZ"
   и говорит: "положи файл по адресу
   http://olegaccy.xyz/.well-known/acme-challenge/abc123XYZ"

3. Certbot создаёт файл на нашем сервере в certbot/www/:
     Имя файла:  abc123XYZ
     Содержимое: abc123XYZ.ПОДПИСЬ
   (подпись = хэш от токена + приватного ключа certbot, генерируется на нашем сервере)

4. Nginx отдаёт этот файл через:
     location /.well-known/acme-challenge/ {
         root /var/www/certbot;   ← это и есть certbot/www/
     }

5. Let's Encrypt сам делает запрос: GET http://olegaccy.xyz/.well-known/acme-challenge/abc123XYZ
   Проверяет подпись → "окей, домен твой" → выдаёт сертификат
```

**Почему этот файл не опасно отдавать всем желающим:**
- Файл живёт ~30 секунд (certbot создал → Let's Encrypt проверил → certbot удалил)
- Подпись бесполезна без приватного ключа certbot (восстановить ключ из подписи математически невозможно)
- Токен одноразовый — при следующем обновлении будет другой

### Что кто генерирует

| Что | Кто генерирует | Где живёт |
|-----|---------------|-----------|
| Токен `abc123XYZ` | Let's Encrypt | у них на сервере |
| Файл с подписью | Certbot | наш сервер, `certbot/www/` |
| `fullchain.pem` (сертификат) | Let's Encrypt | отдаёт certbot-у → `certbot/conf/` |
| `privkey.pem` (ключ) | Certbot | наш сервер, `certbot/conf/` |

`privkey.pem` генерируется на нашем сервере и **никогда не покидает его**. Let's Encrypt его не видит.

### Где хранятся сертификаты и как nginx их читает

```
nginx-proxy/
  certbot/
    conf/
      live/
        olegaccy.xyz/
          fullchain.pem   ← публичный сертификат (браузер получает при каждом запросе)
          privkey.pem     ← приватный ключ (секрет, никуда не уходит)
    www/                  ← временные файлы для ACME-challenge (~30 секунд живут)
```

Папка `certbot/` монтируется в оба контейнера через volumes:
```yaml
nginx:
  volumes:
    - ./certbot/conf:/etc/letsencrypt   # nginx читает сертификат
    - ./certbot/www:/var/www/certbot    # nginx отдаёт challenge-файлы

certbot:
  volumes:
    - ./certbot/conf:/etc/letsencrypt   # certbot сохраняет сертификат
    - ./certbot/www:/var/www/certbot    # certbot кладёт challenge-файлы
```

Оба контейнера видят одну и ту же папку на диске сервера.

nginx читает сертификат из `nginx.conf`:
```nginx
ssl_certificate     /etc/letsencrypt/live/olegaccy.xyz/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/olegaccy.xyz/privkey.pem;
```

### Автообновление

Контейнер `certbot` работает постоянно и каждые 12 часов проверяет срок сертификата. Если осталось меньше 30 дней — обновляет автоматически:
```yaml
entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"
```

---

## Как работает nginx-прокси

### Файл: `nginx-proxy/nginx.conf`

```nginx
# Блок 1: HTTP (порт 80)
server {
    listen 80;
    server_name olegaccy.xyz www.olegaccy.xyz;

    # Отдаём файлы для SSL-проверки (ACME challenge)
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Всё остальное — редиректим на HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# Блок 2: HTTPS (порт 443)
server {
    listen 443 ssl;
    server_name olegaccy.xyz www.olegaccy.xyz;

    ssl_certificate /etc/letsencrypt/live/olegaccy.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/olegaccy.xyz/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Запросы на /clearance → проксируем в clearance-frontend
    location /clearance {
        proxy_pass http://clearance-frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        ...
    }

    # Запросы на /rest/ → тоже в clearance-frontend (он внутри проксирует к backend)
    location /rest/ {
        proxy_pass http://clearance-frontend;
        ...
    }

    # Всё остальное → 404
    location / {
        return 404;
    }
}
```

### Внутренний nginx clearance-frontend

Контейнер `clearance-frontend` сам тоже nginx, но без SSL:

```nginx
server {
    listen 80;

    # Отдаёт React-приложение по пути /clearance/
    location /clearance/ {
        alias /usr/share/nginx/html/;
        try_files $uri $uri/ /clearance/index.html;
    }

    # Проксирует API-запросы к Spring Boot backend
    location /rest/ {
        proxy_pass http://backend:8080;
        ...
    }
}
```

---

## Как работает Docker-сеть

В проекте две Docker-сети:

```
Сеть "web" (external — создана вручную)
├── nginx-proxy (nginx-контейнер)
└── clearance-frontend

Сеть "app" (internal — создаётся docker compose автоматически)
├── clearance-frontend
└── clearance-backend
```

**Почему две сети?**
- `web` — для связи nginx-прокси с приложениями. Все будущие приложения тоже подключатся сюда.
- `app` — изолированная сеть внутри clearance-приложения. Backend недоступен снаружи, только frontend может к нему обращаться.

**Почему `web` создаётся вручную?**
Потому что она `external: true` — она должна существовать до запуска любого из проектов. Docker Compose не создаёт внешние сети автоматически, чтобы не удалить их случайно при `docker compose down`.

```bash
# Создаётся один раз на сервере:
docker network create web
```

---

## Зачем контейнер для статического файла

Браузер не может просто взять файл с диска сервера. Ему нужен кто-то, кто:
1. Слушает входящий запрос
2. Читает файл с диска
3. Отдаёт его в ответ

Это и делает nginx внутри контейнера. Без него файл просто лежит на диске.

В `nginx-proxy/nginx.conf` написано:
```nginx
location /hello {
    proxy_pass http://my-landing;  ← должен быть кто-то, кто отвечает
}
```
`http://my-landing` — это Docker-контейнер. Если его нет, nginx вернёт браузеру 502.

---

## Структура файлов

```
/projects/
  custom-clearance-application/
    docker-compose.yml              ← запускает backend + frontend (без SSL, без портов)
    nginx-proxy/
      docker-compose.yml            ← запускает nginx + certbot (SSL, порты 80/443)
      nginx.conf                    ← правила роутинга для всего домена
      init-letsencrypt.sh           ← скрипт первоначальной выдачи сертификата
      certbot/                      ← создаётся автоматически
        conf/                       ← сертификаты Let's Encrypt
        www/                        ← временные файлы ACME-challenge
    cutom-clearance-frontend/
      nginx.conf                    ← внутренний nginx (без SSL)
      vite.config.js                ← base: '/clearance/' для React
      Dockerfile
      src/
    custom-clearance-backend/
      ...
```

---

## Добавление нового проекта на /hello

Допустим, есть папка `/projects/hello/` с одним файлом `index.html`.

### Шаг 1 — Создать `nginx.conf`

```nginx
server {
    listen 80;

    location /hello/ {
        alias /usr/share/nginx/html/;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location = /hello {
        return 301 /hello/;
    }
}
```

### Шаг 2 — Создать `docker-compose.yml`

```yaml
version: '3.8'

services:
  my-landing:
    image: nginx:alpine
    container_name: my-landing        # ← имя, по которому nginx-proxy найдёт контейнер
    restart: unless-stopped
    volumes:
      - ./index.html:/usr/share/nginx/html/index.html:ro
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    networks:
      - web                           # ← подключаем к общей сети

networks:
  web:
    external: true
```

### Шаг 3 — Добавить маршрут в nginx-proxy

В файле `nginx-proxy/nginx.conf` добавить новый `location` в HTTPS-блок до строки `location / { return 404; }`:

```nginx
location /hello {
    proxy_pass http://my-landing;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### Шаг 4 — Запустить и применить

```bash
# Запустить новый проект
cd /projects/hello
docker compose up -d

# Перезагрузить nginx-прокси (без остановки!)
cd /projects/custom-clearance-application/nginx-proxy
docker compose exec nginx nginx -s reload
```

Готово — `https://olegaccy.xyz/hello/` открывает `index.html`.

---

## Восстановление после перезапуска сервера

Контейнеры с `restart: unless-stopped` поднимаются автоматически после ребута. Но если что-то пошло не так:

```bash
# Создать сеть (если не существует)
docker network create web

# Запустить clearance-приложение
cd /projects/custom-clearance-application
docker compose up -d

# Запустить nginx-прокси
cd nginx-proxy
docker compose up -d

# Если SSL-сертификаты слетели — перевыпустить
./init-letsencrypt.sh
```

---

## Полезные команды

```bash
# Посмотреть все запущенные контейнеры
docker ps

# Логи nginx-прокси
cd /projects/custom-clearance-application/nginx-proxy
docker compose logs -f nginx

# Логи clearance-приложения
cd /projects/custom-clearance-application
docker compose logs -f frontend
docker compose logs -f backend

# Перезагрузить nginx без остановки (после изменения nginx.conf)
docker compose exec nginx nginx -s reload

# Проверить конфиг nginx на ошибки
docker compose exec nginx nginx -t

# Остановить всё
docker compose down

# Пересобрать и запустить
docker compose up --build -d

# Посмотреть Docker-сети
docker network ls

# Посмотреть, какие контейнеры в сети web
docker network inspect web
```

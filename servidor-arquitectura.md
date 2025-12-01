# 📄 Documento de Arquitectura y Gestión de Servicios del Servidor  
### *Versión estable — noviembre 2025*  
### *Autor: Juan — Preparado para uso futuro por ChatGPT*

---

## 📌 1. Visión general de la infraestructura

Tu servidor contiene **tres bloques principales**:

---

### 🟦 **1. Infraestructura Web General (Astro + Nginx Reverse Proxy)**

- **Contenedor `web` (nginx-bidedigitala)**  
  - Expone **80/443** al exterior.  
  - Gestiona:
    - `bidedigitala.eus`  
    - `www.bidedigitala.eus`  
    - `izkilimine.eus`  
    - `www.izkilimine.eus`  
    - `mail.bidedigitala.eus` (tráfico web, no SMTP)

- Funciones:
  - Reverse proxy para Astro → `app:8080`
  - Reverse proxy hacia mailcow → `nginx-mailcow:8080`
  - Manejo de certificados para webs normales
  - Excepción ACME para mailcow

- Volúmenes clave:
  ```bash
  ./dist:/usr/share/nginx/html:ro
  ./webroot:/var/www/certbot
  ./certs:/etc/letsencrypt
  ./nginx.ssl.conf:/etc/nginx/conf.d/default.conf
  ```

---

### 🟧 **2. Mailcow (Servidor de correo completo)**

- Servicios en contenedores:  
  `postfix`, `dovecot`, `rspamd`, `nginx-mailcow`, `mysql`, `acme-mailcow`, etc.

- Certificados gestionados por **acme-mailcow** en:
  ```bash
  /srv/posta/data/assets/ssl/mail.bidedigitala.eus/
  ```

- El contenedor `nginx-mailcow` escucha en:
  ```bash
  HTTP 8080  
  HTTPS 8443
  ```

- El proxy externo (`web`) le pasa el tráfico:
  ```bash
  mail.bidedigitala.eus → nginx-mailcow:8080
  ```

---

### 🟩 **3. Otros servicios actuales / futuros**

Actualmente hay:
- WordPress `izkilimine-wp`  
- Astro `app:8080`

Y se prevé añadir:
- Moodle (futuro)
- n8n (ya previsto)
- VPN Wireguard/OpenVPN (en la segunda VPS)

---

## 📌 2. Certificados SSL: quién gestiona qué

### 🔹 Certificados gestionados por **Nginx (contenedor web)**

Se guardan en:
```bash
/srv/bidedigitala/certs/
```

Usados por:
- `bidedigitala.eus`
- `www.bidedigitala.eus`
- `izkilimine.eus`
- `www.izkilimine.eus`

### 🔹 Certificados gestionados por **mailcow (acme-mailcow)**

Se guardan en:
```bash
/srv/posta/data/assets/ssl/mail.bidedigitala.eus/
```

Usados por:
- `mail.bidedigitala.eus`
- `autoconfig.bidedigitala.eus`
- `autodiscover.bidedigitala.eus`

### 🔹 Reglas importantes

- **El contenedor `web` no debe usar los certificados de mailcow.**
- Mailcow **no debe usar** los certificados de `/etc/letsencrypt/live/`.

---

## 📌 3. Renovación de certificados

### 🟦 **1. Renovar certificados de webs normales (`web`)**

Certbot está montado en la carpeta:
```bash
./webroot:/var/www/certbot
./certs:/etc/letsencrypt
```

Para renovar manualmente:

```bash
docker compose exec web certbot renew --webroot -w /var/www/certbot
docker compose exec web nginx -s reload
```

Para probar sin renovaciones reales:

```bash
docker compose exec web certbot renew --dry-run
```

---

### 🟧 **2. Renovar certificados de mailcow**

Lo maneja automáticamente **acme-mailcow**.

Para dispararlo manualmente:

```bash
docker exec -it mailcowdockerized-acme-mailcow-1 supervisorctl restart acme-mailcow
```

Comprobar logs:

```bash
docker logs --tail 100 mailcowdockerized-acme-mailcow-1
```

Ver el certificado actual:

```bash
openssl x509 -in /srv/posta/data/assets/ssl/mail.bidedigitala.eus/cert.pem \
    -noout -subject -dates
```

---

## 📌 4. Flujo del tráfico entre servicios

### 🔷 mail.bidedigitala.eus

```text
Cliente --> 443 --> nginx (web) --> proxy_pass -> nginx-mailcow:8080 -> mailcow UI
```

### 🔷 bidedigitala.eus (Astro)

```text
Cliente --> 443 --> nginx (web) --> proxy_pass -> app:8080
```

### 🔷 izkilimine.eus (WordPress)

```text
Cliente --> 443 --> nginx (web) --> proxy_pass -> izkilimine-wp:80
```

### 🔷 Certificados y validación

- Reto HTTP (`/.well-known/acme-challenge/`)  
  - Para mailcow → proxy a `nginx-mailcow:8080`  
  - Para webs normales → `/var/www/certbot`

---

## 📌 5. Cómo escalar el servidor sin romper lo existente

Aquí tienes **el estándar oficial que debes seguir en futuras ampliaciones**.

---

### ✨ 5.1. Si vas a añadir un nuevo servicio (ej. Moodle)

1. **Crear contenedor con nombre estable**, p.ej.:
   ```yaml
   moodle: 
     image: ...
     networks:
       - default
       - frontend
   ```
   > Evitar exponer puertos al host si va detrás de Nginx.

2. Integrarlo en la red de nginx (`frontend`).

3. Crear un archivo de configuración nginx:
   ```bash
   nginx.moodle.conf → /etc/nginx/conf.d/
   ```

4. Ruta ACME:
   ```nginx
   location ^~ /.well-known/acme-challenge/ {
     root /var/www/certbot;
     try_files $uri =404;
   }
   ```

5. Crear vhost SSL:
   ```nginx
   server_name moodle.midominio.eus;
   ssl_certificate /etc/letsencrypt/live/moodle.midominio.eus/fullchain.pem;
   ssl_certificate_key /etc/letsencrypt/live/moodle.midominio.eus/privkey.pem;
   ```

6. Generar certificado:
   ```bash
   docker compose exec web certbot certonly \
     --webroot -w /var/www/certbot \
     -d moodle.midominio.eus
   ```

7. Recargar nginx:
   ```bash
   docker compose exec web nginx -s reload
   ```

---

### ✨ 5.2. Si vas a añadir un servicio que usa su propio sistema de SSL (como mailcow)

Regla básica:

> **No mezclar certificados. El proxy frontal solo debe reenviar tráfico.**

- Se crea un proxy `http://servicio:puerto_interno`:
  ```nginx
  location / {
    proxy_pass http://nombre-servicio:PUERTO;
    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
  ```

- No se usan rutas `/etc/letsencrypt/live` dentro de otros contenedores.

---

## 📌 6. Copias de seguridad

### Web (Astro + WordPress)

Rutas a guardar:
```bash
/srv/bidedigitala/dist
/srv/bidedigitala/certs
/srv/bidedigitala/nginx.ssl.conf
/srv/bidedigitala/nginx.izkilimine.conf
/srv/bidedigitala/docker-compose.yml
```

### Mailcow

Rutas a guardar:
```bash
/srv/posta/data/
```

---

## 📌 7. Comandos de gestión rápidos

### Estado de contenedores

```bash
docker ps
docker compose ps
```

### Reiniciar servicios

```bash
docker compose restart web
docker compose restart app
docker compose restart izkilimine-wp
docker compose restart mailcowdockerized-nginx-mailcow-1
```

### Probar nginx en el contenedor `web`

```bash
docker compose exec web nginx -t
docker compose exec web nginx -s reload
```

### Probar acceso ACME mailcow desde `web`

```bash
docker compose exec web curl -I http://nginx-mailcow:8080/.well-known/acme-challenge/test
```

---

## 📌 8. Resumen mental para el futuro

- **Proxy frontal Nginx (`web`)**  
  - Gestiona casi todos los certificados con Certbot.  
  - Sólo **reenvía** los retos ACME para mailcow a `nginx-mailcow`.

- **Mailcow**  
  - Tiene su propia carpeta de certificados en `/srv/posta/data/assets/ssl/...`.  
  - Se renueva solo vía `acme-mailcow`.

- **Regla de oro al escalar**  
  - Todo lo nuevo va detrás de `web`.  
  - Cada FQDN tiene:
    - un bloque `server { listen 80; ... }` con ACME,
    - y otro `server { listen 443 ssl; ... }` con proxy_pass al contenedor correspondiente.


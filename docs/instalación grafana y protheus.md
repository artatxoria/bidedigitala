📘 Documentación de Implementación: Monitorización con Prometheus y GrafanaFecha: Diciembre 2025Objetivo: Implementar un sistema de monitorización robusto para el servidor VPS Bidedigitala, visualizando métricas de CPU, RAM y disco a través de una interfaz web segura.1. Arquitectura de la SoluciónEl sistema se basa en tres componentes principales desplegados mediante Docker, integrados en la infraestructura existente de Nginx Inverso.ComponentesServicioRolPuerto InternoAcceso ExternoNode ExporterRecolector de métricas del host (CPU, RAM, Disco).9100No expuestoPrometheusBase de datos de series temporales que almacena las métricas.9090No expuesto (Solo interno)GrafanaInterfaz de visualización y dashboards.3000https://monitor.bidedigitala.eusIntegración de RedRed Interna (monitor-net): Permite la comunicación privada entre Prometheus, Grafana y Node Exporter.Red Externa (frontend): Conecta el contenedor de Grafana con el Nginx Inverso principal (nginx-bidedigitala) para permitir el acceso web seguro.2. Despliegue de Contenedores2.1. Estructura de DirectoriosSe creó la estructura en /srv/monitor/ con permisos específicos para garantizar la persistencia de datos y la seguridad.Bash/srv/monitor/
├── docker-compose.yml
├── prometheus/
│   ├── prometheus.yml
│   └── data/ (Propiedad: usuario interno Prometheus, UID 65534)
└── grafana/
    └── data/ (Propiedad: usuario interno Grafana, UID 472)
2.2. Archivo docker-compose.ymlUbicación: /srv/monitor/docker-compose.ymlYAMLnetworks:
  monitor-net:
    driver: bridge
  frontend:
    external: true

services:
  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    user: root
    restart: unless-stopped
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
      - '--path.rootfs=/rootfs'
      - '--web.listen-address=:9100'
    networks:
      - monitor-net

  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    restart: unless-stopped
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - ./prometheus/data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.listen-address=:9090'
    networks:
      - monitor-net

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    restart: unless-stopped
    volumes:
      - ./grafana/data:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=PASSWORD_SECRETA_CAMBIAME
    expose:
      - 3000
    networks:
      - monitor-net
      - frontend
2.3. Configuración de Prometheus (prometheus.yml)Ubicación: /srv/monitor/prometheus/prometheus.ymlPermisos: 644 (Lectura para todos) para que el contenedor pueda leerlo.YAMLglobal:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
3. Configuración del Nginx Inverso (SSL y Proxy)El Nginx principal (/srv/bidedigitala/) actúa como terminador SSL y proxy inverso hacia Grafana.3.1. Archivo nginx.monitor.confUbicación: /srv/bidedigitala/nginx.monitor.confConfiguración crítica para manejar correctamente los desafíos ACME de Let's Encrypt y redirigir el tráfico.Nginxserver {
    listen 80;
    listen [::]:80;
    server_name monitor.bidedigitala.eus;

    # Bloque crítico para Certbot
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
        try_files $uri =404;
    }

    # Redirección a HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name monitor.bidedigitala.eus;

    ssl_certificate /etc/letsencrypt/live/monitor.bidedigitala.eus/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/monitor.bidedigitala.eus/privkey.pem;

    include /etc/nginx/snippets/ssl-params.conf; # Opcional, si existe

    location / {
        proxy_pass http://grafana:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
3.2. Integración en docker-compose.yml de NginxSe añadió el volumen correspondiente en /srv/bidedigitala/docker-compose.yml:YAMLservices:
  web:
    volumes:
      - ./nginx.monitor.conf:/etc/nginx/conf.d/nginx.monitor.conf:ro
4. Obtención de Certificados SSLSe utilizó un contenedor efímero de Certbot para generar los certificados, solucionando problemas de permisos y rutas durante el proceso.Comando final exitoso:Bashsudo docker run --rm \
  -v /srv/bidedigitala/certs:/etc/letsencrypt \
  -v /srv/bidedigitala/webroot:/var/www/certbot \
  certbot/certbot \
  certonly --webroot -w /var/www/certbot -d monitor.bidedigitala.eus
Una vez generado, se recargó Nginx:Bashdocker compose exec web nginx -s reload
5. Configuración Final en GrafanaAcceso web: https://monitor.bidedigitala.eus5.1. Fuente de Datos (Data Source)Tipo: PrometheusURL: http://prometheus:9090 (Nombre de servicio interno de Docker)Autenticación: Sin autenticación (No Auth), TLS desactivado.Scrape Interval: 15s5.2. DashboardID de Importación: 1860 (Node Exporter Full)Fuente: Prometheus Bidedigitala6. Resolución de Problemas Clave (Troubleshooting)Durante la instalación se resolvieron los siguientes puntos críticos:Permisos de Volúmenes:Los directorios de datos (data/) requieren propiedad específica: 472:472 para Grafana y 65534:65534 para Prometheus.El archivo de configuración prometheus.yml requiere permisos 644 para ser legible por el contenedor.Error "Is a directory":Docker montaba prometheus.yml como directorio porque el archivo no existía en el host al momento del despliegue. Solución: Crear el archivo explícitamente antes de levantar el contenedor.Error ACME/Certbot (404/Connection Refused):Causa: Configuración incorrecta en el bloque location del puerto 80 en Nginx (uso de alias incorrecto o comillas en try_files).Solución: Usar la sintaxis estándar root /var/www/certbot; try_files $uri =404;.Se aseguró que el volumen ./webroot:/var/www/certbot no fuera de solo lectura (:ro) durante la validación inicial.Estado Final: El sistema de monitorización está completamente operativo, seguro bajo HTTPS y recolectando métricas del servidor en tiempo real.

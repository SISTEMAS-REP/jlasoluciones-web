
# ================================
# REDIRECCIÓN HTTP → HTTPS + WWW
# ================================
server {
    listen 80;
    server_name jlasoluciones.com www.jlasoluciones.com;
    return 301 https://www.jlasoluciones.com$request_uri  ;

}

# ================================
# REDIRECCIÓN HTTPS SIN WWW → WWW
# ================================
server {
    listen 443 ssl;
    server_name jlasoluciones.com;

    ssl_certificate /etc/letsencrypt/live/jlasoluciones.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jlasoluciones.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    return 301 https://www.jlasoluciones.com$request_uri;
}

# ================================
# SERVIDOR PRINCIPAL (WWW)
# ================================
server {
    listen 443 ssl;
    server_name www.jlasoluciones.com;
	
    #Ubicacion del certificado SSL (Let's encrypt)
    ssl_certificate /etc/letsencrypt/live/jlasoluciones.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/jlasoluciones.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
    

    #Configuracion del sitio web
    root /var/www/jlasoluciones.com/html;
    index index.php index.html index.htm;

    #Manejar solicitudes del directorio raiz
    location / {
	try_files $uri $uri/ =404;
    }

    #Manejo de archivos PHP
    location ~ \.php$ {
	include snippets/fastcgi-php.conf;
	fastcgi_pass unix:/run/php/php8.3-fpm.sock;
	fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
	include fastcgi_params;

	}

    #Seccion para manejar la transmision HLS
    location /hls/ {
	root /var/www;
	types {
		application/vnd.apple.mpegurl  m3u8;
		video/mp2t ts;
	}
	add_header Cache-Control no-cache;
    }
 
    # Proteger archivos ocultos y sensibles (.htaccess, .env, etc.)
    location ~ /\.ht {
        deny all;
    }

}


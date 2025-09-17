FROM node:16 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:prod --force

FROM nginx:stable

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN apt-get update && apt-get install -y openssl jq && rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["sh", "-c", " \
    PASSWORD=$(jq -r '.ssl.certificatePassword' /etc/compose/config.json) && \
    openssl pkcs12 -in /etc/compose/keystore.p12 -nokeys -out /etc/ssl/certs/fullchain.pem -passin pass:$PASSWORD && \
    openssl pkcs12 -in /etc/compose/keystore.p12 -nocerts -nodes -out /etc/ssl/certs/privkey.pem -passin pass:$PASSWORD && \
    nginx -g 'daemon off;'"]

EXPOSE 80
FROM node:16 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build --force

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN apk update && \
    apk add --no-cache jq openssl

ENTRYPOINT ["sh", "-c", " \
    PASSWORD=$(jq -r '.ssl.certificatePassword' /etc/compose/config.json) && \
    openssl pkcs12 -in /etc/compose/keystore.p12 -nokeys -out /etc/ssl/certs/fullchain.pem -passin pass:$PASSWORD && \
    openssl pkcs12 -in /etc/compose/keystore.p12 -nocerts -nodes -out /etc/ssl/certs/privkey.pem -passin pass:$PASSWORD && \
    nginx -g 'daemon off;'"]

EXPOSE 80
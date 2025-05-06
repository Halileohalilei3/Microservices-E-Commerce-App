FROM node:18-alpine

WORKDIR /app

# Önce package.json ve package-lock.json dosyalarını kopyala
COPY order-service/package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Geri kalan dosyaları kopyala
COPY order-service/ .

# Uygulama portunu belirt
EXPOSE 4004

# Uygulamayı başlat
CMD ["npm", "start"]
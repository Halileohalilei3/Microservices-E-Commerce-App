FROM node:18-alpine

WORKDIR /app

# Önce package.json ve package-lock.json dosyalarını kopyala
COPY user-service/package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Geri kalan dosyaları kopyala
COPY user-service/ .

# RSA anahtar çiftini oluşturmak için gerekli dizini oluştur
RUN mkdir -p src/api/secrets

# Anahtar çiftini oluştur
RUN node src/api/scripts/generate-keys.js

# Uygulama portunu belirt
EXPOSE 4001

# Uygulamayı başlat
CMD ["npm", "start"]
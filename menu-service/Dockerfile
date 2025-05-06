FROM node:18-alpine

WORKDIR /app

# Önce package.json ve package-lock.json dosyalarını kopyala
COPY menu-service/package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Geri kalan dosyaları kopyala
COPY menu-service/ .

# Uygulama portunu belirt
EXPOSE 4003

# Uygulamayı başlat
CMD ["npm", "start"]
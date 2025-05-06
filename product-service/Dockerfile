FROM node:18-alpine

WORKDIR /app

# Önce package.json ve package-lock.json dosyalarını kopyala
COPY product-service/package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Geri kalan dosyaları kopyala
COPY product-service/ .

# Uygulama portunu belirt
EXPOSE 4002

# Uygulamayı başlat
CMD ["npm", "start"]
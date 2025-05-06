FROM node:18-alpine

WORKDIR /app

COPY user-service/package*.json ./
RUN npm install
COPY user-service/ .

# Düzeltilmiş dizin oluşturma
RUN mkdir -p src/api/secrets

# Script'i düzenleyin veya doğru yolu oluşturun
RUN sed -i 's|../secrets/|./src/api/secrets/|g' src/api/scripts/generate-keys.js

# Şimdi script'i çalıştırın
RUN node src/api/scripts/generate-keys.js

EXPOSE 3000

CMD ["npm", "start"]
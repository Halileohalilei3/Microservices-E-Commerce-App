// Docker ortamında çalışırken kullanılacak servis URL'leri
const serviceUrls = {
    userService: 'http://user-service:4001',
    productService: 'http://product-service:4002',
    menuService: 'http://menu-service:4003',
    orderService: 'http://order-service:4004'
  };
  
  // Yerel geliştirme ortamında kullanılacak servis URL'leri
  const localServiceUrls = {
    userService: 'http://localhost:4001',
    productService: 'http://localhost:4002',
    menuService: 'http://localhost:4003',
    orderService: 'http://localhost:4004'
  };
  
  // Ortam değişkenine göre doğru URL setini kullan
  const urls = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development' 
    ? serviceUrls 
    : localServiceUrls;
  
  module.exports = urls;
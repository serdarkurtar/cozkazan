module.exports = {
  apps: [
    {
      name: 'coz-kazan-api',
      script: 'index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'ai-egitim-sistemi',
      script: 'ai-egitim.js',
      args: '--surekli',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      // Sistem boşta olduğunda çalışacak şekilde ayarla
      cron_restart: '0 */2 * * *', // Her 2 saatte bir kontrol et
      min_uptime: '10s',
      max_restarts: 10
    }
  ]
}; 
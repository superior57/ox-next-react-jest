const path = require('path')
const { i18n } = require('./next-i18next.config')

module.exports = {
  i18n,
  future: {
    webpack5: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@emotion/react': path.resolve('./node_modules/@emotion/react'),
      '@emotion/styled': path.resolve('./node_modules/@emotion/styled'),
    }

    return config
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/units',
        permanent: false,
      },
    ]
  },
}

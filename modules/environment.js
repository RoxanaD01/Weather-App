const environments = {
  development: {
    API_KEY: '10e361a8ce75897632ff7a4f717f025d',
    DEBUG: true,
    CACHE_TTL: 1000, 
    ENABLE_LOGGING: true,
  },

  production: {
    API_KEY: '10e361a8ce75897632ff7a4f717f025d',
    DEBUG: false,
    CACHE_TTL: 600000, 
    ENABLE_LOGGING: false,
  },
}

/**
* Detect current environment based on hostname
* @type {'development' | 'production'}
*/
const currentEnv = window.location.hostname.includes('github.io')
  ? 'production'
  : 'development'

export const ENV_CONFIG = environments[currentEnv]
export const environment = {
    production: false,
    api: {
        genericApiSpringBoot: {
            apiUrl: 'http://localhost:3000/api',
            version: 'v1',
            timeout: 30000,
            retryAttempts: 2
        }
    },
    features:{
    analytics: true,
    payments: true,
    advancedReporting: false
     }
};
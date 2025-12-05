export default ({ env }) => ({
    'users-permissions': {
        config: {
            jwtSecret: env('JWT_SECRET'),
        },
    },
    upload: {
        config: {
            provider: '@strapi-community/strapi-provider-upload-google-cloud-storage',
            providerOptions: {
                serviceAccount: env.json('GCS_SERVICE_ACCOUNT'),
                bucketName: env('GCS_BUCKET_NAME'),
                basePath: env('GCS_BASE_PATH', 'locals-cms'),
                baseUrl: env('GCS_BASE_URL'),
                publicFiles: env.bool('GCS_PUBLIC_FILES', true),
                uniform: env.bool('GCS_UNIFORM', false),
                skipBucketCheck: true,
            },
        },
    },
});

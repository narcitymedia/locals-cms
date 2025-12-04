export default ({ env }) => ({
    'users-permissions': {
        config: {
            jwtSecret: env('JWT_SECRET'),
        },
    },
    upload: {
        config: {
            provider: 'aws-s3',
            providerOptions: {
                baseUrl: `${env('PUBLIC_URL', 'http://localhost:1337')}/api/media-proxy`,
                s3Options: {
                    credentials: {
                        accessKeyId: env('AWS_ACCESS_KEY_ID'),
                        secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
                    },
                    endpoint: env('AWS_ENDPOINT'),
                    region: env('AWS_REGION'),
                    params: {
                        Bucket: env('AWS_BUCKET'),
                    },
                    forcePathStyle: true,
                },
            },
            actionOptions: {
                upload: {},
                uploadStream: {},
                delete: {},
            },
        },
    },
});

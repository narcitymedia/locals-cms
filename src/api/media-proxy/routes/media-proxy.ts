export default {
    routes: [
        {
            method: 'GET',
            path: '/media-proxy/:filename',
            handler: 'media-proxy.proxy',
            config: {
                auth: false,
                policies: [],
            },
        },
    ],
};

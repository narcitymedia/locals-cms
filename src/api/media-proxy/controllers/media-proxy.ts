import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import type { Readable } from 'stream';

const s3Client = new S3Client({
    endpoint: process.env.AWS_ENDPOINT,
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
    forcePathStyle: true,
});

const MIME_TYPES: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

function getMimeType(filename: string): string {
    const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
    return MIME_TYPES[ext] || 'application/octet-stream';
}

export default {
    async proxy(ctx) {
        const filePath = ctx.params.filename;

        if (!filePath) {
            ctx.status = 400;
            ctx.body = { error: 'File path is required' };
            return;
        }

        try {
            const command = new GetObjectCommand({
                Bucket: process.env.AWS_BUCKET,
                Key: filePath,
            });

            const response = await s3Client.send(command);

            ctx.set('Content-Type', response.ContentType || getMimeType(filePath));
            ctx.set('Cache-Control', 'public, max-age=31536000');

            if (response.ContentLength) {
                ctx.set('Content-Length', response.ContentLength.toString());
            }

            ctx.status = 200;
            ctx.body = response.Body as Readable;
        } catch (error: any) {
            if (error.name === 'NoSuchKey') {
                ctx.status = 404;
                ctx.body = { error: 'File not found' };
            } else {
                console.error('Media proxy error:', error);
                ctx.status = 500;
                ctx.body = { error: 'Failed to fetch file' };
            }
        }
    },
};

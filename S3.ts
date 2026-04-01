import AWS from "aws-sdk"
import dotenv from "dotenv";
dotenv.config();

const s3 = new AWS.S3({ region: process.env.AWS_REGION });

export const uploadObject = async (event: any) => {
    try {
        const { bucketName, key, body, contentType } = JSON.parse(event.body);
        const params = {
            Bucket: bucketName,
            Key: key,
            Body: Buffer.from(body, 'base64'), // Assuming body is base64 encoded
            ContentType: contentType || 'application/octet-stream',
        };

        const result = await s3.upload(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Object uploaded successfully",
                data: result,
            }),
        };
    } catch (error) {
        console.error("Error uploading object:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: (error as Error).message }),
        };
    }
};

export const getObject = async (event: any) => {
    try {
        const { bucketName, key } = JSON.parse(event.body);
        const params = {
            Bucket: bucketName,
            Key: key,
        };

        const data = await s3.getObject(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Object retrieved successfully",
                data: {
                    contentType: data.ContentType,
                    body: data.Body?.toString('base64'), // Return as base64
                    lastModified: data.LastModified,
                },
            }),
        };
    } catch (error) {
        console.error("Error getting object:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: (error as Error).message }),
        };
    }
};

export const listObjects = async (event: any) => {
    try {
        const { bucketName, prefix } = JSON.parse(event.body);
        const params = {
            Bucket: bucketName,
            Prefix: prefix || '',
        };

        const data = await s3.listObjectsV2(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Objects listed successfully",
                data: data.Contents || [],
            }),
        };
    } catch (error) {
        console.error("Error listing objects:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: (error as Error).message }),
        };
    }
};

export const deleteObject = async (event: any) => {
    try {
        const { bucketName, key } = JSON.parse(event.body);
        const params = {
            Bucket: bucketName,
            Key: key,
        };

        const result = await s3.deleteObject(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Object deleted successfully",
                data: result,
            }),
        };
    } catch (error) {
        console.error("Error deleting object:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: (error as Error).message }),
        };
    }
};
/**
 * MicroSoftAzureのAPIを叩くモデュール。
 * Created by kokikono on 2017/11/07.
 */
import request from 'request';
import configFile from '../../config.json';

const { baseUrl } = configFile.azureApi;

export const postFaceDetect = (
        imageBinary,
        returnFaceId = true,
        returnFaceLandmarks = false,
        returnFaceAttributes = 'age',
) => {
    let url = `${baseUrl.faceAPI}/detect?returnFaceId=${returnFaceId}&returnFaceLandmarks=${returnFaceLandmarks}`;
    if (returnFaceAttributes !== null) {
        url += `&returnFaceAttributes=${returnFaceAttributes}`;
    }
    const options = {
        url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': `${configFile['api-key'].faceAPI}`,
        },
        body: imageBinary,
    };
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) {
                return reject(error);
            }
            if (response.statusCode !== 200) {
                const responseBody = JSON.parse(body);
                const err = new Error(responseBody.error.message);
                err.statusCode = response.statusCode;
                err.code = responseBody.error.code;
                return reject(err);
            }
            if (response.statusCode === 429) {
                console.log('FaceAP アクセスオーバー');
            }
            return resolve(JSON.parse(body));
        });
    });
};

export const postFaceGroup = (faceIds) => {
    const url = `${baseUrl.faceAPI}/group`;
    const options = {
        url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': `${configFile['api-key'].faceAPI}`,
        },
        body: faceIds,
    };
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) {
                return reject(error);
            }
            if (response.statusCode !== 200) {
                const responseBody = JSON.parse(body);
                const err = new Error(responseBody.error.message);
                err.statusCode = response.statusCode;
                err.code = responseBody.error.code;
                return reject(err);
            }
            if (response.statusCode === 429) {
                console.log('FaceAP アクセスオーバー');
            }
            return resolve(JSON.parse(body));
        });
    });
};

// postFaceDetect(
// fs.createReadStream(path.join(__dirname,
// '/images/2017-11-08:23:55:29-6.jpg')), true, false);
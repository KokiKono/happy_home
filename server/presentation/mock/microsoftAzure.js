/**
 * MicroSoftAzureのAPIを叩くモデュール。
 * Created by kokikono on 2017/11/07.
 */

export const postFaceDetect = () => {
    return new Promise((resolve) => {
        return resolve([
            {
                faceId: 'c5c24a82-6845-4031-9d5d-978df9175426',
                faceRectangle: { top: 226, left: 606, width: 235, height: 235 },
                faceAttributes: { age: 20.1 },
            },
            {
                faceId: '015839fb-fbd9-4f79-ace9-7675fc2f1dd9',
                faceRectangle: { top: 226, left: 606, width: 235, height: 235 },
                faceAttributes: { age: 20.1 },
            },
            {
                faceId: 'fce92aed-d578-4d2e-8114-068f8af4492e',
                faceRectangle: { top: 226, left: 606, width: 235, height: 235 },
                faceAttributes: { age: 20.1 },
            },
            {
                faceId: 'b64d5e15-8257-4af2-b20a-5a750f8940e7',
                faceRectangle: { top: 226, left: 606, width: 235, height: 235 },
                faceAttributes: { age: 20.1 },
            },
            {
                faceId: '65d083d4-9447-47d1-af30-b626144bf0fb',
                faceRectangle: { top: 226, left: 606, width: 235, height: 235 },
                faceAttributes: { age: 20.1 },
            },
            {
                faceId: '30ea1073-cc9e-4652-b1e3-d08fb7b95315',
                faceRectangle: { top: 226, left: 606, width: 235, height: 235 },
                faceAttributes: { age: 20.1 },
            },
            {
                faceId: '55de5929-2fdf-4246-a098-fdd25096c66e',
                faceRectangle: { top: 226, left: 606, width: 235, height: 235 },
                faceAttributes: { age: 20.1 },
            },
        ]);
    });
};

export const postFaceGroup = (faceIds) => {
    return new Promise((resolve) => {
        return resolve({
            groups: [
                [
                    'c5c24a82-6845-4031-9d5d-978df9175426',
                    '015839fb-fbd9-4f79-ace9-7675fc2f1dd9',
                    'fce92aed-d578-4d2e-8114-068f8af4492e',
                    'b64d5e15-8257-4af2-b20a-5a750f8940e7',
                ],
                [
                    '65d083d4-9447-47d1-af30-b626144bf0fb',
                    '30ea1073-cc9e-4652-b1e3-d08fb7b95315',
                    '55de5929-2fdf-4246-a098-fdd25096c66e',
                ],
            ],
            messyGroup: [
                'be386ab3-af91-4104-9e6d-4dae4c9fddb7',
            ],
        });
    });
};

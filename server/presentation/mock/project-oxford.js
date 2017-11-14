/**
 * Created by kokikono on 2017/11/13.
 */

class Emotion {
    constructor() {
        this.analyzeEmotion = this.emotion;
    }
    emotion() {
        return new Promise((resolve) => (
            resolve([
                {
                    faceRectangle: {
                        left: 68,
                        top: 97,
                        width: 64,
                        height: 97,
                    },
                    scores: {
                        anger: 0.00300731952,
                        contempt: 5.14648448E-08,
                        disgust: 9.180124E-06,
                        fear: 0.0001912825,
                        happiness: 0.9875571,
                        neutral: 0.0009861537,
                        sadness: 1.889955E-05,
                        surprise: 0.008229999,
                    },
                },
                {
                    faceRectangle: {
                        top: 226,
                        left: 606,
                        width: 235,
                        height: 235,
                    },
                    scores: {
                        anger: 0.00300731952,
                        contempt: 5.14648448E-08,
                        disgust: 9.180124E-06,
                        fear: 0.0001912825,
                        happiness: 0.9875571,
                        neutral: 0.0009861537,
                        sadness: 1.889955E-05,
                        surprise: 0.008229999,
                    },
                },
            ])
        ));
    }
}

class Face {
    constructor() {
        this.detect = this._detect;
        this.similar = this._similar;
        this.grouping = this._grouping;
    }

    _detect() {
        return new Promise((resolve) => {
            resolve([
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
    }
    _similar() {
        return new Promise((resolve) => {
            resolve([
                {
                    faceId: 'dab5b257-d825-4bd3-ba8d-0e1c351f8039',
                    confidence: 0.9,
                },
                {
                    faceId: '56a1854d-74ff-4772-a156-deb9a9c6d2c9',
                    confidence: 0.8,
                },
                {
                    faceId: '56a1854d-74ff-4772-a156-deb9a9c6d2c9',
                    confidence: 1.0,
                },
            ]);
        });
    }
    _grouping() {
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
    }
}

class Client {
    constructor(key) {
        this.key = key;
        this.emotion = new Emotion();
        this.face = new Face();
    }
}

export default { Client };

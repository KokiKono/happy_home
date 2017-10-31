import sharp from 'sharp';

const imagePath = '../images/';

const detect = (fileName, extracts) => {
    extracts.some((item, index) => {
        sharp(imagePath + fileName)
            .extract({ left: item.left, top: item.top, width: item.width, height: item.height })
            .toFile(`./tmp/${fileName}-index.jpeg`, (err) => {
                // 入力イメージの領域を抽出し、同じ形式で保存します。
                throw err;
            });
    });
    return true;
};

export default detect;

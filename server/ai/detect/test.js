var sharp = require('sharp');
var moment = require('moment');
const imagePath = '../images/';
const fileName = 'test.jpeg';
const timestamp = moment().format('YYYY-MM-D-h:mm:ss a');

sharp(imagePath + fileName)
    .extract({ left: 553, top: 169, width: 169, height: 169 })
    .toFile(`./tmp/${fileName}-${timestamp}.jpeg`, function(err){
        // 入力イメージの領域を抽出し、同じ形式で保存します。
        console.log(err);
    });
//
// module.exports = function detect(imagePath, fileName, extracts) {
//     extracts.some(function(itme){
//        sharp(imagePath.fileName)
//            .extract({ left: item.left, top: item.top, width: item.})
//     });
// }
/**
 * シーン再選択、終了選択に関するmock関数
 * Created by kokikono on 2017/11/07.
 */
const animation = () => { // eslint-disable-line
    return new Promise((resolve) => {
        setTimeout(() => { // eslint-disable-line
            return resolve({ msg: 'success', isEnd: Math.random() >= 0.5 });
        }, 1000);
    });
};

export default animation;

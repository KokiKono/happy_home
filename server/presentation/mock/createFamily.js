/**
 * 家族構成用のmock関数
 * Created by kokikono on 2017/11/07.
 */
const createFamily = () => { // eslint-disable-line
    return new Promise((resolve) => {
        setTimeout(() => { // eslint-disable-line
            return resolve('success');
        }, 1000);
    });
};

export default createFamily;
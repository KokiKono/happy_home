/**
 * 提案に関するmock関数
 * Created by kokikono on 2017/11/07.
 */
import LedModel, * as LedModelConst from '../../models/led'; // eslint-disable-line
const suggestion = () => { // eslint-disable-line
    return new Promise((resolve) => {
        const led = new LedModel(2);
        led.on();
        led.setBrightness(LedModelConst.MAX_BRIGHTNESS);
        led.setPreset(LedModelConst.PRESET_COLOR_GRADATION);
        // setTimeout(() => {
        //     led.pink();
        // }, 5000);
        // led.pink();
        led.close();
        resolve();
    });
};

export default suggestion;

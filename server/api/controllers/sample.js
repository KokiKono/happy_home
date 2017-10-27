/**
 * Created by kokikono on 2017/10/24.
 */
import SampleModel from '../../models/sample';

const select = () => {
    const sampleModel = new SampleModel();
    return sampleModel.select();
};


export default {
    select,
};

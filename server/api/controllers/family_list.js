/**
 * Created by kokikono on 2017/10/29.
 */
import FamilyModel from '../../models/family';

const insertFamily = () => {
    const familyModel = new FamilyModel();
    return familyModel.insertFamily();
};

export default {
    insertFamily,
};

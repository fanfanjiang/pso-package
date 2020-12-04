import FVStore from '../form-view/store';
import API from '../../service/api'

export default class ASTStore extends FVStore {
    constructor(options) {
        super(options);
    }

    async findById(value, bindId = 'leaf_id') {
        const ret = await API.formSearch({ form_code: this.store.data_code, leaf_auth: 4, keys: { [bindId]: { type: 1, value, } } });
        return ret.data[0];
    }
}
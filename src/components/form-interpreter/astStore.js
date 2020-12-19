import FVStore from '../form-view/store';
import API from '../../service/api'

export default class ASTStore extends FVStore {
    constructor(options) {
        super(options);
    }

    async findById(value, bindId = 'leaf_id') {
        if (value) {
            const ret = await API.formSearch({ form_code: this.store.data_code, leaf_auth: 4, keys: { [bindId]: { type: 4, value, } } });
            if (ret.success) {
                //由于查询出的数据不一定是按顺序返回的，会触发值改变的事件，所以只能排个序
                let data = [];
                const valList = value.split(',');
                valList.forEach(v => {
                    const exist = _.find(ret.data, { [bindId]: v });
                    if (exist) {
                        data.push(exist);
                    }
                })
                return data;
            }
        }
        return [];
    }
}
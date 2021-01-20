import FVStore from '../form-view/store';
import API from '../../service/api'

export default class SuperViewStore extends FVStore {
    constructor(options) {
        super(options);
    }

    async initialize(id, usedColumn) {
        await super.initialize(id, usedColumn);
    } 
}
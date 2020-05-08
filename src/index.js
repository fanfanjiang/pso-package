import 'normalize.css/normalize.css';
import 'font-awesome/css/font-awesome.min.css';

import './assets/less/main.less';

import Vuebar from 'vuebar';
import 'muse-ui/lib/styles/base.less';
import 'muse-ui/lib/styles/theme.less';
import { TextField } from 'muse-ui';
import VCharts from 'v-charts';
import Element from 'element-ui';

import BASEAPI from './service/api';
import createPDF from './utils/create-pdf';

//store
import store from './store';

//全局注册
import PsoDrawer from "./components/drawer";
import PsoPickerTag from "./components/picker/pso-picker-tag";
import PsoPickerDept from "./components/picker/pso-picker-dept";
import PsoPickerPosition from "./components/picker/pso-picker-position";
import PsoPickerPost from "./components/picker/pso-picker-post";
import PsoPickerResource from "./components/picker/pso-picker-resource";
import PsoPickerTree from "./components/picker/pso-picker-tree";
import PsoPickerUser from "./components/picker/pso-picker-user";
import PsoTreeCommon from "./components/tree";
import PsoSkeleton from "./components/skeleton";
//全局注册

const install = function (Vue, { API, apiUrl, apiPrefix = '', defaultAppId = '3' }) {

    Vue.component('PsoSkeleton', PsoSkeleton);
    Vue.component('PsoDrawer', PsoDrawer);
    Vue.component('PsoPickerTag', PsoPickerTag);
    Vue.component('PsoPickerDept', PsoPickerDept);
    Vue.component('PsoPickerPosition', PsoPickerPosition);
    Vue.component('PsoPickerPost', PsoPickerPost);
    Vue.component('PsoPickerResource', PsoPickerResource);
    Vue.component('PsoPickerTree', PsoPickerTree);
    Vue.component('PsoPickerUser', PsoPickerUser);
    Vue.component('PsoTreeCommon', PsoTreeCommon);

    Vue.use(Vuebar);
    Vue.use(TextField);
    Vue.use(VCharts);
    Vue.use(Element);

    Vue.prototype.createPDF = createPDF;

    Vue.prototype.APIURL = apiUrl;
    Vue.prototype.API = API || BASEAPI;
    Vue.prototype.API.URL_PREFIX = apiPrefix;

    Vue.prototype.DEFAULT_APP_ID = defaultAppId;
};

export default { install, store, BASEAPI }
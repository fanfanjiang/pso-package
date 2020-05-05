import 'normalize.css/normalize.css';
import 'font-awesome/css/font-awesome.min.css';

import Vuebar from 'vuebar';

import 'muse-ui/lib/styles/base.less';
import 'muse-ui/lib/styles/theme.less';
import { TextField } from 'muse-ui';

import VCharts from 'v-charts';

import Element from 'element-ui';

import API from './service/api';
import createPDF from './utils/create-pdf';

import PsoDrawer from "./components/drawer";
 
const install = function (Vue, { apiUrl, defaultAppId = '3' }) {

    Vue.component('PsoDrawer', PsoDrawer);

    Vue.use(Vuebar);
    Vue.use(TextField);
    Vue.use(VCharts);
    Vue.use(Element);

    Vue.prototype.createPDF = createPDF;

    Vue.prototype.APIURL = apiUrl;
    Vue.prototype.API = API;
    Vue.prototype.DEFAULT_APP_ID = defaultAppId;
};

export default { install }
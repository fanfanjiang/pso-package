import './assets/less/main.less';

import Vuebar from 'vuebar';
import 'muse-ui/lib/styles/base.less';
import 'muse-ui/lib/styles/theme.less';
import { TextField } from 'muse-ui';
import VCharts from 'v-charts';
import Element from 'element-ui';

import BASEAPI from './service/api';
import createPDF from './utils/create-pdf';
import FormStore from './components/form-designer/model/store';
import WfStore from './components/wf-executor/store';

//store
import store from './store';

//组件
import PsoEmpty from "./components/empty";
import PsoSkeleton from "./components/skeleton";
import PsoDrawer from "./components/drawer";
import PsoPickerTag from "./components/picker/pso-picker-tag";
import PsoPickerDept from "./components/picker/pso-picker-dept";
import PsoPickerPosition from "./components/picker/pso-picker-position";
import PsoPickerPost from "./components/picker/pso-picker-post";
import PsoPickerResource from "./components/picker/pso-picker-resource";
import PsoPickerTree from "./components/picker/pso-picker-tree";
import PsoPickerUser from "./components/picker/pso-picker-user";
import PsoTreeCommon from "./components/tree";
import PsoTypebar from "./components/type-bar";
import PsoCountDown from "./components/countdown";

import PsoFormTable from "./components/form-table";
import PsoFormDesigner from "./components/form-designer";
import PsoFormInterpreter from "./components/form-interpreter";
import PsoDataMgt from "./components/data-mgt";

import PsoSriptDesigner from "./components/script-designer";

import PsoWfDesigner from "./components/workflow-designer";
import PsoWfStage from "./components/workflow-designer/stage";
import PsoWfExecutor from "./components/workflow-executor";
import PsoWfExecutor2 from "./components/wf-executor";
import PsoWfMgt from "./components/workflow-mgt";

import PsoElementMgt from "./components/element-mgt";
import PsoTempleteMgt from "./components/templete-mgt";

import PsoViewDesigner from "./components/view-designer";

import PsoScriptOut from "./components/script-designer/output";

import PsoUpload from "./components/upload";

import PsoChartDesigner from "./components/chart-designer";

const components = {
    PsoEmpty,
    PsoSkeleton,
    PsoDrawer,
    PsoPickerTag,
    PsoPickerDept,
    PsoPickerPosition,
    PsoPickerPost,
    PsoPickerResource,
    PsoPickerTree,
    PsoPickerUser,
    PsoTreeCommon,
    PsoFormTable,
    PsoFormDesigner,
    PsoFormInterpreter,
    PsoTypebar,
    PsoSriptDesigner,
    PsoCountDown,
    PsoWfDesigner,
    PsoWfStage,
    PsoWfExecutor,
    PsoWfExecutor2,
    PsoWfMgt,
    PsoElementMgt,
    PsoTempleteMgt,
    PsoDataMgt,
    PsoChartDesigner,
    PsoViewDesigner,
    PsoScriptOut,
    PsoUpload
}

const install = function (Vue, { API, apiUrl, apiPrefix = '', defaultAppId = '3' } = {}) {
    Object.keys(components).map(key => {
        Vue.component(key, components[key]);
    })

    Vue.use(Vuebar);
    Vue.use(TextField);
    Vue.use(VCharts);
    Vue.use(Element);

    Vue.prototype.createPDF = createPDF;
    Vue.prototype.APIURL = apiUrl;

    BASEAPI.URL_PREFIX = apiPrefix;
    if (API && API.handleAuthError) {
        BASEAPI.handleAuthError = API.handleAuthError;
    }

    Vue.prototype.API = API || BASEAPI;
    Vue.prototype.API.URL_PREFIX = apiPrefix;

    Vue.prototype.DEFAULT_APP_ID = defaultAppId;
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export { BASEAPI, store, WfStore, FormStore }

export default {
    install
};

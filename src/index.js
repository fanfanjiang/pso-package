// import 'babel-polyfill';

const formulajs = require("@handsontable/formulajs");
const UAParser = require('../share/util/u-agent');

import debounce from "throttle-debounce/debounce";

import './assets/theme/index.css';

import Vuebar from 'vuebar';
import 'muse-ui/lib/styles/base.less';
import 'muse-ui/lib/styles/theme.less';
import { TextField } from 'muse-ui';
import VCharts from 'v-charts';
import Element from 'element-ui';
import DOMPurify from "dompurify";

import BASEAPI from './service/api';
import createPDF from './utils/create-pdf';
import FormStore from './components/form-designer/model/store';
import WfStore from './components/workflow-executor/store';

//store
import store from './store';

import { genComponentData } from "./components/form-designer/helper";

//组件
import PsoEmpty from "./components/empty";
import PsoSkeleton from "./components/skeleton";
import PsoDrawer from "./components/drawer";
import PsoDialog from "./components/dialog";
import PsoDialogHeader from "./components/dialog/header";

import PsoPickerTag from "./components/picker/pso-picker-tag";
import PsoPickerDept from "./components/picker/pso-picker-dept";
import PsoPickerPosition from "./components/picker/pso-picker-position";
import PsoPickerPost from "./components/picker/pso-picker-post";
import PsoPickerResource from "./components/picker/pso-picker-resource";
import PsoPickerTree from "./components/picker/pso-picker-tree";
import PsoPickerUser from "./components/picker/pso-picker-user";
import PsoPickerIcon from "./components/picker/pso-picker-icon";
import PsoPickerRole from "./components/picker/pso-picker-role";

import PsoTreeCommon from "./components/tree";
import PsoTypebar from "./components/type-bar";
import PsoCountDown from "./components/countdown";
import PsoTitle from "./components/title";
import PsoNodeauth from "./components/node-auth";
import PsoMenuMgt from "./components/menu-mgt";
import PsoTreeDimen from "./components/tree-dimen";
import PsoTagMgt from "./components/tag-mgt";
import PsoKnowlMgt from "./components/knowl";
import PsoDataFilter from "./components/data-filter";
import PsoFileList from "./components/file-list";

//表单组件
import PsoFormView from "./components/form-view";
import PsoSuperView from "./components/super-view";

import PsoFormDesigner from "./components/form-designer";
import PsoFormExecutor from "./components/form-executor";
import PsoFormInterpreter from "./components/form-interpreter";
import PsoCpntAst from "./components/form-interpreter/components/asstable";

import PsoDataMgt from "./components/data-mgt";

import PsoSriptDesigner from "./components/script-designer";

import PsoWfDesigner from "./components/workflow-designer";
import PsoWfStage from "./components/workflow-designer/stage";
import PsoWfExecutor from "./components/workflow-executor";
import PsoWfMgt from "./components/workflow-mgt";
import PsoWfView from "./components/workflow-view";
import PsoWfTodo from "./components/workflow-todo";

import PsoTempleteMgt from "./components/templete-mgt";
import PsoPluginMgt from "./components/plugin-mgt";

import PsoViewDesigner from "./components/view-designer";

import PsoScriptOut from "./components/script-designer/output";

import PsoUpload from "./components/upload";

import PsoChartDesigner from "./components/chart-designer";
import PsoChartInterpreter from "./components/chart-interpreter";
import PsoGridInterpreter from "./components/grid-interpreter";

import PsoPaperInterpreter from "./components/paper-interpreter";
import PsoPaperView from "./components/paper-view";

import PsoTagEditor from "./components/tag-editor";

import PsoSearch from "./components/search";
import PsoAffix from "./components/affix";

import PsoStatistics from "./components/statistics";
import PsoStaScript from "./components/statistics/script";

import PsoAvatar from "./components/avatar";
import PsoApicfg from "./components/apicfg";
import PsoApiauth from "./components/apicfg/api-auth";
import PsoApiType from "./components/apicfg/type";
import PsoApiOuter from "./components/apicfg/outer";
import PsoApiInner from "./components/apicfg/inner";

import PsoPrinterDesigner from "./components/printer-designer";
import PsoPrinter from "./components/printer";

//用户
import PsoUserComposite from "./components/user/composite";
import PsoUserMgt from "./components/user";
import PsoOrgMgt from "./components/user/organization";

import PsoSiteMgt from "./components/site-mgt";

import PsoUserProfile from "./components/user-profile";

//passport
import PsoSignIn from "./components/passport/sign-in.vue";
import PsoSignUp from "./components/passport/sign-up.vue";
import PsoSignSocial from "./components/passport/sign-social.vue";
import PsoAccess from "./components/passport/access.vue";
import PsoAppswitch from "./components/passport/appswitch.vue";
import PsoPassport from "./components/passport/passport-wrapper.vue";
import PsoApproval from "./components/passport/approval.vue";

import PsoSqlDesigner from "./components/sql-designer";

//通知
import PsoNotify from "./components/notify";
import PsoNotifyPopover from "./components/notify/popover";
import PsoNotifyBrain from "./components/notify/brain";

//全文检索
import PsoFtr from "./components/ftr-interpreter";
import PsoFtrMgt from "./components/ftr-mgt";

//数据表管理及同步
import PsoDbtableMgt from "./components/dbtable-mgt";

//定时任务
import PsoScheduleMgt from "./components/schedule-mgt";
import PsoScheduleTrigger from "./components/schedule-trigger";

import PsoDbmodelMgt from "./components/dbmodel-mgt";

import PsoApprovalMgt from "./components/approval-mgt";

import PsoCommonView from "./components/common-view";
import PsoSearchEntry from "./components/search-entry";

//混合视图
import PsoFvAst from "./components/composite/fv-ast";
import PsoFvWv from "./components/composite/fv-wv";
import PsoTagAny from "./components/composite/tag-any";
import PsoFvFv from "./components/composite/fv-fv";
import PsoFtreeFv from "./components/composite/ftree-fv";
import PsoTreeFv from "./components/composite/tree-fv";
import PsoWvAst from "./components/composite/wv-ast";
import PsoWtreeFv from "./components/composite/wtree-fv";
import PsoWtreeWv from "./components/composite/wtree-wv";
import PsoTreeTimeline from "./components/composite/tree-timeline";
import PsoNodeAny from "./components/composite/node-any";
import PsoFvStats from "./components/composite/fv-stats";
import PsoFormEntry from "./components/composite/form";
import PsoFvtree from "./components/composite/fvtree";
import PsoFvSrcv from "./components/composite/fv-srcv";

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
    PsoPickerIcon,
    PsoPickerRole,
    PsoTreeCommon,

    PsoFormView,
    PsoFormExecutor,
    PsoCpntAst,

    PsoFormDesigner,
    PsoFormInterpreter,
    PsoTypebar,
    PsoSriptDesigner,
    PsoCountDown,

    PsoWfDesigner,
    PsoWfStage,
    PsoWfExecutor,
    PsoWfMgt,
    PsoWfView,
    PsoWfTodo,

    PsoTempleteMgt,
    PsoDataMgt,
    PsoChartDesigner,
    PsoChartInterpreter,
    PsoViewDesigner,
    PsoScriptOut,
    PsoUpload,
    PsoTitle,
    PsoNodeauth,
    PsoMenuMgt,
    PsoTreeDimen,
    PsoTagMgt,
    PsoKnowlMgt,
    PsoDataFilter,
    PsoTagEditor,
    PsoDialog,
    PsoDialogHeader,
    PsoFileList,
    PsoSearch,
    PsoAffix,
    PsoStatistics,
    PsoStaScript,
    PsoAvatar,
    PsoApicfg,
    PsoApiauth,
    PsoPluginMgt,
    PsoPrinterDesigner,
    PsoPrinter,

    PsoUserComposite,
    PsoUserMgt,
    PsoOrgMgt,

    PsoSiteMgt,
    PsoGridInterpreter,
    PsoPaperInterpreter,
    PsoPaperView,

    PsoSignIn,
    PsoSignUp,
    PsoSignSocial,
    PsoAccess,
    PsoAppswitch,
    PsoPassport,
    PsoApproval,

    PsoSqlDesigner,
    PsoUserProfile,

    PsoNotify,
    PsoNotifyPopover,
    PsoNotifyBrain,

    PsoFtr,
    PsoFtrMgt,

    PsoDbtableMgt,
    PsoDbmodelMgt,

    PsoScheduleMgt,
    PsoScheduleTrigger,

    PsoSuperView,
    PsoApprovalMgt,
    PsoCommonView,
    PsoApiType,
    PsoApiOuter,
    PsoApiInner,
    PsoSearchEntry,

    //混合视图
    PsoFvAst,
    PsoFvWv,
    PsoTagAny,
    PsoFvFv,
    PsoFtreeFv,
    PsoTreeFv,
    PsoWvAst,
    PsoWtreeFv,
    PsoWtreeWv,
    PsoTreeTimeline,
    PsoNodeAny,
    PsoFvStats,
    PsoFormEntry,
    PsoFvtree,
    PsoFvSrcv
}

const install = function (Vue, { API, apiUrl, apiPrefix = '', defaultAppId = '3', host, xssFilter = false, __CONST__ } = {}) {
    Object.keys(components).map(key => {
        Vue.component(key, components[key]);
    })

    if (window.VueCodemirror) {
        Vue.use(window.VueCodemirror);
    }

    Vue.use(Vuebar);
    Vue.use(TextField);
    Vue.use(VCharts);
    Vue.use(Element);

    Vue.prototype.createPDF = createPDF;
    Vue.prototype.APIURL = apiUrl;
    Vue.prototype.HOST = host;

    BASEAPI.URL_PREFIX = apiPrefix;
    BASEAPI.xssFilter = xssFilter;
    BASEAPI.PSODOMPurify = DOMPurify;
    if (API && API.handleAuthError) {
        BASEAPI.handleAuthError = API.handleAuthError;
    }
    if (API && API.handleUnapprovedError) {
        BASEAPI.handleUnapprovedError = API.handleUnapprovedError;
    }

    Vue.prototype.API = API || BASEAPI;
    Vue.prototype.API.URL_PREFIX = apiPrefix;

    Vue.prototype.DEFAULT_APP_ID = defaultAppId;

    Vue.prototype.ResultNotify = debounce(500, function (ret, message) {
        this.$notify({ title: ret.success ? "成功" : '失败', message: typeof message !== 'undefined' ? message : (ret.message || ret.msg), type: ret.success ? "success" : 'warning' });
    });

    const parser = new UAParser();

    Vue.prototype.PSODOMPurify = DOMPurify;
    Vue.prototype.__device__ = parser.getResult();
    Vue.prototype.__xssFilter__ = xssFilter;
    Vue.prototype.__isMobile__ = Vue.prototype.__device__.device.type === 'mobile';
    Vue.prototype.__CONST__ = __CONST__ || {};
};

// auto install
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

Object.keys(formulajs).forEach(key => {
    window[key] = formulajs[key];
});

const CONST = require('../share/const');
import FormMixin from './mixin/form';
import ViewMixin from './mixin/view';

const Mixin = { FormMixin, ViewMixin };

import Auth from './tool/auth';

const tool = { Auth, genComponentData };

const Store = { WfStore, FormStore };

export { BASEAPI, store, Store, CONST, Mixin, tool };

export default { install };

/* 应用 */
export const APP_SET_USER = 'APP_SET_USER';
export const APP_GET_USER = 'APP_GET_USER';
export const APP_SIGNOUT = 'APP_SIGNOUT';

/* 流程编辑器 */
export const WF_RESET = 'WF_RESET';
export const WF_INIT = 'WF_INIT';
export const WF_SAVE = 'WF_SAVE';
export const WF_NODE_INIT = 'WF_NODE_INIT';
export const WF_NODE_ADD = 'WF_NODE_ADD';
export const WF_BRANCH_ADD = 'WF_BRANCH_ADD';
export const WF_NODE_DEL = 'WF_NODE_DEL';
export const WF_FIND_NODE = 'WF_FIND_NODE';
export const WF_SET_SELECTED = 'WF_SET_SELECTED';
export const WF_NODE_PANEL_SET = 'WF_NODE_PANEL_SET';
export const WF_STAGE_SET = 'WF_STAGE_SET';
export const WF_CONDITION_ADD = 'WF_CONDITION_ADD';
export const WF_CONDITION_DEL = 'WF_CONDITION_DEL';
export const WF_CONDITION_MAKE = 'WF_CONDITION_MAKE';
export const WF_FORM_SELECT = 'WF_FORM_SELECT'; //选择表单后做的初始化
export const WF_NODE_USERS_SET = 'WF_NODE_USERS_SET';

/* 流程执行器 */
export const WFINS_DATA_RESET = 'WFINS_DATA_RESET';
export const WFINS_DATA_GET = 'WFINS_DATA_GET';
export const WFINS_NODE_GET = 'WFINS_NODE_GET';
export const WFINS_NEXTSETP = 'WFINS_NEXTSETP';
export const WFINS_SAVE = 'WFINS_SAVE';
export const WFINS_ADD = 'WFINS_ADD';
export const WFINS_INSTANCE_GET = 'WFINS_INSTANCE_GET';
export const WFINS_INSTANCE_SET = 'WFINS_INSTANCE_SET';

/* 图表设计 */
export const CD_INIT = 'CD_INIT';
export const CD_SOURCE_GET = 'CD_SOURCE_GET';
export const CD_SOURCE_SET = 'CD_SOURCE_SET';
export const CD_DIMENSION_SET = 'CD_DIMENSION_SET';
export const CD_FIGURE_SET = 'CD_FIGURE_SET';
export const CD_FILTER_SET = 'CD_FILTER_SET';

const MUT_TYPES = {
  APP_SET_USER,
  APP_GET_USER,
  APP_SIGNOUT,

  /* 流程编辑器 */
  WF_RESET,
  WF_INIT,
  WF_NODE_INIT,
  WF_NODE_ADD,
  WF_BRANCH_ADD,
  WF_NODE_DEL,
  WF_FIND_NODE,
  WF_SET_SELECTED,
  WF_NODE_PANEL_SET,
  WF_STAGE_SET,
  WF_CONDITION_ADD,
  WF_CONDITION_DEL,
  WF_CONDITION_MAKE,
  WF_SAVE,
  WF_FORM_SELECT,
  WF_NODE_USERS_SET,
  /* 流程编辑器 */

  /* 流程执行器 */
  WFINS_DATA_RESET,
  WFINS_DATA_GET,
  WFINS_NODE_GET,
  WFINS_NEXTSETP,
  WFINS_SAVE,
  WFINS_ADD,
  WFINS_INSTANCE_GET,
  WFINS_INSTANCE_SET,
  /* 流程执行器 */

  /* 图表设计 */
  CD_INIT,
  CD_SOURCE_GET,
  CD_SOURCE_SET,
  CD_DIMENSION_SET,
  CD_FIGURE_SET,
  CD_FILTER_SET,
  /* 图表设计 */
}

export default MUT_TYPES

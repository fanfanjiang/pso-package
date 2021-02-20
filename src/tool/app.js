import API from "../service/api.js";

export async function analyzeMenu({ menu_code, uid, router }) {
    const ret = await API.getMenuInfo({ menu_code });

    if (ret.success && ret.data) {
        const { open_type, menu_link, menu_type, menu_code } = ret.data;
        let path = "";
        if (menu_type == 1) {
            const tpRet = await API.getTreeNode({ code: menu_link });
            if (tpRet.success && tpRet.data.data) {
                path = tpRet.data.data.tp_route.replace(/:menu_code/g, menu_code);
            }
        } else if (menu_type == 2) {
            path = menu_link;
        }

        if (path) {
            path = path.replace(/@uid@/g, uid);

            if (open_type == 2) {
                window.open(path);
            } else if (open_type == 3) {
                router.push({ name: "iframeWrapper", query: { src: path } });
            } else {
                router.push({ path });
            }
        }
    }
}
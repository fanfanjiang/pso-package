import { makeFiles } from "../tool/file";

export const Resource = {
    data() {
        return {
            fileDemanding: false
        };
    },
    methods: {
        async demandFiles(data) {
            let ids = data;
            if (Array.isArray(data)) {
                const idList = [];
                for (let item of data) {
                    idList.push(item.res_id || item.map_key);
                }
                ids = idList.join(",");
            }
            if (ids) {
                this.fileDemanding = true;
                const ret = await this.API.file({ data: { ids }, method: "get" });
                this.fileDemanding = false;
                makeFiles({ files: ret.data, urlField: "res_path", nameField: "res_name" });
                return ret.data;
            }
            return [];
        },
    }
};
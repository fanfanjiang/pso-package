import { makeFiles } from "../tool/file";
import URLparser from "../utils/url";
import shortid from "shortid";

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
                return await this.fetchAndMakeAttach(ids);
            }
            return [];
        },
        async fetchAndMakeAttach(ids, splitSymbol = ',') {
            const dataList = typeof ids === "string" ? ids.split(splitSymbol) : ids;
            const idList = [];
            let data = [];
            for (let item of dataList) {
                if (!item) continue;
                if (!!URLparser.parse("path", item)) {
                    let fileName = URLparser.parse("file", item);
                    const fileext = URLparser.parse("fileext", item);
                    //不能直接获取文件名
                    if (!fileext || ["html", "ashx"].includes(fileext)) {
                        fileName = URLparser.parse("?trueName", item) || "文件";
                    }

                    data.push({ res_path: item, res_id: shortid.generate(), res_name: fileName });
                } else {
                    idList.push(item);
                }
            }
            if (idList.length) {
                this.fileDemanding = true;
                const ret = await this.API.file({ data: { ids: idList.join(",") }, method: "get" });
                data = data.concat(ret.data);
                this.fileDemanding = false;
            }
            makeFiles({ files: data, urlField: "res_path", nameField: "res_name" });
            return data;
        }
    }
};
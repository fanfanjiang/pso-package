import shortid from 'shortid';
const prefix = "/static/app/img/icon";

export function isImages(fileName) {
    return !!/\S+\.(png|PNG|jpg|JPG|jpeg|JPEG|gif|GIF|bmp|BMP)$/.test(fileName);
}

export function getFileIcon(name, url) {
    if (isImages(name)) return url;
    if (/\S+\.(xls|xlsx)$/.test(name)) {
        return `${prefix}/excel.svg`;
    }
    if (/\S+\.(pdf)$/.test(name)) {
        return `${prefix}/pdf.svg`;
    }
    if (/\S+\.(docx|doc)$/.test(name)) {
        return `${prefix}/word.svg`;
    }
    if (/\S+\.(ppt)$/.test(name)) {
        return `${prefix}/ppt.svg`;
    }
    return `${prefix}/file.svg`;
}

export function makeFiles({ files, urlField = "url", nameField = "name" }) {
    for (let file of files) {
        if (!file.fid) file.fid = shortid.generate();
        file.name = file[nameField] || file['filename'];
        file.url = file[urlField];
        file.percentage = 100;
        file.isImg = isImages(file.url);
        file.icon = getFileIcon(file.url, file.url);
        if (file.res_id) file.leaf_id = file.res_id;
        file.style = {
            "background-image": `url(${file.icon})`
        };
        if (file.isImg) {
            file.style["background-size"] = "100% 100%";
        }
    }
    return files;
}
export function isMenu(el) {
    return $(el).attr("id") === "formDesignerMenu";
}

export function isRoot(el) {
    return $(el).attr("fid") === "0";
}

export function getRoot() {
    return $(`[fid=0].dropable`).get(0);
}

export function getDropableByFid(fid) {
    return $(`[fid=${fid}].dropable`).get(0);
}

export function getDragableByFid(fid) {
    return $(`[fid=${fid}].dragable`).get(0);
}

export function setSelectedActor(fid) {
    $(getRoot()).find('.selected').removeClass('selected');
    $(`[fid=${fid}]`).addClass('selected');
}

export function getComponentParams(el) {
    var fid = $(el).attr("fid") || "";
    var componentid = $(el).attr("componentid") || "";
    return { fid, componentid };
}
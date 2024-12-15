"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripEx = StripEx;
function StripEx(ex) {
    return {
        description: ex.description,
        icon: ex.icon,
        sitename: ex.sitename,
        thumbnail: ex.thumbnail,
        medias: ex.medias,
        player: ex.player,
        title: ex.title,
        sensitive: ex.sensitive,
        url: ex.url,
    };
}

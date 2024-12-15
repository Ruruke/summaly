"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = test;
exports.process = process;
// 高速YouTubeプラグイン
const got_1 = require("../utils/got");
const cheerio = require("cheerio");
function test(url) {
    if (url.hostname.match(/^(?:.+[.])?youtube[.]com$/)) {
        if (url.pathname.match(/^[/](?:watch|v|playlist|shorts)/)) {
            return true;
        }
    }
    if (url.hostname.match(/^youtu[.]be$/)) {
        return true;
    }
    return false;
}
function process(url) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        // build oEmbed url
        const u = new URL('https://www.youtube.com/oembed');
        u.searchParams.append('url', url.href);
        // get oEmbed
        const j = yield (0, got_1.getJson)(u.href, 'https://www.youtube.com');
        // parse
        if (j.type !== 'video')
            throw 'invalid type';
        const $ = cheerio.load(j.html);
        const src = $('iframe').attr('src');
        if (!(src === null || src === void 0 ? void 0 : src.match(/^https?:[/][/]/)))
            throw 'invalid src';
        return {
            title: (_a = j.title) !== null && _a !== void 0 ? _a : null,
            description: null,
            icon: 'https://www.youtube.com/s/desktop/014dbbed/img/favicon_32x32.png',
            sitename: (_b = j.provider_name) !== null && _b !== void 0 ? _b : null,
            thumbnail: (_c = j.thumbnail_url) !== null && _c !== void 0 ? _c : null,
            player: {
                url: src,
                width: j.width,
                height: j.height,
            },
            url: url.href,
        };
    });
}

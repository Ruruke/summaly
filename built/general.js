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
const cleanup_title_1 = require("./utils/cleanup-title");
const decode_entities_1 = require("./utils/decode-entities");
const got_1 = require("./utils/got");
exports.default = (url, lang = null) => __awaiter(void 0, void 0, void 0, function* () {
    if (lang && !lang.match(/^[\w-]+(\s*,\s*[\w-]+)*$/))
        lang = null;
    const res = yield (0, got_1.scpaping)(url.href, { lang: lang || undefined });
    const $ = res.$;
    const landingUrl = new URL(res.response.url);
    const twitterCard = $('meta[property="twitter:card"]').attr('content');
    let title = $('meta[property="og:title"]').attr('content') ||
        $('meta[property="twitter:title"]').attr('content') ||
        $('title').text() ||
        null;
    if (title == null) {
        throw 'no title';
    }
    title = (0, decode_entities_1.decodeEntities)(title, 300);
    let image = $('meta[property="og:image"]').attr('content') ||
        $('meta[property="twitter:image"]').attr('content') ||
        $('link[rel="image_src"]').attr('href') ||
        $('link[rel="apple-touch-icon"]').attr('href') ||
        $('link[rel="apple-touch-icon image_src"]').attr('href') ||
        null;
    image = image ? new URL(image, landingUrl.href).href : null;
    let playerUrl = (twitterCard !== 'summary_large_image' && $('meta[property="twitter:player"]').attr('content')) ||
        (twitterCard !== 'summary_large_image' && $('meta[name="twitter:player"]').attr('content')) ||
        $('meta[property="og:video"]').attr('content') ||
        $('meta[property="og:video:secure_url"]').attr('content') ||
        $('meta[property="og:video:url"]').attr('content') ||
        null;
    playerUrl = playerUrl ? new URL(playerUrl, landingUrl.href).href : null;
    const playerWidth = parseInt($('meta[property="twitter:player:width"]').attr('content') ||
        $('meta[name="twitter:player:width"]').attr('content') ||
        $('meta[property="og:video:width"]').attr('content') ||
        '');
    const playerHeight = parseInt($('meta[property="twitter:player:height"]').attr('content') ||
        $('meta[name="twitter:player:height"]').attr('content') ||
        $('meta[property="og:video:height"]').attr('content') ||
        '');
    let description = $('meta[property="og:description"]').attr('content') ||
        $('meta[property="twitter:description"]').attr('content') ||
        $('meta[name="description"]').attr('content') ||
        null;
    description = (0, decode_entities_1.decodeEntities)(description, 300);
    if (title === description) {
        description = null;
    }
    let siteName = $('meta[property="og:site_name"]').attr('content') ||
        $('meta[name="application-name"]').attr('content') ||
        landingUrl.hostname ||
        null;
    siteName = (0, decode_entities_1.decodeEntities)(siteName, 300);
    const favicon = $('link[rel="shortcut icon"]').attr('href') ||
        $('link[rel="icon"]').attr('href') ||
        '/favicon.ico';
    const icon = favicon ? new URL(favicon, landingUrl.href).href : null;
    const sensitive = $('.tweet').attr('data-possibly-sensitive') === 'true';
    // Clean up the title
    title = (0, cleanup_title_1.default)(title, siteName);
    if (title === '') {
        title = siteName;
    }
    const result = {
        title,
        icon,
        description,
        thumbnail: image,
        player: {
            url: playerUrl,
            width: Number.isNaN(playerWidth) ? null : playerWidth,
            height: Number.isNaN(playerHeight) ? null : playerHeight
        },
        sitename: siteName,
        sensitive,
        url: landingUrl.href,
        $,
    };
    return result;
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeEntities = decodeEntities;
const clip_1 = require("./clip");
const html_entities_1 = require("html-entities");
function decodeEntities(description, limit = 300) {
    return description
        ? ((0, clip_1.default)((0, html_entities_1.decode)(description), limit) || null)
        : null;
}

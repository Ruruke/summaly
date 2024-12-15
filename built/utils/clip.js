"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
function default_1(s, max) {
    if (s == null)
        return s;
    s = s.trim();
    if (s.length > max) {
        return s.substr(0, max) + '…';
    }
    else {
        return s;
    }
}

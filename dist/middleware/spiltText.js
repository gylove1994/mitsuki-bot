"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitText = void 0;
const controller_1 = require("./../types/controller");
function splitText(msg, mitsuki) {
    if (msg.type == "FriendMessage") {
        return new controller_1.MiddlewareOutput("splitText", { str: getText(msg).split(/[ ]+/) });
    }
    else if (msg.type == "GroupMessage") {
        return new controller_1.MiddlewareOutput("splitText", { str: getText(msg).split(/[ ]+/).slice(1) });
    }
    return new controller_1.MiddlewareOutput("splitText", { str: ["notHandle"] });
}
exports.splitText = splitText;
function getText(msg) {
    for (let i = 0; i < msg.messageChain.length; i++) {
        if (msg.messageChain[i].type == "Plain")
            return msg.plain;
    }
    return "";
}

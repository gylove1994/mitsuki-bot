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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const friendMsg_1 = require("./controller/friendMsg");
const groupMsg_1 = require("./controller/groupMsg");
const permissions_1 = require("./middleware/permissions");
const spiltText_1 = require("./middleware/spiltText");
const mitsuki_1 = require("./types/mitsuki");
function app() {
    return __awaiter(this, void 0, void 0, function* () {
        const mitsuki = yield mitsuki_1.Mitsuki.setup(path_1.default.join(__dirname, "./config/mitsukiSetting.json"), path_1.default.join(__dirname, "./config/envDefault.json"));
        mitsuki.addController("FriendMessage").addMiddleware(permissions_1.permissions, spiltText_1.splitText).setMainProcess(friendMsg_1.friendMsg);
        mitsuki.addController("GroupMessage").addMiddleware(permissions_1.permissions, spiltText_1.splitText).setMainProcess(groupMsg_1.groupMsg);
        mitsuki.ready();
    });
}
app();

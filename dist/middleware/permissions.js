"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissions = exports.PermissionSet = void 0;
const mirai_ts_1 = require("mirai-ts");
const node_fs_1 = __importDefault(require("node:fs"));
const path_1 = __importDefault(require("path"));
var PermissionSet;
(function (PermissionSet) {
    PermissionSet[PermissionSet["block"] = -1] = "block";
    PermissionSet[PermissionSet["user"] = 0] = "user";
    PermissionSet[PermissionSet["ec"] = 1] = "ec";
    PermissionSet[PermissionSet["admin"] = 2] = "admin";
})(PermissionSet = exports.PermissionSet || (exports.PermissionSet = {}));
function permissions(msg, mitsuki) {
    let list;
    if (node_fs_1.default.existsSync(path_1.default.join(__dirname, "../config/permissions.json")))
        list = JSON.parse(node_fs_1.default.readFileSync(path_1.default.join(__dirname, "../config/permissions.json"), "utf-8"));
    else
        throw new Error("permissionList配置文件不存在");
    if (mirai_ts_1.check.isChatMessage(msg)) {
        for (let i = 0; i < list.admin.length; i++) {
            if (list.admin[i] == msg.sender.id)
                return { middlewareName: "permissions", output: { permissions: "admin", permissionLv: PermissionSet.admin } };
        }
        for (let i = 0; i < list.ec.length; i++) {
            if (list.admin[i] == msg.sender.id)
                return { middlewareName: "permissions", output: { permissions: "ec", permissionLv: PermissionSet.ec } };
        }
        for (let i = 0; i < list.block.length; i++) {
            if (list.admin[i] == msg.sender.id)
                return { middlewareName: "permissions", output: { permissions: "block", permissionLv: PermissionSet.block } };
        }
        return { middlewareName: "permissions", output: { permissions: "user", permissionLv: PermissionSet.user } };
    }
    //todo
    return { middlewareName: "permissions", output: { permissions: "notHandle", permissionLv: -1 } };
}
exports.permissions = permissions;

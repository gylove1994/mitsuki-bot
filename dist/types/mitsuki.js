"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Mitsuki = void 0;
const mirai_ts_1 = __importStar(require("mirai-ts"));
const node_fs_1 = __importDefault(require("node:fs"));
const sqlite_1 = require("sqlite");
const sqlite3_1 = __importDefault(require("sqlite3"));
const command_1 = require("./command");
const controller_1 = require("./controller");
class Mitsuki extends mirai_ts_1.default {
    constructor(mitsukiSettingPath, envPath) {
        if (node_fs_1.default.existsSync(mitsukiSettingPath)) {
            const mitsukiSetting = JSON.parse(node_fs_1.default.readFileSync(mitsukiSettingPath, "utf-8"));
            super(mitsukiSetting.apiSetting);
            this.logger = new mirai_ts_1.Logger({ prefix: "[Mitsuki]" });
            this.setting = mitsukiSetting;
            this.DevMode(process.env.NODE_ENV);
            this.controller = [];
        }
        else
            throw new Error("配置文件不存在");
        if (envPath !== undefined && node_fs_1.default.existsSync(envPath)) {
            this.env = JSON.parse(node_fs_1.default.readFileSync(envPath, "utf-8"));
        }
        else {
            this.logger.info("默认env设置文件不存在，已将env设置为空数组");
            this.env = { env: [] };
        }
    }
    linkDB() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.setting.dbPath != undefined) {
                this.db = yield (0, sqlite_1.open)({
                    filename: this.setting.dbPath,
                    driver: sqlite3_1.default.Database
                });
                return this.db;
            }
            else
                throw new Error("数据库配置文件不存在");
        });
    }
    ready() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.dev_mode !== undefined && this.dev_mode === true) {
                this.logger.info("mitsuki-bot正在以开发模式启动！");
            }
            this.controller.forEach(controller => controller.ready(this));
            this.listen();
        });
    }
    DevMode(status) {
        if (status === "development")
            this.dev_mode = true;
        else
            this.dev_mode = false;
    }
    addController(msgType) {
        const controller = new controller_1.Controller(msgType);
        this.controller.push(controller);
        return controller;
    }
    getCommand(context, mitsuki) {
        return new command_1.Commands(context, mitsuki);
    }
    static setup(mitsukiSettingPath, envPath) {
        return __awaiter(this, void 0, void 0, function* () {
            const mitsuki = new Mitsuki(mitsukiSettingPath, envPath);
            yield mitsuki.linkDB();
            return mitsuki;
        });
    }
    getEnvValue(envName) {
        let env = undefined;
        this.env.env.forEach(element => {
            if (element.name == envName)
                env = element.value;
        });
        if (env === undefined)
            throw new Error("mitsuki中没有" + envName + "环境变量");
        return env;
    }
    setEnvValue(envName, envValue) {
        let status = false;
        this.env.env.forEach(element => {
            if (element.name == envName) {
                element.value = envValue;
                status = true;
            }
        });
        if (status === false)
            throw new Error("mitsuki中没有" + envName + "环境变量");
    }
}
exports.Mitsuki = Mitsuki;

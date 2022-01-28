import Mirai, { Logger, MiraiApiHttpSetting } from "mirai-ts";
import fs from 'node:fs';
import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";
import { Commands } from "./command";
import { Context, Controller, MsgType } from './controller';

export interface MitsukiSetting {
    apiSetting: MiraiApiHttpSetting
    qq_link: number
    qq_bind:number
    dbPath?: string
}

export interface Environment{
    name:string
    value:object
}

export interface EnvironmentSet{
    env:Environment[]
}

export class Mitsuki extends Mirai {
    controller: Controller<MsgType>[]
    dev_mode?: boolean
    db?: Database
    logger: Logger
    env:EnvironmentSet
    readonly setting: MitsukiSetting
    constructor(mitsukiSettingPath: string,envPath?:string) {
        if (fs.existsSync(mitsukiSettingPath)) {
            const mitsukiSetting: MitsukiSetting = JSON.parse(fs.readFileSync(mitsukiSettingPath, "utf-8"))
            super(mitsukiSetting.apiSetting)
            this.logger = new Logger({ prefix: "[Mitsuki]" })
            this.setting = mitsukiSetting;
            this.DevMode(process.env.NODE_ENV as string)
            this.controller = []
        } else throw new Error("配置文件不存在")
        if(envPath !== undefined && fs.existsSync(envPath)){
            this.env = JSON.parse(fs.readFileSync(envPath, "utf-8"))
        }else{
            this.logger.info("默认env设置文件不存在，已将env设置为空数组")
            this.env = {env:[]}
        }
    }
    async linkDB() {
        if (this.setting.dbPath != undefined) {
            this.db = await open({
                filename: this.setting.dbPath,
                driver: sqlite3.Database
            })
            return this.db;
        } else throw new Error("数据库配置文件不存在")
    }
    async ready() {
        if (this.dev_mode !== undefined && this.dev_mode === true) {
            this.logger.info("mitsuki-bot正在以开发模式启动！")
        }
        this.controller.forEach(controller => controller.ready(this));
        this.listen();
    }
    public DevMode(status: string) {
        if (status === "development")
            this.dev_mode = true
        else
            this.dev_mode = false
    }
    public addController(msgType: MsgType) {
        const controller = new Controller(msgType)
        this.controller.push(controller)
        return controller
    }
    public getCommand<T extends MsgType>(context:Context<T>,mitsuki:Mitsuki){
        return new Commands<T>(context,mitsuki)
    }
    static async setup(mitsukiSettingPath: string,envPath?:string) {
        const mitsuki = new Mitsuki(mitsukiSettingPath,envPath)
        await mitsuki.linkDB()
        return mitsuki
    }
    public getEnvValue<T>(envName:string) {
        let env:Object| undefined = undefined;
        this.env.env.forEach(element => {
            if(element.name == envName)
                env = element.value
        });
        if(env === undefined)
            throw new Error("mitsuki中没有"+envName+"环境变量");
        return env as T
    }
    public setEnvValue(envName:string,envValue:object) {
        let status = false
        this.env.env.forEach(element => {
            if(element.name == envName){
                element.value = envValue
                status = true
            }
        });
        if(status === false)
            throw new Error("mitsuki中没有"+envName+"环境变量");
    }
}
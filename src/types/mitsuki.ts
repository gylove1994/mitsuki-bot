import Mirai, { Logger, MiraiApiHttpSetting } from "mirai-ts";
import { Database,open,ISqlite } from "sqlite";
import sqlite3 from "sqlite3";
import fs from 'node:fs';

export interface MitsukiSetting{
    apiSetting:MiraiApiHttpSetting
    qq_link:number
    dbPath?:string
}

export class Mitsuki extends Mirai{
    dev_mode?:boolean
    db?: Database
    logger: Logger
    readonly setting: MitsukiSetting
    constructor(mitsukiSettingPath:string){
        if(fs.existsSync(mitsukiSettingPath)){
            const mitsukiSetting:MitsukiSetting = JSON.parse(fs.readFileSync(mitsukiSettingPath,"utf-8"))
            super(mitsukiSetting.apiSetting)
            this.logger = new Logger({prefix:"Mitsuki"})
            this.setting = mitsukiSetting;
        }else throw new Error("配置文件不存在")
    }
    async linkDB(){
        if(this.setting.dbPath != undefined){
            this.db = await open({
                filename:this.setting.dbPath,
                driver:sqlite3.Database
            })
            return this.db;
        }else throw new Error("数据库配置文件不存在")
    }
    async ready(){
        if(this.dev_mode !== undefined && this.dev_mode === true){
            this.logger.info("mitsuki-bot正在以开发模式启动！")
        }
        this.listen();
    }
    public DevMode(status: string){
        if(status === "development")
            this.dev_mode = true
        else
            this.dev_mode = false
    }
}
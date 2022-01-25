import { Mitsuki } from './../types/mitsuki';
import fs from 'node:fs';
import { Data, MsgType, MiddlewareOutput } from './../types/controller';
import path from 'path'
interface permissionList {
    admin: number[],
    ec: number[],
    block: number[]
}
export type Permission = {permissions:string}
export function permissions<T extends MsgType>(msg: Data<T>,mitsuki:Mitsuki): MiddlewareOutput {
    let list: permissionList;
    if (fs.existsSync(path.join(__dirname, "../config/permissions.json")))
        list = JSON.parse(fs.readFileSync(path.join(__dirname, "../config/permissions.json"), "utf-8"))
    else throw new Error("permissionList配置文件不存在")
    if (msg.type == "FriendMessage"){
        for(let i = 0 ; i<list.admin.length ; i++){
            if(list.admin[i] == msg.sender.id)
            return {middlewareName:"permissions",output:{permissions:"admin"}} as MiddlewareOutput
        }
        for(let i = 0 ; i<list.ec.length ; i++){
            if(list.admin[i] == msg.sender.id)
            return {middlewareName:"permissions",output:{permissions:"ec"}} as MiddlewareOutput
        }
        for(let i = 0 ; i<list.block.length ; i++){
            if(list.admin[i] == msg.sender.id)
            return {middlewareName:"permissions",output:{permissions:"block"}} as MiddlewareOutput
        }
        return {middlewareName:"permissions",output:{permissions:"user"}} as MiddlewareOutput
    }
    //todo
    return {middlewareName:"permissions",output:{permissions:"notHandle"}} as MiddlewareOutput
}
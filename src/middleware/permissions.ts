import { check } from 'mirai-ts';
import { Mitsuki } from './../types/mitsuki';
import fs from 'node:fs';
import { Data, MsgType, MiddlewareOutput } from './../types/controller';
import path from 'path'
interface permissionList {
    admin: number[],
    ec: number[],
    block: number[]
}
export enum PermissionSet{
    block = -1,
    user,
    ec,
    admin
}
export type Permission = {permissions:string,permissionLv:number}
export function permissions<T extends MsgType>(msg: Data<T>,mitsuki:Mitsuki): MiddlewareOutput {
    let list: permissionList;
    if (fs.existsSync(path.join(__dirname, "../config/permissions.json")))
        list = JSON.parse(fs.readFileSync(path.join(__dirname, "../config/permissions.json"), "utf-8"))
    else throw new Error("permissionList配置文件不存在")
    if (check.isChatMessage(msg)){
        for(let i = 0 ; i<list.admin.length ; i++){
            if(list.admin[i] == msg.sender.id)
            return {middlewareName:"permissions",output:{permissions:"admin",permissionLv:PermissionSet.admin}} as MiddlewareOutput
        }
        for(let i = 0 ; i<list.ec.length ; i++){
            if(list.admin[i] == msg.sender.id)
            return {middlewareName:"permissions",output:{permissions:"ec",permissionLv:PermissionSet.ec}} as MiddlewareOutput
        }
        for(let i = 0 ; i<list.block.length ; i++){
            if(list.admin[i] == msg.sender.id)
            return {middlewareName:"permissions",output:{permissions:"block",permissionLv:PermissionSet.block}} as MiddlewareOutput
        }
        return {middlewareName:"permissions",output:{permissions:"user",permissionLv:PermissionSet.user}} as MiddlewareOutput
    }
    //todo
    return {middlewareName:"permissions",output:{permissions:"notHandle",permissionLv:-1}} as MiddlewareOutput
}
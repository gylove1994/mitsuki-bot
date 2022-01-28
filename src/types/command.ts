import { Mitsuki } from './mitsuki';
import { MsgType, Context } from './controller';
import { Permission } from './../middleware/permissions';
export type Action<T extends MsgType> = (() => void) | ((context:Context<T>,mitsuki:Mitsuki) => void)
class Commands<T extends MsgType> {
    private commands: SingleCommand<T>[]
    private defaultCommand?:SingleCommand<T>
    private context:Context<T>
    private mitsuki:Mitsuki
    constructor(context:Context<T>,mitsuki:Mitsuki) {
        this.commands = []
        this.context = context
        this.mitsuki = mitsuki
    }
    public addCommand(command?: string, singleCommand?: SingleCommand<T>): SingleCommand<T> {
        if (command == undefined && singleCommand == undefined)
            throw new Error("参数不能为空！");
        if (command != undefined && singleCommand != undefined)
            throw new Error("此处参数只能唯一！");
        if (command != undefined) {
            for(let i = 0 ; i<this.commands.length;i++){
                if(this.commands[i].getCommand() == command)
                    throw new Error("命令组内存在重复命令！");
            }
            const _singleCommand = new SingleCommand<T>(command);
            this.commands.push(_singleCommand);
            return _singleCommand;
        }
        else {
            this.commands.push(singleCommand as SingleCommand<T>);
            return singleCommand as SingleCommand<T>;
        }
    };
    public getSingleCommand() {
        const singleCommand = new SingleCommand<T>();
        this.commands.push(singleCommand);
        return singleCommand;
    };
    public addDefaultCommand(){
        this.defaultCommand = new SingleCommand("default")
        return this.defaultCommand
    }
    public async doCommand(com?: string,permissionLv?:number) {
        if(com === undefined){
            if(this.defaultCommand !== undefined){
                this.defaultCommand.doAction(this.context,this.mitsuki)
                return
            }
            return
        }
        for (let i = 0; i < this.commands.length; i++) {
            if (await this.commands[i].checkCommand(com,this.context,this.mitsuki,permissionLv)) return
        }
        if(this.defaultCommand !== undefined) this.defaultCommand.doAction(this.context,this.mitsuki)
    }   
}

class SingleCommand<T extends MsgType> {
    private command?: string;
    private action?: Action<T>;
    private permissionLv?:number
    constructor(command?: string) {
        if (command != undefined)
            this.command = command;
    };
    public addAction(action: Action<T>) {
        this.action = action;
    }
    public async doAction(context:Context<T>,mitsuki:Mitsuki) {
        if (this.action != undefined)
            await this.action(context,mitsuki)
        else
            throw new Error("未定义命令所调用的函数！");
    };
    public async checkCommand(command: string,context:Context<T>,mitsuki:Mitsuki,permissionLv?:number) {
        if (command == this.command ) {
            if(permissionLv !== undefined && this.permissionLv !== undefined){
                if(permissionLv >= this.permissionLv){
                    await this.doAction(context,mitsuki);
                    return true;
                }else{
                    context.msg.reply!("【权限不足】您目前的权限级别为：" + permissionLv +"，执行所需最低权限级别为："+this.permissionLv)
                    return false;
                }
            }else if(this.permissionLv !== undefined && permissionLv == undefined){
                throw new Error("对于设置了权限的命令"+this.getCommand+"却未传入权限参数")
            }
            else if(permissionLv !== undefined && permissionLv < 0){
                context.msg.reply!("【权限不足】您目前处于黑名单中！")
                return false;
            }else if(this.permissionLv == undefined){
                await this.doAction(context,mitsuki);
                return true;
            }
        } else {
            return false;
        }
    }
    public getCommand(){
        if(this.command == undefined)
            throw new Error("命令名为空！");
        return this.command;
    }
    public setPermission(permissionLv:number){
        this.permissionLv = permissionLv
        return this
    }
}

class CommandNotDefine implements Error {
    name: string;
    message: string;
    constructor() {
        this.message = "没有定义的命令";
        this.name = "CommandNotDefine";
    }
}

export { CommandNotDefine, SingleCommand, Commands }
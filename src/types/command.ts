import { Permission } from './../middleware/permissions';
class Commands {
    private commands: SingleCommand[];
    private defaultCommand?:SingleCommand;
    constructor() {
        this.commands = [];
    }
    public addCommand(command?: string, singleCommand?: SingleCommand): SingleCommand {
        if (command == undefined && singleCommand == undefined)
            throw new Error("参数不能为空！");
        if (command != undefined && singleCommand != undefined)
            throw new Error("此处参数只能唯一！");
        if (command != undefined) {
            for(let i = 0 ; i<this.commands.length;i++){
                if(this.commands[i].getCommand() == command)
                    throw new Error("命令组内存在重复命令！");
            }
            const _singleCommand = new SingleCommand(command);
            this.commands.push(_singleCommand);
            return _singleCommand;
        }
        else {
            this.commands.push(singleCommand as SingleCommand);
            return singleCommand as SingleCommand;
        }
    };
    public getSingleCommand() {
        const singleCommand = new SingleCommand();
        this.commands.push(singleCommand);
        return singleCommand;
    };
    public addDefaultCommand(){
        this.defaultCommand = new SingleCommand("default")
        return this.defaultCommand
    }
    public async doCommand(com?: string,permissionLv?:number, options?: string[]) {
        if(com === undefined){
            if(this.defaultCommand !== undefined){
                this.defaultCommand.doAction()
                return
            }
            return
        }
        for (let i = 0; i < this.commands.length; i++) {
            if (await this.commands[i].checkCommand(com,permissionLv, options)) return
        }
        if(this.defaultCommand !== undefined) this.defaultCommand.doAction()
    }   
}

class SingleCommand {
    private command?: string;
    private action?: (options?: string[]) => void;
    private permissionLv?:number
    constructor(command?: string) {
        if (command != undefined)
            this.command = command;
    };
    public addAction(action: (options?: string[]) => void) {
        this.action = action;
    }
    public async doAction(options?: string[]) {
        if (this.action != undefined)
            await this.action(options)
        else
            throw new Error("未定义命令所调用的函数！");
    };
    public async checkCommand(command: string,permissionLv?:number,options?: string[]) {
        if (command == this.command ) {
            if(permissionLv !== undefined && this.permissionLv !== undefined){
                if(this.permissionLv >= permissionLv){
                    await this.doAction(options);
                    return true;
                }else return false;
            }else if(this.permissionLv !== undefined && permissionLv == undefined){
                throw new Error("对于设置了权限的命令"+this.getCommand+"却未传入权限参数")
            }
            else if(permissionLv !== undefined && permissionLv < 0){
                return false;
            }else if(this.permissionLv == undefined){
                await this.doAction(options);
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
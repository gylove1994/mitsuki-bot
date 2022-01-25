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
    public async doCommand(com: string, options?: string[]) {
        for (let i = 0; i < this.commands.length; i++) {
            if (await this.commands[i].checkCommand(com, options)) return;
            if(this.defaultCommand !== undefined)
                this.defaultCommand.doAction()
        }
    }   
}

class SingleCommand {
    private command?: string;
    private action?: (options?: string[]) => void;
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
    public async checkCommand(command: string, options?: string[]) {
        if (command == this.command) {
            await this.doAction(options);
            return true;
        } else {
            return false;
        }
    }
    public getCommand(){
        if(this.command == undefined)
            throw new Error("命令名为空！");
        return this.command;
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
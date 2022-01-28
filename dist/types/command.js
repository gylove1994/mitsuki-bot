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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commands = exports.SingleCommand = exports.CommandNotDefine = void 0;
class Commands {
    constructor(context, mitsuki) {
        this.commands = [];
        this.context = context;
        this.mitsuki = mitsuki;
    }
    addCommand(command, singleCommand) {
        if (command == undefined && singleCommand == undefined)
            throw new Error("参数不能为空！");
        if (command != undefined && singleCommand != undefined)
            throw new Error("此处参数只能唯一！");
        if (command != undefined) {
            for (let i = 0; i < this.commands.length; i++) {
                if (this.commands[i].getCommand() == command)
                    throw new Error("命令组内存在重复命令！");
            }
            const _singleCommand = new SingleCommand(command);
            this.commands.push(_singleCommand);
            return _singleCommand;
        }
        else {
            this.commands.push(singleCommand);
            return singleCommand;
        }
    }
    ;
    getSingleCommand() {
        const singleCommand = new SingleCommand();
        this.commands.push(singleCommand);
        return singleCommand;
    }
    ;
    addDefaultCommand() {
        this.defaultCommand = new SingleCommand("default");
        return this.defaultCommand;
    }
    doCommand(com, permissionLv) {
        return __awaiter(this, void 0, void 0, function* () {
            if (com === undefined) {
                if (this.defaultCommand !== undefined) {
                    this.defaultCommand.doAction(this.context, this.mitsuki);
                    return;
                }
                return;
            }
            for (let i = 0; i < this.commands.length; i++) {
                if (yield this.commands[i].checkCommand(com, this.context, this.mitsuki, permissionLv))
                    return;
            }
            if (this.defaultCommand !== undefined)
                this.defaultCommand.doAction(this.context, this.mitsuki);
        });
    }
}
exports.Commands = Commands;
class SingleCommand {
    constructor(command) {
        if (command != undefined)
            this.command = command;
    }
    ;
    addAction(action) {
        this.action = action;
    }
    doAction(context, mitsuki) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.action != undefined)
                yield this.action(context, mitsuki);
            else
                throw new Error("未定义命令所调用的函数！");
        });
    }
    ;
    checkCommand(command, context, mitsuki, permissionLv) {
        return __awaiter(this, void 0, void 0, function* () {
            if (command == this.command) {
                if (permissionLv !== undefined && this.permissionLv !== undefined) {
                    if (permissionLv >= this.permissionLv) {
                        yield this.doAction(context, mitsuki);
                        return true;
                    }
                    else {
                        context.msg.reply("【权限不足】您目前的权限级别为：" + permissionLv + "，执行所需最低权限级别为：" + this.permissionLv);
                        return false;
                    }
                }
                else if (this.permissionLv !== undefined && permissionLv == undefined) {
                    throw new Error("对于设置了权限的命令" + this.getCommand + "却未传入权限参数");
                }
                else if (permissionLv !== undefined && permissionLv < 0) {
                    context.msg.reply("【权限不足】您目前处于黑名单中！");
                    return false;
                }
                else if (this.permissionLv == undefined) {
                    yield this.doAction(context, mitsuki);
                    return true;
                }
            }
            else {
                return false;
            }
        });
    }
    getCommand() {
        if (this.command == undefined)
            throw new Error("命令名为空！");
        return this.command;
    }
    setPermission(permissionLv) {
        this.permissionLv = permissionLv;
        return this;
    }
}
exports.SingleCommand = SingleCommand;
class CommandNotDefine {
    constructor() {
        this.message = "没有定义的命令";
        this.name = "CommandNotDefine";
    }
}
exports.CommandNotDefine = CommandNotDefine;

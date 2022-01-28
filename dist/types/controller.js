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
exports.Controller = exports.Context = exports.MiddlewareOutput = void 0;
class MiddlewareOutput {
    constructor(middlewareName, output) {
        this.middlewareName = middlewareName;
        this.output = output;
    }
}
exports.MiddlewareOutput = MiddlewareOutput;
class Context {
    constructor(msg) {
        this.msg = msg;
        this.output = [];
    }
    getMiddlewareOutput(middlewareName) {
        let output = undefined;
        this.output.forEach(element => {
            if (element.middlewareName == middlewareName)
                output = element.output;
        });
        if (output === undefined)
            throw new Error(middlewareName + "中间件没有在控制器中注册");
        return output;
    }
}
exports.Context = Context;
class Controller {
    constructor(eventType) {
        this.eventType = eventType;
        this.middleware = [];
        for (let i = 0; i < Controller.eventUsed.length; i++) {
            if (eventType === Controller.eventUsed[i])
                throw new Error("Controller：" + eventType + "重复注册");
        }
        Controller.eventUsed.push(eventType);
    }
    addMiddleware(...middleware) {
        middleware.forEach(element => {
            this.middleware.push(element);
        });
        return this;
    }
    setMainProcess(mainProcess) {
        if (this.mainProcess === undefined) {
            this.mainProcess = mainProcess;
        }
        else
            throw new Error("重复定义控制器的主函数");
    }
    ready(mitsuki) {
        if (this.mainProcess !== undefined) {
            mitsuki.logger.info(this.eventType + "控制器已设置");
            mitsuki.on(this.eventType, (msg) => __awaiter(this, void 0, void 0, function* () {
                mitsuki.logger.info(this.eventType + "事件应答开始");
                const start = Date.now();
                let context = new Context(msg);
                this.middleware.forEach((fn) => __awaiter(this, void 0, void 0, function* () {
                    context.output.push(fn(msg, mitsuki));
                }));
                yield this.mainProcess(context, mitsuki);
                let time = Date.now() - start;
                if (time == 0)
                    mitsuki.logger.info(this.eventType + "事件应答完毕，用时：小于1毫秒。");
                else
                    mitsuki.logger.info(this.eventType + "事件应答完毕，用时：" + time + "毫秒。");
            }));
        }
        else
            throw new Error("控制器的主函数未定义");
    }
}
exports.Controller = Controller;
Controller.eventUsed = [];

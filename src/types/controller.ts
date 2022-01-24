import { EventType, MessageType } from 'mirai-ts';
import { Mitsuki } from './mitsuki';

export type MsgType = "message" | EventType.EventType | MessageType.ChatMessageType
export type Middleware<T extends MsgType> = (msg: Data<T>) => MiddlewareOutput
export interface MiddlewareOutput{
    middlewareName:string,
    output:Object
}

export class Context<T extends MsgType>{
    public msg:Data<T>
    public output:MiddlewareOutput[]
    constructor(msg:Data<T>){
        this.msg = msg
        this.output = []
    }
    public getMiddlewareOutput<K>(middlewareName:string) {
        let output:Object| undefined = undefined;
        this.output.forEach(element => {
            if(element.middlewareName === middlewareName)
                output = element.output
        });
        if(output === undefined)
            throw new Error(middlewareName+"中间件没有在控制器中注册");
        return output as K
    }
}

export type MainProcess<T extends MsgType> = (context:Context<T>) => void

export type Data<T extends MsgType> = T extends EventType.EventType
    ? EventType.EventMap[T]
    : T extends MessageType.ChatMessageType
    ? MessageType.ChatMessageMap[T]
    : MessageType.ChatMessage;

export class Controller<T extends MsgType>{
    private eventType: T
    private static eventUsed: (MsgType)[] = []
    private middleware: Middleware<T>[]
    private mainProcess?: MainProcess<T>
    constructor(eventType: T) {
        this.eventType = eventType
        this.middleware = []
        for (let i = 0; i < Controller.eventUsed.length; i++) {
            if (eventType === Controller.eventUsed[i])
                throw new Error("Controller：" + eventType + "重复注册")
        }
        Controller.eventUsed.push(eventType)
    }
    public addMiddleware(...middleware: Middleware<T>[]) {
        middleware.forEach(element => {
            this.middleware.push(element)
        });
        return this
    }
    public setMainProcess(mainProcess: MainProcess<T>) {
        if (this.mainProcess === undefined) {
            this.mainProcess = mainProcess
        } else throw new Error("重复定义控制器的主函数")
    }
    public ready(mitsuki: Mitsuki) {
        if (this.mainProcess !== undefined) {
            mitsuki.logger.info(this.eventType + "控制器已设置")
            mitsuki.on(this.eventType, async (msg) => {
                const start = Date.now()
                let context = new Context<T>(msg)
                this.middleware.forEach(async fn => {
                    context.output.push(await fn(msg))
                });
                await this.mainProcess!(context)
                let time = Date.now() - start;
                if(time == 0)
                    mitsuki.logger.info(this.eventType + "事件应答完毕，用时：小于1毫秒。")
                else
                    mitsuki.logger.info(this.eventType+"事件应答完毕，用时："+time+"毫秒。")
            })
        } else throw new Error("控制器的主函数未定义")
    }
}
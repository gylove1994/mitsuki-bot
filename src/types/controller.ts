import { Mitsuki } from './mitsuki';
import { EventType,MessageType } from 'mirai-ts'
type Middleware<T extends "message" | EventType.EventType | MessageType.ChatMessageType> = (msg:Data<T>) => Data<T>
type MainProcess<T extends "message" | EventType.EventType | MessageType.ChatMessageType> = (msg:Data<T>) => void

export type Data<T extends "message" |  EventType.EventType | MessageType.ChatMessageType> = T extends EventType.EventType
    ? EventType.EventMap[T]
    : T extends MessageType.ChatMessageType
    ? MessageType.ChatMessageMap[T]
    : MessageType.ChatMessage;

export class Controller<T extends "message" | EventType.EventType | MessageType.ChatMessageType>{
    private eventType: T 
    private static eventUsed:("message" | EventType.EventType | MessageType.ChatMessageType)[] = []
    private middleware:Middleware<T>[]
    private mainProcess?:MainProcess<T>
    constructor(eventType:T){
        this.eventType = eventType
        this.middleware = []
        for(let i = 0; i < Controller.eventUsed.length;i++){
            if(eventType === Controller.eventUsed[i])
                throw new Error("Controller："+eventType+"重复注册")
        }
        Controller.eventUsed.push(eventType)
    }
    public addMiddleware(...middleware:Middleware<T>[]){
        middleware.forEach(element => {
            this.middleware.push(element)
        });
        return this
    }
    public setMainProcess(mainProcess:MainProcess<T>){
        if(this.mainProcess === undefined){
            this.mainProcess = mainProcess
        }else throw new Error("重复定义控制器的主函数")
    }
    public ready(mitsuki:Mitsuki){
        if(this.mainProcess !== undefined){
            mitsuki.logger.info(this.eventType+"已控制器设置")
            mitsuki.on(this.eventType,(msg)=>{
                this.middleware.forEach(fn => fn(msg));
                this.mainProcess!(msg)
                mitsuki.logger.info(this.eventType+"事件应答完毕")
            })
        }else throw new Error("控制器的主函数未定义")
    }
}
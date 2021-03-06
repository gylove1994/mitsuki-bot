import { Mitsuki } from './../types/mitsuki';
import { MsgType, Data, MiddlewareOutput } from './../types/controller';
import { MessageType } from 'mirai-ts';
import { check } from 'mirai-ts';

export function splitText<T extends MsgType>(msg: Data<T>, mitsuki: Mitsuki): MiddlewareOutput {
    if (msg.type == "FriendMessage") {
        return new MiddlewareOutput("splitText", { str: getText(msg).split(/[ ]+/) } as SplitText)
    }else if(msg.type == "GroupMessage"){
        return new MiddlewareOutput("splitText", { str: getText(msg).split(/[ ]+/).slice(1) } as SplitText)
    }
    return new MiddlewareOutput("splitText", { str: ["notHandle"] })
}

export type SplitText = {str:string[]}

function getText(msg: MessageType.ChatMessage) {
    for (let i = 0; i < msg.messageChain.length; i++) {
        if (msg.messageChain[i].type == "Plain")
            return msg.plain;
    }
    return "";
}
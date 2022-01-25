import { SplitText } from './../middleware/spiltText';
import { Mitsuki } from './../types/mitsuki';
import { Context, MsgType } from './../types/controller';
import { CommandNotDefine } from '../types/command';

export async function friendMsg<T extends MsgType>(context:Context<T>,mitsuki:Mitsuki) {
    if(context.msg.type == "FriendMessage"){
        try{
            const command = mitsuki.getCommand()
            command.addCommand("mitsuki").addAction(()=>{
                context.msg.reply!("这里是mitsukiです！mitsuki是由gylove1994基于mirai及mirai-ts开发的QQ机器人。mitsuki正在早期测试阶段(框架构建中)，如果您看到了这条信息说明gylove1994那个傻逼正在对我捣鼓一些奇怪的东西。\n目前支持的命令：ec [msg] 用于发送紧急消息(应该还没有多少人有权限就是了)")
                mitsuki.logger.success("mitsuki命令被触发")
            })
            command.addDefaultCommand().addAction(()=>{
                mitsuki.logger.info("没有命令被触发")
            })
            command.doCommand(context.getMiddlewareOutput<SplitText>("splitText").str[0])
        }catch(err){
            mitsuki.logger.error(err)
        }
    }else throw new Error("friendMsg控制器错误的处理了非FriendMessage事件")
}
import { SplitText } from './../middleware/spiltText';
import { Mitsuki } from './../types/mitsuki';
import { Context, MsgType } from './../types/controller';
import { CommandNotDefine } from '../types/command';

export async function friendMsg<T extends MsgType>(context:Context<T>,mitsuki:Mitsuki) {
    if(context.msg.type == "FriendMessage"){
        try{
            const command = mitsuki.getCommand()
            command.addCommand("mitsuki").addAction(()=>{
                let command = mitsuki.getCommand()
                command.addCommand("-v").addAction(()=>{context.msg.reply!("目前mitsuki的版本号是：0.0.1")})
                command.addCommand("-github").addAction(()=>{context.msg.reply!("mitsuki的开源仓库(快给我个star0.0)：https://github.com/gylove1994/mitsuki-bot")})
                command.addCommand("-help").addAction(()=>{context.msg.reply!("目前支持的命令：\nmitsuki -v 显示mitsuki的版本\nmitsuki -github 显示mitsuki的开源仓库地址\nmitsuki -help 显示可用命令")})
                command.addDefaultCommand().addAction(()=>{context.msg.reply!("这里是mitsukiです！mitsuki是由gylove1994基于mirai及mirai-ts开发的QQ机器人。mitsuki正在早期测试阶段(框架构建中)，如果您看到了这条信息说明gylove1994那个傻逼正在对我捣鼓一些奇怪的东西。")})
                command.doCommand(context.getMiddlewareOutput<SplitText>("splitText").str[1])
                mitsuki.logger.success("mitsuki命令被触发")
            })
            command.addDefaultCommand().addAction(()=>{
                context.msg.reply!("现在这个QQ目前是由bot-mitsuki接管哦，试试输入指令：mitsuki 获得更多信息0.0")
                mitsuki.logger.info("默认命令被触发")
            })
            command.doCommand(context.getMiddlewareOutput<SplitText>("splitText").str[0])
        }catch(err){
            mitsuki.logger.error(err)
        }
    }else throw new Error("friendMsg控制器错误的处理了非FriendMessage事件")
}
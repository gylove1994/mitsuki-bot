import { Permission, PermissionSet } from './../middleware/permissions';
import { SplitText } from './../middleware/spiltText';
import { Mitsuki } from './../types/mitsuki';
import { Context, MsgType } from './../types/controller';
type Switch = {status:boolean}
export async function friendMsg<T extends MsgType>(context:Context<T>,mitsuki:Mitsuki) {
    if(context.msg.type == "FriendMessage"){
        if((mitsuki.getEnvValue<Switch>("switch").status || context.getMiddlewareOutput<Permission>("permissions").permissions == "admin")){
            try{
                const command = mitsuki.getCommand()
                command.addCommand("mitsuki").addAction(()=>{
                    let command = mitsuki.getCommand()
                    command.addCommand("-v").addAction(()=>{context.msg.reply!("目前mitsuki的版本号是：0.0.1")})
                    command.addCommand("-github").addAction(()=>{context.msg.reply!("mitsuki的开源仓库(快给我个star0.0)：https://github.com/gylove1994/mitsuki-bot")})
                    command.addCommand("-help").addAction(()=>{context.msg.reply!("目前支持的命令：\nmitsuki -v 显示mitsuki的版本\nmitsuki -github 显示mitsuki的开源仓库地址\nmitsuki -p 显示权限信息\nmitsuki -help 显示可用命令")})
                    command.addCommand("-p").addAction(()=>{context.msg.reply!("您的权限为："+context.getMiddlewareOutput<Permission>("permissions").permissions)})
                    command.addDefaultCommand().addAction(()=>{context.msg.reply!("这里是mitsukiです！mitsuki是由gylove1994基于mirai及mirai-ts开发的QQ机器人。mitsuki正在早期测试阶段(框架构建中)，如果您看到了这条信息说明gylove1994那个傻逼正在对我捣鼓一些奇怪的东西。")})
                    command.doCommand(context.getMiddlewareOutput<SplitText>("splitText").str[1],context.getMiddlewareOutput<Permission>("permissions").permissionLv)
                    mitsuki.logger.success("mitsuki命令被触发")
                })
                command.addCommand("admin").setPermission(PermissionSet.admin).addAction(()=>{
                    let command = mitsuki.getCommand()
                    command.addCommand("-on").addAction(()=>{mitsuki.setEnvValue("switch",<Switch>{status:true});context.msg.reply!("mitsuki-bot已启用消息接管了哦0.0")})
                    command.addCommand("-off").addAction(()=>{mitsuki.setEnvValue("switch",<Switch>{status:false});context.msg.reply!("mitsuki-bot已关闭消息接管了哦0.0")})
                    command.addCommand("-status").addAction(()=>{context.msg.reply!("mitsuki-bot目前的开启状态为："+mitsuki.getEnvValue<Switch>("switch").status)})
                    command.doCommand(context.getMiddlewareOutput<SplitText>("splitText").str[1],context.getMiddlewareOutput<Permission>("permissions").permissionLv)
                    mitsuki.logger.success("admin命令被触发")
                })
                command.addDefaultCommand().addAction(()=>{
                    context.msg.reply!("现在这个QQ目前是由bot-mitsuki接管哦，试试输入指令：mitsuki 或mitsuki -help获得更多信息0.0")
                    mitsuki.logger.info("默认命令被触发")
                })
                command.doCommand(context.getMiddlewareOutput<SplitText>("splitText").str[0],context.getMiddlewareOutput<Permission>("permissions").permissionLv)
            }catch(err){
                mitsuki.logger.error(err)
            }
        }else mitsuki.logger.info("bot开关没有打开")
    }else throw new Error("friendMsg控制器错误的处理了非FriendMessage事件")
}
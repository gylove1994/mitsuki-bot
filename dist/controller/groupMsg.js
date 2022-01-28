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
exports.groupMsg = void 0;
const permissions_1 = require("./../middleware/permissions");
function groupMsg(context, mitsuki) {
    return __awaiter(this, void 0, void 0, function* () {
        if (context.msg.type == "GroupMessage" && context.msg.isAt(mitsuki.setting.qq_link)) {
            if ((mitsuki.getEnvValue("switch").status || context.getMiddlewareOutput("permissions").permissions == "admin")) {
                try {
                    const command = mitsuki.getCommand(context, mitsuki);
                    command.addCommand("mitsuki").addAction(() => {
                        let command = mitsuki.getCommand(context, mitsuki);
                        command.addCommand("-v").addAction(() => { context.msg.reply("目前mitsuki的版本号是：0.0.1"); });
                        command.addCommand("-github").addAction(() => { context.msg.reply("mitsuki的开源仓库(快给我个star0.0)：https://github.com/gylove1994/mitsuki-bot"); });
                        command.addCommand("-help").addAction(() => { context.msg.reply("目前支持的命令：\nmitsuki -v 显示mitsuki的版本\nmitsuki -github 显示mitsuki的开源仓库地址\nmitsuki -p 显示权限信息\nmitsuki -d 显示介绍\nmitsuki -info 查询GY目前在干啥\nmitsuki -ec [msg] 发送紧急消息（需要有ec的权限）\nmitsuki -help 显示可用命令"); });
                        command.addCommand("-p").addAction(() => { context.msg.reply("您的权限为：" + context.getMiddlewareOutput("permissions").permissions); });
                        command.addCommand("-info").addAction(checkMyStatus);
                        command.addCommand("-ec").setPermission(permissions_1.PermissionSet.ec).addAction(ec);
                        command.addCommand("-d").addAction(() => { context.msg.reply("这里是mitsukiです！mitsuki是由gylove1994基于mirai及mirai-ts开发的QQ机器人。mitsuki正在早期测试阶段(框架构建中)，如果您看到了这条信息说明gylove1994那个傻逼正在对我捣鼓一些奇怪的东西。"); });
                        command.doCommand(context.getMiddlewareOutput("splitText").str[1], context.getMiddlewareOutput("permissions").permissionLv);
                    });
                    command.addCommand("admin").setPermission(permissions_1.PermissionSet.admin).addAction(() => {
                        let command = mitsuki.getCommand(context, mitsuki);
                        command.addCommand("-on").addAction(() => { mitsuki.setEnvValue("switch", { status: true }); context.msg.reply("mitsuki-bot已启用消息接管了哦0.0"); });
                        command.addCommand("-onto").addAction(onto);
                        command.addCommand("-off").addAction(() => { mitsuki.setEnvValue("switch", { status: false }); context.msg.reply("mitsuki-bot已关闭消息接管了哦0.0"); });
                        command.addCommand("-status").addAction(() => { context.msg.reply("mitsuki-bot目前的开启状态为：" + mitsuki.getEnvValue("switch").status); });
                        command.addCommand("-info").addAction(() => { mitsuki.setEnvValue("myStatus", { status: context.getMiddlewareOutput("splitText").str[2] }); context.msg.reply("目前状态已设置为：" + mitsuki.getEnvValue("myStatus").status); });
                        command.doCommand(context.getMiddlewareOutput("splitText").str[1], context.getMiddlewareOutput("permissions").permissionLv);
                    });
                    command.addDefaultCommand().addAction(defaultMsg);
                    command.doCommand(context.getMiddlewareOutput("splitText").str[0], context.getMiddlewareOutput("permissions").permissionLv);
                }
                catch (err) {
                    if (mitsuki.dev_mode == true)
                        mitsuki.logger.error(err);
                    else
                        mitsuki.api.sendFriendMessage(err.message, mitsuki.setting.qq_bind);
                }
            }
            else
                mitsuki.logger.info("bot未开启消息应答模式");
        }
        else if (context.msg.type == "GroupMessage") {
            mitsuki.logger.info("没有被at");
            // console.log(context.getMiddlewareOutput<SplitText>("splitText"))
        }
        else
            throw new Error("groupMsg控制器错误的处理了非GroupMessage事件");
    });
}
exports.groupMsg = groupMsg;
function onto(context, mitsuki) {
    console.log(context.getMiddlewareOutput("splitText"));
    if (/^\d+$/.test(context.getMiddlewareOutput("splitText").str[2]) && context.getMiddlewareOutput("splitText").str[3] !== undefined) {
        const unit = context.getMiddlewareOutput("splitText").str[3];
        switch (unit) {
            case "h":
                mitsuki.setEnvValue("switch", { status: true });
                context.msg.reply("已设置在" + parseInt(context.getMiddlewareOutput("splitText").str[2]) + "小时后关闭mitsuki-bot的消息应答");
                mitsuki.setEnvValue("offTime", { isSet: true, time: Date.now() + parseInt(context.getMiddlewareOutput("splitText").str[2]) * 3600000 });
                setTimeout(() => {
                    mitsuki.setEnvValue("switch", { status: false });
                    context.msg.reply("mitsuki-bot的消息应答已关闭");
                    mitsuki.setEnvValue("offTime", { isSet: false, time: 0 });
                }, parseInt(context.getMiddlewareOutput("splitText").str[2]) * 3600000);
                return;
            case "min":
                mitsuki.setEnvValue("switch", { status: true });
                context.msg.reply("已设置在" + parseInt(context.getMiddlewareOutput("splitText").str[2]) + "分钟后关闭mitsuki-bot的消息应答");
                mitsuki.setEnvValue("offTime", { isSet: true, time: Date.now() + parseInt(context.getMiddlewareOutput("splitText").str[2]) * 60000 });
                setTimeout(() => {
                    mitsuki.setEnvValue("switch", { status: false });
                    context.msg.reply("mitsuki-bot的消息应答已关闭");
                    mitsuki.setEnvValue("offTime", { isSet: false, time: 0 });
                }, parseInt(context.getMiddlewareOutput("splitText").str[2]) * 60000);
                return;
            case "s":
                mitsuki.setEnvValue("switch", { status: true });
                context.msg.reply("已设置在" + parseInt(context.getMiddlewareOutput("splitText").str[2]) + "秒后关闭mitsuki-bot的消息应答");
                mitsuki.setEnvValue("offTime", { isSet: true, time: Date.now() + parseInt(context.getMiddlewareOutput("splitText").str[2]) * 1000, why: "" });
                setTimeout(() => {
                    mitsuki.setEnvValue("switch", { status: false });
                    context.msg.reply("mitsuki-bot的消息应答已关闭");
                    mitsuki.setEnvValue("offTime", { isSet: false, time: 0, why: "" });
                }, parseInt(context.getMiddlewareOutput("splitText").str[2]) * 1000);
                return;
            default:
                context.msg.reply("时间单位参数错误，请重新输入");
        }
    }
    else
        context.msg.reply("时间参数错误，请重新输入");
}
function defaultMsg(context, mitsuki) {
    if (context.msg.type == "GroupMessage" && !mitsuki.getEnvValue("disableDefault").disableSet.includes(context.msg.sender.id)) {
        let endTime = 0;
        let time = "";
        if (mitsuki.getEnvValue("offTime").isSet) {
            endTime = (mitsuki.getEnvValue("offTime").time - Date.now()) / 60000;
            if (endTime.toString().length > 5)
                time = endTime.toString().slice(0, 5);
            context.msg.reply("现在这个QQ目前是由bot-mitsuki接管哦！\n接管结束时间还剩：" + time + "分钟，在群内@我并输入mitsuki -help获取可用命令列表（群内只对以@开头的信息有反应哦）");
        }
        else
            context.msg.reply("现在这个QQ目前是由bot-mitsuki接管哦！\n那个傻逼GY目前没有设置解除接管时间，在群内@我并输入mitsuki -help获取可用命令列表（群内只对@开头的信息有反应哦）");
        let disableSet = mitsuki.getEnvValue("disableDefault").disableSet;
        disableSet.push(context.msg.sender.id);
        mitsuki.setEnvValue("disableDefault", { disableSet: disableSet });
        setTimeout(() => {
            if (context.msg.type == "GroupMessage") {
                let disableSet = mitsuki.getEnvValue("disableDefault").disableSet.filter((id) => { return context.msg.type == "GroupMessage" && (context.msg.sender.id !== id); });
                mitsuki.setEnvValue("disableDefault", { disableSet: disableSet });
            }
        }, 10000);
    }
}
function checkMyStatus(context, mitsuki) {
    if (mitsuki.getEnvValue("myStatus").status == "")
        context.msg.reply("GY目前在干：未设置（这逼估计在摸鱼）");
    else
        context.msg.reply("GY目前在干：" + mitsuki.getEnvValue("myStatus").status);
    let endTime = 0;
    let time = "";
    if (mitsuki.getEnvValue("offTime").isSet && mitsuki.getEnvValue("myStatus").status !== "") {
        endTime = (mitsuki.getEnvValue("offTime").time - Date.now()) / 60000;
        if (endTime.toString().length > 5)
            time = endTime.toString().slice(0, 5);
        context.msg.reply("预计完成时间还剩：" + time + "分钟");
    }
    else
        context.msg.reply("那个傻逼GY没有设置预计完成的时间");
}
function ec(context, mitsuki) {
    if (context.msg.type == "GroupMessage") {
        context.msg.reply("您有紧急联系的权限，您的消息:\"" + context.getMiddlewareOutput("splitText").str[2] + "\"将被立刻发送0.0");
        mitsuki.api.sendFriendMessage("【紧急信息】" + context.msg.sender.memberName + ":" + context.getMiddlewareOutput("splitText").str[2], mitsuki.setting.qq_bind);
    }
}

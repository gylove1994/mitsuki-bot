import { Mitsuki } from './types/mitsuki'
import { permissions,Permission } from './middleware/permissions'
import path from 'path'

async function app() {
    const mitsuki = await Mitsuki.setup(path.join(__dirname,"./config/mitsukiSetting.json"))
    mitsuki.addController("FriendMessage").addMiddleware(permissions).setMainProcess((context)=>{
        mitsuki.logger.info(context.getMiddlewareOutput<Permission>("permissions").permissions)
    })
    mitsuki.ready()
}

app()
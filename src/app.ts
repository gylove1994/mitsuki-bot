import path from 'path'
import { friendMsg } from './controller/friendMsg'
import { Permission, permissions } from './middleware/permissions'
import { splitText } from './middleware/spiltText'
import { Mitsuki } from './types/mitsuki'

async function app() {
    const mitsuki = await Mitsuki.setup(path.join(__dirname,"./config/mitsukiSetting.json"),path.join(__dirname,"./config/envDefault.json"))
    mitsuki.addController("FriendMessage").addMiddleware(permissions,splitText).setMainProcess(friendMsg)
    mitsuki.ready()
}

app()
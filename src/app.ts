import { Mitsuki } from './types/mitsuki'
import path from 'path'
async function app() {
    const mitsuki = await Mitsuki.setup(path.join(__dirname, "./config/mitsukiSetting.json"))

    mitsuki.addController("FriendMessage").addMiddleware((msg) => { return msg }).setMainProcess((msg) => { console.log("hello_world") })
    
    mitsuki.ready()
}

app()
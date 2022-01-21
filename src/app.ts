import { Mitsuki } from './types/mitsuki';
import path from 'path'

async function app(){
    const mitsuki = new Mitsuki(path.join(__dirname,"./config/mitsukiSetting.json"))
    await mitsuki.linkDB()
    mitsuki.DevMode(process.env.NODE_ENV as string)
    mitsuki.ready();
}

app()
import { Mitsuki } from './types/mitsuki';
import path from 'path'

async function app(){
    
    const mitsuki = await Mitsuki.setup("./config/mitsukiSetting.json")

    mitsuki.ready()
}

app()
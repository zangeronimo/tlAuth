import 'reflect-metadata'
import { Extensions } from './src/application/extension'
import { ExtensionDI } from './src/infra/extensions'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.development' })
Extensions.init()
ExtensionDI.init()


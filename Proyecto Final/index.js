import { initServer } from './configs/app.js'
import { connect } from './configs/mong.js'
import { userDefect } from './src/user/user.controller.js'

initServer()
connect()
userDefect()
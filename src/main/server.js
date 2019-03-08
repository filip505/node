import '@babel/polyfill'
import express from 'express'
import bodyParser from 'body-parser'
import http from 'http'
import v1 from 'uuid'
// import { EntitySchema, createConnection, getRepository } from 'typeorm'
import { authMiddleware, oauthMiddleware } from './middleware'
import routers from './routes'
import { test } from './routes/auth.controller'
// import Fixtures from './fixtures'
import cors from 'cors'
// import Socket from './socket'
// import OneSignal from 'onesignal-node'

export default async (port) => {

  //const connection = await createConnection(config)
  //const fixtures = new Fixtures(connection)
  //const socket = new Socket()

  // const myClient = new OneSignal.Client({
  //   app: { appAuthKey: 'MDI4MDAwODUtZjQ2NC00MGFmLTlkYTctNWRhMzlkMDliMjY0', appId: '0596fb61-668e-4d9a-ba3a-3d5a3de4e16a' }
  // });
  // var firstNotification = new OneSignal.Notification({
  //   contents: {
  //     en: "Test notification",
  //     tr: "Test mesajı"
  //   },
  //   include_player_ids: ['f6524a0c-974b-4b58-9761-c42fcb8ad7fb']
  // });

  // myClient.sendNotification(firstNotification, function (err, httpResponse, data) {
  //   if (err) {
  //     console.log('Something went wrong...');
  //   } else {
  //     console.log(data);
  //   }
  // });

  //await connection.runMigrations()

  // for (const entity of config.entities) {
  //   const repository = await getRepository(entity.options.name);
  //   await repository.query(`DELETE FROM ${entity.options.name};`);
  // }
  // fixtures.init()

  // console.log('is clean', config.entities.length)
  // if (process.env.NODE_ENV === 'test') {


  // }
  console.log('running')
  let app = express()

  app.use(cors())
  app.use(bodyParser.json())
  app.use(authMiddleware)
  app.use(routers)
  // messageController(app, socket.sendMessage)
  //authController(app)
  //userController(app)
  //conversationController(app)

  app = http.createServer(app)

  const server = await app.listen(port)
  server.closeAll = () => {
    console.log('close all')
    connection.close()
    server.close()
    socket.connection.close()
  }
  console.log('___________________________')
  console.log('server started at port' + port)
  console.log('server env ' + process.env.NODE_ENV)
  return server
}
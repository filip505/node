
import '@babel/polyfill'
import express from 'express'
import bodyParser from 'body-parser'
import http from 'http'
import v1 from 'uuid'
import { EntitySchema, createConnection } from 'typeorm'
import { authMiddleware, oauthMiddleware } from './middleware'
import { authController, userController, messageController } from './routes'
import { User, Token, Message } from './models'
import Fixtures from './fixtures'
import cors from 'cors'
import Socket from './socket'

const config = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "node",
  password: "node",
  database: "node",
  synchronize: false,
  logging: false,
  migrations: ["./migration/*.js"],
  cli: {
    "migrationsDir": "migration"
  },
  entities: [
    new EntitySchema(User),
    new EntitySchema(Token),
    new EntitySchema(Message)
  ]
}

export const server = async (port) => {
  const connection = await createConnection(config)
  const fixtures = new Fixtures(connection)
  const socket = new Socket()
  await connection.runMigrations()
  // console.log('is clean', config.entities.length)
  // if (process.env.NODE_ENV === 'test') {


  // }

  let app = express()

  app.use(cors())
  app.use(bodyParser.json())
  app.use(authMiddleware)
  messageController(app, socket.sendMessage)
  authController(app)
  userController(app)

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
  console.log('database name ' + config.database)
  return server
}
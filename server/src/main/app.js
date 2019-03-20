import '@babel/polyfill'
import { createConnection, } from 'typeorm'
import { User, Token, Message, Conversation, Subject } from './models'
//eb deploy Mynode-env
//eb init -p docker mynode
const config = {
  type: "postgres",
  host: (process.env.DB_HOST) ? process.env.DB_HOST : 'localhost',
  port: 5432,
  username: (process.env.DB_USER) ? process.env.DB_USER : 'node',
  password: (process.env.DB_PASS) ? process.env.DB_PASS : 'node',
  database: "node",
  synchronize: false,
  logging: true,
  migrations: ["./migration/*.js"],
  cli: {
    "migrationsDir": "migration"
  },
  entities: [
    User,
    Conversation,
    Subject,
    Token,
    Message
  ]
}

console.log(process.env.DB_HOST)
console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)

let connection

createConnection(config).then(async function (newConnection) {
  connection = newConnection
  await require('./server').default(5001)
}, function (error) {
  console.log('error', error)
})

export default connection


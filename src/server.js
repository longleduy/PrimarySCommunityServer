import "regenerator-runtime/runtime"
import { ApolloServer } from 'apollo-server-express'
import * as http from 'http'
import * as https from 'https'
import * as fs from 'fs'
//Todo: DB connect
import { connectMongoDB } from './configs/mongoDBConnect'
//Todo: App middleware
import app from './app'
//Todo: GraphQl
import { schema } from './schemas/schemas'
//Todo: Error handler
//import { ErrorLogger } from './utils/logger'

//Todo: ENV
const connectApolloServer = async () => {
  const configurations = {
    production: { ssl: false, port: `${process.env.PORT}`, hostname: `${process.env.HOST_NAME_DEV}` },
    development: { ssl: false, port: `${process.env.PORT}`, hostname: `${process.env.HOST_NAME_DEV}` }
  }
  const environment = process.env.NODE_ENV || 'development'
  const config = configurations[environment]

  const server = new ApolloServer({
    schema,
    context: async ({ req, res, next }) => {
      return { req, res }
    },
    formatError: error => {
      throw error;
      const message = error.message;
      if (process.env.NODE_ENV == 'production') {
        console.log(error);
      }
      else {
        if (error.extensions.exception.name !== "dataFormInvalid") {
          // ErrorLogger(error.extensions.exception.stacktrace);
          console.log(error);
        }
      }
      return {
        ...error,
        message,
      };
    },
    playground: true
  });
  //Todo: Disable cors của ApolloServer nếu không nó sẽ đè lên cors của app => vấn đề về Sameorigin
  server.applyMiddleware({ app, cors: false });
  var sslServer;
  if (config.ssl) {
    sslServer = https.createServer({
      key: fs.readFileSync('./ssl/server.key'),
      cert: fs.readFileSync('./ssl/server.crt')
    }, app)
  } else {
    sslServer = http.createServer(app)
  }
  server.installSubscriptionHandlers(sslServer)
  sslServer.listen({ port: `${process.env.PORT}` });
}
(async function () {
  try {
    const connectDB = connectMongoDB();
    const connectServer = connectApolloServer();
    await connectDB;
    await connectServer;
    console.log(`Apollo server, MongoDB connecting...`)
  } catch (error) {
    console.log(error);
  }
})();


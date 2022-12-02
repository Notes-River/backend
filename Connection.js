module.exports = (dburl) => {
  const mongoose = require('mongoose')

  mongoose.Promise = Promise

  mongoose.connection.on('connected', () => {
    console.log('Connection Established with : notes_river');
    console.log('Local: ', false);

  })

  mongoose.connection.on('reconnected', () => {
    console.log('Connection Reestablished')
  })

  mongoose.connection.on('disconnected', () => {
    console.log('Connection Disconnected')
  })

  mongoose.connection.on('close', () => {
    console.log('Connection Closed')
  })

  mongoose.connection.on('error', (error) => {
    console.log('ERROR: ' + error)
  })
  const run = async () => {
    await mongoose.connect(dburl, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true
    })
  }

  run().catch(error => console.error(error))
}
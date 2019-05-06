const {OneSignal} = require('./pushService.js')
const {messageToOneSignal} = require('./converter.js')
const toParseBody = (record) => JSON.parse(record.body)

module.exports.handler = async (event, context) => {

  console.log(`Received event ${JSON.stringify(event)}`)

  const token = process.env.ONESIGNAL_TOKEN
  const url = process.env.ONESIGNAL_URL
  
  const sender = new OneSignal(token, url)

  const push = (message) => sender.send(message)
  
  const requests =  event
                      .Records
                        .map(toParseBody)
                          .map(messageToOneSignal)
                            .map(push)   

  await Promise.all(requests)

  return {}                     
}
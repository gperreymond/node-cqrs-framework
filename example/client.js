'use strict'

const config = require('./lib/config')
const bus = require('servicebus').bus(config.get('CQRS_RABBITMQ_URL'))
const uuid = require('uuid')

const cid = uuid.v4()

let result = {}
let max = 2

bus.listen('GroupIndividualsByEmailDomainExcludeMinimumQuery.Success:' + cid, (event) => {
  result.GroupIndividualsByEmailDomainExcludeMinimumQuery = event
  max -= 1
  if (max === 0) {
    console.log(result)
    process.exit(0)
  }
})

bus.listen('FindIndividualsByEmailMatchingGmailQuery.Success:' + cid, (event) => {
  result.FindIndividualsByEmailMatchingGmailQuery = event
  max -= 1
  if (max === 0) {
    console.log(result)
    process.exit(0)
  }
})

bus.on('ready', () => {
  bus.publish('FindIndividualsByEmailMatchingGmailQuery.Event', {
    requester: cid
  })
  bus.publish('GroupIndividualsByEmailDomainExcludeMinimumQuery.Event', {
    requester: cid
  })
})

bus.on('error', (error) => {
  console.log(error)
})

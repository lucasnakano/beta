const {OneSignal, OneSignalError} = require('../../main/sendPush/pushService.js')
const should = require('should');
const nock = require('nock')
const sinon = require('sinon')

const ONESIGNAL_URL = 'https://onesignal.com/api/v1/notifications'
const ONESIGNAL_KEY = 'abcd-123'
const ONESIGNAL_TOKEN = '123'

describe('Onsignal', () => {
    const message = {
        include_player_ids: ['aa1c9204-6520-11e9-a923-1681be663d3e'],
        app_id: '123',
        contents: { en: 'Ana quer alugar o seu carro. Veja mais' },
        url: 'moobie:///partner/bookings/66706a4e-6520-11e9-a923-1681be663d3e',
        data: { uri: 'moobie:///partner/bookings/66706a4e-6520-11e9-a923-1681be663d3e' },
        heading: { en: 'Nova solicitação de reserva' },
        ios_attachments: { thumb: 'http://thumb....' }
    }

    const publisher = new OneSignal(ONESIGNAL_TOKEN, ONESIGNAL_URL)

    const mocked_onesignal_endpoint = nock(ONESIGNAL_URL)
                                        .post('') 
                                            .matchHeader('Content-type', `application/json; charset=UTF-8`)
                                            .matchHeader('Authorization', `Basic ${ONESIGNAL_TOKEN}`)

    before(() => {
        sinon.spy(publisher, '_sendOneSignal')
        sinon.spy(publisher, '_isSuccess')
    })

    it('should send a push to onesignal with a valid payload', async () => {
        
        mocked_onesignal_endpoint
            .reply(200, { "id": "458dcec4-cf53-11e3-add2-000c2940e62c", "recipients": 3 }) 

        let result = await publisher.send(message)

        result.ok.should.be.equal(true)
        publisher._sendOneSignal.calledOnce.should.be.equal(true)
        publisher._isSuccess.calledOnce.should.be.equal(true)
    })


    it('should throw error when given the http 400 as status code', () => {
        mocked_onesignal_endpoint
            .reply(400, { "errors": ["Notification content must not be null for any languages."]}) 
    
        return publisher.send(message).should.be.rejectedWith(OneSignalError)
    })

    it('should throw error when given an invalid player ids', () => {
        mocked_onesignal_endpoint
            .reply(200, { "errors": { "invalid_player_ids" : ["5fdc92b2-3b2a-11e5-ac13-8fdccfe4d986", "00cb73f8-5815-11e5-ba69-f75522da5528"]}}) 
    
        return publisher.send(message).should.be.rejectedWith(OneSignalError)
    })
   
    it('should throw error when given a no subscribed player', () => {
        mocked_onesignal_endpoint
            .reply(200, {"id": "", "recipients": 0, "errors": ["All included players are not subscribed"]}) 
    
        return publisher.send(message).should.be.rejectedWith(OneSignalError)
    })
})
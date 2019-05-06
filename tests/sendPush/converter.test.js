const {messageToOneSignal} = require('../../main/sendPush/converter.js')

const should = require('should');

const shouldContainsOnlyKeys = (object) => (...keys) => { 
    const keysOfObject = Object.keys(object)

    keys.length.should.be.equal(keys.length)

    keysOfObject.should.containDeep(keys)    
}

process.env.ONESIGNAL_KEY = '123'

describe('Converter', () => {
    const message = JSON.parse(`{
        "user_id":"5388d9de-6520-11e9-a923-1681be663d3e",
        "provider_id":["aa1c9204-6520-11e9-a923-1681be663d3e"],
        "title":"Nova solicitação de reserva",
        "message":"Ana quer alugar o seu carro. Veja mais",
        "deep_link":"moobie:///partner/bookings/66706a4e-6520-11e9-a923-1681be663d3e",
        "image_url":"http://thumb...."}`)

    it('Should convert sqs message with image_url field to onesignal payload with ios_attachments field', () => {

        let result = messageToOneSignal(message)

        shouldContainsOnlyKeys(result)('app_id', 'contents', 'headings', 'data', 'url', 'ios_attachments', 'include_player_ids')

        result.include_player_ids.length.should.be.equal(1)
        result.include_player_ids.should.containEql('aa1c9204-6520-11e9-a923-1681be663d3e')

        result.app_id.should.be.equal('123')

        shouldContainsOnlyKeys(result.contents)('en')
        result.contents.en.should.be.equal('Ana quer alugar o seu carro. Veja mais')

        shouldContainsOnlyKeys(result.data)('uri')
        result.data.uri.should.be.equal('moobie:///partner/bookings/66706a4e-6520-11e9-a923-1681be663d3e')
        
        shouldContainsOnlyKeys(result.headings)('en')
        result.headings.en.should.be.equal('Nova solicitação de reserva')
        
        result.url.should.be.equal('moobie:///partner/bookings/66706a4e-6520-11e9-a923-1681be663d3e')

        shouldContainsOnlyKeys(result.ios_attachments)('thumb')
        result.ios_attachments.thumb.should.be.equal('http://thumb....')
    })

    it('Should convert sqs message without image_url field to onesignal payload without ios_attachments field', () => {
        let result = messageToOneSignal(message)

        shouldContainsOnlyKeys(result)('app_id', 'contents', 'headings', 'data', 'url', 'include_player_ids')

        result.include_player_ids.length.should.be.equal(1)
        result.include_player_ids.should.containEql('aa1c9204-6520-11e9-a923-1681be663d3e')

        result.app_id.should.be.equal('123')

        shouldContainsOnlyKeys(result.contents)('en')
        result.contents.en.should.be.equal('Ana quer alugar o seu carro. Veja mais')

        shouldContainsOnlyKeys(result.data)('uri')
        result.data.uri.should.be.equal('moobie:///partner/bookings/66706a4e-6520-11e9-a923-1681be663d3e')
        
        shouldContainsOnlyKeys(result.headings)('en')
        result.headings.en.should.be.equal('Nova solicitação de reserva')
        
        result.url.should.be.equal('moobie:///partner/bookings/66706a4e-6520-11e9-a923-1681be663d3e')
    })
})
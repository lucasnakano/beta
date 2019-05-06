const fetch = require('node-fetch')

class OneSignalError extends Error {}

class OneSignal {
    constructor(token, url) {
        this._token = token
        this._url = url
    }
    
    async send(payload) {
        const response = await this._sendOneSignal(payload)
        const body = await response.json()
        const isSuccessResponse = this._isSuccess(response, body)

        console.log(`Onesignal response with ${response.status} and with body ${JSON.stringify(body)}.`)

        if(!isSuccessResponse) {                    
            const textPayload = JSON.stringify(payload)
            const textResponseBody = JSON.stringify(body)
            
            console.log(`[SEND_PUSH][ONE_SIGNAL][FAIL] Cannot send this payload ${textPayload} to onesignal. Retrive ${response.status} as status code and ${textResponseBody} as body`)

            throw new OneSignalError(`[SEND_PUSH][ONE_SIGNAL][FAIL] Cannot send this payload ${textPayload} to onesignal. Retrive ${response.status} as status code and ${textResponseBody} as body`)
        }

        console.log('Success Finish')

        return response
    }

    _isSuccess(response, body)  {
        if (response.ok) {                                    
            const hasErrorsField = Object.keys(body).includes('errors')

            return !hasErrorsField
        }

        return false
    }

    _sendOneSignal(payload) {
        const request = { 
            method: 'POST',
            headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": `Basic ${this._token}`
            },
        
            body: JSON.stringify(payload)
        }
        
        console.log(`Request onesignal in this url '${this._url}' with this configuration ${JSON.stringify(request)}`)

        return fetch(this._url, request)  
    }
}

module.exports.OneSignal = OneSignal
module.exports.OneSignalError = OneSignalError
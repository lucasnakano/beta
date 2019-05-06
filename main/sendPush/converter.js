module.exports.messageToOneSignal = (message) => {
    let payload = {
        'include_player_ids': message.provider_id,
        'app_id': process.env.ONESIGNAL_KEY,
        'contents': { 'en': message.message },
        'url': message.deep_link,
        'data': { 'uri': message.deep_link },
        'headings': { 'en': message.title },
    }

    if (Object.keys(message).includes('image_url')) {
        payload['ios_attachments'] = { 'thumb': message.image_url }
    }

    return payload
}
const { MessageEmbed } = require('discord.js')
const { API } = require('nhentai-api')
const api = new API()

module.exports = {
  name: 'sauce'
  , aliases: [
    'gimmesauce'
    , 'finddoujin'
    , 'doujin'
    , 'nhentai'
    , 'saucefor'
  ]
  , guildOnly: true
  , cooldown: {
    time: 30000
    , message: 'You are going too fast! Please slow down to avoid being rate-limited!'
  }
  , nsfw: true
  , group: 'anime'
  , description: 'Fetch doujin information from <:nhentai:723108426896375848> [nHentai](https://nhentai.net "nHentai Homepage")'
  , clientPermissions: [
    'EMBED_LINKS'
  ]
  , examples: [
    'sauce 263492'
    , 'saucefor 166258'
  ]
  , parameters: [
    'Media ID'
  ]
  , run: async ( client, message, [id] ) => {

    if (!id || isNaN(id)) {
      client.commands.cooldowns.get('sauce')
        .users.delete(message.author.id)
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Please provide a valid **Sauce**.`)
    }

    const prompt = new MessageEmbed()
                  .setColor('YELLOW')
                  .setThumbnail('https://i.imgur.com/u6ROwvK.gif')
                  .setDescription(`Searching for **${id}** on <:nhentai:723108426896375848> [nHentai.net](https:/nhentai.net 'nHentai Homepage').`)

    const msg = await message.channel.send(prompt)

    const book = await api.getBook(id).catch(()=>null)

    if (!book){
      prompt.setColor('RED')
            .setThumbnail(null)
            .setDescription(`\u200b\n<:cancel:712586986216489011> | ${message.author}, Couldn't find doujin with sauce: **${id}**.\n\u200b`)
      return await msg.edit(prompt).catch(()=>null)
             ? null
             : await message.channel.send(prompt).then(()=> null)
    }

    const { title: { english, japanese, pretty },
            tags, pages, uploaded, cover } = book

    const embed = new MessageEmbed()
    .setAuthor(pretty, null, `https://nhentai.net/g/${id}`)
    .setDescription(`
      **${english}**
      *${japanese}*
      `)
    .addField('TAGS', tags.map( m => m.name).sort().join(', '))
    .addField('PAGES', pages.length, true)
    .addField('\u200b',`[\`[LINK]\`](https://nhentai.net/g/${id} 'Click here to proceed to ${pretty}'s nHentai Page')`,true)
    .setTimestamp(uploaded)
    .setThumbnail(api.getImageURL(cover))
    .setColor('GREY')
    .setFooter('Uploaded on')

    return await msg.edit(embed).catch(()=>null)
           ? null
           : await message.channel.send(embed).then(()=> null)
  }
}

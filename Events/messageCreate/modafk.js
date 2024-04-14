const { Client, Message } = require('discord.js')
const wait = require('node:timers/promises').setTimeout;
const chalk = require('chalk')
const AdminAFK = require('../../Database/adminafklist')
/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 */

module.exports = async (client, message) => {

    if (message.author.bot) return
    if (message.guild.id !== '900742301373042809') return
    if (message.member.roles.cache.has('900747529384247336')) return

    const mentioned = message.mentions.users.first()
    //console.log(chalk.blueBright('[DEBUG] ') + mentioned)
    if (mentioned === undefined) {
        return
    } else {
        const member = await message.guild.members.fetch(mentioned)
        let status = member.presence?.status ?? 'offline'
        if (status === null) {
            status = 'offline'
        }

        AdminAFK.findOne({ UserID: member.id }, async (err, data) => {
            if (err) throw err
            if (!data) return console.log(`${chalk.blueBright('[DEBUG]')} ${member.user.username}'s Status: ${status} Trạng Thái AFK: ${key}`)
            if (data) {
                let key = data.Key
                await wait(500)
                console.log(`${chalk.blueBright('[DEBUG]')} ${member.user.username}'s Status: ${status} Trạng Thái AFK: ${key}`)
                switch (status) {
                    case 'dnd':
                    case 'offline':
                        {
                            if (member.roles.cache.has('900747529384247336') && key)
                                message.channel.send(`<:MioYamero:1153319903441461319> ${message.member}, Oi! Bạn Ping Một Người Trong \`PCB Team\` (${member.user.username}) Thế Này Lúc Họ Bận Hay AFK... Nếu Họ Cáu Thì Bạn Tính Sao?`)
                        }
                    default:
                        {
                            console.log(`${chalk.blueBright('[DEBUG]')} ${member.user.username}'s Status: ${status} Trạng Thái AFK: ${key}`)
                        }
                }
            }
        })

    }
}
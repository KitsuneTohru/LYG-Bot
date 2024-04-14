const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const chalk = require('chalk')

const cdSchema = require('../../Database/cooldown')
const FooterEmbeds = require('../../Utils/embed')
const BypassList = require('../../Utils/cdbypass')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Lấy Avatar URL Của Người Dùng Bạn Chọn, Hoặc Avatar Của Bạn')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Avatar Của Người Dùng Cần Show')
                .setRequired(false))
        .addBooleanOption(option =>
            option.setName('banner')
                .setDescription('Show Banner Của Người Dùng, Nếu Muốn')
                .setRequired(false)),
    async execute(interaction) {
        await interaction.deferReply()
        const FooterEmbeds_ = FooterEmbeds
        const iuser = await interaction.guild.members.fetch(interaction.user.id)

        const cdtime = 5000
        var user = interaction.options.getUser('user') || interaction.user
        user = await user.fetch()
        let BannerUrl = user.bannerURL({ extension: 'png', size: 512, dynamic: true })
        console.log(`${chalk.cyanBright('[DEBUG]')} ${BannerUrl}`)

        const bannerkey = interaction.options.getBoolean('banner') || false

        const auser = interaction.user.id

        function BypassCD(auser) {
            const CDPassList = BypassList
            for (var i in CDPassList) {
                if (auser === CDPassList[i]) {
                    return true
                }
            }
            return false
        }
        const Bypass_ = BypassCD(auser)
        cdSchema.findOne({ UserID: interaction.user.id }, async (err, data) => {
            if (err) throw err
            if (!data) {
                cdSchema.create({
                    UserID: interaction.user.id,
                    CDAvatar: Date.now(),
                })
            } if (data) {
                const cduser = data.UserID
                const CDTime = data.CDAvatar
                console.log(chalk.yellow('[Command: Avatar]') + ` ${cduser}, ${CDTime}, ${Date.now()}`)
                if (CDTime > Date.now() && !Bypass_) {
                    const cdembed = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle(`<a:LYG_Clock:1084322030331105370> **Command - Cooldown**`)
                        .setAuthor({ name: `${interaction.user.username}`, iconURL: `${iuser.displayAvatarURL({ dynamic: true, size: 512 })}` })
                        .setDescription(`<:LYG_FubukiPing1:1084085915368050788> | <@${cduser}> Oi! Bạn Phải Chờ Đến <t:${Math.round(CDTime / 1000)}> (<t:${Math.round(CDTime / 1000)}:R>) Mới Có Thể Thực Hiện Lệnh Nhé!`)
                        .setTimestamp()
                        .setFooter({ text: `${FooterEmbeds_[0][0]}`, iconURL: `${FooterEmbeds_[1][Math.floor(Math.random() * FooterEmbeds_[1].length)]}` })
                    await interaction.editReply({
                        embeds: [cdembed]
                    })
                }
                else {
                    data.CDAvatar = Date.now() + cdtime
                    data.save()
                    const user_embed = new EmbedBuilder()
                        .setAuthor({ name: `${interaction.user.username}`, iconURL: `${iuser.displayAvatarURL({ dynamic: true, size: 512 })}` })
                        .setTitle(`<:LYG_Okayu_Mogu:1089566808719237210> **Avatar Displayer**`)
                        .setDescription(`[PNG Format](${user.displayAvatarURL({ dynamic: true, size: 512, extension: 'png' })}) • [JPG Format](${user.displayAvatarURL({ dynamic: true, size: 512, extension: 'jpg' })}) • [WEBP Format](${user.displayAvatarURL({ dynamic: true, size: 512, extension: 'webp' })})\n<a:OrinSway:1160295722009251870> **(User: ${user})**`)
                        .setColor('Blue')
                        .setTimestamp()
                        .setImage(`${user.displayAvatarURL({ dynamic: true, size: 2048, extension: 'png' })}`)
                        .setFooter({ text: `${FooterEmbeds_[0][0]}`, iconURL: `${FooterEmbeds_[1][Math.floor(Math.random() * FooterEmbeds_[1].length)]}` })
                    await interaction.editReply({
                        embeds: [user_embed]
                    })
                    if (BannerUrl !== null && bannerkey) {
                        const banner_embed = new EmbedBuilder()
                            .setAuthor({ name: `${interaction.user.username}`, iconURL: `${iuser.displayAvatarURL({ dynamic: true, size: 512 })}` })
                            .setTitle(`<:LYG_Okayu_Mogu:1089566808719237210> **Banner Displayer**`)
                            .setDescription(`[Banner URL](${BannerUrl})\n<a:OrinSway:1160295722009251870> **(User: ${user})**`)
                            .setColor('Blue')
                            .setTimestamp()
                            .setImage(`${BannerUrl}`)
                            .setFooter({ text: `${FooterEmbeds_[0][0]}`, iconURL: `${FooterEmbeds_[1][Math.floor(Math.random() * FooterEmbeds_[1].length)]}` })
                        await interaction.followUp({
                            embeds: [banner_embed]
                        })
                    }
                }
            }
        })
    }
}

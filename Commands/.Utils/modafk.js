const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const AdminAFK = require('../../Database/adminafklist')
const FooterEmbeds = require('../../Utils/embed')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('modafk')
        .setDescription('Set Trạng Thái AFK Của Staff Team')
        .addBooleanOption(option =>
            option.setName('status')
                .setDescription('Trạng Thái AFK Của Bạn')
                .setRequired(false)),
    async execute(interaction) {
        await interaction.deferReply()
        
        const iuser = await interaction.guild.members.fetch(interaction.user.id)
        const FooterEmbeds_ = FooterEmbeds
        const AFK_KEY = await interaction.options.getBoolean('status') || false

        const usemem = await interaction.guild.members.fetch(interaction.user.id)
        var usingkey = false
        if (usemem.roles.cache.has('900747529384247336')) {
            usingkey = true
        }

        if (usingkey) {
            AdminAFK.findOne({ UserID: interaction.user.id }, async (err, data) => {
                if (err) throw err
                if (!data) {
                    if (!AFK_KEY) {
                        const SkipKey = new EmbedBuilder()
                            .setColor('DarkButNotBlack')
                            .setTitle(`<:JustOrin:1156221079988215879> **Key Skipped!**`)
                            .setAuthor({ name: `${interaction.user.username}`, iconURL: `${iuser.displayAvatarURL({ dynamic: true, size: 512 })}` })
                            .setDescription(`${interaction.user}\n> Lạy Bác, Với Key Là **${AFK_KEY}** Thì Skip Luôn, Thêm Gi Cho Mệt Vậy!`)
                            .setTimestamp()
                            .setFooter({ text: `${FooterEmbeds_[0][0]}`, iconURL: `${FooterEmbeds_[1][Math.floor(Math.random() * FooterEmbeds_[1].length)]}` })
                        await interaction.editReply({
                            embeds: [SkipKey]
                        })
                    } else {
                        AdminAFK.create({
                            UserID: interaction.user.id,
                            Key: AFK_KEY
                        })
                        const NewKey = new EmbedBuilder()
                            .setColor('Green')
                            .setTitle(`<:JustOrin:1156221079988215879> **Key Added!**`)
                            .setAuthor({ name: `${interaction.user.username}`, iconURL: `${iuser.displayAvatarURL({ dynamic: true, size: 512 })}` })
                            .setDescription(`${interaction.user}\n> Đã Set Trạng Thái AFK Của Bạn Là \`${AFK_KEY}\``)
                            .setTimestamp()
                            .setFooter({ text: `${FooterEmbeds_[0][0]}`, iconURL: `${FooterEmbeds_[1][Math.floor(Math.random() * FooterEmbeds_[1].length)]}` })
                        await interaction.editReply({
                            embeds: [NewKey]
                        })
                    }
                }
                if (data) {
                    data.Key = AFK_KEY
                    const EditKey = new EmbedBuilder()
                        .setColor('Green')
                        .setTitle(`<:JustOrin:1156221079988215879> **Key Added!**`)
                        .setAuthor({ name: `${interaction.user.username}`, iconURL: `${iuser.displayAvatarURL({ dynamic: true, size: 512 })}` })
                        .setDescription(`${interaction.user}\n> Đã Chỉnh Sửa Trạng Thái AFK Của Bạn Là \`${AFK_KEY}\``)
                        .setTimestamp()
                        .setFooter({ text: `${FooterEmbeds_[0][0]}`, iconURL: `${FooterEmbeds_[1][Math.floor(Math.random() * FooterEmbeds_[1].length)]}` })
                    await interaction.editReply({
                        embeds: [EditKey]
                    })
                    data.save()
                }
            })
        } else {
            const NoPerm = new EmbedBuilder()
                .setColor('DarkAqua')
                .setTitle(`<:OrinBruh:1160295126996881448> Không Đủ Thẩm Quyền`)
                .setAuthor({ name: `${interaction.user.username}`, iconURL: `${iuser.displayAvatarURL({ dynamic: true, size: 512 })}` })
                .setDescription(`<:LYG_KeqingDoi:1086190826536849499> | Bạn Không Có Đủ Thẩm Quyền, Làm Thế Nào Bạn Có Thể Dùng Lệnh Hả???`)
                .setTimestamp()
                .setFooter({ text: `${FooterEmbeds_[0][0]}`, iconURL: `${FooterEmbeds_[1][Math.floor(Math.random() * FooterEmbeds_[1].length)]}` })
            await interaction.editReply({
                embeds: [NoPerm]
            })
        }
    }
}
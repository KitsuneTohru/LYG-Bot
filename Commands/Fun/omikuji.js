const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const chalk = require('chalk')

const wait = require('node:timers/promises').setTimeout;

const cdSchema = require('../../Database/cooldown')
const Type1Entries = require('../../Assets/Omikuji/type1')
const Type2Entries = require('../../Assets/Omikuji/type2')
const Type3Entries = require('../../Assets/Omikuji/type3')
const Type4Entries = require('../../Assets/Omikuji/type4')
const Type5Entries = require('../../Assets/Omikuji/type5')
const FooterEmbeds = require('../../Utils/embed')
const AchievementList = require('../../Database/achievement')
const AchievementAssets = require('../../Assets/Achievements/achievements')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('omikuji')
        .setDescription('Dùng Để Rút Quẻ May Mắn Hàng Ngày (Reset CD: 5h Sáng UTC+7)'),
    async execute(interaction) {
        await interaction.deferReply()
        
        let cardtype, rngtype

        function DailyCD() {
            var CD = new Date(Date.now())
            CD.setDate(CD.getDate() + 1)
            CD.setHours(5, 0, 0, 0)

            const Daily_CD = CD.getTime()
            return Daily_CD
        }
        const Daily_CD = DailyCD()

        const ColorList = [
            '#b9b9b9', //Type 1
            '#9aff84', //Type 2
            '#84eeff', //Type 3
            '#c76efa', //Type 4
            '#fffa00' //Type 5
        ]
        let Color
        const FooterEmbeds_ = FooterEmbeds
        //BUTTON TYPE 5 ENTRY
        const type5_1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('entrytype5_1')
                    .setLabel('| Kitsunezi: Backstory')
                    .setEmoji('1084085934926069823')
                    .setStyle(ButtonStyle.Secondary)
            )
        const type5_2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('entrytype5_2')
                    .setLabel('| Lazy Gang: Secret')
                    .setEmoji('1087692048280334347')
                    .setStyle(ButtonStyle.Secondary)
            )
        //THUẬT TOÁN LỌC USER Ở NÚT
        const user = interaction.user.id
        //THUẬT TOÁN RANDOM LẤY ENTRY
        var rng = Math.random() * 100.01
        rng = (Math.floor(rng * 100) / 100).toFixed(2)
        //rng = 100 //Test Rng
        var rng1 = -1, rng2 = -1, rng3 = -1, rng4 = -1
        //IMAGE URL: TYPE 3,4,5 SẼ CHỐT LẤY
        if (rng > 96)
            var img_url
        //ENTRY RUN
        let result;
        //ENTRY SET
        const type1 = Type1Entries
        const type2 = Type2Entries
        const type3e = Type3Entries[0]
        const type3l = Type3Entries[1]
        const type4e = Type4Entries[0]
        const type4l = Type4Entries[1]
        const type5e = Type5Entries[0]
        const type5l = Type5Entries[1]
        //TYPE 1 ENTRY: RNG ITEM: TRUE/IMG URL: FALSE
        if (rng <= 50) {
            rng1 = Math.floor(Math.random() * type1.length)
            result = type1[rng1]
            Color = ColorList[0]
            cardtype = chalk.hex(`${Color}`)('[Type: 1]')
        }
        //TYPE 2 ENTRY: RNG ITEM: TRUE/IMG URL: FALSE        
        else if (rng <= 75) {
            rng2 = Math.floor(Math.random() * type2.length)
            result = type2[rng2]
            Color = ColorList[1]
            cardtype = chalk.hex(`${Color}`)('[Type: 2]')
            rngtype = chalk.hex(`${Color}`)
        }
        //TYPE 3 ENTRY: RNG ITEM: TRUE/IMG_URL: TRUE
        else if (rng <= 90) {
            rng3 = Math.floor(Math.random() * type3e.length)
            result = type3e[rng3]
            img_url = type3l[rng3]
            Color = ColorList[2]
            cardtype = chalk.hex(`${Color}`)('[Type: 3]')
            rngtype = chalk.hex(`${Color}`)
        }
        //TYPE 4 ENTRY: RNG ITEM: FALSE/IMG_URL: TRUE
        else if (rng <= 99) {
            rng4 = Math.floor(Math.random() * type4e.length)
            result = type4e[rng4]
            img_url = type4l[rng4]
            Color = ColorList[3]
            cardtype = chalk.hex(`${Color}`)('[Type: 4]')
            rngtype = chalk.hex(`${Color}`)
        }
        //TYPE 5 ENTRY: RNG ITEM: FALSE/IMG_URL: TRUE/BONUS: BUTTON -> DMs
        else if (rng <= 99.5) {
            result = type5e[0]
            img_url = type5l[0]
            Color = ColorList[4]
            cardtype = chalk.hex(`${Color}`)('[Type: 5]')
            rngtype = chalk.hex(`${Color}`)
        }
        else {
            result = type5e[1]
            img_url = type5l[1]
            Color = ColorList[4]
            cardtype = chalk.hex(`${Color}`)('[Type: 5]')
            rngtype = chalk.hex(`${Color}`)
        }

        //EMBED TYPE 5 ENTRY
        const KitsuneziEmbed = new EmbedBuilder()
            .setColor('Red')
            .setTitle(`<:LYG_FubukiPain:1084085934926069823> **Kitsunezi's Backstory**`)
            .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true, size: 512 })}` })
            .setDescription(Type5Entries[2][0])
            .setTimestamp(Date.now())
            .setImage(img_url)
            .setFooter({ text: `${FooterEmbeds_[0][0]}`, iconURL: `${FooterEmbeds_[1][Math.floor(Math.random() * FooterEmbeds_[1].length)]}` })
        const LYGEmbed = new EmbedBuilder()
            .setColor('Yellow')
            .setTitle(`<a:LYG_Planet:1084085941821513789> **LYG's Secret**`)
            .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true, size: 512 })}` })
            .setDescription(Type5Entries[2][1])
            .setTimestamp(Date.now())
            .setImage(img_url)
            .setFooter({ text: `${FooterEmbeds_[0][0]}`, iconURL: `${FooterEmbeds_[1][Math.floor(Math.random() * FooterEmbeds_[1].length)]}` })
        cdSchema.findOne({ UserID: interaction.user.id }, async (err, data) => {
            if (err) throw err
            if (!data) {
                cdSchema.create({
                    UserID: interaction.user.id,
                    CDOmikuji: Date.now(),
                })
            } if (data) {
                const cduser = data.UserID
                const CDTime = data.CDOmikuji
                console.log(chalk.yellow('[Command: Omikuji]') + ` ${cduser}, ${CDTime}, ${Date.now()}`)
                if (CDTime > Date.now()) { //Line Này Dùng /* Nếu Test Bỏ Qua CD
                    const cdembed = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle(`<a:LYG_Clock:1084322030331105370> **Command - Cooldown**`)
                        .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true, size: 512 })}` })
                        .setDescription(`<:LYG_FubukiPing1:1084085915368050788> | <@${cduser}> Oi! Bạn Phải Chờ Đến <t:${Math.round(CDTime / 1000)}> (<t:${Math.round(CDTime / 1000)}:R>) Mới Có Thể Thực Hiện Lệnh Nhé!`)
                        .setTimestamp()
                        .setFooter({ text: `${FooterEmbeds_[0][0]}`, iconURL: `${FooterEmbeds_[1][Math.floor(Math.random() * FooterEmbeds_[1].length)]}` })
                    await interaction.editReply({
                        embeds: [cdembed]
                    })
                } //Line Này Dùng */ Nếu Bỏ Qua CD
                else { //Line Này Dùng // Nếu Bỏ Qua CD
                    data.CDOmikuji = Daily_CD
                    data.save()
                    //EMBED READY
                    const DrawingCard = new EmbedBuilder()
                        .setColor('White')
                        .setTitle(`**<:LYG_Omikuji:1084322622491344937> Đền Thần - Rút Quẻ Hàng Ngày**`)
                        .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true, size: 512 })}` })
                        .setDescription(`<:LYG_Omikuji:1084322622491344937> | Thẻ Của Bạn Đang Được Rút... Xin Vui Lòng Chờ...`)
                        .setTimestamp(Date.now())
                        .setFooter({ text: `${FooterEmbeds_[0][0]}`, iconURL: `${FooterEmbeds_[1][Math.floor(Math.random() * FooterEmbeds_[1].length)]}` })
                    await interaction.editReply({
                        embeds: [DrawingCard]
                    })
                    await wait(2000)
                    //EMBED GỐC ENTRY
                    const OmikujiCard = new EmbedBuilder()
                        .setColor(Color)
                        .setTitle(`**<:LYG_Omikuji:1084322622491344937> Đền Thần - Rút Quẻ Hàng Ngày**`)
                        .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true, size: 512 })}` })
                        .setDescription(result)
                        .setTimestamp(Date.now())
                        .setImage(img_url)
                        .setFooter({ text: `${FooterEmbeds_[0][0]}`, iconURL: `${FooterEmbeds_[1][Math.floor(Math.random() * FooterEmbeds_[1].length)]}` })
                    await interaction.editReply({
                        embeds: [OmikujiCard],
                    })
                    if (rng > 99 && rng <= 99.5) {
                        await interaction.editReply({
                            embed: [embed],
                            components: [type5_1]
                        })
                    }
                    else if (rng > 99.5 && rng <= 100) {
                        await interaction.editReply({
                            embed: [embed],
                            components: [type5_2]
                        })
                    }
                    //Trigger Nút    
                    const filter = a => a.user.id === user
                    const message = await interaction.fetchReply()
                    const collector = interaction.channel.createMessageComponentCollector({ message, filter, time: 15 * 60 * 1000 })
                    collector.on('collect', async a => {
                        var key = true
                        const t5user = await interaction.guild.members.fetch(interaction.user.id)
                        if (a.customId === 'entrytype5_1') {
                            if (key) {
                                await wait(500)
                                try {
                                    t5user.send({
                                        embeds: [KitsuneziEmbed]
                                    })
                                    interaction.editReply({
                                        embeds: [embed],
                                        components: []
                                    })
                                    interaction.followUp({
                                        content: 'Đã Gửi Embed, Nhớ Check DMs Của Bạn Nhé!!!'
                                    })
                                } catch (err) {
                                    interaction.followUp({
                                        content: 'Oi! Bạn Hãy Mở DMs Của Bạn Để Có Thể Coi Nhé!'
                                    })
                                }
                            }
                        }
                        if (a.customId === 'entrytype5_2') {
                            if (key) {
                                await wait(500)
                                try {
                                    t5user.send({
                                        embeds: [LYGEmbed]
                                    })
                                    interaction.editReply({
                                        embeds: [embed],
                                        components: []
                                    })
                                    interaction.followUp({
                                        content: 'Đã Gửi Embed, Nhớ Check DMs Của Bạn Nhé!!!'
                                    })
                                } catch (err) {
                                    interaction.followUp({
                                        content: 'Oi! Bạn Hãy Mở DMs Của Bạn Để Có Thể Coi Nhé!'
                                    })
                                }
                            }
                        }
                    })
                    console.log('========================================\n', cardtype,' Số Encounter: ', rngtype(`${rng}`), rng1, rng2, rng3, rng4, '\n========================================')
                }
                //Achievements On Omikuji
                var a4key = "No", a5key = "No"
                var achievementdesc, achievementlink, achievementcolor = '#000000'
                if (rng > 99 && rng <= 99.5) {
                    achievementdesc = `> Chúc Mừng Người Dùng ${interaction.user} Đã Mở Khóa Thành Tựu Mới!!!\n${AchievementAssets[1][3]}`
                    achievementlink = AchievementAssets[0][3]
                    achievementcolor = AchievementAssets[2][0]
                    a4key = "Yes"
                }
                if (rng > 99.5 && rng <= 100) {
                    achievementdesc = `> Chúc Mừng Người Dùng ${interaction.user} Đã Mở Khóa Thành Tựu Mới!!!\n${AchievementAssets[1][4]}`
                    achievementlink = AchievementAssets[0][4]
                    achievementcolor = AchievementAssets[2][0]
                    a5key = "Yes"
                }

                const OmikujiAchivements = new EmbedBuilder()
                    .setColor(achievementcolor)
                    .setTitle(`<:YuyukoWoah:1152872168439423050> **Achievement Unlocked!!!**`)
                    .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL({ dynamic: true, size: 512 })}` })
                    .setDescription(`${achievementdesc}`)
                    .setTimestamp()
                    .setImage(achievementlink)
                    .setFooter({ text: `${FooterEmbeds_[0][0]}`, iconURL: `${FooterEmbeds_[1][Math.floor(Math.random() * FooterEmbeds_[1].length)]}` })

                AchievementList.findOne({ UserID: interaction.user.id }, async (err, data1) => {
                    if (err) throw err
                    if (!data1) {
                        AchievementList.create({
                            UserID: interaction.user.id,
                            A4: a4key,
                            A5: a5key,
                        })
                        if (a4key === "Yes" || a5key === "Yes") {
                            await interaction.followUp({
                                embeds: [OmikujiAchivements]
                            })
                        }
                    } if (data1) {
                        const A4 = data1.A4
                        const A5 = data1.A5

                        if (!A4) {
                            data1.A4 = a4key
                        }
                        if (!A5) {
                            data1.A5 = a5key
                        }

                        if (A4 === "No") {
                            if (rng > 99 && rng <= 99.5) {
                                data1.A4 = "Yes"
                                await interaction.followUp({
                                    embeds: [OmikujiAchivements]
                                })
                            }
                        }
                        if (A5 === "No") {
                            if (rng > 99.5 && rng <= 100) {
                                data1.A5 = "Yes"
                                await interaction.followUp({
                                    embeds: [OmikujiAchivements]
                                })
                            }
                        }
                        data1.save()
                    }
                })
            } //Line Này Dùng // Nếu Bỏ Qua CD
        })
    }
}
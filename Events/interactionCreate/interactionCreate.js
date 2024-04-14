const chalk = require('chalk')
const { EmbedBuilder } = require('discord.js')
const allowed_guilds = require('../../Utils/limitedguilds')
const FooterEmbeds = require('../../Utils/embed')

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(chalk.red('[ERROR]') + ` Không Có Command Khớp Với ${interaction.commandName}`);
        return;
    }
    try {
        console.log(`${chalk.cyanBright('[DEBUG]')} Interaction Guild ID: ${interaction.guild.id}`)
        const FooterEmbeds_ = FooterEmbeds
        const iuser = await interaction.guild.members.fetch(interaction.user.id)
        let usingkey = false
        for (var i = 0; i < allowed_guilds.length; i++) {
            if (interaction.guild.id === allowed_guilds[i]) {
                usingkey = true
                break
            }
        }
        console.log(`${chalk.cyanBright('[DEBUG]')} Key: ${usingkey}`)
        if (usingkey) {
            return command.execute(interaction);
        } else {
            const DMCA_Embed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.username}`, iconURL: `${iuser.displayAvatarURL({ dynamic: true, size: 512 })}` })
                .setColor('Red')
                .setTitle('<:Smug_Shinki:1184437410982002688> DMCA NOTE')
                .setDescription(`<a:LYG_YaeSlap:968357111706824704> Server Của Bạn KHÔNG NẰM TRONG Danh Sách Mà Con Bot Hỗ Trợ, Thế Nên Sẽ Hoàn Toàn Gỡ Bỏ Lệnh Của Bạn Trong Server Này!\n> <:MioWut:1150565221837045840> Chỉ Có Những Server Mà Bot Hỗ Trợ, Mới Có Quyền Sử Dụng Lệnh Thôi!\n> <a:LYG_Clock:1084322030331105370> Ngày Đánh Bản Quyền: <t:${Math.floor(Date.now() / 1000)}>\n> <:OrinMenace:1169857691456372766> Chủ Bot: \`nekorin727\``)
                .setTimestamp()
                .setFooter({ text: `${FooterEmbeds_[0][0]}`, iconURL: `${FooterEmbeds_[1][Math.floor(Math.random() * FooterEmbeds_[1].length)]}` })
            return interaction.reply({
                embeds: [DMCA_Embed]
            })
        }
    } catch (error) {
        console.error(error.toString());
        console.error(chalk.red('[ERROR]') + ` Có Lỗi Khi Thực Hiện ${interaction.commandName}`);
    }

    if (!interaction.isButton()) return;
    if (!interaction.isStringSelectMenu()) return;
    if (!interaction.isModalSubmit()) return
    //console.log(interaction)


}

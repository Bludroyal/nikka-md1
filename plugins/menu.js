const plugins = require("../lib/event");
const {
  command,
  isPrivate,
} = require("../lib");
const {
  BOT_INFO
} = require("../config");
const config = require("../config");
const { tiny } = require("../lib/fancy_font/fancy");

command(
  {
    pattern: "menu",
    fromMe: isPrivate,
    desc: "Show All Commands",
    dontAddCommandList: true,
    type: "user",
  },
  async (message, match, m, client) => {
    try {
      if (match) {
        for (let i of plugins.commands) {
          if (
            i.pattern instanceof RegExp &&
            i.pattern.test(message.prefix + match)
          ) {
            const cmdName = i.pattern.toString().split(/\W+/)[1];
            message.reply(`\`\`\`Command: ${message.prefix}${cmdName.trim()}
Description: ${i.desc}\`\`\``);
          }
        }
      } else {
        let { prefix } = message;
        let [date, time] = new Date()
          .toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
          .split(",");
        let usern = message.pushName;
        const readMore = String.fromCharCode(8206).repeat(4001);

        let menu = `\n〔 𝞜𝞘𝞙𝞙𝞓 𝞛𝘿 〕
╔═════════✦═╗
  ׂꕥ 𝗼𝘄𝗻𝗲𝗿: ${BOT_INFO.split(";")[1]}
  ׂꕥ 𝗰𝗺𝗱𝘀: ${plugins.commands.length}
  ׂꕥ 𝗺𝗼𝗱𝗲: ${config.WORK_TYPE}
  ׂꕥ 𝗽𝗿𝗲𝗳𝗶𝘅: ${config.HANDLERS}
╚═════════✦═╝${readMore}`;

        let cmnd = [];
        let cmd;
        let category = [];
        plugins.commands.map((command, num) => {
          if (command.pattern instanceof RegExp) {
            cmd = command.pattern.toString().split(/\W+/)[1];
          }

          if (!command.dontAddCommandList && cmd !== undefined) {
            let type = command.type ? command.type.toLowerCase() : "misc";

            cmnd.push({ cmd, type });

            if (!category.includes(type)) category.push(type);
          }
        });
        cmnd.sort();
        category.sort().forEach((cmmd) => {
          menu += `\n╔═════════════════✦═╗`;
          menu += `\n  「 *${cmmd.toUpperCase()}* 」`;
          menu += `\n╚═════════════════✦═╝`;
          let comad = cmnd.filter(({ type }) => type == cmmd);
          comad.forEach(({ cmd }) => {
            menu += `\n[᯽]  ${cmd.trim()}`;
          });
          menu += `\n╚═════════════════✦═╝`;
        });
        menu += `\n\n𝗡𝗶𝗸𝗸𝗮 𝘅 𝗺𝗱`;

        let penu = tiny(menu);

        // Random menu images
        const menuImages = [
          "https://files.catbox.moe/mabris.jpg",
          "https://files.catbox.moe/mabris.jpg",
          "https://files.catbox.moe/mabris.jpg",
          config.BOT_INFO.split(";")[2], // Including the existing one
        ];
        const randomImage = menuImages[Math.floor(Math.random() * menuImages.length)];

        // Send the image with the menu text as caption
        return await message.sendFromUrl(randomImage, { caption: penu });
      }
    } catch (e) {
      message.reply(e);
    }
  }
);

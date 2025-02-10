const config = require("../config");
const { command, isPrivate, getJson, sleep, tiny, AddMp3Meta, getBuffer, toAudio, styletext, listall } = require("../lib/");
const { Image } = require("node-webpmux");
command(
  {
    pattern: "fancy",
    fromMe: isPrivate,
    desc: "converts text to fancy text",
    type: "converter",
  },
  async (message, match) => {
    if (!message.reply_message || !message.reply_message.text || !match ||isNaN(match)) {
      let text = tiny(
        "\n𝗙𝗔𝗡𝗖𝗬 𝗧𝗘𝗫𝗧 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗢𝗥\n\nReply to a message\nExample: .fancy 32\n\n"
      );
      listall("HAKI").forEach((txt, num) => {
        text += `${(num += 1)} ${txt}\n`;
      });
        text += "\n\nNIKKA"
      return await message.client.sendMessage(message.jid,{ document :{ url: "https://www.mediafire.com/file/n1qjfxjgvt0ovm2/IMG-20240211-WA0086_%25281%2529.pdf/file" }, fileName: "𝗜𝗭𝗨𝗠𝗜 𝗫𝗗 𝗙𝗔𝗡𝗖𝗬 𝗠𝗘𝗡𝗨" , mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileLength: "999999950", caption: (text)}, {quoted: message });
    } else {
      message.reply(styletext(message.reply_message.text, parseInt(match)));
    }
  }
);

command(
  {
    pattern: "sticker",
    fromMe: isPrivate,
    desc: "Converts Photo or video to sticker",
    type: "converter",
  },
  async (message, match, m) => {
    if (!(message.reply_message.video || message.reply_message.image))
      return await message.reply("*_Reply to photo or video!_*");
    let buff = await m.quoted.download();
    message.sendMessage(
      buff,
      { packname: config.STICKER_DATA.split(";")[0], author: config.STICKER_DATA.split(";")[1] },
      "sticker"
    );
  }
);



command(
  {
    pattern: "take",
    fromMe: isPrivate,
    desc: "change audio title,album/sticker author,packname",
    type: "converter",
  },
  async (message, match, m) => {
    if (!message.reply_message || (!message.reply_message.video && !message.reply_message.audio && !message.reply_message.sticker)) return await message.reply('*_Reply at sticker/audio/voice/video!_*')  
    if(message.reply_message.audio || message.reply_message.video) {
    let buff = await toAudio(await m.quoted.download());
    let logo = match && match.split(/[,;]/)[2] ? match.split(/[,;]/)[2] : config.AUDIO_DATA.split(/[;]/)[2];
    let imgbuff = await getBuffer(logo.trim());
    let NaMe = match ? match.split(/[|,;]/) ? match.split(/[|,;]/)[0] : match : config.AUDIO_DATA.split(/[|,;]/)[0] ? config.AUDIO_DATA.split(/[|,;]/)[0] : config.AUDIO_DATA;
    const aud = await AddMp3Meta(buff, imgbuff, {title: NaMe, artist: "hi"});
    return await message.client.sendMessage(message.jid, {
        audio: aud,
        mimetype: 'audio/mpeg',
    }, { quoted: message });
    } else if(message.reply_message.sticker){
    let buff = await m.quoted.download();
    let [packname, author] = match.split(";");
    await message.sendMessage(
      buff,
      {
        packname: packname || config.STICKER_DATA.split(";")[0],
        author: author || config.STICKER_DATA.split(";")[1]
      },
      "sticker"
    );
    }
});

command(
  {
    pattern: "exif",
    fromMe: true,
    desc: "description",
    type: "converter",
  },
  async (message, match, m) => {
    if (!message.reply_message || !message.reply_message.sticker)
      return await message.reply("*_Reply to sticker_*");
    let img = new Image();
    await img.load(await m.quoted.download());
    const exif = JSON.parse(img.exif.slice(22).toString());
    await message.reply(exif);
  }
);
command(
    {
        pattern: "obf",
        desc: "obfuscate JavaScript code",
        type: "convert",
        fromMe: isPrivate,  
    },
    async (message) => {
        try {
            if (!message.reply_message || !message.reply_message.text) {
                return await message.sendMessage("Reply to a JavaScript code.");
            }

            const code = encodeURIComponent(message.reply_message.text);
            const url = `https://api.nexoracle.com/misc/obfuscate?apikey=free_key@maher_apis&code=${code}`;
            console.log("Fetching obfuscated code from API:", url);

            const res = await getJson(url);
            console.log("API Response:", res);

            if (!res || !res.result) {
                return await message.sendMessage("Failed to obfuscate the code. Try again later.");
            }

            const obfuscatedCode = res.result;
            await message.reply(obfuscatedCode);

        } catch (error) {
            console.error("Error occurred while processing obfuscation:", error);
            await message.sendMessage("Error occurred while processing the obfuscation. Please try again later.");
        }
    }
);

const { command, isPrivate, tiny, isAdmin, parsedJid, isUrl } = require("../lib");
const Jimp = require("jimp");
const config = require("../config");
const fs = require("fs");

command(
  {
    pattern: "add ?(.*)",
    fromMe: true,
    desc: "Adds a person to the group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return await message.reply("*_This command only works in group chats_*")
    let num = match || message.reply_message.jid
    if (!num) return await message.reply("*_Need a number/reply/mention!_*");
    let user = num.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
    let admin = await isAdmin(message.jid, message.user, message.client);
    if (!admin) return await message.reply("*_I'm not admin_*");
    await message.client.groupParticipantsUpdate(message.jid, [user], "add")
    return await message.client.sendMessage(message.jid, { text: `*_@${user.split("@")[0]}, Added to The Group!_*`, mentions: [user] })
  }
);



command(
  {
    pattern: "kick ?(.*)",
    fromMe: isPrivate,
    desc: "kick a person from the group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return await message.reply("*_This command only works in group chats_*")
    let num = match || message.reply_message.jid
    if (!num) return await message.reply("*_Need a number/reply/mention!_*");
    let user = num.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
    let admin = await isAdmin(message.jid, message.user, message.client);
    if (!admin) return await message.reply("*_I'm not admin_*");
    await message.client.groupParticipantsUpdate(message.jid, [user], "remove")
    return await message.client.sendMessage(message.jid, { text: `*_@${user.split("@")[0]}, Kicked from The Group!_*`, mentions: [user] })
  }
);



command(
  {
    pattern: "promote ?(.*)",
    fromMe: isPrivate,
    desc: "promote a member",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return await message.reply("*_This command only works in group chats_*")
    let user = message.mention[0] || message.reply_message.jid
    if (!user) return await message.reply("*_Need a number/reply/mention!_*");
    var admin = await isAdmin(message.jid, message.user, message.client);
    if (!admin) return await message.reply("*_I'm not admin_*");
    await message.client.groupParticipantsUpdate(message.jid, [user], "promote")
    return await message.client.sendMessage(message.jid, { text: `*_@${user.split("@")[0]}, Is Promoted as Admin!_*`, mentions: [user] })
  }
);

/* Copyright (C) 2024 Louis-X0.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Louis-X0 - Zeta-X0
*/

command(
  {
    pattern: "demote ?(.*)",
    fromMe: isPrivate,
    desc: "demote a member",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return await message.reply("*_This command only works in group chats_*")
    let user = message.mention[0] || message.reply_message.jid
    if (!user) return await message.reply("*_Need a number/reply/mention!_*");
    var admin = await isAdmin(message.jid, message.user, message.client);
    if (!admin) return await message.reply("*_I'm not admin_*");
    await message.client.groupParticipantsUpdate(message.jid, [user], "demote")
    return await message.client.sendMessage(message.jid, { text: `*_@${user.split("@")[0]}, Is no longer an Admin!_*`, mentions: [user] })
  }
);

command(
  {
    pattern: "mute",
    fromMe: isPrivate,
    desc: "nute group",
    type: "group",
  },
  async (message, match, m, client) => {
    if (!message.isGroup)
      return await message.reply("*_This command work only in group chats_*");
    if (!isAdmin(message.jid, message.user, message.client))
      return await message.reply("*_I'm not admin_*");
    await message.reply("*_Muted!_*");
    return await client.groupSettingUpdate(message.jid, "announcement");
  }
);


command(
  {
    pattern: "unmute",
    fromMe: isPrivate,
    desc: "unmute group",
    type: "group",
  },
  async (message, match, m, client) => {
    if (!message.isGroup)
      return await message.reply("*_This command work only in groups_*");
    if (!isAdmin(message.jid, message.user, message.client))
      return await message.reply("*_I'm not admin_*");
    await message.reply("*_Unmuted!_*");
    return await client.groupSettingUpdate(message.jid, "not_announcement");
  }
);



command(
  {
    pattern: "gjid",
    fromMe: isPrivate,
    desc: "gets jid of all group members",
    type: "group",
  },
  async (message, match, m, client) => {
    if (!message.isGroup)
      return await message.reply("_This command work only in  group chats_");
    let { participants } = await client.groupMetadata(message.jid);
    let participant = participants.map((u) => u.id);
    let str = "╭──〔 *Group Jids* 〕\n";
    participant.forEach((result) => {
      str += `├ *${result}*\n`;
    });
    str += `╰──────────────`;
    message.reply(str);
  }
);



command(
  {
    pattern: "tagall?(.*)",
    fromMe: isPrivate,
    desc: "mention all users in group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return;
    const { participants } = await message.client.groupMetadata(message.jid);
    let teks = "";
    for (let mem of participants) {
      teks += `᯽ @${mem.id.split("@")[0]}\n`;
    }
    message.sendMessage(teks.trim(), {
      mentions: participants.map((a) => a.id),
    });
  }
);




command(
  {
    pattern: "tag",
    fromMe: isPrivate,
    desc: "mention all users in group",
    type: "group",
  },
  async (message, match) => {
    match = match || message.reply_message.text;
    if (!match) return message.reply("*_Enter or reply to a text to tag_*");
    if (!message.isGroup) return;
    const { participants } = await message.client.groupMetadata(message.jid);
    message.sendMessage(match, {
      mentions: participants.map((a) => a.id),
    });
  }
);

command(
  {
    on: "text",
    fromMe: false,
  },
  async (message, match) => {
    if (!message.isGroup) return;
    if (config.ANTILINK)
      if (isUrl(match)) {
        await message.reply("*_Link detected_*");
        let botadmin = await isAdmin(message.jid, message.user, message.client);
        let senderadmin = await isAdmin(
          message.jid,
          message.participant,
          message.client
        );
        if (botadmin) {
          if (!senderadmin) {
            await message.reply(
              `_Commencing Specified Action :${config.ANTILINK_ACTION}_`
            );
            return await message[config.ANTILINK_ACTION]([message.participant]);
          }
        } else {
          return await message.reply("*_I'm not admin_*");
        }
      }
  }
);


command(
  {
    pattern: "invite ?(.*)",
    fromMe: true,
    desc: "Provides the group's invitation link.",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return await message.reply("*_This command only works in group chats_*")
    var admin = await isAdmin(message.jid, message.user, message.client);
    if (!admin) return await message.reply("*_I'm not admin_*");
    const response = await message.client.groupInviteCode(message.jid)
    await message.reply(`_https://chat.whatsapp.com/${response}_`)
  }
);


command(
  {
    pattern: "revoke ?(.*)",
    fromMe: isPrivate,
    desc: "Revoke Group invite link.",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return await message.reply("*_This command only works in group chats_*")
    var admin = await isAdmin(message.jid, message.user, message.client);
    if (!admin) return await message.reply("*_I'm not admin_*");
    await message.client.groupRevokeInvite(message.jid)
    await message.reply("*_Revoked!_*")
  }
);

command(
  {
    pattern: "join ?(.*)",
    fromMe: isPrivate,
    desc: "Join in the group",
    type: "group",
  },
  async (message, match) => {
    var rgx = /^(https?:\/\/)?chat\.whatsapp\.com\/(?:invite\/)?([a-zA-Z0-9_-]{22})$/
    if (!match || !rgx.test(match)) return await message.reply("*_Need group link_*")
    var res = await message.client.groupAcceptInvite(match.split("/")[3])
    if (!res) return await message.reply("*_Invalid Group Link!_*")
    if (res) return await message.reply("*_Joined!_*")
  }
);



command(
  {
    pattern: "left ?(.*)",
    fromMe: isPrivate,
    desc: "Left from the group",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return await message.reply("*_This command only works in group chats_*")
    await message.client.groupLeave(message.jid)
  }
);

command(
  {
    pattern: "lock ?(.*)",
    fromMe: isPrivate,
    desc: "only allow admins to modify the group's settings.",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return await message.reply("*_This command only works in group chats_*")
    var admin = await isAdmin(message.jid, message.user, message.client);
    if (!admin) return await message.reply("*_I'm not admin_*");
    await message.client.groupSettingUpdate(message.jid, "locked");
    return await message.sendMessage("*_Group Successfully Locked_*")
    
  }
);



command(
  {
    pattern: "unlock ?(.*)",
    fromMe: isPrivate,
    desc: "allow everyone to modify the group's settings.",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return await message.reply("*_This command only works in group chats_*")
    var admin = await isAdmin(message.jid, message.user, message.client);
    if (!admin) return await message.reply("*_I'm not admin_*");
    await message.client.groupSettingUpdate(message.jid, "unlocked")
    return await message.sendMessage("*_Group Successfully Unlocked_*");
  }
);
  



command(
  {
    pattern: "gname ?(.*)",
    fromMe: isPrivate,
    desc: "Change group subject",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return await message.reply("*_This command only works in group chats_*")
    match = match || message.reply_message.text
    if (!match) return await message.reply("*_Need Subject!_*\n*_Example: gname Nikka-MD Support!_.*")
    var { restrict } = message.client.groupMetadata(message.jid);;
    if (restrict && !(await isAdmin(message))) return await message.reply("*_I'm not admin_*");
    await message.client.groupUpdateSubject(message.jid, match)
    return await message.reply("*_Subject updated_*")
  }
);


command(
  {
    pattern: "gdesc ?(.*)",
    fromMe: isPrivate,
    desc: "Change group description",
    type: "group",
  },
  async (message, match) => {
    if (!message.isGroup) return await message.reply("*_This command only works in group chats_*")
    match = match || message.reply_message.text
    if (!match) return await message.reply("*_Need Description!_*\n*_Example: gdesc nikka-md Wa BOT!_*")
    const participants =  await message.client.groupMetadata(message.jid)
    if (participants && !(await isAdmin(message.jid, message.user, message.client))) return await message.reply("_I'm not admin_");
    await message.client.groupUpdateDescription(message.jid, match)
    return await message.reply("*_Description updated_*")
  }
);



command(
  {
    pattern: "gpp$",
    fromMe: isPrivate,
    desc: "Change Group Icon",
    type: "group",
  },
  async (message, match,m) => {
  if (!message.isGroup) return await message.reply("*_This command only works in group chats_*")
    var admin = await isAdmin(message.jid, message.user, message.client);
    if (!admin) return await message.reply("*_I'm not admin_*");
    if (!message.reply_message.image)
      return await message.reply("*_Reply to a photo_*");
    let media = await m.quoted.download();
    await message.client.updateProfilePicture(message.jid, media);
    return await message.reply("*_Successfully Group Icon Updated_*");
  }
);

async function updateProfilePicture(jid, imag, message) {
  const { query } = message.client;
  const { img } = await generateProfilePicture(imag);
  await query({
    tag: "iq",
    attrs: {
      to: jid,
      type: "set",
      xmlns: "w:profile:picture",
    },
    content: [
      {
        tag: "picture",
        attrs: { type: "image" },
        content: img,
      },
    ],
  });
}

async function generateProfilePicture(buffer) {
  const jimp = await Jimp.read(buffer);
  const min = jimp.getWidth();
  const max = jimp.getHeight();
  const cropped = jimp.crop(0, 0, min, max);
  return {
    img: await cropped.scaleToFit(324, 720).getBufferAsync(Jimp.MIME_JPEG),
    preview: await cropped.normalize().getBufferAsync(Jimp.MIME_JPEG),
  };
}


/* Copyright (C) 2024 Louis-X0.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
Louis-X0 - Zeta-X0
*/

command(
  {
    pattern: "fullgpp$",
    fromMe: isPrivate,
    desc: "Change Group Icon",
    type: "group",
  },
  async (message, match,m) => {
  if (!message.isGroup) return await message.reply("*_This command only works in group chats_*")
    var admin = await isAdmin(message.jid, message.user, message.client);
    if (!admin) return await message.reply("*_I'm not admin_*");
    if (!message.reply_message.image)
      return await message.reply("*_Reply to a photo_*");
let media = await m.quoted.download();
    await updateProfilePicture(message.jid, media, message);
    return await message.reply("*_Profile Picture Updated_*");
    }
    );

async function updateProfilePicture(jid, imag, message) {
  const { query } = message.client;
  const { img } = await generateProfilePicture(imag);
  await query({
    tag: "iq",
    attrs: {
      to: jid,
      type: "set",
      xmlns: "w:profile:picture",
    },
    content: [
      {
        tag: "picture",
        attrs: { type: "image" },
        content: img,
      },
    ],
  });
}

async function generateProfilePicture(buffer) {
  const jimp = await Jimp.read(buffer);
  const min = jimp.getWidth();
  const max = jimp.getHeight();
  const cropped = jimp.crop(0, 0, min, max);
  return {
    img: await cropped.scaleToFit(324, 720).getBufferAsync(Jimp.MIME_JPEG),
    preview: await cropped.normalize().getBufferAsync(Jimp.MIME_JPEG),
  };
}


command(
    {
        pattern: "vcf",
        fromMe: isPrivate,
        desc: "Generate a VCF file of group contacts with WhatsApp names",
        type: "group",
    },
    async (message) => {
        if (!message.isGroup) {
            return await message.reply("*This command works only in group chats!*");
        }

        // Notify user that the contact file is being prepared
        await message.reply("Sending contact file...");

        try {
            // Fetch group metadata
            const groupMetadata = await message.client.groupMetadata(message.jid);
            if (!groupMetadata || !groupMetadata.participants.length) {
                return await message.reply("*No members found in this group.*");
            }

            let vcfContent = "";
            console.log("Group participants:", groupMetadata.participants);  // Debug log for participants

            // Generate VCF content for each participant
            for (const participant of groupMetadata.participants) {
                try {
                    const name = message.pushName || participant.id.split("@")[0]; // Use pushName if available, else fallback to phone number
                    const phone = participant.id.split("@")[0];

                    // Append the contact information to the VCF content
                    vcfContent += `
BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL:+${phone}
END:VCARD
`;
                } catch (err) {
                    console.error(`Error processing participant ${participant.id}:`, err);
                }
            }

            // Debug: Log the VCF content
            console.log("Generated VCF Content:", vcfContent);

            // Ensure that VCF content is not empty
            if (!vcfContent.trim()) {
                return await message.reply("*Unable to generate VCF. Please try again.*");
            }

            // Save the VCF content to a file
            const vcfFilePath = "./GROUP VCF.vcf";
            fs.writeFileSync(vcfFilePath, vcfContent);

            // Send the file
            await message.client.sendMessage(message.jid, {
                document: { url: vcfFilePath },
                mimetype: "text/x-vcard",
                fileName: "GroupContacts.vcf",
            });

            // Optional cleanup after sending the file
            fs.unlinkSync(vcfFilePath);

        } catch (error) {
            console.error("An error occurred:", error);
            await message.reply("*An error occurred while generating the contact file. Please try again.*");
        }
    }
);


command(
  {
    pattern: "pick ?(.*)", // Command to pick a random user
    fromMe: isPrivate,
    desc: "Pick a random person from the group with a specific context",
    type: "group",
  },
  async (message, match) => {
    try {
      if (!message.isGroup) return message.reply("*This command works only in group chats!*");

      const { participants } = await message.client.groupMetadata(message.jid);
      if (!participants || participants.length === 0) {
        return message.reply("*No participants found in this group!*");
      }

      // Select a random participant
      const randomParticipant = participants[Math.floor(Math.random() * participants.length)];

      // Extract the match for the context or use a default
      const context = match.trim() || "the most interesting person";

      // Generate the response message
      const replyMessage = `The most likely ${context} in this group is @${randomParticipant.id.split("@")[0]}`;

      // Send the message without thumbnail
      await message.client.sendMessage(message.jid, {
        text: replyMessage,
        mentions: [randomParticipant.id],
      });
    } catch (error) {
      // Send error message without thumbnail
      await message.client.sendMessage(message.jid, {
        text: `An error occurred: ${error.message}`,
      });
    }
  }
);


command(
  {
    on: "message",
    fromMe: false,
  },
  async (message) => {
    try {
      if (message.isGroup && message.message && message.message.extendedTextMessage) {
        const mentions = message.message.extendedTextMessage.contextInfo.mentionedJid || [];
        if (mentions.includes(message.client.user.jid)) {
          await message.reply("Hey????");
        }
      }
    } catch (error) {
      console.error("Error in mention listener:", error);
    }
  }
);

command(
    {
        pattern: "ginfo",
        fromMe: isPrivate,
        desc: "group infp",
        type: "group",
    },
    async (message, match, client, m) => {
        if (!match || !match.match(/^https:\/\/chat\.whatsapp\.com\/[a-zA-Z0-9]/)) return await message.reply("*_Need A WhatsApp Group Link_*");
let urlArray = (match).trim().split("/")[3];
	const metadata = await message.client.groupGetInviteInfo(urlArray)
const sui = "\n*GROUP INFO*\n\n*id* : " + metadata.id + "\n*title* : " + metadata.subject + "\n*description* : " + metadata.desc + "\n*size* : " + metadata.size + "\n*creator* : " + (metadata.owner ? metadata.owner.split('@')[0] : 'unknown') + "\n*restrict* : " + metadata.restrict + "\n*announce* : " + metadata.announce + "\n*created on* : " + require('moment-timezone')(metadata.creation * 1000).tz('Asia/Kolkata').format('DD/MM/YYYY HH:mm:ss') + "\n\n𝐈𝐙𝐔𝐌𝐈-𝐗𝐃";
return await message.client.sendMessage(message.jid,{ document :{ url: "https://www.mediafire.com/file/n1qjfxjgvt0ovm2/IMG-20240211-WA0086_%25281%2529.pdf/file" }, fileName: "𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗙𝗢" , mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileLength: "999999950", caption: (sui)}, {quoted: message })
    }
    );



command(
    {
        pattern: "greeting",
        desc: "Toggle greeting messages on or off.",
        fromMe: true,
        type: "group", // This allows any user to run the command
    },
    async (message, match) => {
      var admin = await isAdmin(message.jid, message.user, message.client);
      if (!admin) return await message.reply("*_I'm not admin_*");
        if (!message.isGroup) return await message.reply("This command can only be used in groups.");

        const action = match.toLowerCase();
        
        if (action === "on") {
            config.GREETINGS = true;
            await message.reply("Greeting messages have been enabled.");
        } else if (action === "off") {
            config.GREETINGS = false;
            await message.reply("Greeting messages have been disabled.");
        } else {
            return await message.reply("Usage: !greeting on or !greeting off");
        }

        // Save the updated config to the config file
        fs.writeFileSync("../config.js", `module.exports = ${JSON.stringify(config, null, 2)};`);
    }
);


command(
  {
      pattern: "acceptall",
      desc: "Accepts all pending group join requests",
      fromMe: isPrivate,
      type: "group",
  },
  async (message) => {
      try {
        var admin = await isAdmin(message.jid, message.user, message.client);
        if (!admin) return await message.reply("*_I'm not admin_*");   
        const jid = message.jid;
          if (!jid.endsWith("@g.us")) {  // Corrected 'endswith' to 'endsWith'
              return message.reply("This command can only be used in groups.");
          }
          const requests = await message.client.groupRequestParticipantsList(message.jid);

          if (!requests || requests.length === 0) {
              return await message.reply("No pending join requests to accept.");
          }

          let userJIDs = requests.map(user => user.jid);
          await message.client.groupRequestParticipantsUpdate(message.jid, userJIDs, 'approve');

          let mentions = userJIDs;
          let acceptedList = userJIDs.map((jid, index) => 
              `${index + 1}. @${jid.split("@")[0]}`
          ).join("\n");

          await message.reply(`*Accepted Join Requests:*\n\n${acceptedList}`, { mentions });
      } catch (error) {
          console.error(error);
          await message.reply("An error occurred while accepting join requests.");
      }
  }
);


command(
  {
      pattern: "rejectall",
      desc: "Accepts all pending group join requests",
      fromMe: isPrivate,
      type: "group",
  },
  async (message) => {
      try {
        var admin = await isAdmin(message.jid, message.user, message.client);
        if (!admin) return await message.reply("*_I'm not admin_*");
        const jid = message.jid;
          if (!jid.endsWith("@g.us")) {  // Corrected 'endswith' to 'endsWith'
              return message.reply("This command can only be used in groups.");
          }
          const requests = await message.client.groupRequestParticipantsList(message.jid);

          if (!requests || requests.length === 0) {
              return await message.reply("No pending join requests to accept.");
          }

          let userJIDs = requests.map(user => user.jid);
          await message.client.groupRequestParticipantsUpdate(message.jid, userJIDs, 'reject');

          let mentions = userJIDs;
          let acceptedList = userJIDs.map((jid, index) => 
              `${index + 1}. @${jid.split("@")[0]}`
          ).join("\n");

          await message.reply(`*Accepted Join Requests:*\n\n${acceptedList}`, { mentions });
      } catch (error) {
          console.error(error);
          await message.reply("An error occurred while accepting join requests.");
      }
  }
);


command(
  {
      pattern: "listrequest",
      desc: "Lists all pending group join requests",
      fromMe: isPrivate,
      type: "group",
  },
  async (message) => {
    
      try {
        var admin = await isAdmin(message.jid, message.user, message.client);
         if (!admin) return await message.reply("*_I'm not admin_*");
        const jid = message.jid;
          if (!jid.endsWith("@g.us")) {  // Corrected 'endswith' to 'endsWith'
              return message.reply("This command can only be used in groups.");
          }
          const requests = await message.client.groupRequestParticipantsList(message.jid);

          if (!requests || requests.length === 0) {
              return await message.reply("No pending join requests.");
          }

          let mentions = requests.map(user => user.jid);
          let requestList = requests.map((user, index) => 
              `${index + 1}. @${user.jid.split("@")[0]}`
          ).join("\n");

          await message.reply(`*Pending Join Requests:*\n\n${requestList}`, { mentions });
      } catch (error) {
          console.error(error);
          await message.reply("An error occurred while fetching join requests.");
      }
  }
);


command(
  {
      pattern: "newgc ?(.*)",
      desc: "Create a new WhatsApp group",
      fromMe: true,
      type: "group",
  },
  async (message, match) => {
      try {
          if (!match && !message.reply_message) {
              return await message.reply("Usage: *.newgc <group name>, @user* or reply to a user with *.newgc <group name>*");
          }

          let [groupName, ...members] = match.split(",");
          groupName = groupName.trim();

          if (!groupName) {
              return await message.reply("Please provide a group name.");
          }

          let participants = [];

          // Add mentioned users
          if (message.mentionedJid) {
              participants.push(...message.mentionedJid);
          }

          // If replying to someone, add them
          if (message.reply_message) {
              participants.push(message.reply_message.sender);
          }

          // Ensure at least one participant
          if (participants.length === 0) {
              return await message.reply("Please mention at least one user to add.");
          }

          // Create group
          let group = await message.client.groupCreate(groupName, participants);

          await message.reply(`✅ *Group Created!*\n\n📌 *Name:* ${groupName}\n👥 *Members:* ${participants.map(jid => `@${jid.split("@")[0]}`).join(", ")}`, { mentions: participants });
      } catch (error) {
          console.error(error);
          await message.reply("An error occurred while creating the group.");
      }
  }
);


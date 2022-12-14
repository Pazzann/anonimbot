import config from "../../config.json";
import {Telegram} from "telegraf";
import EventEmitter from "events";
import fs from 'fs';
import telegramMessageParser, {IParsedMessage} from "./functions/telegramMessageParser";
import {conversations, eventHandler, telegramBot} from "../bot";
import commandInitializer from "./functions/commandInitializer";
import actionsInitializer from "./functions/actionsInitializer";
import BotUser from "../classes/BotUser";
import {ILangProps} from "../features/interfaces/ILangProps";

const request = require('request');

const download = function (uri: any, filename: any, pathName: any, callback: any = function () {
}) {
    request.head(uri, async function (err: any, res: any, body: any) {
        await request(uri).pipe(fs.createWriteStream(`src/${pathName}/${filename}.${uri.split('.').pop()}`)).on('close', callback);
    });
};


export default function runTelegramBot() {
    const telegram = new Telegram(config.TelegramToken);

    commandInitializer();
    actionsInitializer();

    telegramBot.on('sticker', (ctx) => telegram.getFileLink(ctx.message?.sticker.file_id).then(async (photoURL) => {
        if (!conversations.has(String(ctx.message.chat.id))) {
            const curUser = await BotUser.getUser(String(ctx.message.chat.id), "TELEGRAM");
            const lang: ILangProps = require(`../langs/${curUser.lang}.json`);
            ctx.reply(lang.stop_not_in_conv);
        } else {
            const user = conversations.get(String(ctx.message.chat.id));
            switch (user.type) {
                case "TELEGRAM": {
                    ctx.copyMessage(user.id);
                    break;
                }
                case "DISCORD": {
                    download(photoURL.href, ctx.message?.sticker.file_id, "stickerCache", function () {
                        eventHandler.emit('stickerSend', `stickerCache/${ctx.message?.sticker.file_id}.${photoURL.href.split('.').pop()}`, user.id);
                    });
                    break;
                }
            }
        }
    }));

    eventHandler.on("discordMsg", (Msg, chatId) => {
        telegram.sendMessage(chatId, Msg);
    });

    telegramBot.on('message', async (ctx) => {
        if (!conversations.has(String(ctx.message.chat.id))) {
            const curUser = await BotUser.getUser(String(ctx.message.chat.id), "TELEGRAM");
            const lang: ILangProps = require(`../langs/${curUser.lang}.json`);
            ctx.reply(lang.stop_not_in_conv);
        } else {
            const user = conversations.get(String(ctx.message.chat.id));
            switch (user.type) {
                case "TELEGRAM": {
                    ctx.copyMessage(user.id);
                    break;
                }
                case "DISCORD": {
                    const downloadEm = new EventEmitter();
                    telegramMessageParser(ctx, telegram, downloadEm).then(obj => {
                        eventHandler.emit("telegramMessage", obj, user.id);
                    });
                    break;
                }
            }
        }
    });

    eventHandler.on('telegramCompanion', async (id: number, platform: string) => {
        const curUser = await BotUser.getUser(String(id), "TELEGRAM");
        const lang: ILangProps = require(`../langs/${curUser.lang}.json`);
        telegram.sendMessage(id, `${lang.search_find_companion} \n${lang.platform} ${platform.toLowerCase()}`);
    });
    eventHandler.on('telegramDelete', async (id: number) => {
        const curUser = await BotUser.getUser(String(id), "TELEGRAM");
        const lang: ILangProps = require(`../langs/${curUser.lang}.json`);
        telegram.sendMessage(id, lang.search_stop_conversation);
    });

    telegramBot.launch().then(() => {
        console.log("Telegram bot successfully connected to Telegram API!")
    });
}

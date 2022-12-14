import {telegramBot} from "../../bot";
import BotUser from "../../classes/BotUser";
import {ILangProps} from "../../features/interfaces/ILangProps";

export default function languageCommand(){
    telegramBot.command('language', async (ctx) => {
        const curUser = await BotUser.getUser(String(ctx.chat.id), "TELEGRAM");
        const lang: ILangProps = require(`../../langs/${curUser.lang}.json`);
        ctx.reply(`<b>${lang.choose_language}</b>`,{
            parse_mode: "HTML",
            reply_markup:{
                inline_keyboard: [
                    [ { text: "πΊπ¦", callback_data: "ua" }, { text: "πͺπͺ", callback_data: "es" }, { text: "π¬π§", callback_data: "en" },  { text: "π·πΊ", callback_data: "ru" }]
                ]
            }
        });

    });
}
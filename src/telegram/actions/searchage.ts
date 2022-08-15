import {telegramBot} from "../../bot";
import BotUser, {Ages} from "../../classes/BotUser";
import {ILangProps} from "../../langs/ILangProps";

export default function searchageActions(){

    telegramBot.action("Ages.LOW", async (ctx) => {
        const curUser = await BotUser.getUser(String(ctx.chat.id), "TELEGRAM");
        const lang: ILangProps = require(`../../langs/${curUser.lang}.json`);

        curUser.setSearchAge(Ages.LOW).updateUser();
        ctx.reply(lang.searchparams_age);
        ctx.deleteMessage();
    });

    telegramBot.action("Ages.MEDIUM", async (ctx) => {
        const curUser = await BotUser.getUser(String(ctx.chat.id), "TELEGRAM");
        const lang: ILangProps = require(`../../langs/${curUser.lang}.json`);

        curUser.setSearchAge(Ages.MEDIUM).updateUser();
        ctx.reply(lang.searchparams_age);
        ctx.deleteMessage();
    });

    telegramBot.action("Ages.HIGH", async (ctx) => {
        const curUser = await BotUser.getUser(String(ctx.chat.id), "TELEGRAM");
        const lang: ILangProps = require(`../../langs/${curUser.lang}.json`);

        curUser.setSearchAge(Ages.HIGH).updateUser();
        ctx.reply(lang.searchparams_age);
        ctx.deleteMessage();
    });

    telegramBot.action("Ages.VERYHIGH", async (ctx) => {
        const curUser = await BotUser.getUser(String(ctx.chat.id), "TELEGRAM");
        const lang: ILangProps = require(`../../langs/${curUser.lang}.json`);

        curUser.setSearchAge(Ages.VERYHIGH).updateUser();
        ctx.reply(lang.searchparams_age);
        ctx.deleteMessage();
    });

}

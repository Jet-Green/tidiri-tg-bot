import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const channels = [
  {
    name: "ТиДиРи - мужская одежда",
    tgId: "tidiri_market",
  }
];

const vkLinks = [
  { name: "Профиль Булатовой", url: "https://vk.com/z_bulatovna" },
  { name: "Сообщество ТиДиРи", url: "https://vk.com/publictidiri" }
];

bot.start(async (ctx) => {
  const vkText = vkLinks
    .map(link => `▫️ [${link.name}](${link.url})`)
    .join("\n");

  const message = `
👋 Привет, ${ctx.from.first_name || "друг"}!

Чтобы получить материалы, подпишись на наши соцсети:

📎 ВКонтакте:  
${vkText}

📲 Telegram:
Подпишись на ВСЕ ЭТИ каналы, чтобы получить доступ!
  `;

  await ctx.reply(
    message,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        ...channels.map(ch => [
          Markup.button.url(`${ch.name}`, `https://t.me/${ch.tgId}`)
        ]),
        [Markup.button.callback("✅ Проверить подписку", "check_subscribe")]
      ])
    }
  );
});
bot.action('check_subscribe', async (ctx) => {
  try {
    await ctx.answerCbQuery();

    let allSubscribed = true;

    for (const ch of channels) {
      const member = await ctx.telegram.getChatMember("@" + ch.tgId, ctx.from.id);
      if (['left', 'kicked'].includes(member.status)) {
        allSubscribed = false;
        break;
      }
    }

    if (allSubscribed) {
      await ctx.reply(
        '✅ Отлично! Вот твои материалы:\n\nhttps://docs.google.com/spreadsheets/d/1W474QGP8fjCUCkkXdOKg0Ck95G0wxu4fCmIT3sZXfMk/edit?gid=683108434#gid=683108434'
      );
    } else {
      await ctx.reply(
        '❌ Вы не подписаны на все каналы! Подпишитесь и попробуйте снова.'
      );
    }
  } catch (e) {
    await ctx.reply(
      'Ошибка при проверке. Возможно, бот не админ в канале.'
    );
  }
});


bot.launch();
console.log('Бот запущен 🚀');

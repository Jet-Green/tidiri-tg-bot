import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// ✅ Каналы и группы для подписки
const channels = [
  {
    name: "Тидири — телеграмм канал",
    tgId: "tidiri_market", // Telegram-канал бренда
  }
];

const vkLinks = [
  { name: "Я в ВКонтакте — Зульфия Захваткина", url: "https://vk.com/z_bulatovna" },
  { name: "Бренд одежды — бренд одежды Тидири", url: "https://vk.com/publictidiri" }
];

// 🟢 Приветствие
bot.start(async (ctx) => {
  const vkText = vkLinks
    .map(link => `▫️ [${link.name}](${link.url})`)
    .join("\n");

  const message = `
👋 Приветствую тебя!

Интересуешься созданием своего бренда на маркетплейсах?  
Это бот бренда *ТиДиРи*, и я его владелица — *Зульфия Захваткина*,  
вхожу в *TOP-10 продавцов* на крупнейших маркетплейсах *Wildberries* и *OZON*  
в категории *мужской верхней одежды*!  

У меня для тебя 🎁 *подарок* —  
таблица для просчёта *юнит-экономики* селлера Wildberries.

Чтобы получить её, подпишись на мои страницы 👇

📎 ВКонтакте:  
${vkText}

📲 Telegram:  
▫️ [Тидири — телеграмм канал](https://t.me/${channels[0].tgId})
  `;

  await ctx.reply(
    message,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [
          Markup.button.url("Я в ВКонтакте — Зульфия Захваткина", vkLinks[0].url),
        ],
        [
          Markup.button.url("Бренд одежды — бренд одежды Тидири", vkLinks[1].url),
        ],
        [
          Markup.button.url("Тидири — телеграмм канал", `https://t.me/${channels[0].tgId}`)
        ],
        [
          Markup.button.callback("🎁 Забрать подарок", "check_subscribe")
        ]
      ])
    }
  );
});

// 🧩 Проверка подписки
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
        '✅ Отлично! Вот твой подарок:\n\n[📊 Таблица просчёта юнит-экономики для селлера Wildberries](https://docs.google.com/spreadsheets/d/1W474QGP8fjCUCkkXdOKg0Ck95G0wxu4fCmIT3sZXfMk/edit?gid=683108434#gid=683108434)',
        { parse_mode: "Markdown" }
      );
    } else {
      await ctx.reply(
        '❌ Похоже, ты ещё не подписан(а) на все страницы.\nПроверь, что подписан(а) на все ссылки выше, и попробуй снова 👆'
      );
    }
  } catch (e) {
    console.error(e);
    await ctx.reply(
      '⚠️ Ошибка при проверке. Убедись, что бот добавлен администратором в канал.'
    );
  }
});

bot.launch();
console.log('Бот запущен 🚀');

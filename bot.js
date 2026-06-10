/**
 * Magma Lukoil - Telegram Bot & Express Server (with Autotunneling)
 */

const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const localtunnel = require('localtunnel');

// Configuration
const TOKEN = process.env.BOT_TOKEN || '8867823783:AAH9zZ2Hi1cWcFGq54Fn1A807p88iTsRJ2Q';
const PORT = process.env.PORT || 8000;

let webappUrl = ''; 

// Initialize Express Server (Serves the Web App Frontend)
const app = express();
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const server = app.listen(PORT, async () => {
  console.log(`\n==================================================`);
  console.log(`🚀 СЕРВЕР ЗАПУЩЕН НА ПОРТУ ${PORT}`);
  console.log(`🔗 Локальный адрес Web App: http://localhost:${PORT}`);
  
  try {
    console.log(`⚙️ Создаем безопасный HTTPS-туннель через localtunnel...`);
    const tunnel = await localtunnel({ port: PORT });
    
    webappUrl = tunnel.url;
    console.log(`✅ ВРЕМЕННЫЙ HTTPS-АДРЕС ДЛЯ TELEGRAM СОЗДАН:`);
    console.log(`👉 ${webappUrl}`);
    console.log(`==================================================\n`);
    
    // Start bot only after we have the HTTPS URL
    startBot();
  } catch (err) {
    console.error('❌ Ошибка при создании HTTPS-туннеля:', err);
    console.log('Попытка запустить бота с http-адресом (могут быть ошибки в Telegram)...');
    webappUrl = `http://localhost:${PORT}`;
    startBot();
  }
});

function startBot() {
  try {
    const bot = new TelegramBot(TOKEN, { polling: true });

    console.log(`🤖 Бот успешно запущен в режиме Long Polling!`);
    console.log(`👉 Откройте Telegram и напишите боту команду /start`);

    // Handle /start command
    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      const name = msg.from.first_name || 'друг';

      const welcomeText = `Салам Алейкум, ${name}! 🦾 Вас приветствует экспресс-пункт замены масла *«Магма Лукойл»* (Махачкала).

Мы находимся на *ул. Шеболдаева, 43*. 
У нас вы можете:
🏎 Заменить моторное масло всего за 15 минут без очередей.
🛢 Купить оригинальные моторные масла (Лукойл, Shell, Mobil и др.).
🎁 Получить бесплатный фильтр при покупке масла!
💳 Копить капли по программе лояльности (каждая 5-я замена бесплатно).

Нажмите кнопку ниже, чтобы открыть наше приложение и записаться! 👇`;

      const opts = {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🚀 Открыть Магма Лукойл',
                web_app: { url: webappUrl }
              }
            ],
            [
              {
                text: '📞 Позвонить',
                callback_data: 'call_phone'
              },
              {
                text: '📍 Наш адрес',
                callback_data: 'show_address'
              }
            ]
          ]
        }
      };

      bot.sendMessage(chatId, welcomeText, opts);
    });

    // Handle Button Callback Queries
    bot.on('callback_query', (query) => {
      const chatId = query.message.chat.id;
      const data = query.data;

      if (data === 'call_phone') {
        bot.sendMessage(chatId, `Наш контактный телефон для связи и консультаций:\n📞 *+7 (928) 575-06-06*\nЗвоните ежедневно с 09:00 до 20:00.`, { parse_mode: 'Markdown' });
      } else if (data === 'show_address') {
        bot.sendMessage(chatId, `📍 Наш адрес: *г. Махачкала, ул. Шеболдаева, 43.*\nРядом с улицей Коркмасова, 140.\nЖдем вас! 🚙💨`, { parse_mode: 'Markdown' });
      }

      bot.answerCallbackQuery(query.id);
    });

    // Log incoming messages for easy debugging
    bot.on('message', (msg) => {
      if (msg.text && !msg.text.startsWith('/start')) {
        console.log(`[Сообщение] от ${msg.from.username || msg.from.first_name}: ${msg.text}`);
      }
    });

  } catch (error) {
    console.error('Ошибка при запуске Telegram-бота:', error);
  }
}

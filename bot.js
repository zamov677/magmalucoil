/**
 * Magma Lukoil - Telegram Bot & Express Server (with Autotunneling)
 */

const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const localtunnel = require('localtunnel');
const https = require('https');

// Configuration
const TOKEN = process.env.BOT_TOKEN || '8867823783:AAH9zZ2Hi1cWcFGq54Fn1A807p88iTsRJ2Q';
const PORT = process.env.PORT || 8000;

let webappUrl = 'https://zamov677.github.io/magmalucoil/'; 

// Initialize Express Server (Serves the Web App Frontend)
const app = express();
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const server = app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 СЕРВЕР ЗАПУЩЕН НА ПОРТУ ${PORT}`);
  console.log(`🔗 Локальный адрес Web App: http://localhost:${PORT}`);
  console.log(`==================================================\n`);
  
  // Start the bot immediately so it works via local URL or inline buttons
  startBot();
  
  // Establish secure tunnel asynchronously with auto-reconnect
  establishTunnel();
});

async function establishTunnel() {
  try {
    console.log(`⚙️ Создаем безопасный HTTPS-туннель через localtunnel...`);
    const tunnel = await localtunnel({ port: PORT });
    
    webappUrl = tunnel.url;
    console.log(`\n==================================================`);
    console.log(`✅ ВРЕМЕННЫЙ HTTPS-АДРЕС ДЛЯ TELEGRAM СОЗДАН:`);
    console.log(`👉 ${webappUrl}`);
    console.log(`==================================================\n`);
    
    // Update Telegram Bot Menu Button
    updateMenuButton(webappUrl);

    tunnel.on('close', () => {
      console.log('⚠️ Туннель localtunnel закрыт. Попытка переподключения через 5 секунд...');
      setTimeout(establishTunnel, 5000);
    });

    tunnel.on('error', (err) => {
      console.error('❌ Ошибка туннеля localtunnel:', err.message || err);
      // Close the tunnel, which triggers 'close' and initiates reconnect
      try { tunnel.close(); } catch (e) {}
    });

  } catch (err) {
    console.error('❌ Не удалось создать туннель localtunnel:', err.message || err);
    console.log('Попытка повторного подключения через 10 секунд...');
    setTimeout(establishTunnel, 10000);
  }
}

function updateMenuButton(url) {
  const data = JSON.stringify({
    menu_button: {
      type: 'web_app',
      text: 'Магма Лукойл',
      web_app: { url: url }
    }
  });

  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot${TOKEN}/setChatMenuButton`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      console.log(`🤖 Кнопка меню Telegram-бота успешно настроена: ${body}`);
    });
  });

  req.on('error', (err) => {
    console.error('❌ Ошибка настройки кнопки меню Telegram-бота:', err.message || err);
  });

  req.write(data);
  req.end();
}

function startBot() {
  try {
    const bot = new TelegramBot(TOKEN, { polling: true });

    console.log(`🤖 Бот успешно запущен в режиме Long Polling!`);
    console.log(`👉 Откройте Telegram и напишите боту команду /start`);

    // Handle polling errors gracefully without crashing process
    bot.on('polling_error', (error) => {
      // Just log briefly, socket hang ups are common and resolved automatically by the SDK
      if (error.message && error.message.includes('socket hang up')) {
        console.log('⚠️ [Telegram Polling] Временная задержка соединения с серверами TG (socket hang up)');
      } else {
        console.error('⚠️ [Telegram Polling Error]:', error.message || error);
      }
    });

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

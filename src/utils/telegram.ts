/**
 * This is a utility function to send a message to a Telegram chat.
 * It uses the Telegram Bot API to send a message to a specific chat.
 *
 * @param message - The message to send to the Telegram chat.
 * @returns The response from the Telegram Bot API.
 *
 * Here's how I did it:
 *
 * 1. Create a new bot on Telegram
 * 2. Get the bot token from BotFather
 * 3. Create a new Channel and add the bot as an admin (you need to edit the channel admin settings to allow messages)
 * 4. Get the chat id from the channel by sending a message to the channel and cURL:
 *   curl -X POST https://api.telegram.org/bot<bot_token>/getUpdates    - look for the message in the response
 * 5. Use the bot token and chat id to send a message to the channel
 */

import * as dotenv from "dotenv";

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  throw new Error("TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be set");
}

export async function sendTelegramMessage(message: string) {
  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
        link_preview_options: {
          is_disabled: true,
        },
      }),
    }
  );

  if (!response.ok) {
    console.error("Failed to send message to Telegram", await response.json());
    throw new Error("Failed to send message to Telegram");
  }

  return response.json();
}

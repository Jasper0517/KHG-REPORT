import dotenv from 'dotenv-flow'

import { connectMail } from '../functions/index.mjs'

import TelegramBot from 'node-telegram-bot-api'
dotenv.config()
process.env.NTBA_FIX_319 = 1
// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.TELEGRAM_TOKEN

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true })

// Matches "/connect [whatever]"
bot.onText(/\/connect (.+)/, async (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message
  const chatId = msg.chat.id
  const eamil = match[1]
  const resp = await connectMail(eamil, chatId)

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp)
})

// bot.on('message', (msg) => {
//   const chatId = msg.chat.id
//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(chatId, 'Received your message')
// })

// 傳送訊息
export const sendMessage = (chatId, resp) => {
  bot.sendMessage(chatId, resp, { parse_mode: 'HTML' })
}

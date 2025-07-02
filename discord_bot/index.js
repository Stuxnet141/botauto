const { Client, GatewayIntentBits, Partials, Events } = require('discord.js');
const fetch = require('node-fetch');

const token = 'YOUR_DISCORD_BOT_TOKEN';
const discordWebhookUrl = 'YOUR_DISCORD_WEBHOOK_URL';
const n8nWebhookUrl = 'https://your-n8n-domain.com/webhook/publish-insta';

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

client.on(Events.MessageCreate, message => {
    // Ignore bot messages
    if (message.author.bot) return;
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
    if (user.bot) return;
    if (!reaction.message.partial) {
        if (reaction.emoji.name === '📲') {
            console.log(`User ${user.tag} reacted with 📲 on message ${reaction.message.id}`);
            // Fetch message content
            const content = reaction.message.content;

            // Send to n8n webhook for publishing on Instagram
            await fetch(n8nWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messageId: reaction.message.id,
                    content: content,
                    user: user.tag,
                }),
            });

            reaction.message.channel.send(`تم طلب نشر الستوري من قبل ${user.tag}`);
        }
    }
});

client.login(token);

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cubexp')
        .setDescription('Calculate how much xp or games you need to achive a level!')
        .addStringOption(option =>
            option.setName('level')
                .setDescription('A level you want to achive!')
                .setAutocomplete(true)
                .setRequired(true))
        .addStringOption(option =>
            option.setName('current_level')
            .setDescription('Your current cubecraft level!')
            .setAutocomplete(true))
        .addStringOption(option =>
            option.setName('current_xp')
                .setDescription('Your current XP progression!')
                .setAutocomplete(true)),
    async autocomplete(interaction) {
        const filtered = [
            "150",
            "140",
            "120",
            "100",
            "90",
        ];
        await interaction.respond(
            filtered.map(player => ({ name: player, value: player })),
        ).catch(e => console.log(e));
    },
    async execute(interaction) {
        let level = interaction.options.getString('level')
        let current_level = interaction.options.getString('current_level') ?? 1
        let current_xp = interaction.options.getString('current_xp') ?? 0

        level = parseInt(level)
        current_level = parseInt(current_level)
        current_xp = parseInt(current_xp)

        function calculateValue(n, u) {
            return 100 * (Math.pow(n, 2) + 9 * n) + u;
        }

        function calculateGames(xp_per_game, available_xp) {
            return Math.ceil(available_xp / xp_per_game);
        }
        console.log([level, current_level])
        if (level < current_level) { // 100, 79; 100, 1;
            await interaction.reply('Your desired level should be higher than your current one!')
            return
        }

        let desired_xp = calculateValue(level, 0)
        let available_xp = calculateValue(current_level, current_xp)

        let required_xp = desired_xp - available_xp

        let games_map = [
            { name: 'EggWars Solo/TO4/TO2/Mega', value: 250, type: 'wins' },
            { name: 'EggWars Duels', value: 125, type: 'wins' },
            { name: 'BlockWars Bridges/Duels', value: 30, type: 'wins' },
            { name: 'BlockWars CTF', value: 100, type: 'wins' },
            { name: 'BlockWars CTF Duels', value: 45, type: 'wins' },
            { name: 'GGs', value: 1, type: 'of GGs' },
        ]

        const exampleEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`LEVEL ${current_level} :arrow_right: ${level}`)
            .setURL('https://discord.gg/cubekingdom')
            .setAuthor({ name: 'Achive CubeCraft Level', iconURL: 'https://cdn.discordapp.com/icons/174837853778345984/a_263a891111a4ddc82a10928f4ed086c6.webp?size=24', url: 'https://discord.gg/cubecraft' })
            .setDescription(`Getting from level ${current_level} to ${level} takes ${required_xp} XP`)
            .setThumbnail('https://forums.cubecraftcdn.com/xenforo/serve/styles/cubecraft/cubecraft/sidebar-icons/post-thread-widget-guy.png')
            .addFields(
                games_map.map(game => ({name: game.name, value: `${calculateGames(game.value, required_xp)} ${game.type}`, inline: true}))
            )
            .setTimestamp()
            .setFooter({ text: 'Powered by CubeKingdom', iconURL: 'https://cdn.discordapp.com/icons/1063856077055213659/301cefbfb2b7a43f6281ccc07f092cd2.webp?size=24' });

        await interaction.reply({ embeds: [exampleEmbed] })
            .catch(e => console.log(e));
    }
};
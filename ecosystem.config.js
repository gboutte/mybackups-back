module.exports = {
    apps: [
        {
            name: "api",
            cwd: "./",
            script: "npm",
            args: "run start:prod",
            env: {
                NODE_ENV: "production",
                PORT: 4001,
                APP_MODE: 'prod',
                ACCESS_TOKEN_EXPIRATION: '48h',
                APP_SECRET: makeid(10)
            }
        },
        {
            name: "web",
            cwd: "./client",
            script: "npm",
            args: "run serve:ssr:client",
            env: {
                NODE_ENV: "production",
                PORT: 4002
            }
        },
        {
            name: 'gateway',
            cwd: './gateway',
            script: 'npm',
            args: 'start',
            env: {
                NODE_ENV: "production",
                PORT: 3000
            }
        }
    ]
};
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

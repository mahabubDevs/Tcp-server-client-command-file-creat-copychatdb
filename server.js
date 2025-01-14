// tpc ar jonno use kora hossa 
const net = require('net');
//file neya kaj korar jonno use kora hossa
const fs = require('fs')
//tcp server create kora hossa
const server = net.createServer()
//client er jonno array create kora hossa . client koto jon ta janar jonno
const clients = [];
//database file create kora hossa
const dbFile = 'Database.txt';

//server er jonno connection create kora hossa. eventEmitter ar on use kora hossa
server.on('connection', (socket) => {
    console.log('New connection'); 
    //client id length janar jonno use kora hossa
    const clientID = clients.length + 1;

    //client ar id show korar jonno client ka map 
    clients.map((client) => {           
        client.socket.write(`User ${clientID} joined !`)
    });
    //
    socket.write(`id-${clientID}`);
    //buffer thaka string a convert korar jonno use kora hossa
    clients.push({ id: clientID.toString(), socket}) 
// data read korar jonno use kora hossa. jokon data asha tokon ai function run hobe 
    socket.on("data", (data) => {
        //asha data ta string a convert kora hossa
        const dataString = data.toString("utf-8")
        //dataString ar modda id ar message alada kora hossa
        const id = dataString.substring(0, dataString.indexOf("-"));
        const message = dataString.substring(dataString.indexOf("-message-") + 9);

        clients.map( (client) => {
            if (client.id != id) {
                if (message === " createFile"){
                    const filename = `user-${id}-file.txt`;
                    const content = `user-${id} this is your file`;
                    // Create the file
                    fs.writeFile(filename, content, (err) => {
                        if (err) {
                            console.error("Error creating file:", err);
                            socket.write(`Error creating file: ${err.message}`);
                        } else {
                            console.log(`File ${filename} created successfully!`);
                            client.socket.write(`User ${id}: File is created successfully.`);
                        }
                    });
                    return; 
                }
                if (message === " copyChat"){
                    const desti = dbFile;
                    const copydes = "copyedMassage.txt";
                    fs.copyFile(desti,copydes,(err)=>{
                        client.socket.write(`User ${id}: File is copied successfully.`);
                        if(err){
                            console.log(err,'copy error')
                        }
                    })
                    return;
                }
                if(message ){
                    const db = "Database.txt";
                    const content = `User ${id} : ${message}\n`;
                    fs.appendFile(db, content, (err) => {
                        if (err) {
                            console.error("Error writing to database:", err);
                        }
                    });
                }
                client.socket.write(`User ${id} : ${message}`);
            }
        });
    });
    //data end hole ai function run hobe
    socket.on('end', () => {
        clients.map((client) => {
            client.socket.write(`User ${clientID} left !`)
        });
    });

});

//server run kora hossa clint ar shata communication korar jonno
server.listen(3000, '127.0.0.1', () => {
    console.log('Server is listening on port 3000',server.address());
});




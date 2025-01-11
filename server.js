const net = require('net');
const fs = require('fs')
const server = net.createServer()
const clients = [];
const dbFile = 'Database.txt';


server.on('connection', (socket) => {
    console.log('New connection');  
    const clientID = clients.length + 1;

    clients.map((client) => {           // it start when 2nd user join the chat but he cant see that 
        client.socket.write(`User ${clientID} joined !`)
    });
    socket.write(`id-${clientID}`);
    
    clients.push({ id: clientID.toString(), socket}) 

    socket.on("data", (data) => {
        const dataString = data.toString("utf-8")
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
                    const desti = `Database.txt`;
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
    socket.on('end', () => {
        clients.map((client) => {
            client.socket.write(`User ${clientID} left !`)
        });
    });

});

server.listen(3000, '127.0.0.1', () => {
    console.log('Server is listening on port 3000',server.address());
});



///
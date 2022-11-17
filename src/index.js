var http = require("http");

const httpServer = http.createServer(handleServer);

function handleServer(req, response) {
  const url = req.url;
  const method=req.method;
  
if (url === '/welcome' && method === 'GET') {
    response.on('error', (err) => {
        console.error(err);
      });
   
      // response.statusCode = 200;
      response.writeHead(200,{'Content-Type': 'text/plain'});
      response.write(" Welcome to Dominos!");
      response.end();

}else if (url === '/contact' && method === 'GET') {
    response.on('error', (err) => {
        console.error(err);
      });
      response.writeHead(200, {'Content-Type': 'application/json'})
      response.write(JSON.stringify({  
                  phone: '18602100000', 
                  email: 'guestcaredominos@jublfood.com' 
          }
       ));
      response.end();
} 
else{
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write("404 Not Found");
    response.end();
}

}
httpServer.listen(8081,()=>console.log("The server is up at 8081"));
module.exports = httpServer;

import * as http from 'http';
import { Gpio } from 'pigpio';

// Check passcode:
if (process.env.PASSCODE === undefined) {
  console.log("Set the PASSCODE env var to start this server");
  process.exit(0);
}
const PASSCODE: string = process.env.PASSCODE;


// Check passcode:
let ENABLE_SERVO: boolean = false;
let motor: Gpio;
if (process.env.ENABLE_SERVO !== undefined) {
  ENABLE_SERVO = true;
  motor = new Gpio(12, {mode: Gpio.OUTPUT});
}

// Listen on port 3000
let port: number = 3000;
if (process.argv.length > 1) {
  port = parseInt(process.argv[2]);
  if (isNaN(port) || port < 0 || port > 65535) {
    console.log("Enter a valid port number between 0 and 65535, or omit to default to 3000");
    process.exit(0);
  }
}

// Create a server
const server = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    // Check if request path matches the specified path
    else if (req.url === '/open-door') {
      const body = await getBody(req);
      console.log(`Attempted passcode: ${body}`);
      const passcodeJson = JSON.parse(body);
      if ('passcode' in passcodeJson && typeof passcodeJson.passcode === 'string' && passcodeJson.passcode === PASSCODE) {
        console.log("Correct passcode!");
        res.writeHead(200);
        if (ENABLE_SERVO) {
          moveServo();
        }
      } else {
        console.log("Incorrect passcode!");
        res.writeHead(401);
      }
      res.end();
    } else {
      // For any other path
      res.writeHead(404, {'Content-Type': 'application/json'});
      res.end('Not Found\n');
    }
  });
  
  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
  

function getBody(request: http.IncomingMessage): Promise<string> {
  return new Promise<string>((resolve) => {
    const bodyParts: any[] = [];
    let body: string;
    request.on('data', (chunk: any) => {
      bodyParts.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(bodyParts).toString();
      resolve(body)
    });
  });
}

const delay = (ms?: number) => new Promise(resolve => setTimeout(resolve, ms));

async function moveServo() {
  motor.servoWrite(500);
  await delay(2000);
  motor.servoWrite(2500);
}
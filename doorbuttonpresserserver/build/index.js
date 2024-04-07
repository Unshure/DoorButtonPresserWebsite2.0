"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
// Check passcode:
if (process.env.PASSCODE === undefined) {
    console.log("Set the PASSCODE env var to start this server");
    process.exit(0);
}
const PASSCODE = process.env.PASSCODE;
// Listen on port 3000
let port = 3000;
if (process.argv.length > 1) {
    port = parseInt(process.argv[2]);
    if (isNaN(port) || port < 0 || port > 65535) {
        console.log("Enter a valid port number between 0 and 65535, or omit to default to 3000");
        process.exit(0);
    }
}
// Create a server
const server = http.createServer((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const body = yield getBody(req);
        console.log(`Attempted passcode: ${body}`);
        const passcodeJson = JSON.parse(body);
        if ('passcode' in passcodeJson && typeof passcodeJson.passcode === 'string' && passcodeJson.passcode === PASSCODE) {
            console.log("Correct passcode!");
            res.writeHead(200);
        }
        else {
            console.log("Incorrect passcode!");
            res.writeHead(401);
        }
        res.end();
    }
    else {
        // For any other path
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end('Not Found\n');
    }
}));
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
function getBody(request) {
    return new Promise((resolve) => {
        const bodyParts = [];
        let body;
        request.on('data', (chunk) => {
            bodyParts.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(bodyParts).toString();
            resolve(body);
        });
    });
}

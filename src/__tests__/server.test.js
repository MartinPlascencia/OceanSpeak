const https = require('https');
const WebSocket = require('ws');
let fireworksUrl = 'wss://staging1.z8f0n2p4.theworldslargest.com:8185/game';
let agent = new https.Agent({ rejectUnauthorized: false })
const socket = new WebSocket(fireworksUrl, {agent});

afterAll(() => {
    socket.close();
});

describe('WebSocket Connection',()=>{
    test('should connect to the WebSocket server', (done) => {      
        socket.onopen = () => {
            expect(socket.readyState).toBe(1);
            done();
        };
    });  
});

describe('WebSocket Message',()=>{ 
    let testAuthentication, testMatchWillStart, testAttackDidHappen, testUnitDies, testEndGame, testLevelUp;

    test('should receive an authentication message', async() => {
        testAuthentication = (type) =>{
            expect(type).toBe('authentication');
        }
    });

    test('should receive the match information', () => {
        testMatchWillStart = (match) =>{
            expect(typeof match).toBe('object');
            expect(typeof match.level).toBe('number');
            expect(typeof match.opponent_id).toBe('string');
            expect(typeof match.player_id).toBe('string');
            expect(Array.isArray(match.opponent_units)).toBe(true);
            expect(Array.isArray(match.player_units)).toBe(true);
        }
    });

    test('should receive an attack message', () => {
        testAttackDidHappen = (message) =>{
            console.log('checking attack');
            expect(typeof message.from_unit).toBe('string');
            expect(typeof message.to_unit).toBe('string');
            expect(typeof message.health_points).toBe('number');
        }
    });

    test('should receive a unit dies message', () => {
        testUnitDies = (unitClass) =>{
            expect(typeof unitClass).toBe('string');
        }
    });

    test('should receive an end game message', () => {
        testEndGame = (message) =>{
            expect(typeof message.who_wins).toBe('string');
        } 
    });

    test('should receive a level up message', () => {
        testLevelUp = (level) =>{
            expect(typeof level).toBe('string');
        }
    });

    socket.onmessage = (event) => {
        let msg = JSON.parse(event.data);
        //console.log('msg =', msg.type)
        switch (msg.type) {
            case 'authentication':
                //console.log('authentication: ', msg)
                if (testAuthentication) {
                    testAuthentication(msg.type);
                }
                socket.send(JSON.stringify({ 'username': 'user-name-goes-here' }));
                break;
    
            case 'waiting-for-action':
                //console.log('wait-for-action: ', msg)
                socket.send(JSON.stringify({ 'type': 'action' }));
                break;
    
            case 'match-will-start':
                //console.log('msg =', msg)  
                testMatchWillStart(msg.match);
                break;
    
            case 'turn-did-happen':
                //console.log('msg =', msg)
                break;
                
            case 'attack-did-happen':
                //console.log('msg =', msg)
                testAttackDidHappen(msg);
                break;
    
            case 'unit-dies':
                //console.log('msg =', msg)
                testUnitDies(msg.unit_class);
                break;
                
            case 'end-game':
                //console.log('msg =', msg)
                testEndGame(msg);
                break;
                
            case 'level-up':
                //console.log('msg =', msg)
                testLevelUp(msg.new_level);
                break;
    
            default:
                break;
        }
    };
});    

socket.onerror = (event) => {
    console.log('Socket event error. event.data = ', event);
};

socket.onclose = (event) => {
    
};
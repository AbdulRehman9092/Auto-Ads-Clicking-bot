const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_TOKEN = 'Gologin API Key'; // Replace with your actual GoLogin API key
const API_URL = 'https://api.gologin.com/browser';

const resolutions = [
    '1920x1080',
    '1366x768',
    '1600x900',
    '1280x720',
    '1440x900',
    '2560x1440',
    '3840x2160',
    '1024x768',
    '1280x1024',
    '1680x1050'
];

// Function to get a random resolution from the array
function getRandomResolution() {
    const randomIndex = Math.floor(Math.random() * resolutions.length);
    return resolutions[randomIndex];
}

// Function to read proxies from the file
function loadProxies() {
    try {
        const proxies = fs.readFileSync(PROXIES_FILE_PATH, 'utf8')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line !== ''); // Remove empty lines
        return proxies;
    } catch (error) {
        console.error(`Error reading proxies file: ${error.message}`);
        return [];
    }
}

// Function to parse proxies in the format http://username:password@host:port
function parseProxy(proxyString) {
    const match = proxyString.match(/http:\/\/(.*):(.*)@(.*):(\d+)/);
    if (!match) {
        throw new Error(`Invalid proxy format: ${proxyString}`);
    }

    return {
        mode: 'http',
        username: match[1],
        password: match[2],
        host: match[3],
        port: parseInt(match[4], 10)
    };
}

async function createProfile(profileData) {
    try {
        const response = await axios.post(API_URL, profileData, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Profile created:', response.data);
    } catch (error) {
        console.error('Error creating profile:', error.response ? error.response.data : error.message);
    }
}

function generateUserAgent(i) {
    return `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.${i} Safari/537.36`;
}

async function createProfiles(count) {
    const proxies = loadProxies();

    if (proxies.length < count) {
        console.error('Not enough proxies in the file for the number of profiles.');
        return;
    }

    for (let i = 0; i < count; i++) {
        try {
            const proxy = parseProxy(proxies[i]); // Use the i-th proxy

            const profileData = {
                name: `Profile ${i + 1}`,
                notes: `Automated profile ${i + 1}`,
                browserType: 'chrome',
                os: 'win',
                googleServicesEnabled: false,
                lockEnabled: false,
                debugMode: false,
                navigator: {
                    userAgent: generateUserAgent(i + 1), // Generate unique user agent
                    resolution: getRandomResolution(), // Get random resolution
                    language: 'en-US',
                    platform: 'Windows 11 x86_64', // Custom string indicating Windows 11
                    doNotTrack: true,
                    hardwareConcurrency: 4,
                    deviceMemory: 4,
                    maxTouchPoints: 0
                },
                geoProxyInfo: {},
                storage: {
                    local: false,
                    extensions: true,
                    bookmarks: false,
                    history: false,
                    passwords: false,
                    session: false
                },
                // proxyEnabled: false, if you want to remove proxy logic, you can uncomment this line
                // proxy: {
                //     mode: 'none',
                //     host: '',
                //     port: 0,
                //     username: '',
                //     password: ''
                // },
                // dns: '', if you dont want to use DNS, you can uncomment this line
                proxyEnabled: true, // Enable proxy
                proxy: proxy, // Add proxy details here
                dns: '',
                plugins: {
                    enableVulnerable: false,
                    enableFlash: true
                },
                timezone: {
                    enabled: true,
                    fillBasedOnIp: true,
                    timezone: 'UTC'
                },
                audioContext: {
                    mode: 'off',
                    noise: 0
                },
                canvas: {
                    mode: 'off',
                    noise: 0
                },
                fonts: {
                    families: ['Arial', 'Verdana'],
                    enableMasking: true,
                    enableDomRect: true
                },
                mediaDevices: {
                    videoInputs: 1,
                    audioInputs: 1,
                    audioOutputs: 1,
                    enableMasking: true
                },
                webRTC: {
                    mode: 'alerted',
                    enabled: true,
                    customize: true,
                    localIpMasking: false,
                    fillBasedOnIp: true,
                    publicIp: '',
                    localIps: ['']
                },
                webGL: {
                    mode: 'noise',
                    getClientRectsNoise: 0,
                    noise: 0
                },
                clientRects: {
                    mode: 'noise',
                    noise: 0
                },
                webGLMetadata: {
                    mode: 'mask',
                    vendor: 'Intel Inc.',
                    renderer: 'Intel Iris OpenGL Engine'
                },
                webglParams: [],
                profile: '',
                googleClientId: '',
                updateExtensions: true,
                chromeExtensions: []
            };

            await createProfile(profileData);
        } catch (error) {
            console.error(`Error creating profile ${i + 1}: ${error.message}`);
        }
    }
}

createProfiles(1000).catch(console.error);

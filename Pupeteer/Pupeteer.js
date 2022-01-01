const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const robot = require('robotjs');

// Add Puppeteer stealth plugin for anti-bot measures
puppeteer.use(StealthPlugin());

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

const apiKey = 'jkasndiuh8y7780';  // Replace with your actual API key
const profileIds = [
    "6728c2fdecc40d2887841c74",
    "6728c2fc7b3bdc8d3e52932b",
    "6728c2cd2f0f8d79a547351d"
];

// Dynamically import the GoLogin module
let GoLogin;
(async () => {
    GoLogin = (await import('gologin')).default;
    
    // Process profiles one by one in sequence
    for (const profileId of profileIds) {
        await processProfile(profileId);
    }

    console.log("Completed tasks for all profiles.");
})();

// Function to open a GoLogin profile and perform the task
async function processProfile(profileId) {
    console.log(`Processing profile: ${profileId}`);

    const GL = new GoLogin({
        token: apiKey,
        profile_id: profileId,
        extra_params: {
            'args': ['--disable-popup-blocking']  // Add the disable popup blocking argument here
        }
    });

    const { status, wsUrl } = await GL.start().catch((e) => {
        console.error(`Failed to start GoLogin profile ${profileId}:`, e);
        return { status: 'failure' };
    });

    if (status !== 'success') {
        console.log(`Failed to start profile ${profileId}`);
        return;
    }

    const browser = await puppeteer.connect({
        browserWSEndpoint: wsUrl,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        ignoreHTTPSErrors: true,
        defaultViewport: null, // This helps inherit the profile viewport settings
        args: [
            '--disable-popup-blocking', // Explicitly disable popup blocking
        ]
    });

    try {
        const pages = await browser.pages();
        const page = pages[0];

        // Call the automation task
        await performAutomationTasks(page);

    } catch (error) {
        console.error(`Error with profile ${profileId}:`, error);
    } finally {
        await browser.close();
        console.log(`Closed browser for profile ${profileId}.`);
    }
}

const targetUrl = 'DirectLinkForAds';
// Below are functions for high paying ads and actions for high CPM
async function performAutomationTasks(page) {
    await page.goto(targetUrl);
    console.log("Navigated to target URL");

    await checkUrlLoop(page);
    console.log("Automation tasks completed for the profile.");
}

// Check URL loop, similar to `CheckUrlLoop` in C#
async function checkUrlLoop(page) {
    console.log("Checking URLs...");

    while (true) {
        try {
            const currentUrl = page.url();
            console.log(`Current URL: ${currentUrl}`);

            if (currentUrl === "https://chromewebstore.google.com/detail/primary-adblock-adios-ads/clgmeeidjanhodpnonllffbdmgnhmgpk") {
                console.log("Primary AdBlock page detected. Adding extension...");
                await handleAddExtension(page);
                break;

            } else if (currentUrl.includes("chromewebstore.google.com")) {
                console.log("Chrome Web Store detected. Adding extension...");
                await handleAddExtension(page);
                break;

            } else if (currentUrl.includes("golumantes.com/click.php")) {
                await handleClickPage(page);

            } else if (currentUrl.includes("https://lps.plarium.com/en/")) {
                await handlePlariumClickPage(page);

            } else if (currentUrl.includes("pd=depapITlhh")) {
                await handleAddExtensionLink1(page);

            } else if (currentUrl.includes("https://adznomore.com")) {
                await handleAddExtensionLink2(page);

            } else if (currentUrl.includes("pd=czpr9X1CenP")) {
                await handleAddExtensionLink3(page);

            } else if (currentUrl.includes("pd=czpa1lhDX0")) {
                await handleAddExtensionLink5(page);

            } else if (currentUrl.includes("pd=czprDH2xm7")) {
                await handleAddExtensionLink4(page);

            } else if (currentUrl.includes("notif-new2.html?an=pa")) {
                await handleAddExtensionLink7(page);

            }  else if (currentUrl.includes("recom.html?an=pa")) {
                await handleAddExtensionLink8(page);

            } else {
                await handleOtherUrlsTimeout(page);
            }

            await delay(1000);

        } catch (error) {
            console.error(`Error in URL loop: ${error.message}`);
            break;
        }
    }
}

// Function to add an extension by clicking "Add to Chrome"
async function handleAddExtension(page) {
    try {
        // Wait for page to fully load
        await page.waitForNavigation({ waitUntil: 'load' });
        
        // Wait for the selector to load and then click
        await page.waitForSelector("span[jsname='V67aGc'][class='UywwFc-vQzf8d']", { timeout: 10000 });
        await page.click("span[jsname='V67aGc'][class='UywwFc-vQzf8d']");
        
        // Wait a bit before sending further key inputs
        await delay(4000);
        robot.keyTap('tab');
        
        // Additional delay before pressing 'enter'
        await delay(2000);
        robot.keyTap('enter');

        const isInstalled = await waitForExtensionInstalled(page);
        if (isInstalled) {
            console.log("Extension added successfully.");
        } else {
            console.log("Extension installation timed out.");
        }

    } catch (error) {
        console.error(`Error while adding extension: ${error.message}`);
    }
}


// Function to wait for extension installation
async function waitForExtensionInstalled(page, timeout = 360000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        try {
            const removeButton = await page.$("[class='UywwFc-vQzf8d']");
            if (removeButton) {
                const buttonText = await page.evaluate(el => el.textContent, removeButton);
                if (buttonText.includes("Remove from Chrome")) {
                    return true;
                }
            }
        } catch (error) {
            console.error(`Error waiting for extension: ${error.message}`);
        }
        await delay(2000);
    }
    return false;
}

// Additional handler functions for other URL cases
async function handleClickPage(page) {
    console.log("Golumantes click page detected. Clicking...");
    await delay(2000);
    const link = await page.$("a[href*='/click.php?lp=1']");
    if (link) {
        await link.click();
        console.log("Link clicked successfully.");
        await delay(2000);
    } else {
        console.log("Link not found on the page.");
    }
}

async function handlePlariumClickPage(page) {
    console.log("Plarium click page detected. Clicking Male button...");
    await delay(2000);
    const maleButton = await page.$("div.PCztpS > span[data-element='DangerousInnerHTML']");
    if (maleButton) {
        await maleButton.click();
        console.log("Male button clicked successfully.");
        await delay(2000);
    } else {
        console.log("Male button not found on the page.");
    }
}

async function handleAddExtensionLink1(page) {
    console.log("Handling 'Add Extension' link for pd=depapITlhh...");
    await delay(2000);
    const link1 = await page.$("a[bnmo*='bfelalhndlhoohbhiddkmkjhcaipclcn']");
    if (link1) {
        await link1.click();
        console.log("Button clicked successfully.");
        await delay(2000);
    } else {
        console.log("Button not found on the page.");
    }
}

async function handleAddExtensionLink2(page) {
    console.log("Handling 'Get Ad Blocker Elite' link on adznomore.com...");
    await delay(2000);
    const link2 = await page.$("a.btn_install2[href*='bfelalhndlhoohbhiddkmkjhcaipclcn']");
    if (link2) {
        await link2.click();
        console.log("Button clicked successfully.");
        await delay(2000);
    } else {
        console.log("Button not found on the page.");
    }
}

async function handleAddExtensionLink3(page) {
    console.log("Handling 'Add Extension' link for pd=czpr9X1CenP...");
    await delay(2000);
    const link3 = await page.$("a[squas*='kgjpihadkppeljjapkmainmohomeppok']");
    if (link3) {
        await link3.click();
        console.log("Button clicked successfully.");
        await delay(2000);
    } else {
        console.log("Button not found on the page.");
    }
}

async function handleAddExtensionLink4(page) {
    console.log("Handling 'Add Extension' link for pd=czprDH2xm7...");
    await delay(2000);
    const link4 = await page.$("a.btn.btn-primary[squas*='kgjpihadkppeljjapkmainmohomeppok']");
    if (link4) {
        await link4.click();
        console.log("Button clicked successfully.");
        await delay(2000);
    } else {
        console.log("Button not found on the page.");
    }
}

async function handleAddExtensionLink5(page) {
    console.log("Handling 'Add Extension' link for pd=czpa1lhDX0...");
    await delay(2000);
    const link5 = await page.$("a[squas*='kgjpihadkppeljjapkmainmohomeppok']");
    if (link5) {
        await link5.click();
        console.log("Button clicked successfully.");
        await delay(2000);
    } else {
        console.log("Button not found on the page.");
    }
}

async function handleAddExtensionLink7(page) {
    console.log("Handling 'Add Extension' link for Link7");
    await delay(2000);
    const Link7 = await page.$("#continue");
    if (Link7) {
        await Link7.click();
        console.log("Button clicked successfully.");
        await delay(2000);
    } else {
        console.log("Button not found on the page.");
    }
}

async function handleAddExtensionLink8(page) {
    console.log("Handling 'Add Extension' link for Link8");
    await delay(2000);
    const Link8 = await page.$(".download-btn.AddToBrowser");
    if (Link8) {
        await Link8.click();
        console.log("Button clicked successfully.");
        await delay(2000);
    } else {
        console.log("Button not found on the page.");
    }
}

async function handleOtherUrlsTimeout(page) {
    console.log("Handling other URLs with timeout...");
    const startTime = Date.now();
    while ((Date.now() - startTime) < 80000) {
        const currentUrl = page.url();
        console.log(`Current URL during timeout: ${currentUrl}`);

        // Check if we need to exit based on URL
        if (["chromewebstore.google.com", "golumantes.com/click.php", "https://lps.plarium.com/en/"].some(url => currentUrl.includes(url))) {
            console.log("Detected a relevant URL. Exiting timeout function.");
            return;
        }

        await delay(1000);
    }
    throw new Error("Timeout occurred without finding a relevant URL.");
}

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const robot = require('robotjs');
puppeteer.use(StealthPlugin());

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

/**
 * @returns {Promise<void>}
 */
const randomDelay = () => {
    const delayTime = Math.floor(Math.random() * 6000) + 2000; // Random delay between 1000ms (1s) and 10000ms (10s)
    return new Promise((resolve) => setTimeout(resolve, delayTime));
};

const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzUzZTRhYzZmMGNlYzcyOWYzZTc2NWYiLCJ0eXBlIjoiZGV2Iiwiand0aWQiOiI2NzU0OWEyNWVkYTJiNTZiNDE5YTU1NmEifQ.C3wckMZeRuTbHCK_Mt2FkVPE6v23RnFfmKuzDgdXhLU';  // Replace with your actual API key
const profileIds = [
    "67549ce4ff04ab45397b684d",
    "67549a499b0b7300ab507bb2"
];
let GoLogin;

(async () => {
    GoLogin = (await import('gologin')).default;

    // Process profiles in batches of 10
    const batchSize = 10; 
    for (let i = 0; i < profileIds.length; i += batchSize) {
        const batch = profileIds.slice(i, i + batchSize);
        console.log(`Processing batch: ${batch}`);
        
        // Process all profiles in the batch
        await Promise.all(batch.map((profileId, index) => processProfile(profileId, index + 1)));
        
        console.log(`Completed batch: ${batch}`);
    }

    console.log("Completed tasks for all profiles.");
})();

async function processProfile(profileId, profileIndexInBatch) {
    console.log(`Starting tasks for profile: ${profileId}, Index in batch: ${profileIndexInBatch}`);

    const GL = new GoLogin({
        token: apiKey,
        profile_id: profileId,
        args: ['--disable-popup-blocking',
            '--blink-settings=imagesEnabled=false'],
        protocolTimeout: 180000,
        skipOrbitaHashChecking: true // Skip Orbita browser hash checking
    });

    try {
        const { status, wsUrl } = await GL.start().catch((e) => {
            console.error(`Failed to start GoLogin profile ${profileId}:`, e);
            return { status: 'failure' };
        });

        if (status !== 'success') {
            console.log(`Failed to start profile ${profileId}`);
            return false; // Return false if profile failed to start
        }

        const browser = await puppeteer.connect({
            browserWSEndpoint: wsUrl,
            ignoreHTTPSErrors: true,
            defaultViewport: null,
            protocolTimeout: 180000,
              });

        try {
            await delay(4000);
            await performTasksForProfile(browser, profileId);

            if (profileIndexInBatch === 9) {
                await handleIframesForProfile(browser);
            }

        } catch (error) {
            console.error(`Error with profile ${profileId}:`);
            return false;
        } finally {
            await randomDelay();
            await delay(2000);
            await browser.close();
            console.log(`Closed browser for profile ${profileId}.`);
        }

    } catch (error) {
        if (error.code === 'ERR_ASSERTION') {
            console.error("Assertion laura occur");
        } else {
            console.error(`Error starting profile: ${profileId}`);
        }
        // Skip to the next profile if an error occurs during profile startup
        return false;
    }

    return true; // Return true if profile tasks are completed successfully
}

const performTasksForProfile = async (browser, profileId) => {
    const logError = (error, step) => {
        console.error(`Error during "${step}" for profile ${profileId}:`);
    };

    try {
        // Delay before closing the page
        try {
            await delay(200);
        } catch (error) {
            logError(hi4, 'closing page');
        }
    } catch (error) {
        console.error(`Unexpected error for profile ${profileId}:`);
    }
};

const handleIframesForProfile = async (browser) => {
    try {
        const tabs = await browser.pages();
        await delay(25000);

        // Set default timeout for all tabs
        tabs.forEach(page => {
            page.setDefaultTimeout(120000);
        });

        // Function to handle a single tab
        const handleIframeInTab = async (page, tabNumber) => {
            try {
                await randomDelay();
                await page.bringToFront(); // Focus the tab
                await page.evaluate(() => {
                    window.focus(); // Bring the browser tab into focus
                });

                const iframeSelector = 'iframe[id^="aswift_5"]';

                // Find iframes in the current tab
                const iframeHandles = await page.$$(iframeSelector);

                if (iframeHandles.length === 0) {
                    console.log(`No matching iframes found on tab ${tabNumber}.`);
                    return; // Skip further processing for this tab
                }

                console.log(`Found ${iframeHandles.length} matching iframes on tab ${tabNumber}.`);

                // Get the first iframe handle
                const iframeHandle = iframeHandles[0];

                try {
                    // Scroll to the iframe to make it visible
                    await page.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), iframeHandle);
                    const iframe = await iframeHandle.contentFrame();

                    await iframeHandle.click();
                    console.log(`Clicked on the iframe element on tab ${tabNumber}.`);

                    if (!iframe) {
                        console.log(`Could not access the content of the iframe on tab ${tabNumber}.`);
                    }
                } catch (iframeError) {
                    console.error(`Error processing iframe on tab ${tabNumber}:`);
                }
            } catch (error) {
                console.error(`Error handling tab ${tabNumber}:`);
            } finally {
                try {
                    await delay(2000);
                } catch (closeError) {
                    console.error(`Error during delay for tab ${tabNumber}:`);
                }
            }
        };

        // Function to handle specific tabs
        const handleTabs = async () => {
    try {
        if (tabs.length > 1) {
            console.log("Handling the first tab only for the 5th profile.");
            await handleIframeInTab(tabs[1], 1); // Process only the first tab (index 1)
            await handleIframeInTab(tabs[2], 2);
            await handleIframeInTab(tabs[3], 3);
            await handleIframeInTab(tabs[4], 4);
            await handleIframeInTab(tabs[5], 5);
        } else {
            console.log("No additional tabs available to process.");
        }
    } catch (error) {
        console.error("Error handling the first tab of the 5th profile:");
    }
};

// Call the function to handle tabs
await handleTabs();

    } catch (error) {
        console.error('Error in handleIframesForProfile:');
    }
};
# Auto-Ads-Clicking-bot

This repository contains a collection of automation scripts designed for advanced web scraping and interaction tasks. The scripts utilize GoLogin to manage browser profiles with unique fingerprints, ensuring stealth and reliability. The automation is implemented using both Python with SeleniumBase and Node.js with Puppeteer, providing flexibility for different use cases.

The primary functions include bulk creation of browser profiles, automated navigation, ad interaction, and browser extension installation.

## Features

*   **GoLogin Integration**: Seamlessly manage unique browser profiles, proxies, and fingerprints.
*   **Bulk Profile Management**: Scripts to programmatically create and retrieve GoLogin profiles.
*   **Dual-Stack Automation**: Includes both Python (SeleniumBase) and Node.js (Puppeteer) implementations.
*   **Advanced Web Interaction**: Handles complex scenarios like pop-ups, iframes, and dynamic content.
*   **Automated Extension Installation**: Automates the process of adding Chrome extensions from the web store.
*   **Stealth Operations**: Uses `puppeteer-extra-plugin-stealth` to evade bot detection measures.
*   **Customizable Workflows**: Scripts are designed to be easily modified for different target URLs and interaction logic.

## Repository Structure

```
.
├── Gologin Bulk Profiles Creation.js # Node.js script to create GoLogin profiles in bulk.
├── Gologin Profile ids.js            # Node.js script to fetch all profile IDs from a GoLogin account.
├── Seleniumbase.py                   # Python script using SeleniumBase for browser automation.
└── Pupeteer/
    ├── Bulk profiles.js              # Advanced Puppeteer script for batch processing of profiles.
    └── Pupeteer.js                   # Core Puppeteer script for sequential profile processing and ad interaction.
```

## Prerequisites

*   **Node.js**: Required for running the `.js` scripts.
*   **Python 3**: Required for running the `.py` script.
*   **GoLogin Account**: An active GoLogin account and API Key are necessary.
*   **Proxies**: A list of proxies is required for the bulk profile creation script.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/abdulrehman9092/auto-ads-clicking-bot.git
    cd auto-ads-clicking-bot
    ```

2.  **Install Node.js dependencies:**
    ```bash
    npm install axios puppeteer-extra puppeteer-extra-plugin-stealth robotjs gologin
    ```

3.  **Install Python dependencies:**
    ```bash
    pip install gologin seleniumbase pyautogui
    ```

## Usage

### Step 1: Create GoLogin Profiles (Optional)

If you need to create multiple profiles with unique configurations, use the `Gologin Bulk Profiles Creation.js` script.

1.  Create a file named `proxies.txt` in the root directory and add your proxies, one per line, in the format `http://username:password@host:port`.
2.  Open `Gologin Bulk Profiles Creation.js` and replace `'Gologin API Key'` with your actual GoLogin API key.
3.  Adjust the number of profiles to create by changing the value in `createProfiles(1000)`.
4.  Run the script:
    ```bash
    node "Gologin Bulk Profiles Creation.js"
    ```

### Step 2: Get GoLogin Profile IDs

To run the automation bots, you need the IDs of the profiles you want to use.

1.  Open `Gologin Profile ids.js` and replace `'Bearer Gologin API Key'` with your GoLogin API key.
2.  Run the script:
    ```bash
    node "Gologin Profile ids.js"
    ```
3.  The script will output an array of all your profile IDs. Copy this array for the next step.

### Step 3: Run the Automation Bot

You can choose between the Python/SeleniumBase bot or the Node.js/Puppeteer bots.

#### Python (SeleniumBase)

1.  Open `Seleniumbase.py`.
2.  Replace `"Gologin API Key"` with your actual API key.
3.  Paste the profile IDs copied from Step 2 into the `PROFILE_IDS` list.
4.  Set the target URL by modifying `main_url = "https:example.com"`.
5.  If you use the adblocker feature, update the path in `--load-extension=/path to dir/adblock`.
6.  Run the script:
    ```bash
    python Seleniumbase.py
    ```

#### Node.js (Puppeteer)

There are two Puppeteer scripts available. `Pupeteer.js` processes profiles one by one, while `Bulk profiles.js` processes them in batches.

1.  Navigate to the `Pupeteer` directory.
2.  Open either `Pupeteer.js` or `Bulk profiles.js`.
3.  Replace the placeholder `apiKey` with your GoLogin API key.
4.  Paste the profile IDs into the `profileIds` array.
5.  In `Pupeteer.js`, set your target link in the `targetUrl` variable.
6.  Run the desired script:
    ```bash
    # For the sequential bot
    node Pupeteer/Pupeteer.js

    # For the batch-processing bot
    node Pupeteer/"Bulk profiles.js"
    ```

## Configuration

Each script requires specific configuration:

*   **API Keys**: All scripts require a valid GoLogin API Key.
*   **Profile IDs**: The main automation scripts (`Seleniumbase.py`, `Pupeteer.js`, `Bulk profiles.js`) need a list of GoLogin profile IDs to operate on.
*   **Target URLs**: In `Pupeteer.js`, the `targetUrl` constant must be set to the direct link you want the bot to visit first.
*   **Script-specific Parameters**: Some scripts have unique parameters, like the number of profiles to create or the batch size for processing. Review the top of each script file for these settings.

## Disclaimer

This project is for educational and research purposes only. Automating ad clicks is against the terms of service of most advertising networks and websites. The user of this software is solely responsible for any consequences arising from its use. The author assumes no liability and is not responsible for any misuse or damage caused by this repository.

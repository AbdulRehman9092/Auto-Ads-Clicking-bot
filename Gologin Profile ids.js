const axios = require('axios');

async function getGoLoginProfileIds() {
    const allProfileIds = [];
    let currentPage = 1;
    let hasMoreProfiles = true;

    while (hasMoreProfiles) {
        try {
            const response = await axios.get('https://api.gologin.com/browser/v2', {
                headers: {
                    'Authorization': 'Bearer Gologin API Key', // Replace with your actual GoLogin API key
                    'Content-Type': 'application/json'
                },
                params: {
                    limit: 30,  // Adjust limit as needed
                    page: currentPage,
                    sorterField: 'createdAt',
                    sorterOrder: 'descend'
                }
            });

            // Extract profile IDs from the response
            const profileIds = response.data.profiles.map(profile => profile.id);
            allProfileIds.push(...profileIds); // Add them to the allProfileIds array

            // Check if there are more profiles to fetch
            hasMoreProfiles = response.data.profiles.length === 30; // Assuming 30 is the limit, change if needed
            currentPage++; // Move to the next page

        } catch (error) {
            console.error('Error fetching GoLogin profile IDs:', error);
            hasMoreProfiles = false; // Stop if there's an error
        }
    }

    // Format the output in the requested array style
    console.log(`[\n    ${allProfileIds.map(id => `"${id}"`).join(',\n    ')}\n]`);
}

getGoLoginProfileIds();

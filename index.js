import axios from 'axios';

async function fetchAndStringify(url) {
  try {
    console.log(`Fetching content from: ${url}`);
    
    const response = await axios.get(url);
    
    const stringified = JSON.stringify(response.data, null, 2);
    
    console.log('\n--- Stringified Content ---\n');
    console.log(stringified);
    console.log('\n--- End of Content ---\n');
    
    return stringified;
  } catch (error) {
    console.error('Error fetching URL:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    throw error;
  }
}

const url = process.argv[2] || 'https://tinnhac.com';

fetchAndStringify(url)
  .then(() => {
    console.log('✓ Successfully fetched and stringified URL content');
  })
  .catch(() => {
    console.error('✗ Failed to fetch and stringify URL content');
    process.exit(1);
  });

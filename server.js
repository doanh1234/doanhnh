import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

async function fetchAndStringify(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const stringified = JSON.stringify(response.data, null, 2);
    return {
      success: true,
      data: response.data,
      stringified: stringified
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText
    };
  }
}

app.get('/nguonc', async (req, res) => {
  try {
    const targetUrl = req.query.url || 'https://media.hth4nh.eu.org/nguonc';
    const result = await fetchAndStringify(targetUrl);
    
    if (result.success) {
      res.json(result.data);
    } else {
      res.status(result.status || 500).json({
        error: result.error,
        status: result.status,
        statusText: result.statusText
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.get('/fetch', async (req, res) => {
  try {
    const targetUrl = req.query.url;
    
    if (!targetUrl) {
      return res.status(400).json({
        error: 'Missing required parameter: url',
        usage: '/fetch?url=https://example.com'
      });
    }
    
    const result = await fetchAndStringify(targetUrl);
    
    if (result.success) {
      res.json(result.data);
    } else {
      res.status(result.status || 500).json({
        error: result.error,
        status: result.status,
        statusText: result.statusText
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.get('/', (req, res) => {
  res.json({
    message: 'URL Stringify API',
    endpoints: {
      '/nguonc': 'Fetch default nguonc URL or custom URL with ?url=<target>',
      '/fetch?url=<target>': 'Fetch any URL and return its content'
    },
    examples: [
      '/nguonc',
      '/nguonc?url=https://tinnhac.com',
      '/fetch?url=https://example.com'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`✓ Server is running on http://localhost:${PORT}`);
  console.log(`✓ API endpoint: http://localhost:${PORT}/nguonc`);
  console.log(`✓ Fetch endpoint: http://localhost:${PORT}/fetch?url=<target>`);
});

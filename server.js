import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';

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

async function scrapeOphim18(page = 1) {
  try {
    const apiUrl = `https://ophim1.com/danh-sach/phim-moi-cap-nhat?page=${page}`;
    const response = await axios.get(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const apiData = response.data;
    const movies = [];
    
    if (apiData.status && apiData.items && Array.isArray(apiData.items)) {
      apiData.items.forEach((item, i) => {
        movies.push({
          id: item.slug || item._id || `movie-${i}`,
          name: item.name || item.origin_name || '',
          description: `${item.origin_name || ''} (${item.year || ''})`,
          image: {
            url: item.poster_url ? `https://img.ophim1.com/uploads/movies/${item.poster_url}` : 
                 item.thumb_url ? `https://img.ophim1.com/uploads/movies/${item.thumb_url}` : '',
            type: 'cover',
            width: 480,
            height: 640
          },
          type: 'playlist',
          display: 'text-below',
          label: item.year ? {
            text: `${item.year}`,
            position: 'top-left',
            color: '#35ba8b',
            text_color: '#ffffff'
          } : undefined,
          remote_data: {
            url: `https://ophim1.com/phim/${item.slug}`
          },
          enable_detail: true
        });
      });
    }
    
    return {
      success: true,
      data: {
        id: 'zzz-ophim18',
        name: 'Zzz - OPhim',
        url: 'https://ophim1.com',
        color: '#004444',
        image: {
          url: 'https://ophim1.com/logo.png',
          type: 'cover'
        },
        description: 'Phim mới cập nhật từ OPhim - Dữ liệu phim miễn phí vĩnh viễn',
        items: movies,
        total: movies.length,
        pagination: apiData.pagination || {
          totalItems: apiData.pagination?.totalItems || movies.length,
          totalItemsPerPage: apiData.pagination?.totalItemsPerPage || 24,
          currentPage: apiData.pagination?.currentPage || page,
          totalPages: apiData.pagination?.totalPages || 1
        }
      }
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

async function scrapeLannigan() {
  try {
    const response = await axios.get('https://www.lannigan.org/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const matches = [];
    
    $('.match-item').each((i, elem) => {
      const $elem = $(elem);
      const matchId = $elem.attr('data-match-id') || `match-${i}`;
      const isLive = $elem.attr('is-live') === 'true' || $elem.hasClass('running-border');
      
      const homeTeam = $elem.find('.name-home .name-team-inner').text().trim() || 
                       $elem.find('.match-home .name-team').text().trim();
      const awayTeam = $elem.find('.name-away .name-team-inner').text().trim() || 
                       $elem.find('.match-away .name-team').text().trim();
      const homeLogo = $elem.find('.logo-home img').attr('src') || 
                       $elem.find('.match-home img').attr('src') || '';
      const awayLogo = $elem.find('.logo-away img').attr('src') || 
                       $elem.find('.match-away img').attr('src') || '';
      
      const competition = $elem.find('.match-item__comp').text().trim();
      const matchTime = $elem.find('.match-item__time').text().trim();
      const status = $elem.find('.match-running').text().trim() || 
                     $elem.find('.match-score-scl').text().trim();
      
      const matchLink = $elem.find('a').first().attr('href') || '';
      
      if (homeTeam && awayTeam) {
        matches.push({
          id: matchId,
          name: `${homeTeam} vs ${awayTeam}`,
          description: `${competition} - ${matchTime}`,
          image: {
            url: homeLogo.startsWith('http') ? homeLogo : `https://www.lannigan.org${homeLogo}`,
            type: 'cover',
            width: 480,
            height: 640
          },
          type: 'video',
          display: 'text-below',
          label: isLive ? {
            text: 'LIVE',
            position: 'top-left',
            color: '#ff0000',
            text_color: '#ffffff'
          } : {
            text: status || matchTime,
            position: 'top-left',
            color: '#35ba8b',
            text_color: '#ffffff'
          },
          metadata: {
            home_team: homeTeam,
            away_team: awayTeam,
            home_logo: homeLogo.startsWith('http') ? homeLogo : `https://www.lannigan.org${homeLogo}`,
            away_logo: awayLogo.startsWith('http') ? awayLogo : `https://www.lannigan.org${awayLogo}`,
            competition: competition,
            time: matchTime,
            status: status,
            is_live: isLive
          },
          remote_data: {
            url: matchLink.startsWith('http') ? matchLink : `https://www.lannigan.org${matchLink}`
          },
          enable_detail: true
        });
      }
    });
    
    return {
      success: true,
      data: {
        id: 'zzz-lannigan',
        name: 'Zzz - LuongSonTV',
        url: 'https://www.lannigan.org',
        color: '#004444',
        image: {
          url: 'https://www.lannigan.org/wp-content/uploads/2023/12/Luongsontv-7.png',
          type: 'cover'
        },
        description: 'Xem bóng đá trực tiếp - LuongSonTV',
        items: matches,
        total: matches.length
      }
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

app.get('/tinnhac', async (req, res) => {
  try {
    const targetUrl = req.query.url || 'https://tinnhac.com';
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

app.get('/ophim', async (req, res) => {
  try {
    const targetUrl = req.query.url || 'https://ophim1.com/_next/data/yDOt_ZJUCLdKVnAJj_-Ks/danh-sach/phim-moi-cap-nhat.json';
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

app.get('/ophim18', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const result = await scrapeOphim18(page);
    
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

app.get('/lannigan', async (req, res) => {
  try {
    const result = await scrapeLannigan();
    
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
      '/nguonc': 'Fetch nguonc data (default: https://media.hth4nh.eu.org/nguonc)',
      '/tinnhac': 'Fetch tinnhac data (default: https://tinnhac.com)',
      '/ophim': 'Fetch ophim data (default: ophim1.com JSON)',
      '/ophim18': 'Scrape and convert ophim1.com to JSON format',
      '/lannigan': 'Scrape football matches from lannigan.org to JSON',
      '/fetch?url=<target>': 'Fetch any URL and return its content'
    },
    examples: [
      '/nguonc',
      '/nguonc?url=https://custom-url.com',
      '/tinnhac',
      '/ophim',
      '/ophim18',
      '/ophim18?page=2',
      '/lannigan',
      '/fetch?url=https://example.com'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`✓ Server is running on http://localhost:${PORT}`);
  console.log(`✓ API endpoint: http://localhost:${PORT}/nguonc`);
  console.log(`✓ Fetch endpoint: http://localhost:${PORT}/fetch?url=<target>`);
});

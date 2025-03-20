const axios = require('axios');

exports.handler = async function(event, context) {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
      headers: {
        'Allow': 'POST'
      }
    };
  }

  try {
    // Read API key from environment
    const apiKey = process.env.VITE_PERPLEXITY_API_KEY;
    
    if (!apiKey) {
      console.error('Missing Perplexity API key');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server configuration error' })
      };
    }

    // Parse the request body
    const body = JSON.parse(event.body);
    
    // Make request to Perplexity API
    const response = await axios({
      method: 'POST',
      url: 'https://api.perplexity.ai/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      data: body
    });

    // Return the successful response
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Error proxying to Perplexity API:', error);
    
    // Return an appropriate error response
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        error: 'Error from Perplexity API',
        details: error.response?.data || error.message
      })
    };
  }
}; 
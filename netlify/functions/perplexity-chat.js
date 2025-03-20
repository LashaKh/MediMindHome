const axios = require('axios');

exports.handler = async function(event, context) {
  console.log('Perplexity chat function triggered');
  console.log('Request headers:', JSON.stringify(event.headers));
  console.log('Request method:', event.httpMethod);
  
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    console.log('Method not allowed:', event.httpMethod);
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
    
    console.log('API Key available:', !!apiKey);
    
    if (!apiKey) {
      console.error('Missing Perplexity API key');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server configuration error' })
      };
    }

    // Parse the request body
    const body = JSON.parse(event.body);
    console.log('Request body (partial):', JSON.stringify(body).substring(0, 200));
    
    // Make request to Perplexity API
    console.log('Making request to Perplexity API');
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

    console.log('Perplexity API response status:', response.status);
    console.log('Perplexity API response (partial):', JSON.stringify(response.data).substring(0, 200));

    // Return the successful response
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (error) {
    console.error('Error proxying to Perplexity API:', error);
    console.error('Error details:', error.response?.data || error.message);
    
    // Return an appropriate error response
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        error: 'Error from Perplexity API',
        details: error.response?.data || error.message
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
}; 
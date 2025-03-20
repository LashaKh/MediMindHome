const axios = require('axios');

exports.handler = async function(event, context) {
  console.log('Exa search function triggered');
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
    const apiKey = process.env.VITE_EXA_API_KEY;
    
    console.log('API Key available:', !!apiKey);
    
    if (!apiKey) {
      console.error('Missing Exa API key');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server configuration error' })
      };
    }

    // Parse the request body
    const body = JSON.parse(event.body);
    console.log('Request body (partial):', JSON.stringify(body).substring(0, 200));
    
    // Make request to Exa API
    console.log('Making request to Exa API');
    const response = await axios({
      method: 'POST',
      url: 'https://api.exa.ai/search',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Api-Key': apiKey
      },
      data: body
    });

    console.log('Exa API response status:', response.status);
    console.log('Exa API response (partial):', JSON.stringify(response.data).substring(0, 200));

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
    console.error('Error proxying to Exa API:', error);
    console.error('Error details:', error.response?.data || error.message);
    
    // Return an appropriate error response
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        error: 'Error from Exa API',
        details: error.response?.data || error.message
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
}; 
// Test DeepSeek API
const fetch = require('node-fetch');

async function testDeepSeek() {
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer sk-607c5bc82a694becb71709df8d23ee5c',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: 'Hello, test message' }],
        max_tokens: 100
      })
    });

    console.log('Status:', response.status);
    const text = await response.text();
    console.log('Response:', text);
  } catch (error) {
    console.error('Error:', error);
  }
}

testDeepSeek();
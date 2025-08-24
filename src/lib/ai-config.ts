import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface AIModelConfig {
  provider: string;
  model: string;
  apiKey: string;
  enabled: boolean;
}

export async function getUserAIConfig(userId: string): Promise<AIModelConfig | null> {
  try {
    const settingsRef = doc(db, 'userSettings', userId);
    const settingsDoc = await getDoc(settingsRef);
    
    if (settingsDoc.exists()) {
      const data = settingsDoc.data();
      return data.aiModel || null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user AI config:', error);
    return null;
  }
}

const DEFAULT_AI_CONFIG: AIModelConfig = {
  provider: 'deepseek',
  model: 'deepseek-chat',
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  enabled: true
};

export async function callCustomAI(
  prompt: string, 
  userId: string, 
  fallbackFunction: () => Promise<any>
): Promise<any> {
  try {
    if (!userId) {
      // Use default DeepSeek config for unauthenticated users
      if (DEFAULT_AI_CONFIG.apiKey) {
        return await callDeepSeek(prompt, DEFAULT_AI_CONFIG);
      }
      return 'AI feature unavailable - please sign in to use custom models.';
    }
    
    const userConfig = await getUserAIConfig(userId);
    const aiConfig = userConfig || DEFAULT_AI_CONFIG;
    
    if (!aiConfig.enabled || !aiConfig.apiKey) {
      if (DEFAULT_AI_CONFIG.apiKey) {
        return await callDeepSeek(prompt, DEFAULT_AI_CONFIG);
      }
      return 'AI feature unavailable - please configure your AI model in settings.';
    }
    
    switch (aiConfig.provider) {
      case 'openai':
        return await callOpenAI(prompt, aiConfig);
      case 'anthropic':
        return await callAnthropic(prompt, aiConfig);
      case 'google':
        return await callGoogle(prompt, aiConfig);
      case 'deepseek':
        return await callDeepSeek(prompt, aiConfig);
      default:
        return 'Unsupported AI provider configured.';
    }
  } catch (error) {
    console.error('Custom AI call failed:', error);
    return 'AI service temporarily unavailable.';
  }
}

async function callOpenAI(prompt: string, config: AIModelConfig) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: config.model,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  
  const data = await response.json();
  return data.choices[0].message.content;
}

async function callAnthropic(prompt: string, config: AIModelConfig) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': config.apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  
  const data = await response.json();
  return data.content[0].text;
}

async function callGoogle(prompt: string, config: AIModelConfig) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });
  
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

async function callDeepSeek(prompt: string, config: AIModelConfig) {
  const requestBody = {
    model: config.model || 'deepseek-chat',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1000,
    temperature: 0.7
  };
  
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });
  
  const responseText = await response.text();
  
  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.status} - ${responseText}`);
  }
  
  const data = JSON.parse(responseText);
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    throw new Error('Invalid DeepSeek API response format');
  }
  
  return data.choices[0].message.content;
}
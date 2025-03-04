const { Anthropic } = require('@anthropic-ai/sdk');

// Claude API 키는 Netlify의 환경 변수에서 가져옵니다
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // 요청 데이터 로깅
    console.log('Request body:', event.body);
    
    const { text, intention, tone } = JSON.parse(event.body);
    
    // 파라미터 검증
    if (!text || !intention || !tone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required parameters' })
      };
    }

    console.log('Creating message with:', { text, intention, tone });
    
    // API 키 확인
    if (!process.env.CLAUDE_API_KEY) {
      throw new Error('CLAUDE_API_KEY is not set');
    }

    // Claude API 호출
    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `다음 텍스트에 대한 답장을 작성해주세요.
        원본 텍스트: ${text}
        의도: ${intention}
        말투: ${tone}`
      }]
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ reply: message.content[0].text })
    };
  } catch (error) {
    // 상세 에러 로깅
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Internal Server Error',
        details: error.message 
      })
    };
  }
};
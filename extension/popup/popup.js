document.addEventListener('DOMContentLoaded', () => {
  // 선택된 텍스트 표시
  chrome.storage.local.get(['selectedText'], (result) => {
    document.getElementById('selectedTextContent').textContent = result.selectedText || '';
  });

  // 톤 버튼 활성화 처리
  document.querySelectorAll('.tone-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tone-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // 답장 생성 버튼 클릭 처리
  document.getElementById('generateBtn').addEventListener('click', async () => {
    const selectedText = document.getElementById('selectedTextContent').textContent;
    const intention = document.getElementById('intention').value;
    const tone = document.getElementById('tone').value;

    if (!selectedText) {
      alert('텍스트를 선택해주세요.');
      return;
    }

    if (!intention || !tone) {
      alert('답장 내용과 말투를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',  // CORS 모드 명시
        body: JSON.stringify({
          text: selectedText,
          intention: intention,
          tone: tone
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', errorData);
        throw new Error(`API 요청 실패: ${response.status} ${errorData}`);
      }

      const data = await response.json();
      const textarea = document.getElementById('generatedReply');
      textarea.value = data.reply;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    } catch (error) {
      console.error('Detailed Error:', error);
      alert(`답장 생성 중 오류가 발생했습니다: ${error.message}`);
    }
  });

  // 복사 버튼 클릭 처리
  document.getElementById('copyBtn').addEventListener('click', () => {
    const replyText = document.getElementById('generatedReply').value;
    navigator.clipboard.writeText(replyText).then(() => {
      const copyBtn = document.getElementById('copyBtn');
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = '복사됨! ✓';
      setTimeout(() => {
        copyBtn.innerHTML = originalText;
      }, 2000);
    }).catch(err => {
      console.error('복사 실패:', err);
      alert('복사 중 오류가 발생했습니다.');
    });
  });

  // 텍스트 영역 자동 크기 조절
  document.getElementById('generatedReply').addEventListener('input', (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  });
});

// 커스텀 도메인으로 변경
const API_ENDPOINT = 'https://[your-site-name].netlify.app/.netlify/functions/generate'; 
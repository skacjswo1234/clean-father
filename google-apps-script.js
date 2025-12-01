function doPost(e) {
  try {
    // 스프레드시트 ID를 여기에 입력하세요
    var sheetId = '1Az2JPxqr6NjLm37K405KRfy3AIbT_JstwNOrGKK16GY';
    var sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
    
    // 폼 데이터 파싱
    var data = JSON.parse(e.postData.contents);
    
    // 현재 시간 추가
    var timestamp = new Date();
    
    // 연락처를 텍스트로 변환 (앞의 0이 사라지지 않도록)
    // 작은따옴표를 앞에 추가하여 구글 시트가 텍스트로 인식하도록 함
    var phoneText = data.phone || '';
    if (phoneText) {
      // 앞에 작은따옴표를 추가하여 텍스트로 저장 (원본 형식 유지)
      phoneText = "'" + phoneText;
    }
    
    // 시트에 데이터 추가
    sheet.appendRow([
      timestamp,
      data.name || '',
      phoneText,
      data.service || '',
      data.date || '',
      data.address || '',
      data.message || ''
    ]);
    
    // 이메일 알림 발송
    var emailRecipient = 'papaclean6398@gmail.com';
    var emailSubject = '[청소하는아빠] 새로운 문의가 접수되었습니다.';
    var emailBody = '새로운 문의가 접수되었습니다.\n\n' +
                    '이름: ' + (data.name || '-') + '\n' +
                    '연락처: ' + (data.phone || '-') + '\n' +
                    '서비스: ' + (data.service || '-') + '\n' +
                    '방문 희망일: ' + (data.date || '-') + '\n' +
                    '주소: ' + (data.address || '-') + '\n' +
                    '문의 내용:\n' + (data.message || '-');
                    
    MailApp.sendEmail({
      to: emailRecipient,
      subject: emailSubject,
      body: emailBody
    });
    
    // 성공 응답
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'success',
        'message': '문의가 성공적으로 접수되었습니다.'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // 에러 응답
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'error',
        'message': '오류가 발생했습니다: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 테스트용 함수 (선택사항)
function test() {
  var e = {
    postData: {
      contents: JSON.stringify({
        name: '테스트',
        phone: '010-1234-5678',
        service: '입주청소',
        date: '2024-01-01',
        address: '서울시 강남구',
        message: '테스트 메시지'
      })
    }
  };
  doPost(e);
}


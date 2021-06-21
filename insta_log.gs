function reporting(){
  var today = new Date();

  //instagram数値記録用のスプレットシートID
  var SSId = '〇〇〇〇';

  //instagram Graph API 必要情報
  var instragramID = '〇〇〇〇';
  var username = '〇〇〇〇';
  var ACCESS_TOKEN = "〇〇〇〇";
  getFollower(today,SSId,instragramID,username,ACCESS_TOKEN);
}

//instagramの数値を引っ張り記録する関数
function getFollower(date,SSId,instragramID,username,ACCESS_TOKEN) {

  var mySS = SpreadsheetApp.openById(SSId); //IDでスプレッドシートを開く
  var sheetName = username; //シートの名前をインスタユーザー名
  var sheet = mySS.getSheetByName(sheetName);

  //日付フォーマット
  var today = Utilities.formatDate(date, 'Asia/Tokyo', 'yyyy/MM/dd');
  //Graph API followers_count（フォロワー数）,follows_count（フォロー数）,media_count（投稿数）を取りに行く
  var facebook_url = 'https://graph.facebook.com/v4.0/'+ instragramID +'?fields=business_discovery.username('+ username +'){followers_count,follows_count,media_count}&access_token='+ ACCESS_TOKEN;

  var encodedURI = encodeURI(facebook_url);
  var response = UrlFetchApp.fetch(encodedURI); //URLから情報を取得
  var jsonData = JSON.parse(response);//JSONデータをパース
  var followers = jsonData['business_discovery']['followers_count'];
  var follows = jsonData['business_discovery']['follows_count'];
  var media_count = jsonData['business_discovery']['media_count'];

  //シートにデータを追加またはアップデート
  var newData =[today,followers,follows,media_count];
  insertOrUpdate(sheet, newData);
}

//行の存在に応じて追加もしくは更新を行う関数
function insertOrUpdate(sheet, data) {
  var row = findRow(sheet, data[0]);//日付比較の関数、行番号を受け取る
  if (row) { // 行が見つかったら更新
    sheet.getRange(row, 1, 1, data.length).setValues([data]);
  } else { // 行が見つからなかったら新しくデータを挿入
    sheet.appendRow(data);
  }
}

// 日付比較を行い、データがあれば行番号を返す関数
function findRow(sheet, date) {
  var searchDate = Utilities.formatDate(new Date(date), 'Asia/Tokyo','yyyy/MM/dd');
  var values = sheet.getDataRange().getValues();
  Logger.log(values + "findRow");
  for (var i = values.length - 1; i > 0; i--) {
    var dataDate = Utilities.formatDate(new Date(values[i][0]), 'Asia/Tokyo','yyyy/MM/dd');
    if (dataDate == searchDate) {
      return i + 1;
    }
  }
  return false;
}

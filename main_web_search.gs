function doGet() {
  var htmlOutput = HtmlService.createTemplateFromFile("index").evaluate();
  htmlOutput
    .setTitle('検索')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setFaviconUrl('https://drive.google.com/uc?id=1PJCbmO0jz6mY8WOLByDGPMWL_E27vRy0&.png');
  return htmlOutput;
}
function getJsonData(){
  //スクリプトプロパティからシートのIDを取得
  var Properties = PropertiesService.getScriptProperties(); 
  var orgtable_id = Properties.getProperty("orgtable_id"); 
  return backjson2(orgtable_id,'data');

}
function replaceElement(array, before, after,pos) {
//2時配列置換　引数:配列,置換前の文字列,置換後の文字列、二次配列目の位置 0スタート
//画像url用
  for(var i=0; i<array.length; i++){
    if(array[i][pos]){
      array[i][pos] = array[i][pos].replace(before, after);
    }
  }
  return array;
}
function backjson2(orgtable_id,sheetname) {
//スプレッドシートのデータをJSONで返す officeの杜
//http://daichan4649.hatenablog.jp/entry/2014/02/08/160453
//スプレッドシートデータを取得する
  var sheet = SpreadsheetApp.openById(orgtable_id).getSheetByName(sheetname);
  var ss = sheet.getDataRange().getValues();
  //タイトル行を取得する
  var title = ['t_date','t_title','e_date','url','theme','target','contents','soft','key','notice','req_no','rep_no','inp_data','z_no','big_data','image','memo','y_no','t_name','folder','rep_url'];
  //https://www.softel.co.jp/blogs/tech/archives/3924
  var ss = ss.filter(function(e){return e[0] !== "";});
  //---必要な項目だけ取得と順番替え--------2021.09.03 フォーム改訂による項目削除により変更--------------------- START
  ss.map( function(row, index,arr) {
    var getno = [0,2,3,4,5,6,7,9,10,11,15,16,17,19,20,21,22,23,24,25,26,27];
    var rowq = [];
    for(i=0;i<getno.length;i++){
      var ix = getno[i]
      rowq.push(row[ix]);      
    }
    arr[index] = rowq;
  });
  // ------------------------------------------------------ END
  //---画像url置換部分なのでシート関数でシート上で処理してもOK　---A START
  var pos = 15;//image urlの列
  var folderimg = 'https://drive.google.com/file/d/';//Google Dreive内url
  var urlimg  ='https://drive.google.com/uc?id=';//web上のimage url
  ss = replaceElement(ss,folderimg,urlimg,pos);
  var delstrs = ['/view?usp=sharing','/view?usp=drivesdk','/view',];//評価順番注意　先に部分位置していると変換されない
  var shareurl = '';
  ss = replaceElementarr(ss,delstrs,shareurl,pos);  
  // --------------------------------------------------------A END
  //---並び替え　日付降順 -----2021.04.28 追加------------------------------- START
  var header = ss[0];
  ss.shift();
  ss.sort(function(a, b) {
    if (b.e_date > a.e_date) {
      return 1;
    } else {
      return -1;
    }
  })
  ss.unshift(header);
  // ------------------------------------------------------ END
  return JSON.stringify(ss.map(function(row) {
  var json = {}
  row.map(function(item, index) {
  json[title[index]] = item;
  });
  return json;
  }));
}

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
  var title = ['t_date','t_title','e_date','url','theme','target','contents','tar_dev','soft','key','notice','mat_no','z_name','category','req_no','rep_no','inp_data','inp_name','z_no','big_data','image','memo','y_no','t_name'];

  //https://www.softel.co.jp/blogs/tech/archives/3924
  var ss = ss.filter(function(e){return e[0] !== "";});
  var exe = [1];//削除したい位置（先頭が0であることに注意）e_mail列を削除
  //e_mail列を削除
  for(var i=0; i<ss.length; i++){    //このfor文で行を回す
    for(var j=0; j<exe.length; j++){
      ss[i].splice(exe[j]-j, 1);
    }
  }
  var len = ss.length;
  //---画像url置換部分なのでシート関数でシート上で処理してもOK　---A START
  var pos = 20;//image urlの列
  var folderimg = 'https://drive.google.com/file/d/';//Google Dreive内url
  var urlimg  ='https://drive.google.com/uc?id=';//web上のimage url
  ss = replaceElement(ss,folderimg,urlimg,pos);
  var delstr = '/view';
  var retstr = '';
  ss = replaceElement(ss,delstr,retstr,pos);
  // ------------------------------------------------------A END
  //JSONデータを生成する
  return JSON.stringify(ss.map(function(row) {
  var json = {}
  row.map(function(item, index) {
  json[title[index]] = item;
  });
  return json;
  }));
}

const THIS_SPREADSHEET = SpreadsheetApp.getActiveSpreadsheet();
let dailyEventSheet;
function doPost(e) {
  let formData = JSON.parse(e.postData.contents);
  let lock = LockService.getScriptLock();
  lock.tryLock(30000);
  if (lock.hasLock()) {
    writeToSheet(formData);
  }
  lock.releaseLock();
  return ContentService.createTextOutput(JSON.stringify(formData)).setMimeType(
    ContentService.MimeType.JSON
  );
}

THIS_SPREADSHEET.hasSheet = function (name) {
  return this.getSheets()
    .map((e) => e.getName())
    .some((e) => e == name);
};

function writeToSheet(formData) {
  if (THIS_SPREADSHEET.hasSheet("Daily Event Data")) {
    daily_event_sheet = THIS_SPREADSHEET.getSheetByName("Daily Event Data");
    let insertRow = daily_event_sheet.getLastRow() + 1;
    /*
    // set all values from left to right regardless to header
    daily_event_sheet
      .getRange(insertRow, 1, 1, Object.values(formData).length)
      .setNumberFormat("@")
      .setValues([Object.values(formData)]);
    */
    // set value by header
    daily_event_sheet.isRow1Empty = function () {
      return this.getRange("1:1")
        .getValues()[0]
        .every((e) => e == "");
    };

    if (daily_event_sheet.isRow1Empty()) {
      daily_event_sheet
        .getRange(1, 1, 1, Object.keys(formData).length)
        .setValues([Object.keys(formData)]);
    }
    let tableHeader = daily_event_sheet.getRange("1:1").getValues()[0];
    tableHeader.map((e, i) => {
      if (formData.hasOwnProperty(e)) {
        daily_event_sheet
          .getRange(insertRow, i + 1)
          .setNumberFormat("@")
          .setValue(formData[e]);
      }
    });
  } else {
    THIS_SPREADSHEET.insertSheet("Daily Event Data");
    writeToSheet(formData);
  }
}

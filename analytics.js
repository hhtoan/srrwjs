//analytics.js

(async () => {
  /*let cookie = Object.fromEntries(
    document.cookie.split(";").map((e) => e.split("=").map((e) => e.trim()))
  );*/
  if (true) {
    document.cookie = `init=true; expires=${new Date()
      .addDays(1)
      .getDateOnly()
      .toUTCString()}`;
    let data = {};
    data.x_name = localStorage.x_name;
    data.x_tenant_name = localStorage.x_tenant_name;
    data.x_email = localStorage.x_email;
    data.x_tenant_code = localStorage.x_tenant_code;
    data.TransactionName = localStorage.TransactionName;
    data.x_tenant_id = localStorage.x_tenant_id;
    data.x_user_id = localStorage.x_user_id;
    data.x_time_license = await fetch(
      "https://amisapp.misa.vn/aimkt/APIS/SystemAPI/api/licenses/report",
      {
        method: "GET",
        mode: "cors",
        credentials: "include",
      }
    ).then((e) => e.json());
    data.apui_apps_opentime = localStorage.apui_apps_opentime;
    data.x_tax_code = localStorage.x_tax_code;
    data.x_role_type = localStorage.x_role_type;
    const GOOGLE_SCRIPT_API =
      "https://script.google.com/macros/s/AKfycbyItMplDrw5WhO3dAOYz3sfS7MPLYbfU4eDqwl4Yss2qKpsjRfvftRGwr2QO2Sebxav/exec";
    let option = {
      body: JSON.stringify(data),
      method: "POST",
      mode: "cors",
      redirect: "follow",
    };
    let googleSheetResponse = await fetch(GOOGLE_SCRIPT_API, option);
    console.log(await googleSheetResponse.json());
  }
})();

//gas

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
    let insertRow = daily_event_sheet.getLastRow() + 1;

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

//client
window.onload = () => {
  let formInputs = document.querySelectorAll("form input.lz-input");
  let formSubmit = document.querySelector("form input[type='submit'");
  function getFormValues(inputs) {
    let a = {};
    Array.from(inputs)
      .map((e) => [
        e.name,
        ((e.type == "text" ||
          e.type == "textarea" ||
          e.type == "date" ||
          e.type == "select-one") &&
          e.value) ||
          ((e.type == "checkbox" || e.type == "radio") && e.checked && e.value),
      ])
      .filter((e) => e[1])
      .forEach((e) => {
        (a[e[0]] = a[e[0]] || ""), (a[e[0]] += e[1] + ",");
      });
    for (let i in a) {
      a[i] = a[i].slice(0, a[i].length - 1);
    }
    return a;
  }
  formSubmit.addEventListener("click", () => {
    window.formData = getFormValues(formInputs);
  });
};

// form script
(async (formData) => {
  const GOOGLE_SCRIPT_API =
    "https://script.google.com/macros/s/AKfycbyJH5ekVmx9xqCtHhnthe5IobOhTcp6p_q8TC6NT0V-yGuWg5RU6e6Meg8GE-dy_4yi/exec";
  let option = {
    body: JSON.stringify(formData),
    method: "POST",
    mode: "cors",
    redirect: "follow",
  };
  let googleSheetResponse = await fetch(GOOGLE_SCRIPT_API, option);
  console.log(await googleSheetResponse.json());
})((window.formData = window.formData || {}), window.formData);

// gas
const THIS_SPREADSHEET = SpreadsheetApp.getActiveSpreadsheet();
let aiMarketingSheet;
function doPost(e) {
  let formData = JSON.parse(e.postData.contents);
  writeToSheet(formData);
  return ContentService.createTextOutput(JSON.stringify(formData)).setMimeType(
    ContentService.MimeType.JSON
  );
}

THIS_SPREADSHEET.hasSheet = function (name) {
  return this.getSheets()
    .map((e) => e.getName())
    .some((e) => e == name);
};

function writeToSheet(
  formData = {
    firstName: "Huy",
    email: "h2toan@gmail.com",
    lastName: "Hoang",
    phoneNumber: "0985090194",
    xung_ho: "Anh",
  }
) {
  if (THIS_SPREADSHEET.hasSheet("aiMarketing Form Data")) {
    aiMarketingSheet = THIS_SPREADSHEET.getSheetByName("aiMarketing Form Data");
    aiMarketingSheet.isRow1Empty = function () {
      return this.getRange("1:1")
        .getValues()[0]
        .every((e) => e == "");
    };

    if (aiMarketingSheet.isRow1Empty()) {
      aiMarketingSheet
        .getRange(1, 1, 1, Object.keys(formData).length)
        .setValues([Object.keys(formData)]);
    }

    let tableHeader = aiMarketingSheet.getRange("1:1").getValues()[0];
    let insertRow = aiMarketingSheet.getLastRow() + 1;

    tableHeader.map((e, i) => {
      if (formData.hasOwnProperty(e)) {
        aiMarketingSheet
          .getRange(insertRow, i + 1)
          .setNumberFormat("@")
          .setValue(formData[e]);
      }
    });
  } else {
    THIS_SPREADSHEET.insertSheet("aiMarketing Form Data");
    writeToSheet(formData);
  }
}

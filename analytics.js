(async () => {
  /* let cookie = Object.fromEntries(
    document.cookie.split(";").map((e) => e.split("=").map((e) => e.trim()))
  );
  if (!cookie.init) {
    document.cookie = `init=true; expires=${new Date()
      .addDays(1)
      .getDateOnly()
      .toUTCString()}`; */
    let data = {};
    data.FullName = localStorage.FullName;
    data.Applications = localStorage.Applications;
    data.Login_Account = localStorage.Login_Account;
    data.TenantCode = localStorage.TenantCode;
    data.TransactionName = localStorage.TransactionName;
    data.TenantID = localStorage.TenantID;
    data.TransactionName = localStorage.TransactionName;
    data.UserID = localStorage.UserID;
    data.UserName = localStorage.UserName;
    const GOOGLE_SCRIPT_API =
      "https://script.google.com/macros/s/AKfycbwgk855jLJSWKgL9KayR4sUogxEi-T_-Lfabd5CSePm6StyCdydfYK8FUuonEhSQsk/exec";
    let option = {
      body: JSON.stringify(data),
      method: "POST",
      mode: "cors",
      redirect: "follow",
    };
    let googleSheetResponse = await fetch(GOOGLE_SCRIPT_API, option);
    console.log(await googleSheetResponse.json());
  //}
})();

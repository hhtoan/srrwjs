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
    data.x_name = localStorage.x_name;
    data.x_tenant_name = localStorage.x_tenant_name;
    data.x_email = localStorage.x_email;
    data.x_tenant_code = localStorage.x_tenant_code;
    data.TransactionName = localStorage.TransactionName;
    data.x_tenant_id = localStorage.x_tenant_id;
    data.x_user_id = localStorage.x_user_id;
    data.x_time_license = localStorage.x_time_license;
    data.apui_apps_opentime = localStorage.apui_apps_opentime;
    data.x_tax_code = localStorage.x_tax_code;
    data.x_role_type = localStorage.x_role_type;
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

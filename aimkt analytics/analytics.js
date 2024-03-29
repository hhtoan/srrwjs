(async () => {
  let cookie = Object.fromEntries(
    document.cookie.split(";").map((e) => e.split("=").map((e) => e.trim()))
  );
  if (!cookie.init) {
    document.cookie = `init=true; expires=${new Date()
      .addDays(1)
      .getDateOnly()
      .toUTCString()}`;
    let data = {};
    data.timeStamp = new Date();
    data.x_name = localStorage.x_name;
    data.x_tenant_name = localStorage.x_tenant_name;
    data.x_email = localStorage.x_email;
    data.x_tenant_code = localStorage.x_tenant_code;
    data.TransactionName = localStorage.TransactionName;
    data.x_tenant_id = localStorage.x_tenant_id;
    data.x_user_id = localStorage.x_user_id;
    data.x_time_license =
      localStorage.x_time_license ||
      JSON.stringify(
        await fetch(
          "https://amisapp.misa.vn/aimkt/APIS/SystemAPI/api/licenses/report",
          {
            method: "GET",
            mode: "cors",
            credentials: "include",
          }
        ).then((e) => e.json())
      );
    data.apui_apps_opentime =
      localStorage.apui_apps_opentime ||
      JSON.stringify(
        await fetch("https://amisapp.misa.vn/APIS/MiscAPI/api/monitor/aimkt", {
          method: "POST",
          mode: "cors",
          credentials: "include",
        })
          .then((e) => e.json())
          .then((e) => e.Data.RecentApps)
      );
    data.x_tax_code = localStorage.x_tax_code || "";
    data.x_role_type = localStorage.x_role_type;
    const GOOGLE_SCRIPT_API =
      "https://script.google.com/macros/s/AKfycbxsHH99GcHuKcjMlozI7pxgCe_RxdH6m9HvW9Vr3ORNQuj4wT5iFdlXezvWfmpV1L75/exec";
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

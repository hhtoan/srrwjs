function waitLZFR() {
  if (lzfr) {
    lzfr.getSubmitForm = function (submission, formObj) {
      let formData = {};
      const PROPERTY_NAME = aimktFormConstant.PropertyName;
      const COOKIE_NAME = aimktFormConstant.CookieName;
      const ATTRIBUTE = aimktFormConstant.Attribute;
      for (var submissionProp of submission.SubmissionProperties) {
        formData[submissionProp.InputName] =
          submissionProp.ContactPropertyValue;
      }
      let valParamUtmSource = this.getUrlParameter(PROPERTY_NAME.UtmSource);
      if (valParamUtmSource)
        formData[PROPERTY_NAME.UtmSource] = valParamUtmSource;
      let valParamUtmTerm = this.getUrlParameter(PROPERTY_NAME.UtmTerm);
      if (valParamUtmTerm) formData[PROPERTY_NAME.UtmTerm] = valParamUtmTerm;
      let valParamUtmMedium = this.getUrlParameter(PROPERTY_NAME.UtmMedium);
      if (valParamUtmMedium)
        formData[PROPERTY_NAME.UtmMedium] = valParamUtmMedium;
      let valParamUtmContent = this.getUrlParameter(PROPERTY_NAME.UtmContent);
      if (valParamUtmContent)
        formData[PROPERTY_NAME.UtmContent] = valParamUtmContent;
      let valParamUtmCampaign = this.getUrlParameter(PROPERTY_NAME.UtmCampaign);
      if (valParamUtmCampaign)
        formData[PROPERTY_NAME.UtmCampaign] = valParamUtmCampaign;
      let valParamGclid = this.getUrlParameter(PROPERTY_NAME.Gclid);
      if (valParamGclid) formData[PROPERTY_NAME.Gclid] = valParamGclid;
      let valParamFbclid = this.getUrlParameter(PROPERTY_NAME.Fbclid);
      if (valParamFbclid) formData[PROPERTY_NAME.Fbclid] = valParamFbclid;
      let valParamEmailId = this.getUrlParameter(PROPERTY_NAME.EmailId);
      if (valParamEmailId) formData[PROPERTY_NAME.EmailId] = valParamEmailId;
      let valParamWorflowId = this.getUrlParameter(PROPERTY_NAME.WorkflowId);
      if (valParamWorflowId)
        formData[PROPERTY_NAME.WorkflowId] = valParamWorflowId;
      let valParamContactId = this.getUrlParameter(PROPERTY_NAME.ContactId);
      if (valParamContactId)
        formData[PROPERTY_NAME.ContactId] = valParamContactId;
      formData = {
        ...formData,
        ProfileID: this.getCookie(COOKIE_NAME.UcapProfileID),
        TenantID: formObj.companyID,
      };
      var contextSessionURL =
        this.STATISTIC + "/api/ucap/context.json?sessionId=";
      var eventCollectorUrl = this.STATISTIC + "/api/ucap/eventcollector";
      var userUnomi = "karaf";
      var passwordUnomi = "karaf";
      var landingPageKeyFillIdInForm = "form_lpageid_ucap_key";
      var tenantFillIdInForm = "form_tenant_ucap_key";
      var scopeForm = 2;
      var eventTypeFormView = 201;
      var eventTypeFormClick = 202;
      try {
        let pageInfo = getPageInfoAimkt();
        let isPropPageInfoLpageId = pageInfo.hasOwnProperty("lpageId");
        let landingPageId = isPropPageInfoLpageId
          ? pageInfo.lpageId
          : undefined;
        fetch(eventCollectorUrl, {
          method: "POST",
          headers: {
            Authorization: "Basic " + btoa(userUnomi + ":" + passwordUnomi),
            "Content-type": "text/plain; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            events: [
              {
                eventType: eventTypeFormClick,
                scope: scopeForm,
                source: {
                  itemType: "landingPageId",
                  properties: pageInfo,
                  itemId: landingPageId,
                },
                target: {
                  itemType: "formId",
                  itemId: formObj["formID"],
                  properties: {
                    TargetName: formObj["name"],
                    OwnerID: formObj["OwnerID"],
                    FormKey: formObj["FormKey"],
                  },
                },
                properties: formData,
              },
            ],
            sessionId: this.getCookie(COOKIE_NAME.UcapSessionID),
          }),
        }).then(
          dataLayer.push({
            event: "form-submission",
            mddk: "tu-van",
            sdt: formData?.phoneNumber,
            email: formData?.email,
          })
        );
      } catch (error) {
        console.error("aimarketing_error GET FORM - ", error);
      }
      function getPageInfoAimkt() {
        let elLdpageUcap = document.querySelector(".lpage-ucap[lz-id]");
        let landingPageID =
          elLdpageUcap === null
            ? ""
            : elLdpageUcap.getAttribute(ATTRIBUTE.LzID);
        if (!landingPageID) landingPageID = "";
        return {
          destinationURL: window.parent.location.href,
          pagePath: window.parent.location.pathname,
          pageOrigin: window.parent.location.origin,
          pageName: window.parent.document.title,
          referringURL: document.referrer || window.parent.document.referrer,
          lpageId: landingPageID,
        };
      }
    };
    console.log("lzfr modified");
  } else {
    setTimeout(1000, waitLZFR);
  }
}
waitLZFR();

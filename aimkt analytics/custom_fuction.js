/**
 * Parse value from JSON license string
 *
 * @param {JSON string} the JSON license string
 * @return values in array
 * @customfunction
 */
function PARSE_LICENSE(jsonLicense) {
  try {
    let values = JSON.parse(jsonLicense);
    return [
      [
        values.PackageName,
        new Date(values.StartDate),
        values.TotalContactUsed,
        values.TotalEmailUsed,
        values.TotalFormUsed,
        values.TotalLandingPageUsed,
        values.TotalWorkflowUsed,
      ],
    ];
  } catch (error) {
    return;
  }
}

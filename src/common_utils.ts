async function cityDateTime(timezone) {
  let dateObj: any;
  let localTime: any;
  let localOffset: any;
  let cityDateTime: any;
  let utc: any;
  let calculatedDateTime: any;

  dateObj = new Date();
  localTime = dateObj.getTime();
  localOffset = dateObj.getTimezoneOffset() * 60000;
  utc = localTime + localOffset;
  cityDateTime = utc + 1000 * timezone;
  calculatedDateTime = new Date(cityDateTime);

  return calculatedDateTime;
}

export default {
  cityDateTime,
};

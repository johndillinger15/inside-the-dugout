const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

module.exports = (date) => {
  return dayjs(date).tz("Europe/Berlin").format("D MMMM YYYY");
};

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Berlin",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

module.exports = function (date) {
  if (!date) return "";
  if (!(date instanceof Date)) date = new Date(date);

  const parts = formatter.formatToParts(date);
  const get = (type) => (parts.find((p) => p.type === type) || {}).value || "";

  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}`;
};

exports.showLogs = function (helper, data) {
  const formattedLog = JSON.stringify(data, null, 2);
  console.log(`${helper} =>`, formattedLog);
};

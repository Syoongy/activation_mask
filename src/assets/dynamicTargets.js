function dynamicTargets(targetBoxes, numFinished, numTables) {
  const d = new Date();

  let currentDate = d.getDate();
  let currentHour = d.getHours();
  let currentMinute = d.getMinutes();

  // Start counting from start of operation
  if (currentDate < 24) {
    currentDate = 24;
    currentHour = 8;
    currentMinute = 0;
  }

  const DAILY_WORK_HOURS = 13;
  const COMPLETE_DATE = 26;
  const COMPLETE_HOUR = 22;

  const daysRemaining = COMPLETE_DATE - currentDate;
  let fullHoursRemainingToday, partialHoursRemainingToday;
  if (currentHour >= 22) {
    fullHoursRemainingToday = 0;
    partialHoursRemainingToday = 0.0;
  } else if (currentHour >= 16) {
    fullHoursRemainingToday = COMPLETE_HOUR - currentHour - 1;
    partialHoursRemainingToday = (60 - currentMinute) / 60;
  } else if (currentHour >= 8) {
    // Take into account the 1 hour break from 3pm to 4pm
    fullHoursRemainingToday = COMPLETE_HOUR - currentHour - 2;
    partialHoursRemainingToday = (60 - currentMinute) / 60;
  } else {
    fullHoursRemainingToday = 13;
    partialHoursRemainingToday = 0.0;
  }

  const totalHoursRemaining =
    daysRemaining * DAILY_WORK_HOURS +
    fullHoursRemainingToday +
    partialHoursRemainingToday;

  const boxesToTarget = targetBoxes - numFinished;

  const targetPerHour = boxesToTarget / totalHoursRemaining;

  const targetPerShift = (boxesToTarget / totalHoursRemaining) * 7;

  const targetPerTablePerHour = targetPerHour / numTables;

  const targetPerTablePerShift = targetPerShift / numTables;

  return {
    targetPerHour: targetPerHour,
    targetPerShift: targetPerShift,
    targetPerTablePerHour: targetPerTablePerHour,
    targetPerTablePerShift: targetPerTablePerShift
  };
}

console.log(dynamicTargets(2500, 0, 42));

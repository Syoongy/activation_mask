export default function() {
  const d = new Date();
  // console.log(d);
  let session = "";
  let currentDate = d.getDate();
  let currentHour = d.getHours();
  switch (currentDate) {
    case 24:
      if (currentHour >= 16) {
        session = "2";
      } else {
        session = "1";
      }
      break;
    case 25:
      if (currentHour >= 16) {
        session = "4";
      } else {
        session = "3";
      }
      break;
    case 26:
      if (currentHour >= 16) {
        session = "6";
      } else {
        session = "5";
      }
      break;
    default:
      session = "1";
      break;
  }
  return session;
}

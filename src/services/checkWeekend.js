export const checkWeekend = date => {
  return new Promise(async (resolve, reject) => {
    try {
      let dt = new Date(date);
      let weekend = false;
      if (dt.getDay() == 5 || dt.getDay() == 6) {
        weekend = true;
      }
      resolve(weekend);
    } catch {
      reject(new Error("can't get alt emp status!"));
    }
  });
};

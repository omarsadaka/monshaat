import moment from 'moment';
import { baseUrl } from '../services';
import { EncryptUrl } from '../services/EncryptUrl';

export const CheckAltEmp = (data, accessToken, date1, date2) => {
  if (!data.substitute_employee_id) {
    return null;
  } else {
    let dateFrom = moment(date1).format('YYYY-MM-DD');
    let DateTo = moment(date2).format('YYYY-MM-DD');
    let url =
      baseUrl +
      `/api/call/hr.employee/check_availability?ids=${data.substitute_employee_id}&kwargs={"date_from":"${dateFrom}","date_to":"${DateTo}"}`;

    return new Promise(async (resolve, reject) => {
      try {
        let secretUrl = await EncryptUrl(url, true);

        const result = await fetch(secretUrl, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }).then(response => response.json());
        //console.log(result, "result");

        resolve(result);
      } catch {
        reject(new Error("can't get alt emp status!"));
      }
    });
  }
};

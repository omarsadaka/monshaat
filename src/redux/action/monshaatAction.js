import { baseUrl } from '../../services';
import { EncryptUrl } from '../../services/EncryptUrl';

export function getMonshaatNewsList(accessToken, mLimit, mOffset) {
  return async (dispatch) => {
    let secretUrl = await EncryptUrl(
      baseUrl +
        '/api/search_read?model=portal.news' +
        '&domain=[["type", "=","news"], ["published","=",true]]&order=create_date desc' +
        '&fields=["title","description","image","write_date","create_date","resume","like_ids","comment_ids"]' +
        '&limit=' +
        mLimit +
        '&offset=' +
        mOffset,
    );

    fetch(secretUrl, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        dispatch({ type: 'MONSHAAT_NEWS', value: responseData });
      })
      .catch((err) => {
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function getMonshaatFamilyData(accessToken, mLimit, mOffset) {
  //
  return async (dispatch) => {
    let secretUrl = await EncryptUrl(
      baseUrl +
        '/api/search_read?model=portal.news' +
        '&domain=[["type", "=","family_news"], ["published","=",true]]&order=create_date desc' +
        '&fields=["title","description","image","write_date","create_date","resume","like_ids","comment_ids"]' +
        '&limit=' +
        mLimit +
        '&offset=' +
        mOffset,
    );
    fetch(secretUrl, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        dispatch({ type: 'MONSHAAT_FAMILY', value: responseData });
      })
      .catch((err) => {
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

export function getMonshaatActivityData(accessToken, mLimit, mOffset) {
  return async (dispatch) => {
    let secretUrl = await EncryptUrl(
      baseUrl +
        // "/api/search_read?model=portal.awareness.image" +
        // '&domain=[["published","=",true]]&order=create_date desc&' +
        // '&fields=["image","write_date","like_ids","comment_ids"]' +
        // "&limit="
        '/api/search_read?model=portal.news' +
        '&domain=[["type", "=","ads"], ["published","=",true]]&order=create_date desc' +
        '&fields=["title","description","image","write_date","create_date","resume","like_ids","comment_ids"]' +
        '&limit=' +
        mLimit +
        '&offset=' +
        mOffset,
    );

    fetch(secretUrl, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        dispatch({ type: 'MONSHAAT_ACTIVITY', value: responseData });
      })
      .catch((err) => {
        dispatch({ type: 'COMMON_LOADER', value: false });
      });
  };
}

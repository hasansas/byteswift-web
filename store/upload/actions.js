import HttpRequest from '~/helpers/http_request.js';

export default {
  post({ }, { file }) {
    const authUser = this.getters['users/auth'];
    const httpRequest = new HttpRequest(this.$axios);

    return new Promise(function (resolve) {
      const _url = '/v1/upload';
      const _body = file;
      const _headers = [
        { name: 'Authorization', value: 'Bearer ' + authUser.token }
      ];

      httpRequest.post(_url, _body, _headers).then(async (res) => {
        resolve(res);
      });
    });
  },
};


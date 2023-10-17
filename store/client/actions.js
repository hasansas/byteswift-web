import HttpRequest from '~/helpers/http_request.js';
import { httpResponse } from '~/helpers/http_response.js';

export default {
  get({ }) {
    const authUser = this.getters['users/auth'];
    const httpRequest = new HttpRequest(this.$axios);

    return new Promise(function (resolve) {
      const _url = '/v1/clients/me';
      const _headers = [
        { name: 'Authorization', value: 'Bearer ' + authUser.token }
      ];

      httpRequest.get(_url, _headers).then(function (res) {
        resolve(res);
      });
    });
  },
  getMe({ }) {
    const authUser = this.getters['users/auth'];
    const httpRequest = new HttpRequest(this.$axios);

    return new Promise(function (resolve) {
      const _url = '/v1/clients/me';
      const _headers = [
        { name: 'Authorization', value: 'Bearer ' + authUser.token }
      ];

      httpRequest.get(_url, _headers).then(function (res) {
        resolve(res);
      });
    });
  },
  getConfiguration({ }) {
    const authUser = this.getters['users/auth'];
    const httpRequest = new HttpRequest(this.$axios);

    return new Promise(function (resolve) {
      const _url = '/v1/clients/config';
      const _headers = [
        { name: 'Authorization', value: 'Bearer ' + authUser.token }
      ];

      httpRequest.get(_url, _headers).then(function (res) {
        if (!res.success) {
          return resolve(res);
        }

        const _data = res.data.data.rows;
        const _pagination = res.data.data.pagination;

        const response = httpResponse({
          success: true,
          statusCode: 200,
          data: _data,
          pagination: _pagination,
        });

        // set response
        resolve(response);
      });
    });
  },
  updateConfiguration({ }, { body }) {
    const authUser = this.getters['users/auth'];
    const httpRequest = new HttpRequest(this.$axios);

    return new Promise(function (resolve) {
      const _url = '/v1/clients/config';
      const _headers = [
        { name: 'Authorization', value: 'Bearer ' + authUser.token }
      ];
      const _body = body;

      httpRequest.put(_url, _body, _headers).then(function (res) {
        if (!res.success) {
          return resolve(res);
        }

        const response = httpResponse({
          success: true,
          statusCode: 200,
        });

        // set response
        resolve(response);
      });
    });
  },
  getNotifications({ }, { params }) {
    const authUser = this.getters['users/auth'];
    const httpRequest = new HttpRequest(this.$axios);

    return new Promise(function (resolve) {
      const _params = params ? '?' + params : '';
      const _url = '/v1/clients/notifications' + _params;
      const _headers = [
        { name: 'Authorization', value: 'Bearer ' + authUser.token }
      ];

      httpRequest.get(_url, _headers).then(function (res) {
        if (!res.success) {
          return resolve(res);
        }

        const _data = res.data.data.rows;
        const _pagination = res.data.data.pagination;

        const response = httpResponse({
          success: true,
          statusCode: 200,
          data: _data,
          pagination: _pagination,
        });

        // set response
        resolve(response);
      });
    });
  },
};


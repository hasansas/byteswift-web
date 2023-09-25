import HttpRequest from '~/helpers/http_request.js';
import { httpResponse } from '~/helpers/http_response.js';

export default {
  async createBroadcastRecipient({ commit }, { name, contacts }) {
    const httpRequest = new HttpRequest(this.$axios);

    return new Promise(function (resolve) {
      const _url = "/v1/qontak/broadcast/recipient";
      const _body = {
        name: name,
        contacts: contacts
      }

      // send request
      httpRequest.post(_url, _body).then(async (res) => {
        if (!res.success) {
          return resolve(res);
        }

        // get response data
        const resData = res.data.data

        // set response
        resolve(
          httpResponse({
            success: true,
            statusCode: 200,
            data: resData
          })
        );
      });
    });
  },
  async createBroadcast({ commit }, { name, messageTemplateId, contactListId, parameters }) {
    const httpRequest = new HttpRequest(this.$axios);

    return new Promise(function (resolve) {
      const _url = "/v1/qontak/broadcast";
      const _body = {
        "name": name,
        "message_template_id": messageTemplateId,
        "contact_list_id": contactListId,
        "parameters": parameters
      }

      // send request
      httpRequest.post(_url, _body).then(async (res) => {
        if (!res.success) {
          return resolve(res);
        }

        // get response data
        const resData = res.data.data

        // set response
        resolve(
          httpResponse({
            success: true,
            statusCode: 200,
            data: resData
          })
        );
      });
    });
  },
};


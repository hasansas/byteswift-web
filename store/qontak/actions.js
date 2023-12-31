import HttpRequest from '~/helpers/http_request.js';
import { httpResponse } from '~/helpers/http_response.js';
import { WhatsappTemplateModel } from "./model.js";

export default {
  async createBroadcastRecipient({ commit }, { name, contacts }) {
    const authUser = this.getters['users/auth'];
    const httpRequest = new HttpRequest(this.$axios);

    return new Promise(function (resolve) {
      const _url = "/v1/qontak/broadcast/recipient";
      const _body = {
        name: name,
        contacts: contacts
      }
      const _headers = [
        { name: 'Authorization', value: 'Bearer ' + authUser.token }
      ];

      // send request
      httpRequest.post(_url, _body, _headers).then(async (res) => {
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
    const authUser = this.getters['users/auth'];
    const httpRequest = new HttpRequest(this.$axios);

    return new Promise(function (resolve) {
      const _url = "/v1/qontak/broadcast";
      const _body = {
        "name": name,
        "message_template_id": messageTemplateId,
        "contact_list_id": contactListId,
        "parameters": parameters
      }
      const _headers = [
        { name: 'Authorization', value: 'Bearer ' + authUser.token }
      ];

      // send request
      httpRequest.post(_url, _body, _headers).then(async (res) => {
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
  getWhatsappTemplate({ }) {
    const authUser = this.getters['users/auth'];
    const httpRequest = new HttpRequest(this.$axios);

    return new Promise(function (resolve) {
      const _url = '/v1/qontak/templates';
      const _headers = [
        { name: 'Authorization', value: 'Bearer ' + authUser.token }
      ];

      httpRequest.get(_url, _headers).then(async function (res) {
        if (!res.success) {
          return resolve(res);
        }

        // get response data
        const resData = res.data.data
        const whatsappTemplateModel = WhatsappTemplateModel()
        const templates = await whatsappTemplateModel.fromArray(resData);

        // set response
        resolve(
          httpResponse({
            success: true,
            statusCode: 200,
            data: templates
          })
        );
      });
    });
  },
};


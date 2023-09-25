import HttpRequest from '~/helpers/http_request.js';
import { httpResponse } from '~/helpers/http_response.js';
import { XeroAuthModel } from "./model.js";
import Convert from '~/helpers/convert.js'

const Cookie = process.client ? require('js-cookie') : 'undefined'

export default {
  async getToken({ commit }, { code }) {
    const httpRequest = new HttpRequest(this.$axios);

    return new Promise(function (resolve) {
      const _url = "/v1/xero/token";
      const _body = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'http://localhost:3000/xero/callback',
      }

      // send request
      httpRequest.post(_url, _body).then(async (res) => {
        if (!res.success) {
          return resolve(res);
        }

        // get response data
        const resData = res.data.data

        // save data to state 
        const xeroAuthModel = XeroAuthModel()
        const xeroAuth = await xeroAuthModel.fromJson(resData);
        commit("auth", { auth: xeroAuth });

        // save xero auth to cookie
        const authSessionName = 'ax'
        const hexAuth = Convert.stringToHex(JSON.stringify(xeroAuth))
        Cookie.set(authSessionName, JSON.stringify(hexAuth))

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
  refreshToken({ state, commit }) {
    const httpRequest = new HttpRequest(this.$axios);
    const xeroAuth = state.auth

    return new Promise(function (resolve) {
      const _url = "/v1/xero/token";
      const _body = {
        grant_type: 'refresh_token',
        refresh_token: xeroAuth.refresh_token
      }

      // send request
      httpRequest.post(_url, _body).then(async (res) => {
        if (!res.success) {
          return resolve(res);
        }

        // get response data
        const resData = res.data.data

        // save data to state 
        const xeroAuthModel = XeroAuthModel()
        const xeroAuth = await xeroAuthModel.fromJson(resData);
        commit("auth", { auth: xeroAuth });

        // save xero auth to cookie
        const authSessionName = 'ax'
        const hexAuth = Convert.stringToHex(JSON.stringify(xeroAuth))
        Cookie.set(authSessionName, JSON.stringify(hexAuth))

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
  async getTenant({ state, dispatch }) {
    // refresh token
    await dispatch('refreshToken')

    // get tenant
    const httpRequest = new HttpRequest(this.$axios);
    const xeroAuth = state.auth

    return new Promise(function (resolve) {
      const _url = '/v1/xero/connections'
      const _headers = [
        { name: 'xero-token', value: xeroAuth.access_token }
      ];

      httpRequest.get(_url, _headers).then(async (res) => {
        if (!res.success) {
          return resolve(res)
        }

        const resData = res.data.data

        // set response
        resolve(
          httpResponse({
            success: true,
            statusCode: 200,
            data: resData
          })
        )
      });
    });
  },
  async getInvoices({ state, dispatch }, { tenantId, dueDate }) {
    // refresh token
    await dispatch('refreshToken')

    // get invoices
    const httpRequest = new HttpRequest(this.$axios);
    const xeroAuth = state.auth

    return new Promise(function (resolve) {
      const _url = `v1/xero/invoices?duedate=${dueDate}`
      const _headers = [
        { name: 'xero-token', value: xeroAuth.access_token },
        { name: 'xero-tenant-id', value: tenantId }
      ];

      httpRequest.get(_url, _headers).then(async (res) => {
        if (!res.success) {
          return resolve(res)
        }

        const resData = res.data.data
        return resData
      }).then(async data => {
        const xeroInvoices = data.Invoices

        // set response
        resolve(
          httpResponse({
            success: true,
            statusCode: 200,
            data: xeroInvoices
          })
        )
      })
    });
  },
  async getContact({ state }, { contcatId, tenantId }) {

    // get contact
    const httpRequest = new HttpRequest(this.$axios);
    const xeroAuth = state.auth

    return new Promise(function (resolve) {
      const _url = 'v1/xero/contacts/' + contcatId
      const _headers = [
        { name: 'xero-token', value: xeroAuth.access_token },
        { name: 'xero-tenant-id', value: tenantId }
      ];

      httpRequest.get(_url, _headers).then(async (res) => {
        if (!res.success) {
          return resolve(res)
        }

        const resData = res.data.data

        const _getContactData = resData
        const _contactItem = _getContactData.Contacts.length > 0 ? _getContactData.Contacts[0] : null
        if (_contactItem !== null) {
          let phone = null

          const mobilePhone = _contactItem.Phones.find(e => e.PhoneType === 'MOBILE')
          if (typeof mobilePhone !== 'undefined') {
            if (mobilePhone.PhoneCountryCode && mobilePhone.PhoneAreaCode && mobilePhone.PhoneNumber) {
              phone = mobilePhone.PhoneCountryCode + mobilePhone.PhoneAreaCode + mobilePhone.PhoneNumber
            }

            _contactItem.Phone = phone
          }
        }

        resolve(
          httpResponse({
            success: true,
            statusCode: 200,
            data: _contactItem
          })
        )
      })
    });
  }
};


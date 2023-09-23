import Convert from '~/helpers/convert.js'
const cookieparser = process.server ? require('cookieparser') : undefined

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    const initUser = { authenticated: false }

    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        // Xero auth
        const xeroAuthSessionName = 'ax'
        if (typeof parsed[xeroAuthSessionName] !== 'undefined') {
          const _xeroUserSession = parsed[xeroAuthSessionName].toString().replace(/"/g, '')
          const _xeroAuthSession = JSON.parse(Convert.hexToString(_xeroUserSession))
          commit("xero/auth", { auth: _xeroAuthSession })
        }
      } catch (err) {
        // No valid cookie found
        console.log(err)
      }
    }
  }
}

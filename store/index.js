import Convert from '~/helpers/convert.js'
const cookieparser = process.server ? require('cookieparser') : undefined

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    const initUser = { authenticated: false }

    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        // set auth user
        const _authSessionClientName = process.env.PREFIX_SESSION_NAME
        if (typeof parsed[_authSessionClientName] !== 'undefined') {
          const _userSession = parsed[_authSessionClientName].toString().replace(/"/g, '')
          const _authSession = JSON.parse(Convert.hexToString(_userSession))

          commit('users/setAuthUser', _authSession)
        }

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

  // nuxtServerInit({ commit }, { req }) {
  //   const initUser = { authenticated: false }

  //   if (req.headers.cookie) {
  //     const parsed = cookieparser.parse(req.headers.cookie)
  //     try {
  //       // Xero auth
  //       const xeroAuthSessionName = 'ax'
  //       if (typeof parsed[xeroAuthSessionName] !== 'undefined') {
  //         const _xeroUserSession = parsed[xeroAuthSessionName].toString().replace(/"/g, '')
  //         const _xeroAuthSession = JSON.parse(Convert.hexToString(_xeroUserSession))
  //         commit("xero/auth", { auth: _xeroAuthSession })
  //       }
  //     } catch (err) {
  //       // No valid cookie found
  //       console.log(err)
  //     }
  //   }
  // }
}

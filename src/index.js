import Helmet from 'react-helmet'
import React, { Fragment } from 'react'
import { injectGlobal } from 'styled-components'

import App from './App'
import globalStyles from './util/global-styles'

injectGlobal`${globalStyles}`

export default _ =>
  <Fragment>
    <Helmet>
      <html lang='en' />

      <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />

      <title>Joe Haines</title>
    </Helmet>

    <App />
  </Fragment>

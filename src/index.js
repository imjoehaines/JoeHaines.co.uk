import React from 'react'
import { StaticRouter, BrowserRouter } from 'react-router-dom'

import App from './App'
import getPosts from './util/get-posts'

const Router = typeof document !== 'undefined'
  ? BrowserRouter
  : StaticRouter

const posts = getPosts(__dirname)

export default ({ basename, pathname }) =>
  <Router
    basename={basename}
    location={pathname}
    context={{}}
  >
    <html>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='stylesheet' href='/style.min.css' />

        <title>Joe Haines</title>
      </head>

      <body>
        <App posts={posts} />
      </body>
    </html>
  </Router>

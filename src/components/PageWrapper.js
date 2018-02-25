import React from 'react'

import Link from './Link'

export default ({ children, title = '' }) =>
  <html>
    <head>
      <meta charSet='utf-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <link rel='stylesheet' href='/style.min.css' />

      <title>{title && title + ' - '}Joe Haines</title>
    </head>

    <body>
      {children}

      <footer>
        <small>
          &copy; {new Date().getFullYear()} <Link href='/'>Joe Haines</Link>
        </small>
      </footer>
    </body>
  </html>

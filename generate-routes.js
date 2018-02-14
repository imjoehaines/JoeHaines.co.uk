const fs = require('fs')
const path = require('path')
const slug = require('slug')
const rimraf = require('rimraf')
const frontMatter = require('front-matter')
const updateJsonFile = require('update-json-file')

const existingSlugs = require('./package.json').x0.routes
existingSlugs.forEach(
  slug => slug !== '/' && rimraf(path.join(__dirname, 'public', slug.replace('/', '')),
  err => { if (err) throw err })
)

const slugs = fs.readdirSync(path.join(__dirname, 'src', 'posts')).reverse().map(filename => {
  const contents = fs.readFileSync(path.join(__dirname, 'src', 'posts', filename)).toString()
  const { attributes: { title } } = frontMatter(contents)

  return '/' + slug(title, { lower: true })
})

updateJsonFile(path.join(__dirname, 'package.json'), data => {
  data.x0.routes = slugs

  return data
})

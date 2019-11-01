require 'mime/types'
require 'slim'
require 'pp'
ROOT_LOCALE = :en
SUPPORTED_LOCALES = [:de,:en,:fr,:es]


###
# Page options, layouts, aliases and proxies
###

# Per-page layout changes:
#
# With no layout
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

# General configuration

# Reload the browser automatically whenever files change
configure :development do
  config[:api_host] = "//localhost:3000"
  activate :livereload
end

# Build-specific configuration
configure :build do
  config[:api_host] = "https://actions.sumofus.org"
  activate :gzip
end


###
# Helpers for confg
###

# middleman expects paths relative to the source/ directory and
# with no extensions except .html
def format_template_path(path)
  path.gsub('source/', '').gsub(/\.html\..*/, '.html')
end

# strips all directories and file extensions from a file path
def slug_from_file_path(path)
  File.basename(path).split('.').first
end

def translate_link(url, locale)
  untethered = url.gsub(/\/(en|fr|de|es)\//, '/').gsub(/\A\/(en|fr|de|es)\z/, '/')
  locale == ROOT_LOCALE ? untethered : "/#{locale}#{untethered}"
end

def load_prismic
  puts "-"*60
  puts "|  Fetching content from Prismic..."

  api = Prismic.api('https://sou-homepage.cdn.prismic.io/api', { cache: false })

  index = 1
  continue = true
  documents = []

  while continue
    result = api.all({"lang" => '*', 'pageSize' => 100, 'page' => index })
    documents += result.results
    if result.next_page
      index += 1
    else
      continue = false
    end
  end

  prismic_content = SUPPORTED_LOCALES.map do |locale|
    [locale, documents.select { |d| d.lang.slice(0,2) == locale.to_s}]
  end.to_h

  puts "|  Content loaded:"

  SUPPORTED_LOCALES.each do |locale|
    puts "|    #{locale}: #{prismic_content[locale].size}"
  end

  puts "-"*60

  prismic_content
end

###
# Helpers for views
###

# Methods defined in the helpers block are available in templates
helpers do

  def fetch_count
    res = Net::HTTP.get('s3-us-west-2.amazonaws.com', '/sou-homepage-counter/count.json')
    count = JSON.parse(res)['count']
    number_with_delimiter(count)
  end
  # strips all directories and file extensions from a file path
  def slug_from_file_path(path)
    File.basename(path).split('.').first
  end

  def translate_link(url, locale)
    untethered = url.gsub(/\/(en|fr|de|es)\//, '/').gsub(/\A\/(en|fr|de|es)\z/, '/')
    locale == ROOT_LOCALE ? untethered : "/#{locale}#{untethered}"
  end

  def frontmatters_from_dir(path)
    Dir[File.join(path, '*')].map do |file|
      frontmatter = read_frontmatter(file)
      frontmatter.merge('slug' => slug_from_file_path(file))
    end
  end

  def read_frontmatter(path)
    yaml_regex = /\A(---\s*\n.*?\n?)^(---\s*$\n?)/m
    content = File.read(path)
    YAML.load(content[yaml_regex])
  end

  def sort_by_date(hashes)
    hashes.sort_by do |h|
      Date.parse(h['date'] || '1/1/1800')
    end.reverse
  end

  def read_title(prismic_doc)
    prismic_doc["#{prismic_doc.type}.title"]&.as_text
  end
end

activate :i18n, mount_at_root: ROOT_LOCALE, langs: SUPPORTED_LOCALES
activate :asset_hash, ignore: ['.*fontawesome.*']
activate :directory_indexes

PAGE_PATHS = [['privacy', 'basic'],
              ['contact', 'about'],
              ['about', 'about'],
              ['unsubscribed', 'basic'],
              ['unsubscribe', 'basic'],
              ['details', 'basic'],
              ['about/staff', 'about'],
              ['about/board', 'about'],
              ['about/faq', 'about'],
              ['about/funding', 'about'],
              # ['legacy', 'legacy'],
              ['about/jobs', 'about'],
              ['about/jobs/detail', 'about'],

              ['media', 'media'],
              ['campaigns', 'campaigns']]


prismic_content = load_prismic

SUPPORTED_LOCALES.each do |locale|
  # basic page routes
  PAGE_PATHS.each do |page_path, layout|
    content = prismic_content[locale]
      .select { |p| p["#{p.type}.path"]&.value == page_path }.first

    if content.present?
      puts "CONTENT FOUND #{locale}, #{page_path}"
      proxy translate_link("/#{page_path}/index.html", locale), "/pages/prismic.html",
        layout: layout, locale: locale, locals: { content: content, path: page_path, full: prismic_content }
    else
      begin
        puts "CONTENT NOT FOUND #{locale}, #{page_path}"
        proxy translate_link("/#{page_path}/index.html", locale), "/pages/#{locale}/#{page_path}.html", layout: layout, locale: locale, locals: { path: page_path }
      rescue
        puts "NOT FOUND #{locale}, #{page_path}"
      end
    end
  end

  # press releases
  press_releases = prismic_content[locale].select { |p| p.type == 'press_release' }
  press_releases.each do |release|
    if release.slug.present?
      proxy "/media/#{release.slug}/index.html", '/pages/prismic.html', layout: 'media', locale: locale,
        locals: { content: release, path: 'press_release', full: prismic_content }
    end
  end
end

# ensure 404 accessible at 404.html
page '404.html', directory_index: false

# don't try to build pages from templates
ignore "/pages/prismic.html"

# handle redirects
data.redirects.each_pair do |path, destination|
  proxy "/#{path}/index.html", "/pages/redirect.html", layout: false, locals: { destination: destination }, ignore: true
end

paths = ["node_modules/selectize/dist/css"]
# workaround for long-standing issue with ruby implementation
# of SASS (see https://github.com/sass/sass/issues/193)
class CSSImporter < ::Sass::Importers::Filesystem
  def extensions
    super.merge('css' => :scss)
  end
end

::Compass.configuration.sass_options = {
  load_paths: paths.map{ |p| File.join(root, p) },
  filesystem_importer: CSSImporter
}

activate :external_pipeline,
  name: :browserify,
  command: "./node_modules/.bin/browserify --transform [ babelify --presets [ es2015 ] ] --extension=\".js\" source/javascripts/homepage.js source/javascripts/homepage.js | ./node_modules/.bin/uglifyjs -c > .js-dist/compiled.js",
  source: ".js-dist",
  latency: 1

activate :external_pipeline, {
  name: :parcel,
  command: build? ? 'npm run parcel-build' : 'npm run parcel-watch',
  source: '.js-dist'
}


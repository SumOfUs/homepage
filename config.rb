require 'mime/types'
require 'slim'

ROOT_LOCALE = :en
SUPPORTED_LOCALES = [:en, :fr, :de]

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
  # Minify CSS on build
  # activate :minify_css

  # Minify Javascript on build
  # activate :minify_javascript
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
  untethered = url.gsub(/\/(en|fr|de)\//, '/').gsub(/\A\/(en|fr|de)\z/, '/')
  locale == ROOT_LOCALE ? untethered : "/#{locale}#{untethered}"
end

###
# Helpers for views
###

# Methods defined in the helpers block are available in templates
helpers do

  # strips all directories and file extensions from a file path
  def slug_from_file_path(path)
    File.basename(path).split('.').first
  end

  def translate_link(url, locale)
    untethered = url.gsub(/\/(en|fr|de)\//, '/').gsub(/\A\/(en|fr|de)\z/, '/')
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
end

activate :i18n, mount_at_root: ROOT_LOCALE, langs: SUPPORTED_LOCALES
activate :asset_hash, ignore: ['.*fontawesome.*']
activate :directory_indexes

PAGE_PATHS = [['privacy', 'basic'],
              ['contact', 'about'],
              ['unsubscribed', 'basic'],
              ['unsubscribe', 'basic'],
              ['about/staff', 'about'],
              ['about/board', 'about'],
              ['about/faq', 'about'],
              ['about/funding', 'about'],
              ['about/jobs', 'about'],
              ['campaigns', 'campaigns']]

PRISMIC_TYPES = ['staff', 'press_release']
PRISMIC_SINGLETON_TYPES = ['staff']
api = Prismic.api('https://sou-homepage.prismic.io/api')
puts "-"*60
puts "|  Fetching content from Prismic..."
# press_releases = api.query(Prismic::Predicates.at("document.type", "press_release")).results
documents = api.all({ lang: '*' }).results
prismic_content = SUPPORTED_LOCALES.map do |locale|
  locale_s = locale.to_s
  translated_content = PRISMIC_TYPES.map do |type|
    relevant = documents.select { |d| d.type == type && d.lang.slice(0,2) == locale_s}
    [type, relevant.size == 1 && PRISMIC_SINGLETON_TYPES.include?(type) ? relevant.first : relevant]
  end.to_h
  [locale, translated_content]
end.to_h
puts "|  Content loaded:"
SUPPORTED_LOCALES.each do |locale|
  puts "|    #{locale}:"
  PRISMIC_TYPES.each do |type|
    puts "|      #{prismic_content[locale][type].size} #{type}"
  end
end
puts "-"*60



SUPPORTED_LOCALES.each do |locale|

  # basic page routes
  PAGE_PATHS.each do |page_path, layout|
    proxy translate_link("/#{page_path}/index.html", locale), "/pages/#{locale}/#{page_path}.html",
      layout: layout, locale: locale, locals: { content: prismic_content[locale] }
  end

  # press release routes
  # Dir[File.join('source', 'pages', locale.to_s, 'press_releases', '*')].each do |full_file_path|
  #   slug = slug_from_file_path(full_file_path)
  #   proxy "/media/#{slug}", format_template_path(full_file_path), layout: 'media', locale: locale
  # end
  prismic_content[locale]['press_release'].each do |release|
    title = release['press_release.title'].as_text
    proxy "/media/#{release.slug}", '/pages/prismic.html', layout: 'prismic/media', locale: locale, locals: {
      date: release['press_release.date'].value.strftime("%B %d, %Y"),
      title: title,
      body: release['press_release.body'].as_html(nil)
    }
  end

  # index routes
  proxy translate_link('/media/index.html', locale), "/pages/#{locale}/media.html", layout: 'media', locale: locale
  proxy translate_link('/about/index.html', locale), "/pages/#{locale}/about.html", layout: 'about', locale: locale
end

# ensure 404 accessible at 404.html
page '404.html', directory_index: false

# handle redirects
data.redirects.each_pair do |path, destination|
  proxy "/#{path}/index.html", "/pages/redirect.html", layout: false, locals: { destination: destination }, ignore: true
end

# workaround for long-standing issue with ruby implementation
# of SASS (see https://github.com/sass/sass/issues/193)
class CSSImporter < ::Sass::Importers::Filesystem
  def extensions
    super.merge('css' => :scss)
  end
end
paths = ["node_modules/selectize/dist/css"]
::Compass.configuration.sass_options = {
  load_paths: paths.map{ |p| File.join(root, p) },
  filesystem_importer: CSSImporter
}

activate :external_pipeline,
  name: :browserify,
  command: "./node_modules/.bin/#{build? ? :browserify : :watchify} --transform [ babelify --presets [ es2015 ] ] --extension=\".js\" source/javascripts/homepage.js -o .js-dist/compiled.js",
  source: ".js-dist",
  latency: 1

activate :s3_sync do |s3_sync|
  s3_sync.bucket                     = 'www.sumofus.org' # The name of the S3 bucket you are targeting. This is globally unique.
  s3_sync.region                     = 'us-east-1'     # The AWS region for your bucket.
  s3_sync.aws_access_key_id          = $AWS_ACCESS_KEY_ID
  s3_sync.aws_secret_access_key      = $AWS_SECRET_ACCESS_KEY
  s3_sync.delete                     = false # We delete stray files by default.
  s3_sync.after_build                = false # We do not chain after the build step by default.
  s3_sync.prefer_gzip                = true
  s3_sync.path_style                 = true
  s3_sync.reduced_redundancy_storage = false
  s3_sync.acl                        = 'public-read'
  s3_sync.encryption                 = false
  s3_sync.prefix                     = ''
  s3_sync.version_bucket             = false
  s3_sync.index_document             = 'index.html'
  s3_sync.error_document             = '404.html'
end

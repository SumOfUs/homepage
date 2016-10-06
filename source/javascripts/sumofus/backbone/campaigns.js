const Campaigns = Backbone.View.extend({

  el: '.campaign-tiles',

  JSON_PATH: '/api/pages/featured.json',
  FADE_IN_SECONDS: 0.8,
  BAR_FILL_SECONDS: 0.4,

  // options are passed along to the API
  initialize(options) {
    this.apiHost = options.apiHost || '';
    this.loadCampaigns(options.language);
  },

  loadCampaigns(language='en') {
    $.get(
      this.apiHost + this.JSON_PATH, {language: language}, this.success.bind(this)
    ).fail(this.failure.bind(this));
  },

  success(data) {
    this.$('.campaign-tiles__loading').addClass('hidden-irrelevant');
    for (var ii = 0; ii < data.length; ii++) {
      this.$el.append(this.template(data[ii].title, data[ii].url, data[ii].image, data[ii].action_count));
    }
    window.setTimeout(() => {
      this.$('.campaign-tile').removeClass('transparent');
      $('.campaign-tiles--empty').removeClass('campaign-tiles--empty');
    }, 100);
    
  },

  failure(e) {
    this.$('.campaign-tiles__loading').addClass('hidden-irrelevant');
    this.$('.campaign-tiles__failed').removeClass('hidden-irrelevant');
    $('.campaign-tiles--empty').removeClass('campaign-tiles--empty');
  },

  template(title, pageUrl, imageUrl, actionCount) {
    if (imageUrl.length) {
      var backgroundStyle = `background-image: url(${imageUrl})`;
    } else {
      var backgroundStyle = `background-color: ${this.hashStringToColor(title)}`;
    }
    return `<a class="campaign-tile campaign-tile--compact transparent" href="${pageUrl}">
              <div class="campaign-tile__image"
                   style="${backgroundStyle}">
                <div class="campaign-tile__overlay">
                  ${I18n.t('pages.campaigns.action_count', {count: I18n.toNumber(actionCount, {precision: 0})})}
                </div>
              </div>
              <div class="campaign-tile__lead">${title}</div>
              <div class="campaign-tile__cta campaign-tile__open-cta">
                ${I18n.t('homepage.cta.learn_more')} &raquo;
              </div>
            </a>`;
  },

  // from http://stackoverflow.com/questions/11120840/hash-string-into-rgb-color
  hashString(str){
    var hash = 5381;
    for (let ii = 0; ii < str.length; ii++) {
      hash = ((hash << 5) + hash) + str.charCodeAt(ii); /* hash * 33 + c */
    }
    return hash;
  },

  hashStringToColor(str) {
    var hash = this.hashString(str);
    var r = (hash & 0xFF0000) >> 16;
    var g = (hash & 0x00FF00) >> 8;
    var b = hash & 0x0000FF;
    return "#" + ("0" + r.toString(16)).substr(-2) + ("0" + g.toString(16)).substr(-2) + ("0" + b.toString(16)).substr(-2);
  },

});

module.exports = Campaigns;

const Campaigns = Backbone.View.extend({
  el: '.campaign-tiles',

  JSON_PATH: '/api/pages/featured.json',
  FADE_IN_SECONDS: 0.8,
  BAR_FILL_SECONDS: 0.4,
  MIN_ACTION_COUNT: 1000,

  initialize(options) {
    this.apiHost = options.apiHost || '';
    this.loadCampaigns(options.language);
    I18n.locale = options.language || 'en';
    this.source = options.source;
    this.limit = options.limit || -1;
  },

  loadCampaigns(language = 'en') {
    $.get(
      this.apiHost + this.JSON_PATH,
      { language: language },
      this.success.bind(this)
    ).fail(this.failure.bind(this));
  },

  success(data) {
    $('.campaign-list__loading').addClass('hidden-irrelevant');
    for (var ii = 0; ii < data.length; ii++) {
      if (ii >= this.limit && this.limit !== -1) break;
      this.$el.append(
        this.template(
          data[ii].title,
          this.addSource(data[ii].url),
          data[ii].image,
          data[ii].campaign_action_count || data[ii].action_count,
          data[ii].percentage_completed,
          data[ii].donation_page
        )
      );
    }
    window.setTimeout(() => {
      this.$('.campaign-tile').removeClass('transparent');
      $('.campaign-tiles--empty').removeClass('campaign-tiles--empty');
    }, 100);
  },

  addSource(url) {
    if (!this.source) return url;
    return this.addParam(url, 'source', this.source);
  },

  addParam(url, key, value) {
    let hashSplit = url.split('#');
    let paramStarter = hashSplit[0].indexOf('?') > -1 ? '&' : '?';
    let output = `${hashSplit[0]}${paramStarter}${key}=${value}`;
    if (hashSplit.length > 1) {
      output = `${output}#${hashSplit[1]}`;
    }
    return output;
  },

  failure(e) {
    $('.campaign-list__loading').addClass('hidden-irrelevant');
    $('.campaign-list__failed').removeClass('hidden-irrelevant');
    $('.campaign-tiles--empty').removeClass('campaign-tiles--empty');
  },

  template(
    title,
    pageUrl,
    imageUrl,
    actionCount,
    percentageCompleted,
    donationPage
  ) {
    if (imageUrl.length) {
      var backgroundStyle = `background-image: url(${imageUrl})`;
    }
    const completedAction = percentageCompleted
      ? `width: ${percentageCompleted}%`
      : `width: 0%`;
    return `<div class="campaign-container">
              <a class="campaign-tile campaign-tile--compact transparent" href="${pageUrl}">
                <div class="campaign-tile__image"
                    style="${backgroundStyle}">
                </div>
                <div class="campaign-tile__lead">${title}</div>
                <div class="campaign-tile__action-bar ${
                  percentageCompleted ? `` : `hidden-action-bar`
                }">
                  <div class="campaign-tile__completed-action-bar" style="${completedAction}"></div>
                </div>
                <div class="campaign-tile__action-count ${
                  actionCount ? `` : `hidden-action-bar`
                }"">${I18n.t('pages.campaigns.support', {
      count: I18n.toNumber(actionCount, { precision: 0 }),
    })}</div>                
                <div class="campaign-tile__cta campaign-tile__open-cta">
                  ${
                    donationPage
                      ? I18n.t('homepage.nav.donate')
                      : I18n.t('homepage.cta.take_action')
                  }
                </div>
              </a>
            </div>`;
  },

  // from http://stackoverflow.com/questions/11120840/hash-string-into-rgb-color
  hashString(str) {
    var hash = 5381;
    for (let ii = 0; ii < str.length; ii++) {
      hash = (hash << 5) + hash + str.charCodeAt(ii); /* hash * 33 + c */
    }
    return hash;
  },
});

module.exports = Campaigns;

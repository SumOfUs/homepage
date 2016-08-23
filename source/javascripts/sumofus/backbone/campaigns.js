const Campaigns = Backbone.View.extend({

  el: '.campaign-tiles',

  BASE_URL: '//localhost:3000',
  JSON_PATH: '/api/pages.json',
  FADE_IN_SECONDS: 0.8,
  BAR_FILL_SECONDS: 0.4,

  initialize() {
    this.loadCampaigns();
  },

  loadCampaigns() {
    $.get(this.BASE_URL + this.JSON_PATH, {}, this.success.bind(this)).fail(this.failure.bind(this));
  },

  success(data) {
    this.$('.campaign-tiles__loading').addClass('hidden-irrelevant');
    for (var ii = 0; ii < data.length; ii++) {
      this.$el.append(this.template(data[ii].title, data[ii].url, data[ii].image, data[ii].action_count));
    }
    window.setTimeout(() => {
      this.$('.campaign-tile').removeClass('transparent');  
    }, 100);
    
  },

  failure(e) {
    this.$('.campaign-tiles__loading').addClass('hidden-irrelevant');
    this.$('.campaign-tiles__failed').removeClass('hidden-irrelevant');
  },

  template(title, pageUrl, imageUrl, actionCount) {
    return `<a class="campaign-tile campaign-tile--compact transparent" href="${pageUrl}">
              <div class="campaign-tile__image"
                   style="background-image: url(${imageUrl})">
                <div class="campaign-tile__overlay">
                  ${I18n.t('pages.campaigns.action_count', {count: actionCount})}
                </div>
              </div>
              <div class="campaign-tile__lead">${title}</div>
              <div class="campaign-tile__cta campaign-tile__open-cta">
                ${I18n.t('homepage.cta.learn_more')} &raquo;
              </div>
            </a>`;
  },

});

module.exports = Campaigns;

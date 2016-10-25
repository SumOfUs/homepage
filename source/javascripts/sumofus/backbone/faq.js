const Faq = Backbone.View.extend({

  events: {
    'click .faq__question': 'toggleQuestion',
    'click .faq__expand-all': 'expandBlock',
  },

  el: '.main-content__body-text',

  initialize(options = {}) {
    this.initialFormat();
  },

  initialFormat() {
    let built = []
    let building = {};
    _.each(this.$el.children(), (el) => {
      let $current = this.$(el);
      if ($current.prop('tagName') === 'H2') {
        if (Object.keys(building).length) built.push(building);
        building = { type: 'qa' };
        building.question = $current.html();
        $current.remove()
      } else if ($current.prop('tagName') === 'H1') {
        if (Object.keys(building).length) built.push(building);
        building = {};
        built.push({ type: 'header', title: $current.html()});
        $current.remove();
      } else if ($current.prop('tagName') === 'SCRIPT') {
        // do nothing with it
      } else {
        building.answer = building.answer || [];
        building.answer.push($current.detach()[0].outerHTML);
      }
    });
    if (Object.keys(building).length) built.push(building);
    this.show(built);
  },

  show(data) {
    this.$el.append('<div class="faq__block"><div>');
    let $appendTarget = this.$('.faq__block').last();
    for (let qa of data) {
      if (qa.type === 'qa') {
        $appendTarget.append(this.template(qa.question, qa.answer));  
      } else if (qa.type === 'header') {
        this.$el.append(this.headerTemplate(qa.title));
        $appendTarget = this.$('.faq__block').last();
      }
    }
  },

  template(question, answer) {
    return `<div class="faq__qa">
              <div class="faq__question">
                ${question}
              </div>
              <div class="faq__answer hidden-closed">
                ${answer.join('\n')}
              </div>
            </div>`;
  },

  headerTemplate(title) {
    return `<div class="faq__block">
              <h2 class="faq__title">
                ${title}
                <span class="faq__expand-all">${I18n.t('pages.faq.expand_all')}</span>
              </h2>
            </div>`;
  },

  toggleQuestion(e) {
    let $qaBlock = this.$(e.target).parents('.faq__qa');
    $qaBlock.find('.faq__answer').toggleClass('hidden-closed');
    $qaBlock.find('.faq__question').toggleClass('faq__question--open');
  },

  expandBlock(e) {
    let $qaBlock = this.$(e.target).parents('.faq__block').find('.faq__qa');
    $qaBlock.find('.faq__answer').removeClass('hidden-closed');
    $qaBlock.find('.faq__question').addClass('faq__question--open');
  },
});

module.exports = Faq;

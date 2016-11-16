const ActionStream = Backbone.View.extend({

  el: '.action-stream',
  ACTION_SOURCE: 'https://actions-api.sumofus.org',
  LINK_ROOT: 'https://actions.sumofus.org',
  MAX_PER_PERIOD: 1,
  INSERTION_PERIOD: 1.2, // seconds
  ANIMATION_DURATION: 0.8, // seconds

  MAX_ACTION_ELS: 20,

  initialize() {
    window.setInterval(this.updateTimestamps.bind(this), 1000);
    window.setInterval(this.renderActions.bind(this), this.INSERTION_PERIOD*1000);
    this.actionsContainer = this.$('.action-stream__actions');
    this.actionQueue = [];
    this.socket = io(this.ACTION_SOURCE);
    this.socket.on('actions', this.handleMessage.bind(this));
  },

  handleMessage(msg) {
    this.actionQueue.push(JSON.parse(msg));
  },

  formatName(firstName, lastName) {
    let formattedFirstName = this.capitalize(firstName);
    if(lastName.length === 0){
      return formattedFirstName;
    }
    return `${formattedFirstName} ${lastName.slice(0, 1).toUpperCase()}.`
  },

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  updateTimestamps() {
    this.$('.stream-action__timestamp').each((ii, el) => {
      let $el = this.$(el);
      let seconds = Number.parseInt($el.data('seconds'), 10) + 1;
      $el.data('seconds', seconds);
      $el.text(I18n.t('homepage.action_stream.seconds_ago', {seconds: seconds}));
    });
  },

  // rather than render the actions as they arrive, we batch them and add
  // them every INSERTION_PERIOD because the CSS transition gets stopped
  // when we add new actions.
  renderActions() {
    if(this.actionQueue.length === 0) { return; }

    // add the elements to the DOM
    let totalWidth = 0
    let countToAdd = this.MAX_PER_PERIOD || this.actionQueue.length;
    for (var ii = 0; ii < countToAdd; ii++) {
      let action = this.actionQueue.shift();
      let name = this.formatName(action.first_name, action.last_name);
      let url = this.LINK_ROOT + action.uri;
      this.actionsContainer.prepend(this.template(action.type, name, 1, url));
      totalWidth += this.actionsContainer.children().first().outerWidth();
    }

    // prune excessive elements no longer on screen
    this.actionsContainer.children().slice(this.MAX_ACTION_ELS).remove();

    // animate the DOM so new elements appear to slide in
    this.actionsContainer.css('transition', 'left 0s');
    this.actionsContainer.css('left', `-${totalWidth}px`);
    window.setTimeout(()=> {
      this.actionsContainer.css('transition', `left ${this.ANIMATION_DURATION}s ease-in-out`);
      this.actionsContainer.css('left', '0');
    }, 32);
  },

  template(action_type, name, seconds_ago, url) {
    if(action_type !== 'petition' && action_type !== 'donation') {
      console.error(`Invalid action_type '${action_type}'. Expected 'petition' or 'donation'.`);
      return;
    }
    let actionTranslation = `homepage.action_stream.${action_type}`
    let icon = (action_type === 'donation') ? 'usd' : 'pencil'
    return `<a class="action-stream__template stream-action" href="${url}">
              <div class="stream-action__icon-holder">
                <span class="stream-action__icon fa fa-${icon}"></span>
              </div>
              <div class="stream-action__text">
                <div class="stream-action__credit">
                  ${I18n.t(actionTranslation, {name: name})}
                </div>
                <div class="stream-action__timestamp" data-seconds="${seconds_ago}">
                  ${I18n.t('homepage.action_stream.seconds_ago', {seconds: seconds_ago})}
                </div>
              </div>
            </a>`
  },

});

module.exports = ActionStream;

const ActionStream = Backbone.View.extend({

  el: '.action-stream',
  ACTION_SOURCE: 'http://live-actions-production.cwctan5wfu.us-west-2.elasticbeanstalk.com',
  ANIMATION_SECONDS: 0.8,
  MAX_ACTION_ELS: 20,

  initialize() {
    window.setInterval(this.updateTimestamps.bind(this), 1000);
    window.setInterval(this.renderActions.bind(this), this.ANIMATION_SECONDS*1000);
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
  // them every ANIMATION_SECONDS because the CSS transition gets stopped
  // when we add new actions.
  renderActions() {
    if(this.actionQueue.length === 0) { return; }

    // add the elements to the DOM
    let totalWidth = 0
    for (var ii = 0; ii < this.actionQueue.length; ii++) {
      let action = this.actionQueue[ii];
      let name = this.formatName(action.first_name, action.last_name);
      this.actionsContainer.prepend(this.template(action.type, name, 1));
      totalWidth += this.actionsContainer.children().first().outerWidth();
    }
    this.actionQueue = [];

    // prune excessive elements no longer on screen
    this.actionsContainer.children().slice(this.MAX_ACTION_ELS).remove();

    // animate the DOM so new elements appear to slide in
    this.actionsContainer.css('transition', 'left 0s');
    this.actionsContainer.css('left', `-${totalWidth}px`);
    window.setTimeout(()=> {
      this.actionsContainer.css('transition', `left ${this.ANIMATION_SECONDS}s ease-in-out`);
      this.actionsContainer.css('left', '0');
    }, 32);
  },

  template(action_type, name, seconds_ago) {
    if(action_type !== 'petition' && action_type !== 'donation') {
      console.error(`Invalid action_type '${action_type}'. Expected 'petition' or 'donation'.`);
      return;
    }
    let actionTranslation = `homepage.action_stream.${action_type}`
    let icon = (action_type === 'donation') ? 'usd' : 'pencil'
    return `<div class="action-stream__template stream-action">
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
            </div>`
  },

});

module.exports = ActionStream;

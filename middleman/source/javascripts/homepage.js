window.$ = require('jquery');
window._ = require('underscore');
window.Backbone = require('backbone');
window.I18n = require('i18n-js');
window.Stickyfill = require('stickyfill');

require('selectize');
require('./slidey_header');

window.Faq           = require('./sumofus/backbone/faq');
window.ActionStream  = require('./sumofus/backbone/action_stream');
window.PoiMap        = require('./sumofus/backbone/poi_map');
window.PressCarousel = require('./sumofus/backbone/press_carousel');
window.SignupForm    = require('./sumofus/backbone/signup_form');
window.Campaigns     = require('./sumofus/backbone/campaigns');
window.UnsubscribeForm = require('./sumofus/backbone/unsubscribe_form');
window.BankingDetailsForm = require('./sumofus/backbone/banking_details_form');
window.SweetPlaceholder = require('./sumofus/backbone/sweet_placeholder');
window.FundingTable = require('./sumofus/backbone/funding/funding_table');
window.ExpensesTable = require('./sumofus/backbone/funding/expenses_table')

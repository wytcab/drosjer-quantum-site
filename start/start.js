(function () {
  'use strict';

  // Stripe Payment Links — live as of 2026-11-01. Drosjer Quantum
  // sub-account live as Individual sole-proprietorship.
  var STRIPE_LINKS = {
    small:   'https://buy.stripe.com/3cIbJ3bt93NZfNj8XZ2kw00',
    medium:  'https://buy.stripe.com/7sY4gB40HesDbx3def2kw01',
    complex: 'https://buy.stripe.com/fZudRbfJpckv30xdef2kw02'
  };

  var TIER_LABELS = {
    small:   { price: '$2,500',         name: 'Small'   },
    medium:  { price: '$5,000',         name: 'Medium'  },
    complex: { price: '$8,000-12,000',  name: 'Complex' }
  };

  var VALID_TIERS = ['small', 'medium', 'complex', 'tbd'];

  var tierOptions = document.querySelectorAll('.tier-option');
  var paymentLink = document.getElementById('stripe-payment-link');
  var tierNote    = document.getElementById('stripe-tier-note');

  function getTierFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var tier = (params.get('tier') || '').toLowerCase();
    return VALID_TIERS.indexOf(tier) >= 0 ? tier : 'tbd';
  }

  function selectTier(tier) {
    for (var i = 0; i < tierOptions.length; i++) {
      var opt = tierOptions[i];
      var isSelected = opt.dataset.tier === tier;
      opt.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    }

    if (tier === 'tbd') {
      paymentLink.setAttribute('href', '#');
      paymentLink.classList.add('btn-disabled');
      paymentLink.setAttribute('aria-disabled', 'true');
      paymentLink.textContent = 'Select a tier to enable payment';
      paymentLink.removeAttribute('target');
      paymentLink.removeAttribute('rel');
      tierNote.style.display = 'none';
      tierNote.textContent = '';
    } else {
      var link = STRIPE_LINKS[tier];
      var label = TIER_LABELS[tier];
      paymentLink.setAttribute('href', link);
      paymentLink.classList.remove('btn-disabled');
      paymentLink.removeAttribute('aria-disabled');
      paymentLink.textContent = 'Pay ' + label.price + ' (' + label.name + ')';
      paymentLink.setAttribute('target', '_blank');
      paymentLink.setAttribute('rel', 'noopener noreferrer');
      tierNote.style.display = 'block';
      tierNote.textContent = 'Selected: ' + label.name + ' tier (' + label.price +
        '). Opens Stripe Checkout in a new tab.';
    }

    var newUrl = new URL(window.location.href);
    newUrl.searchParams.set('tier', tier);
    window.history.replaceState({}, '', newUrl);
  }

  for (var i = 0; i < tierOptions.length; i++) {
    (function (opt) {
      opt.addEventListener('click', function () {
        selectTier(opt.dataset.tier);
      });
      opt.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          selectTier(opt.dataset.tier);
        }
      });
    })(tierOptions[i]);
  }

  selectTier(getTierFromUrl());
})();

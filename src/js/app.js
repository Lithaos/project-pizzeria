import {
  Product
} from './components/Product.js';
import {
  Cart
} from './components/Cart.js';
import {
  select,
  classNames,
  settings
} from './settings.js';
import {
  Booking
} from './components/Booking.js';

const app = {
  initMenu() {
    const thisApp = this;

    //console.log('thisApp.data:', thisApp.data);

    for (let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  initData: function () {
    const thisApp = this;

    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;
    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        thisApp.data.products = parsedResponse;
        thisApp.initMenu();
        //console.log('thisApp.data z JSON', JSON.stringify(thisApp.data));
      });
  },

  init: function () {
    const thisApp = this;
    /*console.log('*** App starting ***');
    console.log('thisApp:', thisApp);
    console.log('classNames:', classNames);
    console.log('settings:', settings);
    console.log('templates:', templates);*/

    thisApp.initPages();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();
    thisApp.carousel();
  },

  initCart: function () {
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function (event) {
      app.cart.add(event.detail.product);
    });
  },

  initPages() {
    const thisApp = this;

    thisApp.pages = Array.from(document.querySelector(select.containerOf.pages).children);
    thisApp.navLinks = Array.from(document.querySelectorAll(select.nav.links));
    thisApp.homeLinks = Array.from(document.querySelectorAll(select.nav.homeLinks));
    thisApp.navLinks = thisApp.navLinks.concat(thisApp.homeLinks);
    let pagesMatchingHash = [];

    if (window.location.hash.length > 1) {
      const idFromHash = window.location.hash.replace('#/', '');

      pagesMatchingHash = thisApp.pages.filter(function (page) {
        return page.id == idFromHash;
      });
    }
    thisApp.activePage(pagesMatchingHash.length ? pagesMatchingHash[0].id : thisApp.pages[0].id);

    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function (event) {
        const clickedElement = this;
        event.preventDefault();

        const id = clickedElement.getAttribute('href').replace('#', '');
        thisApp.activePage(id);
      });
    }

  },

  activePage(pageId) {
    const thisApp = this;

    for (let link of thisApp.navLinks) {
      link.classList.toggle(classNames.nav.active, link.getAttribute('href') == '#' + pageId);
    }

    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.nav.active, page.getAttribute('id') == pageId);
    }
    window.location.hash = '#/' + pageId;
  },

  initBooking() {
    const thisApp = this;

    const widget = document.querySelector(select.containerOf.booking);
    thisApp.booking = new Booking(widget);

  },

  carousel() {
    let comentIndex = 0;
    setInterval(() => {
      const comments = document.getElementsByClassName('carousel-coment');
      const dots = document.getElementsByClassName('dot');

      if (comments.length == comentIndex) {
        comentIndex = 0;
      }
      comentIndex++;
      for (let i = 0; i < comments.length; i++) {
        comments[i].classList.remove('comment-active');
        dots[i].classList.remove('active');
      }

      comments[comentIndex - 1].classList.add('comment-active');
      dots[comentIndex - 1].classList.add('active');

    }, 3000);
  }
};

app.init();

/*!
* counter.js 0.9
*
* Copyright 2021, Bogumił Cenian https://alfabravo.pl @alfabravopl
* Released under the MIT License
*
* Date: 25.10.2021
*/

//-----------------------------------------------------------------------------
class abCounter {
  //---------------------------------------------------------------------------
  //! Konstruktor klasy - ustawia parametry
  constructor(options) {
    let defaultOpt = {
      element: "[data-to]",
      time: 1000,
      delay: 10,
      decimalSeperator: ',',
      thousandSeparator: ' '
    };

    this.options = { ...defaultOpt, ...options };

    this.init();
  } // constructor

  //---------------------------------------------------------------------------
  //! Inicjalizacja pluginu
  init() {
    abCounterHelper.getInstance().setLastPosition(document.defaultView.pageYOffset);

    document.querySelectorAll(this.options.element).forEach((elem) => {
      elem.className += ' counter-item';
      elem.counterDataStart = false;

      elem.setAttribute('data-start', 'false');
      elem.setAttribute('data-time', this.options.time);
      elem.setAttribute('data-delay', this.options.delay);
      elem.setAttribute('data-ds', this.options.decimalSeperator);
      elem.setAttribute('data-ts', this.options.thousandSeparator);

      abCounterHelper.getInstance().addItem(elem);
    });

    abCounterHelper.getInstance().setElement(this.options.element);

    window.addEventListener('scroll', function () {
      var lastPosition = abCounterHelper.getInstance().getLastPosition();
      var scrollDirection = 'bottom';

      if (lastPosition > document.defaultView.pageYOffset) {
        scrollDirection = 'top';
      }
      else {
        scrollDirection = 'bottom';
      }

      abCounterHelper.getInstance().setLastPosition(document.defaultView.pageYOffset);

      document.querySelectorAll(abCounterHelper.getInstance().getElement()).forEach((item) => {
        if (item.getAttribute('data-start') == 'false') {
          if ((scrollDirection == 'bottom' && abCounterHelper.getInstance().getLastPosition() + window.innerHeight > item.getAttribute('data-top')) ||
            (scrollDirection == 'top' && abCounterHelper.getInstance().getLastPosition() < item.getAttribute('data-bottom'))) {
            item.setAttribute('data-start', 'true');

            abCounter.runCounter(item);
          }
        }
      });
    });

    abCounterHelper.getInstance().setLastPosition(document.defaultView.pageYOffset);
    
    this.calculatePosition();

    document.querySelectorAll(this.options.element).forEach((item) => {
      var pos = abCounterHelper.getInstance().getLastPosition();
      if (pos + window.innerHeight > item.getAttribute('data-top')) {
        item.setAttribute('data-start', 'true');

        abCounter.runCounter(item);
      }
    });
  } // init

  //---------------------------------------------------------------------------
  //! Obliczenie pozycji elementów aby wyznaczyć moment odpalenia aplikacji
  calculatePosition() {
    document.querySelectorAll(this.options.element).forEach((elem) => {
      let min = this.getOffsetTop(elem),
        max = min + elem.clientHeight;

      elem.setAttribute('data-top', min);
      elem.setAttribute('data-bottom', max);
    });
  } // calculatePosition

  //---------------------------------------------------------------------------
  //! Aktualna pozycja wzgledem topu strony
  getOffsetTop(elem) {
    let rect = elem.getBoundingClientRect();
    let win = elem.ownerDocument.defaultView;

    return rect.top + win.pageYOffset;
  } // getOffsetTop

  //---------------------------------------------------------------------------
  //! Uruchomienie odliczania
  static runCounter(element) {
    var nums = [];
    var divisions = parseInt(element.getAttribute('data-time')) / parseInt(element.getAttribute('data-delay'));
    var num = element.getAttribute('data-to');

    var ts = element.getAttribute('data-ts'),
      ds = element.getAttribute('data-ds');

    var hasThousandSeparator = new RegExp('[0-9]+' + ts + '[0-9]+').test(num);
    var regTS = new RegExp(ts, 'g');
    num = num.replace(regTS, '');

    var isFloat = new RegExp('^[0-9]+' + ds + '[0-9]+$').test(num);
    var decimalPlaces = isFloat ? (num.split(ds)[1] || []).length : 0;

    if (isFloat && ds != '.') {
      var regDS = new RegExp(ds, 'g');
      num = num.replace(regDS, '.');
    }

    for (var i = divisions; i >= 1; i--) {
      var newNum = parseInt(num / divisions * i);

      if (isFloat) {
        newNum = parseFloat(num / divisions * i).toFixed(decimalPlaces);
      }

      if (hasThousandSeparator) {
        while (/(\d+)(\d{3})/.test(newNum.toString())) {
          newNum = newNum.toString().replace(/(\d+)(\d{3})/, '$1' + ts + '$2');
        }
      }

      if (isFloat && ds != '.') {
        newNum = newNum.replace('.', ds);
      }

      nums.unshift(newNum);
    }

    element.dataset.nums = JSON.stringify(nums);
    element.innerText = '0';

    setTimeout(abCounterHelper.getInstance().doCounter, parseInt(element.getAttribute('data-delay')), element);
  } // runCounter
} // abCounter



//-----------------------------------------------------------------------------
class abCounterHelper {
  //---------------------------------------------------------------------------
  //! Konstruktor klasy helpera - zapewnia pojedyncze wywołania dla wielu inicjalizacji
  constructor() {
    if (!abCounterHelper.instance) {
      this.lastPosition = 0;
      this.scrollDirection = 'bottom';
      this.items = [];
      this.elementSelector = '';

      window.addEventListener('resize', function() {
        document.querySelectorAll(abCounterHelper.getElement()).forEach((elem) => {
          let min = this.getOffsetTop(elem),
            max = min + elem.clientHeight;
    
          elem.setAttribute('data-top', min);
          elem.setAttribute('data-bottom', max);
        });
      });

      abCounterHelper.instance = this;
    }

    return abCounterHelper.instance;
  } // constructor

  //---------------------------------------------------------------------------
  //! Zwróc instancje
  static getInstance() {
    return new abCounterHelper();
  } // getInstance

  //---------------------------------------------------------------------------
  setLastPosition(x) {
    this.lastPosition = x;
  } // setLastPosition

  //---------------------------------------------------------------------------
  getLastPosition() {
    return this.lastPosition;
  } // getLastPosition

  //---------------------------------------------------------------------------
  addItem(item) {
    this.items.push(item);
  } // addItem

  //---------------------------------------------------------------------------
  getItems() {
    return this.items;
  } // getItems

  //---------------------------------------------------------------------------
  setElement(element) {
    if (this.elementSelector.length > 0) {
      this.elementSelector += ',';
    }
    this.elementSelector += element;
  } // setElement

  //---------------------------------------------------------------------------
  getElement() {
    return this.elementSelector;
  } // getElement

  //---------------------------------------------------------------------------
  //! Wykonaj zdjecie jednego elementu ze stosu do wyświetlenia
  doCounter(element) {
    var nums = JSON.parse(element.dataset.nums);
    element.innerText = nums.shift();
    element.dataset.nums = JSON.stringify(nums);

    if (nums.length) {
      setTimeout(abCounterHelper.getInstance().doCounter, parseInt(element.getAttribute('data-delay')), element);
    }
    else {
      delete element.dataset.nums
      delete element.dataset.counterFunc
    }
  } // doCounter
}

// eof: counter.js

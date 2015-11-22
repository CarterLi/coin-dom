(()=> {
  'use strict';

  const money = {
    earnedDom: document.getElementById('earnedMoney'),
    get earned() {
      return Number(this.earnedDom.textContent);
    },
    set earned(value) {
      this.earnedDom.textContent = value;
    },

    lostDom: document.getElementById('lostMoney'),
    get lost() {
      return Number(this.lostDom.textContent);
    },
    set lost(value) {
      this.lostDom.textContent = value;
    },
  };

  document.getElementById('circle').addEventListener('animationend', function onAnimationEnd() {
    this.style.display = 'none';
  });

  ['mousedown', 'touchstart'].forEach(eventName=> {
    document.querySelector('main').addEventListener(eventName, function onClicked(event) {
      const pos = {
        pageX: event.pageX !== undefined ? event.pageX : event.touches[0].pageX,
        pageY: event.pageY !== undefined ? event.pageY : event.touches[0].pageY,
      };
      const circle = document.getElementById('circle');
      circle.style.display = 'none';
      circle.style.left = `${pos.pageX - this.offsetLeft - 5}px`;
      circle.style.top = `${pos.pageY - 5}px`;
      circle.style.display = 'block';
      event.preventDefault();
    });
  });

  function updateCoinSpeed(coin) {
    const rnd = Math.random() * 2 + 0.4;

    coin.style.width = `${32 * rnd}px`;
    coin.style.height = `${32 * rnd}px`;
    coin.style.top = `${-32 * rnd}px`;
    coin.style.animationDuration = `${5 * (Math.random() + 0.3)}s`;
    coin.style.animationDelay = `${5 * (Math.random() / 2 + 0.5)}s`;
  }

  Array.prototype.forEach.call(document.querySelectorAll('#coins li'), coin=> {
    updateCoinSpeed(coin);

    ['mousedown', 'touchstart'].forEach(eventName=> {
      coin.addEventListener(eventName, function onMouseDown(event) {
        this.classList.add('clicked');
        event.preventDefault();
      });
    });
    coin.addEventListener('transitionend', function onTransitionEnd() {
      this.classList.remove('clicked');
      updateCoinSpeed(coin);
      this.classList.toggle('toggle-anime');
      ++money.earned;
    });
    coin.addEventListener('animationend', function onAnimationEnd() {
      updateCoinSpeed(coin);
      this.classList.toggle('toggle-anime');
      ++money.lost;
    });
  });
})();

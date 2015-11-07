(()=> {
  'use strict';

  const money = {
    get earned() {
      return Number(document.getElementById('earnedMoney').textContent);
    },
    set earned(value) {
      document.getElementById('earnedMoney').textContent = value;
    },

    get lost() {
      return Number(document.getElementById('lostMoney').textContent);
    },
    set lost(value) {
      document.getElementById('lostMoney').textContent = value;
    },
  };

  document.addEventListener('contextmenu', event=> event.preventDefault());

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

  Array.prototype.forEach.call(document.querySelectorAll('#coins li'), coin=> {
    const updateCoinSpeed = ()=> {
      const rnd = Math.random() * 2 + 0.4;

      coin.style.width = `${32 * rnd}px`;
      coin.style.height = `${32 * rnd}px`;
      coin.style.top = `${-32 * rnd}px`;
      coin.style.animationDuration = `${5 * (Math.random() + 0.3)}s`;
      coin.style.animationDelay = `${5 * (Math.random() / 2 + 0.5)}s`;
    };

    updateCoinSpeed();

    ['mousedown', 'touchstart'].forEach(eventName=> {
      coin.addEventListener(eventName, event=> {
        coin.classList.add('clicked');
        event.preventDefault();
      });
    });
    coin.addEventListener('transitionend', ()=> {
      coin.classList.remove('clicked');
      updateCoinSpeed();
      coin.classList.toggle('toggle-anime');
      ++money.earned;
    });
    coin.addEventListener('animationend', ()=> {
      updateCoinSpeed();
      coin.classList.toggle('toggle-anime');
      ++money.lost;
    });
  });
})();

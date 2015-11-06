(()=> {
  'use strict';

  let money = {
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
    }
  };

  document.addEventListener('contextmenu', e=> {
    e.preventDefault();
  });

  Array.prototype.forEach.call(document.querySelectorAll('#coins li'), coin=> {
    let updateCoinSpeed = ()=> {
      let rnd = Math.random() * 2 + .4;

      coin.style.width = `${32 * rnd}px`;
      coin.style.height = `${32 * rnd}px`;
      coin.style.top = `${-32 * rnd}px`;
      coin.style.animationDuration = `${5 * (Math.random() + .3)}s`;
      coin.style.animationDelay = `${5 * (Math.random() / 2 + .5)}s`;
    };

    updateCoinSpeed();

    ['mousedown', 'touchstart'].forEach(eventName=> {
      coin.addEventListener(eventName, e=> {
        coin.classList.add('clicked');
      });
    });
    coin.addEventListener('transitionend', e=> {
      coin.classList.remove('clicked');
      updateCoinSpeed();
      coin.classList.toggle('toggle-anime');
      ++money.earned;
    });
    coin.addEventListener('animationend', e=> {
      updateCoinSpeed();
      coin.classList.toggle('toggle-anime');
      ++money.lost;
    });
  });
})();

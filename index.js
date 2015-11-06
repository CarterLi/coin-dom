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

  document.getElementById('circle').addEventListener('animationend', function(e) {
    this.style.display = 'none';
  });

  ['mousedown', 'touchstart'].forEach(eventName=> {
    document.querySelector('main').addEventListener(eventName, function(e) {
      let pos = {
        pageX: e.pageX !== undefined ? e.pageX : e.touches[0].pageX,
        pageY: e.pageY !== undefined ? e.pageY : e.touches[0].pageY
      };
      let circle = document.getElementById('circle');
      circle.style.display = 'none';
      circle.style.left = `${pos.pageX - this.offsetLeft - 5}px`;
      circle.style.top = `${pos.pageY - 5}px`;
      circle.style.display = 'block';
      e.preventDefault();
    });
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
        e.preventDefault();
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

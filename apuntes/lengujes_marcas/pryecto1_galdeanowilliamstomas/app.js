'use strict';

const switcher = document.querySelector('.btn');
function light_mode(){
    document.body.classList.toggle('light-theme');
    document.body.classList.toggle('light-theme2');
}
switcher.addEventListener('click', function() {
    light_mode()
    document.body.classList.toggle('dark-theme');

});



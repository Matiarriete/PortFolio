var array = [['Java',40], ['HTML', 50], ['C++', 15], ['MySQL', 50],
['JavaScript', 40], ['Ux Design', 50], ['Google Scripts', 15], ['NodeJS', 15]
['CSS', 50]];

 array.forEach(element => {
    const abilities = document.getElementById('abilities');

    const contAbility = document.createElement('div');
    const p = document.createElement('p');
    const progress = document.createElement('div');
    const progressbar = document.createElement('div');

    contAbility.classList.add('contAbility');
    progress.classList.add('progress');
    progressbar.classList.add('progress-bar');

    p.textContent = element[0];
    progressbar.ariaLabel = "Basic example"
    progressbar.ariaValueMax = "100"
    progressbar.ariaValueMin = "0"
    progressbar.ariaValueNow = "75"
    progressbar.style = "width: " + element[1].toString() + "%"

    progress.appendChild(progressbar);
    contAbility.appendChild(p);
    contAbility.appendChild(progress);
    abilities.appendChild(contAbility);
 });
var array = [['Java',70], ['HTML', 70], ['C++', 25], ['MySQL', 60],
['JavaScript', 70], ['Ux Design', 70], ['Google Scripts', 25], ['NodeJS', 25],
['CSS', 60], ['React', 45], ['Automation Testing', 70], ['Manual Testing', 70]];

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
var nav = document.querySelector('nav');
        var scrolleado = 0;
        var resize = 0;
        if (screen.width < 768) {
            nav.classList.add('navbar-custom', 'shadow', 'text-center');
            resize = 1;
        }
        window.addEventListener('scroll', function () {
            if (resize == 0) {
                if (window.pageYOffset > 100) {
                    nav.classList.add('navbar-custom', 'shadow', 'text-center');
                    scrolleado = 1;
                } else {
                    nav.classList.remove('navbar-custom', 'shadow', 'text-center');
                    scrolleado = 0;
                }
            }
        });
        window.addEventListener('resize', function () {
            if (scrolleado == 0) {
                if (screen.width < 768) {
                    nav.classList.add('navbar-custom', 'shadow', 'text-center');
                    resize = 1;
                } else {
                    nav.classList.remove('navbar-custom', 'shadow', 'text-center');
                    resize = 0;
                }
            }
        });
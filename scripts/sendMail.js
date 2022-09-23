(function () {
    'use strict'

    // Obtener todos los formularios a los que queremos aplicar estilos de validación de Bootstrap personalizados
    const form = document.getElementById('form');
    const btn = document.getElementById('btnOracion');
    const serviceID = 'service_s9j9gbm';
    const templateID = 'template_q04bcj6';


    form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!form.checkValidity()) {
            event.stopPropagation();
        }
        if (form.checkValidity()) {
            emailjs.sendForm(serviceID, templateID, this)
                .then(() => {
                    Swal.fire({
                        title: 'La consulta fue cargada con exito',
                        text: 'Alguien se pondra en contacto en la brevedad',
                        text: 'Que tengas un bendecido dia',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 2500
                    }
                    )
                    setInterval("location.reload()", 2500);
                }, (err) => {
                    alert(JSON.stringify(err));
                });
        }
        form.classList.add('was-validated');
    }, false)
    emailjs.init('02FlHZ_JBvO3lXJap');
})()
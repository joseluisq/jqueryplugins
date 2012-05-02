$(function(){
    $("#frm").xvalidator({
        tooltip: true,
        errorClass: "error",
        fields: {
            'txtname': {
                label: 'Votre nom & prénom*',
                rule: {
                    required: true
                },
                message: 'Veuillez indiquer votre nom & prénom.'
            },
            'txtemail': {
                label: 'Votre nom & prénom*',
                rule: {
                    required: true,
                    email: true
                },
                message: 'Veuillez indiquer votre nom & prénom.'
            },
            "option": {
                group: true,
                label: 'Votre nom & prénom*',
                rule: {
                    required: true,
                    email: true
                },
                message: 'Veuillez indiquer votre nom & prénom.'
            }
        },
        onSuccess: function(){
            alert("OK !");
        }
    });
});
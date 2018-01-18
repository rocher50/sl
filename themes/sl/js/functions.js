( function( $ ) {

    $( document ).ready( function() {
        var userSubmitButton = document.getElementById('user-submit-button');

        var adminAjax = function(formData, action) {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: screenReaderText.adminAjax,
                data: {
                    action: action,
                    data: formData,
                    submission: document.getElementById( 'xyq' ).value,
                    security: screenReaderText.security
                },
                success: function(response) {
                    if(true == response.success) {
                        alert('this was a success');
                    } else {
                        alert('this failed');
                    }
                },
                error: function(response) {
                    alert('there was an error');
                }
            });
        };

        userSubmitButton.addEventListener('click', function(event) {
            event.preventDefault();
            var formData = {
                'name' : document.getElementById('rsrv-user-name').value,
                'email' : document.getElementById('rsrv-user-email').value,
                'remarques' : document.getElementById('rsrv-remarques').value,
                'vcl' : document.getElementById('rsrv-vcl').value,
            };
            adminAjax(formData, 'process_user_generated_post');
        });
    });
} )( jQuery );

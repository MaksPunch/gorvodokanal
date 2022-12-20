(function($){
    $.fn.getFormData = function(){
      var data = {};
      var dataArray = $(this).serializeArray();
      for(var i=0;i<dataArray.length;i++){
        data[dataArray[i].name] = dataArray[i].value;
      }
      return data;
    }
})(jQuery);

var login = $('#login')
var password = $('#password')

let allFields = $( [] ).add(login).add(password); // поля формы для логина

function checkAdmin() {
    $.post('/admin/loginAdmin', {
        login: login.val(),
        password: password.val()
    }).success(function(data) {
        form[0].reset();
        allFields.removeClass( "ui-state-error" );
        dialog.dialog('close')
        if (data == true) {
            $('#checkAdmin').text('Админ')
            $('#checkAdmin').off();
            $('#checkAdmin').on('click', () => {
                window.location.href = '/admin'
            });
        }
        else if (data == 'Вы не админ') {
            $('#checkAdmin').text('Личный кабинет')
            $('#checkAdmin').off();
        }
        else (alert('user not found'))
    })
}

dialog = $( "#dialog-form" ).dialog({
    autoOpen: false,
    height: 300,
    width: 350,
    modal: true,
    buttons: {
      "Войти": checkAdmin,
      Cancel: function() {
        dialog.dialog( "close" );
      }
    },
    close: function() {
      form[ 0 ].reset();
      allFields.removeClass( "ui-state-error" );
    }
});

$( "#checkAdmin" ).button().on( "click", function() {
    dialog.dialog( "open" );
});

form = dialog.find('form').on('submit', function(e) {
    e.preventDefault();
    
    checkAdmin();
})
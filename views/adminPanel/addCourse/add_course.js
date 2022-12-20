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

$('input#createSection').on('click', function(e) {
  e.preventDefault()
  $('form#createSection').submit()
})
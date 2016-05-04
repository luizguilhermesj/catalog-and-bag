$(document).ready(function(){

  $(".bag-collapse").sideNav({
      menuWidth: '80%',
      edge: 'right'
    });

  $(document).on('size-selector.change', function(e){
        $(e.target).trigger('bag.add');
  });

});
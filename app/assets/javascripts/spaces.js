document.addEventListener("turbolinks:load", function() {

$(function(){

var querystring

  $.ajax({
    // ajax get of all the first inamges from each space
    url: "/images.json",
    method: 'GET',
    data: {},
    dataType: 'json'
  }).done(function(data){
    // image hash has the space id as the key and image location as the value
    var imgHash = data


    $.ajax({
      //ajax get for all the space information
      url: "/spaces.json",
      method: 'GET',
      data: {},
      dataType: 'json'
    }).done(function(data){
      var _allData = data
      // variables for all data that will need to be used outside of functions
      var city = 'all';
      var desks = 1;

      function populate(i) {
        // mimics the original html that gets cleared to repopulate the page with the correct information
        $("<div>").attr('id', i).attr('class', 'space-box').appendTo('.space-info')
          $('<p>').attr('class', 'space-price').html('$' + Number(_allData[i]['price']).toFixed(2)).appendTo("#" + i)
          $('<a>').attr('class', 'show-btn').attr('href', '/spaces/' + _allData[i]['id']).attr('id', 'first-a' + _allData[i]['id'] ).appendTo("#" + i)
            $('<div>').attr('class', 'space-hover').attr('id', 'second-d'+_allData[i]['id']).appendTo('#first-a' + _allData[i]['id'])
              $('<p>').attr('class', 'space-name').attr('id', 'third-p'+_allData[i]['id']).appendTo('#second-d'+_allData[i]['id'])
                $('<strong>').html(_allData[i]['name']).appendTo('#third-p'+_allData[i]['id'])
              $('<p>').attr('class', 'space-desks').html('Desks Available: ' + _allData[i]['available_desks']).appendTo('#second-d' +_allData[i]['id'])
        // anchor tag appends to space-box
            $('<a>').attr('class', 'show-btn').attr('href', '/spaces/' + _allData[i]['id']).attr('id', 'link' + _allData[i]['id']).appendTo("#" + i)
              $('<img>').attr('class','front-page-img').attr('src',  imgHash[parseInt(_allData[i]['id'])]).appendTo('#link' + _allData[i]['id'])
          $('#link' + _allData[i]['id']).wrap( "<div class='front-page-img-container' id = '" + (i) + "container' ></div>");
      }
  

      $('#city').change(function(event){
        _availableData = []
        city = this.value.toLowerCase();

        //clears the search results
        $('.space-info').html("")



        //loops through all data
        for(var i = 0, l = _allData.length; i < l; i++){


          var dataCity = _allData[i]['city'].toLowerCase();

          // if the cities are not all
          if (city != 'all'){


            // if the chosen city is equal to the city selected in the list and desks is not changed

            if(dataCity === city && desks === 1 ) {
              populate(i)
            }
            else if( dataCity === city && desks != 1 ){
              if(_allData[i]['available_desks'] >= desks){
                populate(i)
              }
            }
          }
          else{

            if(_allData[i]['available_desks'] >= desks){
              populate(i)
            }
          }
        }
      });

      $('#number-of-desks').change(function(event){
        desks = parseInt(this.value);

        $('.space-info').html("")

        for(var i = 0, l = _allData.length; i < l; i++){

          if (city != 'all'){

            if(_allData[i]['city'].toLowerCase() === city && _allData[i]['available_desks'] >= desks){

              populate(i);
            }
          }
          else{
            if(_allData[i]['available_desks'] >= desks){
              populate(i)
            }
          }
        }
       localStorage.setItem('desks', desks);
      });

      }).fail(function(data){
      console.log('this failed');

    });

      if($('div').is('.index-page')){
        localStorage.setItem('desks', 1);
      };
      if($('span').is('#total-price-value')){
        var loadDesks = localStorage.desks
        var price = $('span#pricenumber').text();
        var totalPrice = parseFloat(Math.round((loadDesks * price) * 100) / 100).toFixed(2)
        $('span#total-price-value').text(totalPrice);
      }
  });

 });


   function previewpic(env, tagid, selecttag, old=false){
     var files = event.target.files;
     var image = files[0]
     var reader = new FileReader();

     reader.onload = function(file){
       var img = new Image();
       console.log(file);
       img.src = file.target.result;
       if(!old){
         selecttag.html(img).attr('id', tagid).appendTo('#upload_pictures');
       }else{
         selecttag.html(img).attr('id', tagid);
       }
     }

     reader.readAsDataURL(image);
     console.log(files);
   };

 $('input[type=file]').on('change', function(event){
   number = parseInt($(this).attr('id').split('_')[3]);
   console.log(number);
   previewpic(event, $(this).attr('id'), $('div.imagetags').eq(number), true);
 });

 $('form').on('cocoon:after-insert', function(e, newthing){

   newthing.find('input[type=file]').on('change', function(event){

     previewpic(event, newthing.find('input[type=file]').attr('id'), $('<div>'));

   });

 });

$('form').on('cocoon:after-remove', function(e,removething){

  var fileid = removething.find('input[type=file]').attr('id');
  $('div#'+fileid).remove();


});

});

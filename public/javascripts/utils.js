(function(){

    $.pad = function(str, max) {
            str = str.toString();
            return str.length < max ? $.pad(str + "0", max) : str;
    };

    $.formatPrice = function(price) {
            return price.toFixed(2).replace('.',',');
    };

    $.imgNotLoaded = function(el) {
        $(el).attr('src', '/images/no-image.jpg');
    };

})();

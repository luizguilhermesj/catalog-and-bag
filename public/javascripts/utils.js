(function(){

    $.pad = function(str, max) {
            str = str.toString();
            return str.length < max ? $.pad(str + "0", max) : str;
    };

})();

(function($){
    var leader = ".leader";
    var addCount = 0;
    var leaveCount = 0;

    $(function() {
        setInterval($.loading.case,500);
    });

    $.loading ={
        case:function () {
            // var textNum = $(leader).text().length;
            // console.log(textNum);
            if(addCount < 3){
                $(leader).css('text-align', 'left');
                $.loading.add();
                addCount++;
                if(addCount > 2){
                    leaveCount = 0;
                }
            }else{
                $(leader).css('text-align', 'right');
                $.loading.leave();
                leaveCount++;
                if(leaveCount > 2){
                    addCount = 0;
                }
            }
            // console.log("add:"+addCount+"leave:"+leaveCount);
        },
        add:function() {
            // var text = $(leader).text();
            var output = "";
            for(var i = 0; i <= addCount; i++){
                output+= ".";
            }
            $(leader).text(output);
        },
        leave:function () {
            var output = "";
            for(var i = 0; i <= leaveCount; i++){
                output+= " ";
            }
            for(var i = output.length  ; i < 3; i++){
                output+= ".";
            }
            $(leader).text(output);
        },
    }

})(jQuery);

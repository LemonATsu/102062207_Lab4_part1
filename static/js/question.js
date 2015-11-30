var current_q;
var p_done = 0;
init_after_fb_load = function() {
    $('#publish_p').show();
}

function publish () {
    var content = $('#content').val();
    p_done = 0;
    checkLoginState(function(response) {
        if(response === 'connected') {
            postFB(content, function(response) {
                if(response === '-1') {
                    alert('post failed!');
                } else {
                    current_q =response;
                    postUserData(response, function() {
                        p_done += 1;
                        redirectIfDone(p_done);
                    });
                    postQuestionData(response, response, content, function() {
                        p_done += 1;
                        redirectIfDone(p_done);
                    });
                }
            });
        }
    });
}

function redirectIfDone(flag) {
    if(p_done == 2) {
        window.location = host_base + 'result/' + current_q;
        console.log(current_q);
    }
}
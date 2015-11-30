var fb_api = '1006134876074026';
var user_accessToken = '';
var fb_id;
var init_after_fb_load;

window.fbAsyncInit = function() {
    FB.init({
        appId      : fb_api,
        xfbml      : true,
        version    : 'v2.5'
    });
    checkLoginState();
    if(init_after_fb_load)
        init_after_fb_load();
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function checkLoginState(callback) {
    FB.getLoginStatus(function(response) {
        if(response.status === 'connected') {
            user_accessToken = response.authResponse.accessToken;
            fb_id = response.authResponse.userID;
        }

        if(callback)
            callback(response.status);
    });
}

function popFBLogin(callback) {
    FB.login(function(response) {
        var result = 'unknown';
        if(response.authResponse) {
            result = 'connected';
            user_accessToken = response.authResponse.accessToken;
            fb_id = response.authResponse.userID;
        } 
        if(callback)
            callback(result);
    });
}

function postFB(content, callback) {
    FB.api('/me/feed', 'post', { message: content}, function(response) {
        var result;
        if (!response || response.error) {
            result = '-1';
        } else {
            result = response.id;
        }
        console.log(result);
        if(callback)
            callback(result);
    });
}

function getProfilePic(id, callback) {
    FB.api('/' + id + '/?fields=picture', function(response) {
        console.log(response);
        if(callback)
            callback(response);
    });
}

function getFBComment(pid, callback) {
    FB.api('/' + pid + '/comments?fields=likes.summary(true)&access_token=' + user_accessToken, 'get', function (response) {
        if(!response.data) {
            alert('error ocurred');
            return;
        }
        var likes = response.data;
        FB.api('/' + pid + '/comments', function(response) {
            if(!response.data) {
                alert('error ocurred');
                return;
            }
            var c_list = [];
            var com = response.data;
            for(var i = 0; i < com.length; i ++) {
                var new_com = {id: com[i].from.id, msg : com[i].message, likes : likes[i].likes.summary.total_count};
                c_list.push(new_com);
            }
            local_comment_list[fb_id] = c_list;
            if(callback)
                callback();
        });
    });
}

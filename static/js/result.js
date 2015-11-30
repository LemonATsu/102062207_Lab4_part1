var pid;
var qid;
var title;
init_after_fb_load = function () {
    qid = window.location.pathname.split('result/')[1];
    console.log(qid);
    if(qid === '')
        return;
    requestQuestionData(qid, function(response) {
        pid = q_share_list[fb_id];
        if(response.row)
            title = response.row[1];
        getFBComment(pid, function() {
            postDBCommentsData(qid, function() {
                $('#msg_title p:first').html(title);
                showComments();
            });
        });
    });
}

function showComments() {
    processed_comment_list = processList();
    for(var i = 0 ; i < processed_comment_list.length; i ++) {
        var data  = processed_comment_list[i];
        createCommentsDiv(data.msg, data.likes, data.id);
    }
    $('#msg_container').show();
};


function processList() {
    var p_list = [];
    for(key in db_comment_list) {
        var l_list = db_comment_list[key];
        for(var i = 0; i < l_list.length; i ++) {
            p_list.push(l_list[i]);
        }
    }

    p_list.sort(function(a, b) {
        return a.likes < b.likes;
    });

    return p_list;
}

// user id
function createCommentsDiv(c, l, uid) {
    var comment = document.createElement('div');
    var comment_head = document.createElement('div');
    var img = document.createElement('img');
    var comment_content = document.createElement('div');
    var like_count = document.createElement('div');
    comment.className = 'comment';
    comment_head.className = 'comment_head';
    comment_content.className = 'comment_content';
    like_count.className = 'like_count';
    comment_content.innerHTML = c;
    like_count.innerHTML = l;
    img.setAttribute('src', '');
    comment_head.appendChild(img);
    comment.appendChild(comment_head);

    comment.appendChild(like_count);
    comment.appendChild(comment_content);
    $('#msg_container').append(comment);

    getProfilePic(uid, function(response) {
            img.setAttribute('src', response.picture.data.url);
    });
}
/*
<div class="comment">
    <div class="comment_head">
        <img src="../static/img/ic_feedback_white_48dp_1x.png">
    </div>
    <div class="comment_content"> result
    </div>
    <div class="like_count">10
    </div>
 </div>
*/
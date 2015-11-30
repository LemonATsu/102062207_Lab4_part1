var sheet_script ='https://script.google.com/macros/s/AKfycbxRdYPcX7bLtzfO4lz1rSF7Ud3tEzPmDEOQGSWXwwLIUmlqdkg/exec';
var host_base = 'http://localhost:5000/';
var questions = [];
var comment_list = new Object();
var local_comment_list = new Object();
var db_comment_list = new Object();
var post_list = new Object();
var q_share_list = new Object();
var processed_comment_list = [];

function requestDB(param, callBack) {
    request = $.ajax({
        url : sheet_script,
        dataType:'jsonp',
        data: param,
        success: function(response) {
            if(callBack)
                callBack(response);
        }
    });
}

function requestUserData(callBack) {
    param = {type: 'get', sheet: 'uid', id: fb_id, callback: 'ret'};
    requestDB(param, function(response) {
        if(response.row) {
            console.log(response.row[1]);
            questions = response.row[1].split(',');
            if(callBack) {
                callBack();
            }
        }
    });
}

function postUserData(new_q, callBack) {

    requestUserData(function () {
        questions.push(new_q);
        console.log('hello');
        param = {type: 'post', sheet: 'uid', questions: questions.toString(), id: fb_id, callback: 'ret'};
        requestDB(param, function(response) {
            console.log(response);
            if(callBack)
                callBack(response);
        });
    });
}

function requestQuestionData(qid, callBack) {
    param = {type: 'get', sheet: 'qsheet', id: qid, callback: 'ret'};
    requestDB(param, function(response) {
        if(response.row) {
            console.log(response);
            q_share_list = JSON.parse(response.row[2]);
            console.log(q_share_list);
        }
        if(callBack)
            callBack(response);
    });
}

function postQuestionData(qid, pid, content, callBack) {
    requestQuestionData(qid, function(response) {
        q_share_list[fb_id] = pid;
        param = {type: 'post', sheet: 'qsheet', title: content, post_list: JSON.stringify(q_share_list), id: qid, callback: 'ret'};
        requestDB(param, function(response) {
            console.log(response);
            if(callBack)
                callBack(response);
        });        
    });
}


function requestDBCommentsData(qid, callBack) {
    param = {type: 'get', sheet: 'qcom', id: qid, callback: 'ret'};
    requestDB(param, function(response) {
        if(response.row) {
            db_comment_list = JSON.parse(response.row[1]);
        } else {
            alert('error occured');
        }
        if(callBack)
            callBack(response);
    }); 
}

function postDBCommentsData(qid, callBack) {
    requestDBCommentsData( qid,function() {
        if(local_comment_list[fb_id].length > 0)
            db_comment_list[fb_id] = local_comment_list[fb_id];
        console.log(db_comment_list);
        param = {type: 'post', sheet: 'qcom', id:qid, comment_list : JSON.stringify(db_comment_list)};
        requestDB(param, function(response) {
            if(callBack)
                callBack(response);
        });
    });
}

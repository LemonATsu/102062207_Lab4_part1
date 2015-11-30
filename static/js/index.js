function clickAsk () {
    checkLoginState(function(response) {
        console.log(response);
        if(response === 'connected') {
            directToResult();
        } else {
            popFBLogin(function(response) {
                if(response ==='connected') {
                    directToResult();
                } else {
                    alert('not logged in!');
                }
            });
        }
    });
}

function clickResult() {

}

function directToResult() {
    window.location += 'question';
}
// fork from https://github.com/YangHanqing/yanghanqing.github.io
$(document).ready(function () {
    setComment();
})

function getIssuesUrl() {
    var user = $('meta[name="author"]').attr("content");
    var issueId = $('meta[name="message_board_issue_id"]').attr("content");
    return 'https://api.github.com/repos/' + user + '/' + user + '.github.io/issues/' + issueId + '/comments';
}

function setComment() {
    var issuesUrl = getIssuesUrl();

    $("#commentsList").removeAttr('data_comments_url');
    $("#tips").html("我们不会获取您的用户名和密码,评论直接通过 HTTPS 与 Github API交互,<br>如果您开启了两步验证,请在博客的<a  target=\"_blank\" href=\"" + issuesUrl + "\">Github issues</a>下添加留言");

    $("#comments").show();
    $("#commentsList").children().remove();
    $("#commentsList").removeAttr('data_comments_url');
    $('#commentsList').attr("data_comments_url", issuesUrl);
    $('#commentsList').children().remove();

    $.getJSON(issuesUrl, function (json) {
        for (var i = 0; i < json.length; i++) {
            var avatar_url = json[i].user.avatar_url; // avatar_url
            var user = json[i].user.login;
            //var updated_at = json[i].updated_at;
            var updated_at = new Date(json[i].updated_at).toLocaleString();
            var body = json[i].body;

            // add blog list elements
            var commentHtml =
                "<li class=\"comment\">" +
                "<a class=\"pull-left\" href=\"#\"><img class=\"avatar\" src=\"" + avatar_url +
                "\" alt=\"avatar\"></a><div class=\"comment-body\"><div class=\"comment-heading\"><h4 class=\"user\">" + user +
                "</h4><h5 class=\"time\">" + updated_at +
                "</h5></div><p>" + body +
                "</p></div></li>";

            var new_obj = $(commentHtml);
            // 评论倒叙
            $('#commentsList').prepend(new_obj);
        }
    });
}

function login() {
    $('#myModal').modal();
}

function subComment() {
    var USERNAME = $("#txt_username").val();
    var PASSWORD = document.getElementById("txt_password").value;
    // console.log("准备提交评论");
    var issueURL = $("#commentsList").attr("data_comments_url");
    var comment = $("#comment_txt").val();
    var commentJson = "{\"body\": \"" + comment + "\"}";
    // console.log(comment);
    if (comment == "") {
        alert("评论不能为空");
        return;
    }

    $.ajax({
        type: "POST",
        url: issueURL,
        dataType: 'json',
        async: false,
        headers: {
            "Authorization": "Basic " + btoa(USERNAME + ":" + PASSWORD)
        },
        data: commentJson,
        success: function () {
            // 更新评论区
            setComment();

            $("#comment_txt").val('');
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("账号密码错误,或者开启了两步验证");
        }
    });
}
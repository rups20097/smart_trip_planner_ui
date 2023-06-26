$('#submitButt').click(function () {
    $(this).toggleClass('active');
});
$(function () {
    $("#test").focus();
    sessionStorage.setItem('sessionId', Math.floor(Math.random() * 37 ))
});
document.querySelector('.floating-btn').addEventListener('click', function (e) {
    e.target.closest('button').classList.toggle('clicked');
});

function myFunction() {
    var x = document.getElementById("myDIV");
    console.log(x);
    console.log(x.classList.contains('open'));
    if (x.classList.contains('open')) {
        x.classList.remove("open");
    } else {
        x.classList.add("open");
        $("#chatroom_box").animate({ scrollTop: $('#chatroom_box').height() });
    }
}


function send_text() {
    if ($('#text_typed').val() !== '') {
        let query = $('#text_typed').val();
        $('#chatroom_box').append(`
            <li class="user_text">${query}</li>
        `)
        $('#text_typed').val('');

        let data = {
            "queryText": query,
            "sessionId": sessionStorage.getItem('sessionId')
        };

        $.ajax({
            type: "POST",
            url: "http://localhost:3000/test",
            data: JSON.stringify(data),// now data come in this function
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
            },
            dataType: "json",
            success: function (data, status, jqXHR) {
                $('#chatroom_box').append(`
                    <li class="bot_text">${data.text}</li>
                `)
            },

            error: function (jqXHR, status) {
                // error handler
                console.log(jqXHR);
                alert('fail' + status.code);
            }
         });

    }
}

document.getElementById("text_typed").addEventListener("keyup", function(e) {
        if (e.key === 'Enter') {
            document.getElementById("send_button").click();
        }
    });
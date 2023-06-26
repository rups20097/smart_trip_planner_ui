$('#submitButt').click(function () {
    $(this).toggleClass('active');
});
$(function () {
    $("#test").focus();
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
        $('#chatroom_box').append(`
            <li class="user_text">${$('#text_typed').val()}</li>
        `)
        $('#text_typed').val('');
    }
}

document.getElementById("text_typed").addEventListener("keyup", function(e) {
        if (e.key === 'Enter') {
            document.getElementById("send_button").click();
        }
    });
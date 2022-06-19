const dn = document.querySelector('.btn-dn')
const dk = document.querySelector('.btn-dk')
var url = "https://account.loc22.club";
dn.onclick = () => {
    dn.src = '/Content/img/2_dn_active.png'
    dk.src = '/Content/img/1_dk_off.png'
    dk.classList.add('active')
    dn.classList.add('active')




    document.querySelector('.confirm-pass').classList.add('hide')
    document.querySelector('.nhanngay').src = '/Content/img/Button dangnhap.png'
    document.querySelector('.nhanngay').setAttribute('onclick', 'Login()'); // for FF

}
dk.onclick = () => {
    dn.src = '/Content/img/2_dangnhao_off.png'
    dk.src = '/Content/img/1_dk_active.png'
    dk.classList.remove('active')
    dn.classList.remove('active')

    document.querySelector('.confirm-pass').classList.remove('hide')
    document.querySelector('.nhanngay').src = '/Content/img/Button nahn 100k.png'
    document.querySelector('.nhanngay').setAttribute('onclick', 'Register()'); // for FF


}

$(document).ready(function () {
    // call api info để lấy thông tin user

    document.querySelector('.nhanngay').setAttribute('onclick', 'Register()');
    var token = readCookie("GameToken");
    if (token != null) {
        var settings = {
            "url": url + "/api/AccountGame/GetAccountInfo?Access_Token=" + token,
            "method": "GET",
            "timeout": 0,
        };

        $.ajax(settings).done(function (response) {
            console.log(response);
            if (response.ResponseCode == 1) { // success


                $('.info-me').show();
                $(".form").empty();
                $(".info-me").css("display", "block;");
                $(".info-me").addClass("form");
                $("#form-main").addClass("remove");
                $("#form-main").css("display", "none !important;");
                var acc = response.AccountInfo.AccountName;
                if (acc != '' && acc != null) {
                    $('#account-name').text(acc);
                }
                else {
                    $('#account-name').text(response.AccountInfo.AccountUserName);
                }


                var x = response.AccountInfo.Balance;
                x = x.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
                $('#account-value').text(x);
            }
            else if (response.ResponseCode == -1001) { // chưa login 
                $('.info-me').hide();
                $(".info-me").css("display", "none;");
                $("#form-main").css("display", "block !important;");

            }

        });
    }

    $('.info-me').hide();


});

function Register() {
    var _user = $('#UserName').val();
    var _pass = $('#PassWord').val();
    var _Repass = $('#RePassword').val();
    if (_user == '' || _pass == '' || _Repass == '') {
        alert("Thông tin không được bỏ trống, vui lòng kiểm tra lại!");
        return;
    }
    if (_pass != _Repass) {
        alert("Mật khẩu không trùng khớp, vui lòng kiểm tra lại!");
        return;
    }
    var settings = {
        "url": url+"/api/AccountGame/Register",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "LoginType": 1,
            "UserName": _user,
            "Password": _pass,
            "DeviceId": "2740f64f-70b0-432c-b962-990316b14d4c",
            "PrivateKey": "89b9677d90ef4063d5b6887c5f9cb3ed27b5c3adeae874e1055151b8bc597dbf",
            "Captcha": "J7P",
            "DeviceType": 1,
            "IsLanding": false,
            "ReferUrl": "https://sieuno686.win/"
        }),
    };

    $.ajax(settings).done(function (response) {
        console.log(response);
        if (response.ResponseCode == 1) { // success
            createCookie('GameToken', response.Token, 100);
            alert("Đăng ký thành công");
            // location.reload();
            window.location = "/home/success?url=" + url + "&token=" + response.Token + "";
        }
        else {
            alert("Có lỗi trong quá trình xử lý, vui lòng thử lại");
        }
    });
}

function Login() {
    var _user = $('#UserName').val();
    var _pass = $('#PassWord').val();
    if (_user == "" || _pass == "" || _user == '' | _pass == '') {
        alert("Tài khoản và mật khẩu không để trống");
        return;
    }

    // login 
    var settings = {
        "url": "https://account.loc22.club/api/AccountGame/Login",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "LoginType": 1,
            "UserName": _user,
            "Password": _pass,
            "DeviceId": "2740f64f-70b0-432c-b962-990316b14d4c",
            "DeviceType": 1
        }),
    };

    $.ajax(settings).done(function (response) {
        if (response.ResponseCode == 1) { // success
            eraseCookie('GameToken');
            createCookie('GameToken', response.Token, 100);
            $('.info-me').show();
            $(".form").empty();
            $(".info-me").css("display", "block;");
            $(".info-me").addClass("form");
            $("#form-main").addClass("remove");
            $("#form-main").css("display", "none !important;");
            location.reload();

        }
        else {

        }
    });



}


function createCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

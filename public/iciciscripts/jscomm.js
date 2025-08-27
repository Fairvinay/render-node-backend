

PostForm = function (linkUrl, _form, displaydiv, othjsonpara) {
    var postdate = serializeJSON(_form);
    if (othjsonpara != undefined || othjsonpara != null) {
        postdate = $.extend({}, postdate, othjsonpara);
    }
    console.log(" postDate "+JSON.stringify(postdate))
    $.ajax({
        type: "POST",
        url: linkUrl,
        data: postdate,
        datatype: "json",
        async: true,
        success: function (data, status) {
            if (displaydiv != undefined || displaydiv != null) {
                $(displaydiv).html(data);
            }
        },
        error: function (data, e) {
            alert(data.statusText);
            if ($('#txtPass').length > 0) {
                $('#txtPass').val('');
            }
        },
        complete: function (data, e) {

        }
    });
}
ShowPositions = function (fnourl, _form, displaydiv, othjsonpara) {
    $.ajax({
        type: "GET",
        url: fnourl,
        async: true,
        success: function (data, status) {

            console.log(" data "+JSON.stringify(data));
            if (displaydiv != undefined || displaydiv != null) {
                $(displaydiv).html(data);

            }
            else {
                console.log(" div postionsfno not found ")
            }
        },
        error: function (data, e) {
	    //  alert(data.statusText);
            if (displaydiv != undefined || displaydiv != null) {
                $(displaydiv).html(JSON.stringify(data));
            }
            console.log(" data "+JSON.stringify(data));
            e.preventDefault();
            e.stopPropogation();
        },
        complete: function (data, e) {

        }
    });

}

function serializeJSON(_form) {
    var json = {}; var form; if (_form == undefined) { form = $("#frm"); } else { form = _form; }
    form.find('input, select, textarea').each(function () {
        var val;
        if (!this.id) return;
        if ('radio' === this.type) {
            if (json[this.id]) { return; }

            json[this.id] = this.checked ? this.value : '';
        } else if ('checkbox' === this.type) {
            val = json[this.id];
            if (!this.checked) {
                if (!val) { json[this.id] = ''; }
            } else {
                json[this.id] =
                typeof val === 'string' ? [val, this.value] :
                $.isArray(val) ? $.merge(val, [this.value]) :
                 this.value;
            }
        } else {
            json[this.id] = this.value;
        }
    });
    return json;
}

function EmptyCheck(_val, curobj, fieldname) {
    if (_val.trim() == "" || ($(curobj).attr('watermarktext') != undefined && _val == $(curobj).attr('watermarktext').trim())) {
        alert("The " + fieldname + " field is empty. Please " + ($(curobj).is('select') ? "select" : "enter") + " the " + fieldname + ".");
        $(curobj).val('');
        $(curobj).focus();
        return false;
    }
    if (_val.match("^ ")) {
        alert("The " + fieldname + " field should not start with space. Please " + ($(curobj).is('select') ? "select" : "enter") + " the " + fieldname + ".");
        $(curobj).val('');
        $(curobj).focus();
        return false;
    }
    return true;
}

function OnlyAlphabets(_val, curobj, fieldname) {
    if (_val == '') { return true; }
    var vonlychar = /^[a-zA-Z ]+$/;
    if (!_val.match(vonlychar)) {
        alert(fieldname + " field accepts only alphabetic characters.");
        $(curobj).val('');
        $(curobj).focus();
        return false;
    }
    return true;
}

function OnlyNumberWithRange(_val, curobj, fieldname, range) {
    if (_val == "") { return true; }
    var vonlychar = /^[0-9]+$/;
    var limitrng = range.split(',');
    var alermsg = '';
    if (!_val.match(vonlychar)) {
        if ($(curobj).attr('invalidmsg') !== undefined) {
            alert($(curobj).attr('invalidmsg'));
        }
        else {
            alert(fieldname + " field accepts only numeric characters.");
        }
        $(curobj).val('');
        $(curobj).focus();
        return false;
    }
    else {
        if (parseFloat(_val) < parseFloat(limitrng[0]) || parseFloat(_val) > parseFloat(limitrng[1])) {
            if ($(curobj).attr('invalidmsg') !== undefined) {
                alert($(curobj).attr('invalidmsg'));
            }
            else {
                alert("\nThe " + fieldname + " field  should be between " + limitrng[0] + " to " + limitrng[1]);
            }
            $(curobj).focus();
            return false;
        }

    }
    return true;
}

function OnlyNumber(_val, curobj, fieldname) {
    if (_val == '') { return true; }
    var vonlychar = /^[0-9]+$/;
    var alermsg = '';
    if (!_val.match(vonlychar)) {
        if ($(curobj).attr('invalidmsg') !== undefined) {
            alert($(curobj).attr('invalidmsg'));
        }
        else {
            alert(fieldname + " field accepts only numeric characters.");
        }
        $(curobj).val('');
        $(curobj).focus();
        return false;
    }
    return true;
}

function CheckPositiveNumber(_val, curobj, fieldname) {
    if (_val == '') { return true; }
    if (OnlyNumber(_val, curobj, fieldname)) {
        var _num = parseFloat(_val);
        if (_num < 0) {
            if ($(curobj).attr('invalidmsg') !== undefined) {
                alert($(curobj).attr('invalidmsg'));
            }
            else {
                alert(fieldname + " field accept positive number");
            }
            $(curobj).val('');
            $(curobj).focus();
            return false;
        }
    }
    else {
        return false;
    }
    return true;
}

function CheckMoreThanZero(_val, curobj, fieldname) {
    if (_val == '') { return true; }
    var vonlychar = /^[0-9]+.[0-9]{0,9}$/;
    var vonlynum = /^[0-9]+$/;
    var isValid = false;
    if (_val.match(vonlynum)) {
        isValid = true;
    }
    else {
        if (_val.match(vonlychar)) { isValid = true; } else {
            isValid = false;
        }
    }
    if (isValid == true) {
        var _num = parseFloat(_val);
        if (_num <= 0) {
            if ($(curobj).attr('invalidmsg') !== undefined) {
                alert($(curobj).attr('invalidmsg'));
            }
            else {
                alert(fieldname + " field accept numeric value greater then zero.");
            }
            $(curobj).val('');
            $(curobj).focus();
            return false;
        }
    }
    else {
        if ($(curobj).attr('invalidmsg') !== undefined) {
            alert($(curobj).attr('invalidmsg'));
        }
        else {
            alert(fieldname + " field accept numeric value greater then zero.");
        }
        $(curobj).val('');
        $(curobj).focus();
        return false;
    }
    return true;
}

function OnlyNumberWithTwoDecimal(_val, curobj, fieldname) {
    if (_val == '') { return true; }
    var vonlychar = /^[0-9]+.[0-9]{1,2}$/;
    var vonlynum = /^[0-9]+$/;
    var alermsg = '';
    if (_val.match(vonlynum)) { return true; }
    else {
        if (_val.match(vonlychar)) { return true; }
        else {
            if ($(curobj).attr('invalidmsg') !== undefined) {
                alert($(curobj).attr('invalidmsg'));
            }
            else {
                ////alert(fieldname + " should not have more than two digits after decimal.");
                alert(fieldname + " field accepts only numeric characters with 2 decimal value.");
            }
            //// $(curobj).val('');
            $(curobj).focus();
            return false;
        }
    }

    //    if (!_val.match(vonlynum) || !_val.match(vonlychar)) {
    //        if ($(curobj).attr('invalidmsg') !== undefined) {
    //            alert($(curobj).attr('invalidmsg'));
    //        }
    //        else {
    //            alert(fieldname + " should not have more than two digits after decimal.");
    //        }
    //        $(curobj).val('');
    //        $(curobj).focus();
    //        return false;
    //    }
    return true;
}

function OnlyNumberWithFourDecimal(_val, curobj, fieldname) {
    if (_val == "") { return true; }
    var vonlychar = /^[0-9]+.[0-9]{1,4}$/;
    var vonlynum = /^[0-9]+$/;
    var alermsg = '';
    if (_val.match(vonlynum)) { return true; }
    else {
        if (_val.match(vonlychar)) { return true; }
        else {
            if ($(curobj).attr('invalidmsg') !== undefined) {
                alert($(curobj).attr('invalidmsg'));
            }
            else {
                ////alert(fieldname + " should not have more than two digits after decimal.");
                alert(fieldname + " field accepts only numeric characters with 4 decimal value.");
            }
            //// $(curobj).val('');
            $(curobj).focus();
            return false;
        }
    }
    return true;
}

function OnlyAlphaNumeric(_val, curobj, fieldname) {
    if (_val == '') { return true; }
    var vonlynum = /^[0-9]+$/;
    var vonlychar = /^[a-zA-Z ]+$/;
    var vnumchar = /^[0-9a-zA-Z ]+$/;
    var alermsg = '';
    if ((!_val.match(vonlynum)) && (!_val.match(vonlychar)) && (!_val.match(vnumchar))) {
        if ($(curobj).attr('invalidmsg') !== undefined) {
            alert($(curobj).attr('invalidmsg'));
        }
        else {
            alert(fieldname + " field accepts Alpha Numeric characters.");
        }
        $(curobj).val('');
        $(curobj).focus();
        return false;
    }
    return true;
}

function AlphaNumericNoSpace(_val, curobj, fieldname) {
    if (_val == '') { return true; }
    var vonlynum = /^[0-9]+$/;
    var vonlychar = /^[a-zA-Z]+$/;
    var vnumchar = /^[0-9a-zA-Z]+$/;
    var alermsg = '';
    if ((!_val.match(vonlynum)) && (!_val.match(vonlychar)) && (!_val.match(vnumchar))) {
        if ($(curobj).attr('invalidmsg') !== undefined) {
            alert($(curobj).attr('invalidmsg'));
        }
        else {
            alert(fieldname + " field accepts Alpha Numeric characters.");
        }
        $(curobj).val('');
        $(curobj).focus();
        return false;
    }
    return true;
}

function OnlyMaxLimit(_val, curobj, fieldname, maxlmit) {
    if (_val == '') { return true; }
    if (_val.length != maxlmit) {
        if ($(curobj).attr('invalidmsg') !== undefined) {
            alert($(curobj).attr('invalidmsg'));
        }
        else {
            alert(fieldname + " should be " + maxlmit + " characters.");
        }
        $(curobj).val('');
        $(curobj).focus();
        return false;
    }
    return true;
}

function ChkLengthLimit(_val, curobj, fieldname, maxlmit) {
    if (_val == '') { return true; }
    var limitrng = maxlmit.split(',');
    if (_val.length < limitrng[0] || _val.length > limitrng[1]) {
        if ($(curobj).attr('invalidmsg') !== undefined) {
            alert($(curobj).attr('invalidmsg'));
        }
        else {
            alert("\nThe " + fieldname + " field  should not be less than " + limitrng[0] + " characters and more than " + limitrng[1] + " characters. Please re-enter " + fieldname)
        }
        $(curobj).val('');
        $(curobj).focus();
        return false;
    }
    return true;
}

function ValidateMobile(_val, curobj, fieldname) {
    if (_val.substr(0, 1) == "0") {
        if ($(curobj).attr('invalidmsg') !== undefined) {
            alert($(curobj).attr('invalidmsg'));
        }
        else {
            alert("Please enter your 10 digit mobile number.");
        }
        $(curobj).val('');
        $(curobj).focus();
        return false;
    }
    return true;
}

function validateEmail(_val, curobj, fieldname) {
    var emailRegex = '^[A-Za-z0-9._-]+@[A-Za-z0-9-.]+.[A-Za-z.]{2,6}$';
    if (!_val.match(emailRegex)) {
        if ($(curobj).attr('invalidmsg') !== undefined) {
            alert($(curobj).attr('invalidmsg'));
        }
        else {
            alert("Invalid Email Address");
        }
        $(curobj).val('');
        $(curobj).focus();
        return false;
    }
    return true;
}

function IsStartWithZero(_val, curobj, fieldname) {
    if (_val.substr(0, 1) == "0") {
        if ($(curobj).attr('invalidmsg') !== undefined) {
            alert($(curobj).attr('invalidmsg'));
        }
        else {
            alert(fieldname + " should starts with non-zero.");
        }
        $(curobj).val('');
        $(curobj).focus();
        return false;
    }
    return true;
}

function validateUserId(_val, curobj, fieldname) {
    var uidRegex = /^[0-9a-zA-Z@.\-_#]+$/;
    if (!_val.match(uidRegex)) {
        if ($(curobj).attr('invalidmsg') !== undefined) {
            alert($(curobj).attr('invalidmsg'));
        }
        else {
            alert('User Id contains invalid characters. Please re-enter the User Id');
        }
        $(curobj).val('');
        $(curobj).focus();
        return false;
    }
    return true;
}

function validatePass(_val, curobj, fieldname) {
    debugger;
    if (_val == '') { return true; }
    var vonlynum = /^[0-9]+$/;
    var vonlychar = /^[a-zA-Z]+$/;
    var vonlyspecchar = /^[!@#\$%\^&\*\(\)]+$/;
    var vvalidpass = /^[0-9a-zA-Z!@#\$%\^&\*\(\)]+$/;
    if (_val.match(vonlychar)) {
        alert("\n Atleast One character in the " + fieldname + " should be Numeric\n Please re-enter " + fieldname);
        $(curobj).val('');
        $(curobj).focus();
        return false;
    }
    if (_val.match(vonlynum)) {

        alert('\n Password should contain at least one alphabet (a,b...z), (A,B...Z).Please re enter password.');
        $(curobj).val('');
        $(curobj).focus();
        return false;
    }
    if (_val.match(vonlyspecchar)) {

        alert('\n The password should be alphanumeric, and preferably should have one special character [ !@#$%^&*() ]');
        $(curobj).val('');
        $(curobj).focus();
        return false;
    }
    if (!_val.match(vvalidpass)) {

        alert('\n The password should be alphanumeric, and preferably should have one special character [ !@#$%^&*() ]');
        $(curobj).val('');
        $(curobj).focus();
        return false;
    }
    return true;
}

function callValidationChk(validObj) {
    var rettype = true;
    var validatestr = $(validObj).attr('validationchk');
    var validType = validatestr.split(' ');
    for (var i = 0; i < validType.length; i++) {
        if (validType[i].indexOf("[") > -1) {
            var otherpara = validType[i].substr((validType[i].indexOf("[") + 1), ((validType[i].indexOf("]")) - (validType[i].indexOf("[") + 1)));
            rettype = eval(validType[i].substr(0, (validType[i].indexOf("["))) + "('" + $(validObj).val() + "',$(validObj),'" + $(validObj).attr('fieldname') + "','" + otherpara + "')");

        } else {
            rettype = eval(validType[i] + "('" + $(validObj).val() + "',$(validObj),'" + $(validObj).attr('fieldname') + "')");
        }
        if (!rettype) { return false; }
    }
    return rettype;
}

function ValidatePAN(_val, curobj, fieldname) {
    if (_val == '') { return true; }
    var panRegex = /^([a-zA-Z]{5})(\d{4})([a-zA-Z]{1})$/;
    if (!_val.match(panRegex)) {
        if ($(curobj).attr('invalidmsg') !== undefined) {
            alert($(curobj).attr('invalidmsg'));
        }
        else {
            alert('Invalid Pan Number');
        }
        $(curobj).val('');
        $(curobj).focus();
        return false;
    }
    return true;
}

function IsValidDate(_val, curobj, fieldname) {
    var regex = new RegExp("([0-9]{4}[-|/](0[1-9]|1[0-2])[-|/]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-|/](0[1-9]|1[0-2])[-|/][0-9]{4})");
    if (!regex.test($(curobj).val())) {
        if ($(curobj).attr('invalidmsg') !== undefined) {
            alert($(curobj).attr('invalidmsg'));
        }
        else {
            alert('Invalid Date.');
        }
        $(curobj).val('');
        $(curobj).focus();
        return false;
    }
    return true;
}
function CompareDate(Date1, Date2, alerttext) {
    var strfrmdt = $(Date1).val().split('/');
    var strtodt = $(Date2).val().split('/');
    var frmdt = new Date(strfrmdt[2], strfrmdt[1], strfrmdt[0]);
    var tdt = new Date(strtodt[2], strtodt[1], strtodt[0]);
    if (frmdt > tdt) {
        alert(alerttext);
        return false;
    }
    return true;
}

CompareValue = function (objValue1, objValue2, CompareType, alerttext) {
    var _v1 = parseFloat($(objValue1).val());
    var _v2 = parseFloat($(objValue2).val());
    if (_v1 == NaN || _v2 == NaN) { return true; }
    var msg = '';
    if (alerttext == undefined || alerttext == '') {
        msg = $(objValue2).attr('fieldname') + ' cannot be greater than or equal to ' + $(objValue1).attr('fieldname');
    } else { msg = alerttext; }
    if (CompareType.toUpperCase() == "G" && _v1 <= _v2) {
        alert(msg);
        $(objValue2).focus();
        return false;
    }
    else if (CompareType.toUpperCase() == "L" && _v1 >= _v2) {
        alert(msg);
        $(objValue2).focus();
        return false;
    }
    return true;
}

CheckFormValidation = function (maindiv) {
    var isValidData = true;
    $(maindiv).find("input[validationchk]:visible, select[validationchk]:visible").each(function () {
        if ($(this).is(':disabled') == false) {
            if (!callValidationChk($(this))) { isValidData = false; return false; }
        }
    });
    return isValidData;
}

GetDateType = function (_valdt) {
    var regex = new RegExp("([0-9]{4}[-|/](0[1-9]|1[0-2])[-|/]([0-2]{1}[0-9]{1}|3[0-1]{1})|([0-2]{1}[0-9]{1}|3[0-1]{1})[-|/](0[1-9]|1[0-2])[-|/][0-9]{4})");
    if (!regex.test(_valdt)) {
        alert('Invalid Date');
        return false;
    }
    var splitdt = _valdt.split('/');
    //var validDT = [splitdt[0], months[splitdt[1]], splitdt[2]].join('/');
    var validDT = [splitdt[2], months[splitdt[1]], splitdt[0]].join('/');
    return new Date(validDT);
}

CheckFutureDate = function (_val, curobj, fieldname) {
    if (_val == '') { return true; }
    var _dt = GetDateType(_val);
    var today = new Date();
    if (_dt > today) {
        if ($(curobj).attr('invalidmsg') !== undefined) {
            alert($(curobj).attr('invalidmsg'));
        }
        else {
            alert(fieldname + " cannot be greater than todays date.");
        }
        $(curobj).val('');
        $(curobj).focus();
        return false;
    }
    return true;
}

CheckIsMinor = function (_val, curobj, fieldname) {
    if (_val == '') { return true; }
    var _dt = GetDateType(_val);
    var today = new Date();
    var _diffyr = diff_years(today, _dt);
    if (_diffyr < 18) {
        return true;
    }
    return false;
}

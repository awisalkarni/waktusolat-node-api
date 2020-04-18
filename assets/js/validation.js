// Developed by: Ilham, 2014

/*
Documentation

##Initialize object form##
var objForm = new validation($('#form-id'));

##Field validation attributes##

# lammin
usage:
lammin="5" //field must have at least 5 characters
           //can be assigned to input, textarea

# lamrequired
usage"
lamrequired //field with this attribute is mandatory
            //can be assigned to input, checkbox, textarea, select

# lamtype
options: email, url
usage: lamtype="email" //field with this attribute will be email validated
                       //can be assigned to input, textarea

# lammatch
usage:
lammatch="1" //must be assign to at least two input type="text" element to be matching
             //eg: Password field and Re-type password field. Both will be assigned to lammatch="1"
             //1 mean group.
             //can be assigned to input, textarea

*/


var validation = function(formObj) {

    var validate = function() {
        refreshFrom();
        var checkRequireds = checkRequired();
        var checkEmails = checkEmail();
        var checkUrls = checkUrl();
        var checkMatchs = checkMatch();
        var checkMins = checkMin();
        if ((checkRequireds == true) && (checkEmails == true) && (checkMatchs == true) && (checkMins == true) && (checkUrls == true)) {
            return true;
        } else {
            return false;
        }
    }

    var refreshFrom = function() {
        formObj.find('input').each(function(index, value) {
            $(value).attr('validate', 'false');
        });
        formObj.find('select').each(function(index, value) {
            $(value).attr('validate', 'false');
        });
        formObj.find('checkbox').each(function(index, value) {
            $(value).attr('validate', 'false');
        });
        formObj.find('textarea').each(function(index, value) {
            $(value).attr('validate', 'false');
        });
    }

    var checkRequired = function() {
        var result = true;
        var inputs = formObj.find('[lamrequired][validate=false]').each(function(index, value) { //for input, select
            var currentObj = $(value);
            if (currentObj.is(":checkbox") == false) {
                if (currentObj.val().trim() == '') {
                    result = false;
                    currentObj.attr('validate', 'true');
                    error(currentObj, 'Required');
                }
            } else {
                if (currentObj.is(":checked") == false) {
                    result = false;
                    currentObj.attr('validate', 'true');
                    error(currentObj, 'Required');
                    currentObj.change(function() {
                        currentObj.tooltip("destroy");
                        currentObj.off("change");
                    });
                }
            }
        });
        return result;
    }

    var checkEmail = function() {
        var result = true;
        var inputs = formObj.find('[lamtype=email][validate=false]').each(function(index, value) {
            var currentObj = $(value);
            if (isEmail(currentObj.val()) == false) {
                result = false;
                currentObj.attr('validate', 'true');
                error(currentObj, 'Not a valid email format');
            }
        });
        return result;
    }

    var checkUrl = function() {
        var result = true;
        var inputs = formObj.find('[lamtype=url][validate=false]').each(function(index, value) {
            var currentObj = $(value);
            if (isURL(currentObj.val()) == false) {
                result = false;
                currentObj.attr('validate', 'true');
                error(currentObj, 'This is not a valid URL');
            }
        });
        return result;
    }

    var checkMatch = function() {
        var result = true;
        var matchArray = [];
        var inputs = formObj.find('[lammatch][validate=false]').each(function(index, value) {
            var matchGroup = $(value).attr('lammatch');
            if (!matchArray[matchGroup]) {
                matchArray[matchGroup] = [];
            }
            matchArray[matchGroup].push($(value));
        });
        matchArray.forEach(function(element) {
            if (element.length > 1) {
                var prev = null;
                element.forEach(function(element2) {
                    if (prev == null) {
                        prev = element2;
                    } else {
                        if (prev.val() != element2.val()) {
                            result = false;
                            error(element2, element2.attr('notmatch'));
                            element2.attr('validate', 'true');
                        }
                    }
                });
            }
        });
        return result;
    }

    var checkMin = function() {
        var result = true;
        var inputs = formObj.find('[lammin][validate=false]').each(function(index, value) {
            var currentObj = $(value);
            if (currentObj.val().trim().length < currentObj.attr('lammin')) {
                result = false;
                currentObj.attr('validate', 'true');
                error(currentObj, 'Must contain at least ' + currentObj.attr('lammin') + ' characters.');
            }
        });
        return result;
    }

    var isEmail = function(email) { //By: killing the bug softly, 12 Nov 2012 - ref: http://www.codeproject.com/Tips/492632/Email-Validation-in-JavaScript
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!filter.test(email)) {
            return false;
        } else {
            return true;
        }
    }

    var isURL = function(str) { //ref: http://www.roseindia.net/answers/viewqa/JavaScriptQuestions/25837-javascript-regex-validate-url.html
        var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        if (pattern.test(str)) {
            return true;
        }
        return false;
    }

    var error = function(Obj, message) {
        Obj.attr('data-toggle', 'tooltip');
        Obj.attr('data-placement', 'bottom');
        Obj.attr('title', message);
        Obj.tooltip('show');
        Obj.mouseover(function() {
            $(this).tooltip('destroy');
        });
    }

    var newSubmit = function() {
        formObj.submit(function(e) {
            e.preventDefault();
            if (validate() == true) {
                formObj.off("submit");
                formObj.submit();
            }
        });
    }

    var formObj = formObj;
    var parent = this;
    newSubmit();
}
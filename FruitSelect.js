
function saveSelection() {

    var textVal1 = document.getElementById('Text1').value;
    var selectVal2 = document.getElementById('Select1').value;
    if (selectVal2 == "Please Choose") {
        //reject this
        alert("Please choose the fruit from the dropdown.");
        return true;
    } else {
      
         try {
             var newSelection = JSON.parse('[{"clue":"' + textVal1 + '","fruit":"' + selectVal2 + '"}]');
        }
        catch (err) {
             alert("The keyword contains a reserved character. Please remove it and try again,");
             return true;
        }
        let curSavedSelection = getCookie("SavedSelectionList");
        if (curSavedSelection == "") {
            //still empty  
            var arraySelection = newSelection;
        } else {
            var arraySelection = JSON.parse(curSavedSelection);
            arraySelection.push(newSelection[0]);
        }
       
        setCookie('SavedSelectionList', JSON.stringify(arraySelection), 2);
        document.getElementById('Text1').value = "";
        refreshCombo();
        alert("The selection has been recorded successfully. Current records : " + arraySelection.length);

    }

    return true;
}

//remove the saved cookie
function resetCookie() {

    if (confirm("Do you want to delete the selection list and start again?")) {
        let expires = "expires=Thu, 01 Jan 1970 00:00:01 GMT"
        document.cookie = "SavedSelectionList" + "=" + '' + ";" + expires + ";path=/";
        refreshCombo();
        alert("The selection has been reset successfully.")
    } else {
        alert("The reset has been cancelled.")
    }

}

//save the cookie
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

//get the cookie
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

//refresh the combo suggestion in every reset, submission or keyword change.
function refreshCombo() {

    const availableOptions = ['Apple', 'Pear', 'Orange', 'Banana', 'Strawberry'];
    const matchingCount = [0, 0, 0, 0, 0];
    var i, L = Select1.options.length - 2;

    var textVal1 = document.getElementById('Text1').value;
    let curSavedSelection = getCookie("SavedSelectionList");

    //Please Choose always be the default which comes first
    Select1.options[0].value = "Please Choose";
    Select1.options[0].value = "Please Choose";

    if ((curSavedSelection == "") | (textVal1 == "")) {
        //no saved selections or no keyword, set the normal list without suggestion
        for (i = 0; i <= L; i++) {
            Select1.options[i+1].value = availableOptions[i];
            Select1.options[i+1].text = availableOptions[i];
        }
    } else {

        var arraySelection = JSON.parse(curSavedSelection);

        //Going through the saved selections and count the occurences of the keyword
        //Pair the counting with the fruit list.
        var matchingString = '[';
        for (i = 0; i <= L; i++) {
            var filterContainText = arraySelection.filter(function (item) {
                return (item.clue.includes(textVal1)) && (item.fruit == availableOptions[i]) ;
            });
            if (i > 0) {
                matchingString = matchingString + ','
            }
            matchingString = matchingString + '{ "matchCount": "' + filterContainText.length + '", "fruit": "' + availableOptions[i] + '" }';
        }
        matchingString = matchingString + ']';
        var matchingJson = JSON.parse(matchingString);

        //Order the fruit list based on the suggestion count
        var orderedByMatch = matchingJson.sort(function (a, b) {
            return a.matchCount < b.matchCount ? 1 : -1;
        })

        for (i = 0; i <= L; i++) {
            Select1.options[i+1].value = orderedByMatch[i].fruit;
            if ((orderedByMatch[i].matchCount > 0) & (i < 3)) {
                //only mark the suggestion up to three top result
                Select1.options[i + 1].text = orderedByMatch[i].fruit + '-Suggestion-' + (i+1);
            } else {
                Select1.options[i + 1].text = orderedByMatch[i].fruit;
            }
            
        }

    }
    //Set the value back to default to force the user to reselect the fruit.
    document.getElementById('Select1').value = "Please Choose";
    return true;
}


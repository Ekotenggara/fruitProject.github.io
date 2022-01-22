
function saveSelection() {
    //alert("Submit button clicked!");
 
    var textVal1 = document.getElementById('Text1').value;
    //alert(textval);
    var selectVal2 = document.getElementById('Select1').value;
    if (selectVal2 == "Suggested") {
        //reject this
        return true;
    } else if (selectVal2 == "Other Option") {
        //reject this
        return true;
    } else {
        var newSelection = JSON.parse('[{"clue":"' + textVal1 + '","fruit":"' + selectVal2 + '"}]');
        
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
    }

    return true;
}

function resetCookie() {
    let expires = "expires=Thu, 01 Jan 1970 00:00:01 GMT"
    document.cookie = "SavedSelectionList" + "=" + '' + ";" + expires + ";path=/";
    refreshCombo();
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

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

function refreshCombo() {

    const availableOptions = ['Apple', 'Pear', 'Orange', 'Banana', 'Strawberry'];
    const matchingCount = [0, 0, 0, 0, 0];
    var i, L = Select1.options.length - 1;

    var textVal1 = document.getElementById('Text1').value;
    let curSavedSelection = getCookie("SavedSelectionList");
    if ((curSavedSelection == "") | (textVal1 == "")) {
        for (i = 0; i <= L; i++) {
            Select1.options[i].value = availableOptions[i];
            Select1.options[i].text = availableOptions[i];
        }
    } else {

        var arraySelection = JSON.parse(curSavedSelection);

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

        var orderedByMatch = matchingJson.sort(function (a, b) {
            return a.matchCount < b.matchCount ? 1 : -1;
        })

        for (i = 0; i <= L; i++) {
            Select1.options[i].value = orderedByMatch[i].fruit;
            if ((orderedByMatch[i].matchCount > 0) & (i < 3)) {
                Select1.options[i].text = orderedByMatch[i].fruit + '-Suggestion-' + (i+1);
            } else {
                Select1.options[i].text = orderedByMatch[i].fruit;
            }
            
        }

    }

    return true;
}
var ramblerswalks
/* 
 * Change visibilty of calandar items for event calendar
 */

function ra_toggle_visibility(id) {
    var e = document.getElementById(id);
    if (e.style.display != 'none')
        e.style.display = 'none';
    else
        e.style.display = '';
}
function ra_toggle_visibilities(id1, id2) {
    ra_toggle_visibility(id1);
    ra_toggle_visibility(id2);
}

function gotoURL(dispArticle, dispMenu, walkid) {
    var url = "?option=com_content&view=article&id=" + dispArticle + "&Itemid=" + dispMenu;

    if (getWalkUrl() === url) {
        gotoWalk(walkid);
    } else {
        url = "index.php?option=com_content&view=article&id=" + dispArticle + "&Itemid=" + dispMenu + "&walk=" + walkid;
        window.location = url;
    }
}
function gotoWalk(walkid) {
    var tag = document.getElementById("w" + walkid);
    if (tag != null) {
        tag.click();
        setTimeout(function () {
            window.location.hash = "#w" + walkid;
        }, 800);
    } else {
        if (typeof displayWalkID === 'function') {
            displayWalkID(walkid);
        } else {
            alert("Walk not found");
        }

    }

}
function getWalkUrl() {
    var search = window.location.search;
    var n = search.indexOf("&walk=");
    var compare = search.substr(0, n);
    return compare;
}
function ajax($url, $params, target, displayFunc) {
    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else
    {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200)
        {
            displayFunc(target, xmlhttp.responseText);

            // document.getElementById($div).innerHTML = xmlhttp.responseText;
        }
    };
    xmlhttp.open("POST", $url, true);
    //Send the proper header information along with the request
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //   xmlhttp.setRequestHeader("Content-length", $params.length);
    //   xmlhttp.setRequestHeader("Connection", "close");
    xmlhttp.send($params);
}
function displayModal($html) {
    createModalTag();
    setTagHtml("modal-data", $html);
    // Get the modal
    var modal = document.getElementById('raModal');
    modal.style.display = "block";
// Get the <span> element that closes the modal
    var span = document.getElementById("btnClose");
// When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
        setTagHtml("modal-data", "");
    };
    document.getElementById("btnPrint").onclick = function () {
        printTag("modal-data");
    };
}
function localhost() {
    if (window.location.hostname.includes("localhost")) {
        return true;
    } else {
        return false;
    }
}
function dGH() {
    var $url;
    if (localhost()) {
        $url = "ramblers/pages/grades.html";
    } else {
        $url = "/ramblers/pages/grades.html";
    }
    var marker;
    ajax($url, "", marker, displayGradesModal);
}
function dMH() {
    var $url;
    if (localhost()) {
        $url = "ramblers/pages/maphelp.html";
    } else {
        $url = "/ramblers/pages/maphelp.html";
    }
    var marker;
    ajax($url, "", marker, displayGradesModal);
}

function displayGradesModal(marker, $html) {
    displayModal($html);
}
function printTag(divId) {
    var content = document.getElementById(divId).innerHTML;
    var mywindow = window.open('', 'Print', 'height=600,width=800');
    mywindow.document.write('<html><head><title>Print</title>');
    var index, len;
    var sheets = document.styleSheets;
    for (index = 0, len = sheets.length; index < len; ++index) {
        var sheet = sheets[index];
        if (sheet.href !== null) {
//         if (sheet.href.includes("/ramblers/") || sheet.href.includes("/mod_rafooter/")) {
            var link = '<link rel="stylesheet" href="' + sheet.href + '">';
            mywindow.document.write(link);
            //        }
        }
    }
    mywindow.document.write('</head><body ><div class="div.component-content">');
    mywindow.document.write(content);
    mywindow.document.write('</div></body></html>');
    mywindow.document.close();
    mywindow.focus();
    mywindow.print();
    mywindow.close();
    return true;
}
function setTagHtml(id, html) {
    var tag = document.getElementById(id);
    if (tag) {
        tag.innerHTML = html;
    }
}
function createModalTag() {
    // Get the modal
    var modaltag = document.getElementById('modal-data');
    if (modaltag === null) {
        // create modal tag
        var body = document.getElementsByTagName("BODY")[0];
        var div = document.createElement("div");
        body.appendChild(div);
        $tag = '<div id="raModal" class="modal" style="display:none">';
        $tag += '<!-- Modal Content (The Image) -->';
        $tag += '<div class="modal-content" >';
        $tag += '<div class="modal-header">';
        $tag += '<button id="btnPrint" class="btn" type="button" >Print</button>';
        $tag += '<button id="btnClose" class="btn" data-dismiss="modal" >Close</button>';
        $tag += '</div>';
        $tag += '<p style="clear:right;"> </p>';
        $tag += '<div id="modal-data"></div>';
        $tag += '</div></div>';
        div.innerHTML = $tag;
    }
}
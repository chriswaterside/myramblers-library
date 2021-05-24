var ra;
if (typeof (ra) === "undefined") {
    ra = {};
}
ra._isES6 = null;
ra._baseDirectory = '';
// return base directory
ra.baseDirectory = function () {
    return ra._baseDirectory;
};
ra.decodeOptions = function (value) {
    var options = JSON.parse(value);
    ra._baseDirectory = options.base + "/";
    value = "";
    return options;
};
ra.decodeData = function (value) {
    if (value === null) {
        return null;
    }
    var data = JSON.parse(value);
    value = "";
    return data;
};
// convert string to title case
ra.titleCase = function (str) {
    return str.replace(/(^|\s)\S/g, function (t) {
        return t.toUpperCase();
    });
};
// is an equivalent item in the array
ra.contains = function (items, item) {
    var index, len;
    for (index = 0, len = items.length; index < len; ++index) {
        if (isEquivalent(items[index], item)) {
            return true;
        }
    }
    return false;
};
// are two objects equivalent,i.e. same properties
ra.isEquivalent = function (a, b) {
    // Create arrays of property names
    var aProps = [];
    var bProps = [];
    if (a !== 'undefined') {
        aProps = Object.getOwnPropertyNames(a);
    }
    if (a !== 'undefined') {
        bProps = Object.getOwnPropertyNames(b);
    }
    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length !== bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
};
// test to see if ES6 or not
ra.isES6 = function () {
    if (ra._isES6 !== null) {
        return ra._isES6;
    } else {
        try
        {
            Function("() => {};");
            ra._isES6 = true;
        } catch (exception)
        {
            ra._isES6 = false;
        }
        return ra._isES6;
    }
};



//    return ra;
//}
//());
ra.ajax = (function () {
    var ajax = {};
    // request url and call function
    ajax.postUrl = function ($url, $params, target, displayFunc) {
        var xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest(); // code for IE7+, Firefox, Chrome, Opera, Safari
        } else
        {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); // code for IE6, IE5
        }
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    displayFunc(target, xmlhttp.responseText);
                } else {
                    alert('Unable to complete task');
                }
            }
        };
        xmlhttp.open("POST", $url, true);
        //Send the proper header information along with the request
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        //   xmlhttp.setRequestHeader("Content-length", $params.length);
        //   xmlhttp.setRequestHeader("Connection", "close");
        xmlhttp.send($params);
    };
    ajax.getUrl = function ($url, $params, target, displayFunc) {
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
            }
        };
        xmlhttp.open("GET", $url, true);
        //Send the proper header information along with the request
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        //   xmlhttp.setRequestHeader("Content-length", $params.length);
        //   xmlhttp.setRequestHeader("Connection", "close");
        xmlhttp.send($params);
    };
    // request json feed and callback
    ajax.getJSON = function (url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("get", url, true);
        xhr.responseType = "json";
        xhr.onload = function () {
            var status = xhr.status;
            var items;
            if (status === 200) {
                if (typeof xhr.response === 'string') {
                    items = JSON.parse(xhr.response);
                } else {
                    items = xhr.response;
                }
                callback(null, items);
            } else {
                callback(status);
            }
        };
        xhr.send();
    };
    // post for json feed and callback
    ajax.postJSON = function (url, data, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.responseType = "json";
        xhr.onload = function () {
            var status = xhr.status;
            var items;
            if (status === 200) {
                if (typeof xhr.response === 'string') {
                    items = JSON.parse(xhr.response);
                } else {
                    items = xhr.response;
                }
                callback(null, items);
            } else {
                callback(status);
            }
        };
        xhr.send(data);
    };
    return ajax;
}
());
ra.cookie = (function () {
    var cookie = {};
    cookie.create = function (raobject, name, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        } else
            var expires = "";
        document.cookie = name + "=" + raobject + expires + "; path=/;samesite=Strict";
    };
    cookie.read = function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ')
                c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0)
                return c.substring(nameEQ.length, c.length);
        }
        return null;
    };
    cookie.erase = function (name) {
        document.cookie = name + "=;expires=Thu, 01 Jan 1970; path=/;samesite=Strict";
    };
    return cookie;
}
());
ra.date = (function () {
    var date = {};

//      Possible values are "numeric", "2-digit", "narrow", "short", "long".

    date.getDate = function (datetime) {
        var value = date._setDateTime(datetime);
        var options = {year: 'numeric', month: 'short', day: 'numeric', weekday: 'short'};
        return value.toLocaleDateString("en-UK", options);
    };
    date.dow = function (datetime) {
        var value = date._setDateTime(datetime);
        var options = {weekday: 'long'};
        return value.toLocaleDateString("en-UK", options);
    };
    date.dowShort = function (datetime) {
        var value = date._setDateTime(datetime);
        var options = {weekday: 'short'};
        return value.toLocaleDateString("en-UK", options);
    };
    date.dd = function (datetime) {
        var value = date._setDateTime(datetime);
        return value.getDate().toString() + date.nth(value);
    };
    date.dowShortdd = function (datetime) {
        return date.dowShort(datetime) + ", " + date.dd(datetime);
    };
    date.month = function (datetime) {
        var value = date._setDateTime(datetime);
        var options = {month: 'long'};
        return value.toLocaleDateString("en-UK", options);
    };
    date.dowShortddmm = function (datetime) {
        return date.dowShortdd(datetime) + ", " + date.month(datetime);
    };
//    date.dowShortddyyyy = function (datetime) {
//        var value = date._setDateTime(datetime);
//        var options = {year: 'numeric', day: 'numeric', weekday: 'short'};
//        return value.toLocaleDateString("en-UK", options);
//    };
    date.dowShortddmmyyyy = function (datetime) {
        var value = date._setDateTime(datetime);
        var options = {year: 'numeric', month: 'short', day: 'numeric', weekday: 'short'};
        return value.toLocaleDateString("en-UK", options);
    };
    date.dowdd = function (datetime) {
        return date.dow(datetime) + ", " + date.dd(datetime);
    };
    date.dowddmm = function (datetime) {
        return date.dowdd(datetime) + " " + date.month(datetime);
    };
    date.dowddmmyyyy = function (datetime) {
        return date.dowddmm(datetime) + " " + date.YYYY(datetime);
    };
    date.YYYY = function (datetime) {
        var value = date._setDateTime(datetime);
        var options = {year: 'numeric'};
        return value.toLocaleDateString("en-UK", options);
    };
    date.YYYYMMDD = function (datetime) {
        var value = date._setDateTime(datetime);
        return value.getFullYear() + "-" + date.MM(value) + "-" + date.DD(value);
    };
    date.DDMMYYYY = function (datetime) {
        var value = date._setDateTime(datetime);
        return date.DD(value) + "/" + date.MM(value) + "/" + value.getFullYear();
    };
    date.MM = function (datetime) {
        var value = date._setDateTime(datetime);
        return  (value.getMonth() + 1).toString().padStart(2, '0');
    };
    date.DD = function (datetime) {
        var value = date._setDateTime(datetime);
        return value.getDate().toString().padStart(2, '0');
    };
    date.Month = function (datetime) {
        var value = date._setDateTime(datetime);
        return value.toLocaleString('default', {month: 'long'});
    };
    date.nth = function (datetime) {
        var value = date._setDateTime(datetime);
        var d = value.getDate();
        if (d > 3 && d < 21)
            return 'th';
        switch (d % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    };
    date._setDateTime = function (datetimestring) {
        var value = datetimestring;
        if (typeof value === "string") {
            // note Mac does not handle yyyy-mm-dd, change to yyyy/mm/dd 
            value = value.substr(0, 19).replace(/-/g, "/");
            value = value.replace("T", " ");
        } else {
            return value;
        }
        return new Date(value);
    };
//Day 	--- 	---
//d 	Day of the month, 2 digits with leading zeros 	01 to 31
//D 	A textual representation of a day, three letters 	Mon through Sun
//j 	Day of the month without leading zeros 	1 to 31
//l (lowercase 'L') 	A full textual representation of the day of the week 	Sunday through Saturday
//N 	ISO-8601 numeric representation of the day of the week 	1 (for Monday) through 7 (for Sunday)
//S 	English ordinal suffix for the day of the month, 2 characters 	st, nd, rd or th. Works well with j
//w 	Numeric representation of the day of the week 	0 (for Sunday) through 6 (for Saturday)
//z 	The day of the year (starting from 0) 	0 through 365
//Week 	--- 	---
//W 	ISO-8601 week number of year, weeks starting on Monday 	Example: 42 (the 42nd week in the year)
//Month 	--- 	---
//F 	A full textual representation of a month, such as January or March 	January through December
//m 	Numeric representation of a month, with leading zeros 	01 through 12
//M 	A short textual representation of a month, three letters 	Jan through Dec
//n 	Numeric representation of a month, without leading zeros 	1 through 12
//t 	Number of days in the given month 	28 through 31
//Year 	--- 	---
//L 	Whether it's a leap year 	1 if it is a leap year, 0 otherwise.
//o 	ISO-8601 week-numbering year. This has the same value as Y, except that if the ISO week number (W) belongs to the previous or next year, that year is used instead. 	Examples: 1999 or 2003
//Y 	A full numeric representation of a year, 4 digits 	Examples: 1999 or 2003
//y 	A two digit representation of a year 	Examples: 99 or 03
//Time 	--- 	---
//a 	Lowercase Ante meridiem and Post meridiem 	am or pm
//A 	Uppercase Ante meridiem and Post meridiem 	AM or PM
//B 	Swatch Internet time 	000 through 999
//g 	12-hour format of an hour without leading zeros 	1 through 12
//G 	24-hour format of an hour without leading zeros 	0 through 23
//h 	12-hour format of an hour with leading zeros 	01 through 12
//H 	24-hour format of an hour with leading zeros 	00 through 23
//i 	Minutes with leading zeros 	00 to 59



    date.format = function (datetime)
    {
        date.toLocaleString('default', {month: 'long'});
    };
    return date;
}
());
ra.time = (function () {
    var time = {};
    time.HHMM = function (datetime) {
        var value = datetime;
        if (typeof datetime === "string") {
            value = new Date(datetime);
        }
        var options = {hour: 'numeric', minute: 'numeric'};
        return value.toLocaleString("en-UK", options);
    };
    time.HHMMshort = function (datetime) {
        var value = datetime;
        if (typeof datetime === "string") {
            value = new Date(datetime);
        }
        var tim = value.toLocaleString('default', {timeStyle: 'short', hour12: true});
        tim = tim.replace(/^0+/i, '');
        return tim.replace(":00", "");
    };
    time.secsToHrsMins = function (seconds) {
        if (isNaN(seconds)) {
            return "";
        }
        var strtime, hrs, mins;
        hrs = Math.floor(seconds / 3600);
        seconds -= hrs * 3600;
        mins = Math.floor(seconds / 60);
        seconds -= mins * 60;
        strtime = hrs.toFixed() + 'hrs ' + mins.toFixed() + 'mins';
        return strtime;
    };
    return time;
}
());
ra.html = (function () {
    var html = {};
    // add HTML Div tag with class and text
    html.addDiv = function ($class, $text) {
        var $out = "";
        $out += "<div class='" + $class + "'>";
        $out += $text;
        $out += "</div>";
        return $out;
    };
    html.createElement = function (tag, type, attr = '', value = '') {
        var ele = document.createElement(type);
        if (attr !== '') {
            ele.setAttribute(attr, value);
        }
        tag.appendChild(ele);
        return ele;
    };
    html.generateTags = function (root, items) {
        var index;
        var tags = {};
        for (index = 0; index < items.length; ++index) {
            var item = items[index];
            item.element = document.createElement(item.tag);
            Object.keys(item).forEach(function (key, i) {
                // key: the name of the object key
                // i: the ordinal position of the key within the object 
                switch (key) {
                    case 'name':
                        tags[item[key]] = item.element;
                        break;
                    case 'parent':
                    case 'tag':
                        break;
                    case 'attrs':
                        var attrs = item[key];
                        Object.keys(attrs).forEach(function (key, i) {
                            item.element.setAttribute(key, attrs[key]);
                        });
                        break;
                    case 'style':
                        var styles = item[key];
                        Object.keys(styles).forEach(function (key, i) {
                            item.element.style[key] = styles[key];
                        });
                        break;
                    default:
                        item.element[key] = item[key];
                }

            });
        }
        // put tags into structure
        for (index = 0; index < items.length; ++index) {
            var item = items[index];
            if (item.hasOwnProperty('parent')) {
                var parent = item.parent;
                if (parent === 'root') {
                    root.appendChild(item.element);
                } else {
                    var result = items.find(obj => {
                        return obj.name === parent;
                    });
                    if (result) {
                        result.element.appendChild(item.element);
                    } else {
                        root.appendChild(item.element);
                    }
                }

            }
        }
        return tags;
    };
    html.setTag = function (id, innerhtml) {
       var tag=html.getTab(id);
        if (tag) {
            tag.innerHTML = innerhtml;
        }
    };
    // toggle element visibility on/off 
    html.toggleVisibility = function (id) {
         var e=html.getTab(id);
        if (e.style.display !== 'none')
            e.style.display = 'none';
        else
            e.style.display = '';
    };
    // toggle two element's visibility on/off
    html.toggleVisibilities = function (id1, id2) {
        html.toggleVisibility(id1);
        html.toggleVisibility(id2);
    };
    // open window with tag content for printing
    html.printTag = function (id) {
         var tag=html.getTab(id);
        var content = tag.innerHTML;
        var mywindow = window.open('', 'Print', 'height=600,width=800');
        mywindow.document.write('<html><head><title>Print</title>');
        var index, len;
        var sheets = document.styleSheets;
        for (index = 0, len = sheets.length; index < len; ++index) {
            var sheet = sheets[index];
            if (sheet.href !== null) {
                var link = '<link rel="stylesheet" href="' + sheet.href + '">\n';
                mywindow.document.write(link);
                var noprint = "<style> .noprint {display: none !important; }</style>";
                mywindow.document.write(noprint);
            }
        }
        mywindow.document.write('</head><body><div id="document"><input type="button" value="Print" onclick="window.print(); return false;"><div class="div.component-content">');
        mywindow.document.write(content);
        mywindow.document.write('</div></div></body></html>');
        var span = mywindow.document.getElementById("document");
// When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            mywindow.close();
        };
        mywindow.document.close();
        mywindow.focus();
        return true;
    };
    html.convertToText = function ($html) {
        var $text = $html.replace("\r", "");
        $text = $text.replace("\n", "");
        $text = $text.replace("&nbsp;", " ");
        $text = $text.replace(/(<([^>]+)>)/ig, "");
        $text = html.escape($text);
        $text = $text.trim();
        return $text;
    };
    // escape why?
    html.escape = function (text) {
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function (m) {
            return map[m];
        });
    };
    // escape why?
    html.addslashes = function (str) {
//  discuss at: http://locutus.io/php/addslashes/
// original by: Kevin van Zonneveld (http://kvz.io)
// improved by: Ates Goral (http://magnetiq.com)
// improved by: marrtins
// improved by: Nate
// improved by: Onno Marsman (https://twitter.com/onnomarsman)
// improved by: Brett Zamir (http://brett-zamir.me)
// improved by: Oskar Larsson Högfeldt (http://oskar-lh.name/)
//    input by: Denny Wardhana
//   example 1: addslashes("kevin's birthday")
//   returns 1: "kevin\\'s birthday"

        return (str + '')
                .replace(/[\\"']/g, '\\$&')
                .replace(/\u0000/g, '\\0');
    };
    html.getBrowserStatus = function () {
        var out = "";
        out += "<br/>Mobile: " + L.Browser.mobile.toString();
        out += "<br/>Touch: " + L.Browser.touch.toString();
        out += "<br/>Pointer : " + L.Browser.pointer.toString();
        out += "<br/>Win: " + L.Browser.win.toString();
        out += "<br/>Android: " + L.Browser.android.toString();
        return out;
    };
    html.showhide = function (evt, idName) {
        var x = document.getElementById(idName);
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    };
    html.getTab=function(id){
        if (typeof id === 'string') {
            return document.getElementById(id);
        } else {
            return id;
        }
    };
    return html;
}
());
ra.link = (function () {
    var link = {};
    link.getOSMap = function (lat, long, text) {
        var $out;
        $out = "<abbr title='Click Map to see Ordnance Survey map of location'>";
        $out = "<span class='pointer' onClick=\"javascript:ra.link.streetmap(" + lat + "," + long + ")\">[" + text + "]</span>";
        $out += "</abbr>";
        return $out;
    };
    link.getAreaMap = function ($location, $text) {
        var $this = $location;
        var $code, $out;
        if (!$this.exact) {
            $code = "http://maps.google.com/maps?z=13&amp;t=h&amp;ll=[lat],[long]";
            $code = $code.replace("[lat]", $this.latitude);
            $code = $code.replace("[long]", $this.longitude);
            $out = "<span class='pointer' onClick=\"javascript:window.open('" + $code + "', '_blank','toolbar=yes,scrollbars=yes,left=50,top=50,width=800,height=600');\">[" + $text + "]</span>";
            return $out;
        } else {
            return "";
        }
    };
    link.photos = function ($gr) {
        var page = "http://www.geograph.org.uk/gridref/" + $gr;
        window.open(page, "_blank", "scrollbars=yes,width=990,height=480,menubar=yes,resizable=yes,status=yes");
    };
    link.streetmap = function (lat, long) {
        ////https://streetmap.co.uk/loc/N52.038333,W4.578611
        var page = "https://www.streetmap.co.uk/loc/N" + lat + ",E" + long;
        window.open(page, "_blank", "scrollbars=yes,width=900,height=580,menubar=yes,resizable=yes,status=yes");
    };
    link.googlemap = function ($lat, $long) {
        var page = "https://www.google.com/maps/place/" + $lat.toString() + "+" + $long.toString() + "/@" + $lat.toString() + "," + $long.toString() + ",15z";
        window.open(page, "Google Map", "scrollbars=yes,width=900,height=580,menubar=yes,resizable=yes,status=yes");
    };
    return link;
}
());
ra.jplist = (function () {
    var jplist = {};
    jplist.sortButton = function (tag, group, varclass, type, order, text) {
            var button = document.createElement('button');
            tag.appendChild(button);
            button.setAttribute('class', "jplistsortbutton" + order);
            button.setAttribute('data-jplist-control', "sort-buttons");
            button.setAttribute('data-path', "." + varclass);
            button.setAttribute('data-group', group);
            button.setAttribute('data-order', order);
            button.setAttribute('data-type', type);
            button.setAttribute('data-name', "sortbutton");
            button.setAttribute('data-selected', "false");
            button.setAttribute('data-mode', "radio");
            button.textContent = text;
    };
  
    return jplist;
}
());
ra.w3w = (function () {
    var w3w = {};
    w3w.get = function (lat, lng, id, place) {
        var tag=ra.html.getTab(id);
        var w3wurl = "https://api.what3words.com/v3/convert-to-3wa?key=6AZYMY7P&coordinates=";
        var url = w3wurl + lat.toFixed(7) + ',' + lng.toFixed(7);
        ra.ajax.getJSON(url, function (err, items) {

            if (err !== null || tag === null) {
                tag.innerHTML = "Error accessing What3Words: " + err + "<br/>";
            } else {
                var out = '<a class="w3w" href="https://what3words.com/about-us/" target="_blank">What3Words: </a>' + items.words + '<br/>';
                if (place) {
                    out += '<b>Nearest Place: </b>' + items.nearestPlace + '<br/>';
                }
                tag.innerHTML = out;
            }
        });
    };
    w3w.toLocation = function (tag, words) {
        var url = "https://api.what3words.com/v3/convert-to-coordinates?words=" + words + "&key=6AZYMY7P";
        ra.ajax.getJSON(url, function (err, item) {
            let event = new Event("what3wordsfound", {bubbles: true}); // (2)
            event.raData = {};
            event.raData.err = err;
            if (err === null) {
                event.raData.coordinates = item.coordinates;
                event.raData.nearestPlace = item.nearestPlace;
                event.raData.country = item.country;
                event.raData.words = item.words;
            }
            tag.dispatchEvent(event);
        });
    };
    w3w.fetch = function (tag, dataObject, lat, lng) {
        var w3wurl = "https://api.what3words.com/v3/convert-to-3wa?key=6AZYMY7P&coordinates=";
        var url = w3wurl + lat.toFixed(7) + ',' + lng.toFixed(7);
        ra.ajax.getJSON(url, function (err, item) {
            let event = new Event("what3wordsfound", {bubbles: true}); // (2)
            event.raData = {};
            event.raData.err = err;
            event.raData.dataObject = dataObject;
            if (err === null) {
                event.raData.words = item.words;
                event.raDatasuper.ultra.enhancement.nearestPlace = item.nearestPlace;
            }
            tag.dispatchEvent(event);
        });
    };

    w3w.aboutUs = function () {
        var page = "https://what3words.com/about-us/";
        window.open(page, "_blank", "scrollbars=yes,width=990,height=480,menubar=yes,resizable=yes,status=yes");
    };
    return w3w;
}
());
ra.modal = (function () {
    var modal = {};
    modal.display = function ($html, print = true) {
        modal._createModalTag(print);
        ra.html.setTag("modal-data", $html);
        // Get the modal
        var modaltag = document.getElementById('js-raModal');
        modaltag.style.display = "block";
// Get the <span> element that closes the modal
        var span = document.getElementById("btnClose");
        // When the user clicks on <span> (x), close the modal
        span.addEventListener("click", function () {
            modaltag.style.display = "none";
            ra.html.setTag("modal-data", "");
        });
        //  var span = document.getElementById("modal-data");
        var print = document.getElementById("btnPrint");
        if (print !== null) {
            print.onclick = function () {
                ra.html.printTag("modal-data");
            };
    }
    };
    modal._createModalTag = function (print = true) {
        // Get the modal
        var modaltag = document.getElementById('js-raModal');
        if (modaltag === null) {
            // create modal tag
            var body = document.getElementsByTagName("BODY")[0];
            var modaltag = document.createElement("div");
            modaltag.setAttribute('id', 'js-raModal');
            modaltag.setAttribute('class', 'ramodal');
            modaltag.style.display = 'none';
            body.appendChild(modaltag);
        }
        var $tag = '';
        $tag += '<!-- Modal Content (The Image) -->';
        $tag += '<div class="modal-content" >';
        $tag += '<div class="modal-header">';
        if (print) {
            $tag += '<button id="btnPrint" class="btn" type="button" >Print</button>';
        }
        $tag += '<button id="btnClose" class="btn" data-dismiss="modal" >Close</button>';
        $tag += '</div>';
        $tag += '<p style="clear:right;"> </p>';
        $tag += '<div id="modal-data"></div>';
        $tag += '<hr/></div></div>';
        modaltag.innerHTML = $tag;
    };
    return modal;
}
());
ra.math = (function () {
    var math = {};
    math.deg2rad = function (value) {
        return value * Math.PI / 180;
    };
    math.rad2deg = function (value) {
        return value * 180 / Math.PI;
    };
    math.round = function (num, dec) {
        var num_sign = num >= 0 ? 1 : -1;
        return parseFloat((Math.round((num * Math.pow(10, dec)) + (num_sign * 0.0001)) / Math.pow(10, dec)).toFixed(dec));
    };
    math.naismith = function (dist, elevGain) {
        var mins = 60 * dist / 5000 + 60 * elevGain / 600;
        return convertToHoursMins(mins);
        function convertToHoursMins(time) {
            if (time < 1) {
                return '';
            }
            var h = Math.floor(time / 60);
            var m = (time % 60);
            return  h + 'hrs ' + m.toFixed(0) + 'mins';
            ;
        }
    };
    return math;
}
());
ra.geom = (function () {
    var geom = {};
    var KM = 6371.009;
    var MI = 3958.761;
    var NM = 3440.070;
    // var YD = 6967420;
    // var FT = 20902260;
    var directions = [
        {angle: 0, name: "North", abbr: "N"},
        {angle: 45, name: "North East", abbr: "NE"},
        {angle: 90, name: "East", abbr: "E"},
        {angle: 135, name: "South East", abbr: "SE"},
        {angle: 180, name: "South", abbr: "S"},
        {angle: 225, name: "South West", abbr: "SW"},
        {angle: 270, name: "West", abbr: "W"},
        {angle: 315, name: "North West", abbr: "NW"},
        {angle: 360, name: "North", abbr: "N"}];

    geom.validateRadius = function ($unit) {
        if ($unit === "KM") {
            return KM;
        } else {
            return MI;
        }
    };
// Takes two sets of geographic coordinates in decimal degrees and produces distance along the great circle line.
// Optionally takes a fifth argument with one of the predefined units of measurements, or planet radius in custom units.
    geom.distance = function ($lat1, $lon1, $lat2, $lon2, $unit = KM) {
        var $r = geom.validateRadius($unit);
        $lat1 = ra.math.deg2rad($lat1);
        $lon1 = ra.math.deg2rad($lon1);
        $lat2 = ra.math.deg2rad($lat2);
        $lon2 = ra.math.deg2rad($lon2);
        var $lonDelta = $lon2 - $lon1;
        var $a = Math.pow(Math.cos($lat2) * Math.sin($lonDelta), 2) + Math.pow(Math.cos($lat1) * Math.sin($lat2) - Math.sin($lat1) * Math.cos($lat2) * Math.cos($lonDelta), 2);
        var $b = Math.sin($lat1) * Math.sin($lat2) + Math.cos($lat1) * Math.cos($lat2) * Math.cos($lonDelta);
        var $angle = Math.atan2(Math.sqrt($a), $b);
        return $angle * $r;
    };
// Takes two sets of geographic coordinates in decimal degrees and produces bearing (azimuth) from the first set of coordinates to the second set.
    geom.bearing = function ($lat1, $lon1, $lat2, $lon2) {
        $lat1 = ra.math.deg2rad($lat1);
        $lon1 = ra.math.deg2rad($lon1);
        $lat2 = ra.math.deg2rad($lat2);
        $lon2 = ra.math.deg2rad($lon2);
        var $lonDelta = $lon2 - $lon1;
        var $y = Math.sin($lonDelta) * Math.cos($lat2);
        var $x = Math.cos($lat1) * Math.sin($lat2) - Math.sin($lat1) * Math.cos($lat2) * Math.cos($lonDelta);
        var $brng = Math.atan2($y, $x);
        $brng = $brng * (180 / Math.PI);
        if ($brng < 0) {
            $brng += 360;
        }
        return $brng;
    };
// Takes one set of geographic coordinates in decimal degrees, azimuth and distance to produce a new set of coordinates, specified distance and bearing away from original.
// Optionally takes a fifth argument with one of the predefined units of measurements.
    geom.destination = function ($lat1, $lon1, $brng, $dt, $unit = KM) {
        var $r = geom.validateRadius($unit);
        $lat1 = ra.math.deg2rad($lat1);
        $lon1 = ra.math.deg2rad($lon1);
        var $lat3 = Math.asin(Math.sin($lat1) * Math.cos($dt / $r) + Math.cos($lat1) * Math.sin($dt / $r) * Math.cos(ra.math.deg2rad($brng)));
        var $lon3 = $lon1 + Math.atan2(sin(ra.math.deg2rad($brng)) * Math.sin($dt / $r) * Math.cos($lat1), Math.cos($dt / $r) - Math.sin($lat1) * Math.sin($lat3));
        return {
            "LAT": ra.math.rad2deg($lat3),
            "LON": ra.math.rad2deg($lon3)};
    };
    geom.direction = function ($lat1, $lon1, $lat2, $lon2) {
        var $bearing = geom.bearing($lat1, $lon1, $lat2, $lon2);
        var $inc = 22.5;
        //     var $direction = array("North", "North East", "East", "South East", "South", "South West", "West", "North West", "North");
        var $i = 0;
        var index, len, item, angle;
        for (index = 0, len = directions.length; index < len; ++index) {
            item = directions[$i];
            angle = item.angle;
            if ($bearing >= angle - $inc && $bearing <= angle + $inc) {
                return item;
            }

            $i += 1;
        }
//        var $ang;
//        for ($ang = 0; $ang <= 360; $ang += 45) {
//            if ($bearing >= $ang - $inc && $bearing <= $ang + $inc) {
//                return $direction[$i];
//            }
//            
//        }
        return "direction error";
    };
//    geom.directionAbbr = function ($item) {
//
//        var $direction = array("North", "North East", "East", "South East", "South", "South West", "West", "North West");
//        var $dir = array("N", "NE", "E", "SE", "S", "SW", "W", "NW");
//        //                  foreach ($direction as $key => $value) {
//        if ($item === $value) {
//            return $dir[$key];
//            //          }
//        }
//        return "direction abbrevation error";
//    };
    geom.test = function () {

        console.log(geom.distance(40.76, -73.984, 40.89, -74, "KM"));
        console.log(geom.bearing(40.76, -73.984, 40.89, -74));
        console.log(geom.direction(40.76, -73.984, 40.89, -74));
    };

    return geom;
}
());
ra.units = (function () {
    var units = {};
    // metres to Km
    units.metresTokm = function (v) {
        return v / 1000;
    };
    // metres to Miles
    units.metresToMi = function (v) {
        return v / 1609.34;
    };
    return units;
}
());

//  ra.geom.test();
var document, ra, FullCalendar;
if (typeof (ra) === "undefined") {
    ra = {};
}
if (typeof (ra.walkseditor) === "undefined") {
    ra.walkseditor = {};
}
ra.walkseditor.viewWalks = function (tag, mapOptions, programme, loggedOn = false) {
    this.masterdiv = tag;
    this.programme = programme;
    this.mapOptions = mapOptions;
    this.allowWMExport = false;
    this._loggedOn = loggedOn;
    this.filter = null;
    this.settings = {
        currentDisplay: "Table",
        singleCategory: true
    };

    this.jplistGroup = ra.uniqueID();
    this.myjplist = new ra.jplist(this.jplistGroup);
    this.tableColumns = [
        {name: 'Status'},
        {name: 'Date', sortxx: {type: 'text', colname: 'wDate'}},
        {name: 'Meeting'},
        {name: 'Start'},
        {name: 'Title', sortxx: {type: 'text', colname: 'wTitle'}},
        {name: 'Difficulty'},
        {name: 'Contact', sortxx: {type: 'text', colname: 'wContact'}},
                //  {name: 'Options'}
    ];

    this.load = function () {
        var tags = [
            {name: 'buttons', parent: 'root', tag: 'div', attrs: {class: 'alignRight'}},
            {name: 'walksFilter', parent: 'root', tag: 'div', attrs: {class: 'walksFilter'}},
            {name: 'pastwalks', parent: 'root', tag: 'div', attrs: {class: 'walksPast walksFilter'}},
            {name: 'container', parent: 'root', tag: 'div'},
            {name: 'table', parent: 'container', tag: 'table', attrs: {class: 'ra-tab-options'}},
            {name: 'row', parent: 'table', tag: 'tr'},
            {name: 'table', parent: 'row', tag: 'td', attrs: {class: 'ra-tab'}, textContent: 'Table'},
            {name: 'list', parent: 'row', tag: 'td', attrs: {class: 'ra-tab'}, textContent: 'List'},
            {name: 'map', parent: 'row', tag: 'td', attrs: {class: 'ra-tab'}, textContent: 'Map'},
            {name: 'calendar', parent: 'row', tag: 'td', attrs: {class: 'ra-tab'}, textContent: 'Calendar'},
            //          {name: 'issues', parent: 'row', tag: 'td', attrs: {class: 'ra-tab'}, textContent: 'Issues'},
            {name: 'gpxouter', parent: 'root', tag: 'div', attrs: {class: 'gpxouter'}}
        ];

        this.elements = ra.html.generateTags(this.masterdiv, tags);

        var self = this;

        this.elements.table.addEventListener("click", function (e) {
            if (e.altKey) {
                self.displayDiagnostics();
            }
            self.ra_format("Table");
        });
        this.elements.list.addEventListener("click", function (e) {
            if (e.altKey) {
                self.displayDiagnostics();
            }
            self.ra_format("List");
        });
        this.elements.map.addEventListener("click", function (e) {
            if (e.altKey) {
                self.displayDiagnostics();
            }
            self.ra_format("Map");
        });
        this.elements.calendar.addEventListener("click", function (e) {
            if (e.altKey) {
                self.displayDiagnostics();
            }
            self.ra_format("Calendar");
        });
        self.ra_format(self.settings.currentDisplay);
        document.addEventListener("reDisplayWalks", function () {
            self.programme.setWalkDisplay();
            self.removeRecordDisplay();
            self.ra_format(self.settings.currentDisplay);
        });
        this.programme.setFilters(this.elements.walksFilter);
    };

    this.displayDiagnostics = function () {
        var tag = document.createElement('div');
        var heading = document.createElement('h3');
        tag.appendChild(heading);
        var div = document.createElement('div');
        tag.appendChild(div);
        div.innerHTML = "<pre>" + JSON.stringify(this.programme, undefined, 4) + "</pre>";
        ra.modals.createModal(tag, true);
    };
    this.removeRecordDisplay = function () {
        this.elements.gpxouter.innerHTML = '';
    };

    this.ra_format = function (option) {
        this.settings.currentDisplay = option;
        this.removeRecordDisplay();
        //    this.elements.status.classList.remove('active');
        this.elements.table.classList.remove('active');
        this.elements.list.classList.remove('active');
        this.elements.map.classList.remove('active');
        this.elements.calendar.classList.remove('active');
        switch (option) {
            case "Table":
                this.elements.table.classList.add('active');
                this.displayTable(this.elements.gpxouter);
                break;
            case "List":
                this.elements.list.classList.add('active');
                this.displayList(this.elements.gpxouter);
                break;
            case "Map":
                this.elements.map.classList.add('active');
                this.displayMap(this.elements.gpxouter);
                break;
            case "Calendar":
                this.elements.calendar.classList.add('active');
                this.displayCalendar(this.elements.gpxouter);
                break;
        }
    };

    this.displayTable = function (tag) {
        var walks = this.programme.getWalks();
        var i, clen;
        var comment = document.createElement('p');
        comment.innerHTML = "Click on walk to view details";
        tag.appendChild(comment);
        //     var wmexport = new ra.walkseditor.exportToWM();
        //     wmexport.button(tag, items);
        var pagination = document.createElement('div');
        pagination.style.marginBottom = "10px";
        tag.appendChild(pagination);
        this.itemsPerPage = 10;
        this.myjplist.addPagination(walks.length, pagination, this.jplistGroup, this.itemsPerPage);

        var table = document.createElement('table');
        tag.appendChild(table);
        this.displayTableHeader(table);
        var tbody = document.createElement('tbody');
        table.appendChild(tbody);
        tbody.setAttribute('data-jplist-group', this.jplistGroup);

        var $class = "odd";
        var first = false;
        var done = false;
        for (i = 0, clen = walks.length; i < clen; ++i) {
            var walk = walks[i];

            if (walk.displayWalk) {
                var status = walk.dateStatus();
                if (!done) {
                    if (status === ra.walkseditor.DATETYPE.Future) {
                        first = true;
                        done = true;
                    }
                }

                this.displayWalkRow(this.tableColumns, tbody, walk, $class, first);
                first = false;
                if ($class === 'odd') {
                    $class = 'even';
                } else {
                    $class = 'odd';
                    ``
                }
            }
        }
        this.myjplist.init('draft-programme');
        this.myjplist.updateControls();
    };

    this.displayList = function (tag) {

        var walks = this.programme.getWalks();
        var i, clen;
        var comment = document.createElement('p');
        comment.innerHTML = "Click on walk to view details";
        tag.appendChild(comment);
        var pagination = document.createElement('div');
        pagination.style.marginBottom = "10px";
        tag.appendChild(pagination);
        this.itemsPerPage = 10;
        this.myjplist.addPagination(walks.length, pagination, this.jplistGroup, this.itemsPerPage);

        var div = document.createElement('div');
        div.setAttribute('data-jplist-group', this.jplistGroup);
        tag.appendChild(div);
        var odd = true;

        var first = false;
        var done = false;

        for (i = 0, clen = walks.length; i < clen; ++i) {
            var walk = walks[i];

            if (walk.displayWalk) {
                var status = walk.dateStatus();
                if (!done) {
                    if (status === ra.walkseditor.DATETYPE.Future) {
                        first = true;
                        done = true;
                    }
                }

                var walkDiv = document.createElement('div');
                if (odd) {
                    walkDiv.classList.add("odd");
                } else {
                    walkDiv.classList.add("even");
                }

                walkDiv.setAttribute('data-jplist-item', '');


                odd = !odd;
                walkDiv.classList.add("pointer");
                if (first) {
                    walkDiv.classList.add("first");
                }
                walkDiv.classList.add("draftwalk");
                div.appendChild(walkDiv);

                var statusTag = document.createElement('span');
                statusTag.classList.add('ra-status');
                statusTag.innerHTML = walk.getStatusCategory(' ', this.settings.singleCategory);
                walk.addDisplayClasses(statusTag.classList);
                walkDiv.appendChild(statusTag);

                var contentDiv = document.createElement('span');
                contentDiv.classList.add("indent");
                contentDiv.innerHTML = walk.getWalkDate('list') + ', ' +
                        walk.getWalkMeeting('list') + ', ' +
                        walk.getWalkStart('list') + ', ' +
                        walk.getWalkTitle() + ', ' +
                        walk.getWalkDifficulty('list') +
                        walk.getWalkContact('list');
                walkDiv.appendChild(contentDiv);
                first = false;
                walkDiv.ra = {};
                walkDiv.ra.walk = walk;
                walkDiv.setAttribute('title', 'View walk details');
                walkDiv.addEventListener('click', function (e) {
                    e.currentTarget.ra.walk.previewWalk();
                });
            }
        }
        this.myjplist.init('something');
    };

    this.displayMap = function (tag) {
        var tags = [
            {name: 'comments', parent: 'root', tag: 'div'},
            {name: 'mapped', parent: 'root', tag: 'div'}
        ];
        var mapTags = ra.html.generateTags(tag, tags);
        var comment = document.createElement('p');
        comment.innerHTML = "Walks without a start/walking area are plotted in North Seaa";
        mapTags.comments.appendChild(comment);
        var lmap = new ra.leafletmap(mapTags.mapped, this.mapOptions);
        var map = lmap.map;
        var mycluster = new ra.map.cluster(map);
        var walks = this.programme.getWalks();
        var i, clen;
        for (i = 0, clen = walks.length; i < clen; ++i) {

            var walk = walks[i];
            if (walk.displayWalk) {
                walk.getAsMarker(mycluster);
            }
        }
        mycluster.addClusterMarkers();
        mycluster.zoomAll();
    };

    this.displayCalendar = function (tag) {
        var tags = [
            {name: 'comments', parent: 'root', tag: 'div'},
            {name: 'dates', parent: 'root', tag: 'div'},
            {name: 'calendar', parent: 'dates', tag: 'div', attrs: {class: 'ra-tab'}}
        ];
        var mapTags = ra.html.generateTags(tag, tags);
        var comment = document.createElement('p');
        comment.innerHTML = "Walks without a date are displayed 'Today'";
        mapTags.comments.appendChild(comment);
        var comment2 = document.createElement('p');
        comment2.innerHTML = "Click on walk to edit details";
        mapTags.comments.appendChild(comment2);
        var comment3 = document.createElement('p');
        comment3.innerHTML = "Click on date to add walk for that date";
        mapTags.comments.appendChild(comment3);
        var events = this.getEvents();
        var _this = this;
        var calendar = new FullCalendar.Calendar(mapTags.calendar, {
            height: 'auto',
            selectable: true,
            displayEventTime: false,
            eventTextColor: '#000000',
            headerToolbar: {center: 'dayGridMonth,listMonth'}, // buttons for switching between views
            events: events,

            views: {
                dayGrid: {
                    eventTimeFormat: {
                        hour: '2-digit',
                        minute: '2-digit',
                        meridiem: false
                    }
                },
                timeGrid: {
                    // options apply to timeGridWeek and timeGridDay views
                },
                week: {
                    // options apply to dayGridWeek and timeGridWeek views
                },
                day: {
                    // options apply to dayGridDay and timeGridDay views
                }
            },
            eventClick: function (info) {
                var walks = _this.programme.getWalks();
                var i, clen;
                for (i = 0, clen = walks.length; i < clen; ++i) {
                    var walk = walks[i];
                    if (walk._eventid === info.event.id) {
                        walk.previewWalk();
                    }
                }
            },
            select: function (info) {
                if (_this._loggedOn !== null) {
                    var walkdate = info.startStr;
                    var today = new Date();
                    var now = ra.date.YYYYMMDD(today);
                    if (walkdate > now) {
                        //     var url = _this._newUrl + option + "date=" + walkdate.replaceAll("-", "%20");
                        //    window.location.replace(url);
                        let event = new Event("preview-walk-newdate");
                        event.ra = {};
                        event.ra.date = walkdate;
                        document.dispatchEvent(event);
                    } else {
                        ra.showMsg('Walk MUST be in the future');
                    }
                } else {
                    ra.showMsg('You must log on to be able to add walks');
                }
            }
        });
        calendar.render();
    };
    this.getEvents = function () {
        var events = [];
        var walks = this.programme.getWalks();
        var i, clen;
        for (i = 0, clen = walks.length; i < clen; ++i) {

            var walk = walks[i];
            if (walk.displayWalk) {

                var event = walk.getAsEvent();
                walk._eventid = i.toString();
                event.id = walk._eventid;
                events.push(event);
            }
        }

        return events;
    };

    this.displayTableHeader = function (table) {
        var thead = document.createElement('thead');
        table.appendChild(thead);
        var tr = document.createElement('tr');
        thead.appendChild(tr);
        var index, len, col;
        for (index = 0, len = this.tableColumns.length; index < len; ++index) {
            col = this.tableColumns[index];
            var th = document.createElement('th');
            th.innerHTML = col.name;

            if (typeof (col.sort) !== "undefined") {
                this.myjplist.sortButton(th, col.sort.colname, col.sort.type, "asc", "▲");
                this.myjplist.sortButton(th, col.sort.colname, col.sort.type, "desc", "▼");
            }
            tr.appendChild(th);
        }
    };

    this.displayWalkRow = function (columns, table, walk, $class, $first) {
        var tr = document.createElement('tr');
        tr.setAttribute('data-jplist-item', '');
        //   walk.addDisplayClasses(tr.classList);

        tr.classList.add($class);
        if ($first) {
            tr.classList.add('first');
        }
        table.appendChild(tr);
        //   var _this = this;
        var index, len, col;
        for (index = 0, len = columns.length; index < len; ++index) {
            col = columns[index];
            var td = document.createElement('td');
            td.innerHTML = this.tableValue(walk, col.name);
            if (index === 0) {
                walk.addDisplayClasses(td.classList);
            }
            if (typeof (col.sort) !== "undefined") {
                td.setAttribute('class', col.sort.colname);
            }

            //  if (index !== columns.length - 1) {
            td.classList.add('pointer');
            td.setAttribute('title', 'View walk details');
            td.addEventListener('click', function () {
                walk.previewWalk();
            });
            //  }
            tr.appendChild(td);
        }
    };

    this.tableValue = function (walk, name) {
        switch (name) {
            case "Options":
                return this.getOptions(walk);
                break;
            case "State":
                return walk.getStatus();
                break;
            case "Category":
                return walk.getCategory();
                break;
            case "Date":
                return walk.getWalkDate('table');
                break;
            case "Meeting":
                return walk.getWalkMeeting('table');
                break;
            case "Start":
                return walk.getWalkStart('table');
                break;
            case "Title":
                return walk.getWalkTitle();
                break;
            case "Difficulty":
                return walk.getWalkDifficulty('table');
                break;
            case "Issues":
                return walk.getNoWalkIssues();
                break;
            case "Messages":
                return walk.getWalkMessages('summary');
                break;
            case "Contact":
                return  walk.getWalkContact('table');
                break;
            case "Notes":
                return  walk.getWalkNotes('table');
                break;
            case "Status":
                return  walk.getStatusCategory('<br/>', this.settings.singleCategory);
                break;
        }
        return 'unknown';
    };
    this.getOptions = function (walk) {
        return this.getOptionEdit(walk) + this.getOptionDelete(walk);
    };
    this.getOptionEdit = function (walk) {
        return '<a href="javascript:ra.walkseditor.comp.editWalk(\'' + walk.id + '\')" class="btn btn-mini" type="button">' +
                '<i class="icon-edit" title="Edit walk"></i></a>';

    };
    this.getOptionDelete = function (walk) {
        return '<a href="javascript:ra.walkseditor.comp.deleteWalk(\'' + walk.id + '\')" class="btn btn-mini delete-button" type="button">' +
                ' <i class="icon-trash" title="Delete walk"></i></a>';
    };
};
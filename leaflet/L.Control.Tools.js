var L, ra, OsGridRef;
L.Control.Tools = L.Control.extend({
    options: {
        position: 'topleft'
    },

    onAdd: function (map) {
        var _this = this;
        this._map = map;

        this._container = document.createElement('div');
        this._button = L.DomUtil.create('div', 'ra-map-tools-icon leaflet-bar leaflet-control', this._container);
        this._button.title = 'Mapping tools';
        this._toolsDiv = L.DomUtil.create('div', 'leaflet-tools-container', this._container);

        this._toolsDiv.style.display = 'none';

        this._container.addEventListener("mouseenter", function (e) {
            _this._openTools();
        });
        this._container.addEventListener("mouseover", function (e) {
            _this._openTools();
        });
        this._toolsDiv.addEventListener("mouseleave", function (e) {
            _this._toolsDiv.style.display = 'none';
        });
        this._container.addEventListener("mouseleave", function (e) {
            _this._toolsDiv.style.display = 'none';
        });
        this._container.addEventListener("click", function (e) {
            if (_this._toolsDiv.style.display === 'grid') {
                _this._toolsDiv.style.display = 'none';
            } else {
                _this._openTools();

            }
        });
        return this._container;
    },
    getToolsDiv: function () {
        return this._toolsDiv;
    },
    _openTools: function () {
        this._toolsDiv.style.display = 'grid';
        let event = new Event("ra-map-tools-open");
        document.dispatchEvent(event);
    },
    onRemove: function (map) {
        //  map.off('mousemove', this._update);
    }

});
L.control.tools = function (options) {
    return new L.Control.Tools(options);
};

L.Control.ZoomAll = L.Control.extend({
    options: {
        position: 'topleft',
        title: 'Zoom to display all information',
        titledisabled: 'No information displayed on map - Zoomall disabled'
    },

    onAdd: function (map) {
        var _this = this;
        this._map = map;
        this._container = L.DomUtil.create('div', 'ra-zoomall-icon leaflet-bar leaflet-control', this._container);
        this._container.title = this.options.title;
        L.DomEvent.on(this._container, 'click', function (ev) {
            L.DomEvent.stopPropagation(ev);
             var result = _this._getBounds();
            if (result.isSet) {
                _this._map.flyToBounds(result.bounds, {padding: [50, 50], duration: 1});
            }
        });
        document.addEventListener("ra-map-tools-open", function (e) {
            _this.setStatus();
        });
        return this._container;
    },
    setStatus: function () {
        var result = this._getBounds();
        if (result.isSet) {
            L.DomUtil.removeClass(this._container, 'disabled');
            this._container.title = this.options.title;
        } else {
            L.DomUtil.addClass(this._container, ' disabled');
            this._container.title = this.options.titledisabled;
        }
    },
    _getBounds: function () {
        var bounds = L.latLngBounds([]);
        this._map.eachLayer(function (layer) {
            if (layer.options) {
                switch (layer.options.pane) {
                    case"markerPane":
                        if (typeof layer.getBounds === 'function') {
                            var layerBounds = layer.getBounds();
                            bounds.extend(layerBounds);
                        } else {
                            var latlng = layer.getLatLng();
                            bounds.extend(latlng);
                        }
                        break;
                    case "overlayPane":
                        if (typeof layer.getBounds === 'function') {
                            if (!layer.options.hasOwnProperty('ignore')) {
                                var layerBounds = layer.getBounds();
                                bounds.extend(layerBounds);
                            }

                        }
                        break;
                }
            }
        });

        var _isSet = bounds.getNorthEast() !== undefined;
        var result = {isSet: _isSet, bounds: bounds};
        return result;
    },

    onRemove: function (map) {
        //  map.off('mousemove', this._update);
    }

});
L.control.zoomall = function (options) {
    return new L.Control.ZoomAll(options);
};
var L;
L.Control.RAContainer = L.Control.extend({
    options: {
        id: null,
        position: 'bottomright'
    },
    onAdd: function (map) {
        this._map = map;

        var container = L.DomUtil.create('div', 'leaflet-control-ra-container');
        this.container = container;
        if (this.options.id !== null) {
            container.setAttribute('id', this.options.id);
        }
        return container;
    },
    setText: function (text) {
        this.container.innerHTML = text;
    }
});
L.control.racontainer = function (options) {
    return new L.Control.RAContainer(options);
};

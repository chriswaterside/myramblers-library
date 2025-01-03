<?php

/**
 * Description of mapdraw
 *
 * @author Chris Vaughan
 */
class RLeafletMapcompare extends RLeafletMap {

    private $zoom = 10;
    private $lat = 52.89;
    private $long = -1.48;
    public $displayDescription = true;

    public function __construct() {
        parent::__construct();
    }

    public function setCenter($lat, $long, $zoom) {
        $this->options->setinitialviewView($lat, $long, $zoom);
    }

    public function display() {
        parent::setCommand('ra.display.mapCompare');

        $this->help_page = "map-compare.html";
        $this->options->fullscreen = false;

        $this->options->mouseposition = true;
        $this->options->rightclick = true;
        $this->options->fitbounds = true;
        $this->options->resizer = false;
        $this->options->displayElevation = false;
        $this->options->cluster = null;
        $this->options->mylocation = true;
        $this->options->settings = true;
        $this->options->print = true;
        $this->options->latitude = $this->lat;
        $this->options->longitude = $this->long;
        $this->options->zoom = $this->zoom;

        parent::display();

        RLoad::addScript("media/lib_ramblers/leaflet/ra.display.mapCompare.js", "text/javascript");
        RLoad::addStyleSheet('media/lib_ramblers/css/ramblerslibrary.css');
    }
}

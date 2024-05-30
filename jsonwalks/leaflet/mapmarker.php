<?php

/**
 * Description of mapmarker
 *
 * @author Chris Vaughan
 */
class RJsonwalksLeafletMapmarker extends RJsonwalksDisplaybase {

    private $map;
    private $walkClass = "walk";
    private $legendposition = "top";
    public $displayGradesSidebar = true;

    public function __construct() {
        $this->map = new RLeafletMap;
        $this->map->setCommand("ra.display.walksMap");
        $this->map->help_page = "ledwalks.html";
        $options = $this->map->options;
        $options->cluster = true;
        // $options->displayElevation = true;
        $options->fullscreen = true;
        $options->mylocation = true;
        $options->settings = true;
        $options->mouseposition = true;
        $options->rightclick = true;
        $options->fitbounds = true;
        $options->print = true;
    }

    public function getMap() {
        return $this->map;
    }

    public function mapHeight($height) {
        $this->map->mapHeight = $height;
    }

    public function mapWidth($width) {
        $this->map->mapWidth = $width;
    }

    public function setLegend($position) {
        $this->legendposition = $position;
    }

    public function DisplayWalks($walks) {
        $items = $walks->allWalks();
        $data = new class {
            
        };
        $data->walks = array_values($items);
        //  $data->walks = [];

        $data->legendposition = $this->legendposition;
        $this->map->setDataObject($data);
        $this->map->display();
        RLoad::addScript("media/lib_ramblers/jsonwalks/leaflet/mapmarker.js", "text/javascript");
    }
}

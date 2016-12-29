<?php

/**
 * Description of mapmarker
 *
 * @author Chris Vaughan
 */
class RLeafletGpxMap extends RLeafletMap {

    public $linecolour = "#782327";
    public $imperial = false;

    public function __construct() {
        parent::__construct();
    }

    public function displayPath($gpx) {
        $opts=new RLeafletMapoptions();
        $opts->cluster=false;
        $this->options->cluster=false;
        $this->addElevation = true;
        if ($this->imperial) {
            $imperial = "true";
        } else {
            $imperial = "false";
        }
        $file = JURI::root() . $gpx;
        //   echo $file;
      $text="displayGPX(ramblersMap, '$gpx', '$this->linecolour', $imperial)";
        parent::addContent($text);
        if (file_exists($gpx)) {
            parent::display();
        } else {
            $application = JFactory::getApplication();
            $application->enqueueMessage(JText::_('GPX: Route file not found: ' . $file), 'error');
            echo "<p><b>Unable to display gpx file</b></p>";
        }
    }

}

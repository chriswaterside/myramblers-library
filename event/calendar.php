<?php

/**
 * Description of WalksCalendar
 *
 * @author Chris Vaughan
 */
// no direct access
defined("_JEXEC") or die("Restricted access");

class REventCalendar extends RJsonwalksDisplaybase {

    private $size;
    private $mDisplayAll = false;

    function __construct($size) {
        $this->size = 250;
        If ($size == 250) {
            $this->size = 250;
        }
        If ($size == 400) {
            $this->size = 400;
        }
    }

    function DisplayWalks($walks) {
        echo "REventCalendar: this way of using this class is not supported";
    }

    public function displayAll() {
        $this->mDisplayAll = true;
    }

    function Display($events) {
        $document = JFactory::getDocument();
        $document->addStyleSheet(JURI::base() . 'ramblers/calendar/calendar.css');
        $document->addScript("ramblers/js/racalendar.js", "text/javascript");
        $cal = new RCalendar($this->size, $this->mDisplayAll);
        $cal->show($events);
    }

}

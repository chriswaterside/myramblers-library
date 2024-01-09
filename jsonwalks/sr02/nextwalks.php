<?php

/**
 * Description of WalksDisplay
 *
 * @author Chris Vaughan
  Modified Brian Smith Easy Surrey Walkers
 */
// no direct access
defined("_JEXEC") or die("Restricted access");

class RJsonwalksSr02Nextwalks extends RJsonwalksStdNextwalks {

    public $walkClass = "sr02walk";

    public function __construct() {
        parent::__construct();
        parent::customFormat(["{dowddmm}", "{;xTitle}", "{,distance}"]);
        RJsonwalksWalk::setCustomValues($this, "customValue");
        parent::setWalksClass($this->walkClass);
        $document = JFactory::getDocument();
        $document->addStyleSheet("media/lib_ramblers/jsonwalks/sr02/style.css");
    }

    public function customValue($option, $walk) {
        $response = new stdClass();
        $response->found = true;
        $response->out = "";
        switch ($option) {
            case "{xTitle}":
                  $response->out = $walk->getIntValue("basics", "title");
                break;
            case "{xSymbol}":
                /* Picnic or Pub icon */
                if (stristr($walk->getIntValue("basics", "additionalNotes"), "picnic")) {
                    $response->out = '<img src="media/lib_ramblers/jsonwalks/sr02/Sandwich-icon.png" title="Picnic Required" width="24" height="24" align="left"/>';
                    break;
                }
                if (stristr($walk->getIntValue("basics", "additionalNotes"), "pub")) {
                    $response->out = '<img src="media/lib_ramblers/jsonwalks/sr02/beer.png" title="Pub Lunch" width="24" height="24" align="left"/>';
                }
                break;
            case "{xNationalGrade}":
                $response->out =  $walk->getIntValue("walks", "nationalGrade");
                break;
            case "{xContact}":
              $response->out = "<b>" .  $walk->getIntValue("contacts", "contactName") . "</b>";
                break;
            default:
                $response->found = false;
                break;
        }

        return $response;
    }

}

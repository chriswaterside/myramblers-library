<?php

/**
 * Description of WalksDisplay
 *
 * @author Chris Vaughan
 */
// no direct access
defined("_JEXEC") or die("Restricted access");

class RJsonwalksStdCancelledwalks extends RJsonwalksDisplaybase {

    private $walksClass = "cancelledWalks";
    private $walkClass = "cancelledWalk";
    public $message = "<h3>Sorry - the following walk(s) have been cancelled</h3>";
    private $listFormat = ["{,meet}",
        "{,start}",
        "{,title}",
        "{,distance}",
        "{,contactname}",
        "{,telephone}"];

    public function DisplayWalks($walks) {
        echo $this->getWalksOutput($walks);
    }

    public function getWalksOutput($walks) {
        $out = "";
        $walks->sort(RJsonwalksWalk::SORT_DATE, RJsonwalksWalk::SORT_TIME, RJsonwalksWalk::SORT_DISTANCE);
        $items = $walks->allWalks();
        $walkslist = "";
        $cancelledWalks=[];
        foreach ($items as $walk) {
            if ($walk->isCancelled()) {
                $cancelledWalks[]=$walk;
                $walkslist .= $this->displayWalk($walk);
            }
        }
        if ($walkslist != "") {
            $out .= "<div class='" . $this->walksClass . "' >" . PHP_EOL;
            $out .= $this->message;
            $out .= $walkslist;
            $out .= "</div><p></p>" . PHP_EOL;
        }
        RLeafletScript::registerWalks(array_values($cancelledWalks));
        return $out;
    }

    public function setWalksClass($class) {
        $this->walksClass = $class;
    }

    public function setWalkClass($class) {
        $this->walkClass = $class;
    }

    private function displayWalk($walk) {
        $out = "";
        $groupName = $walk->getIntValue("admin", "groupName");
        $cancellationReason = $walk->getIntValue("admin", "cancellationReason");
        $walkDate = $walk->getIntValue("basics", "walkDate");
        $out .= "<div><b>" . $groupName . ": " . $walkDate->format('l, jS F') . "</b>";
        $out .= $walk->getWalkValues($this->listFormat);
        if ($cancellationReason === "") {
            $cancellationReason = "No reason given";
        }
        $out .= "</div><div class='cancelreason' ><b>Reason:</b> " . $cancellationReason . "</div>" . PHP_EOL;
        return $out;
    }

}

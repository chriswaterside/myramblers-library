<?php

class RJsonwalksWalks {

    private $arrayofwalks;
    private $sortorder1;
    private $sortorder2;
    private $sortorder3;

    public function __construct() {
        $this->arrayofwalks = [];
    }

    public function addWalk($walk) {
        foreach ($this->arrayofwalks as $item) {
            if ($item->isWalk($walk)) {
                return;
            }
        }
        $this->arrayofwalks[] = $walk;
    }

    public function hasMeetPlace() {
        foreach ($this->arrayofwalks as $walk) {
            if ($walk->hasMeetPlace()) {
                return true;
            }
        }
        return false;
    }

    public function setNewWalks($days) {
        $date = new DateTime();
        If ($days <= 0) {
            $interval = "P" . 10 . "D";
        } else {
            $interval = "P" . $days . "D";
        }
        $interval = new DateInterval($interval);
        If ($days <= 0) {
            $interval->invert = 1;
        }
        $date->sub($interval);
        $items = $this->allWalks();
        foreach ($items as $walk) {
            $walk->setNewWalk($date);
        }
    }

    public function removeWalk($key) {
        unset($this->arrayofwalks[$key]);
    }

    public function filterDistanceFromLatLong($lat, $lon, $distanceKm) {
        foreach ($this->arrayofwalks as $key => $walk) {
            if ($walk->distanceFromLatLong($lat, $lon) > $distanceKm) {
                unset($this->arrayofwalks[$key]);
            }
        }
    }

    public function filterGroups($groups) {
        foreach ($this->arrayofwalks as $key => $walk) {
            if ($walk->notInGroup($groups)) {
                unset($this->arrayofwalks[$key]);
            }
        }
    }

    private function contains($needle, $haystack) {
        return strpos($haystack, $needle) !== false;
    }

    public function filterStatus($status) {
        foreach ($this->arrayofwalks as $key => $walk) {
            if ($walk->isStatus($status)) {
                unset($this->arrayofwalks[$key]);
            }
        }
    }

    public function filterCancelled() {
        $this->filterStatus("CANCELLED");
    }

    public function filterDayofweek($days) {
        foreach ($this->arrayofwalks as $key => $walk) {
            if ($walk->notInDayList($days)) {
                unset($this->arrayofwalks[$key]);
            }
        }
    }

    public function filterDateRange($fromdate, $todate) {
        foreach ($this->arrayofwalks as $key => $walk) {
            if ($walk->filterDateRange($fromdate, $todate)) {
                unset($this->arrayofwalks[$key]);
            }
        }
    }

    public function filterTitle($filter, $option = 'remove') {
        foreach ($this->arrayofwalks as $key => $walk) {
            if ($option === 'remove') {
                if ($walk->titleIs($filter)) {
                    unset($this->arrayofwalks[$key]);
                }
            }
            if ($option === 'keep') {
                if (!$walk->titleIs($filter)) {
                    unset($this->arrayofwalks[$key]);
                }
            }
        }
    }

    public function filterTitleContains($filter, $option = 'remove') {
        foreach ($this->arrayofwalks as $key => $walk) {
            if ($option === 'remove') {
                if ($walk->titleContains($filter)) {
                    unset($this->arrayofwalks[$key]);
                }
            }
            if ($option === 'keep') {
                if (!$walk->titleContains($filter)) {
                    unset($this->arrayofwalks[$key]);
                }
            }
        }
    }

    public function filterNationalGrade($grades) {
        foreach ($this->arrayofwalks as $key => $walk) {
            if ($walk->notInGradeList($grades)) {
                unset($this->arrayofwalks[$key]);
            }
        }
    }

    public function filterDistance($distanceMin, $distanceMax) {
        foreach ($this->arrayofwalks as $key => $walk) {
            // if outside of the range then remove the walk
            if ($walk->filterDistance($distanceMin, $distanceMax)) {
                unset($this->arrayofwalks[$key]);
            }
        }
    }

    public function filterFlags($flags, $include = true) {
        foreach ($this->arrayofwalks as $key => $walk) {
            if ($walk->filterFlags($flags, $include )) {
                unset($this->arrayofwalks[$key]);
            }
        }
    }

    public function filterEvents() {
        foreach ($this->arrayofwalks as $key => $walk) {
            if ($walk->filterEvents()) {
                unset($this->arrayofwalks[$key]);
            }
        }
    }

    public function filterWalks() {
        foreach ($this->arrayofwalks as $key => $walk) {
            if ($walk->filterWalks()) {
                unset($this->arrayofwalks[$key]);
            }
        }
    }

    public function limitNumberWalks($no) {
        $i = 0;
        foreach ($this->arrayofwalks as $key => $value) {
            $i += 1;
            if ($i > $no) {
                unset($this->arrayofwalks[$key]);
            }
        }
    }

    public function noWalks($no) {
        // deprecated
        $this->limitNumberWalks($no);
    }

    public function appendWalkTitle($titles) {
        foreach ($this->arrayofwalks as $key => $walk) {
            $groupCode = $walk->getIntValue("admin", "groupCode");
            if (isset($titles[$groupCode])) {
                $walk->title = $walk->title . $titles[$groupCode];
            }
        }
    }

    public function walksInFuture($period) {
        $today = new DateTime();
        $interval = new DateInterval($period);
        $today->add($interval);
        foreach ($this->arrayofwalks as $key => $value) {
            $date = $value->walkDate;
            if ($date > $today) {
                unset($this->arrayofwalks[$key]);
            }
        }
    }

    public function sort($sortorder1, $sortorder2, $sortorder3) {
        $this->sortorder1 = $sortorder1;
        $this->sortorder2 = $sortorder2;
        $this->sortorder3 = $sortorder3;
        usort($this->arrayofwalks, array($this, "sortData1"));
    }

    private function sortData1($a, $b) {
        $val1 = $a->getSortValue($this->sortorder1);
        $val2 = $b->getSortValue($this->sortorder1);
        if ($val1 == $val2) {
            return $this->sortData2($a, $b);
        }
        return ($val1 < $val2 ) ? -1 : 1;
    }

    private function sortData2($a, $b) {
        $val1 = $a->getSortValue($this->sortorder2);
        $val2 = $b->getSortValue($this->sortorder2);
        if ($val1 == $val2) {
            return $this->sortData3($a, $b);
        }
        return ($val1 < $val2 ) ? -1 : 1;
    }

    private function sortData3($a, $b) {
        $val1 = $a->getSortValue($this->sortorder3);
        $val2 = $b->getSortValue($this->sortorder3);
        if ($val1 == $val2) {
            return 0;
        }
        return ($val1 < $val2 ) ? -1 : 1;
    }

    public function allWalks() {
        return $this->arrayofwalks;
    }

    public function totalWalks() {
        $no = count($this->arrayofwalks);
        return $no;
    }

    public function events() {
        $arrayevents = array();
        foreach ($this->arrayofwalks as $key => $value) {
            $arrayevents[] = $value->event();
        }
        return $arrayevents;
    }

    public function __destruct() {
        
    }

}

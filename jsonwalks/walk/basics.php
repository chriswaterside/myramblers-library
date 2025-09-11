<?php

/**
 * Description of basics
 *
 * @author chris
 */
class RJsonwalksWalkBasics implements JsonSerializable {

    private $admin;
    private $walkDate;               // date of the walk as a datetime object
    private $finishDate;             // End/Finish date time or NULL
    private $multiDate = false;      // is item a multi date event true/false
    private $dayofweek;              // day of the week as text
    private $day;                    // the day number as text
    private $month;                  // the month as text  
    private $description = "";       // description of walk with html tags removed
    private $descriptionHtml = "";   // description of walk with html tags
    private $additionalNotes = "";   // the additional notes field as text
    private $title = "";             // Title of the walk
    private $external_url;           // external url for link to popup of walk on group web site

    public function __construct($admin, DateTime $walkDate, ?DateTime $finishDate, string $title, string $descriptionHtml,
            string $additionalNotes, ?string $external_url) {
        $this->admin = $admin;
        $this->walkDate = $walkDate;
        $this->finishDate = $finishDate;
        if ($finishDate !== null) {
            $this->multiDate = $this->walkDate->format('Y-m-d') !== $this->finishDate->format('Y-m-d');
        }
        $this->title = RHtml::removeNonBasicTags($title);
        $desc = str_replace(array("\r\n", "\n", "\r"), '', $descriptionHtml);  // CRLF not needed in Html and srews up ICS output
        $this->descriptionHtml = trim(RHtml::convert_mails($desc)); // change email addresses so do not have a link
        $desc2 = RHtml::removeNonBasicTags($desc);
        $this->description = trim(RHtml::convert_mails($desc2));
        $this->additionalNotes = str_replace(array("\r\n", "\n", "\r"), '', $additionalNotes);  // CRLF not needed in Html and srews up ICS output
        if ($external_url !== null && $external_url !== "") {
            $this->additionalNotes .= "<div> <b>Website:</b> <a href='" . $external_url . "' target='_blank'>" . $external_url . "</a><br/></div>";
        }
        $this->checkCancelledStatus();
        $this->dayofweek = $this->walkDate->format('l');
        $this->month = $this->walkDate->format('F');
        $this->day = $this->walkDate->format('jS');
    }

    public function getValue($option) {
        $out = "";
        switch ($option) {
            case "{title}":
                $out = $this->title;
                $out = "<b>" . $out . "</b>";
                break;
            case "{description}":
                $out = $this->description;
                break;
            case "{additionalNotes}":
                $out = $this->additionalNotes;
                break;
            case "{finishTime}":
                if ($this->finishDate !== null) {
                    $timeHHMM = $this->finishDate->format('g:ia');
                    $out = str_replace(":00", "", $timeHHMM);
                }
                break;
            case "{dowShortdd}":
                $out = $this->dateRange('D, jS ');
                break;
            case "{dowShortddmm}":
                $out = $this->dateRange('D, jS F', true);
                break;
            case "{dowShortddmmyyyy}":
                $out = $this->dateRange('D, jS F Y');
                break;
            case "{dowdd}":
                $out = $this->dateRange('l, jS');
                break;
            case "{dowddmm}":
                $out = $this->dateRange('l, jS F', true);
                break;
            case "{dowddmmyyyy}":
                $out = $this->dateRange('l, jS F Y');
                break;
        }
        return $out;
    }

    private function dateRange($format, $addYear = false) {
        $out = $this->walkDate->format($format);
        if ($addYear) {
            $out = $out . $this->addYear();
        }
        if ($this->multiDate) {
            $out = $out . " - " . $this->finishDate->format($format);
        }
        return "<b>" . $out . "</b>";
    }

    public function getIntValue($option) {
        switch ($option) {
            case "walkDate":
                return $this->walkDate;
            case "monthgroup":
                return $this->month . $this->addYear();
            case "description":
                return $this->description;
            case "descriptionHtml":
                return $this->descriptionHtml;
            case "title":
                return $this->title;
            case "additionalNotes":
                return $this->additionalNotes;
        }
        $app = JFactory::getApplication();
        $app->enqueueMessage("Internal error, invalid Basics value: " . $option);
        return "";
    }

    private function checkCancelledStatus() {
        $contains = $this->contains("cancelled", strtolower($this->title));
        $isC = $this->admin->isCancelled();
        if ($isC && $contains) {
            return;
        }
        if ($contains) {
            $this->admin->setCancelled();
        }
        if ($isC) {
            if (!$contains) {
                $this->title = $this->title . "  CANCELLED";
            }
        }
    }

    public function notInDayList($days) {
        foreach ($days as $value) {
            if (strtolower($value) == strtolower($this->dayofweek)) {
                return false;
            }
        }
        return true;
    }

    public function filterDateRange($fromdate, $todate) {
        return ($this->walkDate < $fromdate || $this->walkDate > $todate);
    }

    public function titleIs($filter) {
        return strtolower($filter) === strtolower($this->title);
    }

    public function titleContains($filter) {
        return $this->contains(strtolower($filter), strtolower($this->title));
    }

    public function appendWalkTitle($extra) {
        $this->title = $extra . $this->title;
    }

    private function contains($needle, $haystack) {
        return strpos($haystack, $needle) !== false;
    }

    private function addYear() {
        $walkyear = $this->walkDate->format('Y');
        $newDate = new DateTime();
        $newDate->add(new DateInterval('P300D'));
        //  $walkDate = new Date($this-> walkDate);
        if ($this->walkDate < $newDate) {
            return '';
        } else {
            return ' ' . $walkyear;
        }
    }

    #[\Override]
    public function jsonSerialize(): mixed {
        return [
            'walkDate' => $this->walkDate,
            'finishDate' => $this->finishDate,
            'multiDate' => $this->multiDate,
            'title' => $this->title,
            'description' => $this->description,
            'descriptionHtml' => $this->descriptionHtml,
            'additionalNotes' => $this->additionalNotes,
            'external_url' => $this->external_url
        ];
    }
}

<?php

/**
 * Description of feedoptions
 *
 * @author chris
 */
class RJsonwalksFeedoptions {

    private $limit = null;
    private $distance = null;
    private $days = null;
    private $sources = [];
    private $walksmanageractive = false;
    private $gwemactive = true;
    private $include_walks = true;
    private $include_events = false;

    public function __construct($value = "") {
        // input can be a list of groups 
        // a full url
        // or a null string
        if ($value === '') {
            return;
        }
        $value = strtolower($value);
        if ($this->startsWith(strtolower($value), 'http')) {
            $groups = $this->processGWEMurl($value);
            If ($groups === false) {
                return;
            }
        } else {
            $groups = $value;
        }
        if ($this->walksmanageractive) {
            $source = new RJsonwalksSourcewalksmanager($groups);
            $this->sources[] = $source;
        }
        if ($this->gwemactive) {
            $source = new RJsonwalksSourcegwem($groups);
            $this->sources[] = $source;
        }
    }

    public function includeEvents()
    {
        foreach ($this->sources as $source)
        {
            if ($source instanceof RJsonwalksSourcegwem)
            {
                // This is a GWEM feed so set the value.
                $source->include_events = true;
            }
        }
    }
    public function excludeEvents()
    {
        foreach ($this->sources as $source)
        {
            if ($source instanceof RJsonwalksSourcegwem)
            {
                // This is a GWEM feed so set the value.
                $source->include_events = false;
            }
        }
    }
    public function includeWalks()
    {
        foreach ($this->sources as $source)
        {
            if ($source instanceof RJsonwalksSourcegwem)
            {
                // This is a GWEM feed so set the value.
                $source->include_walks = true;
            }
        }
    }
    public function excludeWalks()
    {
        foreach ($this->sources as $source)
        {
            if ($source instanceof RJsonwalksSourcegwem)
            {
                // This is a GWEM feed so set the value.
                $source->include_walks = false;
            }
        }
    }

    public function getWalkStatus()
    {
        return $include_walks;
    }

    public function getEventStatus()
    {
        return $include_events;
    }

    private function processGWEMurl($value) {
        $parts = parse_url($value);
        if ($parts === false) {
            echo 'Invalid GWEM url supplied';
            return false;
        }
        if ($parts['path'] !== "/api/lbs/walks") {
            echo 'Invalid GWEM url supplied';
            return false;
        }
        $query = $parts['query'];
        $queryParts = null;
        parse_str($query, $queryParts);
        $groups = $queryParts['groups'];
        If ($groups === null or $groups === '') {
            echo "No groups supplied in GWEM feed";
            return false;
        }
        if (array_key_exists('distance', $queryParts)) {
            $this->distance = $queryParts['distance'];
        }
        if (array_key_exists('limit', $queryParts)) {
            $this->limit = $queryParts['limit'];
        }
        if (array_key_exists('days', $queryParts)) {
            $this->days = $queryParts['days'];
        }

        return $groups;
    }

    public function addWalksEditorWalks($groupCode, $groupName, $site) {
        $source = new RJsonwalksSourcewalkseditor($groupCode, $groupName, $site);
        $this->sources[] = $source;
    }

    public function getWalks($walks) {
        foreach ($this->sources as $source) {
            $source->getWalks($walks);
        }
        $walks->sort(RJsonwalksWalk::SORT_DATE, RJsonwalksWalk::SORT_TIME, RJsonwalksWalk::SORT_DISTANCE);
        return;
    }

    public function setLimit($limit) {
        $this->limit = $limit;
    }

    public function getLimit() {
        return $this->limit;
    }

    public function getDistance() {
        if ($this->distance !== null) {
            $distance = explode('-', $this->distance);
            return $distance;
        }
        return $this->distance;
    }

    public function getDays() {
        if ($this->days !== null) {
            $days = explode(',', $this->days);
            return $days;
        }
        return $this->days;
    }

    private function startsWith($string, $startString) {
        $len = strlen($startString);
        return (substr($string, 0, $len) === $startString);
    }

// repeat for other gwem options
}

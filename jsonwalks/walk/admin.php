<?php

/**
 * Description of admin
 *
 * @author chris
 */
class RJsonwalksWalkAdmin implements JsonSerializable {

    private $source;                 // GWEM, Walks Editor or Walks Manager
    private $id;                     // database ID of walk on Walks Finder
    private $groupCode;              // group code e.g. SR01
    private $groupName;              // the group name e.g. Derby & South Derbyshire
    private $dateUpdated;            // date of the walk as a datetime object
    private $dateCreated;            // date of the walk as a datetime object
    private $status = "";                 // whether the walk is published, cancelled etc
    private $cancellationReason = "";     // text reason walk cancelled
    private $nationalUrl = "";    // url to access the ramblers.org.uk page for this walk
    private $type = TypeOfWalk::Unknown; // type of ite: walk, event or well being walk

    public function __construct(string $source, string $type, string $id, string $groupCode, string $groupName,
            string $status, string $cancellationReason, string $nationalUrl, DateTime $dateUpdated, DateTime $dateCreated) {
        $this->source = $source;
        $this->type = $type;
        $this->id = strval($id);
        $this->groupCode = $groupCode;
        $this->groupName = $groupName;
        $this->status = null;
        switch (strtolower($status)) {
            case "published":
            case "confirmed ":
                $this->status = "Published";
                break;
            case "cancelled":
                $this->status = "Cancelled";
                break;
        }
        $this->cancellationReason = $cancellationReason;
        $this->nationalUrl = $nationalUrl;
        $this->dateUpdated = $dateUpdated;
        $this->dateCreated = $dateCreated;
    }

    public function getValue($option) {
        $out = "";
        switch ($option) {
          
           case "{group}":
                $out = $this->groupName;
                break;
        }
        return $out;
    }

    public function getIntValue($option) {
        switch ($option) {
            case "groupCode":
                return $this->groupCode;
            case "groupName":
                return $this->groupName;
            case "id":
                return $this->id;
            case "dateCreated":
                return $this->dateCreated;
            case "dateUpdated":
                return $this->dateUpdated;
            case "status":
                return $this->status;
            case "cancellationReason":
                return $this->cancellationReason;
            case "nationalUrl":
                return $this->nationalUrl;
        }
        $app = JFactory::getApplication();
        $app->enqueueMessage("Internal error, invalid Admin value: " . $option);
        return "";
    }

    public function setNewWalk(DateTime $date) {
        if (strtolower($this->status) == "new") {
            $this->status = "Published";
        }
        if (strtolower($this->status) == "published") {
            if ($this->dateUpdated > $date) {
                $this->status = "New";
            }
        }
    }

    public function setCancelled() {
        $this->status = "Cancelled";
    }

    public function isCancelled() {
        return strtolower($this->status) === "cancelled";
    }

    public function isNew() {
        return strtolower($this->status) === "new";
    }

    public function jsonSerialize(): mixed {
        return [
            'source' => $this->source,
            'type' => $this->type,
            'id' => $this->id,
            'groupCode' => $this->groupCode,
            'groupName' => $this->groupName,
            'status' => $this->status,
            'cancellationReason' => $this->cancellationReason,
            'nationalUrl' => $this->nationalUrl,
            'dateUpdated' => $this->dateUpdated,
            'dateCreated' => $this->dateCreated
        ];
    }

}

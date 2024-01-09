<?php

/**
 * Description of WalksDisplay
 *
 * @author Chris Vaughan
 */
// no direct access
defined("_JEXEC") or die("Restricted access");

class RJsonwalksStdListleaders extends RJsonwalksDisplaybase {

    function DisplayWalks($walks) {

        $walks->sort(RJsonwalksWalk::SORT_CONTACT, RJsonwalksWalk::SORT_TELEPHONE1, NULL);
        $items = $walks->allWalks();
        $last = "";
        echo "<h2>List of Walks Leaders</h2>" . PHP_EOL;
        echo "<ul>" . PHP_EOL;
        foreach ($items as $walk) {
            $contactName = $walk->getIntValue("contacts", "contactName");
            $telephone1 = $walk->getIntValue("contacts", "telephone1");
            $telephone2 = $walk->getIntValue("contacts", "telephone2");
            $value = "";
            if ($contactName !== "") {
                $value = $contactName . " - " . $telephone1;
            }

            if ($telephone2 !== "") {
                $value .= " ," . $telephone2;
            }
            if ($value <> $last) {
                if ($value !== "") {
                    echo "<li>" . $value . "</li>" . PHP_EOL;
                }
                $last = $value;
            }
        }
        echo "</ul>" . PHP_EOL;
    }

}

<?php

/**
 * Enable web master to specify license keys
 *
 * @author Chris Vaughan
 */
class RLicense {

    private static $openRoutingServicelicensekey = null;

    public static function OpenRoutingServiceKey($value) {
        self::$openRoutingServicelicensekey = $value;
    }

    public static function getOpenRoutingServiceKey() {
        return self::$openRoutingServicelicensekey;
    }

    public static function isOpenRoutingServiceKeySet() {
        return self::$openRoutingServicelicensekey != "undefined";
    }

    // Common licenses for all domains

    public static function getOrdnanceSurveyLicenseTestKey() {
        if (strpos(JURI::base(), 'localhost') !== false) {
            return 'OL9IpgZ7gHe35WaXPKrpTIQRkiMS9UAb';
        }
        if (strpos(JURI::base(), 'locahaberandlorn-ramblers') !== false) {
            return 'OL9IpgZ7gHe35WaXPKrpTIQRkiMS9UAb';
        }
        return null;
    }

    public static function getOrdnanceSurveyLicenseKey() {
        if (strpos(JURI::base(), 'localhost') !== false) {
            return '0af3JPmbRyCAkGAjns8RA5YGsv4qIATl';
        }
        if (strpos(JURI::base(), 'locahaberandlorn-ramblers') !== false) {
            return '0af3JPmbRyCAkGAjns8RA5YGsv4qIATl';
        }
        return null;
    }

    // key to display OS test style map
    public static function getOrdnanceSurveyLicenseKeyTestStyle() {
        if (strpos(JURI::base(), 'localhost') !== false) {
            return '0af3JPmbRyCAkGAjns8RA5YGsv4qIATl';
        }
        if (strpos(JURI::base(), 'locahaberandlorn-ramblers') !== false) {
            return '0af3JPmbRyCAkGAjns8RA5YGsv4qIATl';
        }
        return null;
    }

    public static function getMapBoxLicenseKey() {
        if (strpos(JURI::base(), 'localhost') !== false) {
            return 'pk.eyJ1IjoiY2hyaXN2YXVnaGFuIiwiYSI6ImNrMGZkMHdmejAwZXEzY253eTV1Znd2YncifQ.kCx-9Kq-SFA0UOsHvIMDMg';
        }
        if (strpos(JURI::base(), 'locahaberandlorn-ramblers') !== false) {
            return 'pk.eyJ1IjoiY2hyaXN2YXVnaGFuIiwiYSI6ImNrMGZkMHdmejAwZXEzY253eTV1Znd2YncifQ.kCx-9Kq-SFA0UOsHvIMDMg';
        }

        return null;
    }

    public static function getThunderForestLicenseKey() {
        if (strpos(JURI::base(), 'localhost') !== false) {
            return 'bc99bda92702488ba51a8ca395da6807';
        }
        if (strpos(JURI::base(), 'locahaberandlorn-ramblers') !== false) {
            return 'bc99bda92702488ba51a8ca395da6807';
        }
        return null;
    }

    public static function getESRILicenseKey() {
        if (strpos(JURI::base(), 'localhost') !== false) {
            return "";
        }
        if (strpos(JURI::base(), 'locahaberandlorn-ramblers') !== false) {
            return "";
        } else {
            return null;
        }
    }

    public static function getOSMVectoricenseKey() {
        if (strpos(JURI::base(), 'localhost') !== false) {
            return "";
        }
        if (strpos(JURI::base(), 'locahaberandlorn-ramblers') !== false) {
            return "";
        } else {
            return null;
        }
    }

    public static function getBingMapKey() {
        $endLicenseDate = new DateTime("2025-07-01");
        $now = new DateTime();
        if ($endLicenseDate < $now) {
            return null;
        }
        return 'AslaaoNJXOTEF-i8IS4cWAWnsxOuTqna5IZXJSNh-H45Nlmt5YF5olfmv-AiGg97';
    }

    public static function getW3WLicenseKey() {
        return 'SRJ2YZLZ';
    }

    // deprecated

    public static function BingMapKey($value) {
        // deprecated
        $app = JFactory::getApplication();
        $app->enqueueMessage(JText::_("Deprecated: BingMapKey command is no longer supported"), "warning");
        RErrors::notifyError("Deprecated", "RLicense BingMapKey", "error");
    }
}

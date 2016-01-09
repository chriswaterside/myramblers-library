<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of calendarevent
 *
 * @author Chris Vaughan
 */
abstract class REvent {

    abstract protected function EventDate(); // as date

    abstract protected function EventText(); // as text string

    abstract protected function EventLink(); // as url

    abstract protected function EventStatus(); //  published,cancelled etc

    public function EventDateYYYYMMDD() {
        $out = $this->EventDate()->format('Y-m-d');
        return $out;
    }

    public function EventList($class) {
        $link = $this->EventLink();
        $text = $this->EventText();
        $out = "";
        $out.= "<div class='event-list-cal-event-single-link " . $class . $this->EventStatus() . "'>";
        $out.= "<a href='" . $link . "' target='_blank'>" . $text . "</a>";

        $out.= "<hr/></div>";
        return $out;
    }

}
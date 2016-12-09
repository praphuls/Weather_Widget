"use strict";

import {API_URL} from "./config";
import * as widget from "./view/weather-widget.hbss";

/**
 * Weather Widget
 */
export class Weather {

    constructor(srv) {
        this.weatherService = srv;              // cache  service
        this.widgetHandler = widget.default;    // cache handlebar template

        this.widgetReloadIconElm = document.getElementsByClassName("widget-reload-icon")[0];    // cache widget reload icon

        document.querySelector('.weather-widget').addEventListener('click', evt => this.fetchWeather(evt));    // attach event on weather-widget and delegate it
    }

    /**
     * initialize the widget
     * calls the makeGetRequest method weatherService
     * Creates a model
     * Passes the  model to the handlebar
     * Add the resultant template to the dom
     */
    init() {
        this.weatherService.makeGetRequest(API_URL)
        .then((resp) => {
            let weatherModel;

            //remove class refresh from widget-reload-icon
            if(this.widgetReloadIconElm && this.widgetReloadIconElm.className.indexOf("refresh") > -1) {
                this.widgetReloadIconElm.className = this.widgetReloadIconElm.className.replace("refresh", "");
            }

            if(resp.query.results) {
                weatherModel = {
                    location: `${resp.query.results.channel.location.city}, ${resp.query.results.channel.location.region}`,
                    temp: resp.query.results.channel.item.condition.temp,
                    weatherImg: resp.query.results.channel.item.description.split('src=')[1].split('"')[1],
                    weatherDesc: resp.query.results.channel.item.condition.text,
                    forecast: (() => {
                        let itemArr = resp.query.results.channel.item.forecast;
                        return itemArr.slice(1, 6);
                    })()
                };
            }
                
            var div = document.getElementsByClassName('weather-widget')[0];
            div.innerHTML = this.widgetHandler(weatherModel || {});
            this.isInProcess = false;
        }, (err) => {
            console.log(err);
        });
    }

    /**
     * Event listener for click event
     * Calls the init method to fetch the latest data and repaint the view.
     */
    fetchWeather(evt) {
        if(!this.isInProcess){
            if(evt.target.tagName.toLowerCase() === 'aside' && evt.target.className === 'widget-reload-icon') {
                this.isInProcess = true;

                // rotate icon by adding refresh class to widget-reload-icon
                evt.target.className += " refresh";

                this.init();
            } 
        }
        
    }
}
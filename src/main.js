'use strict';

import "babel-polyfill";                    // import polyfill for Promise
import * as srv from "./serviceModule";     // import service module
import {Weather} from "./weatherModule";    // import weather module

//create widget
let weather = new Weather(srv);

//initialize widget
weather.init();
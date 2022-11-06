import "./style.scss";

import * as _ from 'lodash';

console.log("Hello World From Console!");

function component() {
    const element = document.createElement('div');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    return element;
}

document.body.appendChild(component());

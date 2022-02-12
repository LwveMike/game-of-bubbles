const app = document.getElementById('app');
const game = app.querySelector('.game');

let ID = 0;



// Helper

const createElement = (type, props) => {
    const element = document.createElement(type);
    for (let prop of Object.keys(props)) {
        if (checkDataAttribute(prop))
            element.setAttribute(dataAttribute(prop), props[prop]);
        else
            element.setAttribute(prop, props[prop]);
    }
    return element;
}
const append = (parent, children) => {
    parent.appendChild(children);
}
const checkDataAttribute = (attr) => {
    return attr.slice(0, 4) === 'data';
}
const dataAttribute = (attr) => {
    return `data-${attr.slice(4).toLowerCase()}`;
}

const getRandomColor = () => {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


// Specific Helper

const addBorderColor = (element, color) => {
    element.style.border = `5px solid ${color}`;
}

const bubble = () => {
    const element = createElement('div', { class: 'bubble', dataId: ID++, });
    addBorderColor(element, getRandomColor());

    return element;

}

append(game, bubble());

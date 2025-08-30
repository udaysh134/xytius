const Canvas = require("canvas");


/**
 * 
 * @param {Integer} posX
 * @param {Integer} posY
 * @param {Integer} radius
 * @param {Boolean} willBeCurved
 */
module.exports = async (theContext, theImageURL, posX, posY, radius, width, height, willBeCurved) => {
    if(willBeCurved === true) {
        await Canvas.loadImage(theImageURL).then((bg) => {
            const x = posX;
            const y = posY;
            const rad = radius;
            const w = width;
            const h = height;
    
            theContext.beginPath();
            theContext.moveTo(x + rad, y);
            theContext.lineTo(x + w - rad, y);
            theContext.quadraticCurveTo(x + w, y, x + w, y + rad);
            theContext.lineTo(x + w, y + h - rad);
            theContext.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
            theContext.lineTo(x + rad, y + h);
            theContext.quadraticCurveTo(x, y + h, x, y + h - rad);
            theContext.lineTo(x, y + rad);
            theContext.quadraticCurveTo(x, y, x + rad, y);
            theContext.closePath();
    
            theContext.clip();
            theContext.drawImage(bg, x, y, w, h);
        });
    } else if(willBeCurved === false) {
        await Canvas.loadImage(theImageURL).then((bg) => {
            const x = posX;
            const y = posY;
            const rad = radius;
            const w = width;
            const h = height;
    
            theContext.drawImage(bg, x, y, w, h);
        });
    }
}
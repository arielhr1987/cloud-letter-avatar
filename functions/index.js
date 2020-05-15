const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
/**
 * Parameters:
 * size         => Size of the avatar
 * font_size    => Font size
 * length       => Length of the test to show
 * text         => The text to show
 * round        => If true circle else square
 * uppercase    => If true text is show upper case else as it is
 * background   => Background color in hex format
 * color        => Text color in hex format
 *
 * @type {HttpsFunction}
 */
exports.generate = functions.https.onRequest((request, response) => {
    console.log(request.headers.origin);
    /**
     * Headers
     */
    response.set({
        'Pragma': 'public',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Max-Age': '1814400',
        'Access-Control-Allow-Headers': 'Content-Type, Accept, X-Requested-With, remember-me',
        'Cache-Control': 'max-age=1814400',
        'Content-Type': 'image/svg+xml',
    })

    /**
     * Validations
     */
    let size = parseInt(request.query.size) ? parseInt(request.query.size) : 64;
    size = size < 16 ? 16 : size;
    size = size > 512 ? 512 : size;

    let font_size = parseInt(request.query['font-size']) ? parseInt(request.query['font-size']) : (size / 2);

    let length = parseInt(request.query.length) ? parseInt(request.query.length) : 2;
    length = length < 1 ? 1 : length;
    length = length > 2 ? 2 : length;

    let text = request.query.name ? request.query.name.substr(0, length) : '';

    let boolRegex = /^1|yes|on|true$/i
    let rounded = request.query.rounded !== undefined ? boolRegex.test(request.query.rounded) : true;

    let bold = request.query.bold !== undefined ? boolRegex.test(request.query.bold) : false;

    let uppercase = request.query.uppercase !== undefined ? boolRegex.test(request.query.uppercase) : false;
    if (uppercase) {
        text = text.toUpperCase();
    }

    let hexRegex = /^#?([0-9A-F]{3}){1,2}$/i;
    let background = hexRegex.test(request.query.background) ? request.query.background.replace('#', '') : 'fc91ad';

    let color = (parseInt(background, 16) > 0xffffff / 2) ? '000' : 'fff';
    color = hexRegex.test(request.query.color) ? request.query.color.replace('#', '') : color;

    /**
     * Create avatar
     */
    let avatar = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + size + 'px" height="' + size + 'px" viewBox="0 0 ' + size + ' ' + size + '" style="user-select: none;" version="1.1"><' + (rounded ? 'circle' : 'rect') + ' fill="#' + background + '" cx="' + (size / 2) + '" width="' + size + '" height="' + size + '" cy="' + (size / 2) + '" r="' + (size / 2) + '"/><text x="50%" y="50%" style="color: #' + color + '; line-height: 1;font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', \'Roboto\', \'Oxygen\', \'Ubuntu\', \'Fira Sans\', \'Droid Sans\', \'Helvetica Neue\', sans-serif;" alignment-baseline="middle" text-anchor="middle" font-size="' + font_size + '" font-weight="' + (bold ? 600 : 400) + '" dy=".1em" dominant-baseline="middle" fill="#' + color + '">' + text + '</text></svg>';

    /**
     * Send response
     */
    response.send(avatar);
});

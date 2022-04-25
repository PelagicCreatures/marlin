import {Sargasso as $kT4rO$Sargasso, utils as $kT4rO$utils, loadPageHandler as $kT4rO$loadPageHandler} from "@pelagiccreatures/sargasso";
import {TropicBird as $kT4rO$TropicBird} from "@pelagiccreatures/tropicbird";
import "@pelagiccreatures/flyingfish";
import {MolaMolaHelper as $kT4rO$MolaMolaHelper, molaMolaUtils as $kT4rO$molaMolaUtils} from "@pelagiccreatures/molamola";

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

var $d414b0a1d034aa82$exports = {};

$parcel$export($d414b0a1d034aa82$exports, "loadPage", () => $d414b0a1d034aa82$export$a2e58475e09a3523);
$parcel$export($d414b0a1d034aa82$exports, "reloadPage", () => $d414b0a1d034aa82$export$da22d4a5076a7905);
$parcel$export($d414b0a1d034aa82$exports, "tropicBird", () => $d414b0a1d034aa82$export$50085e1ac6c92b89);
$parcel$export($d414b0a1d034aa82$exports, "bootCMS", () => $d414b0a1d034aa82$export$6f01145979fe4fab);
$parcel$export($d414b0a1d034aa82$exports, "didLogIn", () => $d414b0a1d034aa82$export$35ba4dcba13237e5);
$parcel$export($d414b0a1d034aa82$exports, "didLogOut", () => $d414b0a1d034aa82$export$cc214df470ba9b7b);
$parcel$export($d414b0a1d034aa82$exports, "checkSubscription", () => $d414b0a1d034aa82$export$83800bde81490016);
$parcel$export($d414b0a1d034aa82$exports, "flashAjaxStatus", () => $d414b0a1d034aa82$export$649ce106e13495a7);
var $25a7bc89d95fcb19$exports = {};
(function(global, factory) {
    $25a7bc89d95fcb19$exports = factory();
})($25a7bc89d95fcb19$exports, function() {
    'use strict';
    /* eslint-disable no-var */ function assign(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source)target[key] = source[key];
        }
        return target;
    }
    /* eslint-enable no-var */ /* eslint-disable no-var */ var defaultConverter = {
        read: function(value) {
            if (value[0] === '"') value = value.slice(1, -1);
            return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
        },
        write: function(value) {
            return encodeURIComponent(value).replace(/%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g, decodeURIComponent);
        }
    };
    /* eslint-enable no-var */ /* eslint-disable no-var */ function init(converter1, defaultAttributes) {
        function set(key, value, attributes) {
            if (typeof document === 'undefined') return;
            attributes = assign({}, defaultAttributes, attributes);
            if (typeof attributes.expires === 'number') attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
            if (attributes.expires) attributes.expires = attributes.expires.toUTCString();
            key = encodeURIComponent(key).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
            var stringifiedAttributes = '';
            for(var attributeName in attributes){
                if (!attributes[attributeName]) continue;
                stringifiedAttributes += '; ' + attributeName;
                if (attributes[attributeName] === true) continue;
                // Considers RFC 6265 section 5.2:
                // ...
                // 3.  If the remaining unparsed-attributes contains a %x3B (";")
                //     character:
                // Consume the characters of the unparsed-attributes up to,
                // not including, the first %x3B (";") character.
                // ...
                stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
            }
            return document.cookie = key + '=' + converter1.write(value, key) + stringifiedAttributes;
        }
        function get(key) {
            if (typeof document === 'undefined' || arguments.length && !key) return;
            // To prevent the for loop in the first place assign an empty array
            // in case there are no cookies at all.
            var cookies = document.cookie ? document.cookie.split('; ') : [];
            var jar = {};
            for(var i = 0; i < cookies.length; i++){
                var parts = cookies[i].split('=');
                var value = parts.slice(1).join('=');
                try {
                    var foundKey = decodeURIComponent(parts[0]);
                    jar[foundKey] = converter1.read(value, foundKey);
                    if (key === foundKey) break;
                } catch (e) {}
            }
            return key ? jar[key] : jar;
        }
        return Object.create({
            set: set,
            get: get,
            remove: function(key, attributes) {
                set(key, '', assign({}, attributes, {
                    expires: -1
                }));
            },
            withAttributes: function(attributes) {
                return init(this.converter, assign({}, this.attributes, attributes));
            },
            withConverter: function(converter) {
                return init(assign({}, this.converter, converter), this.attributes);
            }
        }, {
            attributes: {
                value: Object.freeze(defaultAttributes)
            },
            converter: {
                value: Object.freeze(converter1)
            }
        });
    }
    var api = init(defaultConverter, {
        path: '/'
    });
    /* eslint-enable no-var */ return api;
});






let $d414b0a1d034aa82$export$a2e58475e09a3523, $d414b0a1d034aa82$export$da22d4a5076a7905, $d414b0a1d034aa82$export$50085e1ac6c92b89;
const $d414b0a1d034aa82$export$6f01145979fe4fab = ()=>{
    $d414b0a1d034aa82$export$50085e1ac6c92b89 = new $kT4rO$TropicBird(document.body, {});
    $d414b0a1d034aa82$export$50085e1ac6c92b89.start();
    $d414b0a1d034aa82$export$a2e58475e09a3523 = (url)=>{
        $kT4rO$loadPageHandler(url);
    };
    $d414b0a1d034aa82$export$da22d4a5076a7905 = ()=>{
        $kT4rO$loadPageHandler(document.location.href, true);
    };
    if ((/*@__PURE__*/$parcel$interopDefault($25a7bc89d95fcb19$exports)).get('have-account')) $kT4rO$utils.elementTools.addClass(document.body, 'have-account');
    else $kT4rO$utils.elementTools.addClass(document.body, 'dont-have-account');
    // Set initial login state css show/hide behavior
    if ((/*@__PURE__*/$parcel$interopDefault($25a7bc89d95fcb19$exports)).get('logged-in')) $d414b0a1d034aa82$export$35ba4dcba13237e5();
    else $d414b0a1d034aa82$export$cc214df470ba9b7b();
    window.setTimeout(function() {
        $kT4rO$utils.elementTools.addClass(document.querySelector('#splash'), 'animate__animated');
        $kT4rO$utils.elementTools.addClass(document.querySelector('#splash'), 'animate__fadeOut');
    }, 500);
    $kT4rO$utils.elementTools.on('notifications-button', document.body, 'click', '.show-notifications-button', (e)=>{
        if ($kT4rO$utils.elementTools.hasClass(e.target, 'highlight')) {
            $kT4rO$utils.elementTools.removeClass(e.target, 'highlight');
            $kT4rO$utils.elementTools.removeClass(document.querySelector('#user-alerts'), 'open');
        } else {
            $kT4rO$utils.elementTools.addClass(e.target, 'highlight');
            $kT4rO$utils.elementTools.addClass(document.querySelector('#user-alerts'), 'open');
        }
    });
};
// call whenever login occurs
function $d414b0a1d034aa82$export$35ba4dcba13237e5() {
    $d414b0a1d034aa82$export$83800bde81490016();
    (/*@__PURE__*/$parcel$interopDefault($25a7bc89d95fcb19$exports)).set('have-account', 1, cookieOptions);
    $d414b0a1d034aa82$export$649ce106e13495a7('success', 'Logged in');
    $kT4rO$utils.elementTools.removeClass(document.body, 'is-logged-out');
    $kT4rO$utils.elementTools.addClass(document.body, 'is-logged-in');
    $kT4rO$utils.elementTools.addClass(document.body, 'have-account');
    document.body.dispatchEvent(new CustomEvent('marlin-login'));
}
// call whenever logout occurs
const $d414b0a1d034aa82$export$cc214df470ba9b7b = ()=>{
    $d414b0a1d034aa82$export$83800bde81490016();
    if ((/*@__PURE__*/$parcel$interopDefault($25a7bc89d95fcb19$exports)).get('have-account')) $d414b0a1d034aa82$export$649ce106e13495a7('success', 'Logged out');
    $kT4rO$utils.elementTools.removeClass(document.body, 'is-logged-in');
    $kT4rO$utils.elementTools.addClass(document.body, 'is-logged-out');
    (/*@__PURE__*/$parcel$interopDefault($25a7bc89d95fcb19$exports)).remove('access_token', cookieOptions);
    document.body.dispatchEvent(new CustomEvent('marlin-logout'));
};
const $d414b0a1d034aa82$export$83800bde81490016 = ()=>{
    if ((/*@__PURE__*/$parcel$interopDefault($25a7bc89d95fcb19$exports)).get('subscriber')) {
        $kT4rO$utils.elementTools.removeClass(document.body, 'not-subscriber');
        $kT4rO$utils.elementTools.addClass(document.body, 'is-subscriber');
    } else {
        $kT4rO$utils.elementTools.removeClass(document.body, 'is-subscriber');
        $kT4rO$utils.elementTools.addClass(document.body, 'not-subscriber');
    }
    if ((/*@__PURE__*/$parcel$interopDefault($25a7bc89d95fcb19$exports)).get('admin')) {
        $kT4rO$utils.elementTools.removeClass(document.body, 'not-admin');
        $kT4rO$utils.elementTools.addClass(document.body, 'is-admin');
    } else {
        $kT4rO$utils.elementTools.removeClass(document.body, 'is-admin');
        $kT4rO$utils.elementTools.addClass(document.body, 'not-admin');
    }
    if ((/*@__PURE__*/$parcel$interopDefault($25a7bc89d95fcb19$exports)).get('superuser')) {
        $kT4rO$utils.elementTools.removeClass(document.body, 'not-superuser');
        $kT4rO$utils.elementTools.addClass(document.body, 'is-superuser');
    } else {
        $kT4rO$utils.elementTools.removeClass(document.body, 'is-superuser');
        $kT4rO$utils.elementTools.addClass(document.body, 'not-superuser');
    }
};
// call to show the Material Design "snackbar" for user notifications
const $d414b0a1d034aa82$export$649ce106e13495a7 = (level, message)=>{
    $d414b0a1d034aa82$export$50085e1ac6c92b89.pushSnackBar(level, message);
};


class $625719fd656e349c$export$1faeee515eaf504e extends $kT4rO$Sargasso {
    constructor(elem, options){
        super(elem, options);
        this.endpoint = this.element.getAttribute('data-endpoint');
        this.redirect = this.element.getAttribute('data-redirect') ? this.element.getAttribute('data-redirect') : '/users/home';
        this.method = this.element.getAttribute('data-method') ? this.element.getAttribute('data-method') : 'POST';
        this.confirm = this.element.getAttribute('data-confirm') ? this.element.getAttribute('data-confirm') : false;
        this.confirmPrompt = this.element.getAttribute('data-confirm-prompt') ? this.element.getAttribute('data-confirm-prompt') : 'Are you sure?';
    }
    start() {
        super.start();
        this.on('click', '', async (e)=>{
            e.preventDefault();
            if (this.confirm) $d414b0a1d034aa82$export$50085e1ac6c92b89.dialog('#confirm-dialog', 'Please Confirm', this.confirmPrompt, true).then(async (action)=>{
                if (action === 'accept') await this.doIt();
            });
            else await this.doIt();
        });
    }
    sleep() {
        this.off('click', '');
        super.sleep();
    }
    async doIt() {
        try {
            const response = await fetch(this.endpoint, {
                method: this.method,
                headers: {
                    'Content-Type': 'application/json',
                    'Sargasso-Hijax': 'true'
                }
            });
            const data = await response.json();
            const flashLevel = response.headers['Sargasso-Flash-Level'] ? response.headers['Sargasso-Flash-Level'] : data.flashLevel;
            const flashMessage = response.headers['Sargasso-Flash-Message'] ? response.headers['Sargasso-Flash-Message'] : data.flashMessage;
            const loggedIn = response.headers['Sargasso-Did-Login'] ? response.headers['Sargasso-Did-Login'] : data.didLogin;
            const loggedOut = response.headers['Sargasso-Did-Logout'] ? response.headers['Sargasso-Did-Logout'] : data.didLogout;
            if (loggedIn) $d414b0a1d034aa82$export$35ba4dcba13237e5();
            if (loggedOut) $d414b0a1d034aa82$export$cc214df470ba9b7b();
            if (data.status === 'ok') {
                $d414b0a1d034aa82$export$649ce106e13495a7('success', flashMessage);
                if (this.redirect === location.pathname) $d414b0a1d034aa82$export$da22d4a5076a7905();
                else $d414b0a1d034aa82$export$a2e58475e09a3523(this.redirect);
            } else $d414b0a1d034aa82$export$649ce106e13495a7(flashLevel, flashMessage);
        } catch (e) {
            const message = 'error';
            $d414b0a1d034aa82$export$649ce106e13495a7('error', message);
        }
    }
}
$kT4rO$utils.registerSargassoClass('ajaxButton', $625719fd656e349c$export$1faeee515eaf504e);



class $72d053316bded134$export$94d36f806562393e extends $kT4rO$Sargasso {
    constructor(elem, options){
        super(elem, options);
    }
    start() {
        let index;
        const pages = this.element.querySelector('.pagination-page');
        const selipsis = this.element.querySelector('.pagination-elipsis-start');
        const eelipsis = this.element.querySelector('.pagination-elipsis-end');
        if (pages.length > 9) {
            for(let i = 0; i < pages.length; i++)if ($kT4rO$utils.elementTools.hasClass(pages[i], 'active')) index = i;
            let start = index - 4;
            let end = index + 4;
            if (start < 0) {
                end = -start + end;
                start = 0;
            }
            if (end > pages.length) {
                start = start + pages.length - end;
                end = pages.length;
            }
            for(let i1 = 0; i1 < pages.length; i1++)if (i1 < start || i1 > end) pages[i1].remove();
            if (start === 0) selipsis.remove();
            if (end + 2 > pages.length) eelipsis.remove();
        } else {
            selipsis.remove();
            eelipsis.remove();
        }
    }
}
$kT4rO$utils.registerSargassoClass('paginationController', $72d053316bded134$export$94d36f806562393e);




class $8bbbfc6930a36712$export$5508d91e653c5884 extends $kT4rO$Sargasso {
    constructor(elem, options){
        super(elem, options);
        this.mountpoint = this.element.getAttribute('data-mountpoint');
        this.model = this.element.getAttribute('data-model');
        this.id = this.element.getAttribute('data-id');
        this.redirect = this.element.getAttribute('data-redirect');
    }
    start() {
        super.start();
        this.on('click', '.add-button', (e, elem)=>{
            e.preventDefault();
            const target = elem.getAttribute('data-target');
            if (target) {
                const belongsTo = elem.getAttribute('data-belongs-to');
                const fk = elem.getAttribute('data-fk');
                $d414b0a1d034aa82$export$a2e58475e09a3523(this.mountpoint + '/' + target + '/create?fk=' + fk + '&belongs-to=' + belongsTo);
            } else $d414b0a1d034aa82$export$a2e58475e09a3523(this.mountpoint + '/' + this.model + '/create');
        });
        this.on('click', '.edit-button', (e, elem)=>{
            e.preventDefault();
            $d414b0a1d034aa82$export$a2e58475e09a3523(this.mountpoint + '/' + this.model + '/' + this.id + '/edit');
        });
        this.on('click', '.delete-button', (e, elem)=>{
            e.preventDefault();
            $d414b0a1d034aa82$export$50085e1ac6c92b89.dialog('#confirm-dialog', 'Delete this row?', this.confirmPrompt, true).then((action)=>{
                if (action === 'accept') {
                    const endpoint = this.mountpoint + '/' + this.model + '/' + this.id;
                    this.API('DELETE', endpoint);
                }
            });
        });
        this.on('click', '.search-button', (e, elem)=>{
            e.preventDefault();
            const q = elem.closest('.input-group').find('input[name="q"]').val();
            const prop = elem.closest('.input-group').find('select[name="property"]').val();
            if (q && prop) $d414b0a1d034aa82$export$a2e58475e09a3523(location.pathname + '?q=' + encodeURIComponent(q) + '&property=' + encodeURIComponent(prop));
        });
        this.on('mouseover', '.select-row', (e, elem)=>{
            $kT4rO$utils.elementTools.addClass(elem, 'hovering');
        });
        this.on('mouseout', '.select-row', (e, elem)=>{
            $kT4rO$utils.elementTools.removeClass(elem, 'hovering');
        });
        this.on('click', '.select-row', (e, elem)=>{
            e.preventDefault();
            var id = parseInt(elem.getAttribute('data-row'));
            $d414b0a1d034aa82$export$a2e58475e09a3523(this.mountpoint + '/' + this.model + '/' + id);
        });
    }
    sleep() {
        this.off('click', '.flextable-row');
        this.off('click', '.add-button');
        this.off('click', '.edit-button');
        this.off('click', '.delete-button');
        this.off('click', '.search-button');
        this.off('mouseover', '.select-row');
        this.off('mouseout', '.select-row');
        this.off('click', '.select-row');
        super.sleep();
    }
    API(method, endpoint, data1) {
        fetch(endpoint, {
            method: method,
            body: JSON.stringify(data1),
            headers: {
                'Content-Type': 'application/json',
                'Sargasso-Hijax': 'true'
            }
        }).then((response)=>{
            return response.json();
        }).then((data)=>{
            var flashLevel = data.flashLevel;
            var flashMessage = data.flashMessage;
            if (data.status === 'ok') {
                $d414b0a1d034aa82$export$649ce106e13495a7('success', flashMessage);
                let redir = this.redirect;
                if (data.id && !redir.match(/\/\d+$/)) redir += '/' + data.id;
                $d414b0a1d034aa82$export$a2e58475e09a3523(redir);
            } else {
                let message;
                if (data.errors) for(var i = 0; i < data.errors.length; i++){
                    if (message) message += ', ';
                    message += data.errors[i];
                }
                else message = data.status;
                this.element.querySelector('.ajax-errors').innerHTML = '<div class="ajax-message ajax-message-' + flashLevel + '"><i class="material-icons">info</i> ' + flashMessage + '</div>';
            }
        }).catch((e)=>{
            var message = 'error';
            this.element.querySelector('.ajax-errors').innerHTML = '<div class="ajax-message ajax-message-error"><i class="material-icons">error</i> ' + message + '</div>';
        });
    }
}
$kT4rO$utils.registerSargassoClass('adminController', $8bbbfc6930a36712$export$5508d91e653c5884);



class $9e2c5dffa39e6ff0$export$fa5c8e883bd96f25 extends $kT4rO$Sargasso {
    constructor(elem, options){
        super(elem, options);
        this.columnName = this.element.getAttribute('data-column-name');
        this.maxHeight = this.element.getAttribute('data-max-height') ? this.element.getAttribute('data-max-height') : 200;
        this.maxWidth = this.element.getAttribute('data-max-width') ? this.element.getAttribute('data-max-width') : 200;
        this.sendResized = this.element.getAttribute('data-send-resized') === 'true';
        this.input = document.querySelector(this.element.getAttribute('data-target'));
        this.previewElement = document.querySelector('[data-name="' + this.columnName + '-preview"]');
        this.widthElement = document.querySelector('[data-name="' + this.columnName + '-width"]');
        this.heightElement = document.querySelector('[data-name="' + this.columnName + '-height"]');
        this.metadata = this.element.closest('.input-group').querySelector('.metadata');
    }
    start() {
        super.start();
        this.on('change', '', (e)=>{
            this.processImage(e.target.files[0]);
        });
    }
    sleep() {
        this.off('change', '');
        super.sleep();
    }
    processImage(file) {
        const reader = new FileReader();
        // make a thumbnail once data is loaded
        reader.onload = (readerEvent)=>{
            const image = new Image();
            image.onload = (imageEvent)=>{
                const canvas = document.createElement('canvas');
                let w = image.width;
                let h = image.height;
                if (w > h) {
                    if (w > this.maxWidth) {
                        h *= this.maxWidth / w;
                        w = this.maxWidth;
                    }
                } else if (h > this.maxHeight) {
                    w *= this.maxHeight / h;
                    h = this.maxHeight;
                }
                canvas.width = w;
                canvas.height = h;
                canvas.getContext('2d').drawImage(image, 0, 0, w, h);
                const dataURL = canvas.toDataURL('image/jpeg', 1.0);
                this.previewElement.innerHTML = '<img src="' + dataURL + '">';
                this.metadata.innerHTML = '<strong><em>New image</em></strong> w: <strong>' + image.naturalWidth + '</strong> h: <strong>' + image.naturalHeight + '</strong>';
                if (this.sendResized) {
                    this.input.value = dataURL;
                    this.widthElement.value = w;
                    this.heightElement.value = h;
                } else {
                    this.widthElement.value = image.naturalWidth;
                    this.heightElement.value = image.naturalHeight;
                }
            };
            // pipe the file data into the image
            image.src = readerEvent.target.result;
            if (!this.sendResized) this.input.value = readerEvent.target.result;
        };
        // start reading the file
        reader.readAsDataURL(file);
    }
}
$kT4rO$utils.registerSargassoClass('uploadableImage', $9e2c5dffa39e6ff0$export$fa5c8e883bd96f25);






class $563505b3b3bdb856$var$AdminHandler extends $kT4rO$MolaMolaHelper {
    pose() {
        this.chipHandler = function(e) {
            if (e.target === this) {
                const selected = [];
                const sel = this.closest('.mdc-chip-set').querySelectorAll('.mdc-chip--selected');
                Array.from(sel).forEach(function(chip) {
                    selected.push(chip.getAttribute('data-id'));
                });
                this.closest('.mdc-chip-set').querySelector('input').value = selected.join(',');
            }
        };
        const chips = this.form.element.getElementsByClassName('mdc-chip');
        Array.from(chips).forEach((chip)=>{
            chip.addEventListener('MDCChip:selection', this.chipHandler, false);
        });
    }
    preFlight() {
        // special case - always send checkbox value for boolean switch
        const checkboxes = this.form.element.getElementsByClassName('mdc-switch__native-control');
        for(let i = 0; i < checkboxes.length; i++){
            const cb = checkboxes[i];
            this.form.payload[cb.getAttribute('name')] = !!cb.checked // sets data.table.column to true or false
            ;
        }
        const json = {};
        for(const k in this.form.payload){
            const tableColumn = k.match(/^([^\[]+)\[([^\]]+)\]/);
            if (!tableColumn) json[k] = this.form.payload[k];
            else {
                if (!json[tableColumn[1]]) json[tableColumn[1]] = {};
                json[tableColumn[1]][tableColumn[2]] = this.form.payload[k];
            }
        }
        this.form.payload = json;
    }
    destroy() {
        const chips = this.form.element.getElementsByClassName('mdc-chip');
        Array.from(chips).forEach((chip)=>{
            chip.removeEventListener('MDCChip:selection', this.chipHandler);
        });
        super.destroy();
    }
}
$kT4rO$molaMolaUtils.registerHelperClass('AdminHandler', $563505b3b3bdb856$var$AdminHandler);
class $563505b3b3bdb856$var$BoilerplateHandler extends $kT4rO$MolaMolaHelper {
    // TODO MDC TextInput floating label borked on autofill, revisit once they fix it
    pose() {
        setTimeout(()=>{
            const borked = document.querySelectorAll('input:-webkit-autofill');
            if (borked && borked.length) Array.from(borked).forEach((element)=>{
                const mdcElement = element.closest('.mdc-text-field');
                if (mdcElement) {
                    const textField = $kT4rO$utils.elementTools.getMetaData(mdcElement, 'MDCTextField');
                    if (textField) textField.getLabelAdapterMethods_().floatLabel(true);
                }
            });
        }, 500);
    }
    preFlight() {
        const json = {};
        for(const k in this.form.payload){
            const tableColumn = k.match(/^([^\[]+)\[([^\]]+)\]/);
            if (!tableColumn) json[k] = this.form.payload[k];
            else {
                if (!json[tableColumn[1]]) json[tableColumn[1]] = {};
                json[tableColumn[1]][tableColumn[2]] = this.form.payload[k];
            }
        }
        this.form.payload = json;
    }
    success(data) {
        if (data.didLogin) {
            $d414b0a1d034aa82$export$35ba4dcba13237e5();
            if (!data.redirect) data.redirect = '/users/home';
        }
        if (data.didLogout) {
            $d414b0a1d034aa82$export$cc214df470ba9b7b();
            if (!data.redirect) data.redirect = '/users/login';
        }
        if (data.message) $d414b0a1d034aa82$export$50085e1ac6c92b89.pushSnackBar('info', data.message);
        if (data.errors) for(let i = 0; i < data.errors.length; i++)$d414b0a1d034aa82$export$50085e1ac6c92b89.pushSnackBar(data['error-level'] || 'info', data.errors[i]);
        if (!data.redirect && this.form.element.getAttribute('data-redirect')) data.redirect = this.form.element.getAttribute('data-redirect');
        if (data.status === 'ok' && data.redirect) $d414b0a1d034aa82$export$a2e58475e09a3523(data.redirect);
    }
    error(err) {
        $d414b0a1d034aa82$export$50085e1ac6c92b89.pushSnackBar('error', err.message);
    }
}
$kT4rO$molaMolaUtils.registerHelperClass('BoilerplateHandler', $563505b3b3bdb856$var$BoilerplateHandler);




// expose these so huge markdown editor can be dynamically loaded
window.Sargasso = $kT4rO$Sargasso;
window.registerSargassoClass = $kT4rO$utils.registerSargassoClass;
window.elementTools = $kT4rO$utils.elementTools;


//# sourceMappingURL=marlin.mjs.map

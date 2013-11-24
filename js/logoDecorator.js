;(function ($, window, document, undefined) {
    var pluginName = 'logoDecorator',
        defaults = {
            date: null,
            offsetX: 0,
            offsetY: 0,
            width: 0,
            height: 0,
            anchor: null
        },
        today;

    function Plugin(element, options) {
        this.element = element;

        this.options = $.extend({}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype.init = function () {
        var holiday = false,
            element = this.element,
            options = this.options;

        // Inicjujemy obiekt z datą dzisiejszą lub tą podaną w opcjach.
        today = this.options.date !== null ? new Date(this.options.date) : new Date();

        // Sprawdzamy, czy mamy dziś jakieś święto.
        holiday = isHoliday();
        if (!holiday) {
            return false;
        }

        // Umieszczamy dekorator na odpowiednim miejscu
        placeDecorator(element, holiday, options);

        // Przypisujemy event do zmiany rozmiaru okna, aby dekorator podążał za logiem.
        $(window).on('resize', function() {
            placeDecorator(element, holiday, options);
        });

        return true;
    };

    function placeDecorator(element, className, options) {
        // Inicjujemy zmienne.
        var $element = $(element),
            $decorator = $('#logoDecoratorElement'),
            offset = $element.offset(),
            dimensions = {};

        // Jeśli element dekoratora nie został wcześniej stworzony, tworzyny go teraz.
        if ($decorator.length === 0) {
            // Jeśli dekorator ma być klikalny, tworzymy go jako element A, DIV w przeciwnym wypadku.
            if (options.anchor !== null && $(options.anchor).length > 0 && $(options.anchor).is('a')) {
                $decorator = $('<a id="logoDecoratorElement" />').attr('href', $(options.anchor).attr('href')).css('display', 'block');
            } else {
                $decorator = $('<div id="logoDecoratorElement" />');
            }
        }

        // Jeśli w konfiguracji są podane wymiary, używamy ich. Jeśli nie, staramy się wyliczyć.
        dimensions.width = options.width > 0 ? options.width : $element.width() + options.offsetX * 2;
        dimensions.height = options.height > 0 ? options.height : $element.height() + options.offsetY * 2;

        // Przypisujemy pozycje, wymiary, dodajemy odpowiednią klasę i przypisujemy na koniec body.
        $decorator.css({
            width: dimensions.width + 'px',
            height: dimensions.height + 'px',
            position: 'absolute',
            zIndex: 10000,
            left: (offset.left - options.offsetX) + 'px',
            top: (offset.top - options.offsetY) + 'px'
        }).addClass(className).appendTo(document.body);
    }

    // Sprawdzamy, czy mamy jakieś święto.
    function isHoliday() {
        switch(true) {
            case isChristmas(): return 'christmasDecoration';
            case isNewYearsEve(): return 'newYearsEveDecoration';
            case isNewYear(): return 'newYearDecoration';
            case isEaster(): return 'easterDecoration';
            default: return false;
        }
    }

    // Sprawdzamy, czy mamy okres świąteczny.
    function isChristmas() {
        if (today.getMonth() !== 11) {
            return false;
        }

        if (today.getDate() < 20) {
            return false;
        }

        if (today.getDate() > 30) {
            return false;
        }

        return true;
    }

    // Sprawdzamy, czy mamy Sylwester.
    function isNewYearsEve() {
        if (today.getMonth() !== 11 || today.getDate() !== 31) {
            return false;
        }

        return true;
    }

    // Sprawdzamy, czy mamy Nowy Rok.
    function isNewYear() {
        if (today.getMonth() !== 0 || today.getDate() !== 1) {
            return false;
        }

        return true;
    }

    // Sprawdzamy, czy mamy Wielkanoc.
    function isEaster() {
        var a, b, c, d, e, f, g, h, i, j, k, m, month, day, firstDay, temp;

        a = today.getFullYear() % 19;
        b = Math.floor(today.getFullYear() / 100);
        c = today.getFullYear() % 100;
        d = Math.floor(b / 4);
        e = b % 4;
        f = Math.floor((b + 8) / 25);
        g = Math.floor((b-f + 1) / 3);
        h = (19 * a + b - d - g + 15) % 30;
        i = Math.floor(c / 4);
        j = c % 4;
        k = (32 + 2 * e + 2 * i - h - j) % 7;
        m = Math.floor((a + 11 * h + 22*k) / 451);
        month = Math.floor((h + k - 7 * m + 114) / 31);
        day = ((h + k - 7 * m +114) % 31) + 1;

        firstDay = new Date(today.getFullYear(), (month - 1), day);

        // Sprawdzamy, czy mamy Niedzielę Wielkanocną
        if (today.getMonth() == firstDay.getMonth() && today.getDate() == firstDay.getDate()) {
            return true;
        }

        temp = new Date(today.getFullYear(), (month - 1), day);

        // Sprawdzamy, czy mamy Lany Poniedziałek
        temp.setDate(temp.getDate() + 1);
        if (today.getMonth() == temp.getMonth() && today.getDate() == temp.getDate()) {
            return true;
        }

        // Sprawdzamy, czy mamy Wielką Sobotę
        temp.setDate(temp.getDate() - 2);
        if (today.getMonth() == temp.getMonth() && today.getDate() == temp.getDate()) {
            return true;
        }

        // Sprawdzamy, czy mamy Wielki Piątek
        temp.setDate(temp.getDate() - 1);
        if (today.getMonth() == temp.getMonth() && today.getDate() == temp.getDate()) {
            return true;
        }

        // Sprawdzamy, czy mamy Wielki Czwartek
        temp.setDate(temp.getDate() - 1);
        if (today.getMonth() == temp.getMonth() && today.getDate() == temp.getDate()) {
            return true;
        }

        return false;
    }

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data( this, 'plugin_' + pluginName,
                new Plugin(this, options));
            }
        });
    };
})(jQuery, window, document);
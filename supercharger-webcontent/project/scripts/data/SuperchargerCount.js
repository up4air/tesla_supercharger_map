define(['jquery', 'data/CountryCodes', 'data/SuperchargerData'], function ($, CountryCodes, SuperchargerData) {


    var SuperchargerCount = function () {

        var i = 0,
            headerRow = $("<tr><th class='vert'></th></tr>"),
            openRow = $("<tr><th class='vert'>Open</th></tr>"),
            constRow = $("<tr><th class='vert'>Construction</th></tr>"),
            countryCountArray = this.getConstructionCount();

        for (; i < countryCountArray.length; i++) {
            var countryEntry = countryCountArray[i];
            headerRow.append("<th title='" + countryEntry.countryName + "'>" + countryEntry.countryCode + "</th>");
            openRow.append("<td>" + countryEntry.open + "</td>");
            constRow.append("<td>" + countryEntry.construction + "</td>");
        }

        $("<table></table>")
            .addClass("supercharger-count-table")
            .append(headerRow)
            .append(openRow)
            .append(constRow)
            .appendTo("#supercharger-count-container");
    };


    /**
     * Construction count.
     *
     * RETURNED ARRAY:
     *
     *  [
     *   { countryName: 'USA',    countryCode: 'us', open: 3, construction: 7  },
     *   { countryName: 'Germany',countryCode: 'de', open: 3, construction: 7  }
     *  ]
     *
     * REFERENCE MAP:
     *
     * { us : arrayRef,
     *   de: arrayRef
     * }
     */
    SuperchargerCount.prototype.getConstructionCount = function () {
        var i = 0,
            countryRefMap = {},
            countryArray = [],
            totalOpen = 0,
            totalConstruction = 0;

        for (; i < SuperchargerData.LIST.length; i++) {
            var supercharger = SuperchargerData.LIST[i];
            if (!supercharger.custom && supercharger.count) {
                var countryName = supercharger.address.country;
                if (!countryRefMap[countryName]) {
                    var newEntry = { countryName: countryName, countryCode: CountryCodes.fromName(countryName), open: 0, construction: 0 };
                    countryRefMap[countryName] = newEntry;
                    countryArray.push(newEntry);
                }
                if (supercharger.construction) {
                    countryRefMap[countryName].construction++;
                    totalConstruction++;
                } else {
                    countryRefMap[countryName].open++;
                    totalOpen++;
                }
            }
        }
        countryArray.sort(this.sort);
        countryArray.push({ countryName: 'Total', countryCode: 'Total', open: totalOpen, construction: totalConstruction });
        return countryArray;
    };


    SuperchargerCount.prototype.sort = function (one, two) {
        return two.open - one.open;
    };

    return SuperchargerCount;

});
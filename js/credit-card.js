(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw ((a.code = "MODULE_NOT_FOUND"), a);
        }
        var p = (n[i] = { exports: {} });
        e[i][0].call(
          p.exports,
          function (r) {
            var n = e[i][1][r];
            return o(n || r);
          },
          p,
          p.exports,
          r,
          e,
          n,
          t
        );
      }
      return n[i].exports;
    }
    for (
      var u = "function" == typeof require && require, i = 0;
      i < t.length;
      i++
    )
      o(t[i]);
    return o;
  }
  return r;
})()(
  {
    1: [
      function (require, module, exports) {
        "use strict";
        var __assign =
          (this && this.__assign) ||
          function () {
            __assign =
              Object.assign ||
              function (t) {
                for (var s, i = 1, n = arguments.length; i < n; i++) {
                  s = arguments[i];
                  for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
                }
                return t;
              };
            return __assign.apply(this, arguments);
          };
        var cardTypes = require("./lib/card-types");
        var add_matching_cards_to_results_1 = require("./lib/add-matching-cards-to-results");
        var is_valid_input_type_1 = require("./lib/is-valid-input-type");
        var find_best_match_1 = require("./lib/find-best-match");
        var clone_1 = require("./lib/clone");
        var customCards = {};
        var cardNames = {
          VISA: "visa",
          MASTERCARD: "mastercard",
          AMERICAN_EXPRESS: "american-express",
          DINERS_CLUB: "diners-club",
          DISCOVER: "discover",
          JCB: "jcb",
          UNIONPAY: "unionpay",
          MAESTRO: "maestro",
          ELO: "elo",
          MIR: "mir",
          HIPER: "hiper",
          HIPERCARD: "hipercard",
        };
        var ORIGINAL_TEST_ORDER = [
          cardNames.VISA,
          cardNames.MASTERCARD,
          cardNames.AMERICAN_EXPRESS,
          cardNames.DINERS_CLUB,
          cardNames.DISCOVER,
          cardNames.JCB,
          cardNames.UNIONPAY,
          cardNames.MAESTRO,
          cardNames.ELO,
          cardNames.MIR,
          cardNames.HIPER,
          cardNames.HIPERCARD,
        ];
        var testOrder = clone_1.clone(ORIGINAL_TEST_ORDER);
        function findType(cardType) {
          return customCards[cardType] || cardTypes[cardType];
        }
        function getAllCardTypes() {
          return testOrder.map(function (cardType) {
            return clone_1.clone(findType(cardType));
          });
        }
        function getCardPosition(name, ignoreErrorForNotExisting) {
          if (ignoreErrorForNotExisting === void 0) {
            ignoreErrorForNotExisting = false;
          }
          var position = testOrder.indexOf(name);
          if (!ignoreErrorForNotExisting && position === -1) {
            throw new Error('"' + name + '" is not a supported card type.');
          }
          return position;
        }
        function creditCardType(cardNumber) {
          var results = [];
          if (!is_valid_input_type_1.isValidInputType(cardNumber)) {
            return results;
          }
          if (cardNumber.length === 0) {
            return getAllCardTypes();
          }
          testOrder.forEach(function (cardType) {
            var cardConfiguration = findType(cardType);
            add_matching_cards_to_results_1.addMatchingCardsToResults(
              cardNumber,
              cardConfiguration,
              results
            );
          });
          var bestMatch = find_best_match_1.findBestMatch(results);
          if (bestMatch) {
            return [bestMatch];
          }
          return results;
        }
        creditCardType.getTypeInfo = function (cardType) {
          return clone_1.clone(findType(cardType));
        };
        creditCardType.removeCard = function (name) {
          var position = getCardPosition(name);
          testOrder.splice(position, 1);
        };
        creditCardType.addCard = function (config) {
          var existingCardPosition = getCardPosition(config.type, true);
          customCards[config.type] = config;
          if (existingCardPosition === -1) {
            testOrder.push(config.type);
          }
        };
        creditCardType.updateCard = function (cardType, updates) {
          var originalObject = customCards[cardType] || cardTypes[cardType];
          if (!originalObject) {
            throw new Error(
              '"' +
                cardType +
                "\" is not a recognized type. Use `addCard` instead.'"
            );
          }
          if (updates.type && originalObject.type !== updates.type) {
            throw new Error("Cannot overwrite type parameter.");
          }
          var clonedCard = clone_1.clone(originalObject);
          clonedCard = __assign(__assign({}, clonedCard), updates);
          customCards[clonedCard.type] = clonedCard;
        };
        creditCardType.changeOrder = function (name, position) {
          var currentPosition = getCardPosition(name);
          testOrder.splice(currentPosition, 1);
          testOrder.splice(position, 0, name);
        };
        creditCardType.resetModifications = function () {
          testOrder = clone_1.clone(ORIGINAL_TEST_ORDER);
          customCards = {};
        };
        creditCardType.types = cardNames;
        window.creditCardType = creditCardType;
        module.exports = creditCardType;
      },
      {
        "./lib/add-matching-cards-to-results": 2,
        "./lib/card-types": 3,
        "./lib/clone": 4,
        "./lib/find-best-match": 5,
        "./lib/is-valid-input-type": 6,
      },
    ],
    2: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.addMatchingCardsToResults = void 0;
        var clone_1 = require("./clone");
        var matches_1 = require("./matches");
        function addMatchingCardsToResults(
          cardNumber,
          cardConfiguration,
          results
        ) {
          var i, patternLength;
          for (i = 0; i < cardConfiguration.patterns.length; i++) {
            var pattern = cardConfiguration.patterns[i];
            if (!matches_1.matches(cardNumber, pattern)) {
              continue;
            }
            var clonedCardConfiguration = clone_1.clone(cardConfiguration);
            if (Array.isArray(pattern)) {
              patternLength = String(pattern[0]).length;
            } else {
              patternLength = String(pattern).length;
            }
            if (cardNumber.length >= patternLength) {
              clonedCardConfiguration.matchStrength = patternLength;
            }
            results.push(clonedCardConfiguration);
            break;
          }
        }
        exports.addMatchingCardsToResults = addMatchingCardsToResults;
      },
      { "./clone": 4, "./matches": 7 },
    ],
    3: [
      function (require, module, exports) {
        "use strict";
        var cardTypes = {
          visa: {
            niceType: "Visa",
            type: "visa",
            patterns: [4],
            gaps: [4, 8, 12],
            lengths: [16, 18, 19],
            code: {
              name: "CVV",
              size: 3,
            },
          },
          mastercard: {
            niceType: "Mastercard",
            type: "mastercard",
            patterns: [
              [51, 55],
              [2221, 2229],
              [223, 229],
              [23, 26],
              [270, 271],
              2720,
            ],
            gaps: [4, 8, 12],
            lengths: [16],
            code: {
              name: "CVC",
              size: 3,
            },
          },
          "american-express": {
            niceType: "American Express",
            type: "american-express",
            patterns: [34, 37],
            gaps: [4, 10],
            lengths: [15],
            code: {
              name: "CID",
              size: 4,
            },
          },
          "diners-club": {
            niceType: "Diners Club",
            type: "diners-club",
            patterns: [[300, 305], 36, 38, 39],
            gaps: [4, 10],
            lengths: [14, 16, 19],
            code: {
              name: "CVV",
              size: 3,
            },
          },
          discover: {
            niceType: "Discover",
            type: "discover",
            patterns: [6011, [644, 649], 65],
            gaps: [4, 8, 12],
            lengths: [16, 19],
            code: {
              name: "CID",
              size: 3,
            },
          },
          jcb: {
            niceType: "JCB",
            type: "jcb",
            patterns: [2131, 1800, [3528, 3589]],
            gaps: [4, 8, 12],
            lengths: [16, 17, 18, 19],
            code: {
              name: "CVV",
              size: 3,
            },
          },
          unionpay: {
            niceType: "UnionPay",
            type: "unionpay",
            patterns: [
              620,
              [624, 626],
              [62100, 62182],
              [62184, 62187],
              [62185, 62197],
              [62200, 62205],
              [622010, 622999],
              622018,
              [622019, 622999],
              [62207, 62209],
              [622126, 622925],
              [623, 626],
              6270,
              6272,
              6276,
              [627700, 627779],
              [627781, 627799],
              [6282, 6289],
              6291,
              6292,
              810,
              [8110, 8131],
              [8132, 8151],
              [8152, 8163],
              [8164, 8171],
            ],
            gaps: [4, 8, 12],
            lengths: [14, 15, 16, 17, 18, 19],
            code: {
              name: "CVN",
              size: 3,
            },
          },
          maestro: {
            niceType: "Maestro",
            type: "maestro",
            patterns: [
              493698,
              [500000, 504174],
              [504176, 506698],
              [506779, 508999],
              [56, 59],
              63,
              67,
              6,
            ],
            gaps: [4, 8, 12],
            lengths: [12, 13, 14, 15, 16, 17, 18, 19],
            code: {
              name: "CVC",
              size: 3,
            },
          },
          elo: {
            niceType: "Elo",
            type: "elo",
            patterns: [
              401178,
              401179,
              438935,
              457631,
              457632,
              431274,
              451416,
              457393,
              504175,
              [506699, 506778],
              [509000, 509999],
              627780,
              636297,
              636368,
              [650031, 650033],
              [650035, 650051],
              [650405, 650439],
              [650485, 650538],
              [650541, 650598],
              [650700, 650718],
              [650720, 650727],
              [650901, 650978],
              [651652, 651679],
              [655000, 655019],
              [655021, 655058],
            ],
            gaps: [4, 8, 12],
            lengths: [16],
            code: {
              name: "CVE",
              size: 3,
            },
          },
          mir: {
            niceType: "Mir",
            type: "mir",
            patterns: [[2200, 2204]],
            gaps: [4, 8, 12],
            lengths: [16, 17, 18, 19],
            code: {
              name: "CVP2",
              size: 3,
            },
          },
          hiper: {
            niceType: "Hiper",
            type: "hiper",
            patterns: [
              637095,
              63737423,
              63743358,
              637568,
              637599,
              637609,
              637612,
            ],
            gaps: [4, 8, 12],
            lengths: [16],
            code: {
              name: "CVC",
              size: 3,
            },
          },
          hipercard: {
            niceType: "Hipercard",
            type: "hipercard",
            patterns: [606282],
            gaps: [4, 8, 12],
            lengths: [16],
            code: {
              name: "CVC",
              size: 3,
            },
          },
        };
        module.exports = cardTypes;
      },
      {},
    ],
    4: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.clone = void 0;
        function clone(originalObject) {
          if (!originalObject) {
            return null;
          }
          return JSON.parse(JSON.stringify(originalObject));
        }
        exports.clone = clone;
      },
      {},
    ],
    5: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.findBestMatch = void 0;
        function hasEnoughResultsToDetermineBestMatch(results) {
          var numberOfResultsWithMaxStrengthProperty = results.filter(function (
            result
          ) {
            return result.matchStrength;
          }).length;
          /*
           * if all possible results have a maxStrength property that means the card
           * number is sufficiently long enough to determine conclusively what the card
           * type is
           * */
          return (
            numberOfResultsWithMaxStrengthProperty > 0 &&
            numberOfResultsWithMaxStrengthProperty === results.length
          );
        }
        function findBestMatch(results) {
          if (!hasEnoughResultsToDetermineBestMatch(results)) {
            return null;
          }
          return results.reduce(function (bestMatch, result) {
            if (!bestMatch) {
              return result;
            }
            /*
             * If the current best match pattern is less specific than this result, set
             * the result as the new best match
             * */
            if (
              Number(bestMatch.matchStrength) < Number(result.matchStrength)
            ) {
              return result;
            }
            return bestMatch;
          });
        }
        exports.findBestMatch = findBestMatch;
      },
      {},
    ],
    6: [
      function (require, module, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.isValidInputType = void 0;
        function isValidInputType(cardNumber) {
          return typeof cardNumber === "string" || cardNumber instanceof String;
        }
        exports.isValidInputType = isValidInputType;
      },
      {},
    ],
    7: [
      function (require, module, exports) {
        "use strict";
        /*
         * Adapted from https://github.com/polvo-labs/card-type/blob/aaab11f80fa1939bccc8f24905a06ae3cd864356/src/cardType.js#L37-L42
         * */
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.matches = void 0;
        function matchesRange(cardNumber, min, max) {
          var maxLengthToCheck = String(min).length;
          var substr = cardNumber.substr(0, maxLengthToCheck);
          var integerRepresentationOfCardNumber = parseInt(substr, 10);
          min = parseInt(String(min).substr(0, substr.length), 10);
          max = parseInt(String(max).substr(0, substr.length), 10);
          return (
            integerRepresentationOfCardNumber >= min &&
            integerRepresentationOfCardNumber <= max
          );
        }
        function matchesPattern(cardNumber, pattern) {
          pattern = String(pattern);
          return (
            pattern.substring(0, cardNumber.length) ===
            cardNumber.substring(0, pattern.length)
          );
        }
        function matches(cardNumber, pattern) {
          if (Array.isArray(pattern)) {
            return matchesRange(cardNumber, pattern[0], pattern[1]);
          }
          return matchesPattern(cardNumber, pattern);
        }
        exports.matches = matches;
      },
      {},
    ],
  },
  {},
  [1]
);

export declare const FieldType: {
    /** unknown type */
    readonly unknown: "unknown";
    /** string type */
    readonly string: "string";
    /** boolean type (true/false) */
    readonly boolean: "boolean";
    /** integer number type (1,2,99) */
    readonly integer: "integer";
    /** float number (with decimal) type */
    readonly float: "float";
    /** number includes Integer and Float */
    readonly number: "number";
    /** new Date(), javascript Date object */
    readonly date: "date";
    /** Format: 'YYYY-MM-DD' <=> 2001-02-28 */
    readonly dateIso: "dateIso";
    /** Format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' <=> 2001-02-28T14:00:00.123Z */
    readonly dateUtc: "dateUtc";
    /** new Date(), javacript Date Object with Time */
    readonly dateTime: "dateTime";
    /** Format: 'YYYY-MM-DD HH:mm:ss' <=> 2001-02-28 14:01:01 */
    readonly dateTimeIso: "dateTimeIso";
    /** Format: 'YYYY-MM-DD hh:mm:ss a' <=> 2001-02-28 11:01:01 pm */
    readonly dateTimeIsoAmPm: "dateTimeIsoAmPm";
    /** Format: 'YYYY-MM-DD hh:mm:ss A' <=> 2001-02-28 11:01:01 PM */
    readonly dateTimeIsoAM_PM: "dateTimeIsoAM_PM";
    /** Format: 'YYYY-MM-DD HH:mm' <=> 2001-02-28 14:01 */
    readonly dateTimeShortIso: "dateTimeShortIso";
    /** Format (Euro): 'DD/MM/YYYY' <=> 28/02/2001 */
    readonly dateEuro: "dateEuro";
    /** Format (Euro): 'D/M/YY' <=> 28/2/12 */
    readonly dateEuroShort: "dateEuroShort";
    /** Format (Euro): 'DD/MM/YYYY HH:mm' <=> 28/02/2001 13:01 */
    readonly dateTimeShortEuro: "dateTimeShortEuro";
    /** Format (Euro): 'DD/MM/YYYY HH:mm:ss' <=> 02/28/2001 13:01:01 */
    readonly dateTimeEuro: "dateTimeEuro";
    /** Format (Euro): 'DD/MM/YYYY hh:mm:ss a' <=> 28/02/2001 11:01:01 pm */
    readonly dateTimeEuroAmPm: "dateTimeEuroAmPm";
    /** Format (Euro): 'DD/MM/YYYY hh:mm:ss A' <=> 28/02/2001 11:01:01 PM */
    readonly dateTimeEuroAM_PM: "dateTimeEuroAM_PM";
    /** Format (Euro): 'D/M/YY H:m:s' <=> 28/2/14 14:1:2 */
    readonly dateTimeEuroShort: "dateTimeEuroShort";
    /** Format (Euro): 'D/M/YY h:m:s a' <=> 28/2/14 1:2:10 pm */
    readonly dateTimeEuroShortAmPm: "dateTimeEuroShortAmPm";
    /** Format (Euro): 'D/M/YY h:m:s A' <=> 28/2/14 14:1:1 PM */
    readonly dateTimeEuroShortAM_PM: "dateTimeEuroShortAM_PM";
    /** Format: 'MM/DD/YYYY' <=> 02/28/2001 */
    readonly dateUs: "dateUs";
    /** Format: 'M/D/YY' <=> 2/28/12 */
    readonly dateUsShort: "dateUsShort";
    /** Format: 'MM/DD/YYYY HH:mm' <=> 02/28/2001 13:01 */
    readonly dateTimeShortUs: "dateTimeShortUs";
    /** Format: 'MM/DD/YYYY HH:mm:ss' <=> 02/28/2001 13:01:01 */
    readonly dateTimeUs: "dateTimeUs";
    /** Format: 'MM/DD/YYYY hh:mm:ss a' <=> 02/28/2001 11:01:01 pm */
    readonly dateTimeUsAmPm: "dateTimeUsAmPm";
    /** Format: 'MM/DD/YYYY hh:mm:ss A' <=> 02/28/2001 11:01:01 PM */
    readonly dateTimeUsAM_PM: "dateTimeUsAM_PM";
    /** Format: 'M/D/YY H:m:s' <=> 2/28/14 14:1:2 */
    readonly dateTimeUsShort: "dateTimeUsShort";
    /** Format: 'M/D/YY h:m:s a' <=> 2/28/14 1:2:10 pm */
    readonly dateTimeUsShortAmPm: "dateTimeUsShortAmPm";
    /** Format: 'M/D/YY h:m:s A' <=> 2/28/14 14:1:1 PM */
    readonly dateTimeUsShortAM_PM: "dateTimeUsShortAM_PM";
    /** complex object with various properties */
    readonly object: "object";
    /** password text string */
    readonly password: "password";
    /** alias to string */
    readonly text: "text";
    /** readonly text string */
    readonly readonly: "readonly";
};
//# sourceMappingURL=fieldType.enum.d.ts.map
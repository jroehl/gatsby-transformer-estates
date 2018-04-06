const moment = require('moment');

/**
 * Sanitize the date and return epoch time
 * @param {string|number} date
 * @returns {number}
 */
const sanitizeDate = (date) => {
  if (!Number.isNaN(date)) return date;
  return moment(date).valueOf();
};

/**
 * Sanitize the state of the estate
 *
 * @param {string|boolean} [realEstateState='']
 * @returns {boolean}
 */
const getState = (realEstateState = '') => {
  const isBool = typeof realEstateState === 'boolean';
  if (
    (isBool && realEstateState === false) ||
    (!isBool && realEstateState.match(/(INACTIVE|ARCHIVED|TO_BE_DELETED)/i))
  ) {
    return false;
  } else if (
    (isBool && realEstateState === true) ||
    (!isBool && realEstateState.match(/ACTIVE/i))
  ) {
    return true;
  }
  return undefined;
};

/**
 * The dimensions object
 * @typedef {Object} Dimensions
 * @property {number} width
 * @property {number} height
 */

/**
 * Replace the width and height placeholders of the attachments
 * @param {array} attachments
 * @param {Dimensions} maxDimensions
 * @returns {array}
 */
const sanitizeAttachments = (attachments, maxDimensions) => {
  if (!attachments) return undefined;
  const attachmentArray = Array.isArray(attachments) ? attachments : [attachments];
  const { width, height } = maxDimensions;
  return attachmentArray.map((attachment) => {
    const [urls] = attachment.urls || [];
    if (!urls) return attachment;
    return {
      ...attachment,
      urls: urls.url.map(({ href, ...rest }) => ({
        ...rest,
        href: href.replace('%WIDTH%', width).replace('%HEIGHT%', height),
      })),
    };
  });
};

/**
 * Sanitize the estate details (rename, update, remove keys)
 * @param {object} estate
 * @param {object} fields
 * @param {Dimensions} maxDimensions
 * @returns {object}
 */
const sanitizeDetails = (estate, fields, maxDimensions) => {
  let price;
  if (estate.price) {
    price = {
      marketingType: estate.price.marketingType,
      value: estate.price.value,
      currency: estate.price.currency,
      priceIntervalType: estate.price.priceIntervalType,
    };
  } else {
    price = {
      marketingType: 'RENT',
      value: estate.totalRent,
      currency: 'EUR',
    };
  }
  return {
    title: estate.title,
    id: estate.id,
    internalId: estate.externalId,
    estateType: estate['xsi.type'],
    tradeType:
      estate.apartmentType || estate.buildingType || estate.estateType || estate.investmentType,
    createdAt: sanitizeDate(estate.creationDate || estate.creation),
    updatedAt: sanitizeDate(estate.lastModificationDate || estate.modified || estate.modification),
    address: estate.address
      ? {
        country: estate.address.country,
        street: estate.address.street,
        houseNumber: estate.address.houseNumber,
        city: estate.address.city,
        postcode: estate.address.postcode,
        coordinates: estate.address.wgs84Coordinate
          ? {
            latitude: estate.address.wgs84Coordinate.latitude,
            longitude: estate.address.wgs84Coordinate.longitude,
          }
          : undefined,
      }
      : undefined,
    active: getState(estate.realEstateState),
    handicappedAccessible: estate.handicappedAccessible || estate.assistedLiving,
    heatingTypeEnev2014: estate.heatingTypeEnev2014 || estate.heatingType,
    minDivisible: estate.minDivisible || estate.areaDivisibleFrom,
    numberOfRoomsFrom: estate.numberOfRoomsFrom || estate.roomAvailableFrom,
    numberOfRoomsTo: estate.numberOfRoomsTo || estate.numberOfRoomsTo,
    energySourcesEnev2014: estate.energySourcesEnev2014
      ? estate.energySourcesEnev2014.energySourceEnev2014
      : undefined,
    energyCertificateAvailability: estate.energyCertificate
      ? estate.energyCertificate.energyCertificateAvailability
      : undefined,
    energyCertificateCreationDate: estate.energyCertificate
      ? estate.energyCertificate.energyCertificateCreationDate
      : undefined,
    attachments: sanitizeAttachments(estate.attachments, maxDimensions),
    price,
    ...fields.reduce((obj, field) => {
      if (estate[field] === undefined) return obj;
      return { ...obj, [field]: estate[field] };
    }, {}),
  };
};

module.exports = { sanitizeDetails };

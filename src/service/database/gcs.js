/**
 * @typedef {Object} Sector
 * @property {string} id - Sector identifier (e.g., "orange", "blue", "green", "white", "yellow")
 * @property {string} name - Sector display name
 */

/**
 * @typedef {Object} ColorConfig
 * @property {string} primary - Primary color in hex format
 */

/**
 * @typedef {Object} LogoCardDimensions
 * @property {number} width - Card logo width in pixels
 * @property {number} height - Card logo height in pixels
 */

/**
 * @typedef {Object} LogoSingleDimensions
 * @property {number} width - Single logo width in pixels
 * @property {number} height - Single logo height in pixels
 */

/**
 * @typedef {Object} LogoConfig
 * @property {string} alias - Logo alias name
 * @property {boolean} full_replace - Whether to fully replace the logo
 * @property {LogoCardDimensions} [card] - Card logo dimensions
 * @property {LogoSingleDimensions} [single] - Single logo dimensions
 */

/**
 * @typedef {Object} Config
 * @property {ColorConfig} color - Color configuration
 * @property {LogoConfig} [logo] - Logo configuration
 */

/**
 * @typedef {Object} FakeCoordinates
 * @property {number} lat - Fake latitude coordinate
 * @property {number} lng - Fake longitude coordinate
 */

/**
 * @typedef {Object} Address
 * @property {string} text - Full address text
 * @property {number} street_number - Street number
 * @property {string} complement - Address complement (e.g., apartment number)
 * @property {number} lat - Latitude coordinate
 * @property {number} lng - Longitude coordinate
 * @property {FakeCoordinates} fake - Fake coordinates for privacy
 */

/**
 * @typedef {Object} Contact
 * @property {string} name - Contact person name
 * @property {string} phone - Contact phone number
 */

/**
 * @typedef {Object} Schedule
 * @property {number} day_index - Day index (0-6, where 0 is Sunday)
 * @property {string} weekday - Weekday name in Portuguese
 * @property {string} hour - Meeting time in HH:MM format
 */

/**
 * @typedef {Object} Link
 * @property {string} label - Link label/name
 * @property {string} url - Link URL
 * @property {string} icon - Icon class name
 */

/**
 * @typedef {Object} GC
 * @property {string} id - Unique GC identifier
 * @property {string} sheet_id - Google Sheets ID of members
 * @property {string} name - GC display name
 * @property {Sector} sector - Sector information
 * @property {Config} config - Configuration settings
 * @property {Address} address - Address information
 * @property {Contact[]} contacts - Array of contact persons
 * @property {Schedule[]} schedules - Array of meeting schedules
 * @property {Link[]} links - Array of social/external links
 * @property {string[]} images - Array of image filenames
 * @property {string[]} description - Array of description paragraphs
 */

/**
 * @typedef {Object.<string, GC>} GCsDatabase
 * Database object where keys are GC IDs and values are GC objects
 */

import gcsDB from '@/assets/gcs.json'

/**
 * Get all GCs from the database
 * @returns {GCsDatabase} All GCs data
 */
function all(){
  return gcsDB
}

/**
 * Check if a GC exists in the database
 * @param {string} gcId - The GC identifier
 * @returns {boolean} True if the GC exists
 */
function exists(gcId){
  return gcId in gcsDB
}

/**
 * Fetch a specific GC by ID
 * @param {string} gcId - The GC identifier
 * @returns {GC|undefined} The GC object or undefined if not found
 */
function find(gcId){
  return gcsDB?.[gcId]
}

const db = {
  all,
  find,
  exists,
}

export default db
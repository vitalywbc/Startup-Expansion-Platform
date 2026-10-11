// Cents to the price form the site shows: no decimals on whole euros, two otherwise.
export const euros = (cents) => '€' + (cents % 100 === 0 ? cents / 100 : (cents / 100).toFixed(2))

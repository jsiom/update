
/**
 * Hydro configuration
 *
 * @param {Hydro} hydro
 */

module.exports = function(hydro) {
  hydro.set({
    suite: 'update',
    timeout: 500,
    plugins: [
      require('hydro-bdd')
    ],
    globals: {
      assert: require('assert/')
    }
  })
}

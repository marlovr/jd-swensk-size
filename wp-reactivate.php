<?php
/**
 * Swensk Size Map
 *
 *
 * @package   Swensk Size Map
 * @author    Marlo Vinall Richardson
 * @link      https://janedoe.co
 *
 * @wordpress-plugin
 * Plugin Name:       Swensk Size Map
 * Plugin URI:        https://janedoe.co
 * Description:       Interactive size mapping
 * Version:           1.0.0
 * Author:            Marlo Vinall Richardson
 * Author URI:        https://janedoe.co
 * Text Domain:       swensk-size-map
 * Domain Path:       /languages
 */


namespace Pangolin\WPR;

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

define( 'WP_REACTIVATE_VERSION', '1.0.2' );


/**
 * Autoloader
 *
 * @param string $class The fully-qualified class name.
 * @return void
 *
 *  * @since 1.0.0
 */
spl_autoload_register(function ($class) {

    // project-specific namespace prefix
    $prefix = __NAMESPACE__;

    // base directory for the namespace prefix
    $base_dir = __DIR__ . '/includes/';

    // does the class use the namespace prefix?
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        // no, move to the next registered autoloader
        return;
    }

    // get the relative class name
    $relative_class = substr($class, $len);

    // replace the namespace prefix with the base directory, replace namespace
    // separators with directory separators in the relative class name, append
    // with .php
    $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

    // if the file exists, require it
    if (file_exists($file)) {
        require $file;
    }
});

/**
 * Initialize Plugin
 *
 * @since 1.0.0
 */
function init() {
	$wpr = Plugin::get_instance();
	$wpr_shortcode = Shortcode::get_instance();
	$wpr_admin = Admin::get_instance();
    $wpr_rest_sizes = Endpoint\Sizes::get_instance();
    $wpr_rest_mapping = Endpoint\Mapping::get_instance();
}
add_action( 'plugins_loaded', 'Pangolin\\WPR\\init' );



/**
 * Register the widget
 *
 * @since 1.0.0
 */
function widget_init() {
	return register_widget( new Widget );
}
add_action( 'widgets_init', 'Pangolin\\WPR\\widget_init' );

/**
 * Register activation and deactivation hooks
 */
register_activation_hook( __FILE__, array( 'Pangolin\\WPR\\Plugin', 'activate' ) );
register_deactivation_hook( __FILE__, array( 'Pangolin\\WPR\\Plugin', 'deactivate' ) );


<?php
/**
 * WP-Reactivate
 *
 *
 * @package   Swensk Size Map
 * @author    Marlo Vinall Richardson
 * @link      https://janedoe.co
 */

namespace Pangolin\WPR;

/**
 * @subpackage Plugin
 */
class Plugin
{

    /**
     * The variable name is used as the text domain when internationalizing strings
     * of text. Its value should match the Text Domain file header in the main
     * plugin file.
     *
     * @since    1.0.0
     *
     * @var      string
     */
    protected $plugin_slug = 'swensk-size-map';

    /**
     * Instance of this class.
     *
     * @since    1.0.0
     *
     * @var      object
     */
    protected static $instance = null;

    /**
     * Setup instance attributes
     *
     * @since     1.0.0
     */
    private function __construct()
    {
        $this->plugin_version = WP_REACTIVATE_VERSION;
    }

    /**
     * Return the plugin slug.
     *
     * @since    1.0.0
     *
     * @return    Plugin slug variable.
     */
    public function get_plugin_slug()
    {
        return $this->plugin_slug;
    }

    /**
     * Return the plugin version.
     *
     * @since    1.0.0
     *
     * @return    Plugin slug variable.
     */
    public function get_plugin_version()
    {
        return $this->plugin_version;
    }

    /**
     * Fired when the plugin is activated.
     *
     * @since    1.0.0
     */
    public static function activate()
    {
      global $wpdb;
      add_option('wpr_example_setting');

      $table_name = $wpdb->prefix . "swensk_size_map";

			// Create table, if it doesn't already exist.
      if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
        $sql = "CREATE TABLE $table_name (
					id INT AUTO_INCREMENT PRIMARY KEY,
					size VARCHAR(3) NOT NULL,
					size_fit ENUM('--', '-', 'true', '+', '++') NOT NULL,
					size_category VARCHAR(4) NOT NULL,
					size_category_size_ref VARCHAR(4) NOT NULL,
          size_umbrella VARCHAR(16) NOT NULL,
					UNIQUE KEY id (id)
				);";

				// Import wordpress upgrade file which includes methods for creating new tables
				require_once ABSPATH . 'wp-admin/includes/upgrade.php';
				// will create the new table through wordpress instead
        dbDelta($sql);
      }
    }

    /**
     * Fired when the plugin is deactivated.
     *
     * @since    1.0.0
     */
    public static function deactivate()
    {
    }

    /**
     * Return an instance of this class.
     *
     * @since     1.0.0
     *
     * @return    object    A single instance of this class.
     */
    public static function get_instance()
    {

        // If the single instance hasn't been set, set it now.
        if (null == self::$instance) {
            self::$instance = new self;
        }

        return self::$instance;
    }
}

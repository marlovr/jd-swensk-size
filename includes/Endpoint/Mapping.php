<?php

namespace Pangolin\WPR\Endpoint;
use Pangolin\WPR;

/**
 * @subpackage REST_Controller
 */
class Mapping {
    /**
	 * Instance of this class.
	 *
	 * @since    0.8.1
	 *
	 * @var      object
	 */
    protected static $instance = null;
    
    /**
     * 
     */
    private $table_name = '';

	/**
	 * Initialize the plugin by setting localization and loading public scripts
	 * and styles.
	 *
	 * @since     0.8.1
	 */
	private function __construct() {
        global $wpdb;
        $plugin = WPR\Plugin::get_instance();
        $this->plugin_slug = $plugin->get_plugin_slug();
        $this->table_name = $wpdb->prefix . "swensk_size_map";
	}

    /**
     * Set up WordPress hooks and filters
     *
     * @return void
     */
    public function do_hooks() {
        add_action( 'rest_api_init', array( $this, 'register_routes' ) );
    }

	/**
	 * Return an instance of this class.
	 *
	 * @since     0.8.1
	 *
	 * @return    object    A single instance of this class.
	 */
	public static function get_instance() {

		// If the single instance hasn't been set, set it now.
		if ( null == self::$instance ) {
			self::$instance = new self;
			self::$instance->do_hooks();
		}

		return self::$instance;
	}

    /**
     * Register the routes for the objects of the controller.
     */
    public function register_routes() {
        $version = '1';
        $namespace = $this->plugin_slug . '/v' . $version;
        $endpoint = '/mapping/';

        register_rest_route( $namespace, $endpoint, array(
            array(
                'methods'               => \WP_REST_Server::CREATABLE,
                'callback'              => array( $this, 'save_mapping' ),
                'permission_callback'   => array( $this, 'example_permissions_check' ),
                'args'                  => array(),
            ),
        ) );

        register_rest_route( $namespace, $endpoint, array(
            array(
                'methods'               => \WP_REST_Server::READABLE,
                'callback'              => array( $this, 'get_mapping' ),
                'permission_callback'   => array( $this, 'example_permissions_check' ),
                'args'                  => array(),
            ),
        ) );
    }

    /**
     * TODO DESCRIBE
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|WP_REST_Request
     */
    public function save_mapping( $request ) {
      global $wpdb;
      $table_name = $this->table_name;

      $delete = $wpdb->query("TRUNCATE TABLE $table_name");
      foreach($request->get_params() as $row) {
        $result = $wpdb->insert($table_name , $row);

        if (!$result) {
            return new \WP_REST_Response( array(
                'error' => $wpdb->last_error
            ), 500);
        }
      }

      return new \WP_REST_Response( array(
        'success' => true
    ), 200 );
    }

    /**
     * TODO DESCRIBE
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|WP_REST_Request
     */
    public function get_mapping( $request ) {
        global $wpdb;
        $table_name = $this->table_name;
        // GET THE STUFF BACK OUT
        $category = $request->get_param('category');
        $result = $wpdb->get_results("SELECT * FROM $table_name WHERE size_category LIKE '$category%'");
        return new \WP_REST_Response( array(
            'success' => true,
            'mapping' => $result
        ), 200 );
    }

     /**
     * Check if a given request has access to update a setting
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|bool
     */
    public function example_permissions_check( $request ) {
      return current_user_can( 'manage_options' );
  }
}


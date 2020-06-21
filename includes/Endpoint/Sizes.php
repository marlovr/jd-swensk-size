<?php

namespace Pangolin\WPR\Endpoint;
use Pangolin\WPR;

/**
 * @subpackage REST_Controller
 */
class Sizes {
    /**
	 * Instance of this class.
	 *
	 * @since    0.8.1
	 *
	 * @var      object
	 */
	protected static $instance = null;

	/**
	 * Initialize the plugin by setting localization and loading public scripts
	 * and styles.
	 *
	 * @since     0.8.1
	 */
	private function __construct() {
        $plugin = WPR\Plugin::get_instance();
		$this->plugin_slug = $plugin->get_plugin_slug();
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
        $endpoint = '/sizes/';

        register_rest_route( $namespace, $endpoint, array(
            array(
                'methods'               => \WP_REST_Server::READABLE,
                'callback'              => array( $this, 'get_sizes' ),
                'permission_callback'   => array( $this, 'example_permissions_check' ),
                'args'                  => array(),
            ),
        ) );
    }

    /**
     * Get Example
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|WP_REST_Request
    i */
    public function get_sizes( $request ) {
      global $wpdb;

      // Default query arguments
      $args                = array('post_type' => array('product'));
      $args['post_status'] = 'publish';
      $args['swensk_all']  = true;
  
      // Get _all_ possible results
      $args['posts_per_page'] = -1;
  

      // For these categories
      $taxonomies = $request->get_param('taxonomies');
      $taxonomies = explode(',', $taxonomies);

      $debug = array();
      $debug[] = $taxonomies;

      $args['tax_query'][] = getNewTaxQuery($taxonomies);
  
  
      $query = new \WP_Query($args);
      $result = jd_get_all_possible_sizes($query);

      // return $query;
      return new \WP_REST_Response( array(
        'success' => true,
        'sizes' => $result,
        'debug' => $debug
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

function jd_get_all_possible_sizes($query)
{
    global $wpdb;

    $products = array();

    // If the query finds posts
    if ($query->have_posts()) {
        // While we have posts
        while ($query->have_posts()): $query->the_post();
            // Get the ID of the product in the current index
            $product = wc_get_product(get_the_ID());
            // Add the product ID to the array $products
            $products[] = $product;
        endwhile;
    }

    // Empty result
    $result = array();

    // This first loop iterates through the products
    // It tooks for the values of product title and product sizes
    foreach ($products as $product) {
        // For all the products, known at each index as $product
        // i.e. the object is $products, the items within it are each called/referred to as $product
        $title = $product->get_title();
        // Get the product title
        $sizes = $product->get_attribute('size');

       // This removes the '|' from between the sizes
       $size_values = explode(' | ', $sizes);

       // This loop takes the split $sizes array
       // and adds a key to the result of each size.
       // This is how we remove duplication.
       foreach ($size_values as $size) {
           $result[] = $size;
       }

    }

    return $result;
}

function getNewTaxQuery($terms, $taxonomy = 'product_cat', $field = 'id', $operator = 'IN')
{
    $tax_query = array(
        'taxonomy' => $taxonomy,
        'field'    => $field,
        'terms'    => $terms,
        'operator' => $operator,
    );

    return $tax_query;
}


<?php
/**
 * @package SlPlugin
 */
namespace Inc;

final class Init {

    public static function get_services() {
        return [
            Base\Enqueue::class,
            Base\SettingsLink::class,
            Base\VehiculeCpt::class,

            Pages\Admin::class
        ];
    }

    public static function register_services() {
        foreach ( self::get_services() as $class ) {
            $service = new $class();
            if( method_exists( $service, 'register' ) ) {
                $service->register();
            }
        }
    }
}


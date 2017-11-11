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

            Base\Vcl\VehiculeCpt::class,
            Base\Vcl\VehiculeCmb::class,

            Base\Vcl\ReservationCpt::class,
            Base\Vcl\ReservationCmb::class,
            Base\Vcl\ReservationHandler::class,

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


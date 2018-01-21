<?php
/**
 * @package SlPlugin
 */
namespace Inc;

final class Init {

    public static function get_services() {
        return [

            Pages\Dashboard::class,

            Base\Enqueue::class,
            Base\SettingsLink::class,

            Base\Vcl\VehiculeCpt::class,
            Base\Vcl\VehiculeCmb::class,

            Base\Vcl\ReservationCpt::class,
            Base\Vcl\ReservationCmb::class,
            Base\Vcl\ReservationHandler::class,

            Base\AuthController::class,
            Base\ChatController::class,
            Base\CptController::class,
            Base\GalleryController::class,
            Base\MembershipController::class,
            Base\TaxonomyController::class,
            Base\TemplatesController::class,
            Base\TestimonialController::class,
            Base\WidgetController::class
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


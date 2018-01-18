<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitbabe785c03325f4694bdfc08180ec6cc
{
    public static $prefixLengthsPsr4 = array (
        'I' => 
        array (
            'Inc\\' => 4,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Inc\\' => 
        array (
            0 => __DIR__ . '/../..' . '/inc',
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitbabe785c03325f4694bdfc08180ec6cc::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitbabe785c03325f4694bdfc08180ec6cc::$prefixDirsPsr4;

        }, null, ClassLoader::class);
    }
}
